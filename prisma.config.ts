import 'dotenv/config';
import { defineConfig } from 'prisma/config';
import fs from 'node:fs';
import path from 'node:path';

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
  return '';
}

function resolveDatabaseUrl(): string {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  const host = process.env.POSTGRES_HOST || '127.0.0.1';
  const port = process.env.POSTGRES_PORT || '5432';
  const user = process.env.POSTGRES_USER || 'spplpf_user';
  // Target spplpf_dev by default for local development & migration safety
  const database = process.env.POSTGRES_DB || 'spplpf_dev';
  const password = resolveDatabasePassword();
  return `postgresql://${user}:${encodeURIComponent(password)}@${host}:${port}/${database}?schema=public`;
}

function resolveShadowDatabaseUrl(): string | undefined {
  if (process.env.SHADOW_DATABASE_URL) {
    return process.env.SHADOW_DATABASE_URL;
  }
  const host = process.env.POSTGRES_HOST || '127.0.0.1';
  const port = process.env.POSTGRES_PORT || '5432';
  const user = process.env.POSTGRES_USER || 'spplpf_user';
  const shadowDatabase = process.env.POSTGRES_SHADOW_DB || 'spplpf_shadow';
  const password = resolveDatabasePassword();
  if (!password) {
    return undefined;
  }
  return `postgresql://${user}:${encodeURIComponent(password)}@${host}:${port}/${shadowDatabase}?schema=public`;
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'npx tsx prisma/seed.ts',
  },
  datasource: {
    url: resolveDatabaseUrl(),
    shadowDatabaseUrl: resolveShadowDatabaseUrl(),
  },
});
