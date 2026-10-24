import { describe, it, expect, vi, beforeEach } from 'vitest';

// In-memory Redis simulation for unit testing
const redisKvStore = new Map<string, string>();
const redisSetStore = new Map<string, Set<string>>();

vi.mock('@/lib/redis', () => ({
  redisSessionClient: {
    get: vi.fn(async (key: string) => redisKvStore.get(key) ?? null),
    set: vi.fn(async (key: string, value: string, _mode?: string, _ttl?: number) => {
      redisKvStore.set(key, value);
      return 'OK';
    }),
    del: vi.fn(async (...keys: string[]) => {
      let count = 0;
      for (const k of keys) {
        if (redisKvStore.delete(k)) count++;
        if (redisSetStore.delete(k)) count++;
      }
      return count;
    }),
    sadd: vi.fn(async (key: string, ...members: string[]) => {
      if (!redisSetStore.has(key)) {
        redisSetStore.set(key, new Set());
      }
      const set = redisSetStore.get(key)!;
      let added = 0;
      for (const m of members) {
        if (!set.has(m)) {
          set.add(m);
          added++;
        }
      }
      return added;
    }),
    srem: vi.fn(async (key: string, ...members: string[]) => {
      const set = redisSetStore.get(key);
      if (!set) return 0;
      let removed = 0;
      for (const m of members) {
        if (set.delete(m)) removed++;
      }
      return removed;
    }),
    smembers: vi.fn(async (key: string) => {
      const set = redisSetStore.get(key);
      return set ? Array.from(set) : [];
    }),
    expire: vi.fn(async () => 1),
    disconnect: vi.fn(),
  },
  redisCacheClient: {
    disconnect: vi.fn(),
  },
}));

// In-memory Prisma user simulation
let mockUser: {
  id: string;
  email: string;
  fullName: string;
  isActive: boolean;
  lockedUntil: Date | null;
  mfaEnabled: boolean;
} | null = null;

vi.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(async ({ where }: { where: { id?: string; email?: string } }) => {
        if (!mockUser) return null;
        if (where.id && mockUser.id === where.id) return mockUser;
        if (where.email && mockUser.email.toLowerCase() === where.email.toLowerCase()) return mockUser;
        return null;
      }),
    },
    $disconnect: vi.fn(),
  },
}));

import {
  createSession,
  validateSession,
  rotateSession,
  destroySession,
  revokeAllUserSessions,
  hashSessionToken,
  SESSION_REDIS_PREFIX,
  SESSION_IDLE_TIMEOUT_MS,
  SESSION_ABSOLUTE_LIFETIME_MS,
} from '@/lib/auth/session';

describe('TASK-011 Unit Tests: Session Engine Lifecycle & Invalidation Logic', () => {
  const userId = 'usr_test_123456';
  let virtualTime = 1770000000000;
  const timeProvider = () => virtualTime;

  beforeEach(() => {
    redisKvStore.clear();
    redisSetStore.clear();
    virtualTime = 1770000000000;

    mockUser = {
      id: userId,
      email: 'admin.unit@spplpf.internal',
      fullName: 'Unit Test Administrator',
      isActive: true,
      lockedUntil: null,
      mfaEnabled: true,
    };
  });

  describe('createSession', () => {
    it('creates a session, stores hashed verifier, and returns signed cookie', async () => {
      const result = await createSession(userId, timeProvider);

      expect(result.cookie.name).toBe('spplpf_session');
      expect(result.cookie.httpOnly).toBe(true);
      expect(result.cookie.sameSite).toBe('strict');
      expect(result.cookie.value).toContain('.');

      const tokenHash = hashSessionToken(result.rawToken);
      const stored = redisKvStore.get(`${SESSION_REDIS_PREFIX}${tokenHash}`);
      expect(stored).toBeDefined();

      const parsed = JSON.parse(stored!);
      expect(parsed.userId).toBe(userId);
      expect(parsed.createdAt).toBe(virtualTime);
      expect(parsed.lastActiveAt).toBe(virtualTime);

      // Verify raw token is NOT in Valkey storage
      expect(stored).not.toContain(result.rawToken);
    });

    it('rejects empty userId', async () => {
      await expect(createSession('', timeProvider)).rejects.toThrow(
        /Valid userId is required/
      );
    });
  });

  describe('validateSession', () => {
    it('successfully validates an active session and resolves the user', async () => {
      const { cookie } = await createSession(userId, timeProvider);

      const validation = await validateSession(cookie.value, timeProvider);
      expect(validation.valid).toBe(true);
      if (validation.valid) {
        expect(validation.user.id).toBe(userId);
        expect(validation.user.email).toBe('admin.unit@spplpf.internal');
        expect(validation.user.fullName).toBe('Unit Test Administrator');
        expect(validation.user.isActive).toBe(true);
        expect(validation.user.mfaEnabled).toBe(true);
      }
    });

    it('rejects missing or empty cookie value', async () => {
      const v1 = await validateSession(null, timeProvider);
      expect(v1.valid).toBe(false);
      if (!v1.valid) expect(v1.reason).toBe('MISSING_COOKIE');

      const v2 = await validateSession('', timeProvider);
      expect(v2.valid).toBe(false);
      if (!v2.valid) expect(v2.reason).toBe('MISSING_COOKIE');
    });

    it('rejects forged or tampered signatures', async () => {
      const { cookie } = await createSession(userId, timeProvider);
      const tampered = cookie.value + '_invalid';

      const validation = await validateSession(tampered, timeProvider);
      expect(validation.valid).toBe(false);
      if (!validation.valid) expect(validation.reason).toBe('INVALID_SIGNATURE');
    });

    it('rejects unknown or expired session tokens not in Valkey', async () => {
      const { cookie } = await createSession(userId, timeProvider);
      redisKvStore.clear(); // Simulate external purge

      const validation = await validateSession(cookie.value, timeProvider);
      expect(validation.valid).toBe(false);
      if (!validation.valid) expect(validation.reason).toBe('NOT_FOUND');
    });

    it('enforces idle inactivity limit (30 minutes)', async () => {
      const { cookie } = await createSession(userId, timeProvider);

      // Advance clock 30m + 1s
      virtualTime += SESSION_IDLE_TIMEOUT_MS + 1000;

      const validation = await validateSession(cookie.value, timeProvider);
      expect(validation.valid).toBe(false);
      if (!validation.valid) {
        expect(validation.reason).toBe('IDLE_TIMEOUT');
        expect(validation.clearCookie.maxAge).toBe(0);
      }
    });

    it('enforces absolute expiration limit (8 hours) even with active traffic', async () => {
      const { cookie } = await createSession(userId, timeProvider);

      // Keep touching every 15 minutes
      virtualTime += 15 * 60 * 1000;
      await validateSession(cookie.value, timeProvider);

      // Advance to 8 hours + 10 seconds from creation
      virtualTime = 1770000000000 + SESSION_ABSOLUTE_LIFETIME_MS + 10000;

      const validation = await validateSession(cookie.value, timeProvider);
      expect(validation.valid).toBe(false);
      if (!validation.valid) {
        expect(validation.reason).toBe('ABSOLUTE_EXPIRED');
      }
    });

    it('invalidates sessions when user account is deactivated in database', async () => {
      const { cookie } = await createSession(userId, timeProvider);

      mockUser!.isActive = false;

      const validation = await validateSession(cookie.value, timeProvider);
      expect(validation.valid).toBe(false);
      if (!validation.valid) {
        expect(validation.reason).toBe('USER_INACTIVE');
      }
    });

    it('invalidates sessions when user account is locked in database', async () => {
      const { cookie } = await createSession(userId, timeProvider);

      mockUser!.lockedUntil = new Date(virtualTime + 15 * 60 * 1000);

      const validation = await validateSession(cookie.value, timeProvider);
      expect(validation.valid).toBe(false);
      if (!validation.valid) {
        expect(validation.reason).toBe('USER_LOCKED');
      }
    });

    it('invalidates sessions if user was deleted from database', async () => {
      const { cookie } = await createSession(userId, timeProvider);

      mockUser = null;

      const validation = await validateSession(cookie.value, timeProvider);
      expect(validation.valid).toBe(false);
      if (!validation.valid) {
        expect(validation.reason).toBe('USER_NOT_FOUND');
      }
    });
  });

  describe('rotateSession', () => {
    it('issues a fresh token, preserves creation time, and purges old token hash', async () => {
      const { cookie: oldCookie, rawToken: oldRawToken } = await createSession(
        userId,
        timeProvider
      );
      const oldHash = hashSessionToken(oldRawToken);

      virtualTime += 60 * 1000; // 1 minute later
      const rotation = await rotateSession(oldCookie.value, timeProvider);

      expect(rotation.success).toBe(true);
      expect(rotation.cookie).toBeDefined();
      expect(rotation.cookie!.value).not.toBe(oldCookie.value);

      // Old token must be purged from Valkey
      expect(redisKvStore.has(`${SESSION_REDIS_PREFIX}${oldHash}`)).toBe(false);

      // Validating new cookie succeeds and preserves original creation timestamp
      const validation = await validateSession(rotation.cookie!.value, timeProvider);
      expect(validation.valid).toBe(true);
      if (validation.valid) {
        expect(validation.session.createdAt).toBe(1770000000000);
        expect(validation.session.lastActiveAt).toBe(virtualTime);
      }
    });
  });

  describe('destroySession & revokeAllUserSessions', () => {
    it('purges session on logout and returns clear-cookie options', async () => {
      const { cookie, rawToken } = await createSession(userId, timeProvider);
      const tokenHash = hashSessionToken(rawToken);

      const clearCookie = await destroySession(cookie.value);
      expect(clearCookie.maxAge).toBe(0);
      expect(clearCookie.value).toBe('');

      expect(redisKvStore.has(`${SESSION_REDIS_PREFIX}${tokenHash}`)).toBe(false);

      // Subsequent validation fails
      const check = await validateSession(cookie.value, timeProvider);
      expect(check.valid).toBe(false);
    });

    it('revokes all sessions across devices for a user', async () => {
      const s1 = await createSession(userId, timeProvider);
      const s2 = await createSession(userId, timeProvider);

      const revokedCount = await revokeAllUserSessions(userId);
      expect(revokedCount).toBe(2);

      const check1 = await validateSession(s1.cookie.value, timeProvider);
      const check2 = await validateSession(s2.cookie.value, timeProvider);

      expect(check1.valid).toBe(false);
      expect(check2.valid).toBe(false);
    });
  });
});
