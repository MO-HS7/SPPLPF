/**
 * SPPLPF Granular Role-Based Access Control (RBAC) Engine (TASK-013/014)
 *
 * Implements server-side authorization and permission guards based on the
 * relational database schema (users -> user_roles -> roles -> role_permissions -> permissions).
 *
 * Security & Architectural Guarantees:
 * - Deny-by-default: access is denied unless an explicit permission token is resolved.
 * - Explicit permission checks: authorization enforces granular capabilities (e.g. "content.publish")
 *   rather than brittle role name comparisons.
 * - Dynamic resolution: effective permissions are resolved dynamically from PostgreSQL,
 *   ensuring immediate revocation without relying on stale client-supplied claims.
 * - Least privilege: no hardcoded bypasses. Even SUPER_ADMIN relies on its explicit database
 *   permission associations established during seeding.
 * - Fail-closed: database or infrastructure errors result in access denial with SERVICE_UNAVAILABLE.
 * - Defense in depth: integrates directly with secure session validation, account active checks,
 *   and account lockout status.
 */

import { prisma } from '../db';
import { validateSession, SESSION_COOKIE_NAME } from './session';
import type { AuthenticatedUser } from './service';

export const SYSTEM_PERMISSIONS = [
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
] as const;

export type SystemPermissionToken = (typeof SYSTEM_PERMISSIONS)[number] | (string & {});

export class AuthorizationServiceError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = 'AuthorizationServiceError';
  }
}

export interface UserRoleAssignment {
  id: string;
  name: string;
  description: string | null;
}

export interface UserAuthorizationContext {
  user: AuthenticatedUser;
  roles: UserRoleAssignment[];
  permissions: Set<string>;
}

export type AuthorizationFailureReason =
  | 'UNAUTHENTICATED'
  | 'SESSION_EXPIRED'
  | 'SESSION_INVALID'
  | 'USER_INACTIVE'
  | 'USER_LOCKED'
  | 'FORBIDDEN'
  | 'SERVICE_UNAVAILABLE';

export type AuthorizationResult =
  | {
      authorized: true;
      user: AuthenticatedUser;
      roles: UserRoleAssignment[];
      permissions: string[];
    }
  | {
      authorized: false;
      reason: AuthorizationFailureReason;
      missingPermission?: string;
      clearCookie?: boolean;
    };

/**
 * Resolves all assigned roles and distinct effective permissions for a user from PostgreSQL.
 *
 * @param userId - Primary key of the user
 * @returns Promise<{ roles: UserRoleAssignment[]; permissions: Set<string> }>
 */
export async function getUserRolesAndPermissions(
  userId: string
): Promise<{ roles: UserRoleAssignment[]; permissions: Set<string> }> {
  if (!userId || typeof userId !== 'string') {
    return { roles: [], permissions: new Set() };
  }

  try {
    const userRoleRecords = await prisma.userRole.findMany({
      where: { userId },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true,
              },
            },
          },
        },
      },
    });

    const roles: UserRoleAssignment[] = [];
    const permissions = new Set<string>();

    for (const record of userRoleRecords) {
      if (record.role) {
        roles.push({
          id: record.role.id,
          name: record.role.name,
          description: record.role.description,
        });

        if (Array.isArray(record.role.permissions)) {
          for (const rolePerm of record.role.permissions) {
            if (rolePerm.permission && rolePerm.permission.token) {
              permissions.add(rolePerm.permission.token);
            }
          }
        }
      }
    }

    return { roles, permissions };
  } catch (err) {
    console.error('[RBAC] Failed to resolve user roles and permissions:', (err as Error).message);
    throw new AuthorizationServiceError('Authorization database dependency unavailable', err);
  }
}

/**
 * Checks whether a given user possesses a specific permission token.
 *
 * @param userId - User ID to evaluate
 * @param permissionToken - Required capability token
 * @returns Promise<boolean> - True if possessed, false if denied
 */
export async function hasPermission(
  userId: string,
  permissionToken: SystemPermissionToken
): Promise<boolean> {
  try {
    const { permissions } = await getUserRolesAndPermissions(userId);
    return permissions.has(permissionToken);
  } catch (err) {
    // Fail closed on dependency error
    return false;
  }
}

/**
 * Checks whether a user possesses all required permission tokens (conjunction / AND).
 */
export async function hasAllPermissions(
  userId: string,
  requiredPermissions: SystemPermissionToken[]
): Promise<boolean> {
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true;
  }

  try {
    const { permissions } = await getUserRolesAndPermissions(userId);
    return requiredPermissions.every((p) => permissions.has(p));
  } catch (err) {
    return false;
  }
}

/**
 * Checks whether a user possesses at least one of the specified permission tokens (disjunction / OR).
 */
export async function hasAnyPermission(
  userId: string,
  candidatePermissions: SystemPermissionToken[]
): Promise<boolean> {
  if (!candidatePermissions || candidatePermissions.length === 0) {
    return true;
  }

  try {
    const { permissions } = await getUserRolesAndPermissions(userId);
    return candidatePermissions.some((p) => permissions.has(p));
  } catch (err) {
    return false;
  }
}

/**
 * Resolves session validation and effective permissions for an incoming session cookie.
 *
 * Enforces session validity, user active status, account lockout, and resolves
 * roles and permissions in a single integrated pipeline.
 */
export async function resolveSessionAuthorization(
  cookieValue: string | undefined | null,
  timeProvider?: () => number
): Promise<AuthorizationResult> {
  if (!cookieValue) {
    return { authorized: false, reason: 'UNAUTHENTICATED' };
  }

  // 1. Session verification against Valkey & PostgreSQL
  const sessionResult = await validateSession(cookieValue, timeProvider);

  if (!sessionResult.valid) {
    let reason: AuthorizationFailureReason = 'SESSION_INVALID';
    if (sessionResult.reason === 'IDLE_TIMEOUT' || sessionResult.reason === 'ABSOLUTE_EXPIRED') {
      reason = 'SESSION_EXPIRED';
    } else if (sessionResult.reason === 'USER_INACTIVE') {
      reason = 'USER_INACTIVE';
    } else if (sessionResult.reason === 'USER_LOCKED') {
      reason = 'USER_LOCKED';
    } else if (sessionResult.reason === 'NOT_FOUND') {
      reason = 'UNAUTHENTICATED';
    }

    return {
      authorized: false,
      reason,
      clearCookie: sessionResult.clearCookie.maxAge === 0,
    };
  }

  // 2. Resolve database roles and permissions
  try {
    const { roles, permissions } = await getUserRolesAndPermissions(sessionResult.user.id);

    return {
      authorized: true,
      user: sessionResult.user,
      roles,
      permissions: Array.from(permissions),
    };
  } catch (err) {
    if (err instanceof AuthorizationServiceError) {
      return { authorized: false, reason: 'SERVICE_UNAVAILABLE' };
    }
    throw err;
  }
}

/**
 * Server-side guard: Requires an active authenticated session with an explicit permission token.
 *
 * @param cookieValue - Raw signed session cookie value
 * @param requiredPermission - Required capability token (e.g. "content.publish")
 * @param timeProvider - Optional deterministic clock provider
 * @returns Promise<AuthorizationResult>
 */
export async function requirePermission(
  cookieValue: string | undefined | null,
  requiredPermission: SystemPermissionToken,
  timeProvider?: () => number
): Promise<AuthorizationResult> {
  const authContext = await resolveSessionAuthorization(cookieValue, timeProvider);

  if (!authContext.authorized) {
    return authContext;
  }

  if (!authContext.permissions.includes(requiredPermission)) {
    return {
      authorized: false,
      reason: 'FORBIDDEN',
      missingPermission: requiredPermission,
    };
  }

  return authContext;
}

/**
 * Server-side guard: Requires an active session with ALL specified permission tokens.
 */
export async function requireAllPermissions(
  cookieValue: string | undefined | null,
  requiredPermissions: SystemPermissionToken[],
  timeProvider?: () => number
): Promise<AuthorizationResult> {
  const authContext = await resolveSessionAuthorization(cookieValue, timeProvider);

  if (!authContext.authorized) {
    return authContext;
  }

  for (const perm of requiredPermissions) {
    if (!authContext.permissions.includes(perm)) {
      return {
        authorized: false,
        reason: 'FORBIDDEN',
        missingPermission: perm,
      };
    }
  }

  return authContext;
}

/**
 * Server-side guard: Requires an active session with AT LEAST ONE of the specified permission tokens.
 */
export async function requireAnyPermission(
  cookieValue: string | undefined | null,
  candidatePermissions: SystemPermissionToken[],
  timeProvider?: () => number
): Promise<AuthorizationResult> {
  const authContext = await resolveSessionAuthorization(cookieValue, timeProvider);

  if (!authContext.authorized) {
    return authContext;
  }

  const hasAtLeastOne = candidatePermissions.some((p) => authContext.permissions.includes(p));

  if (!hasAtLeastOne) {
    return {
      authorized: false,
      reason: 'FORBIDDEN',
      missingPermission: candidatePermissions.join(' | '),
    };
  }

  return authContext;
}

/**
 * Extracts the SPPLPF session cookie value from a standard Cookie header string.
 */
export function extractSessionCookieFromHeader(cookieHeader: string | null | undefined): string | null {
  if (!cookieHeader || typeof cookieHeader !== 'string') {
    return null;
  }

  const cookies = cookieHeader.split(';');
  for (const cookie of cookies) {
    const [name, ...rest] = cookie.trim().split('=');
    if (name === SESSION_COOKIE_NAME) {
      return rest.join('=');
    }
  }

  return null;
}
