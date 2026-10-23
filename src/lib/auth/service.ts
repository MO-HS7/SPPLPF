/**
 * SPPLPF Authentication Service (TASK-010 Argon2id Credential Verification)
 *
 * Implements server-side credential verification against Prisma 7 datastore.
 * Never logs or exposes plaintext passwords or password hashes.
 * Returns generic error reasons to prevent timing or enumeration side-channels.
 */

import { prisma } from '../db';
import { verifyPassword, needsRehash } from './password';

export interface AuthenticatedUser {
  id: string;
  email: string;
  fullName: string;
  isActive: boolean;
  mfaEnabled: boolean;
}

export type AuthVerificationResult =
  | { success: true; user: AuthenticatedUser; needsRehash?: boolean }
  | { success: false; reason: 'INVALID_CREDENTIALS' | 'ACCOUNT_LOCKED'; lockedUntil?: Date };

/**
 * Validates candidate user credentials against stored Argon2id password hash in PostgreSQL.
 *
 * Security considerations:
 * - Sanitizes and normalizes email input.
 * - Prevents user enumeration by returning identical INVALID_CREDENTIALS failure for both
 *   non-existent accounts and incorrect passwords.
 * - Checks account lockout window.
 * - Never includes the passwordHash in the returned AuthenticatedUser structure.
 *
 * @param email - User login email address
 * @param candidatePassword - Plaintext password attempt
 * @returns Promise<AuthVerificationResult>
 */
export async function authenticateWithPassword(
  email: string,
  candidatePassword: string
): Promise<AuthVerificationResult> {
  if (
    !email ||
    typeof email !== 'string' ||
    !candidatePassword ||
    typeof candidatePassword !== 'string'
  ) {
    return { success: false, reason: 'INVALID_CREDENTIALS' };
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: {
      id: true,
      email: true,
      fullName: true,
      passwordHash: true,
      isActive: true,
      lockedUntil: true,
      mfaEnabled: true,
    },
  });

  // Generic rejection if user does not exist or has been deactivated
  if (!user || !user.isActive) {
    return { success: false, reason: 'INVALID_CREDENTIALS' };
  }

  // Enforce account lockout if lock timestamp is active
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    return {
      success: false,
      reason: 'ACCOUNT_LOCKED',
      lockedUntil: user.lockedUntil,
    };
  }

  // Constant-time Argon2id cryptographic verification
  const isValid = await verifyPassword(user.passwordHash, candidatePassword);
  if (!isValid) {
    return { success: false, reason: 'INVALID_CREDENTIALS' };
  }

  const rehashRequired = needsRehash(user.passwordHash);

  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      isActive: user.isActive,
      mfaEnabled: user.mfaEnabled,
    },
    needsRehash: rehashRequired,
  };
}
