/**
 * SPPLPF Authentication Service (TASK-010 Argon2id + TASK-012 Rate Limiting & Brute-Force Defense)
 *
 * Implements server-side credential verification against Prisma 7 datastore with
 * atomic sliding-window rate limiting in Valkey and database-backed account lockout.
 *
 * Security considerations:
 * - Sanitizes and normalizes email input.
 * - Prevents user enumeration by returning identical generic reasons for non-existent
 *   accounts and invalid credentials.
 * - Enforces account lockout when failed attempts reach threshold.
 * - Evaluates Redis rate limits before heavy Argon2id verification to prevent DoS.
 * - Fails safely (fail-closed) when Valkey datastore is unreachable.
 * - Resets failed-attempt counters upon successful password verification.
 * - Never includes passwordHash or session tokens in returned public user objects.
 */

import { prisma } from '../db';
import { verifyPassword, needsRehash } from './password';
import {
  consumeRateLimit,
  resetRateLimit,
  buildRateLimitScopeKey,
  RateLimiterError,
  RATE_LIMIT_LOGIN_MAX_ATTEMPTS,
  RATE_LIMIT_LOGIN_WINDOW_MS,
  RATE_LIMIT_IP_MAX_ATTEMPTS,
  RATE_LIMIT_LOCKOUT_DURATION_MS,
} from './rate-limiter';

export interface AuthenticatedUser {
  id: string;
  email: string;
  fullName: string;
  isActive: boolean;
  mfaEnabled: boolean;
}

export interface AuthenticateOptions {
  ip?: string;
  timeProvider?: () => number;
  skipRateLimit?: boolean;
}

export type AuthVerificationResult =
  | { success: true; user: AuthenticatedUser; needsRehash?: boolean }
  | {
      success: false;
      reason: 'INVALID_CREDENTIALS' | 'ACCOUNT_LOCKED' | 'RATE_LIMITED' | 'SERVICE_UNAVAILABLE';
      lockedUntil?: Date;
      retryAfterSeconds?: number;
    };

/**
 * Validates candidate user credentials against stored Argon2id password hash in PostgreSQL,
 * integrated with Valkey sliding-window rate limiting and persistent brute-force lockout.
 *
 * @param email - User login email address
 * @param candidatePassword - Plaintext password attempt
 * @param options - Optional client metadata (IP, virtual timeProvider, rate limit control)
 * @returns Promise<AuthVerificationResult>
 */
export async function authenticateWithPassword(
  email: string,
  candidatePassword: string,
  options?: AuthenticateOptions
): Promise<AuthVerificationResult> {
  if (
    !email ||
    typeof email !== 'string' ||
    !candidatePassword ||
    typeof candidatePassword !== 'string'
  ) {
    return { success: false, reason: 'INVALID_CREDENTIALS' };
  }

  const now = options?.timeProvider ? options.timeProvider() : Date.now();
  const normalizedEmail = email.trim().toLowerCase();

  const accountScopeKey = buildRateLimitScopeKey('login_account', { email: normalizedEmail });

  // 1. Sliding-Window Rate Limiting (Pre-Argon2id CPU Protection)
  if (!options?.skipRateLimit) {
    try {
      // IP-level rate limiting (defends against distributed credential spraying from single IP)
      if (options?.ip) {
        const ipScopeKey = buildRateLimitScopeKey('login_ip', { ip: options.ip });
        const ipLimit = await consumeRateLimit(ipScopeKey, {
          limit: RATE_LIMIT_IP_MAX_ATTEMPTS,
          windowMs: RATE_LIMIT_LOGIN_WINDOW_MS,
          timeProvider: options?.timeProvider,
        });

        if (!ipLimit.allowed) {
          return {
            success: false,
            reason: 'RATE_LIMITED',
            retryAfterSeconds: ipLimit.retryAfterSeconds,
          };
        }
      }

      // Account-level rate limiting (defends against brute-forcing specific account across IPs)
      const accountLimit = await consumeRateLimit(accountScopeKey, {
        limit: RATE_LIMIT_LOGIN_MAX_ATTEMPTS,
        windowMs: RATE_LIMIT_LOGIN_WINDOW_MS,
        timeProvider: options?.timeProvider,
      });

      if (!accountLimit.allowed) {
        return {
          success: false,
          reason: 'RATE_LIMITED',
          retryAfterSeconds: accountLimit.retryAfterSeconds,
        };
      }
    } catch (err) {
      if (err instanceof RateLimiterError) {
        // Fail closed: do not bypass rate limiting when datastore is down
        return { success: false, reason: 'SERVICE_UNAVAILABLE' };
      }
      throw err;
    }
  }

  // 2. Query user record from PostgreSQL
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: {
      id: true,
      email: true,
      fullName: true,
      passwordHash: true,
      isActive: true,
      failedAttempts: true,
      lockedUntil: true,
      mfaEnabled: true,
    },
  });

  // Generic rejection if user does not exist or has been deactivated
  if (!user || !user.isActive) {
    return { success: false, reason: 'INVALID_CREDENTIALS' };
  }

  // 3. Persistent Account Lockout Enforcement
  if (user.lockedUntil && user.lockedUntil.getTime() > now) {
    return {
      success: false,
      reason: 'ACCOUNT_LOCKED',
      lockedUntil: user.lockedUntil,
    };
  }

  // 4. Constant-Time Argon2id Cryptographic Verification
  const isValid = await verifyPassword(user.passwordHash, candidatePassword);

  if (!isValid) {
    // 5. Handle Failed Attempt & Account Lockout Escalation
    const wasLocked = user.lockedUntil && user.lockedUntil.getTime() <= now;
    const currentFailures = wasLocked ? 0 : user.failedAttempts;
    const newFailures = currentFailures + 1;
    const shouldLock = newFailures >= RATE_LIMIT_LOGIN_MAX_ATTEMPTS;
    const newLockedUntil = shouldLock
      ? new Date(now + RATE_LIMIT_LOCKOUT_DURATION_MS)
      : null;

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        failedAttempts: shouldLock ? 0 : newFailures,
        lockedUntil: newLockedUntil,
      },
      select: {
        id: true,
        failedAttempts: true,
        lockedUntil: true,
      },
    });

    if (updated.lockedUntil && updated.lockedUntil.getTime() > now) {
      return {
        success: false,
        reason: 'ACCOUNT_LOCKED',
        lockedUntil: updated.lockedUntil,
      };
    }

    return { success: false, reason: 'INVALID_CREDENTIALS' };
  }

  // 6. Successful Authentication: Reset Failed Attempts and Account Lockout
  await prisma.user.update({
    where: { id: user.id },
    data: {
      failedAttempts: 0,
      lockedUntil: null,
      lastLoginAt: new Date(now),
    },
  });

  // Reset rate-limit bucket for this account so user is not penalized for previous typos
  await resetRateLimit(accountScopeKey);

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
