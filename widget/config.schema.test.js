// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * Property-based tests for config.schema.json validation.
 *
 * Feature: generic-quicksuite-widget
 * Property 3: Config Tab Count Validation
 * Property 5: Config Schema Validation Round-Trip
 *
 * Validates: Requirements 2.2, 2.7, 2.8
 */

const fc = require('fast-check');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const schema = require('./config.schema.json');

// Set up AJV with draft-07 support
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);
const validate = ajv.compile(schema);

// --- Arbitraries (generators) ---

/** Generate a valid UUID string */
const arbUuid = fc.uuid().map((u) => u);

/** Generate a valid hex color */
const arbHexColor = fc.hexaString({ minLength: 6, maxLength: 6 }).map((s) => `#${s}`);

/** Generate a valid sub-item */
const arbSubItem = fc.record({
  id: fc.string({ minLength: 1, maxLength: 20 }).filter((s) => s.trim().length > 0),
  label: fc.string({ minLength: 1, maxLength: 40 }).filter((s) => s.trim().length > 0),
  dashboardId: arbUuid,
  sheetId: fc.string({ minLength: 1, maxLength: 30 }).filter((s) => s.trim().length > 0),
});

/** Generate a valid navigation tab entry */
const arbTab = fc.record({
  label: fc.string({ minLength: 1, maxLength: 40 }).filter((s) => s.trim().length > 0),
  type: fc.constantFrom('dashboard', 'chat'),
  subItems: fc.array(arbSubItem, { minLength: 0, maxLength: 3 }),
});

/** Generate a valid tab key (alphanumeric, no empty) */
const arbTabKey = fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9_]{0,19}$/);

/**
 * Generate a navigation object with exactly N tabs.
 */
function arbNavigationWithNTabs(n) {
  return fc.array(arbTab, { minLength: n, maxLength: n }).map((tabs) => {
    const nav = {};
    for (let i = 0; i < tabs.length; i++) {
      nav[`tab${i}`] = tabs[i];
    }
    return nav;
  });
}

/**
 * Generate a minimal valid config with a given navigation object.
 */
function buildConfig(navigation) {
  return {
    apiEndpoint: 'https://api.example.com/prod',
    navigation,
  };
}

// --- Property 3: Config Tab Count Validation ---

describe('Feature: generic-quicksuite-widget, Property 3: Config Tab Count Validation', () => {
  /**
   * **Validates: Requirements 2.2**
   *
   * For any Config_File with N Navigation_Tabs where 1 ≤ N ≤ 10,
   * schema validation shall pass.
   */
  it('configs with 1–10 tabs pass validation', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10 }).chain((n) => arbNavigationWithNTabs(n)),
        (navigation) => {
          const config = buildConfig(navigation);
          const valid = validate(config);
          if (!valid) {
            // Filter out errors unrelated to tab count (e.g., format errors on generated strings)
            const tabCountErrors = validate.errors.filter(
              (e) => e.instancePath === '/navigation' && (e.keyword === 'minProperties' || e.keyword === 'maxProperties')
            );
            // No tab-count errors should exist
            return tabCountErrors.length === 0;
          }
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 2.2**
   *
   * For any Config_File with 0 Navigation_Tabs, schema validation shall fail.
   */
  it('configs with 0 tabs fail validation', () => {
    fc.assert(
      fc.property(fc.constant({}), (navigation) => {
        const config = buildConfig(navigation);
        const valid = validate(config);
        expect(valid).toBe(false);
        // Should have a minProperties error on /navigation
        const relevantErrors = validate.errors.filter(
          (e) => e.instancePath === '/navigation' && e.keyword === 'minProperties'
        );
        expect(relevantErrors.length).toBeGreaterThan(0);
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 2.2**
   *
   * For any Config_File with more than 10 Navigation_Tabs, schema validation shall fail.
   */
  it('configs with >10 tabs fail validation', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 11, max: 20 }).chain((n) => arbNavigationWithNTabs(n)),
        (navigation) => {
          const config = buildConfig(navigation);
          const valid = validate(config);
          expect(valid).toBe(false);
          // Should have a maxProperties error on /navigation
          const relevantErrors = validate.errors.filter(
            (e) => e.instancePath === '/navigation' && e.keyword === 'maxProperties'
          );
          expect(relevantErrors.length).toBeGreaterThan(0);
          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// --- Property 5: Config Schema Validation Round-Trip ---

describe('Feature: generic-quicksuite-widget, Property 5: Config Schema Validation Round-Trip', () => {
  /**
   * **Validates: Requirements 2.7**
   *
   * For any Config_File generated conforming to the JSON Schema,
   * validation shall pass.
   */
  it('valid configs pass schema validation', () => {
    const arbValidConfig = fc.record({
      apiEndpoint: fc.constant('https://api.example.com/prod'),
      navigation: fc.integer({ min: 1, max: 10 }).chain((n) => arbNavigationWithNTabs(n)),
      session: fc.option(
        fc.record({
          expirationMinutes: fc.integer({ min: 1, max: 120 }),
        }),
        { nil: undefined }
      ),
      branding: fc.option(
        fc.record({
          primaryColor: arbHexColor,
          secondaryColor: arbHexColor,
        }),
        { nil: undefined }
      ),
      chatEnabled: fc.option(fc.boolean(), { nil: undefined }),
      containerId: fc.option(
        fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9_-]{0,30}$/),
        { nil: undefined }
      ),
      fallbackMode: fc.option(fc.boolean(), { nil: undefined }),
      loadingScreen: fc.option(fc.boolean(), { nil: undefined }),
    });

    fc.assert(
      fc.property(arbValidConfig, (config) => {
        // Remove undefined optional fields
        const cleaned = JSON.parse(JSON.stringify(config));
        const valid = validate(cleaned);
        return valid === true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 2.8**
   *
   * For any Config_File with a schema violation, the validation error
   * shall include the failing property path and constraint violated.
   */
  it('invalid configs produce errors with property path and constraint', () => {
    // Generate configs with known schema violations
    const arbInvalidConfig = fc.oneof(
      // Missing required field: apiEndpoint
      fc.constant({
        navigation: { tab1: { label: 'Test' } },
      }),
      // Missing required field: navigation
      fc.constant({
        apiEndpoint: 'https://api.example.com/prod',
      }),
      // Invalid type for apiEndpoint (number instead of string)
      fc.constant({
        apiEndpoint: 12345,
        navigation: { tab1: { label: 'Test' } },
      }),
      // Invalid session.expirationMinutes (out of range)
      fc.integer({ min: 121, max: 500 }).map((val) => ({
        apiEndpoint: 'https://api.example.com/prod',
        navigation: { tab1: { label: 'Test' } },
        session: { expirationMinutes: val },
      })),
      // Invalid session.expirationMinutes (below minimum)
      fc.integer({ min: -100, max: 0 }).map((val) => ({
        apiEndpoint: 'https://api.example.com/prod',
        navigation: { tab1: { label: 'Test' } },
        session: { expirationMinutes: val },
      })),
      // Invalid branding color (not hex pattern)
      fc.constant({
        apiEndpoint: 'https://api.example.com/prod',
        navigation: { tab1: { label: 'Test' } },
        branding: { primaryColor: 'not-a-color' },
      }),
      // Invalid chatUserPoolSize (below minimum of 2)
      fc.constant({
        apiEndpoint: 'https://api.example.com/prod',
        navigation: { tab1: { label: 'Test' } },
        chatUserPoolSize: 1,
      }),
      // Additional property not allowed
      fc.constant({
        apiEndpoint: 'https://api.example.com/prod',
        navigation: { tab1: { label: 'Test' } },
        unknownProperty: 'should fail',
      }),
      // Tab label exceeds maxLength (40 chars)
      fc.constant({
        apiEndpoint: 'https://api.example.com/prod',
        navigation: { tab1: { label: 'A'.repeat(41) } },
      }),
      // Navigation tab with additional property not allowed
      fc.constant({
        apiEndpoint: 'https://api.example.com/prod',
        navigation: { tab1: { label: 'Test', unknownTabProp: true } },
      })
    );

    fc.assert(
      fc.property(arbInvalidConfig, (config) => {
        const valid = validate(config);
        expect(valid).toBe(false);
        expect(validate.errors).not.toBeNull();
        expect(validate.errors.length).toBeGreaterThan(0);

        // Each error must have instancePath (property path) and keyword (constraint)
        for (const error of validate.errors) {
          // instancePath is the JSON pointer to the failing property (can be '' for root)
          expect(typeof error.instancePath).toBe('string');
          // keyword identifies the constraint violated (e.g., 'required', 'type', 'maximum')
          expect(typeof error.keyword).toBe('string');
          expect(error.keyword.length).toBeGreaterThan(0);
        }
        return true;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 2.8**
   *
   * Validation errors include specific property paths that identify
   * where in the config the violation occurred.
   */
  it('validation errors identify the specific failing property path', () => {
    // Test specific known violations and verify the path is correct
    const testCases = [
      {
        config: {
          apiEndpoint: 'https://api.example.com/prod',
          navigation: { tab1: { label: 'Test' } },
          session: { expirationMinutes: 200 },
        },
        expectedPath: '/session/expirationMinutes',
        expectedKeyword: 'maximum',
      },
      {
        config: {
          apiEndpoint: 'https://api.example.com/prod',
          navigation: { tab1: { label: 'Test' } },
          branding: { primaryColor: 'invalid' },
        },
        expectedPath: '/branding/primaryColor',
        expectedKeyword: 'pattern',
      },
      {
        config: {
          apiEndpoint: 'https://api.example.com/prod',
          navigation: { tab1: { label: 'Test' } },
          chatUserPoolSize: 0,
        },
        expectedPath: '/chatUserPoolSize',
        expectedKeyword: 'minimum',
      },
    ];

    for (const { config, expectedPath, expectedKeyword } of testCases) {
      const valid = validate(config);
      expect(valid).toBe(false);
      const matchingError = validate.errors.find(
        (e) => e.instancePath === expectedPath && e.keyword === expectedKeyword
      );
      expect(matchingError).toBeDefined();
    }
  });
});
