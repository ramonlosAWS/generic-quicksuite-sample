// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

'use strict';

const { parseEnvList } = require('./validator');

/**
 * CORS Helper Module
 *
 * Provides utilities for building API Gateway responses with:
 * - Security headers on every response (Content-Type, X-Content-Type-Options, HSTS)
 * - CORS headers only when the request origin is in the configured allowlist
 * - A convenience function to create full API Gateway response objects
 */

/**
 * Parse the ALLOWED_ORIGINS environment variable into an array.
 * @returns {string[]} Array of allowed origin URLs
 */
function getAllowedOrigins() {
  return parseEnvList(process.env.ALLOWED_ORIGINS);
}

/**
 * Build the base security headers that MUST be included on every response.
 * @returns {object} Headers object with Content-Type, X-Content-Type-Options, and HSTS
 */
function buildSecurityHeaders() {
  return {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'Strict-Transport-Security': 'max-age=31536000'
  };
}

/**
 * Build response headers including security headers and, when the origin is
 * in the allowlist, CORS headers.
 *
 * - Security headers are ALWAYS included.
 * - Access-Control-Allow-Origin is ONLY included when the origin matches an
 *   entry in the ALLOWED_ORIGINS environment variable.
 *
 * @param {string|undefined} origin - The request Origin header value
 * @returns {object} Combined headers object
 */
function buildResponseHeaders(origin) {
  const headers = buildSecurityHeaders();

  if (!origin || typeof origin !== 'string') {
    return headers;
  }

  const allowedOrigins = getAllowedOrigins();
  if (allowedOrigins.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Methods'] = 'POST, OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'Content-Type';
  }

  return headers;
}

/**
 * Create a full API Gateway response object with status code, headers, and body.
 *
 * @param {number} statusCode - HTTP status code
 * @param {object} body - Response body (will be JSON-stringified)
 * @param {string|undefined} origin - The request Origin header value
 * @returns {object} API Gateway response object { statusCode, headers, body }
 */
function createResponse(statusCode, body, origin) {
  return {
    statusCode,
    headers: buildResponseHeaders(origin),
    body: JSON.stringify(body)
  };
}

module.exports = {
  getAllowedOrigins,
  buildSecurityHeaders,
  buildResponseHeaders,
  createResponse
};
