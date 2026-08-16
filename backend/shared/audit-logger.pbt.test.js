// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

'use strict';

const fc = require('fast-check');
const { logRequest, setDocClient } = require('./audit-logger');

/**
 * Property-Based Tests for Audit Log Completeness
 *
 * Feature: generic-quicksuite-widget, Property 17: Audit Log Completeness
 * **Validates: Requirements 10.2**
 *
 * For any Audit_Log entry written by the Backend, it shall contain:
 * ISO-8601 timestamp, request origin domain, dashboard ID, session identifier,
 * and response status.
 */

// --- Test Helpers ---

/** Captures items sent to DynamoDB */
let capturedItems = [];

/** Mock DynamoDB Document Client that captures PutCommand items */
const mockDocClient = {
  send: jest.fn(async (command) => {
    if (command.input && command.input.Item) {
      capturedItems.push(command.input.Item);
    }
    return {};
  })
};

/** Arbitrary valid URL origin generator */
const arbOrigin = fc.oneof(
  fc.tuple(
    fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789'), { minLength: 3, maxLength: 20 }),
    fc.constantFrom('.com', '.org', '.net', '.io', '.dev', '.gov')
  ).map(([host, tld]) => `https://${host}${tld}`),
  fc.tuple(
    fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz'), { minLength: 3, maxLength: 12 }),
    fc.constantFrom('.com', '.org', '.net'),
    fc.integer({ min: 3000, max: 9999 })
  ).map(([host, tld, port]) => `https://${host}${tld}:${port}`)
);

/** Arbitrary UUID generator for dashboard IDs */
const arbDashboardId = fc.uuid();

/** Arbitrary session ID generator */
const arbSessionId = fc.stringOf(
  fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789-_'),
  { minLength: 8, maxLength: 64 }
);

/** Arbitrary status values */
const arbStatus = fc.oneof(
  fc.constant('success'),
  fc.constant('error_403'),
  fc.constant('error_500'),
  fc.constant('error_timeout'),
  fc.constant('error_validation'),
  fc.constantFrom('success', 'error', 'forbidden', 'not_found', 'rate_limited')
);

/** Arbitrary embed type */
const arbEmbedType = fc.constantFrom('dashboard', 'chat');

/** Arbitrary device type */
const arbDeviceType = fc.constantFrom('desktop', 'mobile');

/** Arbitrary request ID */
const arbRequestId = fc.stringOf(
  fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789-'),
  { minLength: 8, maxLength: 36 }
).map(s => `req-${s}`);

/** Arbitrary user ARN */
const arbUserArn = fc.tuple(
  fc.constantFrom('us-east-1', 'us-west-2', 'eu-west-1'),
  fc.stringOf(fc.constantFrom(...'0123456789'), { minLength: 12, maxLength: 12 }),
  fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz-'), { minLength: 3, maxLength: 20 })
).map(([region, acct, user]) =>
  `arn:aws:quicksight:${region}:${acct}:user/default/${user}`
);

/** ISO-8601 timestamp validation regex */
const ISO_8601_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z$/;

/**
 * Validates that a timestamp value is a valid ISO-8601 formatted string
 * when converted from epoch milliseconds.
 */
function isValidIso8601Timestamp(epochMs) {
  if (typeof epochMs !== 'number' || !Number.isFinite(epochMs) || epochMs <= 0) {
    return false;
  }
  const isoString = new Date(epochMs).toISOString();
  return ISO_8601_REGEX.test(isoString);
}

// --- Setup and Teardown ---

beforeEach(() => {
  capturedItems = [];
  mockDocClient.send.mockClear();
  setDocClient(mockDocClient);
  process.env.AUDIT_TABLE_NAME = 'test-audit-table';
});

afterEach(() => {
  setDocClient(null);
  delete process.env.AUDIT_TABLE_NAME;
});

// --- Property 17: Audit Log Completeness ---

describe('Property 17: Audit Log Completeness', () => {
  /**
   * Feature: generic-quicksuite-widget, Property 17: Audit Log Completeness
   * **Validates: Requirements 10.2**
   *
   * For any combination of valid inputs, the audit log entry shall always contain:
   * - ISO-8601 timestamp (stored as epoch ms, convertible to ISO-8601)
   * - origin (request origin domain)
   * - dashboardId (requested dashboard ID)
   * - sessionId (client-generated session identifier)
   * - status (response status: 'success' or error category)
   */

  it('every audit entry contains all required fields for any valid input combination', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbRequestId,
        arbOrigin,
        arbDashboardId,
        arbSessionId,
        arbStatus,
        arbEmbedType,
        arbDeviceType,
        arbUserArn,
        async (requestId, origin, dashboardId, sessionId, status, embedType, deviceType, userArn) => {
          // Reset captured items for this iteration
          capturedItems = [];
          mockDocClient.send.mockClear();

          await logRequest({
            requestId,
            origin,
            dashboardId,
            sessionId,
            status,
            embedType,
            deviceType,
            userArn
          });

          // Exactly one item should be written
          expect(capturedItems).toHaveLength(1);
          const item = capturedItems[0];

          // Verify required fields are present and non-empty
          expect(item).toHaveProperty('timestamp');
          expect(item).toHaveProperty('origin');
          expect(item).toHaveProperty('dashboardId');
          expect(item).toHaveProperty('sessionId');
          expect(item).toHaveProperty('status');

          // Verify timestamp is a valid epoch milliseconds convertible to ISO-8601
          expect(typeof item.timestamp).toBe('number');
          expect(item.timestamp).toBeGreaterThan(0);
          expect(isValidIso8601Timestamp(item.timestamp)).toBe(true);

          // Verify ISO-8601 conversion produces valid string
          const isoString = new Date(item.timestamp).toISOString();
          expect(isoString).toMatch(ISO_8601_REGEX);

          // Verify origin is present and matches input
          expect(typeof item.origin).toBe('string');
          expect(item.origin.length).toBeGreaterThan(0);
          expect(item.origin).toBe(origin);

          // Verify dashboardId is present and matches input
          expect(typeof item.dashboardId).toBe('string');
          expect(item.dashboardId.length).toBeGreaterThan(0);
          expect(item.dashboardId).toBe(dashboardId);

          // Verify sessionId is present and matches input
          expect(typeof item.sessionId).toBe('string');
          expect(item.sessionId.length).toBeGreaterThan(0);
          expect(item.sessionId).toBe(sessionId);

          // Verify status is present and matches input
          expect(typeof item.status).toBe('string');
          expect(item.status.length).toBeGreaterThan(0);
          expect(item.status).toBe(status);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('timestamp is always a recent epoch value convertible to valid ISO-8601', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbRequestId,
        arbOrigin,
        arbDashboardId,
        arbSessionId,
        arbStatus,
        async (requestId, origin, dashboardId, sessionId, status) => {
          capturedItems = [];
          mockDocClient.send.mockClear();
          const beforeMs = Date.now();

          await logRequest({
            requestId,
            origin,
            dashboardId,
            sessionId,
            status,
            embedType: 'dashboard',
            deviceType: 'desktop',
            userArn: 'arn:aws:quicksight:us-east-1:123456789012:user/default/test'
          });

          const afterMs = Date.now();
          expect(capturedItems).toHaveLength(1);
          const item = capturedItems[0];

          // Timestamp should be between before and after call
          expect(item.timestamp).toBeGreaterThanOrEqual(beforeMs);
          expect(item.timestamp).toBeLessThanOrEqual(afterMs);

          // Must be convertible to a valid ISO-8601 string
          const isoDate = new Date(item.timestamp);
          expect(isoDate.toISOString()).toMatch(ISO_8601_REGEX);
          expect(isNaN(isoDate.getTime())).toBe(false);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('audit entry fields use defaults when optional inputs are missing but required fields always present', async () => {
    await fc.assert(
      fc.asyncProperty(
        arbRequestId,
        fc.constantFrom(undefined, null, ''),
        fc.constantFrom(undefined, null, ''),
        fc.constantFrom(undefined, null, ''),
        fc.constantFrom(undefined, null, ''),
        async (requestId, origin, dashboardId, sessionId, status) => {
          capturedItems = [];
          mockDocClient.send.mockClear();

          await logRequest({
            requestId,
            origin,
            dashboardId,
            sessionId,
            status,
            embedType: 'dashboard',
            deviceType: 'desktop',
            userArn: 'arn:aws:quicksight:us-east-1:123456789012:user/default/test'
          });

          expect(capturedItems).toHaveLength(1);
          const item = capturedItems[0];

          // Even with missing/empty inputs, required fields must be present
          expect(item).toHaveProperty('timestamp');
          expect(item).toHaveProperty('origin');
          expect(item).toHaveProperty('dashboardId');
          expect(item).toHaveProperty('sessionId');
          expect(item).toHaveProperty('status');

          // Fields should have fallback values (not be undefined)
          expect(typeof item.origin).toBe('string');
          expect(item.origin.length).toBeGreaterThan(0);
          expect(typeof item.dashboardId).toBe('string');
          expect(item.dashboardId.length).toBeGreaterThan(0);
          expect(typeof item.sessionId).toBe('string');
          expect(item.sessionId.length).toBeGreaterThan(0);
          expect(typeof item.status).toBe('string');
          expect(item.status.length).toBeGreaterThan(0);

          // Timestamp should still be valid ISO-8601
          expect(isValidIso8601Timestamp(item.timestamp)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });
});
