# Pull Request Description

## 1. Summary
<!-- Briefly explain what changed -->

## 2. Reason
<!-- Why was this change necessary? Reference task ID and phase -->

## 3. Files and Behavior
<!-- Detail the principal modifications and architectural decisions -->

## 4. Validation & Test Evidence
<!-- List exact commands executed and actual outputs / exit codes -->
- [ ] `npm ci`: 
- [ ] `npx tsc --noEmit`: 
- [ ] `npm run test:unit`: 
- [ ] `npm run test:integration:smoke`: 
- [ ] `scripts/db-ping.ts`: 

## 5. Security Impact
<!-- Address secrets, permissions, vulnerabilities, and credential handling -->
- [ ] No secrets, passwords, or tokens committed or exposed
- [ ] Non-root runtime user configuration preserved
- [ ] Appropriate file/group permissions applied

## 6. Database Impact
<!-- Specify migrations, data-preservation constraints, seed idempotency, or rollback runbooks -->

## 7. Outstanding Issues & Next Dependencies
<!-- Note anything pending, blockers, or subsequent implementation steps -->
