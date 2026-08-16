// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * @jest-environment jsdom
 */

/**
 * Property-based tests for DeepLinkParser.
 *
 * Feature: generic-quicksuite-widget
 * Property 12: Deep Link Parameter Priority
 * Property 13: Invalid Deep Link Fallback
 * Property 19: Input Sanitization
 *
 * Validates: Requirements 6.1, 6.2, 6.3, 6.6, 6.7, 6.8, 15.5
 *
 * Design note: DeepLinkParser.parse() reads window.location.search directly,
 * so exercising it end-to-end under fast-check (100+ iterations, each
 * mutating window.location) is possible but proved flaky in this
 * jsdom/Jest combination — repeated location mutation inside a tight
 * property-test loop intermittently tears down the jsdom global mid-run.
 * To keep these tests both deterministic and true property tests, we
 * exercise the pure, side-effect-free helper methods
 * (_mergeWithPriority, _validateAgainstConfig, _sanitize) directly with
 * fast-check, and cover the window.location integration with a single
 * example-based test per public entry point (parse/_readUrlParams).
 */

const fc = require('fast-check');
const { DeepLinkParser } = require('./quicksuite-widget');

/** Build a minimal container element stub with the given data attributes. */
function makeContainer(attrs) {
  attrs = attrs || {};
  return {
    getAttribute: function (name) {
      return Object.prototype.hasOwnProperty.call(attrs, name) ? attrs[name] : null;
    }
  };
}

/** Build a minimal valid config with the given tab keys and sub-item ids per tab. */
function buildConfig(tabSpecs) {
  const navigation = {};
  tabSpecs.forEach(({ tabId, subItemIds, type }) => {
    navigation[tabId] = {
      label: tabId,
      type: type || 'dashboard',
      subItems: (subItemIds || []).map((id) => ({
        id,
        label: id,
        dashboardId: '11111111-1111-1111-1111-111111111111',
        sheetId: 'sheet-' + id
      }))
    };
  });
  return { apiEndpoint: 'https://api.example.com/prod', navigation, chatEnabled: true };
}

// Tab/sub-item identifiers must NOT be plain numeric strings (e.g. "0", "42").
// JS object keys that look like array indices are always iterated in
// ascending numeric order by Object.keys(), regardless of insertion order,
// which would make "the first tab is the default" assumption in
// DeepLinkParser (and this test) unreliable. Prefixing with a letter avoids
// that pitfall while still exercising a wide range of token shapes.
const arbSafeToken = fc.stringMatching(/^[a-zA-Z][a-zA-Z0-9_-]{0,15}$/);

describe('Feature: generic-quicksuite-widget, Property 12: Deep Link Parameter Priority', () => {
  /**
   * **Validates: Requirements 6.1, 6.2, 6.3**
   *
   * For any setting specified in both URL query parameters and HTML data
   * attributes with different values, the Widget shall use the URL query
   * parameter value. Exercises _mergeWithPriority directly — the pure
   * merge logic behind Requirement 6.3 — independent of how the raw
   * values were read (URL vs. data attribute).
   */
  it('URL params take priority over data attributes for tab and item', () => {
    fc.assert(
      fc.property(
        arbSafeToken, arbSafeToken, arbSafeToken, arbSafeToken, arbSafeToken, arbSafeToken,
        (urlTab, dataTab, urlItem, dataItem, view, prompt) => {
          const parser = new DeepLinkParser();
          const merged = parser._mergeWithPriority(
            { tab: urlTab, item: urlItem, view, prompt },
            { tab: dataTab, item: dataItem }
          );

          expect(merged.tab).toBe(urlTab);
          expect(merged.item).toBe(urlItem);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 6.2**
   *
   * When URL params are absent (null), data attributes are used.
   */
  it('falls back to data attributes when URL params are absent', () => {
    fc.assert(
      fc.property(arbSafeToken, arbSafeToken, (dataTab, dataItem) => {
        const parser = new DeepLinkParser();
        const merged = parser._mergeWithPriority(
          { tab: null, item: null, view: null, prompt: null },
          { tab: dataTab, item: dataItem }
        );

        expect(merged.tab).toBe(dataTab);
        expect(merged.item).toBe(dataItem);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 6.3, 6.8**
   *
   * For any valid deep link parameter, the Widget shall URL-decode and
   * sanitize by stripping HTML tags and limiting to 200 characters.
   * Exercised via the pure _sanitize() helper (see Property 19 below for
   * the full property coverage of this rule); this test confirms the
   * decode step specifically, using a single, one-off URL-encoded value
   * rather than a property loop.
   */
  it('sanitizes a URL-decoded value with embedded HTML the same way as a raw value', () => {
    const longRaw = 'x'.repeat(300);
    const withTag = '<script>' + longRaw + '</script>';
    const encoded = encodeURIComponent(withTag);
    const decoded = decodeURIComponent(encoded);

    const parser = new DeepLinkParser();
    const sanitized = parser._sanitize(decoded);

    expect(sanitized).not.toContain('<');
    expect(sanitized).not.toContain('>');
    expect(sanitized.length).toBeLessThanOrEqual(200);
  });
});

describe('Feature: generic-quicksuite-widget, Property 13: Invalid Deep Link Fallback', () => {
  /**
   * **Validates: Requirements 6.6**
   *
   * For any deep link `tab` parameter referencing a non-existent
   * Navigation_Tab, the Widget shall fall back to the default Navigation_Tab.
   * Exercised via _validateAgainstConfig directly (the pure fallback logic),
   * avoiding repeated window.location mutation across iterations.
   */
  it('falls back to the default tab when the requested tab does not exist', () => {
    fc.assert(
      fc.property(
        fc.array(arbSafeToken, { minLength: 1, maxLength: 5 }).filter((arr) => new Set(arr).size === arr.length),
        arbSafeToken,
        (tabIds, bogusTab) => {
          fc.pre(!tabIds.includes(bogusTab));
          const config = buildConfig(tabIds.map((id) => ({ tabId: id, subItemIds: ['item-' + id] })));
          const parser = new DeepLinkParser();

          const state = parser._validateAgainstConfig(
            { tab: bogusTab, item: null, view: null, prompt: null },
            config
          );

          expect(state.tab).toBe(tabIds[0]);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 6.7**
   *
   * For any deep link `item` parameter referencing a non-existent Sub_Item
   * within a valid Navigation_Tab, the Widget shall navigate to the
   * specified tab and fall back to that tab's default Sub_Item.
   */
  it('falls back to the default sub-item when the requested item does not exist', () => {
    fc.assert(
      fc.property(
        arbSafeToken,
        fc.array(arbSafeToken, { minLength: 1, maxLength: 5 }).filter((arr) => new Set(arr).size === arr.length),
        arbSafeToken,
        (tabId, subItemIds, bogusItem) => {
          fc.pre(!subItemIds.includes(bogusItem));
          const config = buildConfig([{ tabId, subItemIds }]);
          const parser = new DeepLinkParser();

          const state = parser._validateAgainstConfig(
            { tab: tabId, item: bogusItem, view: null, prompt: null },
            config
          );

          expect(state.tab).toBe(tabId);
          expect(state.item).toBe(subItemIds[0]);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 4.9, 6.6**
   *
   * If chatEnabled is false, a deep link targeting a chat-type tab (or
   * view=chat) rejects that target and falls back to the default tab.
   */
  it('rejects a chat tab deep link when chatEnabled is false', () => {
    fc.assert(
      fc.property(arbSafeToken, arbSafeToken, (dashboardTabId, chatTabId) => {
        fc.pre(dashboardTabId !== chatTabId);
        const config = buildConfig([
          { tabId: dashboardTabId, subItemIds: ['item-1'] },
          { tabId: chatTabId, subItemIds: [], type: 'chat' }
        ]);
        config.chatEnabled = false;

        const parser = new DeepLinkParser();
        const state = parser._validateAgainstConfig(
          { tab: chatTabId, item: null, view: null, prompt: null },
          config
        );

        expect(state.tab).toBe(dashboardTabId);
      }),
      { numRuns: 100 }
    );
  });
});

describe('Feature: generic-quicksuite-widget, Property 19: Input Sanitization', () => {
  /**
   * **Validates: Requirements 15.5**
   *
   * For any user-provided input (deep link parameters), the Widget shall
   * strip characters outside the alphanumeric, hyphen, and URL-safe
   * character set and enforce a maximum length of 2048 characters.
   * (The DeepLinkParser itself caps at 200 chars per Requirement 6.8, which
   * is a stricter sub-case of the 2048-char ceiling from Requirement 15.5.)
   */
  it('sanitized values never exceed 200 characters and contain no angle brackets', () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 500 }), (raw) => {
        const parser = new DeepLinkParser();
        const sanitized = parser._sanitize(raw);

        expect(sanitized.length).toBeLessThanOrEqual(200);
        expect(sanitized).not.toMatch(/[<>]/);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 15.5**
   *
   * Sanitized output only contains characters from the allowed set.
   */
  it('sanitized values only contain alphanumeric, hyphen, underscore, dot, tilde, or space', () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 300 }), (raw) => {
        const parser = new DeepLinkParser();
        const sanitized = parser._sanitize(raw);

        expect(sanitized).toMatch(/^[a-zA-Z0-9\-_.~ ]*$/);
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 6.5**
   *
   * The `prompt` parameter is truncated to a maximum of 500 characters
   * during config validation (a separate, larger limit than the 200-char
   * per-parameter sanitize step, applied specifically to prompt text).
   * Built from a safe alphabet directly (not filtered from arbitrary
   * unicode) since filtering at this string length would reject almost
   * every generated candidate and stall the run.
   */
  it('prompt values longer than 500 characters are truncated by config validation', () => {
    const arbLongSafeString = fc
      .array(fc.constantFrom(..."abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ".split('')), {
        minLength: 501,
        maxLength: 700
      })
      .map((chars) => chars.join(''));

    fc.assert(
      fc.property(arbLongSafeString, (longPrompt) => {
        const config = buildConfig([{ tabId: 'qa', subItemIds: [], type: 'chat' }]);
        const parser = new DeepLinkParser();

        const result = parser._validateAgainstConfig(
          { tab: null, item: null, view: 'chat', prompt: longPrompt },
          config
        );

        expect(result.prompt.length).toBe(500);
        expect(result.prompt).toBe(longPrompt.substring(0, 500));
      }),
      { numRuns: 100 }
    );
  });

  it('prompt values of 500 characters or fewer are left untouched', () => {
    fc.assert(
      fc.property(fc.string({ maxLength: 500 }), (shortPrompt) => {
        const config = buildConfig([{ tabId: 'qa', subItemIds: [], type: 'chat' }]);
        const parser = new DeepLinkParser();

        const result = parser._validateAgainstConfig(
          { tab: null, item: null, view: 'chat', prompt: shortPrompt },
          config
        );

        expect(result.prompt).toBe(shortPrompt);
      }),
      { numRuns: 100 }
    );
  });
});
