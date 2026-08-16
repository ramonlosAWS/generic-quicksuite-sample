// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

'use strict';

const {
  getAllowedOrigins,
  buildSecurityHeaders,
  buildResponseHeaders,
  createResponse
} = require('./cors-helper');

describe('cors-helper module', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('getAllowedOrigins', () => {
    it('returns empty array when ALLOWED_ORIGINS is not set', () => {
      delete process.env.ALLOWED_ORIGINS;
      expect(getAllowedOrigins()).toEqual([]);
    });

    it('returns empty array for empty string', () => {
      process.env.ALLOWED_ORIGINS = '';
      expect(getAllowedOrigins()).toEqual([]);
    });

    it('parses comma-separated origins', () => {
      process.env.ALLOWED_ORIGINS = 'https://example.com,https://app.example.org';
      expect(getAllowedOrigins()).toEqual(['https://example.com', 'https://app.example.org']);
    });

    it('trims whitespace from entries', () => {
      process.env.ALLOWED_ORIGINS = ' https://example.com , https://app.example.org ';
      expect(getAllowedOrigins()).toEqual(['https://example.com', 'https://app.example.org']);
    });

    it('filters out empty entries', () => {
      process.env.ALLOWED_ORIGINS = 'https://example.com,,https://app.example.org';
      expect(getAllowedOrigins()).toEqual(['https://example.com', 'https://app.example.org']);
    });
  });

  describe('buildSecurityHeaders', () => {
    it('includes Content-Type: application/json', () => {
      const headers = buildSecurityHeaders();
      expect(headers['Content-Type']).toBe('application/json');
    });

    it('includes X-Content-Type-Options: nosniff', () => {
      const headers = buildSecurityHeaders();
      expect(headers['X-Content-Type-Options']).toBe('nosniff');
    });

    it('includes Strict-Transport-Security with max-age=31536000', () => {
      const headers = buildSecurityHeaders();
      expect(headers['Strict-Transport-Security']).toBe('max-age=31536000');
    });

    it('returns exactly three headers', () => {
      const headers = buildSecurityHeaders();
      expect(Object.keys(headers)).toHaveLength(3);
    });
  });

  describe('buildResponseHeaders', () => {
    beforeEach(() => {
      process.env.ALLOWED_ORIGINS = 'https://example.com,https://app.example.org';
    });

    it('always includes security headers regardless of origin', () => {
      const headers = buildResponseHeaders(undefined);
      expect(headers['Content-Type']).toBe('application/json');
      expect(headers['X-Content-Type-Options']).toBe('nosniff');
      expect(headers['Strict-Transport-Security']).toBe('max-age=31536000');
    });

    it('includes CORS headers when origin is in allowlist', () => {
      const headers = buildResponseHeaders('https://example.com');
      expect(headers['Access-Control-Allow-Origin']).toBe('https://example.com');
      expect(headers['Access-Control-Allow-Methods']).toBe('POST, OPTIONS');
      expect(headers['Access-Control-Allow-Headers']).toBe('Content-Type');
    });

    it('omits Access-Control-Allow-Origin when origin is not in allowlist', () => {
      const headers = buildResponseHeaders('https://evil.com');
      expect(headers['Access-Control-Allow-Origin']).toBeUndefined();
      expect(headers['Access-Control-Allow-Methods']).toBeUndefined();
      expect(headers['Access-Control-Allow-Headers']).toBeUndefined();
    });

    it('omits CORS headers when origin is undefined', () => {
      const headers = buildResponseHeaders(undefined);
      expect(headers['Access-Control-Allow-Origin']).toBeUndefined();
    });

    it('omits CORS headers when origin is null', () => {
      const headers = buildResponseHeaders(null);
      expect(headers['Access-Control-Allow-Origin']).toBeUndefined();
    });

    it('omits CORS headers when origin is empty string', () => {
      const headers = buildResponseHeaders('');
      expect(headers['Access-Control-Allow-Origin']).toBeUndefined();
    });

    it('omits CORS headers when ALLOWED_ORIGINS is not set', () => {
      delete process.env.ALLOWED_ORIGINS;
      const headers = buildResponseHeaders('https://example.com');
      expect(headers['Access-Control-Allow-Origin']).toBeUndefined();
    });

    it('performs exact origin matching (no partial match)', () => {
      const headers = buildResponseHeaders('https://example.com.evil.com');
      expect(headers['Access-Control-Allow-Origin']).toBeUndefined();
    });

    it('still includes security headers even for disallowed origins', () => {
      const headers = buildResponseHeaders('https://evil.com');
      expect(headers['Content-Type']).toBe('application/json');
      expect(headers['X-Content-Type-Options']).toBe('nosniff');
      expect(headers['Strict-Transport-Security']).toBe('max-age=31536000');
    });
  });

  describe('createResponse', () => {
    beforeEach(() => {
      process.env.ALLOWED_ORIGINS = 'https://example.com';
    });

    it('returns correct statusCode', () => {
      const response = createResponse(200, { status: 'success' }, 'https://example.com');
      expect(response.statusCode).toBe(200);
    });

    it('returns JSON-stringified body', () => {
      const body = { embedUrl: 'https://quicksight.aws.amazon.com/embed/123', status: 'success' };
      const response = createResponse(200, body, 'https://example.com');
      expect(response.body).toBe(JSON.stringify(body));
    });

    it('includes security headers on success responses', () => {
      const response = createResponse(200, { status: 'success' }, 'https://example.com');
      expect(response.headers['Content-Type']).toBe('application/json');
      expect(response.headers['X-Content-Type-Options']).toBe('nosniff');
      expect(response.headers['Strict-Transport-Security']).toBe('max-age=31536000');
    });

    it('includes security headers on error responses', () => {
      const response = createResponse(403, { message: 'Forbidden' }, 'https://evil.com');
      expect(response.headers['Content-Type']).toBe('application/json');
      expect(response.headers['X-Content-Type-Options']).toBe('nosniff');
      expect(response.headers['Strict-Transport-Security']).toBe('max-age=31536000');
    });

    it('includes CORS headers for allowed origin', () => {
      const response = createResponse(200, { status: 'success' }, 'https://example.com');
      expect(response.headers['Access-Control-Allow-Origin']).toBe('https://example.com');
    });

    it('omits CORS headers for disallowed origin', () => {
      const response = createResponse(403, { message: 'Forbidden' }, 'https://evil.com');
      expect(response.headers['Access-Control-Allow-Origin']).toBeUndefined();
    });

    it('omits CORS headers when origin is not provided', () => {
      const response = createResponse(500, { message: 'Internal Error' }, undefined);
      expect(response.headers['Access-Control-Allow-Origin']).toBeUndefined();
    });

    it('handles 413 error responses with security headers', () => {
      const response = createResponse(413, { message: 'Payload Too Large' }, 'https://example.com');
      expect(response.statusCode).toBe(413);
      expect(response.headers['Content-Type']).toBe('application/json');
      expect(response.headers['X-Content-Type-Options']).toBe('nosniff');
      expect(response.headers['Strict-Transport-Security']).toBe('max-age=31536000');
      expect(response.headers['Access-Control-Allow-Origin']).toBe('https://example.com');
    });

    it('handles 503 error responses with security headers', () => {
      const response = createResponse(503, { message: 'Service Unavailable' }, undefined);
      expect(response.statusCode).toBe(503);
      expect(response.headers['Content-Type']).toBe('application/json');
      expect(response.headers['X-Content-Type-Options']).toBe('nosniff');
      expect(response.headers['Strict-Transport-Security']).toBe('max-age=31536000');
    });
  });
});
