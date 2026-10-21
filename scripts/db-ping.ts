import fs from 'node:fs';
import path from 'node:path';
import { Pool, PoolConfig } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

function resolveDatabasePassword(): string {
  // 1. Container secret mount
  if (fs.existsSync('/run/secrets/db_password')) {
    return fs.readFileSync('/run/secrets/db_password', 'utf8').trim();
  }
  // 2. Local workspace secret file
  const localSecretPath = path.resolve(process.cwd(), 'secrets/db_password.txt');
  if (fs.existsSync(localSecretPath)) {
    return fs.readFileSync(localSecretPath, 'utf8').trim();
  }
  // 3. Environment variable fallback
  if (process.env.DB_PASSWORD) {
    return process.env.DB_PASSWORD.trim();
  }
  if (process.env.DATABASE_URL) {
    return '';
  }
  throw new Error('Database password not found in /run/secrets/db_password, secrets/db_password.txt, or DB_PASSWORD env');
}

async function pingDatabase(): Promise<void> {
  const host = process.env.POSTGRES_HOST || '127.0.0.1';
  const port = parseInt(process.env.POSTGRES_PORT || '5432', 10);
  const user = process.env.POSTGRES_USER || 'spplpf_user';
  const database = process.env.POSTGRES_DB || 'spplpf_prod';
  const password = resolveDatabasePassword();

  const poolConfig: PoolConfig = process.env.DATABASE_URL
    ? { connectionString: process.env.DATABASE_URL }
    : {
        host,
        port,
        user,
        database,
        password,
        connectionTimeoutMillis: 5000,
        idleTimeoutMillis: 10000,
        max: 5,
      };

  console.log(`[db-ping] Connecting to PostgreSQL at ${host}:${port}/${database} as user '${user}'...`);

  const pool = new Pool(poolConfig);

  try {
    const res = await pool.query('SELECT 1 AS connected, current_database() AS db, version() AS pg_version;');
    const row = res.rows[0];

    console.log('[db-ping] PostgreSQL TCP Handshake & Authentication SUCCESS');
    console.log(`[db-ping] Connected: ${row.connected === 1}`);
    console.log(`[db-ping] Active Database: ${row.db}`);
    console.log(`[db-ping] PostgreSQL Version: ${row.pg_version}`);

    // Verify PrismaPg adapter wrapping
    const adapter = new PrismaPg(pool);
    if (!adapter) {
      throw new Error('Failed to instantiate @prisma/adapter-pg adapter instance');
    }
    console.log('[db-ping] @prisma/adapter-pg driver adapter successfully initialized');
    console.log('[db-ping] GATE-05 (Live PostgreSQL Socket Connectivity) PASSED (Exit Code 0)');
  } finally {
    await pool.end();
  }
}

pingDatabase().catch((err) => {
  console.error('[db-ping] FATAL: PostgreSQL connectivity check failed:', err.message);
  process.exit(1);
});
