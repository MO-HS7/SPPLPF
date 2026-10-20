# SPPLPF Verified Toolchain Stack Versions Lock

**Substantiated:** 20 October 2026  
**Environment:** Windows Node.js v22.13+ / PowerShell  
**Phase 05 Compatibility Gate (TASK-001a):** PASSED (7/7 gates verified with Exit Code 0)

---

## 1. Verified Core Runtime & Toolchain Packages

| Package | Pinned Version | Lockfile Version | Verification Status |
|:---|:---|:---|:---|
| `next` | `16.4.2` | `16.4.2` | Production build verified (`Turbopack`) |
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

## 2. Phase 05 Compatibility Gate Execution Log

1. **Scaffold & Lockfile:** `package-lock.json` generated and verified via `npm install` (192 packages audited).
2. **Prisma Client Generation:** `npx prisma generate` generated client into `./src/generated/prisma-client` in 178ms.
3. **Strict TypeScript Compilation:** `npx tsc --noEmit` executed with zero errors.
4. **Schema Validation:** `npx prisma validate` validated all 33 relational models.
5. **Dry-Run Migration DDL:** `npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script` successfully emitted all tables, indexes, and constraints.
6. **Production Application Build:** `npm run build` compiled static Next.js App Router bundle in 495ms.
7. **Unit Smoke Tests:** `npm run test:unit` (Vitest) executed 3 tests with 100% pass in 328ms.

---

## 3. Pending Implementation Gates (Phase 06)

* **GATE-03 (Docker Compose Orchestration):** Scheduled for Phase 06 (**TASK-005**).
* **GATE-04 (Valkey Non-Root Healthcheck):** Scheduled for Phase 06 (**TASK-005a**).
* **GATE-05 (Live PostgreSQL Socket Connectivity via `db-ping.ts`):** Scheduled for Phase 06 (**TASK-005a**).
* **GATE-06 (Trivy Container Vulnerability Scan):** Scheduled for Phase 06 (**TASK-005**).
