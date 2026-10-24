import { describe, it, expect, vi, beforeEach } from 'vitest';
import { hashPassword } from '@/lib/auth/password';
import { authenticateWithPassword } from '@/lib/auth/service';
import { prisma } from '@/lib/db';
import { redisSessionClient } from '@/lib/redis';
import { RateLimiterError } from '@/lib/auth/rate-limiter';

// Mock Redis client
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

// Mock Prisma
vi.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    $disconnect: vi.fn(),
  },
}));

describe('TASK-012 Unit Tests: Authentication Rate Limiting & Account Lockout', () => {
  const testEmail = 'journalist@spplpf.internal';
  const validPassword = 'StrongJournalistPass2026!';
  let validPasswordHash: string;
  let simulatedTime = 1770000000000;
  const timeProvider = () => simulatedTime;

  beforeEach(async () => {
    vi.clearAllMocks();
    simulatedTime = 1770000000000;
    if (!validPasswordHash) {
      validPasswordHash = await hashPassword(validPassword);
    }
  });

  it('resets failedAttempts and clears lockout on successful authentication', async () => {
    // Redis allows attempt
    vi.mocked(redisSessionClient.eval).mockResolvedValue([1, 4, 0, 1]);
    vi.mocked(redisSessionClient.del).mockResolvedValue(1);

    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 'usr_1',
      email: testEmail,
      fullName: 'Journalist User',
      passwordHash: validPasswordHash,
      isActive: true,
      failedAttempts: 2,
      lockedUntil: null,
      mfaEnabled: false,
    } as any);

    vi.mocked(prisma.user.update).mockResolvedValue({} as any);

    const result = await authenticateWithPassword(testEmail, validPassword, { timeProvider });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.user.id).toBe('usr_1');
      expect(result.user.email).toBe(testEmail);
    }

    // Verify database reset
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'usr_1' },
      data: {
        failedAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(simulatedTime),
      },
    });

    // Verify rate limit bucket reset on successful authentication
    expect(redisSessionClient.del).toHaveBeenCalled();
  });

  it('increments failedAttempts on incorrect password below threshold', async () => {
    vi.mocked(redisSessionClient.eval).mockResolvedValue([1, 3, 0, 2]);

    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 'usr_1',
      email: testEmail,
      fullName: 'Journalist User',
      passwordHash: validPasswordHash,
      isActive: true,
      failedAttempts: 2,
      lockedUntil: null,
      mfaEnabled: false,
    } as any);

    vi.mocked(prisma.user.update).mockResolvedValue({
      id: 'usr_1',
      failedAttempts: 3,
      lockedUntil: null,
    } as any);

    const result = await authenticateWithPassword(testEmail, 'WrongPassword123!', { timeProvider });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.reason).toBe('INVALID_CREDENTIALS');
    }

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'usr_1' },
      data: {
        failedAttempts: 3,
        lockedUntil: null,
      },
      select: {
        id: true,
        failedAttempts: true,
        lockedUntil: true,
      },
    });
  });

  it('locks account for 30 minutes when failedAttempts reaches threshold of 5', async () => {
    vi.mocked(redisSessionClient.eval).mockResolvedValue([1, 0, 0, 5]);

    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 'usr_1',
      email: testEmail,
      fullName: 'Journalist User',
      passwordHash: validPasswordHash,
      isActive: true,
      failedAttempts: 4, // 5th failure
      lockedUntil: null,
      mfaEnabled: false,
    } as any);

    const expectedLockoutUntil = new Date(simulatedTime + 30 * 60 * 1000);
    vi.mocked(prisma.user.update).mockResolvedValue({
      id: 'usr_1',
      failedAttempts: 0,
      lockedUntil: expectedLockoutUntil,
    } as any);

    const result = await authenticateWithPassword(testEmail, 'WrongPassword123!', { timeProvider });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.reason).toBe('ACCOUNT_LOCKED');
      expect(result.lockedUntil).toEqual(expectedLockoutUntil);
    }

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'usr_1' },
      data: {
        failedAttempts: 0,
        lockedUntil: expectedLockoutUntil,
      },
      select: {
        id: true,
        failedAttempts: true,
        lockedUntil: true,
      },
    });
  });

  it('blocks currently locked accounts and returns remaining lockout window', async () => {
    vi.mocked(redisSessionClient.eval).mockResolvedValue([1, 4, 0, 1]);

    const activeLockout = new Date(simulatedTime + 20 * 60 * 1000); // 20m remaining

    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 'usr_1',
      email: testEmail,
      fullName: 'Journalist User',
      passwordHash: validPasswordHash,
      isActive: true,
      failedAttempts: 5,
      lockedUntil: activeLockout,
      mfaEnabled: false,
    } as any);

    const result = await authenticateWithPassword(testEmail, validPassword, { timeProvider });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.reason).toBe('ACCOUNT_LOCKED');
      expect(result.lockedUntil).toEqual(activeLockout);
    }

    // Password verification and DB update must NOT be performed
    expect(prisma.user.update).not.toHaveBeenCalled();
  });

  it('allows authentication once lockout duration has expired', async () => {
    vi.mocked(redisSessionClient.eval).mockResolvedValue([1, 4, 0, 1]);
    vi.mocked(redisSessionClient.del).mockResolvedValue(1);

    // Lockout was in the past (31 minutes ago)
    const expiredLockout = new Date(simulatedTime - 60 * 1000);

    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: 'usr_1',
      email: testEmail,
      fullName: 'Journalist User',
      passwordHash: validPasswordHash,
      isActive: true,
      failedAttempts: 5,
      lockedUntil: expiredLockout,
      mfaEnabled: false,
    } as any);

    vi.mocked(prisma.user.update).mockResolvedValue({} as any);

    const result = await authenticateWithPassword(testEmail, validPassword, { timeProvider });

    expect(result.success).toBe(true);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'usr_1' },
      data: {
        failedAttempts: 0,
        lockedUntil: null,
        lastLoginAt: new Date(simulatedTime),
      },
    });
  });

  it('returns generic INVALID_CREDENTIALS for non-existent users but consumes rate limit attempt', async () => {
    vi.mocked(redisSessionClient.eval).mockResolvedValue([1, 4, 0, 1]);
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const result = await authenticateWithPassword('unknown@spplpf.internal', 'AnyPassword123!', {
      timeProvider,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.reason).toBe('INVALID_CREDENTIALS');
    }

    // Rate limiter must have been called for the unknown email
    expect(redisSessionClient.eval).toHaveBeenCalled();
  });

  it('returns RATE_LIMITED when Redis sliding window limit is exceeded before Argon2id verification', async () => {
    // Redis returns blocked: [allowed=0, remaining=0, retryAfterSeconds=600, totalAttempts=5]
    vi.mocked(redisSessionClient.eval).mockResolvedValue([0, 0, 600, 5]);

    const result = await authenticateWithPassword(testEmail, 'AnyPassword123!', { timeProvider });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.reason).toBe('RATE_LIMITED');
      expect(result.retryAfterSeconds).toBe(600);
    }

    // Must not query user or perform Argon2id hashing when rate limited
    expect(prisma.user.findUnique).not.toHaveBeenCalled();
  });

  it('enforces IP rate limiting when IP address is provided', async () => {
    // IP rate limit fails: [allowed=0, remaining=0, retryAfterSeconds=300, totalAttempts=20]
    vi.mocked(redisSessionClient.eval).mockResolvedValueOnce([0, 0, 300, 20]);

    const result = await authenticateWithPassword(testEmail, 'AnyPassword123!', {
      ip: '203.0.113.42',
      timeProvider,
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.reason).toBe('RATE_LIMITED');
      expect(result.retryAfterSeconds).toBe(300);
    }
  });

  it('fails closed with SERVICE_UNAVAILABLE when Valkey is unreachable', async () => {
    vi.mocked(redisSessionClient.eval).mockRejectedValueOnce(
      new Error('Valkey connection timeout')
    );

    const result = await authenticateWithPassword(testEmail, validPassword, { timeProvider });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.reason).toBe('SERVICE_UNAVAILABLE');
    }
  });
});
