// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

'use strict';

/**
 * Input Validator Module
 *
 * Provides validation utilities for the QuickSuite Widget backend:
 * - Dashboard ID UUID format and allowlist validation
 * - Origin allowlist enforcement
 * - Request body size limit (10 KB)
 * - Input sanitization (URL-safe characters, max 2048 chars)
 */

/** Standard UUID v4 pattern: 8-4-4-4-12 hex characters */
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Maximum request body size in bytes (10 KB) */
const MAX_BODY_SIZE_BYTES = 10 * 1024;

/** Maximum input length after sanitization */
const MAX_INPUT_LENGTH = 2048;

/** Allowed characters: alphanumeric, hyphen, underscore, period, tilde, and URL-safe set */
const SAFE_CHARS_PATTERN = /[^a-zA-Z0-9\-_.~!*'():@&=+$,/?#[\]%]/g;

/**
 * Parse a comma-separated environment variable into a trimmed, non-empty array.
 * @param {string|undefined} envValue - Raw environment variable value
 * @returns {string[]} Array of trimmed, non-empty values
 */
function parseEnvList(envValue) {
  if (!envValue) return [];
  return envValue
    .split(',')
    .map(item => item.trim())
    .filter(item => item.length > 0);
}

/**
 * Validate that a string is a valid UUID format.
 * @param {string} value - Value to check
 * @returns {boolean} True if valid UUID format
 */
function isValidUuid(value) {
  if (!value || typeof value !== 'string') return false;
  return UUID_PATTERN.test(value);
}

/**
 * Validate a dashboard ID against UUID format and the configured allowlist.
 *
 * Reads the allowlist from the ALLOWED_DASHBOARD_IDS environment variable
 * (comma-separated UUIDs).
 *
 * @param {string} dashboardId - Dashboard ID to validate
 * @returns {{ valid: boolean, statusCode?: number, body?: object }}
 *   On success: { valid: true }
 *   On failure: { valid: false, statusCode: 403, body: { message: 'Forbidden' } }
 */
function validateDashboardId(dashboardId) {
  // Check UUID format first
  if (!isValidUuid(dashboardId)) {
    return {
      valid: false,
      statusCode: 403,
      body: { message: 'Forbidden' }
    };
  }

  // Check against allowlist
  const allowedIds = parseEnvList(process.env.ALLOWED_DASHBOARD_IDS);
  if (!allowedIds.includes(dashboardId)) {
    return {
      valid: false,
      statusCode: 403,
      body: { message: 'Forbidden' }
    };
  }

  return { valid: true };
}

/**
 * Validate the request origin against the configured allowlist.
 *
 * Reads the allowlist from the ALLOWED_ORIGINS environment variable
 * (comma-separated URLs).
 *
 * @param {string|undefined} origin - Origin header value
 * @returns {{ valid: boolean, statusCode?: number, body?: object }}
 *   On success: { valid: true }
 *   On failure: { valid: false, statusCode: 403, body: { message: 'Forbidden' } }
 */
function validateOrigin(origin) {
  if (!origin || typeof origin !== 'string') {
    return {
      valid: false,
      statusCode: 403,
      body: { message: 'Forbidden' }
    };
  }

  const allowedOrigins = parseEnvList(process.env.ALLOWED_ORIGINS);

  const isAllowed = allowedOrigins.some(allowed => allowed === origin);

  if (!isAllowed) {
    return {
      valid: false,
      statusCode: 403,
      body: { message: 'Forbidden' }
    };
  }

  return { valid: true };
}

/**
 * Enforce the maximum request body size (10 KB).
 *
 * @param {string|Buffer|object} body - Request body (string, Buffer, or parsed object)
 * @returns {{ valid: boolean, statusCode?: number, body?: object }}
 *   On success: { valid: true }
 *   On failure: { valid: false, statusCode: 413, body: { message: 'Payload Too Large' } }
 */
function validateBodySize(body) {
  let sizeInBytes = 0;

  if (Buffer.isBuffer(body)) {
    sizeInBytes = body.length;
  } else if (typeof body === 'string') {
    sizeInBytes = Buffer.byteLength(body, 'utf8');
  } else if (typeof body === 'object' && body !== null) {
    sizeInBytes = Buffer.byteLength(JSON.stringify(body), 'utf8');
  }

  if (sizeInBytes > MAX_BODY_SIZE_BYTES) {
    return {
      valid: false,
      statusCode: 413,
      body: { message: 'Payload Too Large' }
    };
  }

  return { valid: true };
}

/**
 * Sanitize an input string by removing characters outside the allowed set
 * and enforcing the maximum length of 2048 characters.
 *
 * Allowed characters: alphanumeric (a-z, A-Z, 0-9), hyphen (-), underscore (_),
 * period (.), tilde (~), and URL-safe characters (!*'():@&=+$,/?#[]%).
 *
 * @param {string} input - Raw input string
 * @returns {string} Sanitized string (max 2048 chars)
 */
function sanitizeInput(input) {
  if (!input || typeof input !== 'string') return '';

  // Strip disallowed characters
  const cleaned = input.replace(SAFE_CHARS_PATTERN, '');

  // Enforce max length
  return cleaned.slice(0, MAX_INPUT_LENGTH);
}

module.exports = {
  isValidUuid,
  validateDashboardId,
  validateOrigin,
  validateBodySize,
  sanitizeInput,
  parseEnvList,
  MAX_BODY_SIZE_BYTES,
  MAX_INPUT_LENGTH,
  UUID_PATTERN
};
