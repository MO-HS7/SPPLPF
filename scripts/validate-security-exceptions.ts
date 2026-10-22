/**
 * SPPLPF Security Policy Gate Validation
 *
 * Validates that `.trivyignore.yaml` strictly conforms to the repository's
 * scoped security exception policy:
 * 1. No global or wildcard ignore rules.
 * 2. All exceptions must be explicitly scoped by exact inspected file paths.
 * 3. Every rule must have a non-empty technical rationale statement.
 * 4. Every rule must have an unexpired ISO date.
 * 5. Rules must only exempt verified dead-code / non-applicable matches in /usr/local/bin/gosu.
 * 6. Simulates finding matching to guarantee that identical CVEs in other packages remain UNEXEMPT.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

interface TrivyException {
  id: string;
  paths: string[];
  statement: string;
  expired_at: string;
}

function parseSimpleTrivyYaml(content: string): { owner: string | null; exceptions: TrivyException[] } {
  const lines = content.split(/\r?\n/);
  let owner: string | null = null;
  const exceptions: TrivyException[] = [];

  let current: Partial<TrivyException> | null = null;
  let inPaths = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (line.includes('Authorized Security Owner:')) {
      owner = line.split('Authorized Security Owner:')[1].trim();
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

  return { owner, exceptions };
}

function runValidation(): void {
  const ignoreFilePath = path.resolve(process.cwd(), '.trivyignore.yaml');

  console.log('------------------------------------------------------------');
  console.log('SPPLPF Security Exception Policy Validation');
  console.log(`Auditing: ${ignoreFilePath}`);
  console.log('------------------------------------------------------------');

  if (!fs.existsSync(ignoreFilePath)) {
    console.error('FAIL: .trivyignore.yaml does not exist in repository root.');
    process.exit(1);
  }

  const content = fs.readFileSync(ignoreFilePath, 'utf-8');
  const { owner, exceptions } = parseSimpleTrivyYaml(content);

  // 1. Verify accountable owner
  if (!owner || !owner.includes('MO-HS7')) {
    console.error('FAIL: Authorized accountable security owner (MO-HS7) not declared in file header.');
    process.exit(1);
  }
  console.log(`[PASS] Authorized Security Owner: ${owner}`);

  if (exceptions.length === 0) {
    console.error('FAIL: No exception rules found in .trivyignore.yaml.');
    process.exit(1);
  }
  console.log(`[PASS] Parsed ${exceptions.length} scoped exception rules.`);

  const today = new Date().toISOString().split('T')[0];

  // 2. Validate individual exceptions
  for (const exc of exceptions) {
    console.log(`\nValidating rule: ${exc.id}`);

    // Check CVE format
    if (!/^CVE-\d{4}-\d+$/.test(exc.id)) {
      console.error(`FAIL: Invalid CVE ID format: ${exc.id}`);
      process.exit(1);
    }

    // Check paths are non-empty and restricted
    if (!exc.paths || exc.paths.length === 0) {
      console.error(`FAIL: Rule ${exc.id} has no paths specified (global suppression prohibited).`);
      process.exit(1);
    }

    const permittedPaths = ['usr/local/bin/gosu', '/usr/local/bin/gosu'];
    for (const p of exc.paths) {
      if (!permittedPaths.includes(p)) {
        console.error(`FAIL: Rule ${exc.id} specifies non-permitted path: "${p}". Only gosu binary is allowable.`);
        process.exit(1);
      }
    }
    console.log(`  [PASS] Path scope strictly constrained to: ${exc.paths.join(', ')}`);

    // Check statement
    if (!exc.statement || exc.statement.trim().length < 20) {
      console.error(`FAIL: Rule ${exc.id} lacks substantive technical justification statement.`);
      process.exit(1);
    }
    console.log(`  [PASS] Technical Rationale: "${exc.statement.substring(0, 60)}..."`);

    // Check expiry
    if (!exc.expired_at || exc.expired_at <= today) {
      console.error(`FAIL: Rule ${exc.id} has invalid or expired review date: ${exc.expired_at} (Today: ${today})`);
      process.exit(1);
    }
    console.log(`  [PASS] Review Expiry Date: ${exc.expired_at} (Active)`);
  }

  // 3. Component Selectivity & Non-Suppression Simulation
  console.log('\n------------------------------------------------------------');
  console.log('Component Isolation Simulation Test');
  console.log('------------------------------------------------------------');

  const testCases = [
    { cve: 'CVE-2025-68121', path: '/usr/local/bin/gosu', shouldMatch: true },
    { cve: 'CVE-2025-68121', path: '/usr/lib/libssl.so.3', shouldMatch: false },
    { cve: 'CVE-2025-68121', path: '/usr/bin/curl', shouldMatch: false },
    { cve: 'CVE-2026-56857', path: '/usr/local/bin/gosu', shouldMatch: true },
    { cve: 'CVE-2026-56857', path: '/usr/lib/libz.so.1', shouldMatch: false },
    { cve: 'CVE-2026-85091', path: '/usr/lib/libz.so.1.3.2', shouldMatch: false }, // zlib must never be suppressed
  ];

  for (const tc of testCases) {
    const matched = exceptions.some(
      (e) => e.id === tc.cve && e.paths.some((p) => p === tc.path || `/${p}` === tc.path || p === tc.path.replace(/^\//, ''))
    );

    if (matched !== tc.shouldMatch) {
      console.error(`FAIL: Selectivity test failed for ${tc.cve} at ${tc.path}. Expected match: ${tc.shouldMatch}, Got: ${matched}`);
      process.exit(1);
    }
    console.log(`[PASS] ${tc.cve} at ${tc.path} => ${matched ? 'EXEMPTED (Targeted Gosu)' : 'VISIBLE / UNEXEMPT'}`);
  }

  console.log('\n------------------------------------------------------------');
  console.log('SUCCESS: All scoped exceptions validated against repository security policy.');
  console.log('------------------------------------------------------------');
}

runValidation();
