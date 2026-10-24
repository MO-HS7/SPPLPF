/**
 * SPPLPF Centralized Valkey / Redis Datastore Client
 *
 * Implements partitioned connections across Redis logical databases per architecture specification:
 * - DB 0: Authentication Sessions, MFA Verification States, Rate Limiting, Emergency Takedown Guard
 * - DB 1: Application Cache, Query Cache, On-Demand ISR Invalidation Tags
 *
 * Fully decoupled wire protocol: 100% agnostic to whether Valkey or Redis runs in container.
 */

import fs from 'node:fs';
import path from 'node:path';
import Redis from 'ioredis';

function resolveRedisPassword(): string {
  // 1. Container secret mount
  if (fs.existsSync('/run/secrets/redis_password')) {
    return fs.readFileSync('/run/secrets/redis_password', 'utf8').trim();
  }
  // 2. Local workspace secret file
  const localSecretPath = path.resolve(process.cwd(), 'secrets/redis_password.txt');
  if (fs.existsSync(localSecretPath)) {
    return fs.readFileSync(localSecretPath, 'utf8').trim();
  }
  // 3. Environment variable fallback
  if (process.env.REDIS_PASSWORD) {
    return process.env.REDIS_PASSWORD.trim();
  }
  return '';
}

function createRedisClient(db: number): Redis {
  const host = process.env.REDIS_HOST || '127.0.0.1';
  const port = parseInt(process.env.REDIS_PORT || '6379', 10);
  const password = resolveRedisPassword();

  return new Redis({
    host,
    port,
    password: password || undefined,
    db,
    connectTimeout: 5000,
    maxRetriesPerRequest: 3,
    lazyConnect: true,
  });
}

// Preserve singletons across Next.js / Turbopack hot reloads in development
const globalForRedis = globalThis as unknown as {
  redisSessionClient: Redis | undefined;
  redisCacheClient: Redis | undefined;
};

// DB 0: Auth sessions, rate limiting, and temporary security tokens
export const redisSessionClient: Redis =
  globalForRedis.redisSessionClient ?? createRedisClient(0);

// DB 1: Content query cache, ISR tags
export const redisCacheClient: Redis =
  globalForRedis.redisCacheClient ?? createRedisClient(1);

if (process.env.NODE_ENV !== 'production') {
  globalForRedis.redisSessionClient = redisSessionClient;
  globalForRedis.redisCacheClient = redisCacheClient;
}
