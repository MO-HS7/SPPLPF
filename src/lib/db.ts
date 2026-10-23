/**
 * SPPLPF Centralized Database Accessor (Prisma 7 + Driver Adapter)
 *
 * Configures the Prisma Client with the official PostgreSQL driver adapter (@prisma/adapter-pg)
 * and resolves credentials from local secret files or environment variables without credential logging.
 */

import fs from 'node:fs';
import path from 'node:path';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma-client';

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

function createPrismaClient(): PrismaClient {
  const host = process.env.POSTGRES_HOST || '127.0.0.1';
  const port = parseInt(process.env.POSTGRES_PORT || '5432', 10);
  const user = process.env.POSTGRES_USER || 'spplpf_user';
  // Use spplpf_dev for local development/testing unless explicitly overridden
  const database = process.env.POSTGRES_DB || 'spplpf_dev';
  const password = resolveDatabasePassword();

  const adapter = new PrismaPg({
    host,
    port,
    user,
    database,
    password,
  });

  return new PrismaClient({ adapter });
}

// Preserve singleton across Next.js / Turbopack hot reloads in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
