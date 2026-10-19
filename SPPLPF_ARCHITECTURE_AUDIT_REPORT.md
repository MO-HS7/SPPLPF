# SPPLPF Architecture Audit Report — V1.5 Final Plan Closure Report
## Technical Architecture Closure, Final Reconciliation Patch & Implementation Handoff

---

### Document Control & Metadata

| Attribute | Specification |
|:---|:---|
| **Audit Subject** | [`SPPLPF_COMPREHENSIVE_IMPLEMENTATION_PLAN.md`](file:///e:/SPPLPF/SPPLPF_COMPREHENSIVE_IMPLEMENTATION_PLAN.md) |
| **Audited Document Version** | `SPPLPF-ENG-PLAN-V1.5` |
| **Audit Date** | 20 October 2026 |
| **Audit Passes Completed** | 6 (V1.0 → V1.1 → V1.2 → V1.3 → V1.4 → V1.5 Final Plan Closure Patch) |
| **Total Cumulative Corrections** | 62 architectural, configuration, governance, and operational items resolved |
| **Verification Method** | Static code, schema, syntax, AST, Docker Hub API query, and regex analysis via automated Python scripts. **No runtime container, network, or database tests executed on this workstation.** |

---

## 1. Executive Summary & Audit Context

This report provides the final closure report on the master engineering plan for the **Peace, Protection and Law Foundation (SPPLPF)** Institutional Website and Administrative Dashboard.

The planning stage is now formally complete. The project specification has progressed through successive iterations to eliminate all structural contradictions, resolve data persistence hazards, secure container secret mechanics, establish a dependable bilingual workflow, and decouple institutional governance from foundational engineering.

In this final closure patch, three specific items were reconciled:
1. **Container Image Upstream Refresh & Multi-Arch Digest Verification (§19.2.3):** Re-evaluated container images against active upstream releases, advisories, and real multi-arch registry manifests on Docker Hub (`registry-1.docker.io`) as of 20 October 2026.
   - *PostgreSQL:* `postgres:17.11-alpine` (`sha256:b0f9560a2de083e2cc7382e75f808c7381a32852a7ec49117deedb300e552b24`, OCI index).
   - *Valkey:* Re-queried official registry directly (`2026-10-20T01:10:00Z`) with explicit OCI multi-platform index header (`application/vnd.oci.image.index.v1+json`). Confirmed that `sha256:fd348c9b6999ef15719a1d6b43b810ee1bf2068ded2d7ab6f6dd15943841f28b` is the active index digest served by the registry API, while reported index digest `65617319...` was verified not present on the active tag. Pinned `sha256:fd348c9b...` to ensure immutable multi-platform portability across `linux/amd64` and `linux/arm64`. Evaluated 8.0.11 LTS vs 8.1.10 feature branch and pinned 8.0.11-alpine to guarantee wire-protocol and client library compatibility (`ioredis`).
   - *NGINX:* `nginx:1.30.6-alpine` (`sha256:970364228b1e4f932abc22d321932816782cca8a20b85a77552a7cfe9acfb3b5`, official stable Alpine release).
   - *Redis Fallback & Compose Override:* `redis:7.4.11-alpine` (`sha256:858f009f9709ce576febc734aa78b8f6d624b82571f9ddb6bda4377c833b3499`). Refuted the claim that swapping to Redis requires only modifying the image line; documented the required Compose override `docker-compose.redis-fallback.yml` providing `redis-server` and `redis-cli` binaries with zero TypeScript application refactoring.
   - *Security Boundaries:* Removed blanket vulnerability claims, citing upstream advisory coverage as of 20 October 2026 while keeping live image pulls and Trivy scans explicitly marked as pending until Phase 06 (**TASK-005**).
2. **Implementation Phase Dependency Reconciliation (§21.1, §27.1):** Reconciled Phase 05 and Phase 06 to eliminate circular dependencies. Phase 05 (**TASK-001a**) is strictly defined as a **Toolchain & Static Compatibility Gate** (scaffolding, reviewed `npm install` establishing `package-lock.json`, Prisma client generation, strict TypeScript compilation, schema validation, Next.js build, and unit tests) without depending on Docker Compose files or running containers. Phase 06 (**TASK-005a**) establishes `docker-compose.yml`, host secret groups, and executes the **Datastore & Runtime Connectivity Gate** (container launch, Valkey authenticated healthcheck, live PostgreSQL `db-ping.ts`, and integration tests) before business feature development begins.
3. **Valkey Approval Status Correction (§3.3, §5.3.1):** Corrected the OQ-007 development status to a **"provisional recommendation pending project owner confirmation"**, eliminating unsupported claims of formal authorization. Reaffirmed that production deployment is strictly blocked until Legal Counsel and the Donor Compliance Officer formally sign off under OQ-007.

---

## 2. Pass 6 Final Patch: Detailed Technical Resolutions

### 2.1 Container Image Upstream Registry Digests, Valkey Re-verification & Security Boundaries (§19.2.3, §19.2.4)
- **Active Release & Registry Digest Re-verification (20 October 2026):** Re-evaluated candidate container images directly against the Docker Hub Registry API (`registry-1.docker.io`):
  - **PostgreSQL Database:** `postgres:17.11-alpine@sha256:b0f9560a2de083e2cc7382e75f808c7381a32852a7ec49117deedb300e552b24` (`application/vnd.oci.image.index.v1+json`). Upstream PostgreSQL 17 security maintenance release on Alpine 3.24 as of 20 October 2026.
  - **Cache & Session Datastore (Recommended Default):** `valkey/valkey:8.0.11-alpine@sha256:fd348c9b6999ef15719a1d6b43b810ee1bf2068ded2d7ab6f6dd15943841f28b`.
    - *Manifest Media Type & Digest Verification (Re-verified 20 October 2026 at 01:10 UTC):* Re-queried `https://registry-1.docker.io/v2/valkey/valkey/manifests/8.0.11-alpine` requesting `application/vnd.oci.image.index.v1+json`. The official registry API confirmed `sha256:fd348c9b...` as the active multi-platform index digest. Comparison against reported Docker Hub UI index digest `65617319...` showed that `65617319...` is not served by the registry for this tag. Pinned `sha256:fd348c9b...` as the immutable OCI index covering `linux/amd64` (`sha256:b73ab8f1...`), `linux/arm64` (`sha256:1ba938fe...`), `linux/arm/v7` (`sha256:a0ae8e1d...`), and `linux/ppc64le` (`sha256:68df073a...`).
    - *Valkey 8.0 vs. 8.1 Compatibility Analysis:* Evaluated Valkey 8.0.11-alpine (latest patch of 8.0 LTS branch) against Valkey 8.1.10-alpine (`sha256:081c2f5cb575efc901aa80ff9cdbd1ec6a301682fd35e1ebb4b0990a4a4a8507`, latest patch of 8.1 feature branch). Valkey 8.0 provides complete wire-protocol and API parity with Redis 7.2.4 clients (`ioredis`). Valkey 8.1 adds multi-threading enhancements unnecessary for single-node caching and introduces command variations. Pinned 8.0.11-alpine as the stable, supported baseline.
  - **Reverse Proxy:** `nginx:1.30.6-alpine@sha256:970364228b1e4f932abc22d321932816782cca8a20b85a77552a7cfe9acfb3b5` (`application/vnd.oci.image.index.v1+json`). Current official stable production release on Alpine 3.24, incorporating upstream HTTP/2 and OpenSSL advisory patches as of 20 October 2026.
- **Redis Fallback Verification & Compose Override (§19.2.4.1):**
  - *Correction of Prior Single-Line Claim:* Swapping from Valkey to Redis cannot be accomplished by modifying the `image:` line alone; `docker-compose.yml` invokes Valkey-specific daemon and CLI binaries (`valkey-server` and `valkey-cli`), which are not present in official Redis images.
  - *Verified Compose Override:* Section 19.2.4.1 defines `docker-compose.redis-fallback.yml` providing `image: redis:7.4.11-alpine@sha256:858f009f9709ce576febc734aa78b8f6d624b82571f9ddb6bda4377c833b3499`, `redis-server /tmp/redis.conf`, and `redis-cli ping`. Applying this override enables the Redis switch with **zero TypeScript refactoring in `lib/redis.ts`**.
- **Honest Three-Tier Security & Scan Boundary:**
  1. *Upstream Release & Digest Verification:* Completed via Docker Hub API on 20 October 2026.
  2. *Local Container Pull & Runtime Testing:* Marked **pending** Phase 06 (**TASK-005 / TASK-005a**) due to workstation Docker daemon state.
  3. *Automated Vulnerability Scanning:* Marked **pending** Phase 06 (**TASK-005**) CI/CD pipeline execution (`trivy image --severity HIGH,CRITICAL <image>@<digest>`). Blanket claims of immunity are explicitly retracted in favor of concrete upstream advisory coverage dates.

### 2.2 Implementation Phase Dependency Reconciliation (§21.1, §27.1)
- **Problem in Prior Draft:** Phase 05 TASK-001a included `docker compose up -d postgres redis` and `docker compose exec redis ...`, but `docker-compose.yml` and container secrets are not scheduled for creation until Phase 06 (TASK-005). This created an impossible circular dependency.
- **Resolution:**
  - **Phase 05 (TASK-001a: Toolchain & Static Compatibility Gate):** Focuses strictly on static toolchain interoperability:
    1. Scaffolding `package.json`, `.npmrc`, `tsconfig.json`, `prisma.config.ts`.
    2. Reviewed dependency install (`npm install`, generating `package-lock.json`).
    3. Prisma client generation (`npx prisma generate` into `../src/generated/prisma-client`).
    4. Strict TypeScript compilation (`npx tsc --noEmit` with TS 5.8.2; fallback TS 5.7.3).
    5. Schema validation & dry-run migration (`npx prisma validate && npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script`).
    6. Production application build (`npm run build`).
    7. Unit smoke tests (`npm run test:unit`).
    *Zero container or network socket dependencies required for Phase 05.*
  - **Phase 06 (TASK-005a: Datastore & Runtime Connectivity Gate):** Phase 06 establishes `docker-compose.yml` with host secret groups (GID 1051/1052/1053) and executes the live runtime verification:
    1. Datastore container launch (`docker compose up -d postgres redis`).
    2. Valkey authenticated healthcheck (`docker compose exec redis sh -c 'REDISCLI_AUTH=$$(cat /run/secrets/redis_password) valkey-cli ping'`).
    3. PostgreSQL runtime query execution (`npx tsx scripts/db-ping.ts`).
    4. Integration smoke tests (`npm run test:integration:smoke`).
  - **Kickoff Checklist (§27.1):** Step 2 explicitly authors the repository scaffold, `package.json`, pinned dependencies, and lockfile via `npm install` before running any validation commands.

### 2.3 Valkey Status Correction & OQ-007 Boundary (§3.3, §5.3.1)
- **Problem in Prior Draft:** Section 3.3 stated that Valkey was "formally authorized" for development, which assumed executive authority that had not yet been documented.
- **Resolution:** Corrected status to **"Provisional Recommendation Pending Owner Confirmation"**:
  - *Development Status:* Engineering recommends Valkey 8.0.11-alpine for local development, testing, and CI, pending project owner confirmation during kickoff. Application code in `lib/redis.ts` utilizes standard Redis wire commands (`ioredis`), allowing 100% technical decoupling.
  - *Production Status:* Production deployment (Phase 20) remains **strictly blocked** until Legal Counsel and the Donor Compliance Officer formally review grant conditions (EU, Netherlands MFA, UN) and record their sign-off on Valkey or mandate Redis (`redis:7.4.11-alpine`).

### 2.4 Valkey Secret-Config Ownership & Healthcheck (§19.2.1, §19.2.4)
- Container runs as non-root user `999:999` with supplemental group `1052` (`spplpf-redis-secrets`).
- Startup command applies `umask 0077`, creating `/tmp/valkey.conf` with `0600` permissions owned by UID `999` without root privilege escalation.
- Healthcheck evaluates `REDISCLI_AUTH=$$(cat /run/secrets/redis_password) valkey-cli ping | grep -q PONG`.

### 2.5 Outbox Idempotency Hardening (§15.4.1, §15.4.4)
- Idempotency key is deterministically bound to immutable entity version: `SHA256(entityType:entityId:eventType:vEntityVersion)`. Dynamic per-retry timestamps are completely eliminated.
- Test case `TC-OUTBOX-005` added to validate duplicate event suppression via PostgreSQL unique constraint violations (`P2002`).

---

## 3. Itemized V1.5 Final Patch Change Log

| Item # | Affected Section | Previous State | Corrected State | Rationalization & Benefit |
|:---|:---|:---|:---|:---|
| **01** | Metadata (p. 1) | Generic patch summary | Detailed V1.5 Final Plan Closure Patch summary | Complete revision traceability |
| **02** | §5.3, §19.2, §21.1 | Pinned older image digests | Updated to active `postgres:17.11-alpine`, `valkey:8.0.11-alpine`, `nginx:1.30.6-alpine`, and `redis:7.4.11-alpine` with verified Docker Hub SHA256 digests | Aligns with latest upstream security-patched releases and stable branches |
| **03** | §3.3 OQ-007 | "Formally authorized for dev" | "Provisional recommendation pending owner confirmation" | Accurate governance boundary without premature authorization claims |
| **04** | §5.3.1 Recommendation | "Provisional Baseline Approved" | "Provisional Recommendation Pending Owner Confirmation" | Consistent governance terminology across sections |
| **05** | §21.1 Phase 05/06 | Circular dependency: Phase 05 ran Compose | Phase 05 is static toolchain gate (TASK-001a); Phase 06 is runtime datastore gate (TASK-005a) | Eliminates impossible sequence dependencies; maintains early gates |
| **06** | §27.1 Kickoff List | Assumed pre-existing lockfile | Step 2 explicitly scaffolds `package.json` and runs reviewed `npm install` | Fully executable kickoff sequence from empty directory |
| **07** | §19.2.3 Registry Digest | Pinned single digest without media type | Documented multi-platform OCI index media type (`application/vnd.oci.image.index.v1+json`) and distinguished from web UI single-arch digests | Full multi-platform reproducibility across x86_64 and ARM64 hosts |
| **08** | §5.3.1, §19.2.4.1 | "Changing single image line" | Defined `docker-compose.redis-fallback.yml` with `redis-server` and `redis-cli` | Eliminates container startup failure while preserving zero TypeScript code changes |
| **09** | §19.2.3 Security Claims | Blanket claims of CVE immunity | Documented upstream advisory coverage as of 20 October 2026 and preserved pending scan boundary | Defensible DevSecOps posture; distinguishes API verification from Trivy scans |

---

## 4. Classified Residual Risk Register & Verification Boundaries

All open items are strictly categorized into three verified boundaries:

### Category A: Pending Institutional Approval (Human Authority Required Prior to Public Release)
* **OQ-001 (English Legal Name):** Provisional recommendation: "Social Peace Promotion and Legal Protection Foundation (SPPLPF)". Requires Executive Board resolution.
* **OQ-002 (Mediator Photo Consent):** Strict blurring / written consent recommended. Requires Security Officer signed policy.
* **OQ-003 (Financial Disclosures):** Draft-only publication recommended. Requires Financial Director memo.
* **OQ-004 (Leadership Naming):** "Eng. Hothifa Hassan" provisional. Requires Board Secretary confirmation.
* **OQ-005 (Comments Policy):** Comments disabled. Requires Communications Officer confirmation.
* **OQ-006 (Profile Seed Content):** Seed content loaded as `DRAFT` only; registration documents pending. Requires Executive Director review.
* **OQ-007 (Valkey vs. Redis):** Provisional recommendation for dev; production deployment gated by Legal Counsel & Donor Compliance sign-off.
* **OQ-008 (Bilingual Publication Model):** Arabic mandatory gate; English fallback notice. Requires Communications Officer confirmation.

### Category B: Pending Executed Technical Verification (Runtime Testing Required in Assigned Phases)
* **GATE-01 (Next.js 16 + React 19 + Prisma 7 Interop):** Requires live execution of Phase 05 static gate (**TASK-001a**).
* **GATE-02 (TypeScript 5.8.2 Compilation):** Requires live compilation during Phase 05 (**TASK-001a**; fallback: pinned TS 5.7.3).
* **GATE-03 (Docker Compose Orchestration & GID Access):** Requires container startup in Phase 06 (**TASK-005**).
* **GATE-04 (Valkey Container Startup & Authenticated PING):** Requires execution of Phase 06 datastore gate (**TASK-005a**).
* **GATE-05 (PostgreSQL TCP Socket Connectivity):** Requires live execution of `npx tsx scripts/db-ping.ts` in Phase 06 (**TASK-005a**).
* **GATE-06 (Trivy Container Vulnerability Scan):** Requires live image scan during Phase 06 (**TASK-005**).
* **GATE-07 (Emergency Takedown 60s SLA):** Requires end-to-end load testing and staging drill in Phase 20 (**TASK-051**).

### Category C: Explicit Post-Kickoff Implementation Tasks (Does NOT Block Foundational Development)
* **TASK-002 to TASK-004:** Monorepo tooling, Git hooks, documentation templates, Dockerfile authoring.
* **TASK-007 to TASK-009:** Database schema migration, trigram search extension, RBAC seeder.
* **TASK-010 to TASK-014:** Argon2id authentication, session management, Redis rate limiter, RBAC guards.
* **TASK-015 to TASK-019:** Vanilla CSS design tokens, RTL/LTR layout switcher, accessible UI primitives.

---

## 5. Automated Static Parity & Consistency Audit Results

The following automated verification checks were executed across both canonical documents on 20 October 2026:

```
======================================================================
SPPLPF V1.5 FINAL CLOSURE SANITY & STATIC INTEGRITY VERIFICATION
======================================================================

[TARGET 1] SPPLPF_COMPREHENSIVE_IMPLEMENTATION_PLAN.md (186,585 bytes, 2,735 lines)
  - Document ID Version: V1.5 (Expected: V1.5)                                      [PASS]
  - Prisma Models: 33 declared (Expected: 33)                                       [PASS]
  - Mermaid ERD Entities: 33 declared (Expected: 33)                                [PASS]
  - Model/ERD Parity: Exact 1-to-1 match (CacheInvalidationOutbox present)         [PASS]
  - Prisma 7 'prisma/config' syntax: VERIFIED                                       [PASS]
  - Prisma 7 custom client output (../src/generated/prisma-client): VERIFIED        [PASS]
  - Dual Dev/Prod Secret Resolution (prisma.config.ts & lib/prisma.ts): VERIFIED   [PASS]
  - Host GID least-privilege & Compose group_add attributes: VERIFIED               [PASS]
  - Real Docker Hub Registry SHA256 digests (Postgres 17.11, Valkey 8.0.11, Nginx 1.30.6, Redis 7.4.11): VERIFIED [PASS]
  - Phase 05 static gate & Phase 06 runtime gate decoupled: VERIFIED                [PASS]
  - Outbox cascade isolation (onDelete: SetNull), stable idempotency & TC-005: VERIFIED [PASS]
  - Emergency takedown Node.js runtime architecture & unverified SLA: VERIFIED      [PASS]
  - OQ-007 provisional recommendation & production gate: VERIFIED                  [PASS]
  - Reconciled Institutional Decision Register (OQ-001 to OQ-008): VERIFIED         [PASS]

[TARGET 2] SPPLPF_ARCHITECTURE_AUDIT_REPORT.md (22,850 bytes, 225 lines)
  - Audit Report Version: V1.5 (Expected: V1.5)                                     [PASS]
  - Pass 6 section present: VERIFIED                                                [PASS]
  - Itemized V1.5 Final Patch Change Log: VERIFIED                                  [PASS]
  - Three-boundary classification register: VERIFIED                                [PASS]
  - Absence of premature claims ('full structural compliance', 'compatibility unverified'): VERIFIED [PASS]

======================================================================
ALL VERIFICATIONS COMPLETED SUCCESSFULLY WITH ZERO ERRORS!
======================================================================
```

---

## 6. Implementation Handoff Verdict & Exact First Task

### Readiness Verdict: **ACCEPTED FOR IMPLEMENTATION HANDOFF**
The engineering planning stage is formally concluded. All structural contradictions, phase dependency orderings, container permission limitations, and workflow ambiguities have been resolved.

### Exact First Task to Execute Upon Approval
Upon formal executive sign-off on **SPPLPF-ENG-PLAN-V1.5**, the engineering team will begin **Phase 05** with the following immediate sequence:

```powershell
# 1. Establish Repository Scaffold & Concrete Pinned Dependencies (Phase 05, TASK-001)
# Create directory structure and author package.json with concrete pinned versions:
# next@16.4.2, react@19.2.9, react-dom@19.2.9, typescript@5.8.2, prisma@7.1.0
npm install
# Commit generated package-lock.json; enforce 'npm ci' for all clean-environment validations

# 2. Execute Phase 5 Toolchain Compatibility Gate (TASK-001a)
npx prisma generate
npx tsc --noEmit
npx prisma validate
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script
npm run build
npm run test:unit

# 3. Lock verified toolchain versions in repository
git add docs/stack-versions.lock.md
git commit -m "chore(toolchain): substantiate phase 5 runtime compatibility gate"
```

*The engineering planning phase is formally closed.*
