# SPPLPF Verified Toolchain Stack Versions Lock

**Substantiated:** 21 October 2026  
**Environment:** Windows Node.js v22.13+ / PowerShell  
**Phase 05 Compatibility Gate (TASK-001a):** PASSED (Clean `npm ci` + 7/7 static gates verified with Exit Code 0)

---

## 1. Verified Core Runtime & Toolchain Packages

| Package | Pinned Version | Lockfile Version | Verification Status |
|:---|:---|:---|:---|
| `next` | `16.4.2` | `16.4.2` | Production build verified (`Turbopack` static prerender) |
| `react` | `19.2.7` | `19.2.7` | Peer dependency validated |
| `react-dom` | `19.2.7` | `19.2.7` | Peer dependency validated |
| `typescript` | `5.8.2` | `5.8.2` | Strict mode check passed (`tsc --noEmit`) |
| `prisma` | `7.1.0` | `7.1.0` | CLI and migration engine verified |
| `@prisma/client` | `7.1.0` | `7.1.0` | Generated to `src/generated/prisma-client` |
| `@prisma/adapter-pg` | `7.1.0` | `7.1.0` | Driver adapter verified with Prisma 7.1.0 |
| `pg` | `8.13.3` | `8.13.3` | Native Node.js PostgreSQL pool driver |
| `@types/pg` | `8.11.11` | `8.11.11` | Types validated |
| `ioredis` | `5.5.0` | `5.5.0` | Redis/Valkey client library verified |
| `@types/node` | `22.13.9` | `22.13.9` | Node.js LTS types validated |
| `@types/react` | `19.2.7` | `19.2.7` | Types validated |
| `@types/react-dom` | `19.2.7` | `19.2.7` | Types validated |
| `vitest` | `4.1.12` | `4.1.12` | Unit test runner verified (3/3 passed) |

---

## 2. Phase 05 Clean Installation & Compatibility Gate Execution Log

1. **Reproducible Installation (`npm ci`):** Executed clean installation against committed `package-lock.json`. Added 254 packages, audited 255 packages with Exit Code 0.
2. **Prisma Client Generation (`npx prisma generate`):** Generated Prisma Client (7.1.0) into `./src/generated/prisma-client` in 237ms (Exit Code 0).
3. **Strict TypeScript Compilation (`npx tsc --noEmit`):** Executed full project typecheck in strict mode (`"strict": true`) with zero errors (Exit Code 0).
4. **Schema Validation (`npx prisma validate`):** Successfully validated all 33 relational models against Prisma 7 syntax rules (Exit Code 0).
5. **Dry-Run Migration DDL (`npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script`):** Generated full PostgreSQL SQL DDL schema without connecting to or mutating a live database (Exit Code 0).
6. **Production Application Build (`npm run build`):** Compiled Next.js 16.4.2 App Router bundle via Turbopack in 2.3s; static routes `/` and `/_not-found` prerendered with zero errors (Exit Code 0). Note: Current scaffold contains no application or website feature code.
7. **Unit Smoke Tests (`npm run test:unit`):** Vitest 4.1.12 executed 3 unit tests in `tests/unit/smoke.test.ts` (Prisma Client instantiation, SHA256 outbox idempotency hashing, Arabic RTL default locale) with 100% pass in 6ms (Exit Code 0).

---

## 3. Test-Script Integrity Verification

* **Unit Tests (`test:unit`):** Real Vitest suite verifying unit-level logic.
* **Integration Smoke Tests (`test:integration:smoke`):** Explicit placeholder (`echo ... && exit 0`). This script does NOT execute integration tests or verify live datastore connectivity. Full containerized integration testing is strictly scheduled for Phase 06 (**TASK-005a**).

---

## 4. Pending Implementation Gates (Phase 06)

* **GATE-03 (Docker Compose Orchestration):** Scheduled for Phase 06 (**TASK-005**).
* **GATE-04 (Valkey Non-Root Healthcheck):** Scheduled for Phase 06 (**TASK-005a**).
* **GATE-05 (Live PostgreSQL Socket Connectivity via `db-ping.ts`):** Scheduled for Phase 06 (**TASK-005a**).
* **GATE-06 (Trivy Container Vulnerability Scan):** Scheduled for Phase 06 (**TASK-005**).

