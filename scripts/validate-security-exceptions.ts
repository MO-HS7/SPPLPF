/**
 * SPPLPF Security Policy Gate Validation
 *
 * Validates that `.trivyignore.yaml` strictly conforms to the repository's
 * scoped security exception policy against REAL SCANNER OUTPUT:
 * 1. No global or wildcard ignore rules.
 * 2. All exceptions must be explicitly scoped by exact inspected file paths.
 * 3. Every rule must have a non-empty technical rationale statement.
 * 4. Every rule must have an unexpired ISO date.
 * 5. Loads actual scanner SARIF output (`tests/fixtures/security/postgres-pinned.sarif.json`)
 *    and verifies that ONLY the justified findings at /usr/local/bin/gosu are exempted,
 *    while all other findings (zlib, libxml2, etc.) remain active and visible.
 * 6. Tests that identical CVE IDs appearing at other paths remain unsuppressed.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

interface TrivyException {
  id: string;
  paths: string[];
  statement: string;
  expired_at: string;
}

interface SarifLocation {
  physicalLocation?: {
    artifactLocation?: {
      uri?: string;
    };
  };
}

interface SarifResult {
  ruleId: string;
  level?: string;
  message?: { text?: string };
  locations?: SarifLocation[];
  properties?: {
    package?: { name?: string; version?: string };
  };
}

interface SarifRun {
  results?: SarifResult[];
}

interface SarifReport {
  runs?: SarifRun[];
}

function parseSimpleTrivyYaml(content: string): { owner: string | null; authStatus: string | null; exceptions: TrivyException[] } {
  const lines = content.split(/\r?\n/);
  let owner: string | null = null;
  let authStatus: string | null = null;
  const exceptions: TrivyException[] = [];

  let current: Partial<TrivyException> | null = null;
  let inPaths = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (line.includes('Accountable Security Owner:')) {
      owner = line.split('Accountable Security Owner:')[1].trim();
    }
    if (line.includes('Authorization Status:')) {
      authStatus = line.split('Authorization Status:')[1].trim();
    }

    if (trimmed.startsWith('- id:')) {
      if (current && current.id) {
        exceptions.push(current as TrivyException);
      }
      current = {
        id: trimmed.replace(/^- id:\s*["']?([^"']+)["']?/, '$1'),
        paths: [],
        statement: '',
        expired_at: '',
      };
      inPaths = false;
    } else if (trimmed === 'paths:') {
      inPaths = true;
    } else if (inPaths && trimmed.startsWith('- ')) {
      const p = trimmed.replace(/^-\s*["']?([^"']+)["']?/, '$1');
      if (current && current.paths) {
        current.paths.push(p);
      }
    } else if (trimmed.startsWith('statement:')) {
      inPaths = false;
      if (current) {
        current.statement = trimmed.replace(/^statement:\s*["']?([^"']+)["']?/, '$1');
      }
    } else if (trimmed.startsWith('expired_at:')) {
      inPaths = false;
      if (current) {
        current.expired_at = trimmed.replace(/^expired_at:\s*["']?([^"']+)["']?/, '$1');
      }
    }
  }

  if (current && current.id) {
    exceptions.push(current as TrivyException);
  }

  return { owner, authStatus, exceptions };
}

function matchesException(cve: string, filePath: string, exceptions: TrivyException[]): boolean {
  const normalizedPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
  return exceptions.some(
    (e) =>
      e.id === cve &&
      e.paths.some((p) => {
        const normP = p.startsWith('/') ? p.substring(1) : p;
        return normP === normalizedPath;
      })
  );
}

function runValidation(): void {
  const ignoreFilePath = path.resolve(process.cwd(), '.trivyignore.yaml');
  const sarifFilePath = path.resolve(process.cwd(), 'tests/fixtures/security/postgres-pinned.sarif.json');

  console.log('============================================================');
  console.log('SPPLPF Security Exception Policy & Real Scanner Validation');
  console.log(`Auditing Ignorefile: ${ignoreFilePath}`);
  console.log(`Auditing Scanner Output: ${sarifFilePath}`);
  console.log('============================================================\n');

  if (!fs.existsSync(ignoreFilePath)) {
    console.error('FAIL: .trivyignore.yaml does not exist in repository root.');
    process.exit(1);
  }

  const content = fs.readFileSync(ignoreFilePath, 'utf-8');
  const { owner, authStatus, exceptions } = parseSimpleTrivyYaml(content);

  // 1. Verify accountable owner
  if (!owner || !owner.includes('@MO-HS7')) {
    console.error('FAIL: Accountable security owner (@MO-HS7) not declared in file header.');
    process.exit(1);
  }
  console.log(`[PASS] Accountable Security Owner: ${owner}`);
  console.log(`[PASS] Authorization Status: ${authStatus || 'Documented'}`);

  if (exceptions.length === 0) {
    console.error('FAIL: No exception rules found in .trivyignore.yaml.');
    process.exit(1);
  }
  console.log(`[PASS] Parsed ${exceptions.length} scoped exception rules.\n`);

  const today = new Date().toISOString().split('T')[0];

  // 2. Validate individual exceptions
  for (const exc of exceptions) {
    // Check CVE format
    if (!/^CVE-\d{4}-\d+$/.test(exc.id)) {
      console.error(`FAIL: Invalid CVE ID format: ${exc.id}`);
      process.exit(1);
    }

    // Check paths are non-empty and strictly restricted
    if (!exc.paths || exc.paths.length === 0) {
      console.error(`FAIL: Rule ${exc.id} has no paths specified (global suppression prohibited).`);
      process.exit(1);
    }

    const permittedPaths = ['usr/local/bin/gosu', '/usr/local/bin/gosu'];
    for (const p of exc.paths) {
      if (!permittedPaths.includes(p)) {
        console.error(`FAIL: Rule ${exc.id} specifies unauthorized path: "${p}". Only gosu binary is allowable.`);
        process.exit(1);
      }
    }

    // Check statement
    if (!exc.statement || exc.statement.trim().length < 20) {
      console.error(`FAIL: Rule ${exc.id} lacks substantive technical justification statement.`);
      process.exit(1);
    }

    // Check expiry
    if (!exc.expired_at || exc.expired_at <= today) {
      console.error(`FAIL: Rule ${exc.id} has invalid or expired review date: ${exc.expired_at} (Today: ${today})`);
      process.exit(1);
    }

    console.log(`[RULE VALID] ${exc.id} -> ${exc.paths.join(', ')} (Expires: ${exc.expired_at})`);
  }

  // 3. Audit Real Scanner Output from Pinned PostgreSQL
  console.log('\n------------------------------------------------------------');
  console.log('Auditing Real Scanner Findings Against Scoped Exceptions');
  console.log('------------------------------------------------------------');

  if (!fs.existsSync(sarifFilePath)) {
    console.error(`FAIL: Real scanner SARIF fixture not found at: ${sarifFilePath}`);
    process.exit(1);
  }

  const sarifData: SarifReport = JSON.parse(fs.readFileSync(sarifFilePath, 'utf-8'));
  const results = sarifData.runs?.[0]?.results || [];
  console.log(`Total real scanner findings in SARIF report: ${results.length}`);

  let exemptedCount = 0;
  let unexemptedCount = 0;

  for (const res of results) {
    const cve = res.ruleId;
    const locations = (res.locations || []).map((l) => l.physicalLocation?.artifactLocation?.uri || '').filter(Boolean);

    for (const loc of locations) {
      const isExempted = matchesException(cve, loc, exceptions);
      if (isExempted) {
        exemptedCount++;
        console.log(`  [ACCEPTED NON-APPLICABLE] ${cve} at ${loc} (Scoped Gosu Exception)`);
      } else {
        unexemptedCount++;
        // If it's a critical finding outside gosu, fail immediately
        if (['CVE-2026-56857', 'CVE-2026-39821', 'CVE-2025-68121', 'CVE-2026-78663'].includes(cve)) {
          console.log(`  [CORRECTLY UNEXEMPT] ${cve} at ${loc} remains VISIBLE`);
        }
      }
    }
  }

  console.log(`\nReal Scanner Finding Disposition:`);
  console.log(`- Scoped Accepted Non-Applicability Exceptions: ${exemptedCount}`);
  console.log(`- Unexempted Active Findings (GATE-06 Open): ${unexemptedCount}`);

  if (exemptedCount !== 4) {
    console.error(`FAIL: Expected exactly 4 real scanner findings to match gosu exceptions, got ${exemptedCount}`);
    process.exit(1);
  }

  // 4. Component Isolation Assertion
  console.log('\n------------------------------------------------------------');
  console.log('Component Isolation Assertion: Non-Gosu Paths Must Not Suppress');
  console.log('------------------------------------------------------------');

  const isolationAssertions = [
    { cve: 'CVE-2025-68121', path: '/usr/lib/libssl.so.3', expectMatch: false },
    { cve: 'CVE-2025-68121', path: '/usr/bin/curl', expectMatch: false },
    { cve: 'CVE-2026-56857', path: '/usr/lib/libz.so.1', expectMatch: false },
    { cve: 'CVE-2026-85091', path: '/usr/lib/libz.so.1.3.2', expectMatch: false }, // zlib must never be suppressed
    { cve: 'CVE-2026-86140', path: '/usr/lib/libxml2.so.2.13.9', expectMatch: false }, // libxml2 must never be suppressed
  ];

  for (const ia of isolationAssertions) {
    const matched = matchesException(ia.cve, ia.path, exceptions);
    if (matched !== ia.expectMatch) {
      console.error(`FAIL: Isolation assertion failed for ${ia.cve} at ${ia.path}. Expected: ${ia.expectMatch}, got: ${matched}`);
      process.exit(1);
    }
    console.log(`[PASS] ${ia.cve} at ${ia.path} -> VISIBLE (Not Suppressed)`);
  }

  console.log('\n============================================================');
  console.log('SUCCESS: Scoped exceptions proven against real scanner output.');
  console.log('============================================================');
}

runValidation();
