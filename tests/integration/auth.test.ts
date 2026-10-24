import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '@/lib/db';
import { hashPassword } from '@/lib/auth/password';
import { authenticateWithPassword } from '@/lib/auth/service';
import { isPortReachable } from './helpers';

const isPgReachable = await isPortReachable(5432);

describe.runIf(isPgReachable)('TASK-010: Database Credential Verification Integration Tests', () => {
  const testEmail = 'task010.testuser@spplpf.internal';
  const testPassword = 'SecureInstitutionalPassword2026!';
  let createdUserId: string;

  beforeAll(async () => {
    // Ensure test user does not pre-exist
    await prisma.user.deleteMany({
      where: { email: testEmail },
    });

    const passwordHash = await hashPassword(testPassword);

    const user = await prisma.user.create({
      data: {
        email: testEmail,
        fullName: 'TASK-010 Test Account',
        passwordHash,
        isActive: true,
        mfaEnabled: false,
      },
    });

    createdUserId = user.id;
  });

  afterAll(async () => {
    // Teardown test account cleanly
    if (createdUserId) {
      await prisma.user.deleteMany({
        where: { id: createdUserId },
      });
    }
    await prisma.$disconnect();
  });

  it('authenticates a valid user with correct password and does not leak passwordHash', async () => {
    const result = await authenticateWithPassword(testEmail, testPassword);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.user.id).toBe(createdUserId);
      expect(result.user.email).toBe(testEmail);
      expect(result.user.fullName).toBe('TASK-010 Test Account');
      expect(result.user.isActive).toBe(true);
      expect(result.user.mfaEnabled).toBe(false);

      // Verify passwordHash is never returned on authenticated user
      // @ts-expect-error - testing absence of sensitive property
      expect(result.user.passwordHash).toBeUndefined();
    }
  });

  it('normalizes email casing during credential verification', async () => {
    const upperCaseEmail = testEmail.toUpperCase();
    const result = await authenticateWithPassword(upperCaseEmail, testPassword);

    expect(result.success).toBe(true);
  });

  it('rejects an incorrect password with generic INVALID_CREDENTIALS', async () => {
    const result = await authenticateWithPassword(testEmail, 'WrongPassword2026!');

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.reason).toBe('INVALID_CREDENTIALS');
    }
  });

  it('rejects non-existent users with identical INVALID_CREDENTIALS reason', async () => {
    const result = await authenticateWithPassword('nonexistent.user@spplpf.internal', testPassword);

    expect(result.success).toBe(false);
    if (!result.success) {
      // Must not leak that user was not found
      expect(result.reason).toBe('INVALID_CREDENTIALS');
    }
  });

  it('rejects deactivated users with INVALID_CREDENTIALS', async () => {
    const inactiveEmail = 'task010.inactive@spplpf.internal';
    const hash = await hashPassword('SomeValidPassword123!');

    const inactiveUser = await prisma.user.create({
      data: {
        email: inactiveEmail,
        fullName: 'Inactive Test User',
        passwordHash: hash,
        isActive: false,
      },
    });

    try {
      const result = await authenticateWithPassword(inactiveEmail, 'SomeValidPassword123!');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.reason).toBe('INVALID_CREDENTIALS');
      }
    } finally {
      await prisma.user.delete({ where: { id: inactiveUser.id } });
    }
  });

  it('blocks locked accounts and returns lockout window', async () => {
    const lockedEmail = 'task010.locked@spplpf.internal';
    const hash = await hashPassword('LockedValidPassword123!');
    const lockoutUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 mins in future

    const lockedUser = await prisma.user.create({
      data: {
        email: lockedEmail,
        fullName: 'Locked Test User',
        passwordHash: hash,
        isActive: true,
        lockedUntil: lockoutUntil,
      },
    });

    try {
      const result = await authenticateWithPassword(lockedEmail, 'LockedValidPassword123!');
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.reason).toBe('ACCOUNT_LOCKED');
        expect(result.lockedUntil).toBeDefined();
        expect(new Date(result.lockedUntil!).getTime()).toBeGreaterThan(Date.now());
      }
    } finally {
      await prisma.user.delete({ where: { id: lockedUser.id } });
    }
  });
});
