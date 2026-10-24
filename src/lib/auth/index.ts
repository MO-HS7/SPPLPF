export {
  ARGON2ID_CONFIG,
  MAX_PASSWORD_LENGTH_BYTES,
  hashPassword,
  verifyPassword,
  needsRehash,
} from './password';

export {
  authenticateWithPassword,
  type AuthenticatedUser,
  type AuthenticateOptions,
  type AuthVerificationResult,
} from './service';

export {
  RATE_LIMIT_LOGIN_MAX_ATTEMPTS,
  RATE_LIMIT_LOGIN_WINDOW_MS,
  RATE_LIMIT_IP_MAX_ATTEMPTS,
  RATE_LIMIT_LOCKOUT_DURATION_MS,
  RateLimiterError,
  type RateLimitOptions,
  type RateLimitResult,
  type RateLimitScopeType,
  hashRateLimitIdentifier,
  buildRateLimitScopeKey,
  consumeRateLimit,
  checkRateLimit,
  resetRateLimit,
} from './rate-limiter';

export {
  SESSION_COOKIE_NAME,
  SESSION_IDLE_TIMEOUT_MS,
  SESSION_ABSOLUTE_LIFETIME_MS,
  type SessionRecord,
  type SessionCookieOptions,
  type SessionValidationResult,
  resolveSessionSecret,
  validateSessionSecret,
  generateRawSessionToken,
  hashSessionToken,
  signSessionToken,
  verifySignedSessionToken,
  getSessionCookieOptions,
  getClearSessionCookieOptions,
  createSession,
  validateSession,
  rotateSession,
  destroySession,
  revokeAllUserSessions,
} from './session';
