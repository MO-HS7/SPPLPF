import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getUserRolesAndPermissions,
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  resolveSessionAuthorization,
  requirePermission,
  requireAllPermissions,
  requireAnyPermission,
  extractSessionCookieFromHeader,
  AuthorizationServiceError,
  SESSION_COOKIE_NAME,
} from '@/lib/auth';
import { prisma } from '@/lib/db';
import * as sessionModule from '@/lib/auth/session';

vi.mock('@/lib/db', () => ({
  prisma: {
    userRole: {
      findMany: vi.fn(),
    },
    $disconnect: vi.fn(),
  },
}));

describe('TASK-013/014 Unit Tests: RBAC Permission Resolution Engine', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns empty roles and permissions for invalid or empty user ID (deny-by-default)', async () => {
    const res = await getUserRolesAndPermissions('');
    expect(res.roles).toEqual([]);
    expect(res.permissions.size).toBe(0);
  });

  it('resolves distinct roles and deduplicated permissions from database relationships', async () => {
    vi.mocked(prisma.userRole.findMany).mockResolvedValueOnce([
      {
        userId: 'usr_1',
        roleId: 'role_author',
        role: {
          id: 'role_author',
          name: 'CONTENT_AUTHOR',
          description: 'Authoring role',
          permissions: [
            { roleId: 'role_author', permissionId: 'p1', permission: { id: 'p1', token: 'content.create', description: null } },
            { roleId: 'role_author', permissionId: 'p2', permission: { id: 'p2', token: 'content.edit', description: null } },
          ],
        },
      },
      {
        userId: 'usr_1',
        roleId: 'role_manager',
        role: {
          id: 'role_manager',
          name: 'CONTENT_MANAGER',
          description: 'Manager role',
          permissions: [
            { roleId: 'role_manager', permissionId: 'p2', permission: { id: 'p2', token: 'content.edit', description: null } }, // overlap
            { roleId: 'role_manager', permissionId: 'p3', permission: { id: 'p3', token: 'content.publish', description: null } },
          ],
        },
      },
    ] as any);

    const { roles, permissions } = await getUserRolesAndPermissions('usr_1');

    expect(roles).toHaveLength(2);
    expect(roles.map((r) => r.name)).toEqual(['CONTENT_AUTHOR', 'CONTENT_MANAGER']);

    // Deduplicated set of permissions
    expect(permissions.size).toBe(3);
    expect(permissions.has('content.create')).toBe(true);
    expect(permissions.has('content.edit')).toBe(true);
    expect(permissions.has('content.publish')).toBe(true);
  });

  it('fails closed and throws AuthorizationServiceError when database fails', async () => {
    vi.mocked(prisma.userRole.findMany).mockRejectedValueOnce(
      new Error('PostgreSQL connection terminated')
    );

    await expect(getUserRolesAndPermissions('usr_1')).rejects.toThrow(
      AuthorizationServiceError
    );
  });

  it('evaluates hasPermission accurately and fails closed on DB error', async () => {
    vi.mocked(prisma.userRole.findMany).mockResolvedValueOnce([
      {
        userId: 'usr_1',
        roleId: 'r1',
        role: {
          id: 'r1',
          name: 'AUDITOR',
          description: null,
          permissions: [
            { roleId: 'r1', permissionId: 'p_audit', permission: { id: 'p_audit', token: 'audit.view', description: null } },
          ],
        },
      },
    ] as any);

    const canViewAudit = await hasPermission('usr_1', 'audit.view');
    expect(canViewAudit).toBe(true);

    vi.mocked(prisma.userRole.findMany).mockResolvedValueOnce([]);
    const canPublish = await hasPermission('usr_1', 'content.publish');
    expect(canPublish).toBe(false);

    // Fail-closed on error
    vi.mocked(prisma.userRole.findMany).mockRejectedValueOnce(new Error('DB failure'));
    const onError = await hasPermission('usr_1', 'audit.view');
    expect(onError).toBe(false);
  });

  it('evaluates hasAllPermissions (conjunction) correctly', async () => {
    vi.mocked(prisma.userRole.findMany).mockResolvedValue([
      {
        userId: 'usr_1',
        roleId: 'r1',
        role: {
          id: 'r1',
          name: 'CONTENT_MANAGER',
          description: null,
          permissions: [
            { roleId: 'r1', permissionId: 'p1', permission: { id: 'p1', token: 'content.create', description: null } },
            { roleId: 'r1', permissionId: 'p2', permission: { id: 'p2', token: 'content.publish', description: null } },
          ],
        },
      },
    ] as any);

    expect(await hasAllPermissions('usr_1', ['content.create', 'content.publish'])).toBe(true);
    expect(await hasAllPermissions('usr_1', ['content.create', 'users.manage'])).toBe(false);
  });

  it('evaluates hasAnyPermission (disjunction) correctly', async () => {
    vi.mocked(prisma.userRole.findMany).mockResolvedValue([
      {
        userId: 'usr_1',
        roleId: 'r1',
        role: {
          id: 'r1',
          name: 'AUDITOR',
          description: null,
          permissions: [
            { roleId: 'r1', permissionId: 'p1', permission: { id: 'p1', token: 'audit.view', description: null } },
          ],
        },
      },
    ] as any);

    expect(await hasAnyPermission('usr_1', ['content.publish', 'audit.view'])).toBe(true);
    expect(await hasAnyPermission('usr_1', ['content.publish', 'users.manage'])).toBe(false);
  });
});

describe('TASK-013/014 Unit Tests: Server-Side Permission Guards & Session Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rejects unauthenticated requests when session cookie is absent', async () => {
    const res = await resolveSessionAuthorization(null);
    expect(res.authorized).toBe(false);
    if (!res.authorized) {
      expect(res.reason).toBe('UNAUTHENTICATED');
    }
  });

  it('rejects invalid or tampered session cookies', async () => {
    vi.spyOn(sessionModule, 'validateSession').mockResolvedValueOnce({
      valid: false,
      reason: 'INVALID_SIGNATURE',
      clearCookie: { name: 'spplpf_session', value: '', maxAge: 0, httpOnly: true, sameSite: 'strict', path: '/', secure: false },
    });

    const res = await resolveSessionAuthorization('tampered_cookie_val');
    expect(res.authorized).toBe(false);
    if (!res.authorized) {
      expect(res.reason).toBe('SESSION_INVALID');
      expect(res.clearCookie).toBe(true);
    }
  });

  it('rejects expired session cookies with SESSION_EXPIRED', async () => {
    vi.spyOn(sessionModule, 'validateSession').mockResolvedValueOnce({
      valid: false,
      reason: 'IDLE_TIMEOUT',
      clearCookie: { name: 'spplpf_session', value: '', maxAge: 0, httpOnly: true, sameSite: 'strict', path: '/', secure: false },
    });

    const res = await resolveSessionAuthorization('expired_cookie_val');
    expect(res.authorized).toBe(false);
    if (!res.authorized) {
      expect(res.reason).toBe('SESSION_EXPIRED');
    }
  });

  it('rejects deactivated accounts with USER_INACTIVE', async () => {
    vi.spyOn(sessionModule, 'validateSession').mockResolvedValueOnce({
      valid: false,
      reason: 'USER_INACTIVE',
      clearCookie: { name: 'spplpf_session', value: '', maxAge: 0, httpOnly: true, sameSite: 'strict', path: '/', secure: false },
    });

    const res = await resolveSessionAuthorization('inactive_user_cookie');
    expect(res.authorized).toBe(false);
    if (!res.authorized) {
      expect(res.reason).toBe('USER_INACTIVE');
    }
  });

  it('rejects locked accounts with USER_LOCKED', async () => {
    vi.spyOn(sessionModule, 'validateSession').mockResolvedValueOnce({
      valid: false,
      reason: 'USER_LOCKED',
      clearCookie: { name: 'spplpf_session', value: '', maxAge: 0, httpOnly: true, sameSite: 'strict', path: '/', secure: false },
    });

    const res = await resolveSessionAuthorization('locked_user_cookie');
    expect(res.authorized).toBe(false);
    if (!res.authorized) {
      expect(res.reason).toBe('USER_LOCKED');
    }
  });

  it('authorizes authenticated user with valid capability via requirePermission', async () => {
    vi.spyOn(sessionModule, 'validateSession').mockResolvedValueOnce({
      valid: true,
      user: {
        id: 'usr_manager',
        email: 'manager@spplpf.internal',
        fullName: 'Content Manager',
        isActive: true,
        mfaEnabled: false,
      },
      session: {
        userId: 'usr_manager',
        createdAt: Date.now(),
        lastActiveAt: Date.now(),
      },
    });

    vi.mocked(prisma.userRole.findMany).mockResolvedValueOnce([
      {
        userId: 'usr_manager',
        roleId: 'role_mgr',
        role: {
          id: 'role_mgr',
          name: 'CONTENT_MANAGER',
          description: null,
          permissions: [
            { roleId: 'role_mgr', permissionId: 'p_pub', permission: { id: 'p_pub', token: 'content.publish', description: null } },
          ],
        },
      },
    ] as any);

    const result = await requirePermission('valid_cookie_mgr', 'content.publish');
    expect(result.authorized).toBe(true);
    if (result.authorized) {
      expect(result.user.id).toBe('usr_manager');
      expect(result.permissions).toContain('content.publish');
      expect(result.roles[0].name).toBe('CONTENT_MANAGER');
    }
  });

  it('denies authenticated user lacking capability with FORBIDDEN and specifies missingPermission', async () => {
    vi.spyOn(sessionModule, 'validateSession').mockResolvedValueOnce({
      valid: true,
      user: {
        id: 'usr_author',
        email: 'author@spplpf.internal',
        fullName: 'Content Author',
        isActive: true,
        mfaEnabled: false,
      },
      session: {
        userId: 'usr_author',
        createdAt: Date.now(),
        lastActiveAt: Date.now(),
      },
    });

    vi.mocked(prisma.userRole.findMany).mockResolvedValueOnce([
      {
        userId: 'usr_author',
        roleId: 'role_auth',
        role: {
          id: 'role_auth',
          name: 'CONTENT_AUTHOR',
          description: null,
          permissions: [
            { roleId: 'role_auth', permissionId: 'p_create', permission: { id: 'p_create', token: 'content.create', description: null } },
          ],
        },
      },
    ] as any);

    const result = await requirePermission('valid_cookie_auth', 'users.manage');
    expect(result.authorized).toBe(false);
    if (!result.authorized) {
      expect(result.reason).toBe('FORBIDDEN');
      expect(result.missingPermission).toBe('users.manage');
    }
  });

  it('extracts session cookie cleanly from Cookie header', () => {
    const rawHeader = `theme=dark; ${SESSION_COOKIE_NAME}=session_token_123.sig456; other_pref=true`;
    const token = extractSessionCookieFromHeader(rawHeader);
    expect(token).toBe('session_token_123.sig456');

    expect(extractSessionCookieFromHeader('')).toBeNull();
    expect(extractSessionCookieFromHeader('theme=dark')).toBeNull();
  });
});
