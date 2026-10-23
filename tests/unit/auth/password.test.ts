import { describe, it, expect } from 'vitest';
import {
  hashPassword,
  verifyPassword,
  needsRehash,
  ARGON2ID_CONFIG,
  ARGON2_ALGORITHM_ID,
  MAX_PASSWORD_LENGTH_BYTES,
} from '@/lib/auth/password';
import { parseOptions, hash as rawHash, type Algorithm } from '@node-rs/argon2';

describe('TASK-010: Argon2id Password Hashing & Verification Foundation', () => {
  const samplePassword = 'StrongInstitutionalPassword!2026';

  describe('Password Hashing & Parameters', () => {
    it('produces a valid PHC-formatted Argon2id hash matching OWASP parameters', async () => {
      const hash = await hashPassword(samplePassword);

      expect(typeof hash).toBe('string');
      // Must use argon2id variant with version 19
      expect(hash.startsWith('$argon2id$v=19$')).toBe(true);

      // Verify explicit parameter adherence (m=65536, t=3, p=4)
      expect(hash).toContain('m=65536,t=3,p=4');

      const parsed = parseOptions(hash);
      expect(parsed.algorithm).toBe(ARGON2ID_CONFIG.algorithm);
      expect(parsed.version).toBe(ARGON2ID_CONFIG.version);
      expect(parsed.memoryCost).toBe(ARGON2ID_CONFIG.memoryCost); // 64 MiB
      expect(parsed.timeCost).toBe(ARGON2ID_CONFIG.timeCost);       // 3 iterations
      expect(parsed.parallelism).toBe(ARGON2ID_CONFIG.parallelism); // 4 threads
      expect(parsed.outputLen).toBe(ARGON2ID_CONFIG.outputLen);     // 32 bytes
      expect(parsed.saltLen).toBe(16);                              // 16-byte salt
    });

    it('generates distinct hashes for identical passwords due to unique salts', async () => {
      const hash1 = await hashPassword(samplePassword);
      const hash2 = await hashPassword(samplePassword);

      expect(hash1).not.toBe(hash2);
      // Both hashes must independently verify the same password
      expect(await verifyPassword(hash1, samplePassword)).toBe(true);
      expect(await verifyPassword(hash2, samplePassword)).toBe(true);
    });

    it('never contains the plaintext password in the stored hash string', async () => {
      const plaintext = 'SuperSecretNGOKeyphrase9981';
      const hash = await hashPassword(plaintext);

      expect(hash.includes(plaintext)).toBe(false);
    });

    it('throws when hashing an empty or non-string password', async () => {
      await expect(hashPassword('')).rejects.toThrow('Password must be a non-empty string');
      // @ts-expect-error - testing invalid input type
      await expect(hashPassword(null)).rejects.toThrow('Password must be a non-empty string');
      // @ts-expect-error - testing invalid input type
      await expect(hashPassword(undefined)).rejects.toThrow('Password must be a non-empty string');
    });

    it('throws when hashing a password that exceeds the maximum byte length', async () => {
      const excessivePassword = 'a'.repeat(MAX_PASSWORD_LENGTH_BYTES + 1);
      await expect(hashPassword(excessivePassword)).rejects.toThrow(
        /exceeds maximum allowable limit/
      );
    });
  });

  describe('Password Verification', () => {
    it('successfully verifies a matching password', async () => {
      const hash = await hashPassword(samplePassword);
      const isValid = await verifyPassword(hash, samplePassword);

      expect(isValid).toBe(true);
    });

    it('rejects an incorrect password', async () => {
      const hash = await hashPassword(samplePassword);
      const isValid = await verifyPassword(hash, 'IncorrectPassword!2026');

      expect(isValid).toBe(false);
    });

    it('is strictly case-sensitive', async () => {
      const hash = await hashPassword('ExactCase123!');
      expect(await verifyPassword(hash, 'exactcase123!')).toBe(false);
      expect(await verifyPassword(hash, 'EXACTCASE123!')).toBe(false);
      expect(await verifyPassword(hash, 'ExactCase123!')).toBe(true);
    });

    it('safely handles empty, nullish, or invalid candidate passwords without throwing', async () => {
      const hash = await hashPassword(samplePassword);

      // @ts-expect-error - testing invalid input
      expect(await verifyPassword(hash, null)).toBe(false);
      // @ts-expect-error - testing invalid input
      expect(await verifyPassword(hash, undefined)).toBe(false);
      expect(await verifyPassword(hash, '')).toBe(false);

      // Candidate exceeding maximum length fails safely
      const excessiveCandidate = 'x'.repeat(MAX_PASSWORD_LENGTH_BYTES + 1);
      expect(await verifyPassword(hash, excessiveCandidate)).toBe(false);
    });

    it('safely handles corrupted, truncated, and malformed hashes without throwing', async () => {
      const malformedHashes = [
        '',
        '   ',
        'not_an_argon_hash',
        '$2b$12$e8uq5X...bcrypt_format',
        '$argon2id$v=19$m=65536,t=3,p=4$corrupted_salt$corrupted_hash',
        '$argon2id$truncated',
        '$argon2i$v=19$m=65536,t=3,p=4$someSalt$someHash', // wrong variant
      ];

      for (const badHash of malformedHashes) {
        const result = await verifyPassword(badHash, samplePassword);
        expect(result).toBe(false);
      }
    });
  });

  describe('Rehash Policy Inspection', () => {
    it('reports needsRehash = false for hashes generated with current parameters', async () => {
      const currentHash = await hashPassword(samplePassword);
      expect(needsRehash(currentHash)).toBe(false);
    });

    it('reports needsRehash = true for legacy or non-matching Argon2 configurations', async () => {
      // Legacy hash generated with lower memory cost (16 MiB instead of 64 MiB)
      const legacyHash = await rawHash(samplePassword, {
        algorithm: ARGON2_ALGORITHM_ID as Algorithm,
        memoryCost: 16384,
        timeCost: 2,
        parallelism: 1,
        outputLen: 32,
      });

      expect(needsRehash(legacyHash)).toBe(true);
    });

    it('reports needsRehash = true for invalid or malformed hash strings', () => {
      expect(needsRehash('malformed_string')).toBe(true);
      expect(needsRehash('')).toBe(true);
      expect(needsRehash('$argon2d$v=19$m=65536,t=3,p=4$salt$hash')).toBe(true);
    });
  });
});
