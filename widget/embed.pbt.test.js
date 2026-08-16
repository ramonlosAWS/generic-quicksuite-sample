// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * @jest-environment jsdom
 */

/**
 * Property-based tests for EmbedManager and SessionCache.
 *
 * Feature: generic-quicksuite-widget
 * Property 6: Navigation Efficiency
 * Property 14: Viewport Classification and Mobile Sheet Resolution
 * Property 15: Session Cache Validity
 *
 * Validates: Requirements 3.3, 3.4, 7.1, 7.2, 7.3, 8.2, 8.3
 *
 * Note: jsdom's window/document are provided globally via the
 * testEnvironment setting in package.json.
 */

const fc = require('fast-check');
const { EmbedManager, SessionCache } = require('./quicksuite-widget');

// sessionStorage is a single shared instance across tests in a file, so
// clear it between tests to prevent cached embed URLs from one test leaking
// into the next.
beforeEach(() => {
  sessionStorage.clear();
});

/** Build a config with one tab containing sub-items that map to dashboards/sheets. */
function buildConfig(subItems, expirationMinutes) {
  return {
    apiEndpoint: 'https://api.example.com/prod',
    session: { expirationMinutes: expirationMinutes || 30 },
    navigation: {
      tab1: { label: 'Tab', type: 'dashboard', subItems }
    }
  };
}

/** A stub embedding context recording embed/navigation calls. */
function makeStubEmbeddingContext() {
  const calls = { embedDashboard: [], setSelectedSheetId: [] };
  const dashboardEmbed = {
    setSelectedSheetId: async (sheetId) => { calls.setSelectedSheetId.push(sheetId); },
    on: () => {}
  };
  return {
    calls,
    context: {
      embedDashboard: async (opts) => {
        calls.embedDashboard.push(opts);
        return dashboardEmbed;
      },
      embedGenerativeQnA: async () => ({ on: () => {}, setQuestion: async () => {} })
    }
  };
}

describe('Feature: generic-quicksuite-widget, Property 15: Session Cache Validity', () => {
  /**
   * **Validates: Requirements 8.2**
   *
   * For any cached Embed_URL whose age is less than session.expirationMinutes,
   * the Widget shall reuse it without calling the Backend.
   */
  it('reuses a cached URL whose age is below the expiration window', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 120 }),
        fc.integer({ min: 0, max: 100 }),
        (expirationMinutes, ageSeconds) => {
          // Ensure age is strictly below the expiration window
          fc.pre(ageSeconds * 1000 < expirationMinutes * 60 * 1000);

          const cache = new SessionCache(expirationMinutes);
          // Inject an entry aged `ageSeconds` in the past
          const entry = { url: 'https://embed/abc', timestamp: Date.now() - ageSeconds * 1000 };
          sessionStorage.setItem('qs_embed_dash1', JSON.stringify(entry));

          expect(cache.get('dash1')).toBe('https://embed/abc');

          sessionStorage.clear();
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 8.3**
   *
   * For any cached Embed_URL whose age equals or exceeds
   * session.expirationMinutes, the Widget shall discard it.
   */
  it('discards a cached URL whose age meets or exceeds the expiration window', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 120 }),
        fc.integer({ min: 0, max: 600 }),
        (expirationMinutes, extraSeconds) => {
          const cache = new SessionCache(expirationMinutes);
          const maxAgeMs = expirationMinutes * 60 * 1000;
          // Age is exactly at or beyond the expiration boundary
          const ageMs = maxAgeMs + extraSeconds * 1000;
          const entry = { url: 'https://embed/expired', timestamp: Date.now() - ageMs };
          sessionStorage.setItem('qs_embed_dash1', JSON.stringify(entry));

          expect(cache.get('dash1')).toBeNull();

          sessionStorage.clear();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('round-trips set/get within the expiration window', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 40 }), fc.webUrl(), (key, url) => {
        const cache = new SessionCache(60);
        cache.set(key, url);
        expect(cache.get(key)).toBe(url);
        sessionStorage.clear();
      }),
      { numRuns: 100 }
    );
  });
});

describe('Feature: generic-quicksuite-widget, Property 14: Viewport Classification and Mobile Sheet Resolution', () => {
  /**
   * **Validates: Requirements 7.2, 7.3**
   *
   * For a navigation item with a mobileSheetId/mobileDashboardId defined,
   * _getMobileId returns the mobile variant; for items without one it
   * returns null (so the caller falls back to the standard ID).
   */
  it('resolves mobile IDs when defined and returns null otherwise', () => {
    fc.assert(
      fc.property(fc.boolean(), (hasMobile) => {
        const subItem = {
          id: 'i1',
          label: 'I1',
          dashboardId: 'dash-standard',
          sheetId: 'sheet-standard'
        };
        if (hasMobile) {
          subItem.mobileDashboardId = 'dash-mobile';
          subItem.mobileSheetId = 'sheet-mobile';
        }
        const config = buildConfig([subItem]);
        const container = document.createElement('div');
        const em = new EmbedManager(config, container);

        if (hasMobile) {
          expect(em._getMobileId('dashboardId', 'dash-standard')).toBe('dash-mobile');
          expect(em._getMobileId('sheetId', 'sheet-standard')).toBe('sheet-mobile');
        } else {
          expect(em._getMobileId('dashboardId', 'dash-standard')).toBeNull();
          expect(em._getMobileId('sheetId', 'sheet-standard')).toBeNull();
        }
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 7.1**
   *
   * Viewport width <= 768 classifies as mobile; > 768 classifies as desktop.
   */
  it('classifies viewport width at the 768px boundary', () => {
    fc.assert(
      fc.property(fc.integer({ min: 200, max: 2000 }), (width) => {
        window.innerWidth = width;
        const config = buildConfig([]);
        const em = new EmbedManager(config, document.createElement('div'));
        expect(em._isMobile()).toBe(width <= 768);
      }),
      { numRuns: 100 }
    );
  });
});

describe('Feature: generic-quicksuite-widget, Property 6: Navigation Efficiency', () => {
  /**
   * **Validates: Requirements 3.3, 3.4**
   *
   * Navigating between two sub-items that share the same dashboard ID but a
   * different sheet ID uses the SDK's setSelectedSheetId and does NOT fetch a
   * new embed URL; navigating to a different dashboard ID fetches a new URL.
   */
  it('same-dashboard/different-sheet navigation uses SDK, different-dashboard fetches a new URL', async () => {
    // Desktop viewport so no mobile-ID substitution interferes
    window.innerWidth = 1024;

    const subItems = [
      { id: 'a', label: 'A', dashboardId: 'dash-1', sheetId: 'sheet-1' },
      { id: 'b', label: 'B', dashboardId: 'dash-1', sheetId: 'sheet-2' },
      { id: 'c', label: 'C', dashboardId: 'dash-2', sheetId: 'sheet-3' }
    ];
    const config = buildConfig(subItems);
    const container = document.createElement('div');
    const em = new EmbedManager(config, container);

    const stub = makeStubEmbeddingContext();
    em._embeddingContext = stub.context;
    em._ensureEmbedContainer();

    let fetchCount = 0;
    em._fetchEmbedUrl = async () => {
      fetchCount += 1;
      return 'https://embed/url-' + fetchCount;
    };

    // First load of dash-1/sheet-1 → one fetch, one embedDashboard
    await em.loadDashboard('dash-1', 'sheet-1');
    expect(fetchCount).toBe(1);
    expect(stub.calls.embedDashboard.length).toBe(1);

    // Same dashboard, different sheet → SDK navigation, no new fetch
    await em.loadDashboard('dash-1', 'sheet-2');
    expect(fetchCount).toBe(1);
    expect(stub.calls.setSelectedSheetId).toContain('sheet-2');

    // Different dashboard → new fetch + new embed
    await em.loadDashboard('dash-2', 'sheet-3');
    expect(fetchCount).toBe(2);
    expect(stub.calls.embedDashboard.length).toBe(2);
  });

  /**
   * **Validates: Requirements 3.4**
   *
   * QuickSight embed URLs are single-use, so each dashboard load fetches a
   * FRESH URL — even for a dashboard that was displayed earlier. Reusing a
   * previously-consumed URL fails with "invalid URL or authorization code",
   * so the widget intentionally never reuses embed URLs across loads.
   */
  it('fetches a fresh embed URL on every different-dashboard load (no reuse)', async () => {
    window.innerWidth = 1024;
    const subItems = [
      { id: 'a', label: 'A', dashboardId: 'dash-1', sheetId: 'sheet-1' },
      { id: 'c', label: 'C', dashboardId: 'dash-2', sheetId: 'sheet-3' }
    ];
    const config = buildConfig(subItems, 60);
    const container = document.createElement('div');
    const em = new EmbedManager(config, container);

    const stub = makeStubEmbeddingContext();
    em._embeddingContext = stub.context;
    em._ensureEmbedContainer();

    let fetchCount = 0;
    em._fetchEmbedUrl = async () => { fetchCount += 1; return 'https://embed/fresh-' + fetchCount; };

    await em.loadDashboard('dash-1', 'sheet-1');
    expect(fetchCount).toBe(1);

    // Different dashboard → a brand-new URL is fetched (never reused from cache)
    await em.loadDashboard('dash-2', 'sheet-3');
    expect(fetchCount).toBe(2);
    expect(stub.calls.embedDashboard.length).toBe(2);
    expect(stub.calls.embedDashboard[1].url).toBe('https://embed/fresh-2');

    // Returning to dash-1 fetches yet another fresh URL (single-use)
    await em.loadDashboard('dash-1', 'sheet-1');
    expect(fetchCount).toBe(3);
  });
});
