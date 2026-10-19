import 'dotenv/config';
import { defineConfig } from 'prisma/config';
import fs from 'node:fs';

function resolveDatabaseUrl(): string {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  const host = process.env.POSTGRES_HOST || 'localhost';
  const port = process.env.POSTGRES_PORT || '5432';
  const user = process.env.POSTGRES_USER || 'spplpf_user';
  const database = process.env.POSTGRES_DB || 'spplpf_prod';
  let password = process.env.DB_PASSWORD || '';
  if (fs.existsSync('/run/secrets/db_password')) {
    password = fs.readFileSync('/run/secrets/db_password', 'utf8').trim();
  }
  return `postgresql://${user}:${encodeURIComponent(password)}@${host}:${port}/${database}?schema=public`;
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: resolveDatabaseUrl(),
  },
});
