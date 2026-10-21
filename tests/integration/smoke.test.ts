import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import Redis from 'ioredis';

function getDbPassword(): string {
  if (fs.existsSync('/run/secrets/db_password')) {
    return fs.readFileSync('/run/secrets/db_password', 'utf8').trim();
  }
  const localSecret = path.resolve(process.cwd(), 'secrets/db_password.txt');
  if (fs.existsSync(localSecret)) {
    return fs.readFileSync(localSecret, 'utf8').trim();
  }
  if (process.env.DB_PASSWORD) {
    return process.env.DB_PASSWORD.trim();
  }
  return '';
}

function getRedisPassword(): string {
  if (fs.existsSync('/run/secrets/redis_password')) {
    return fs.readFileSync('/run/secrets/redis_password', 'utf8').trim();
  }
  const localSecret = path.resolve(process.cwd(), 'secrets/redis_password.txt');
  if (fs.existsSync(localSecret)) {
    return fs.readFileSync(localSecret, 'utf8').trim();
  }
  if (process.env.REDIS_PASSWORD) {
    return process.env.REDIS_PASSWORD.trim();
  }
  return '';
}

describe('Phase 06 Datastore Runtime Integration Smoke Tests (GATE-04 & GATE-05)', () => {
  let pgPool: Pool;
  let redisClient: Redis;

  beforeAll(() => {
    pgPool = new Pool({
      host: process.env.POSTGRES_HOST || '127.0.0.1',
      port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
      user: process.env.POSTGRES_USER || 'spplpf_user',
      database: process.env.POSTGRES_DB || 'spplpf_prod',
      password: getDbPassword(),
      connectionTimeoutMillis: 5000,
      max: 2,
    });

    redisClient = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: getRedisPassword(),
      connectTimeout: 5000,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });
  });

  afterAll(async () => {
    if (pgPool) {
      await pgPool.end();
    }
    if (redisClient) {
      redisClient.disconnect();
    }
  });

  it('connects to PostgreSQL 17 and validates server metadata and extensions', async () => {
    const res = await pgPool.query('SELECT 1 AS connected, current_database() AS db, version() AS version;');
    expect(res.rows).toHaveLength(1);
    expect(res.rows[0].connected).toBe(1);
    expect(res.rows[0].db).toBe('spplpf_prod');
    expect(res.rows[0].version).toMatch(/PostgreSQL 17/i);

    // Verify pg_trgm extension was installed by docker-entrypoint-initdb.d
    const extRes = await pgPool.query("SELECT extname FROM pg_extension WHERE extname = 'pg_trgm';");
    expect(extRes.rows).toHaveLength(1);
    expect(extRes.rows[0].extname).toBe('pg_trgm');
  });

  it('instantiates @prisma/adapter-pg driver adapter with live pool', () => {
    const adapter = new PrismaPg(pgPool);
    expect(adapter).toBeDefined();
    expect(adapter.adapterName).toBe('@prisma/adapter-pg');
  });

  it('connects to Valkey/Redis cache datastore and executes authenticated read/write', async () => {
    await redisClient.connect();
    const pingResponse = await redisClient.ping();
    expect(pingResponse).toBe('PONG');

    const testKey = 'smoke:spplpf:integration_test';
    const testVal = `valkey_test_${Date.now()}`;
    await redisClient.set(testKey, testVal, 'EX', 10);

    const retrievedVal = await redisClient.get(testKey);
    expect(retrievedVal).toBe(testVal);

    await redisClient.del(testKey);
  });
});
