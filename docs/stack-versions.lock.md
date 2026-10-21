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

---

## 3. Verified Container Infrastructure Images & Digests

| Service | Image Tag | Immutable Manifest / Index Digest | Runtime Verification Status |
|:---|:---|:---|:---|
| PostgreSQL | `postgres:17.11-alpine` | `sha256:b0f9560a2de083e2cc7382e75f808c7381a32852a7ec49117deedb300e552b24` | Pulled; Live TCP query validated via `scripts/db-ping.ts` |
| Valkey (Default) | `valkey/valkey:8.0.11-alpine` | `sha256:fd348c9b6999ef15719a1d6b43b810ee1bf2068ded2d7ab6f6dd15943841f28b` | Pulled; Non-root UID 999; authenticated `PING` validated |
| NGINX | `nginx:1.30.6-alpine` | `sha256:970364228b1e4f932abc22d321932816782cca8a20b85a77552a7cfe9acfb3b5` | Pulled; Config syntax validated |
| Redis (Fallback) | `redis:7.4.11-alpine` | `sha256:858f009f9709ce576febc734aa78b8f6d624b82571f9ddb6bda4377c833b3499` | Pulled; Tested via `docker-compose.redis-fallback.yml` |

---

## 4. Phase 06 Runtime Validation Execution Log (TASK-005)

1. **Docker Compose Validation (GATE-03):** `docker compose config` and `docker compose -f docker-compose.yml -f docker-compose.redis-fallback.yml config` validated with Exit Code 0.
2. **Container Launch & Healthchecks:** `docker compose up -d postgres redis` launched containers. Both reported `(healthy)` via configured healthcheck probes.
3. **Valkey Non-Root Startup & Security (GATE-04):** Container runtime inspected: `uid=999(valkey) gid=999(ping) groups=999(ping),1052`. Dynamic configuration `/tmp/valkey.conf` created with `chmod 0600` (`-rw-------`). Authenticated `valkey-cli ping` returned `PONG`.
4. **Live PostgreSQL Socket Connectivity (GATE-05):** `npx tsx scripts/db-ping.ts` executed live query `SELECT 1 AS connected, current_database() AS db, version() AS pg_version;` against `spplpf_prod` over TCP port 5432. Connected successfully; `@prisma/adapter-pg` driver adapter instantiated without error (Exit Code 0).
5. **Effective Secret File Permissions Inspection:**
   - In `spplpf_postgres`: `uid=70(postgres)`, supplemental GID `1051`. Mounted `/run/secrets/db_password` read successfully.
   - In `spplpf_redis`: `uid=999(valkey)`, supplemental GID `1052`. Mounted `/run/secrets/redis_password` read successfully. `/tmp/valkey.conf` restricted to `0600`.
6. **Datastore Integration Smoke Tests:** `npm run test:integration:smoke` executed real Vitest tests in `tests/integration/smoke.test.ts` (PostgreSQL query, pg_trgm extension check, PrismaPg adapter instantiation, Valkey authenticated SET/GET/DEL); 3/3 passed in 40ms (Exit Code 0).
7. **Tested Redis Fallback Override:** Started `redis:7.4.11-alpine` via override file; verified non-root startup (`uid=999(redis)`), `/tmp/redis.conf` (`0600`), and authenticated `redis-cli ping` (`PONG`). Re-ran integration test suite with 100% pass; cleanly reverted to default Valkey.
8. **Vulnerability Scanning Results:**
   - **Docker Scout:** Executed against all 4 pinned images.
     - `postgres:17.11-alpine`: 4 Critical, 32 High, 29 Medium, 7 Low.
     - `valkey/valkey:8.0.11-alpine`: 0 Critical, 1 High, 0 Medium, 0 Low.
     - `nginx:1.30.6-alpine`: 0 Critical, 6 High, 9 Medium, 5 Low.
     - `redis:7.4.11-alpine`: 0 Critical, 4 High, 6 Medium, 3 Low.
   - **Trivy Container:** Executed misconfiguration and secret scans on `postgres:17.11-alpine` (0 misconfigurations, 0 secrets detected). Full vulnerability database download throttled by WAN network latency (~30 KiB/s), preserved for automated CI/CD pipeline execution.


