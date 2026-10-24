import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '@/lib/db';
import { redisSessionClient } from '@/lib/redis';
import { hashPassword } from '@/lib/auth/password';
import { authenticateWithPassword } from '@/lib/auth/service';
import { createSession, validateSession, destroySession } from '@/lib/auth/session';
import {
  consumeRateLimit,
  checkRateLimit,
  resetRateLimit,
  buildRateLimitScopeKey,
  RATE_LIMIT_LOGIN_MAX_ATTEMPTS,
  RATE_LIMIT_LOGIN_WINDOW_MS,
  RATE_LIMIT_LOCKOUT_DURATION_MS,
} from '@/lib/auth/rate-limiter';
import { isPortReachable } from './helpers';

const isPgReachable = await isPortReachable(5432);
const isValkeyReachable = await isPortReachable(6379);
const canRunIntegration = isPgReachable && isValkeyReachable;

describe.runIf(canRunIntegration)(
  'TASK-012 Integration Tests: Valkey Sliding-Window Rate Limiting & Account Lockout',
  () => {
    const testEmail = 'task012.lockout@spplpf.internal';
    const testPassword = 'SecureLockoutPass2026!';
    let testUserId: string;

    const cleanupKeys: string[] = [];

    beforeAll(async () => {
      // Clean up previous test user if lingering
      await prisma.user.deleteMany({
        where: { email: testEmail },
      });

      const passwordHash = await hashPassword(testPassword);
      const user = await prisma.user.create({
        data: {
          email: testEmail,
          fullName: 'TASK-012 Rate Limiter Test User',
          passwordHash,
          isActive: true,
          failedAttempts: 0,
          lockedUntil: null,
          mfaEnabled: false,
        },
      });

      testUserId = user.id;
    });

    afterAll(async () => {
      if (testUserId) {
        await prisma.user.deleteMany({
          where: { id: testUserId },
        });
      }
      for (const k of cleanupKeys) {
        await redisSessionClient.del(k);
      }
      await prisma.$disconnect();
      redisSessionClient.disconnect();
    });

    it('enforces atomic 5-attempt sliding window in live Valkey datastore', async () => {
      const scopeKey = `rl:test:seq_${Date.now()}`;
      cleanupKeys.push(scopeKey);

      // Attempts 1 to 5: must be allowed with decreasing remaining count
      for (let i = 1; i <= 5; i++) {
        const result = await consumeRateLimit(scopeKey, { limit: 5 });
        expect(result.allowed).toBe(true);
        expect(result.remaining).toBe(5 - i);
        expect(result.totalAttempts).toBe(i);
        expect(result.retryAfterSeconds).toBe(0);
      }

      // Attempt 6: must be rejected
      const rejected = await consumeRateLimit(scopeKey, { limit: 5 });
      expect(rejected.allowed).toBe(false);
      expect(rejected.remaining).toBe(0);
      expect(rejected.totalAttempts).toBe(5);
      expect(rejected.retryAfterSeconds).toBeGreaterThan(0);
      expect(rejected.retryAfterSeconds).toBeLessThanOrEqual(Math.ceil(RATE_LIMIT_LOGIN_WINDOW_MS / 1000));
    });

    it('sets bounded TTL on Valkey rate-limit keys', async () => {
      const scopeKey = `rl:test:ttl_${Date.now()}`;
      cleanupKeys.push(scopeKey);

      await consumeRateLimit(scopeKey, { limit: 5 });

      const ttl = await redisSessionClient.ttl(scopeKey);
      expect(ttl).toBeGreaterThan(0);
      // TTL should be around window (900s) + 60s buffer = 960s
      expect(ttl).toBeLessThanOrEqual(960);
    });

    it('handles 10 concurrent requests atomically without limit bypass', async () => {
      const burstKey = `rl:test:burst_${Date.now()}`;
      cleanupKeys.push(burstKey);

      // Launch 10 simultaneous requests to the same bucket
      const promises = Array.from({ length: 10 }, () =>
        consumeRateLimit(burstKey, { limit: 5 })
      );

      const results = await Promise.all(promises);

      const allowedCount = results.filter((r) => r.allowed).length;
      const rejectedCount = results.filter((r) => !r.allowed).length;

      // Atomic Lua script must guarantee exactly 5 allowed and 5 rejected
      expect(allowedCount).toBe(5);
      expect(rejectedCount).toBe(5);
    });

    it('maintains independent rate limit buckets for different accounts and IPs', async () => {
      const accountAKey = buildRateLimitScopeKey('login_account', { email: 'acct_a@spplpf.internal' });
      const accountBKey = buildRateLimitScopeKey('login_account', { email: 'acct_b@spplpf.internal' });
      const ipKey = buildRateLimitScopeKey('login_ip', { ip: '198.51.100.25' });

      cleanupKeys.push(accountAKey, accountBKey, ipKey);

      // Exhaust Account A
      for (let i = 0; i < 5; i++) {
        await consumeRateLimit(accountAKey, { limit: 5 });
      }

      const accountACheck = await checkRateLimit(accountAKey, { limit: 5 });
      expect(accountACheck.allowed).toBe(false);

      // Account B must remain fresh and unaffected
      const accountBCheck = await consumeRateLimit(accountBKey, { limit: 5 });
      expect(accountBCheck.allowed).toBe(true);
      expect(accountBCheck.remaining).toBe(4);

      // IP bucket must remain independent
      const ipCheck = await consumeRateLimit(ipKey, { limit: 20 });
      expect(ipCheck.allowed).toBe(true);
      expect(ipCheck.remaining).toBe(19);
    });

    it('resets rate limit window when simulated time advances past windowMs', async () => {
      const expireKey = `rl:test:expire_${Date.now()}`;
      cleanupKeys.push(expireKey);

      let virtualNow = 1770000000000;
      const timeProvider = () => virtualNow;

      // Exhaust bucket at time T
      for (let i = 0; i < 5; i++) {
        await consumeRateLimit(expireKey, { limit: 5, timeProvider });
      }

      const blockedAtT = await consumeRateLimit(expireKey, { limit: 5, timeProvider });
      expect(blockedAtT.allowed).toBe(false);

      // Advance clock past 15-minute sliding window (15m + 1s)
      virtualNow += RATE_LIMIT_LOGIN_WINDOW_MS + 1000;

      const allowedAtTPlusWindow = await consumeRateLimit(expireKey, { limit: 5, timeProvider });
      expect(allowedAtTPlusWindow.allowed).toBe(true);
      expect(allowedAtTPlusWindow.remaining).toBe(4);
    });

    it('escalates 5 failed login attempts to a 30-minute account lockout in PostgreSQL', async () => {
      const accountKey = buildRateLimitScopeKey('login_account', { email: testEmail });
      cleanupKeys.push(accountKey);
      await resetRateLimit(accountKey);

      // Reset test user counters
      await prisma.user.update({
        where: { id: testUserId },
        data: { failedAttempts: 0, lockedUntil: null },
      });

      // 4 incorrect attempts: each returns INVALID_CREDENTIALS
      for (let i = 1; i <= 4; i++) {
        const res = await authenticateWithPassword(testEmail, 'IncorrectPassword!', {
          skipRateLimit: true, // test direct DB lockout escalation
        });
        expect(res.success).toBe(false);
        if (!res.success) {
          expect(res.reason).toBe('INVALID_CREDENTIALS');
        }

        const userRecord = await prisma.user.findUnique({ where: { id: testUserId } });
        expect(userRecord?.failedAttempts).toBe(i);
        expect(userRecord?.lockedUntil).toBeNull();
      }

      // 5th incorrect attempt: triggers lockout
      const res5 = await authenticateWithPassword(testEmail, 'IncorrectPassword!', {
        skipRateLimit: true,
      });

      expect(res5.success).toBe(false);
      if (!res5.success) {
        expect(res5.reason).toBe('ACCOUNT_LOCKED');
        expect(res5.lockedUntil).toBeDefined();
        expect(new Date(res5.lockedUntil!).getTime()).toBeGreaterThan(Date.now());
      }

      const lockedRecord = await prisma.user.findUnique({ where: { id: testUserId } });
      expect(lockedRecord?.lockedUntil).not.toBeNull();
      expect(lockedRecord?.failedAttempts).toBe(0); // reset after lock applied
    });

    it('resets failed-attempt state after unlocking and successful authentication, then creates valid session', async () => {
      // Set user as expired lock (lockout ended 1 second ago)
      await prisma.user.update({
        where: { id: testUserId },
        data: {
          failedAttempts: 5,
          lockedUntil: new Date(Date.now() - 1000),
        },
      });

      // Successful login with correct password
      const authResult = await authenticateWithPassword(testEmail, testPassword);

      expect(authResult.success).toBe(true);
      if (authResult.success) {
        expect(authResult.user.id).toBe(testUserId);
        expect(authResult.user.email).toBe(testEmail);
      }

      // Database failedAttempts and lockedUntil must be reset
      const refreshedUser = await prisma.user.findUnique({ where: { id: testUserId } });
      expect(refreshedUser?.failedAttempts).toBe(0);
      expect(refreshedUser?.lockedUntil).toBeNull();
      expect(refreshedUser?.lastLoginAt).not.toBeNull();

      // Session creation still succeeds cleanly after successful authentication
      const { cookie } = await createSession(testUserId);
      expect(cookie.name).toBe('spplpf_session');
      expect(cookie.httpOnly).toBe(true);

      const sessionValidation = await validateSession(cookie.value);
      expect(sessionValidation.valid).toBe(true);
      if (sessionValidation.valid) {
        expect(sessionValidation.user.id).toBe(testUserId);
      }

      await destroySession(cookie.value);
    });
  }
);
