import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '@/lib/db';
import { redisSessionClient } from '@/lib/redis';
import { hashPassword } from '@/lib/auth/password';
import { createSession, destroySession } from '@/lib/auth/session';
import {
  getUserRolesAndPermissions,
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  resolveSessionAuthorization,
  requirePermission,
  requireAllPermissions,
  type SystemPermissionToken,
} from '@/lib/auth';
import { isPortReachable } from './helpers';

const isPgReachable = await isPortReachable(5432);
const isValkeyReachable = await isPortReachable(6379);
const canRunIntegration = isPgReachable && isValkeyReachable;

describe.runIf(canRunIntegration)(
  'TASK-013/014 Integration Tests: Real Relational RBAC Engine & Permission Guards',
  () => {
    // Test users for each role
    const testUsers: Record<string, { id: string; email: string }> = {
      superAdmin: { id: '', email: 'task013.superadmin@spplpf.internal' },
      contentManager: { id: '', email: 'task013.manager@spplpf.internal' },
      contentAuthor: { id: '', email: 'task013.author@spplpf.internal' },
      auditor: { id: '', email: 'task013.auditor@spplpf.internal' },
      unassigned: { id: '', email: 'task013.unassigned@spplpf.internal' },
    };

    const createdCookies: string[] = [];

    beforeAll(async () => {
      // Clean up previous test users if lingering
      const emails = Object.values(testUsers).map((u) => u.email);
      await prisma.user.deleteMany({
        where: { email: { in: emails } },
      });

      const pwdHash = await hashPassword('InstitutionalPass2026!');

      // Create test users in spplpf_dev
      for (const [key, userObj] of Object.entries(testUsers)) {
        const record = await prisma.user.create({
          data: {
            email: userObj.email,
            fullName: `Test ${key}`,
            passwordHash: pwdHash,
            isActive: true,
          },
        });
        testUsers[key].id = record.id;
      }

      // Query seeded roles from spplpf_dev
      const roles = await prisma.role.findMany();
      const roleMap = new Map(roles.map((r) => [r.name, r.id]));

      // Assign roles
      await prisma.userRole.createMany({
        data: [
          { userId: testUsers.superAdmin.id, roleId: roleMap.get('SUPER_ADMIN')! },
          { userId: testUsers.contentManager.id, roleId: roleMap.get('CONTENT_MANAGER')! },
          { userId: testUsers.contentAuthor.id, roleId: roleMap.get('CONTENT_AUTHOR')! },
          { userId: testUsers.auditor.id, roleId: roleMap.get('AUDITOR')! },
        ],
      });
    });

    afterAll(async () => {
      // Destroy created sessions in Valkey
      for (const c of createdCookies) {
        await destroySession(c);
      }

      // Remove test users (cascades to userRoles)
      const userIds = Object.values(testUsers).map((u) => u.id).filter(Boolean);
      if (userIds.length > 0) {
        await prisma.user.deleteMany({
          where: { id: { in: userIds } },
        });
      }

      await prisma.$disconnect();
      redisSessionClient.disconnect();
    });

    it('resolves all 12 system permissions for SUPER_ADMIN from seeded relations', async () => {
      const { roles, permissions } = await getUserRolesAndPermissions(testUsers.superAdmin.id);

      expect(roles).toHaveLength(1);
      expect(roles[0].name).toBe('SUPER_ADMIN');

      // Seed defines all 12 permissions for SUPER_ADMIN
      expect(permissions.size).toBe(12);
      expect(permissions.has('users.manage')).toBe(true);
      expect(permissions.has('roles.manage')).toBe(true);
      expect(permissions.has('content.publish')).toBe(true);
      expect(permissions.has('audit.view')).toBe(true);
      expect(permissions.has('settings.manage')).toBe(true);
    });

    it('resolves exactly 7 editorial permissions for CONTENT_MANAGER', async () => {
      const { roles, permissions } = await getUserRolesAndPermissions(testUsers.contentManager.id);

      expect(roles[0].name).toBe('CONTENT_MANAGER');
      expect(permissions.size).toBe(7);

      expect(permissions.has('content.create')).toBe(true);
      expect(permissions.has('content.edit')).toBe(true);
      expect(permissions.has('content.review')).toBe(true);
      expect(permissions.has('content.publish')).toBe(true);
      expect(permissions.has('content.archive')).toBe(true);
      expect(permissions.has('media.upload')).toBe(true);
      expect(permissions.has('inquiries.manage')).toBe(true);

      // Must NOT possess administrative permissions
      expect(permissions.has('users.manage')).toBe(false);
      expect(permissions.has('roles.manage')).toBe(false);
      expect(permissions.has('settings.manage')).toBe(false);
    });

    it('resolves authoring permissions for CONTENT_AUTHOR and denies publishing', async () => {
      const { roles, permissions } = await getUserRolesAndPermissions(testUsers.contentAuthor.id);

      expect(roles[0].name).toBe('CONTENT_AUTHOR');
      expect(permissions.size).toBe(3);

      expect(permissions.has('content.create')).toBe(true);
      expect(permissions.has('content.edit')).toBe(true);
      expect(permissions.has('media.upload')).toBe(true);

      // Authors cannot review or publish content
      expect(permissions.has('content.review')).toBe(false);
      expect(permissions.has('content.publish')).toBe(false);
    });

    it('resolves read-only audit capability for AUDITOR', async () => {
      const { roles, permissions } = await getUserRolesAndPermissions(testUsers.auditor.id);

      expect(roles[0].name).toBe('AUDITOR');
      expect(permissions.size).toBe(1);
      expect(permissions.has('audit.view')).toBe(true);

      expect(permissions.has('content.create')).toBe(false);
      expect(permissions.has('users.manage')).toBe(false);
    });

    it('denies all permissions by default for a user without role assignments', async () => {
      const { roles, permissions } = await getUserRolesAndPermissions(testUsers.unassigned.id);

      expect(roles).toEqual([]);
      expect(permissions.size).toBe(0);

      expect(await hasPermission(testUsers.unassigned.id, 'content.create')).toBe(false);
    });

    it('dynamically reflects changes to user role assignments in real time', async () => {
      // Temporarily assign AUDITOR role to unassigned user
      const auditorRole = await prisma.role.findUnique({ where: { name: 'AUDITOR' } });
      const assignment = await prisma.userRole.create({
        data: {
          userId: testUsers.unassigned.id,
          roleId: auditorRole!.id,
        },
      });

      try {
        // Immediate reflection
        const canAuditNow = await hasPermission(testUsers.unassigned.id, 'audit.view');
        expect(canAuditNow).toBe(true);
      } finally {
        // Revoke assignment
        await prisma.userRole.delete({
          where: {
            userId_roleId: {
              userId: testUsers.unassigned.id,
              roleId: auditorRole!.id,
            },
          },
        });
      }

      // Immediate revocation
      const canAuditAfterRevocation = await hasPermission(testUsers.unassigned.id, 'audit.view');
      expect(canAuditAfterRevocation).toBe(false);
    });

    it('enforces requirePermission guard with live session cookie', async () => {
      // Create live session for CONTENT_MANAGER
      const { cookie: managerCookie } = await createSession(testUsers.contentManager.id);
      createdCookies.push(managerCookie.value);

      // Allowed capability
      const allowedResult = await requirePermission(managerCookie.value, 'content.publish');
      expect(allowedResult.authorized).toBe(true);
      if (allowedResult.authorized) {
        expect(allowedResult.user.id).toBe(testUsers.contentManager.id);
        expect(allowedResult.permissions).toContain('content.publish');
      }

      // Denied capability
      const deniedResult = await requirePermission(managerCookie.value, 'users.manage');
      expect(deniedResult.authorized).toBe(false);
      if (!deniedResult.authorized) {
        expect(deniedResult.reason).toBe('FORBIDDEN');
        expect(deniedResult.missingPermission).toBe('users.manage');
      }
    });

    it('rejects deactivated or locked accounts in requirePermission', async () => {
      const { cookie } = await createSession(testUsers.contentAuthor.id);
      createdCookies.push(cookie.value);

      // Deactivate author in PostgreSQL
      await prisma.user.update({
        where: { id: testUsers.contentAuthor.id },
        data: { isActive: false },
      });

      try {
        const result = await requirePermission(cookie.value, 'content.create');
        expect(result.authorized).toBe(false);
        if (!result.authorized) {
          expect(result.reason).toBe('USER_INACTIVE');
        }
      } finally {
        await prisma.user.update({
          where: { id: testUsers.contentAuthor.id },
          data: { isActive: true },
        });
      }
    });

    it('rejects revoked sessions after server-side logout', async () => {
      const { cookie } = await createSession(testUsers.auditor.id);

      // Destroy session
      await destroySession(cookie.value);

      const result = await requirePermission(cookie.value, 'audit.view');
      expect(result.authorized).toBe(false);
      if (!result.authorized) {
        expect(result.reason).toBe('UNAUTHENTICATED');
      }
    });
  }
);
