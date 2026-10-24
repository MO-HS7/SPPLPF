import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  generateRawSessionToken,
  hashSessionToken,
  signSessionToken,
  verifySignedSessionToken,
  validateSessionSecret,
  getSessionCookieOptions,
  getClearSessionCookieOptions,
  SESSION_COOKIE_NAME,
  SESSION_IDLE_TIMEOUT_MS,
  SESSION_ABSOLUTE_LIFETIME_MS,
} from '@/lib/auth/session';

describe('TASK-011 Unit Tests: Session Management & Cookie Lifecycle', () => {
  const validSecret = 'a-super-secret-high-entropy-session-key-32bytes!';
  const sampleToken = 'dGVzdF9yYXdfc2Vzc2lvbl90b2tlbl8yNTZiaXRzXw';

  describe('Session Secret Validation & Fail-Closed Policy', () => {
    it('accepts secrets with at least 32 bytes (256 bits) of entropy', () => {
      expect(() => validateSessionSecret(validSecret)).not.toThrow();
    });

    it('rejects secrets shorter than 32 bytes', () => {
      expect(() => validateSessionSecret('too-short-secret-key')).toThrow(
        /entropy insufficient/
      );
    });

    it('rejects empty or non-string secrets', () => {
      expect(() => validateSessionSecret('')).toThrow(
        /must be a non-empty string/
      );
      // @ts-expect-error - testing invalid input
      expect(() => validateSessionSecret(null)).toThrow(
        /must be a non-empty string/
      );
    });
  });

  describe('Token Generation, Hashing & Cryptographic Signing', () => {
    it('generates high-entropy base64url raw session tokens', () => {
      const token1 = generateRawSessionToken();
      const token2 = generateRawSessionToken();

      expect(typeof token1).toBe('string');
      expect(token1.length).toBeGreaterThanOrEqual(43); // 32 bytes base64url encoded
      expect(token1).not.toBe(token2);
    });

    it('produces a deterministic one-way SHA-256 verifier hash', () => {
      const hash1 = hashSessionToken(sampleToken);
      const hash2 = hashSessionToken(sampleToken);

      expect(hash1).toBe(hash2);
      expect(hash1).toMatch(/^[a-f0-9]{64}$/); // 64 hex characters (256-bit SHA-256)
      // Hash must never expose raw token
      expect(hash1).not.toContain(sampleToken);
    });

    it('signs and verifies a valid session token', () => {
      const signed = signSessionToken(sampleToken, validSecret);
      expect(signed).toContain('.');

      const verified = verifySignedSessionToken(signed, validSecret);
      expect(verified).toBe(sampleToken);
    });

    it('rejects a tampered raw token payload', () => {
      const signed = signSessionToken(sampleToken, validSecret);
      const parts = signed.split('.');
      const tampered = `tampered_${parts[0]}.${parts[1]}`;

      const verified = verifySignedSessionToken(tampered, validSecret);
      expect(verified).toBeNull();
    });

    it('rejects a tampered or forged signature', () => {
      const signed = signSessionToken(sampleToken, validSecret);
      const parts = signed.split('.');
      const tamperedSig = `${parts[0]}.forged_signature_here`;

      const verified = verifySignedSessionToken(tamperedSig, validSecret);
      expect(verified).toBeNull();
    });

    it('rejects a token signed with a different secret', () => {
      const signed = signSessionToken(sampleToken, validSecret);
      const otherSecret = 'another-secret-key-that-has-over-32-bytes-length!';

      const verified = verifySignedSessionToken(signed, otherSecret);
      expect(verified).toBeNull();
    });

    it('safely handles malformed strings without throwing', () => {
      const malformedCases = [
        '',
        '   ',
        'no_dot_in_string',
        '.starts_with_dot',
        'ends_with_dot.',
        'multiple.dots.in.string.invalid',
      ];

      for (const badToken of malformedCases) {
        expect(verifySignedSessionToken(badToken, validSecret)).toBeNull();
      }

      // @ts-expect-error - testing invalid type
      expect(verifySignedSessionToken(null, validSecret)).toBeNull();
      // @ts-expect-error - testing invalid type
      expect(verifySignedSessionToken(undefined, validSecret)).toBeNull();
    });
  });

  describe('Session Cookie Security Attributes', () => {
    it('sets strictly compliant security flags on active session cookies', () => {
      const cookie = getSessionCookieOptions('signed_cookie_val', 28800);

      expect(cookie.name).toBe(SESSION_COOKIE_NAME);
      expect(cookie.value).toBe('signed_cookie_val');
      expect(cookie.httpOnly).toBe(true);
      expect(cookie.sameSite).toBe('strict');
      expect(cookie.path).toBe('/');
      expect(cookie.maxAge).toBe(28800);
      expect(typeof cookie.secure).toBe('boolean');
    });

    it('generates immediate invalidation options for cookie clearing', () => {
      const clearCookie = getClearSessionCookieOptions();

      expect(clearCookie.name).toBe(SESSION_COOKIE_NAME);
      expect(clearCookie.value).toBe('');
      expect(clearCookie.httpOnly).toBe(true);
      expect(clearCookie.sameSite).toBe('strict');
      expect(clearCookie.path).toBe('/');
      expect(clearCookie.maxAge).toBe(0);
      expect(clearCookie.expires).toEqual(new Date(0));
    });
  });

  describe('Configured Expiry Windows', () => {
    it('enforces 30-minute idle and 8-hour absolute limits', () => {
      expect(SESSION_IDLE_TIMEOUT_MS).toBe(30 * 60 * 1000); // 1,800,000 ms
      expect(SESSION_ABSOLUTE_LIFETIME_MS).toBe(8 * 60 * 60 * 1000); // 28,800,000 ms
    });
  });
});
