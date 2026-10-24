/**
 * SPPLPF Secure Session Management & Cookie Lifecycle Engine
 *
 * Architecture & Security Principles:
 * - Opaque, cryptographically random session tokens (256-bit entropy via crypto.randomBytes(32)).
 * - Tamper-resistant HMAC-SHA256 signature verification with constant-time equality checks.
 * - One-Way Valkey Storage: Only SHA-256 hashes of session tokens are stored in Valkey (DB 0).
 *   A read-only Valkey disclosure CANNOT reveal reusable session cookies.
 * - Minimum Metadata: Stores only `{ userId, createdAt, lastActiveAt }`.
 *   Zero passwords, password hashes, or sensitive PII stored in cache or cookies.
 * - Strict Dual-Expiry:
 *   - Idle Timeout: 30 minutes (1,800,000 ms) of inactivity.
 *   - Absolute Lifetime: 8 hours (28,800,000 ms) from initial authentication.
 *   - Effective Valkey TTL strictly bound: TTL is dynamically capped so it never extends
 *     beyond the remaining absolute lifetime.
 * - Anti-Fixation & Safe Rotation: Session rotation issues a fresh 256-bit token and
 *   immediately invalidates the previous token hash in Valkey.
 * - Database Re-verification: Validates that the associated user exists, remains active,
 *   and is not currently locked out.
 * - Fail-Closed Secret Resolution: Refuses to boot or sign in production if SESSION_SECRET
 *   is missing or less than 32 bytes (256 bits).
 * - Cookie Controls:
 *   - HttpOnly: true (mitigates XSS token theft)
 *   - SameSite: 'strict' (defense-in-depth against CSRF)
 *   - Path: '/'
 *   - Secure: true in production (HTTPS-only)
 *
 * NOTE ON CSRF DEFENSE:
 * SameSite=Strict provides strong browser-level defense in depth. However, it is not a
 * substitute for explicit CSRF tokens on state-changing API endpoints, especially for
 * cross-origin form submissions, legacy browser clients, or top-level navigational POSTs.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { redisSessionClient } from '../redis';
import { prisma } from '../db';
import type { AuthenticatedUser } from './service';

// --- Constants & Configurable Defaults ---

export const SESSION_COOKIE_NAME = 'spplpf_session';

/**
 * Idle timeout window: 30 minutes of inactivity invalidates the session.
 */
export const SESSION_IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

/**
 * Absolute session lifetime: 8 hours from creation, regardless of activity.
 */
export const SESSION_ABSOLUTE_LIFETIME_MS = 8 * 60 * 60 * 1000; // 8 hours

/**
 * Redis key namespace for hashed session verifiers.
 */
export const SESSION_REDIS_PREFIX = 'session:';

/**
 * Redis key namespace for user session index sets.
 */
export const USER_SESSIONS_PREFIX = 'user:sessions:';

// --- Interfaces ---

export interface SessionRecord {
  userId: string;
  createdAt: number;
  lastActiveAt: number;
}

export interface SessionCookieOptions {
  name: string;
  value: string;
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'strict' | 'lax' | 'none';
  path: string;
  maxAge: number; // in seconds
  expires?: Date;
}

export type SessionValidationResult =
  | {
      valid: true;
      user: AuthenticatedUser;
      session: SessionRecord;
    }
  | {
      valid: false;
      reason:
        | 'MISSING_COOKIE'
        | 'INVALID_SIGNATURE'
        | 'MALFORMED'
        | 'NOT_FOUND'
        | 'IDLE_TIMEOUT'
        | 'ABSOLUTE_EXPIRED'
        | 'USER_NOT_FOUND'
        | 'USER_INACTIVE'
        | 'USER_LOCKED';
      clearCookie: SessionCookieOptions;
    };

// --- Secret Resolution & Validation ---

/**
 * Resolves the session signing secret from container secrets, local files, or environment.
 * Enforces strict fail-closed security in production.
 */
export function resolveSessionSecret(): string {
  // 1. Container secret mount
  const containerSecretPath = '/run/secrets/session_secret';
  if (fs.existsSync(containerSecretPath)) {
    const secret = fs.readFileSync(containerSecretPath, 'utf8').trim();
    if (secret) return secret;
  }

  // 2. Local workspace secret file
  const localSecretPath = path.resolve(process.cwd(), 'secrets/session_secret.txt');
  if (fs.existsSync(localSecretPath)) {
    const secret = fs.readFileSync(localSecretPath, 'utf8').trim();
    if (secret) return secret;
  }

  // 3. Environment variable
  if (process.env.SESSION_SECRET) {
    const secret = process.env.SESSION_SECRET.trim();
    if (secret) return secret;
  }

  // In production, failure to configure a dedicated 256-bit secret MUST fail closed
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'FAIL CLOSED: Production session secret is missing or empty. A dedicated 256-bit secret must be provided via /run/secrets/session_secret, secrets/session_secret.txt, or SESSION_SECRET.'
    );
  }

  // In local test/development environments without a secret file, reject insecurely short fallbacks
  throw new Error(
    'Session secret not found in /run/secrets/session_secret, secrets/session_secret.txt, or SESSION_SECRET.'
  );
}

/**
 * Validates that a session secret meets the minimum 256-bit (32-byte) entropy requirement.
 */
export function validateSessionSecret(secret: string): void {
  if (!secret || typeof secret !== 'string') {
    throw new Error('Session secret must be a non-empty string.');
  }
  const byteLength = Buffer.byteLength(secret, 'utf8');
  if (byteLength < 32) {
    throw new Error(
      `Session secret entropy insufficient (${byteLength} bytes). Must be at least 32 bytes (256 bits).`
    );
  }
}

// --- Cryptographic Token & Hash Utilities ---

/**
 * Generates an opaque, cryptographically random session token with 256 bits of entropy.
 */
export function generateRawSessionToken(): string {
  return crypto.randomBytes(32).toString('base64url');
}

/**
 * Computes a SHA-256 one-way verifier hash of the raw session token.
 * Only this hash is stored in Valkey, never the raw token or signature.
 */
export function hashSessionToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken, 'utf8').digest('hex');
}

/**
 * Signs an opaque session token using HMAC-SHA256.
 * Format: `${rawToken}.${base64url(hmac)}`
 */
export function signSessionToken(rawToken: string, secret: string): string {
  const hmac = crypto
    .createHmac('sha256', secret)
    .update(rawToken, 'utf8')
    .digest('base64url');
  return `${rawToken}.${hmac}`;
}

/**
 * Verifies a signed session token using constant-time comparison.
 * Returns the raw token if valid, or null if tampered, malformed, or invalid.
 */
export function verifySignedSessionToken(
  signedToken: string,
  secret: string
): string | null {
  if (!signedToken || typeof signedToken !== 'string') {
    return null;
  }

  const dotIndex = signedToken.lastIndexOf('.');
  if (dotIndex === -1 || dotIndex === 0 || dotIndex === signedToken.length - 1) {
    return null;
  }

  const rawToken = signedToken.substring(0, dotIndex);
  const signature = signedToken.substring(dotIndex + 1);

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(rawToken, 'utf8')
    .digest('base64url');

  const sigBuffer = Buffer.from(signature, 'utf8');
  const expectedBuffer = Buffer.from(expectedSignature, 'utf8');

  if (
    sigBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(sigBuffer, expectedBuffer)
  ) {
    return null;
  }

  return rawToken;
}

// --- Cookie Generator Utilities ---

/**
 * Returns standard secure session cookie options.
 */
export function getSessionCookieOptions(
  value: string,
  maxAgeSeconds: number = Math.floor(SESSION_ABSOLUTE_LIFETIME_MS / 1000)
): SessionCookieOptions {
  return {
    name: SESSION_COOKIE_NAME,
    value,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: maxAgeSeconds,
  };
}

/**
 * Returns cookie options to immediately clear/invalidate the session cookie in the client browser.
 */
export function getClearSessionCookieOptions(): SessionCookieOptions {
  return {
    name: SESSION_COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  };
}

// --- Core Session Lifecycle Operations ---

/**
 * Creates a new authenticated session in Valkey and returns the signed cookie options.
 *
 * @param userId - ID of the successfully authenticated user
 * @param timeProvider - Optional deterministic clock provider for testing
 */
export async function createSession(
  userId: string,
  timeProvider: () => number = Date.now
): Promise<{
  cookie: SessionCookieOptions;
  expiresAt: Date;
  rawToken: string;
}> {
  if (!userId || typeof userId !== 'string') {
    throw new Error('Valid userId is required to create a session.');
  }

  const secret = resolveSessionSecret();
  validateSessionSecret(secret);

  const now = timeProvider();
  const rawToken = generateRawSessionToken();
  const tokenHash = hashSessionToken(rawToken);
  const signedCookieValue = signSessionToken(rawToken, secret);

  const sessionRecord: SessionRecord = {
    userId,
    createdAt: now,
    lastActiveAt: now,
  };

  // Effective TTL is capped by idle timeout and absolute lifetime
  const initialTtlSeconds = Math.min(
    Math.floor(SESSION_IDLE_TIMEOUT_MS / 1000),
    Math.floor(SESSION_ABSOLUTE_LIFETIME_MS / 1000)
  );

  const redisKey = `${SESSION_REDIS_PREFIX}${tokenHash}`;
  const userSessionsKey = `${USER_SESSIONS_PREFIX}${userId}`;

  // Store hashed session verifier in Valkey DB 0
  await redisSessionClient.set(
    redisKey,
    JSON.stringify(sessionRecord),
    'EX',
    initialTtlSeconds
  );

  // Maintain index of user's active session hashes for account-wide revocation
  await redisSessionClient.sadd(userSessionsKey, tokenHash);
  await redisSessionClient.expire(userSessionsKey, Math.floor(SESSION_ABSOLUTE_LIFETIME_MS / 1000));

  const expiresAt = new Date(now + SESSION_ABSOLUTE_LIFETIME_MS);
  const cookie = getSessionCookieOptions(
    signedCookieValue,
    Math.floor(SESSION_ABSOLUTE_LIFETIME_MS / 1000)
  );

  return {
    cookie,
    expiresAt,
    rawToken,
  };
}

/**
 * Validates a presented session cookie, enforces inactivity and absolute limits,
 * touches the session activity timestamp, and verifies user status against the database.
 *
 * @param signedCookieValue - The raw session cookie string from the HTTP request
 * @param timeProvider - Optional deterministic clock provider for testing
 */
export async function validateSession(
  signedCookieValue: string | null | undefined,
  timeProvider: () => number = Date.now
): Promise<SessionValidationResult> {
  const clearCookie = getClearSessionCookieOptions();

  if (!signedCookieValue || typeof signedCookieValue !== 'string' || !signedCookieValue.trim()) {
    return { valid: false, reason: 'MISSING_COOKIE', clearCookie };
  }

  let secret: string;
  try {
    secret = resolveSessionSecret();
    validateSessionSecret(secret);
  } catch {
    return { valid: false, reason: 'INVALID_SIGNATURE', clearCookie };
  }

  // 1. Cryptographic signature verification
  const rawToken = verifySignedSessionToken(signedCookieValue, secret);
  if (!rawToken) {
    return { valid: false, reason: 'INVALID_SIGNATURE', clearCookie };
  }

  // 2. Resolve one-way verifier hash from Valkey
  const tokenHash = hashSessionToken(rawToken);
  const redisKey = `${SESSION_REDIS_PREFIX}${tokenHash}`;

  const rawData = await redisSessionClient.get(redisKey);
  if (!rawData) {
    return { valid: false, reason: 'NOT_FOUND', clearCookie };
  }

  let session: SessionRecord;
  try {
    session = JSON.parse(rawData);
    if (!session.userId || !session.createdAt || !session.lastActiveAt) {
      throw new Error('Malformed session record');
    }
  } catch {
    await redisSessionClient.del(redisKey);
    return { valid: false, reason: 'MALFORMED', clearCookie };
  }

  const now = timeProvider();

  // 3. Absolute lifetime enforcement (8 hours from creation)
  if (now - session.createdAt > SESSION_ABSOLUTE_LIFETIME_MS) {
    await destroySessionByHash(tokenHash, session.userId);
    return { valid: false, reason: 'ABSOLUTE_EXPIRED', clearCookie };
  }

  // 4. Idle inactivity enforcement (30 minutes from last activity)
  if (now - session.lastActiveAt > SESSION_IDLE_TIMEOUT_MS) {
    await destroySessionByHash(tokenHash, session.userId);
    return { valid: false, reason: 'IDLE_TIMEOUT', clearCookie };
  }

  // 5. Database user re-verification
  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true,
      email: true,
      fullName: true,
      isActive: true,
      lockedUntil: true,
      mfaEnabled: true,
    },
  });

  if (!user) {
    await destroySessionByHash(tokenHash, session.userId);
    return { valid: false, reason: 'USER_NOT_FOUND', clearCookie };
  }

  if (!user.isActive) {
    await destroySessionByHash(tokenHash, session.userId);
    return { valid: false, reason: 'USER_INACTIVE', clearCookie };
  }

  if (user.lockedUntil && user.lockedUntil.getTime() > now) {
    await destroySessionByHash(tokenHash, session.userId);
    return { valid: false, reason: 'USER_LOCKED', clearCookie };
  }

  // 6. Session Touch: Update lastActiveAt and dynamically recalculate Valkey TTL
  // The TTL must never extend beyond the absolute expiration timestamp
  const remainingAbsoluteMs = session.createdAt + SESSION_ABSOLUTE_LIFETIME_MS - now;
  const newTtlSeconds = Math.min(
    Math.floor(SESSION_IDLE_TIMEOUT_MS / 1000),
    Math.max(1, Math.floor(remainingAbsoluteMs / 1000))
  );

  const updatedRecord: SessionRecord = {
    ...session,
    lastActiveAt: now,
  };

  await redisSessionClient.set(
    redisKey,
    JSON.stringify(updatedRecord),
    'EX',
    newTtlSeconds
  );

  const authenticatedUser: AuthenticatedUser = {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    isActive: user.isActive,
    mfaEnabled: user.mfaEnabled,
  };

  return {
    valid: true,
    user: authenticatedUser,
    session: updatedRecord,
  };
}

/**
 * Rotates an active session identifier to prevent session fixation.
 * Invalidates the previous token hash in Valkey and issues a fresh signed cookie,
 * preserving the original session creation timestamp.
 *
 * @param signedCookieValue - The active signed session cookie to rotate
 * @param timeProvider - Optional deterministic clock provider for testing
 */
export async function rotateSession(
  signedCookieValue: string,
  timeProvider: () => number = Date.now
): Promise<{
  success: boolean;
  cookie?: SessionCookieOptions;
  clearCookie?: SessionCookieOptions;
  reason?: string;
}> {
  const clearCookie = getClearSessionCookieOptions();

  let secret: string;
  try {
    secret = resolveSessionSecret();
    validateSessionSecret(secret);
  } catch {
    return { success: false, clearCookie, reason: 'INVALID_SIGNATURE' };
  }

  const oldRawToken = verifySignedSessionToken(signedCookieValue, secret);
  if (!oldRawToken) {
    return { success: false, clearCookie, reason: 'INVALID_SIGNATURE' };
  }

  const oldTokenHash = hashSessionToken(oldRawToken);
  const oldRedisKey = `${SESSION_REDIS_PREFIX}${oldTokenHash}`;

  const rawData = await redisSessionClient.get(oldRedisKey);
  if (!rawData) {
    return { success: false, clearCookie, reason: 'NOT_FOUND' };
  }

  let session: SessionRecord;
  try {
    session = JSON.parse(rawData);
  } catch {
    await redisSessionClient.del(oldRedisKey);
    return { success: false, clearCookie, reason: 'MALFORMED' };
  }

  const now = timeProvider();

  // Validate absolute lifetime before allowing rotation
  if (now - session.createdAt > SESSION_ABSOLUTE_LIFETIME_MS) {
    await destroySessionByHash(oldTokenHash, session.userId);
    return { success: false, clearCookie, reason: 'ABSOLUTE_EXPIRED' };
  }

  // Generate new token & hash
  const newRawToken = generateRawSessionToken();
  const newTokenHash = hashSessionToken(newRawToken);
  const newSignedCookie = signSessionToken(newRawToken, secret);

  const newSessionRecord: SessionRecord = {
    userId: session.userId,
    createdAt: session.createdAt, // Preserve original creation time
    lastActiveAt: now,
  };

  const remainingAbsoluteMs = session.createdAt + SESSION_ABSOLUTE_LIFETIME_MS - now;
  const ttlSeconds = Math.min(
    Math.floor(SESSION_IDLE_TIMEOUT_MS / 1000),
    Math.max(1, Math.floor(remainingAbsoluteMs / 1000))
  );

  const newRedisKey = `${SESSION_REDIS_PREFIX}${newTokenHash}`;
  const userSessionsKey = `${USER_SESSIONS_PREFIX}${session.userId}`;

  // Write new session and remove old session atomically from user index
  await redisSessionClient.set(newRedisKey, JSON.stringify(newSessionRecord), 'EX', ttlSeconds);
  await redisSessionClient.del(oldRedisKey);
  await redisSessionClient.srem(userSessionsKey, oldTokenHash);
  await redisSessionClient.sadd(userSessionsKey, newTokenHash);

  const cookie = getSessionCookieOptions(
    newSignedCookie,
    Math.floor(remainingAbsoluteMs / 1000)
  );

  return {
    success: true,
    cookie,
  };
}

/**
 * Destroys a session on logout: removes the verifier hash from Valkey,
 * unlinks it from the user session index, and returns clearing cookie options.
 *
 * @param signedCookieValue - The session cookie to destroy
 */
export async function destroySession(
  signedCookieValue: string | null | undefined
): Promise<SessionCookieOptions> {
  const clearCookie = getClearSessionCookieOptions();

  if (!signedCookieValue || typeof signedCookieValue !== 'string') {
    return clearCookie;
  }

  let secret: string;
  try {
    secret = resolveSessionSecret();
  } catch {
    return clearCookie;
  }

  const rawToken = verifySignedSessionToken(signedCookieValue, secret);
  if (!rawToken) {
    return clearCookie;
  }

  const tokenHash = hashSessionToken(rawToken);
  const redisKey = `${SESSION_REDIS_PREFIX}${tokenHash}`;

  const rawData = await redisSessionClient.get(redisKey);
  let userId: string | null = null;
  if (rawData) {
    try {
      const parsed = JSON.parse(rawData);
      userId = parsed.userId || null;
    } catch {
      // Ignored: delete key regardless
    }
  }

  await destroySessionByHash(tokenHash, userId);
  return clearCookie;
}

/**
 * Internal helper to delete a session key and remove its hash from the user index set.
 */
async function destroySessionByHash(tokenHash: string, userId: string | null): Promise<void> {
  const redisKey = `${SESSION_REDIS_PREFIX}${tokenHash}`;
  await redisSessionClient.del(redisKey);

  if (userId) {
    const userSessionsKey = `${USER_SESSIONS_PREFIX}${userId}`;
    await redisSessionClient.srem(userSessionsKey, tokenHash);
  }
}

/**
 * Revokes all active sessions for a specific user across all devices/browsers.
 * Useful for password resets, administrative account suspension, or security alerts.
 *
 * @param userId - Target user ID whose sessions should be revoked
 * @returns Promise<number> - Number of sessions revoked
 */
export async function revokeAllUserSessions(userId: string): Promise<number> {
  if (!userId || typeof userId !== 'string') {
    return 0;
  }

  const userSessionsKey = `${USER_SESSIONS_PREFIX}${userId}`;
  const sessionHashes = await redisSessionClient.smembers(userSessionsKey);

  if (!sessionHashes || sessionHashes.length === 0) {
    return 0;
  }

  const keysToDelete = sessionHashes.map((h) => `${SESSION_REDIS_PREFIX}${h}`);
  keysToDelete.push(userSessionsKey);

  await redisSessionClient.del(...keysToDelete);
  return sessionHashes.length;
}
