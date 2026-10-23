/**
 * SPPLPF Argon2id Password Hashing and Verification Module
 *
 * Conforms to OWASP Password Storage Cheat Sheet & SPPLPF Architecture Plan:
 * - Algorithm: Argon2id (hybrid TMTO and side-channel resistant variant)
 * - Memory cost: 64 MiB (65,536 KiB)
 * - Time cost: 3 iterations
 * - Parallelism: 4 threads
 * - Output length: 32 bytes (256-bit digest)
 * - Salt: Cryptographically secure 16-byte random salt generated per hash
 */

import {
  hash as argon2Hash,
  verify as argon2Verify,
  parseOptions,
  type Algorithm,
  type Version,
} from '@node-rs/argon2';

/**
 * Argon2 algorithm variants:
 * 0 = Argon2d, 1 = Argon2i, 2 = Argon2id
 */
export const ARGON2_ALGORITHM_ID = 2; // Algorithm.Argon2id

/**
 * Argon2 format version:
 * 0 = 0x10, 1 = 0x13 (v19)
 */
export const ARGON2_VERSION_19 = 1; // Version.V0x13

/**
 * Explicit, documented Argon2id parameters per project security specification.
 * Memory: 64 MiB (m=65536), Iterations: 3 (t=3), Parallelism: 4 (p=4), Output: 32 bytes.
 */
export const ARGON2ID_CONFIG = Object.freeze({
  algorithm: ARGON2_ALGORITHM_ID as Algorithm,
  version: ARGON2_VERSION_19 as Version,
  memoryCost: 65536,
  timeCost: 3,
  parallelism: 4,
  outputLen: 32,
} as const);

/**
 * Maximum password length to prevent algorithmic resource-exhaustion Denial of Service.
 */
export const MAX_PASSWORD_LENGTH_BYTES = 1024;

/**
 * Hashes a plaintext password using Argon2id with explicit OWASP parameters.
 * Automatically generates a cryptographically secure 16-byte random salt.
 *
 * @param plaintext - The raw password string to hash
 * @returns Promise<string> - The standard PHC-formatted Argon2id hash string
 * @throws Error - If input is empty, invalid, or exceeds length limit
 */
export async function hashPassword(plaintext: string): Promise<string> {
  if (typeof plaintext !== 'string' || plaintext.length === 0) {
    throw new Error('Password must be a non-empty string');
  }

  const byteLength = Buffer.byteLength(plaintext, 'utf8');
  if (byteLength > MAX_PASSWORD_LENGTH_BYTES) {
    throw new Error(`Password length (${byteLength} bytes) exceeds maximum allowable limit of ${MAX_PASSWORD_LENGTH_BYTES} bytes`);
  }

  // Use explicit parameters; salt is generated securely by native implementation
  return argon2Hash(plaintext, {
    algorithm: ARGON2ID_CONFIG.algorithm,
    version: ARGON2ID_CONFIG.version,
    memoryCost: ARGON2ID_CONFIG.memoryCost,
    timeCost: ARGON2ID_CONFIG.timeCost,
    parallelism: ARGON2ID_CONFIG.parallelism,
    outputLen: ARGON2ID_CONFIG.outputLen,
  });
}

/**
 * Verifies a candidate password against an Argon2id hash string.
 * Employs safe failure handling: malformed, invalid, or corrupted hashes
 * always return false without throwing unexpected errors or leaking internal details.
 *
 * @param passwordHash - The stored PHC Argon2id hash string
 * @param candidate - The plaintext password to test
 * @returns Promise<boolean> - True if password matches hash, false otherwise
 */
export async function verifyPassword(
  passwordHash: string,
  candidate: string
): Promise<boolean> {
  // Guard against missing, empty, or non-string inputs
  if (
    typeof passwordHash !== 'string' ||
    typeof candidate !== 'string' ||
    passwordHash.trim().length === 0 ||
    candidate.length === 0
  ) {
    return false;
  }

  // Must begin with $argon2id$
  if (!passwordHash.startsWith('$argon2id$')) {
    return false;
  }

  // Guard against excessive candidate length
  if (Buffer.byteLength(candidate, 'utf8') > MAX_PASSWORD_LENGTH_BYTES) {
    return false;
  }

  try {
    return await argon2Verify(passwordHash, candidate);
  } catch {
    // Treat any parsing, format, or decoding failure as a verification mismatch
    return false;
  }
}

/**
 * Inspects a stored hash to determine if its parameters deviate from the current
 * security configuration, indicating that the hash should be regenerated upon login.
 *
 * @param passwordHash - The stored PHC Argon2id hash string
 * @returns boolean - True if the hash needs upgrading/rehashing, false if it matches current policy
 */
export function needsRehash(passwordHash: string): boolean {
  if (typeof passwordHash !== 'string' || !passwordHash.startsWith('$argon2id$')) {
    return true;
  }

  try {
    const opts = parseOptions(passwordHash);
    return (
      opts.algorithm !== ARGON2ID_CONFIG.algorithm ||
      opts.version !== ARGON2ID_CONFIG.version ||
      opts.memoryCost !== ARGON2ID_CONFIG.memoryCost ||
      opts.timeCost !== ARGON2ID_CONFIG.timeCost ||
      opts.parallelism !== ARGON2ID_CONFIG.parallelism ||
      opts.outputLen !== ARGON2ID_CONFIG.outputLen
    );
  } catch {
    return true;
  }
}
