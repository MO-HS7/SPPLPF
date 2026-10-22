import fs from 'node:fs';
import path from 'node:path';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma-client';

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

// System permission definitions (stable unique tokens)
const SYSTEM_PERMISSIONS = [
  { token: 'users.manage', description: 'Manage institutional user accounts and status' },
  { token: 'roles.manage', description: 'Configure system roles and permission assignments' },
  { token: 'content.create', description: 'Draft and author institutional content items' },
  { token: 'content.edit', description: 'Edit existing content items and drafts' },
  { token: 'content.review', description: 'Review, approve, or reject content submissions' },
  { token: 'content.publish', description: 'Publish approved content to public portal' },
  { token: 'content.archive', description: 'Archive or retire published content items' },
  { token: 'media.upload', description: 'Upload, tag, and organize media assets' },
  { token: 'media.delete', description: 'Delete or purge media assets' },
  { token: 'settings.manage', description: 'Manage institutional portal settings and keys' },
  { token: 'audit.view', description: 'View system audit trails and workflow transition logs' },
  { token: 'inquiries.manage', description: 'View and respond to public contact submissions' },
];

// System role definitions (stable unique names)
const SYSTEM_ROLES = [
  {
    name: 'SUPER_ADMIN',
    description: 'System-wide governance, configuration, and security management',
    permissionTokens: [
      'users.manage',
      'roles.manage',
      'content.create',
      'content.edit',
      'content.review',
      'content.publish',
      'content.archive',
      'media.upload',
      'media.delete',
      'settings.manage',
      'audit.view',
      'inquiries.manage',
    ],
  },
  {
    name: 'CONTENT_MANAGER',
    description: 'Editorial oversight, content workflow approvals, and publishing control',
    permissionTokens: [
      'content.create',
      'content.edit',
      'content.review',
      'content.publish',
      'content.archive',
      'media.upload',
      'inquiries.manage',
    ],
  },
  {
    name: 'CONTENT_AUTHOR',
    description: 'Authoring and drafting content submissions for editorial review',
    permissionTokens: ['content.create', 'content.edit', 'media.upload'],
  },
  {
    name: 'AUDITOR',
    description: 'Read-only access to audit trails, workflow transitions, and compliance logs',
    permissionTokens: ['audit.view'],
  },
];

async function seed(): Promise<void> {
  const host = process.env.POSTGRES_HOST || '127.0.0.1';
  const port = parseInt(process.env.POSTGRES_PORT || '5432', 10);
  const user = process.env.POSTGRES_USER || 'spplpf_user';
  const database = process.env.POSTGRES_DB || 'spplpf_dev';
  const password = resolveDatabasePassword();

  // Safety check: ensure seed is targeting the development database
  if (database === 'spplpf_prod' && process.env.ALLOW_PROD_SEED !== 'true') {
    throw new Error(
      `ABORT: Seeding aborted because target database is '${database}'. Direct seeding of production is prohibited.`
    );
  }

  console.log(`[seed] Initializing idempotent seed against target database: ${host}:${port}/${database}`);

  const adapter = new PrismaPg({
    host,
    port,
    user,
    database,
    password,
  });
  const prisma = new PrismaClient({ adapter });

  try {
    // 1. Seed Permissions idempotently using unique 'token'
    console.log(`[seed] Upserting ${SYSTEM_PERMISSIONS.length} system permission tokens...`);
    const permissionMap = new Map<string, string>();

    for (const perm of SYSTEM_PERMISSIONS) {
      const record = await prisma.permission.upsert({
        where: { token: perm.token },
        update: { description: perm.description },
        create: {
          token: perm.token,
          description: perm.description,
        },
      });
      permissionMap.set(perm.token, record.id);
    }
    console.log(`[seed] Permissions verified: ${permissionMap.size} tokens active.`);

    // 2. Seed Roles and RolePermission associations idempotently
    console.log(`[seed] Upserting ${SYSTEM_ROLES.length} system roles and role-permission mappings...`);
    for (const roleDef of SYSTEM_ROLES) {
      const roleRecord = await prisma.role.upsert({
        where: { name: roleDef.name },
        update: { description: roleDef.description },
        create: {
          name: roleDef.name,
          description: roleDef.description,
        },
      });

      // Synchronize role permissions idempotently
      for (const token of roleDef.permissionTokens) {
        const permissionId = permissionMap.get(token);
        if (!permissionId) {
          throw new Error(`Integrity error: Token '${token}' missing from permissionMap`);
        }

        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: roleRecord.id,
              permissionId,
            },
          },
          update: {}, // No updates needed if association exists
          create: {
            roleId: roleRecord.id,
            permissionId,
          },
        });
      }
    }

    console.log('[seed] Roles and role-permission associations verified.');
    console.log('[seed] Idempotent seed completed successfully.');
  } finally {
    await prisma.$disconnect();
  }
}

seed().catch((err) => {
  console.error('[seed] FATAL: Seeding failed:', err);
  process.exit(1);
});
