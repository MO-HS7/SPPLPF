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
  type AuthVerificationResult,
} from './service';

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
