/**
 * SPPLPF Atomic Sliding-Window Rate Limiter & Brute-Force Defense (TASK-012)
 *
 * Implements atomic sliding-window rate limiting on top of Valkey/Redis DB 0
 * using reviewed Lua scripts to eliminate race conditions under high concurrency.
 *
 * Security & Architectural Controls:
 * - Atomic evaluation via Redis Lua script (ZREMRANGEBYSCORE + ZCARD + ZADD + EXPIRE).
 * - Cryptographic one-way SHA-256 scoping: raw IP addresses, emails, and credentials
 *   are NEVER stored in Redis keys, logs, or metrics.
 * - Dynamic TTL refresh ensures bounded memory retention; keys expire automatically.
 * - Fail-closed error handling: when Valkey is unavailable, rejects attempts safely
 *   rather than allowing unthrottled brute-force access.
 * - Granular bucket separation: supports independent IP buckets, account buckets,
 *   and composite (IP + Account) buckets.
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { redisSessionClient } from '../redis';

export const RATE_LIMIT_LOGIN_MAX_ATTEMPTS = 5;
export const RATE_LIMIT_LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
export const RATE_LIMIT_IP_MAX_ATTEMPTS = 20;
export const RATE_LIMIT_LOCKOUT_DURATION_MS = 30 * 60 * 1000; // 30 minutes

export class RateLimiterError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'RateLimiterError';
  }
}

export interface RateLimitOptions {
  limit?: number;
  windowMs?: number;
  timeProvider?: () => number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  totalAttempts: number;
  retryAfterSeconds: number;
  resetAt: number;
  scopeKey: string;
}

/**
 * Atomic sliding-window increment Lua script.
 * Returns: { allowed (1 or 0), remaining, retryAfterSeconds, totalAttempts }
 */
export const SLIDING_WINDOW_CONSUME_LUA = `
local key = KEYS[1]
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])
local member = ARGV[4]
local ttlSeconds = tonumber(ARGV[5])

local windowStart = now - window

-- 1. Remove expired timestamps outside the sliding window
redis.call('ZREMRANGEBYSCORE', key, '-inf', windowStart)

-- 2. Count current attempts within window
local currentAttempts = redis.call('ZCARD', key)

if currentAttempts < limit then
  -- Allow attempt: record timestamp in sorted set
  redis.call('ZADD', key, now, member)
  redis.call('EXPIRE', key, ttlSeconds)
  local remaining = limit - (currentAttempts + 1)
  return { 1, remaining, 0, currentAttempts + 1 }
else
  -- Deny attempt: determine earliest attempt to compute retryAfter
  local oldest = redis.call('ZRANGE', key, 0, 0, 'WITHSCORES')
  local retryAfterMs = window
  if oldest and #oldest >= 2 then
    local oldestScore = tonumber(oldest[2])
    retryAfterMs = (oldestScore + window) - now
    if retryAfterMs < 0 then
      retryAfterMs = 0
    end
  end
  redis.call('EXPIRE', key, ttlSeconds)
  local retryAfterSeconds = math.ceil(retryAfterMs / 1000)
  if retryAfterSeconds <= 0 then
    retryAfterSeconds = 1
  end
  return { 0, 0, retryAfterSeconds, currentAttempts }
end
`;

/**
 * Read-only sliding-window inspection Lua script.
 * Returns: { allowed (1 or 0), remaining, retryAfterSeconds, totalAttempts }
 */
export const SLIDING_WINDOW_CHECK_LUA = `
local key = KEYS[1]
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])

local windowStart = now - window
redis.call('ZREMRANGEBYSCORE', key, '-inf', windowStart)
local currentAttempts = redis.call('ZCARD', key)

if currentAttempts < limit then
  return { 1, limit - currentAttempts, 0, currentAttempts }
else
  local oldest = redis.call('ZRANGE', key, 0, 0, 'WITHSCORES')
  local retryAfterMs = window
  if oldest and #oldest >= 2 then
    local oldestScore = tonumber(oldest[2])
    retryAfterMs = (oldestScore + window) - now
    if retryAfterMs < 0 then retryAfterMs = 0 end
  end
  local retryAfterSeconds = math.ceil(retryAfterMs / 1000)
  if retryAfterSeconds <= 0 then retryAfterSeconds = 1 end
  return { 0, 0, retryAfterSeconds, currentAttempts }
end
`;

/**
 * Resolves the dedicated HMAC secret for rate-limit key derivation.
 *
 * Precedence:
 * 1. Container secret file: /run/secrets/rate_limit_secret
 * 2. Local workspace secret file: secrets/rate_limit_secret.txt
 * 3. Environment variable: RATE_LIMIT_SECRET
 * 4. Production guard: Fails closed immediately if missing or < 32 bytes in production.
 * 5. Development fallback: Non-production deterministic secret.
 */
export function resolveRateLimitSecret(): string {
  // 1. Container secret mount
  if (fs.existsSync('/run/secrets/rate_limit_secret')) {
    const s = fs.readFileSync('/run/secrets/rate_limit_secret', 'utf8').trim();
    if (s) return validateRateLimitSecret(s);
  }

  // 2. Local workspace secret file
  const localSecretPath = path.resolve(process.cwd(), 'secrets/rate_limit_secret.txt');
  if (fs.existsSync(localSecretPath)) {
    const s = fs.readFileSync(localSecretPath, 'utf8').trim();
    if (s) return validateRateLimitSecret(s);
  }

  // 3. Environment variable
  if (process.env.RATE_LIMIT_SECRET) {
    return validateRateLimitSecret(process.env.RATE_LIMIT_SECRET.trim());
  }

  // 4. Fail closed in production
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'RATE_LIMIT_SECRET is required in production environment (must be at least 32 characters).'
    );
  }

  // 5. Development/testing fallback (>= 32 bytes)
  return 'spplpf_dev_rate_limit_hmac_secret_min_32_bytes_2026';
}

/**
 * Validates that a rate limit secret satisfies minimal cryptographic length requirements.
 */
export function validateRateLimitSecret(secret: string): string {
  if (!secret || typeof secret !== 'string') {
    throw new Error('Rate limit key secret cannot be empty.');
  }
  if (process.env.NODE_ENV === 'production' && Buffer.byteLength(secret, 'utf8') < 32) {
    throw new Error('Rate limit key secret must be at least 32 bytes (256 bits) in production.');
  }
  return secret;
}

export type RateLimitDomain = 'account' | 'ip' | 'pair';

/**
 * Derives a domain-separated, keyed HMAC-SHA-256 rate-limit bucket key.
 *
 * Security guarantees:
 * - Cryptographic domain separation prevents cross-domain collision between account, IP, and pair scopes.
 * - Keyed HMAC prevents dictionary/rainbow-table attacks against rate limit keys in Redis.
 * - Raw emails, IP addresses, passwords, or session tokens are never stored plaintext.
 */
export function deriveRateLimitKey(
  domain: RateLimitDomain,
  identifier: string,
  secretOverride?: string
): string {
  const secret = secretOverride ?? resolveRateLimitSecret();
  const normalized = identifier.trim().toLowerCase();
  const domainPrefix = `SPPLPF_RL_V1_${domain.toUpperCase()}:`;

  const hmac = crypto
    .createHmac('sha256', secret)
    .update(domainPrefix + normalized)
    .digest('hex')
    .slice(0, 32);

  return `rl:${domain}:${hmac}`;
}

/**
 * Legacy compatibility wrapper that derives a rate-limit key.
 */
export function hashRateLimitIdentifier(
  scope: string,
  identifier: string,
  secretOverride?: string
): string {
  const domain: RateLimitDomain =
    scope === 'ip' ? 'ip' : scope === 'pair' ? 'pair' : 'account';
  return deriveRateLimitKey(domain, identifier, secretOverride);
}

export type RateLimitScopeType = 'login_account' | 'login_ip' | 'login_pair';

/**
 * Builds standard scoped rate-limit keys with domain separation and HMAC keying.
 */
export function buildRateLimitScopeKey(
  scope: RateLimitScopeType,
  parts: { email?: string; ip?: string },
  secretOverride?: string
): string {
  switch (scope) {
    case 'login_account':
      return deriveRateLimitKey('account', parts.email ?? 'unknown', secretOverride);
    case 'login_ip':
      return deriveRateLimitKey('ip', parts.ip ?? '127.0.0.1', secretOverride);
    case 'login_pair':
      return deriveRateLimitKey(
        'pair',
        `${parts.ip ?? '127.0.0.1'}|${parts.email ?? 'unknown'}`,
        secretOverride
      );
  }
}

/**
 * Atomically consumes an attempt in the sliding window.
 * Returns whether the request was allowed, remaining attempts, and retry timing.
 * Fails closed if Valkey/Redis encounters an error.
 */
export async function consumeRateLimit(
  scopeKey: string,
  options?: RateLimitOptions
): Promise<RateLimitResult> {
  const limit = options?.limit ?? RATE_LIMIT_LOGIN_MAX_ATTEMPTS;
  const windowMs = options?.windowMs ?? RATE_LIMIT_LOGIN_WINDOW_MS;
  const now = options?.timeProvider ? options.timeProvider() : Date.now();
  const member = `${now}:${crypto.randomBytes(8).toString('hex')}`;
  const ttlSeconds = Math.ceil(windowMs / 1000) + 60; // 60s retention margin

  try {
    const rawResult = await redisSessionClient.eval(
      SLIDING_WINDOW_CONSUME_LUA,
      1,
      scopeKey,
      now.toString(),
      windowMs.toString(),
      limit.toString(),
      member,
      ttlSeconds.toString()
    );

    const [allowedNum, remaining, retryAfterSeconds, totalAttempts] = rawResult as [
      number,
      number,
      number,
      number,
    ];

    return {
      allowed: allowedNum === 1,
      remaining: Math.max(0, remaining),
      totalAttempts,
      retryAfterSeconds,
      resetAt: now + (retryAfterSeconds > 0 ? retryAfterSeconds * 1000 : windowMs),
      scopeKey,
    };
  } catch (err) {
    console.error('[RateLimiter] Valkey rate limit consumption failed:', (err as Error).message);
    throw new RateLimiterError('Rate limiter service unavailable', err);
  }
}

/**
 * Inspects rate limit state without consuming an attempt.
 */
export async function checkRateLimit(
  scopeKey: string,
  options?: RateLimitOptions
): Promise<RateLimitResult> {
  const limit = options?.limit ?? RATE_LIMIT_LOGIN_MAX_ATTEMPTS;
  const windowMs = options?.windowMs ?? RATE_LIMIT_LOGIN_WINDOW_MS;
  const now = options?.timeProvider ? options.timeProvider() : Date.now();

  try {
    const rawResult = await redisSessionClient.eval(
      SLIDING_WINDOW_CHECK_LUA,
      1,
      scopeKey,
      now.toString(),
      windowMs.toString(),
      limit.toString()
    );

    const [allowedNum, remaining, retryAfterSeconds, totalAttempts] = rawResult as [
      number,
      number,
      number,
      number,
    ];

    return {
      allowed: allowedNum === 1,
      remaining: Math.max(0, remaining),
      totalAttempts,
      retryAfterSeconds,
      resetAt: now + (retryAfterSeconds > 0 ? retryAfterSeconds * 1000 : windowMs),
      scopeKey,
    };
  } catch (err) {
    console.error('[RateLimiter] Valkey rate limit check failed:', (err as Error).message);
    throw new RateLimiterError('Rate limiter service unavailable', err);
  }
}

/**
 * Resets a rate limit bucket (e.g. after successful password verification).
 */
export async function resetRateLimit(scopeKey: string): Promise<void> {
  try {
    await redisSessionClient.del(scopeKey);
  } catch (err) {
    console.error('[RateLimiter] Failed to reset rate limit bucket:', (err as Error).message);
  }
}
