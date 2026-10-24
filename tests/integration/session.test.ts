import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { prisma } from '@/lib/db';
import { redisSessionClient } from '@/lib/redis';
import { hashPassword } from '@/lib/auth/password';
import {
  createSession,
  validateSession,
  rotateSession,
  destroySession,
  hashSessionToken,
  SESSION_REDIS_PREFIX,
  SESSION_IDLE_TIMEOUT_MS,
  SESSION_ABSOLUTE_LIFETIME_MS,
} from '@/lib/auth/session';
import { isPortReachable } from './helpers';

const isPgReachable = await isPortReachable(5432);
const isValkeyReachable = await isPortReachable(6379);
const canRunIntegration = isPgReachable && isValkeyReachable;

describe.runIf(canRunIntegration)('TASK-011 Integration Tests: Session Lifecycle & Valkey Persistence', () => {
  const testEmail = 'task011.sessionuser@spplpf.internal';
  const testPassword = 'SessionTestPass2026!';
  let testUserId: string;

  // Deterministic virtual clock to prevent sleep-based test flakiness
  let simulatedTime = 1770000000000;
  const timeProvider = () => simulatedTime;

  beforeAll(async () => {
    // Clean up test user if previously lingering
    await prisma.user.deleteMany({
      where: { email: testEmail },
    });

    const passwordHash = await hashPassword(testPassword);
    const user = await prisma.user.create({
      data: {
        email: testEmail,
        fullName: 'TASK-011 Session Test User',
        passwordHash,
        isActive: true,
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
    await prisma.$disconnect();
    redisSessionClient.disconnect();
  });

  beforeEach(() => {
    // Reset clock baseline for each test
    simulatedTime = 1770000000000;
  });

  it('creates an active session in Valkey with one-way SHA-256 verifier hash', async () => {
    const { cookie, rawToken } = await createSession(testUserId, timeProvider);

    expect(cookie.name).toBe('spplpf_session');
    expect(cookie.httpOnly).toBe(true);
    expect(cookie.sameSite).toBe('strict');
    expect(cookie.path).toBe('/');
    expect(cookie.value).toContain('.');

    // Verify rawToken is NOT in cookie name or plain storage
    const tokenHash = hashSessionToken(rawToken);
    const redisKey = `${SESSION_REDIS_PREFIX}${tokenHash}`;

    // Valkey must store only the hash, not the raw token
    const storedJson = await redisSessionClient.get(redisKey);
    expect(storedJson).not.toBeNull();

    const record = JSON.parse(storedJson!);
    expect(record.userId).toBe(testUserId);
    expect(record.createdAt).toBe(simulatedTime);
    expect(record.lastActiveAt).toBe(simulatedTime);

    // Verify raw token is NOT stored anywhere in the serialized payload
    expect(storedJson).not.toContain(rawToken);

    // Clean up
    await destroySession(cookie.value);
  });

  it('validates a live session and resolves the authenticated user', async () => {
    const { cookie } = await createSession(testUserId, timeProvider);

    const result = await validateSession(cookie.value, timeProvider);
    expect(result.valid).toBe(true);

    if (result.valid) {
      expect(result.user.id).toBe(testUserId);
      expect(result.user.email).toBe(testEmail);
      expect(result.user.fullName).toBe('TASK-011 Session Test User');
      expect(result.user.isActive).toBe(true);
      // Verify passwordHash is never leaked
      // @ts-expect-error - testing sensitive property exclusion
      expect(result.user.passwordHash).toBeUndefined();
    }

    await destroySession(cookie.value);
  });

  it('rejects an idle-expired session and removes its record from Valkey', async () => {
    const { cookie, rawToken } = await createSession(testUserId, timeProvider);
    const tokenHash = hashSessionToken(rawToken);
    const redisKey = `${SESSION_REDIS_PREFIX}${tokenHash}`;

    // Advance virtual clock past 30-minute idle threshold (30m + 5s)
    simulatedTime += SESSION_IDLE_TIMEOUT_MS + 5000;

    const result = await validateSession(cookie.value, timeProvider);
    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.reason).toBe('IDLE_TIMEOUT');
      expect(result.clearCookie.maxAge).toBe(0);
    }

    // Must be purged from Valkey
    const exists = await redisSessionClient.get(redisKey);
    expect(exists).toBeNull();
  });

  it('rejects an absolute-expired session even if activity occurs within idle window', async () => {
    const { cookie, rawToken } = await createSession(testUserId, timeProvider);
    const tokenHash = hashSessionToken(rawToken);
    const redisKey = `${SESSION_REDIS_PREFIX}${tokenHash}`;

    // Simulate steady activity every 20 minutes (never idle > 30m)
    // 20 minutes in:
    simulatedTime += 20 * 60 * 1000;
    const v1 = await validateSession(cookie.value, timeProvider);
    expect(v1.valid).toBe(true);

    // Advance clock past the 8-hour absolute maximum (8h + 1s from creation)
    simulatedTime = 1770000000000 + SESSION_ABSOLUTE_LIFETIME_MS + 1000;

    const v2 = await validateSession(cookie.value, timeProvider);
    expect(v2.valid).toBe(false);
    if (!v2.valid) {
      expect(v2.reason).toBe('ABSOLUTE_EXPIRED');
    }

    // Must be purged from Valkey
    const exists = await redisSessionClient.get(redisKey);
    expect(exists).toBeNull();
  });

  it('rotates a session token: issues a fresh token and invalidates the previous identifier', async () => {
    const { cookie: initialCookie, rawToken: initialRawToken } = await createSession(
      testUserId,
      timeProvider
    );
    const initialHash = hashSessionToken(initialRawToken);

    // Rotate session
    simulatedTime += 60 * 1000; // 1 minute later
    const rotation = await rotateSession(initialCookie.value, timeProvider);

    expect(rotation.success).toBe(true);
    expect(rotation.cookie).toBeDefined();
    expect(rotation.cookie!.value).not.toBe(initialCookie.value);

    // Old session must be immediately invalidated
    const oldCheck = await validateSession(initialCookie.value, timeProvider);
    expect(oldCheck.valid).toBe(false);
    if (!oldCheck.valid) {
      expect(oldCheck.reason).toBe('NOT_FOUND');
    }

    // Old hash in Valkey is deleted
    const oldExists = await redisSessionClient.get(`${SESSION_REDIS_PREFIX}${initialHash}`);
    expect(oldExists).toBeNull();

    // New session cookie validates successfully
    const newCheck = await validateSession(rotation.cookie!.value, timeProvider);
    expect(newCheck.valid).toBe(true);
    if (newCheck.valid) {
      // Must preserve original creation timestamp
      expect(newCheck.session.createdAt).toBe(1770000000000);
      expect(newCheck.session.lastActiveAt).toBe(simulatedTime);
    }

    await destroySession(rotation.cookie!.value);
  });

  it('destroys a session on logout: revokes server-side key and clears browser cookie', async () => {
    const { cookie, rawToken } = await createSession(testUserId, timeProvider);
    const tokenHash = hashSessionToken(rawToken);
    const redisKey = `${SESSION_REDIS_PREFIX}${tokenHash}`;

    const clearCookie = await destroySession(cookie.value);
    expect(clearCookie.maxAge).toBe(0);
    expect(clearCookie.value).toBe('');

    // Valkey key must be deleted
    const exists = await redisSessionClient.get(redisKey);
    expect(exists).toBeNull();

    // Replay of the copied old cookie must fail closed
    const replayCheck = await validateSession(cookie.value, timeProvider);
    expect(replayCheck.valid).toBe(false);
    if (!replayCheck.valid) {
      expect(replayCheck.reason).toBe('NOT_FOUND');
    }
  });

  it('invalidates active sessions when a user is deactivated in the database', async () => {
    const { cookie } = await createSession(testUserId, timeProvider);

    // Deactivate user in database
    await prisma.user.update({
      where: { id: testUserId },
      data: { isActive: false },
    });

    try {
      const result = await validateSession(cookie.value, timeProvider);
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.reason).toBe('USER_INACTIVE');
      }
    } finally {
      // Restore user active state
      await prisma.user.update({
        where: { id: testUserId },
        data: { isActive: true },
      });
    }
  });

  it('rejects sessions for accounts that have been locked', async () => {
    const { cookie } = await createSession(testUserId, timeProvider);

    // Lock account until 15 minutes into the future
    const lockUntil = new Date(simulatedTime + 15 * 60 * 1000);
    await prisma.user.update({
      where: { id: testUserId },
      data: { lockedUntil: lockUntil },
    });

    try {
      const result = await validateSession(cookie.value, timeProvider);
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.reason).toBe('USER_LOCKED');
      }
    } finally {
      // Unlock account
      await prisma.user.update({
        where: { id: testUserId },
        data: { lockedUntil: null },
      });
    }
  });

  it('rejects tampered and forged session cookies', async () => {
    const { cookie } = await createSession(testUserId, timeProvider);

    // Tampered payload
    const tampered = cookie.value + '_forged';
    const result = await validateSession(tampered, timeProvider);

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.reason).toBe('INVALID_SIGNATURE');
    }

    await destroySession(cookie.value);
  });
});
