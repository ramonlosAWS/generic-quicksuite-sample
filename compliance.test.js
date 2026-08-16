// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

'use strict';

/**
 * Static compliance tests for the repository.
 *
 * Feature: generic-quicksuite-widget
 * Property 1: SPDX License Headers on All Source Files
 * Property 2: Zero Trademark References
 *
 * Validates: Requirements 1.3, 1.6, 1.7
 *
 * These are example-based static scans (not fast-check property runs): they
 * walk the repository's own source/doc files and assert repo-wide invariants.
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

// Directories and generated/vendored files that are not authored source.
const EXCLUDED_DIRS = new Set(['node_modules', '.git', '.aws-sam', 'coverage']);
const EXCLUDED_FILES = new Set([
  'package-lock.json',
  'quicksight-embedding-sdk.min.js', // vendored SDK (has its own license banner)
  'quicksuite-widget-bundled.js', // generated bundle (inlines vendored SDK)
  'compliance.test.js', // this file necessarily contains the terms it scans for
]);

/** Recursively collect files under `dir` whose extension is in `exts`. */
function collectFiles(dir, exts, acc) {
  acc = acc || [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!EXCLUDED_DIRS.has(entry.name)) {
        collectFiles(path.join(dir, entry.name), exts, acc);
      }
      continue;
    }
    if (EXCLUDED_FILES.has(entry.name)) continue;
    const ext = path.extname(entry.name).toLowerCase();
    if (exts.includes(ext)) {
      acc.push(path.join(dir, entry.name));
    }
  }
  return acc;
}

describe('Feature: generic-quicksuite-widget, Property 1: SPDX License Headers on All Source Files', () => {
  /**
   * **Validates: Requirements 1.3**
   *
   * Every JavaScript, YAML, and shell source file must contain the SPDX
   * license header near the top (after an optional shebang).
   */
  const sourceFiles = collectFiles(ROOT, ['.js', '.yaml', '.yml', '.sh']);

  it('finds source files to check', () => {
    expect(sourceFiles.length).toBeGreaterThan(0);
  });

  it.each(sourceFiles.map((f) => [path.relative(ROOT, f), f]))(
    'has SPDX header: %s',
    (_rel, file) => {
      const head = fs.readFileSync(file, 'utf8').split('\n').slice(0, 6).join('\n');
      expect(head).toContain('Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.');
      expect(head).toContain('SPDX-License-Identifier: Apache-2.0');
    }
  );
});

describe('Feature: generic-quicksuite-widget, Property 2: Zero Trademark References', () => {
  /**
   * **Validates: Requirements 1.6, 1.7**
   *
   * A case-insensitive search across authored source, docs, and config must
   * return zero matches for NFL / sports-league / team trademark terms.
   */
  const scannedFiles = collectFiles(ROOT, [
    '.js', '.yaml', '.yml', '.sh', '.json', '.md', '.html', '.csv',
  ]);

  // Word-boundary patterns so substrings like "inflight" don't false-match "nfl".
  const forbidden = [
    /\bnfl\b/i,
    /\bpatriots\b/i,
    /\bchiefs\b/i,
    /\bquarterback\b/i,
    /\btouchdown\b/i,
    /\bsuper\s?bowl\b/i,
    /\bnextgen\b/i,
    /\bnextgenstats\b/i,
  ];

  it.each(scannedFiles.map((f) => [path.relative(ROOT, f), f]))(
    'contains no trademark references: %s',
    (_rel, file) => {
      const content = fs.readFileSync(file, 'utf8');
      for (const pattern of forbidden) {
        expect(content).not.toMatch(pattern);
      }
    }
  );
});
