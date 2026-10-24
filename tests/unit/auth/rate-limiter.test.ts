import { describe, it, expect, vi, beforeEach } from 'vitest';
import crypto from 'node:crypto';
import {
  hashRateLimitIdentifier,
  buildRateLimitScopeKey,
  consumeRateLimit,
  checkRateLimit,
  resetRateLimit,
  RateLimiterError,
  RATE_LIMIT_LOGIN_MAX_ATTEMPTS,
  RATE_LIMIT_LOGIN_WINDOW_MS,
  SLIDING_WINDOW_CONSUME_LUA,
  SLIDING_WINDOW_CHECK_LUA,
} from '@/lib/auth/rate-limiter';
import { redisSessionClient } from '@/lib/redis';

// Mock Redis client for unit testing
vi.mock('@/lib/redis', () => ({
  redisSessionClient: {
    eval: vi.fn(),
    del: vi.fn(),
    disconnect: vi.fn(),
  },
  redisCacheClient: {
    disconnect: vi.fn(),
  },
}));

describe('TASK-012 Unit Tests: Rate Limiter Hashing & Key Construction', () => {
  it('generates deterministic SHA-256 obfuscated keys without plaintext identifier leakage', () => {
    const rawEmail = 'admin.editorial@spplpf.org.ps';
    const key = hashRateLimitIdentifier('acct', rawEmail);

    expect(key).toMatch(/^rl:acct:[a-f0-9]{32}$/);
    expect(key).not.toContain(rawEmail);
    expect(key).not.toContain('editorial');

    // Determinism
    const key2 = hashRateLimitIdentifier('acct', rawEmail);
    expect(key).toBe(key2);
  });

  it('normalizes casing and whitespace before hashing', () => {
    const key1 = hashRateLimitIdentifier('acct', 'User@Example.COM  ');
    const key2 = hashRateLimitIdentifier('acct', 'user@example.com');

    expect(key1).toBe(key2);
  });

  it('constructs distinct independent keys for account, IP, and pair scopes', () => {
    const email = 'user@example.com';
    const ip = '192.168.1.100';

    const acctKey = buildRateLimitScopeKey('login_account', { email });
    const ipKey = buildRateLimitScopeKey('login_ip', { ip });
    const pairKey = buildRateLimitScopeKey('login_pair', { email, ip });

    expect(acctKey).toMatch(/^rl:acct:/);
    expect(ipKey).toMatch(/^rl:ip:/);
    expect(pairKey).toMatch(/^rl:pair:/);

    expect(acctKey).not.toBe(ipKey);
    expect(acctKey).not.toBe(pairKey);
    expect(ipKey).not.toBe(pairKey);
  });
});

describe('TASK-012 Unit Tests: Sliding-Window Evaluation Logic & Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('allows requests below the limit and returns decremented remaining count', async () => {
    // Lua returns: [allowed=1, remaining=4, retryAfter=0, totalAttempts=1]
    vi.mocked(redisSessionClient.eval).mockResolvedValueOnce([1, 4, 0, 1]);

    const result = await consumeRateLimit('rl:acct:test1', { limit: 5 });

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(4);
    expect(result.totalAttempts).toBe(1);
    expect(result.retryAfterSeconds).toBe(0);
    expect(redisSessionClient.eval).toHaveBeenCalledWith(
      SLIDING_WINDOW_CONSUME_LUA,
      1,
      'rl:acct:test1',
      expect.any(String),
      '900000',
      '5',
      expect.any(String),
      expect.any(String)
    );
  });

  it('rejects requests when limit is reached and returns retry timing', async () => {
    // Lua returns: [allowed=0, remaining=0, retryAfter=450, totalAttempts=5]
    vi.mocked(redisSessionClient.eval).mockResolvedValueOnce([0, 0, 450, 5]);

    const result = await consumeRateLimit('rl:acct:test2', { limit: 5 });

    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.totalAttempts).toBe(5);
    expect(result.retryAfterSeconds).toBe(450);
  });

  it('uses deterministic virtual time provider when supplied', async () => {
    const fixedTime = 1770000000000;
    const timeProvider = () => fixedTime;

    vi.mocked(redisSessionClient.eval).mockResolvedValueOnce([1, 3, 0, 2]);

    const result = await consumeRateLimit('rl:acct:test3', { timeProvider });

    expect(result.resetAt).toBe(fixedTime + RATE_LIMIT_LOGIN_WINDOW_MS);
    expect(redisSessionClient.eval).toHaveBeenCalledWith(
      expect.any(String),
      1,
      'rl:acct:test3',
      fixedTime.toString(),
      expect.any(String),
      expect.any(String),
      expect.stringContaining(`${fixedTime}:`),
      expect.any(String)
    );
  });

  it('inspects state without consuming attempt via checkRateLimit', async () => {
    vi.mocked(redisSessionClient.eval).mockResolvedValueOnce([1, 2, 0, 3]);

    const result = await checkRateLimit('rl:acct:test4', { limit: 5 });

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(2);
    expect(result.totalAttempts).toBe(3);
    expect(redisSessionClient.eval).toHaveBeenCalledWith(
      SLIDING_WINDOW_CHECK_LUA,
      1,
      'rl:acct:test4',
      expect.any(String),
      expect.any(String),
      '5'
    );
  });

  it('resets rate limit bucket via resetRateLimit', async () => {
    vi.mocked(redisSessionClient.del).mockResolvedValueOnce(1);

    await resetRateLimit('rl:acct:test5');

    expect(redisSessionClient.del).toHaveBeenCalledWith('rl:acct:test5');
  });

  it('fails closed and throws RateLimiterError when Valkey datastore throws an outage error', async () => {
    vi.mocked(redisSessionClient.eval).mockRejectedValueOnce(
      new Error('Connection refused ECONNREFUSED 127.0.0.1:6379')
    );

    await expect(consumeRateLimit('rl:acct:test_fail')).rejects.toThrow(RateLimiterError);
  });
});
