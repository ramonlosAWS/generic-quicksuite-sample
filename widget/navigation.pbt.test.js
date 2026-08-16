// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * @jest-environment jsdom
 */

/**
 * Property-based tests for NavigationRenderer.
 *
 * Feature: generic-quicksuite-widget
 * Property 4: Secondary Navigation Rendering
 * Property 7: CSS Scoping
 *
 * Validates: Requirements 2.3, 2.4, 3.7, 7.1, 7.7
 */

const fc = require('fast-check');
const { NavigationRenderer } = require('./quicksuite-widget');

/** Build a navigation config with a single tab having the given number of sub-items. */
function buildSingleTabConfig(subItemCount, options) {
  options = options || {};
  const subItems = [];
  for (let i = 0; i < subItemCount; i++) {
    subItems.push({
      id: 'item-' + i,
      label: 'Item ' + i,
      dashboardId: '11111111-1111-1111-1111-111111111111',
      sheetId: 'sheet-' + i
    });
  }
  return {
    apiEndpoint: 'https://api.example.com/prod',
    navigation: {
      tab1: {
        label: 'Tab One',
        type: 'dashboard',
        mobileShowSubNav: options.mobileShowSubNav,
        subItems
      }
    }
  };
}

/**
 * Create a detached container (not attached to document.body) for a
 * NavigationRenderer under test, with `_isMobile()` stubbed to a fixed
 * value for the lifetime of the returned renderer.
 *
 * Two deliberate choices here avoid an intermittent jsdom teardown race
 * ("window is not defined") observed in this Jest/jsdom/Node combination
 * when a property test repeatedly mutates global state across hundreds of
 * fast-check iterations (the same class of issue worked around in
 * deeplink.pbt.test.js for window.location):
 *   1. The container is never attached to document.body.
 *   2. Viewport classification is stubbed directly via `_isMobile()`
 *      instead of reassigning `window.innerWidth` on every iteration.
 *
 * @param {Object} config
 * @param {boolean} [mobile=false] - Viewport classification to simulate
 * @returns {{ container: HTMLElement, renderer: NavigationRenderer }}
 */
function makeRenderer(config, mobile) {
  const container = document.createElement('div');
  const renderer = new NavigationRenderer({ container, config });
  renderer._isMobile = function () { return !!mobile; };
  renderer._wasMobile = !!mobile;
  return { container, renderer };
}

describe('Feature: generic-quicksuite-widget, Property 4: Secondary Navigation Rendering', () => {
  /**
   * **Validates: Requirements 2.3**
   *
   * For any Navigation_Tab with 2 or more Sub_Items, a secondary navigation
   * bar shall be rendered.
   */
  it('renders a secondary nav bar for tabs with 2 or more sub-items', () => {
    fc.assert(
      fc.property(fc.integer({ min: 2, max: 10 }), (subItemCount) => {
        const config = buildSingleTabConfig(subItemCount);
        const { container, renderer } = makeRenderer(config, false);

        renderer.render();
        renderer.setActiveTab('tab1');

        const subNav = container.querySelector('.qs-sub-nav');
        expect(subNav).not.toBeNull();
        expect(subNav.querySelectorAll('.qs-sub-nav-item').length).toBe(subItemCount);

        renderer.destroy();
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 2.4**
   *
   * For any Navigation_Tab with exactly 1 Sub_Item, no secondary navigation
   * bar shall be rendered.
   */
  it('does not render a secondary nav bar for tabs with exactly 1 sub-item', () => {
    const config = buildSingleTabConfig(1);
    const { container, renderer } = makeRenderer(config, false);

    renderer.render();
    renderer.setActiveTab('tab1');

    const subNav = container.querySelector('.qs-sub-nav');
    expect(subNav).toBeNull();

    renderer.destroy();
  });

  /**
   * **Validates: Requirements 2.3, 2.4**
   *
   * Zero sub-items also renders no secondary nav (degenerate case of the
   * "fewer than 2" rule).
   */
  it('does not render a secondary nav bar for tabs with zero sub-items', () => {
    const config = buildSingleTabConfig(0);
    const { container, renderer } = makeRenderer(config, false);

    renderer.render();
    renderer.setActiveTab('tab1');

    const subNav = container.querySelector('.qs-sub-nav');
    expect(subNav).toBeNull();

    renderer.destroy();
  });

  /**
   * **Validates: Requirements 7.7**
   *
   * WHILE the viewport is classified as mobile, the secondary sub-navigation
   * bar shall be hidden for any Navigation_Tab where `mobileShowSubNav` is
   * false, even if it has 2+ sub-items.
   */
  it('hides the secondary nav on mobile when mobileShowSubNav is false', () => {
    fc.assert(
      fc.property(fc.integer({ min: 2, max: 10 }), (subItemCount) => {
        const config = buildSingleTabConfig(subItemCount, { mobileShowSubNav: false });
        const { container, renderer } = makeRenderer(config, true);

        renderer.render();
        renderer.setActiveTab('tab1');

        const subNav = container.querySelector('.qs-sub-nav');
        expect(subNav).toBeNull();

        renderer.destroy();
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 7.7**
   *
   * On mobile, when mobileShowSubNav is NOT false (default true), the
   * secondary nav still renders for tabs with 2+ sub-items.
   */
  it('still shows the secondary nav on mobile when mobileShowSubNav is not false', () => {
    fc.assert(
      fc.property(fc.integer({ min: 2, max: 10 }), (subItemCount) => {
        const config = buildSingleTabConfig(subItemCount);
        const { container, renderer } = makeRenderer(config, true);

        renderer.render();
        renderer.setActiveTab('tab1');

        const subNav = container.querySelector('.qs-sub-nav');
        expect(subNav).not.toBeNull();

        renderer.destroy();
      }),
      { numRuns: 100 }
    );
  });
});

describe('Feature: generic-quicksuite-widget, Property 7: CSS Scoping', () => {
  /**
   * **Validates: Requirements 3.7**
   *
   * For any CSS rule emitted by the Widget, it shall be scoped to the
   * container element and shall not modify document-level styles.
   * We verify this by checking that no <style> element is injected into
   * document.head, and that all class-based rules the widget defines are
   * qs-prefixed (i.e. cannot accidentally clobber a host page's classes).
   */
  it('never injects a <style> element into document.head', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 5 }), fc.boolean(), (subItemCount, mobile) => {
        const config = buildSingleTabConfig(subItemCount);
        const { renderer } = makeRenderer(config, mobile);

        renderer.render();
        renderer.setActiveTab('tab1');

        const headStyles = document.head.querySelectorAll('style');
        expect(headStyles.length).toBe(0);

        renderer.destroy();
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 3.7**
   *
   * All widget-injected <style> elements live inside the container and
   * only define rules scoped to qs-* class selectors (never bare element
   * selectors like "body", "a", "*", or ID selectors that could hit
   * arbitrary host-page elements).
   */
  it('scopes all injected style rules to qs-* class selectors', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 5 }), (subItemCount) => {
        const config = buildSingleTabConfig(subItemCount);
        const { container, renderer } = makeRenderer(config, false);

        renderer.render();

        const styleEl = container.querySelector('style');
        expect(styleEl).not.toBeNull();

        // Every selector (text before a top-level "{") must reference a
        // qs- prefixed class (optionally combined with pseudo-classes like
        // :hover/:focus or pseudo-elements like ::-webkit-scrollbar-thumb).
        const cssText = styleEl.textContent;
        const selectorLines = cssText
          .split('\n')
          .map((line) => line.split('{')[0].trim())
          .filter((sel) => sel.length > 0);

        selectorLines.forEach((selector) => {
          expect(selector).toMatch(/\.qs-[a-zA-Z-]+/);
        });

        renderer.destroy();
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 3.7**
   *
   * Rendering the navigation does not add any class to document.body or
   * document.documentElement (no document-level scope pollution).
   */
  it('does not add classes to document.body or document.documentElement', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 5 }), (subItemCount) => {
        const bodyClassesBefore = document.body.className;
        const htmlClassesBefore = document.documentElement.className;

        const config = buildSingleTabConfig(subItemCount);
        const { renderer } = makeRenderer(config, false);

        renderer.render();
        renderer.setActiveTab('tab1');

        expect(document.body.className).toBe(bodyClassesBefore);
        expect(document.documentElement.className).toBe(htmlClassesBefore);

        renderer.destroy();
      }),
      { numRuns: 100 }
    );
  });
});
