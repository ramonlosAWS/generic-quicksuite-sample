// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

'use strict';

const fc = require('fast-check');
const {
  validateDashboardId,
  validateOrigin,
  validateBodySize,
  MAX_BODY_SIZE_BYTES
} = require('./validator');

/**
 * Property-Based Tests for Allowlist Enforcement
 *
 * Feature: generic-quicksuite-widget
 *
 * Tests Properties 9, 10, and 21 from the design document.
 */

// --- Test Helpers ---

/** Fixed allowlist of dashboard IDs for testing */
const ALLOWED_DASHBOARD_IDS = [
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'b2c3d4e5-f6a7-8901-bcde-f12345678901',
  'c3d4e5f6-a7b8-9012-cdef-123456789012'
];

/** Fixed allowlist of origins for testing */
const ALLOWED_ORIGINS = [
  'https://example.com',
  'https://app.example.org',
  'https://dashboard.internal.net'
];

/** Arbitrary UUID generator that produces valid UUIDs NOT in the allowlist */
const arbNonAllowlistedUuid = fc.uuid().filter(
  uuid => !ALLOWED_DASHBOARD_IDS.includes(uuid.toLowerCase())
);

/** Arbitrary origin string generator that produces origins NOT in the allowlist */
const arbNonAllowlistedOrigin = fc.oneof(
  // Random https origins
  fc.tuple(
    fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789'), { minLength: 3, maxLength: 20 }),
    fc.constantFrom('.com', '.org', '.net', '.io', '.dev')
  ).map(([host, tld]) => `https://${host}${tld}`),
  // Random http origins
  fc.tuple(
    fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz'), { minLength: 3, maxLength: 15 }),
    fc.constantFrom('.com', '.org', '.net')
  ).map(([host, tld]) => `http://${host}${tld}`),
  // Origins with ports
  fc.tuple(
    fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz'), { minLength: 3, maxLength: 10 }),
    fc.integer({ min: 1000, max: 65535 })
  ).map(([host, port]) => `https://${host}.example.test:${port}`)
).filter(origin => !ALLOWED_ORIGINS.includes(origin));

/** Arbitrary body generator that exceeds 10 KB */
const arbOversizedBody = fc.integer({ min: MAX_BODY_SIZE_BYTES + 1, max: MAX_BODY_SIZE_BYTES * 3 }).map(
  size => 'x'.repeat(size)
);

// --- Setup and Teardown ---

beforeEach(() => {
  process.env.ALLOWED_DASHBOARD_IDS = ALLOWED_DASHBOARD_IDS.join(',');
  process.env.ALLOWED_ORIGINS = ALLOWED_ORIGINS.join(',');
});

afterEach(() => {
  delete process.env.ALLOWED_DASHBOARD_IDS;
  delete process.env.ALLOWED_ORIGINS;
});

// --- Property 9: Dashboard ID Allowlist Enforcement ---

describe('Property 9: Dashboard ID Allowlist Enforcement', () => {
  /**
   * Feature: generic-quicksuite-widget, Property 9: Dashboard ID Allowlist Enforcement
   * **Validates: Requirements 5.4, 15.1, 15.7**
   *
   * For any API request containing a dashboard ID not present in the configured
   * allowlist, the Backend shall return HTTP 403 without calling the QuickSight API.
   * The error response shall not reveal which dashboard IDs are valid.
   */

  it('rejects any UUID not in the allowlist with 403', () => {
    fc.assert(
      fc.property(arbNonAllowlistedUuid, (dashboardId) => {
        const result = validateDashboardId(dashboardId);

        // Must return 403
        expect(result.valid).toBe(false);
        expect(result.statusCode).toBe(403);
      }),
      { numRuns: 100 }
    );
  });

  it('error response does not reveal any valid dashboard IDs', () => {
    fc.assert(
      fc.property(arbNonAllowlistedUuid, (dashboardId) => {
        const result = validateDashboardId(dashboardId);

        // Response body must not contain any valid IDs
        const responseStr = JSON.stringify(result.body);
        for (const validId of ALLOWED_DASHBOARD_IDS) {
          expect(responseStr).not.toContain(validId);
        }

        // Response must use a generic message
        expect(result.body.message).toBe('Forbidden');
      }),
      { numRuns: 100 }
    );
  });

  it('rejects non-UUID format strings with 403', () => {
    const arbInvalidFormat = fc.oneof(
      fc.string({ minLength: 1, maxLength: 100 }),
      fc.stringOf(fc.constantFrom(...'0123456789abcdef'), { minLength: 1, maxLength: 35 }),
      fc.constant('not-a-uuid'),
      fc.constant(''),
      fc.constant('12345678-1234-1234-1234-12345678901') // too short
    ).filter(s => !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s));

    fc.assert(
      fc.property(arbInvalidFormat, (invalidId) => {
        const result = validateDashboardId(invalidId);

        expect(result.valid).toBe(false);
        expect(result.statusCode).toBe(403);
        expect(result.body.message).toBe('Forbidden');
      }),
      { numRuns: 100 }
    );
  });

  it('accepts dashboard IDs that ARE in the allowlist', () => {
    // Sanity check: allowlisted IDs should pass
    for (const validId of ALLOWED_DASHBOARD_IDS) {
      const result = validateDashboardId(validId);
      expect(result.valid).toBe(true);
    }
  });
});

// --- Property 10: Origin Allowlist Enforcement ---

describe('Property 10: Origin Allowlist Enforcement', () => {
  /**
   * Feature: generic-quicksuite-widget, Property 10: Origin Allowlist Enforcement
   * **Validates: Requirements 5.5, 15.8**
   *
   * For any API request with an Origin header not matching any entry in the
   * configured allowed origins list, the Backend shall return HTTP 403 and
   * omit CORS allow-origin headers from the response.
   */

  it('rejects any origin not in the allowlist with 403', () => {
    fc.assert(
      fc.property(arbNonAllowlistedOrigin, (origin) => {
        const result = validateOrigin(origin);

        expect(result.valid).toBe(false);
        expect(result.statusCode).toBe(403);
      }),
      { numRuns: 100 }
    );
  });

  it('rejected origins produce no CORS headers in response', () => {
    fc.assert(
      fc.property(arbNonAllowlistedOrigin, (origin) => {
        const result = validateOrigin(origin);

        // The validator returns valid: false — the caller must NOT add CORS headers.
        // Verify the result does not contain any CORS-related fields.
        expect(result.valid).toBe(false);
        expect(result).not.toHaveProperty('headers');
        expect(result.body.message).toBe('Forbidden');

        // Ensure the response doesn't leak the origin back
        const responseStr = JSON.stringify(result);
        expect(responseStr).not.toContain('Access-Control-Allow-Origin');
      }),
      { numRuns: 100 }
    );
  });

  it('rejects null, undefined, and empty origins with 403', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(null, undefined, ''),
        (origin) => {
          const result = validateOrigin(origin);

          expect(result.valid).toBe(false);
          expect(result.statusCode).toBe(403);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('accepts origins that ARE in the allowlist', () => {
    // Sanity check: allowlisted origins should pass
    for (const validOrigin of ALLOWED_ORIGINS) {
      const result = validateOrigin(validOrigin);
      expect(result.valid).toBe(true);
    }
  });
});

// --- Property 21: Request Body Size Limit ---

describe('Property 21: Request Body Size Limit', () => {
  /**
   * Feature: generic-quicksuite-widget, Property 21: Request Body Size Limit
   * **Validates: Requirements 15.9**
   *
   * For any API request with a body exceeding 10 KB, the Backend shall reject
   * it with HTTP 413 without processing the embed URL generation.
   */

  it('rejects any body exceeding 10 KB with 413', () => {
    fc.assert(
      fc.property(arbOversizedBody, (body) => {
        const result = validateBodySize(body);

        expect(result.valid).toBe(false);
        expect(result.statusCode).toBe(413);
        expect(result.body.message).toBe('Payload Too Large');
      }),
      { numRuns: 100 }
    );
  });

  it('rejects oversized Buffer bodies with 413', () => {
    const arbOversizedBuffer = fc.integer({ min: MAX_BODY_SIZE_BYTES + 1, max: MAX_BODY_SIZE_BYTES + 5000 }).map(
      size => Buffer.alloc(size, 'a')
    );

    fc.assert(
      fc.property(arbOversizedBuffer, (body) => {
        const result = validateBodySize(body);

        expect(result.valid).toBe(false);
        expect(result.statusCode).toBe(413);
        expect(result.body.message).toBe('Payload Too Large');
      }),
      { numRuns: 100 }
    );
  });

  it('rejects oversized object bodies with 413', () => {
    // Generate objects whose JSON serialization exceeds 10 KB
    const arbOversizedObject = fc.integer({ min: 500, max: 2000 }).map(count => {
      const obj = {};
      for (let i = 0; i < count; i++) {
        obj[`key_${i}_padding`] = `value_${i}_${'x'.repeat(10)}`;
      }
      return obj;
    }).filter(obj => Buffer.byteLength(JSON.stringify(obj), 'utf8') > MAX_BODY_SIZE_BYTES);

    fc.assert(
      fc.property(arbOversizedObject, (body) => {
        const result = validateBodySize(body);

        expect(result.valid).toBe(false);
        expect(result.statusCode).toBe(413);
        expect(result.body.message).toBe('Payload Too Large');
      }),
      { numRuns: 100 }
    );
  });

  it('accepts bodies at or below 10 KB', () => {
    const arbValidBody = fc.integer({ min: 0, max: MAX_BODY_SIZE_BYTES }).map(
      size => 'x'.repeat(size)
    );

    fc.assert(
      fc.property(arbValidBody, (body) => {
        const result = validateBodySize(body);
        expect(result.valid).toBe(true);
      }),
      { numRuns: 100 }
    );
  });
});
