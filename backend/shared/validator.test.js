// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

'use strict';

const {
  isValidUuid,
  validateDashboardId,
  validateOrigin,
  validateBodySize,
  sanitizeInput,
  parseEnvList,
  MAX_BODY_SIZE_BYTES,
  MAX_INPUT_LENGTH
} = require('./validator');

describe('validator module', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('parseEnvList', () => {
    it('returns empty array for undefined', () => {
      expect(parseEnvList(undefined)).toEqual([]);
    });

    it('returns empty array for empty string', () => {
      expect(parseEnvList('')).toEqual([]);
    });

    it('parses comma-separated values and trims whitespace', () => {
      expect(parseEnvList('a, b , c')).toEqual(['a', 'b', 'c']);
    });

    it('filters out empty entries', () => {
      expect(parseEnvList('a,,b, ,c')).toEqual(['a', 'b', 'c']);
    });
  });

  describe('isValidUuid', () => {
    it('accepts valid UUID v4 format', () => {
      expect(isValidUuid('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
    });

    it('accepts uppercase hex characters', () => {
      expect(isValidUuid('550E8400-E29B-41D4-A716-446655440000')).toBe(true);
    });

    it('rejects non-UUID strings', () => {
      expect(isValidUuid('not-a-uuid')).toBe(false);
    });

    it('rejects empty string', () => {
      expect(isValidUuid('')).toBe(false);
    });

    it('rejects null', () => {
      expect(isValidUuid(null)).toBe(false);
    });

    it('rejects undefined', () => {
      expect(isValidUuid(undefined)).toBe(false);
    });

    it('rejects UUID with wrong segment lengths', () => {
      expect(isValidUuid('550e8400-e29b-41d4-a716-44665544000')).toBe(false);
    });

    it('rejects UUID with non-hex characters', () => {
      expect(isValidUuid('550e8400-e29b-41d4-a716-44665544000g')).toBe(false);
    });
  });

  describe('validateDashboardId', () => {
    beforeEach(() => {
      process.env.ALLOWED_DASHBOARD_IDS =
        '550e8400-e29b-41d4-a716-446655440000,660e8400-e29b-41d4-a716-446655440001';
    });

    it('returns valid for an allowed dashboard ID', () => {
      const result = validateDashboardId('550e8400-e29b-41d4-a716-446655440000');
      expect(result).toEqual({ valid: true });
    });

    it('returns 403 for a valid UUID not in allowlist', () => {
      const result = validateDashboardId('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee');
      expect(result).toEqual({
        valid: false,
        statusCode: 403,
        body: { message: 'Forbidden' }
      });
    });

    it('returns 403 for invalid UUID format', () => {
      const result = validateDashboardId('not-a-uuid');
      expect(result).toEqual({
        valid: false,
        statusCode: 403,
        body: { message: 'Forbidden' }
      });
    });

    it('returns 403 for null dashboard ID', () => {
      const result = validateDashboardId(null);
      expect(result).toEqual({
        valid: false,
        statusCode: 403,
        body: { message: 'Forbidden' }
      });
    });

    it('does not reveal valid IDs in error response', () => {
      const result = validateDashboardId('aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee');
      const responseStr = JSON.stringify(result.body);
      expect(responseStr).not.toContain('550e8400');
      expect(responseStr).not.toContain('660e8400');
    });

    it('returns 403 when ALLOWED_DASHBOARD_IDS is not set', () => {
      delete process.env.ALLOWED_DASHBOARD_IDS;
      const result = validateDashboardId('550e8400-e29b-41d4-a716-446655440000');
      expect(result.valid).toBe(false);
      expect(result.statusCode).toBe(403);
    });
  });

  describe('validateOrigin', () => {
    beforeEach(() => {
      process.env.ALLOWED_ORIGINS = 'https://example.com,https://app.example.org';
    });

    it('returns valid for an allowed origin', () => {
      const result = validateOrigin('https://example.com');
      expect(result).toEqual({ valid: true });
    });

    it('returns 403 for a disallowed origin', () => {
      const result = validateOrigin('https://evil.com');
      expect(result).toEqual({
        valid: false,
        statusCode: 403,
        body: { message: 'Forbidden' }
      });
    });

    it('returns 403 for null origin', () => {
      const result = validateOrigin(null);
      expect(result).toEqual({
        valid: false,
        statusCode: 403,
        body: { message: 'Forbidden' }
      });
    });

    it('returns 403 for undefined origin', () => {
      const result = validateOrigin(undefined);
      expect(result).toEqual({
        valid: false,
        statusCode: 403,
        body: { message: 'Forbidden' }
      });
    });

    it('returns 403 for empty string origin', () => {
      const result = validateOrigin('');
      expect(result).toEqual({
        valid: false,
        statusCode: 403,
        body: { message: 'Forbidden' }
      });
    });

    it('returns 403 when ALLOWED_ORIGINS is not set', () => {
      delete process.env.ALLOWED_ORIGINS;
      const result = validateOrigin('https://example.com');
      expect(result.valid).toBe(false);
      expect(result.statusCode).toBe(403);
    });

    it('performs exact match (no partial matching)', () => {
      const result = validateOrigin('https://example.com.evil.com');
      expect(result.valid).toBe(false);
    });
  });

  describe('validateBodySize', () => {
    it('returns valid for body under 10 KB', () => {
      const body = 'a'.repeat(1000);
      expect(validateBodySize(body)).toEqual({ valid: true });
    });

    it('returns valid for body exactly at 10 KB', () => {
      const body = 'a'.repeat(MAX_BODY_SIZE_BYTES);
      expect(validateBodySize(body)).toEqual({ valid: true });
    });

    it('returns 413 for body over 10 KB', () => {
      const body = 'a'.repeat(MAX_BODY_SIZE_BYTES + 1);
      expect(validateBodySize(body)).toEqual({
        valid: false,
        statusCode: 413,
        body: { message: 'Payload Too Large' }
      });
    });

    it('handles Buffer input', () => {
      const body = Buffer.alloc(MAX_BODY_SIZE_BYTES + 1, 'a');
      expect(validateBodySize(body)).toEqual({
        valid: false,
        statusCode: 413,
        body: { message: 'Payload Too Large' }
      });
    });

    it('handles object input (serialized size)', () => {
      const body = { data: 'a'.repeat(MAX_BODY_SIZE_BYTES) };
      expect(validateBodySize(body)).toEqual({
        valid: false,
        statusCode: 413,
        body: { message: 'Payload Too Large' }
      });
    });

    it('returns valid for empty body', () => {
      expect(validateBodySize('')).toEqual({ valid: true });
    });

    it('returns valid for null body', () => {
      expect(validateBodySize(null)).toEqual({ valid: true });
    });
  });

  describe('sanitizeInput', () => {
    it('passes through alphanumeric characters', () => {
      expect(sanitizeInput('hello123')).toBe('hello123');
    });

    it('passes through hyphens and underscores', () => {
      expect(sanitizeInput('my-dashboard_id')).toBe('my-dashboard_id');
    });

    it('passes through periods and tildes', () => {
      expect(sanitizeInput('file.name~v2')).toBe('file.name~v2');
    });

    it('passes through URL-safe characters', () => {
      expect(sanitizeInput('path/to?query=val&other=1#hash')).toBe('path/to?query=val&other=1#hash');
    });

    it('strips angle brackets (HTML tags)', () => {
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert(xss)/script');
    });

    it('strips curly braces', () => {
      expect(sanitizeInput('{malicious}')).toBe('malicious');
    });

    it('strips backticks', () => {
      expect(sanitizeInput('`command`')).toBe('command');
    });

    it('enforces max length of 2048 characters', () => {
      const longInput = 'a'.repeat(3000);
      const result = sanitizeInput(longInput);
      expect(result.length).toBe(MAX_INPUT_LENGTH);
    });

    it('returns empty string for null', () => {
      expect(sanitizeInput(null)).toBe('');
    });

    it('returns empty string for undefined', () => {
      expect(sanitizeInput(undefined)).toBe('');
    });

    it('returns empty string for non-string input', () => {
      expect(sanitizeInput(123)).toBe('');
    });
  });
});
