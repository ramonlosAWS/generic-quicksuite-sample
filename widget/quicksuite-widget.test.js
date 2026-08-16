// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * @jest-environment jsdom
 */

/**
 * Unit tests for WidgetInitializer and ConfigLoader
 * Tests: container detection, config loading, schema validation, error display
 */

// The IIFE module exports for testing
const { ConfigLoader, WidgetInitializer, ConfigFetchError, ConfigValidationError } = require('./quicksuite-widget');

// Load schema for validation tests
const schema = require('./config.schema.json');
const sampleConfig = require('./config.json');

describe('ConfigLoader', () => {
  let loader;

  beforeEach(() => {
    loader = new ConfigLoader();
    // Load schema directly for unit tests
    loader._schema = schema;
  });

  describe('validate()', () => {
    test('accepts a valid sample config', () => {
      const result = loader.validate(sampleConfig);
      expect(result).toEqual(sampleConfig);
    });

    test('rejects config missing required apiEndpoint', () => {
      const badConfig = { navigation: { tab1: { label: 'Tab' } } };
      expect(() => loader.validate(badConfig)).toThrow(ConfigValidationError);
    });

    test('rejects config missing required navigation', () => {
      const badConfig = { apiEndpoint: 'https://example.com/api' };
      expect(() => loader.validate(badConfig)).toThrow(ConfigValidationError);
    });

    test('rejects config with empty navigation (0 tabs)', () => {
      const badConfig = { apiEndpoint: 'https://example.com/api', navigation: {} };
      expect(() => loader.validate(badConfig)).toThrow(ConfigValidationError);
    });

    test('rejects config with >10 navigation tabs', () => {
      const nav = {};
      for (let i = 0; i < 11; i++) {
        nav['tab' + i] = { label: 'Tab ' + i };
      }
      const badConfig = { apiEndpoint: 'https://example.com/api', navigation: nav };
      expect(() => loader.validate(badConfig)).toThrow(ConfigValidationError);
    });

    test('rejects navigation tab with label exceeding 40 chars', () => {
      const badConfig = {
        apiEndpoint: 'https://example.com/api',
        navigation: {
          tab1: { label: 'A'.repeat(41) }
        }
      };
      expect(() => loader.validate(badConfig)).toThrow(ConfigValidationError);
    });

    test('rejects invalid hex color in branding', () => {
      const badConfig = {
        apiEndpoint: 'https://example.com/api',
        navigation: { tab1: { label: 'Tab' } },
        branding: { primaryColor: 'not-a-hex' }
      };
      expect(() => loader.validate(badConfig)).toThrow(ConfigValidationError);
    });

    test('rejects session expiration below minimum (1)', () => {
      const badConfig = {
        apiEndpoint: 'https://example.com/api',
        navigation: { tab1: { label: 'Tab' } },
        session: { expirationMinutes: 0 }
      };
      expect(() => loader.validate(badConfig)).toThrow(ConfigValidationError);
    });

    test('rejects session expiration above maximum (120)', () => {
      const badConfig = {
        apiEndpoint: 'https://example.com/api',
        navigation: { tab1: { label: 'Tab' } },
        session: { expirationMinutes: 121 }
      };
      expect(() => loader.validate(badConfig)).toThrow(ConfigValidationError);
    });

    test('rejects invalid dashboardId format (non-UUID)', () => {
      const badConfig = {
        apiEndpoint: 'https://example.com/api',
        navigation: {
          tab1: {
            label: 'Tab',
            subItems: [{
              id: 'item1',
              label: 'Item',
              dashboardId: 'not-a-uuid',
              sheetId: 'sheet1'
            }]
          }
        }
      };
      expect(() => loader.validate(badConfig)).toThrow(ConfigValidationError);
    });

    test('rejects chatUserPoolSize below minimum (2)', () => {
      const badConfig = {
        apiEndpoint: 'https://example.com/api',
        navigation: { tab1: { label: 'Tab' } },
        chatUserPoolSize: 1
      };
      expect(() => loader.validate(badConfig)).toThrow(ConfigValidationError);
    });

    test('validation errors include property path', () => {
      const badConfig = {
        apiEndpoint: 'https://example.com/api',
        navigation: { tab1: { label: 'Tab' } },
        session: { expirationMinutes: 999 }
      };
      try {
        loader.validate(badConfig);
        fail('Should have thrown');
      } catch (err) {
        expect(err.validationErrors).toBeDefined();
        expect(err.validationErrors.length).toBeGreaterThan(0);
        expect(err.validationErrors[0].path).toContain('session');
        expect(err.validationErrors[0].message).toBeDefined();
      }
    });

    test('rejects additional properties at top level', () => {
      const badConfig = {
        apiEndpoint: 'https://example.com/api',
        navigation: { tab1: { label: 'Tab' } },
        unknownField: 'test'
      };
      expect(() => loader.validate(badConfig)).toThrow(ConfigValidationError);
    });

    test('accepts valid 6-digit hex colors', () => {
      const goodConfig = {
        apiEndpoint: 'https://example.com/api',
        navigation: { tab1: { label: 'Tab' } },
        branding: { primaryColor: '#1E3A5F', secondaryColor: '#4A90D9' }
      };
      const result = loader.validate(goodConfig);
      expect(result.branding.primaryColor).toBe('#1E3A5F');
    });

    test('accepts config with exactly 10 tabs', () => {
      const nav = {};
      for (let i = 0; i < 10; i++) {
        nav['tab' + i] = { label: 'Tab ' + i };
      }
      const goodConfig = { apiEndpoint: 'https://example.com/api', navigation: nav };
      const result = loader.validate(goodConfig);
      expect(Object.keys(result.navigation)).toHaveLength(10);
    });

    test('accepts config with exactly 1 tab', () => {
      const goodConfig = {
        apiEndpoint: 'https://example.com/api',
        navigation: { single: { label: 'Only Tab' } }
      };
      const result = loader.validate(goodConfig);
      expect(Object.keys(result.navigation)).toHaveLength(1);
    });
  });

  describe('_isValidUrl()', () => {
    test('accepts https URLs', () => {
      expect(loader._isValidUrl('https://example.com/path')).toBe(true);
    });

    test('accepts http URLs', () => {
      expect(loader._isValidUrl('http://localhost:3000')).toBe(true);
    });

    test('rejects non-URL strings', () => {
      expect(loader._isValidUrl('not-a-url')).toBe(false);
    });

    test('rejects empty string', () => {
      expect(loader._isValidUrl('')).toBe(false);
    });
  });

  describe('_checkType()', () => {
    test('string type', () => {
      expect(loader._checkType('hello', 'string')).toBe(true);
      expect(loader._checkType(123, 'string')).toBe(false);
    });

    test('number type', () => {
      expect(loader._checkType(42, 'number')).toBe(true);
      expect(loader._checkType('42', 'number')).toBe(false);
    });

    test('integer type', () => {
      expect(loader._checkType(5, 'integer')).toBe(true);
      expect(loader._checkType(5.5, 'integer')).toBe(false);
    });

    test('boolean type', () => {
      expect(loader._checkType(true, 'boolean')).toBe(true);
      expect(loader._checkType('true', 'boolean')).toBe(false);
    });

    test('object type', () => {
      expect(loader._checkType({}, 'object')).toBe(true);
      expect(loader._checkType([], 'object')).toBe(false);
      expect(loader._checkType(null, 'object')).toBe(false);
    });

    test('array type', () => {
      expect(loader._checkType([], 'array')).toBe(true);
      expect(loader._checkType({}, 'array')).toBe(false);
    });
  });
});

describe('ConfigFetchError', () => {
  test('has correct name and statusCode', () => {
    const err = new ConfigFetchError('test msg', 404);
    expect(err.name).toBe('ConfigFetchError');
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe('test msg');
  });
});

describe('ConfigValidationError', () => {
  test('has correct name and validation errors', () => {
    const errors = [{ path: '/test', message: 'broken' }];
    const err = new ConfigValidationError('invalid', errors);
    expect(err.name).toBe('ConfigValidationError');
    expect(err.validationErrors).toEqual(errors);
    expect(err.message).toBe('invalid');
  });
});
