# SPPLPF Implementation Task Ledger & Status Register

**Last Updated:** 23 October 2026  
**Accountable Lead:** Mohannad Hassan (@MO-HS7)  
**Standard:** SPPLPF Architecture Plan & Definition of Done

---

## 1. Phase-by-Phase Implementation Status

| Phase | Description | Key Deliverables & Gates | Status | Verification Evidence |
| :--- | :--- | :--- | :--- | :--- |
| **Phase 01** | Stack Architecture & Audits | Version matrix, technology evaluation, security guidelines | **DONE** | [`SPPLPF_ARCHITECTURE_AUDIT_REPORT.md`](file:///e:/SPPLPF/SPPLPF_ARCHITECTURE_AUDIT_REPORT.md), [`docs/stack-versions.lock.md`](file:///e:/SPPLPF/docs/stack-versions.lock.md) |
| **Phase 02** | Security Policies & Governance | Strangler fig, Git commit policy, secret safety standards | **DONE** | Strict zero-credential logging, scoped exceptions policy |
| **Phase 03** | Core Package & Workspace Init | Next.js 16.4.2, React 19.2.7, TypeScript 5.8.2, Prisma 7.1.0 | **DONE** | `package.json`, `tsconfig.json`, `npm ci` clean install |
| **Phase 04** | Container Build Infrastructure | Multi-stage Dockerfile, `.dockerignore`, non-root user setup | **DONE** | Pinned base digests (`postgres:17.11-alpine`, `valkey:8.0.11-alpine`, `nginx:1.30.6-alpine`) |
| **Phase 05** | Static Verification Gates | GATE-01 (Prisma validate/generate), GATE-02 (Strict tsc) | **DONE** | Turbopack production build (`npm run build`) |
| **Phase 06** | Datastore Runtime Orchestration | GATE-04 (Valkey authenticated ping), GATE-05 (Live PostgreSQL socket) | **DONE** | [`tests/integration/smoke.test.ts`](file:///e:/SPPLPF/tests/integration/smoke.test.ts) |
| **Phase 06 (Sec)** | Container Vulnerability Triage | Scoped Trivy exceptions (`usr/local/bin/gosu`), GATE-06 active | **DONE** | [`docs/security/vulnerability-triage-register.md`](file:///e:/SPPLPF/docs/security/vulnerability-triage-register.md), [`tests/fixtures/security/postgres-pinned.sarif.json`](file:///e:/SPPLPF/tests/fixtures/security/postgres-pinned.sarif.json) |
| **Phase 07** | Relational Database & Seed (TASK-006) | Initial Prisma migration (`20261022215706_init`), PostgreSQL extensions, idempotent seed | **DONE** | Applied to `spplpf_dev`, 34 relations created, 2x seed idempotent (4 roles, 12 permissions, 23 mappings) |
| **Phase 08 (Part 1)** | Argon2id Auth Foundation (TASK-010) | OWASP Argon2id parameters (m=64MB, t=3, p=4), hashing, verification, rehash detection | **DONE** | [`src/lib/auth/password.ts`](file:///e:/SPPLPF/src/lib/auth/password.ts), [`src/lib/auth/service.ts`](file:///e:/SPPLPF/src/lib/auth/service.ts), 16 unit tests, 10 integration tests |
| **Phase 08 (Part 2)** | Session Management (TASK-011) | HttpOnly signed cookie lifecycle, 8h absolute expiry, Redis session invalidation, one-way token hashing | **DONE** | [`src/lib/auth/session.ts`](file:///e:/SPPLPF/src/lib/auth/session.ts), [`src/lib/redis.ts`](file:///e:/SPPLPF/src/lib/redis.ts), 27 unit tests, 9 integration tests |
| **Phase 08 (Part 3)** | Rate Limiting (TASK-012) | Redis sliding-window limiter on login endpoints (5 attempts/15m), 30m account lockout | **DONE** | [`src/lib/auth/rate-limiter.ts`](file:///e:/SPPLPF/src/lib/auth/rate-limiter.ts), [`src/lib/auth/service.ts`](file:///e:/SPPLPF/src/lib/auth/service.ts), 18 unit tests, 7 integration tests |
| **Phase 08 (Part 4)** | Granular RBAC Engine (TASK-013/014) | Dynamic permission resolution, server-side guards, deny-by-default | **DONE** | [`src/lib/auth/rbac.ts`](file:///e:/SPPLPF/src/lib/auth/rbac.ts), 14 unit tests, 9 integration tests |
| **Frontend Prototype Sprint** | Complete Bilingual UI Prototype (Phases 09–11, 13 UI) | Institutional Design System (`tokens.css`, `globals.css`), i18n engine (`ar`/`en`), 16 public routes, 14 admin dashboard routes, reactive demo store | **PROTOTYPED (UI-FIRST)** | Turbopack build passes (33 routes), 86 unit tests pass. Backend APIs, production auth bridge, and DB mutations remain pending in canonical phases. |
| **Phase 09** | Shared Design System & I18N Engine | CSS token architecture, RTL/LTR engine, web fonts, base UI primitives | *PROTOTYPED* | Prototyped in UI sprint; final production font & asset bundle pending |
| **Phase 10** | Public Website Foundation & Home Portal | Public bilingual layout, header, footer, dynamic home portal | *PROTOTYPED* | Fully interactive in prototype; live API integration pending Phase 12 |
| **Phase 11** | Public Thematic Pages & Catalogues | About, Values, Goals, Milestones, Programs, News, Publications, Presence, Contact | *PROTOTYPED* | Interactive demo catalog; live data persistence pending Phase 12 |
| **Phase 12** | Backend API Handlers & Domain Services | RESTful `/api/v1/...` route handlers, Zod parsing, audit logging | *PENDING* | Scheduled next for backend integration |
| **Phase 13** | Admin Dashboard Shell & Auth Bridge | Authenticated admin shell, route guards, session bridge | *PROTOTYPED (UI)* | Protected UI shell built; backend cookie session bridge pending Phase 12 |
| **Phase 14** | Editorial Workflow & Content Editor | Multi-stage editorial state machine, Tiptap editor, review queue | *PENDING (PROTOTYPED)* | UI state transitions simulated in demo store; DB persistence pending Phase 12 |
| **Phase 15** | Media Pipeline, Search & Outbox Worker | Sharp pipeline, trigram search, cache invalidation outbox | *PENDING* | Scheduled |
| **Phase 16** | Contact Dispatcher & Inquiry Gateway | Honeypot verification, email dispatcher, DB persistence | *PENDING (PROTOTYPED)* | Form & validation prototyped; SMTP dispatch pending Phase 12 |
| **Phase 17** | Comprehensive QA, E2E & A11y Audits | Playwright suites, WCAG 2.2 AA audits | *PENDING* | Scheduled |
| **Phase 18** | Security Hardening & Penetration Testing | ASVS Level 2 audit, ZAP dynamic scans, hardened headers | *PENDING* | Scheduled |
| **Phase 19** | Staging Deployment & Stakeholder UAT | Staging VPS, live 60s emergency takedown drill, sign-off | *PENDING* | Gated |
| **Phase 20** | Production Launch & Handover Runbooks | Production deployment runbook, legal/donor sign-off on Valkey | *PENDING* | Strictly gated |

---

## 2. Verified Foundation Ledger (Do Not Repeat)

### 2.1. Database Migration & Extensions (Phase 07 / TASK-006)
- **Status:** Complete & verified against `spplpf_dev`.
- **Migration ID:** `20261022215706_init` ([`prisma/migrations/20261022215706_init/migration.sql`](file:///e:/SPPLPF/prisma/migrations/20261022215706_init/migration.sql)).
- **Extensions Installed:** `pg_trgm`, `btree_gin`, `unaccent`.
- **Relations:** 33 application tables + `_prisma_migrations` (34 total).
- **Target Safety:** Production target `spplpf_prod` remains empty and untouched; development targets `spplpf_dev` and shadow `spplpf_shadow` are isolated.

### 2.2. RBAC Reference Seed Data (Phase 07 / TASK-006)
- **Status:** Complete & verified idempotent.
- **Script:** [`prisma/seed.ts`](file:///e:/SPPLPF/prisma/seed.ts) triggered via `npx prisma db seed`.
- **Entities:**
  - 12 system permissions (`users.manage`, `roles.manage`, `content.create`, `content.edit`, `content.review`, `content.publish`, `content.archive`, `media.upload`, `media.delete`, `settings.manage`, `audit.view`, `inquiries.manage`).
  - 4 system roles (`SUPER_ADMIN`, `CONTENT_MANAGER`, `CONTENT_AUTHOR`, `AUDITOR`).
  - 23 role-permission associations.
- **Idempotency Proof:** Executed twice consecutively; exactly 4 roles, 12 permissions, and 23 associations present after both runs with 0 duplicates.

### 2.3. Argon2id Authentication Foundation (Phase 08 / TASK-010)
- **Status:** Complete & validated.
- **Modules:** [`src/lib/auth/password.ts`](file:///e:/SPPLPF/src/lib/auth/password.ts), [`src/lib/auth/service.ts`](file:///e:/SPPLPF/src/lib/auth/service.ts), [`src/lib/auth/index.ts`](file:///e:/SPPLPF/src/lib/auth/index.ts), [`src/lib/db.ts`](file:///e:/SPPLPF/src/lib/db.ts).
- **Dependency:** Pinned `@node-rs/argon2@2.2.2` (native precompiled binaries across Windows x64 MSVC, Linux x64 MUSL Alpine, and Linux x64 GNU Ubuntu).
- **Cryptographic Parameters:**
  - Algorithm: Argon2id (variant 2)
  - Memory cost: 64 MiB (`m=65536`)
  - Time cost: 3 iterations (`t=3`)
  - Parallelism: 4 threads (`p=4`)
  - Output length: 32 bytes (`outputLen: 32`)
  - Salt: Cryptographically secure 16-byte random salt generated automatically per hash
- **Security Safeguards:**
  - Plaintext passwords never logged, persisted, or returned.
  - Safe error handling: malformed, corrupted, or invalid hashes return `false` without throwing.
  - Generic `INVALID_CREDENTIALS` error for both non-existent users and wrong passwords (prevents user enumeration).
  - Explicit account lockout enforcement window (`lockedUntil`).
- **Tests:**
  - 13 Argon2id unit tests in [`tests/unit/auth/password.test.ts`](file:///e:/SPPLPF/tests/unit/auth/password.test.ts).
  - 6 database integration tests in [`tests/integration/auth.test.ts`](file:///e:/SPPLPF/tests/integration/auth.test.ts).

### 2.4. Secure Session Lifecycle & Cookie Management (Phase 08 / TASK-011)
- **Status:** Complete & validated.
- **Modules:** [`src/lib/auth/session.ts`](file:///e:/SPPLPF/src/lib/auth/session.ts), [`src/lib/redis.ts`](file:///e:/SPPLPF/src/lib/redis.ts), [`src/lib/auth/index.ts`](file:///e:/SPPLPF/src/lib/auth/index.ts).
- **Core Architecture & Cryptographic Controls:**
  - **Token Generation:** 256 bits of cryptographically secure entropy (`crypto.randomBytes(32).toString('base64url')`).
  - **Signed Cookies:** Cookie value is `${rawToken}.${hmacSha256Signature}` using a dedicated 256-bit signing secret. Verification is constant-time via `crypto.timingSafeEqual`.
  - **One-Way Verifier in Valkey:** Stored key is `sess:${sha256(rawToken)}` in Valkey DB 0. The raw token is NEVER stored in Valkey or logs, ensuring that even a read-only Valkey disclosure cannot yield valid session cookies.
  - **Fail-Closed Secret Resolution:** Dedicated `session_secret` resolved from `/run/secrets/session_secret`, `secrets/session_secret.txt`, or `SESSION_SECRET`. In production, missing or short secrets fail closed immediately.
  - **Dual-Expiry Lifecycle:**
    - 30-minute idle inactivity timeout (`SESSION_IDLE_TIMEOUT_MS = 1800000`).
    - 8-hour absolute maximum lifetime (`SESSION_ABSOLUTE_LIFETIME_MS = 28800000`).
    - Valkey key TTL is dynamically clamped to `Math.min(idleRemaining, absoluteRemaining)`, guaranteeing a session can never be artificially extended past 8 hours.
  - **Anti-Fixation & Token Rotation:** `rotateSession(cookieValue)` issues a fresh 256-bit signed token, writes the new hash to Valkey while preserving the original `createdAt` timestamp, and destroys the old hash key.
  - **Logout Invalidation:** `destroySession(cookieValue)` removes the key from Valkey and issues a zero-maxAge clear cookie. Replay of old copied cookies fails closed.
  - **Database Re-Verification:** Every session validation rechecks that the user exists, is active (`isActive === true`), and is not locked (`lockedUntil <= now`). Deactivated/locked accounts are immediately denied.
  - **Cookie Security Flags:** `HttpOnly: true`, `SameSite: 'strict'`, `Path: '/'`, `Secure: true` in production (`false` in development for localhost HTTP testing).
  - **Defense in Depth Note:** `SameSite=Strict` is defense in depth and does not eliminate the requirement for explicit anti-CSRF measures on state-changing endpoints. Sensitive authenticated endpoints are non-cacheable (`Cache-Control: no-store, private`).
- **Tests:**
  - 13 unit tests in [`tests/unit/auth/session.test.ts`](file:///e:/SPPLPF/tests/unit/auth/session.test.ts) (token entropy, hashing, signing, tamper rejection, cookie options, production secret safety).
  - 14 unit tests in [`tests/unit/auth/session-engine.test.ts`](file:///e:/SPPLPF/tests/unit/auth/session-engine.test.ts) (full lifecycle, idle timeout, absolute expiry, rotation, logout, inactive/locked user rejection with virtual clock).
  - 9 integration tests in [`tests/integration/session.test.ts`](file:///e:/SPPLPF/tests/integration/session.test.ts) (live Valkey and PostgreSQL persistence, automatic cleanup, conditional port reachability probe).

### 2.5. Redis Sliding-Window Rate Limiting & Brute-Force Lockout (Phase 08 / TASK-012)
- **Status:** Complete & validated against live Valkey & PostgreSQL.
- **Modules:** [`src/lib/auth/rate-limiter.ts`](file:///e:/SPPLPF/src/lib/auth/rate-limiter.ts), [`src/lib/auth/service.ts`](file:///e:/SPPLPF/src/lib/auth/service.ts), [`src/lib/auth/index.ts`](file:///e:/SPPLPF/src/lib/auth/index.ts).
- **Core Architecture & Cryptographic Controls:**
  - **Atomic Evaluation:** Evaluated atomically in Valkey DB 0 via reviewed Lua scripts (`SLIDING_WINDOW_CONSUME_LUA`, `SLIDING_WINDOW_CHECK_LUA`). Uses sorted sets (`ZSET`) with `ZREMRANGEBYSCORE`, `ZCARD`, `ZADD`, and `EXPIRE`. Completely eliminates read-then-write race conditions under high concurrency.
  - **Zero Sensitive Data Leakage in Keys/Logs:** Scopes are obfuscated using one-way SHA-256 hashes (`rl:acct:${sha256(email)}`, `rl:ip:${sha256(ip)}`, `rl:pair:${sha256(ip + ':' + email)}`). Raw emails, IP addresses, passwords, and tokens are NEVER stored in Redis keys, metrics, or logs.
  - **Bounded Retention & TTL:** Keys are automatically configured with dynamic TTL (`Math.ceil(windowMs / 1000) + 60s`). Abandoned or inactive limiter keys expire cleanly in Valkey.
  - **Fail-Closed Protection:** When Valkey is unreachable or errors, throws `RateLimiterError`, prompting `authenticateWithPassword` to return `{ success: false, reason: 'SERVICE_UNAVAILABLE' }`. Never silently bypasses rate limiting during datastore outages.
  - **Configurable Limits & Durations:**
    - Login Account Limit: 5 failed attempts per 15-minute sliding window (`RATE_LIMIT_LOGIN_MAX_ATTEMPTS = 5`, `RATE_LIMIT_LOGIN_WINDOW_MS = 900000`).
    - Login IP Limit: 20 attempts per 15-minute sliding window (`RATE_LIMIT_IP_MAX_ATTEMPTS = 20`).
    - Account Lockout Escalation: 30 minutes in PostgreSQL (`RATE_LIMIT_LOCKOUT_DURATION_MS = 1800000`).
  - **Pre-Argon2id CPU Protection:** Rate limiting runs before heavy Argon2id verification (64MB/3 iterations), protecting the server's CPU from exhaustion denial-of-service.
  - **Brute-Force Account Lockout Escalation:** On 5th failed password attempt, user's `lockedUntil` timestamp is set to `now + 30 minutes` and `failedAttempts` is updated atomically.
  - **Anti-Enumeration Generic Failures:** Non-existent accounts, wrong passwords, and inactive accounts return identical generic `INVALID_CREDENTIALS` reasons, while still consuming attempts in the rate limiter bucket.
  - **Auto-Reset on Successful Login:** Valid password verification resets `failedAttempts: 0`, `lockedUntil: null`, updates `lastLoginAt`, and clears the Valkey rate limit bucket (`resetRateLimit`).
- **Tests:**
  - 9 unit tests in [`tests/unit/auth/rate-limiter.test.ts`](file:///e:/SPPLPF/tests/unit/auth/rate-limiter.test.ts) (hashing, normalization, sliding window consumption, retry timing, check, reset, fail-closed).
  - 9 unit tests in [`tests/unit/auth/auth-lockout.test.ts`](file:///e:/SPPLPF/tests/unit/auth/auth-lockout.test.ts) (lockout escalation, lockout expiry, rate limit rejection, IP limiting, service unavailable).
  - 7 integration tests in [`tests/integration/rate-limiter.test.ts`](file:///e:/SPPLPF/tests/integration/rate-limiter.test.ts) (live Valkey sliding window, 10 concurrent requests without bypass, bounded TTL, independent account/IP buckets, PostgreSQL lockout escalation, session creation).

### 2.6. Granular RBAC Engine & Server-Side Permission Guards (Phase 08 / TASK-013/014)
- **Status:** Complete & validated against live PostgreSQL & Valkey.
- **Modules:** [`src/lib/auth/rbac.ts`](file:///e:/SPPLPF/src/lib/auth/rbac.ts), [`src/lib/auth/index.ts`](file:///e:/SPPLPF/src/lib/auth/index.ts).
- **Core Architecture & Authorization Guarantees:**
  - **Dynamic Relational Resolution:** Resolves roles and capabilities via PostgreSQL relational joins (`users` -> `user_roles` -> `roles` -> `role_permissions` -> `permissions`).
  - **Strict Deny-by-Default:** Users with 0 roles possess 0 permissions. Access is denied unless an explicit permission token is resolved from assigned roles.
  - **Zero Hardcoded Bypasses:** Even `SUPER_ADMIN` relies on its explicit database role-permission associations established during idempotent seeding (all 12 permissions). No unconditional wildcard bypass exists in code.
  - **Granular Capability Enforcement:** Authorization checks enforce fine-grained capabilities (`content.publish`, `users.manage`, `audit.view`) rather than brittle role-name string matching.
  - **Real-Time Revocation:** Role assignments and permissions are queried dynamically from the database, ensuring changes take effect immediately without token re-issuance or stale claims.
  - **Fail-Closed on Dependency Outage:** If the PostgreSQL database or authorization layer encounters an error, requests fail closed (`SERVICE_UNAVAILABLE` or `false`), never permitting unauthorized access.
  - **Integrated Defense Pipeline:** `resolveSessionAuthorization` and `requirePermission` combine cookie signature validation, Valkey session verifier lookup, account active status, account lockout status, and role-permission resolution in a unified pipeline.
  - **Zero Sensitive Data Exposure:** Password hashes, session tokens, and internal database details are excluded from all returned authorization contexts and logs.
  - **Seeded Role Coverage:**
    - `SUPER_ADMIN`: 12 system permissions (`users.manage`, `roles.manage`, `content.create`, `content.edit`, `content.review`, `content.publish`, `content.archive`, `media.upload`, `media.delete`, `settings.manage`, `audit.view`, `inquiries.manage`).
    - `CONTENT_MANAGER`: 7 editorial permissions (`content.create`, `content.edit`, `content.review`, `content.publish`, `content.archive`, `media.upload`, `inquiries.manage`).
    - `CONTENT_AUTHOR`: 3 authoring permissions (`content.create`, `content.edit`, `media.upload`).
    - `AUDITOR`: 1 compliance permission (`audit.view`).
- **Tests:**
  - 14 unit tests in [`tests/unit/auth/rbac.test.ts`](file:///e:/SPPLPF/tests/unit/auth/rbac.test.ts) (deny-by-default, deduplication, fail-closed, conjunction, disjunction, session guards, cookie extraction).
  - 9 integration tests in [`tests/integration/rbac.test.ts`](file:///e:/SPPLPF/tests/integration/rbac.test.ts) (all 4 seeded roles, unassigned users, real-time dynamic role changes, live session cookies, inactive/locked users, revoked sessions).

### 2.7. Complete Institutional Frontend Prototype Sprint (Phases 09–11, 13 UI)
- **Status:** Complete & validated via Next.js Turbopack production build & Vitest test suite.
- **Scope:** Full-featured, bilingual (Arabic-first & English), user-visible prototype of the public portal (16 routes) and administrative dashboard (14 routes) to allow stakeholder demonstration and information architecture review ahead of backend integration.
- **Deliverables:**
  - **Design System & Styling:** [`src/styles/tokens.css`](file:///e:/SPPLPF/src/styles/tokens.css), [`src/styles/globals.css`](file:///e:/SPPLPF/src/styles/globals.css). Institutional navy (`#0f4c81`), azure (`#009fe3`), warm gold (`#d97706`), slate neutrals, CSS logical properties for seamless bi-directional layout.
  - **Localization Engine:** [`src/lib/i18n/`](file:///e:/SPPLPF/src/lib/i18n/). Bilingual dictionaries, path switching helper, and auto-synchronizing `DirectionSync` component dynamically updating `html.dir` and `html.lang`.
  - **Accessible UI Library:** [`src/components/ui/`](file:///e:/SPPLPF/src/components/ui/). 14 accessible components (`Button`, `Card`, `Badge`, `Input`, `Textarea`, `Select`, `FormField`, `Alert`, `Modal`, `Tabs`, `Accordion`, `Pagination`, `Table`, `EmptyState`) plus dedicated SVG icon set in [`src/components/icons/index.tsx`](file:///e:/SPPLPF/src/components/icons/index.tsx).
  - **Shared Layouts:** Public header, footer, breadcrumbs, page headers, admin shell, admin sidebar, admin header, and sticky demo banner with instant reset modal.
  - **Public Routes (16 routes):**
    - `/[locale]` (Home Portal)
    - `/[locale]/about`, `/[locale]/about/values`, `/[locale]/about/goals`, `/[locale]/about/milestones`
    - `/[locale]/programs`, `/[locale]/programs/[slug]` (Factsheets & interactive pillar filter)
    - `/[locale]/news`, `/[locale]/news/[slug]` (Keyword search, topic tags, pagination)
    - `/[locale]/activities`, `/[locale]/stories`, `/[locale]/publications`, `/[locale]/presence` (Field hubs in Taiz, Marib, Sana'a)
    - `/[locale]/contact` (Interactive form with anti-spam honeypot, validation, and demo store submission)
    - `/[locale]/legal/privacy`, `/[locale]/legal/terms`, `/[locale]/legal/neutrality` (Core institutional charters)
  - **Admin Dashboard Routes (14 routes):**
    - `/admin/login` (Persona quick-fill simulation)
    - `/admin/overview` (Live metrics, quick action triggers, audit log feed)
    - `/admin/content`, `/admin/content/new`, `/admin/content/[id]` (Multi-tab bilingual editor, live preview, state transitions)
    - `/admin/workflow` (Editorial review queue: submit, request changes with notes, publish)
    - `/admin/programs`, `/admin/publications`, `/admin/media`, `/admin/inquiries`
    - `/admin/users` (Account status toggle, role assignment modal across 4 RBAC roles)
    - `/admin/audit-logs` (Filtered compliance audit viewer)
    - `/admin/settings` (Site settings with emergency takedown mode toggle)
  - **Reactive Client Demo Store:** [`src/lib/demo/store.ts`](file:///e:/SPPLPF/src/lib/demo/store.ts), [`src/lib/demo/fixtures.ts`](file:///e:/SPPLPF/src/lib/demo/fixtures.ts). Seeded with realistic institutional data (local mediation, detainee exchanges, legal aid, community peace committees), reactive state persistence via `localStorage`, and zero connection to PostgreSQL or Valkey.
- **Safety & Isolation Guarantees:**
  - Zero database mutations: `spplpf_prod` and `spplpf_dev` datastores remain untouched.
  - Zero authentication service regressions: Argon2id, cookie verification, Redis session store, and RBAC guards remain completely intact.
  - Clear demo demarcation: Prominent `DEMO / وضع المعاينة — بيانات غير معتمدة` banner across all pages with demo reset trigger.
- **Tests & Verification:**
  - Unit tests: 8 test files, 86 tests passed (100% passing) via [`vitest.config.mts`](file:///e:/SPPLPF/vitest.config.mts).
  - TypeScript: Zero errors (`npx tsc --noEmit`).
### 2.8. Frontend Visual Redesign & UX Modernization (Sprint: feat/frontend-visual-refresh)
- **Status:** Complete & validated via Next.js Turbopack build & Vitest test suite.
- **Scope:** Research-driven UI/UX overhaul across public portal and administrative workspace based on external non-profit peacebuilding benchmarks (EPISA, Latte Creative, Cosmic JS, Kiranism shadcn dashboard).
- **Deliverables:**
  - **Research & Decision Matrix:** [`docs/frontend-design-references.md`](file:///e:/SPPLPF/docs/frontend-design-references.md). Source analysis, adapted UX patterns, and license/stack compatibility checks.
  - **Genuine Icon System:** [`src/components/icons/index.tsx`](file:///e:/SPPLPF/src/components/icons/index.tsx). Installed and pinned [`lucide-react@1.61.0`](https://lucide.dev/). Fully replaced all handcrafted SVGs and Unicode glyphs with genuine Lucide vector components, standard 1.75px stroke width, and `aria-hidden="true"` accessibility defaults.
  - **Refined Institutional Tokens & Typography:** [`src/styles/tokens.css`](file:///e:/SPPLPF/src/styles/tokens.css), [`src/styles/globals.css`](file:///e:/SPPLPF/src/styles/globals.css). Warm institutional palette (Navy `#0f325a`, Azure `#0284c7`, Warm Gold `#c27803`, Warm Parchment `#fcfbf9`), Google Fonts Cairo/Inter, multi-tier elevation shadows, and card hover micro-animations.
  - **Navigation Overhaul:** [`src/components/layout/PublicHeader.tsx`](file:///e:/SPPLPF/src/components/layout/PublicHeader.tsx). Reorganized crowded flat links into 6 deliberate focus areas with structured dropdowns (About, Programs, Media Center), distinct active page indicators, refined locale switcher, and direction-aware mobile drawer.
  - **Compact Demo Banner:** [`src/components/layout/DemoBanner.tsx`](file:///e:/SPPLPF/src/components/layout/DemoBanner.tsx). Visually subordinate, sleek status pill with accessible confirmation modal for instant demo data reset.
  - **Asymmetric Editorial Hero & Factsheet:** [`src/app/[locale]/page.tsx`](file:///e:/SPPLPF/src/app/[locale]/page.tsx). Replaced flat dark-blue box with an asymmetric layout featuring an institutional badge, high-contrast Arabic headline, dual action CTAs (`explore` & `contact`), trust indicator strip, and an interactive impact factsheet card.
  - **Content-Aware Cards & Section Hierarchy:** Distinct visual compositions for news articles with date badges, field programs with geographic tags, impact stories with quote styling, and publications with document PDF badges.
  - **Modernized Admin Workspace:** [`src/components/layout/AdminSidebar.tsx`](file:///e:/SPPLPF/src/components/layout/AdminSidebar.tsx), [`src/components/layout/AdminHeader.tsx`](file:///e:/SPPLPF/src/components/layout/AdminHeader.tsx), [`src/app/admin/overview/page.tsx`](file:///e:/SPPLPF/src/app/admin/overview/page.tsx). Kiranism/shadcn-inspired high-density layout with 3 grouped sidebar sections, live badge counters for in-review items, high-density metric widgets, and refined login screen.
  - **Strict Boundaries Preserved:** Zero database mutations, zero authentication service regressions, zero fake real-world endorsements.
- **Tests & Verification:**
  - TypeScript: Zero errors (`npx tsc --noEmit`).
  - Unit tests: 8 test files, 87 tests passed (100% passing) via [`vitest.config.mts`](file:///e:/SPPLPF/vitest.config.mts).
  - Next.js Turbopack build: Compiled successfully in 1017ms; all 33 routes generated cleanly without errors.

---

## 3. Operational Gates & Release State

- **Hosted CI Status:** **UNVERIFIED** (GitHub Actions blocked by project owner account billing lock; all tests, builds, and policy checks pass locally).
- **Security Gate GATE-06:** **ACTIVE & OPEN** (`exit-code: '1'`; upstream unfixed base image CVEs such as `zlib 1.3.2-r0` and `libxml2` remain unsuppressed in register).
- **Production Gate:** All production deployments and migrations remain locked pending PR review and billing unlock.
