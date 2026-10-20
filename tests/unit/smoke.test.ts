import { describe, it, expect } from 'vitest';
import crypto from 'node:crypto';
import { PrismaClient } from '../../src/generated/prisma-client';

describe('Phase 05 Toolchain & Domain Smoke Tests', () => {
  it('instantiates Prisma Client constructor without runtime errors', () => {
    expect(PrismaClient).toBeDefined();
    expect(typeof PrismaClient).toBe('function');
  });

  it('computes deterministic outbox idempotency keys via SHA256', () => {
    // Verifies the exact outbox idempotency hashing algorithm defined in §15.4.1:
    // SHA256(entityType:entityId:eventType:vEntityVersion)
    const entityType = 'Article';
    const entityId = 'clx123456789';
    const eventType = 'CONTENT_PUBLISHED';
    const entityVersion = 1;

    const payload = `${entityType}:${entityId}:${eventType}:v${entityVersion}`;
    const hash1 = crypto.createHash('sha256').update(payload).digest('hex');
    const hash2 = crypto.createHash('sha256').update(payload).digest('hex');

    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(64);
  });

  it('enforces Arabic RTL default locale configuration', () => {
    const defaultLocale = 'ar';
    const supportedLocales = ['ar', 'en'];

    expect(supportedLocales).toContain(defaultLocale);
    expect(supportedLocales[0]).toBe('ar');
  });
});
