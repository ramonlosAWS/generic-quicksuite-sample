// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * QuickSuite Widget — Generic QuickSight Embedding Widget
 *
 * Self-contained IIFE that initializes an embedded QuickSight dashboard
 * and Q&A chat experience from a single <script> tag. No global scope
 * pollution. All configuration is loaded from a co-located config.json.
 */
(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // ConfigLoader — fetches and validates config.json against schema
  // ---------------------------------------------------------------------------

  class ConfigLoader {
    constructor() {
      this._schema = null;
    }

    /**
     * Load and validate the configuration file.
     * @param {string} configUrl - Absolute URL to config.json
     * @returns {Promise<Object>} Validated configuration object
     * @throws {Error} On fetch failure or validation errors
     */
    async load(configUrl) {
      const config = await this._fetchJson(configUrl, 'config.json');
      const schemaUrl = configUrl.replace(/config\.json$/, 'config.schema.json');
      await this._loadSchema(schemaUrl);
      return this.validate(config);
    }

    /**
     * Validate a config object against the loaded schema.
     * @param {Object} config - Configuration object to validate
     * @returns {Object} The validated config (unchanged if valid)
     * @throws {Error} With validation details if invalid
     */
    validate(config) {
      if (!this._schema) {
        // Schema not loaded — skip validation but warn
        console.warn('[QuickSuite] Config schema not loaded; skipping validation.');
        return config;
      }

      const errors = this._validateAgainstSchema(config, this._schema, '');
      if (errors.length > 0) {
        errors.forEach(function (err) {
          console.error('[QuickSuite] Config validation error: ' + err.path + ' — ' + err.message);
        });
        var errorMsg = 'Configuration is invalid: ' + errors.length + ' error(s) found.';
        throw new ConfigValidationError(errorMsg, errors);
      }
      return config;
    }

    /**
     * Fetch a JSON resource.
     * @private
     */
    async _fetchJson(url, label) {
      var response;
      try {
        response = await fetch(url);
      } catch (networkErr) {
        var msg = 'Failed to fetch ' + label + ': network error';
        console.error('[QuickSuite] ' + msg);
        throw new ConfigFetchError(msg, 0);
      }

      if (!response.ok) {
        var errMsg = 'Failed to fetch ' + label + ': HTTP ' + response.status;
        console.error('[QuickSuite] ' + errMsg);
        throw new ConfigFetchError(errMsg, response.status);
      }

      try {
        return await response.json();
      } catch (parseErr) {
        var parseMsg = 'Failed to parse ' + label + ': invalid JSON';
        console.error('[QuickSuite] ' + parseMsg);
        throw new ConfigFetchError(parseMsg, 0);
      }
    }

    /**
     * Load the JSON schema for validation.
     * @private
     */
    async _loadSchema(schemaUrl) {
      try {
        this._schema = await this._fetchJson(schemaUrl, 'config.schema.json');
      } catch (err) {
        console.warn('[QuickSuite] Could not load config schema; validation will be skipped.', err.message);
        this._schema = null;
      }
    }

    /**
     * Minimal JSON Schema validator (draft-07 subset).
     * Validates type, required, properties, pattern, min/max, enum, format.
     * Returns an array of { path, message } error objects.
     * @private
     */
    _validateAgainstSchema(value, schema, path) {
      var errors = [];

      if (!schema || typeof schema !== 'object') {
        return errors;
      }

      // Type check
      if (schema.type) {
        if (!this._checkType(value, schema.type)) {
          errors.push({ path: path || '/', message: 'Expected type "' + schema.type + '", got "' + this._getType(value) + '"' });
          return errors; // No point continuing if type is wrong
        }
      }

      // Enum check
      if (schema.enum) {
        if (schema.enum.indexOf(value) === -1) {
          errors.push({ path: path || '/', message: 'Value must be one of: ' + schema.enum.join(', ') });
        }
      }

      // String constraints
      if (schema.type === 'string' && typeof value === 'string') {
        if (schema.maxLength !== undefined && value.length > schema.maxLength) {
          errors.push({ path: path || '/', message: 'String exceeds maxLength of ' + schema.maxLength });
        }
        if (schema.pattern) {
          var re = new RegExp(schema.pattern);
          if (!re.test(value)) {
            errors.push({ path: path || '/', message: 'String does not match pattern: ' + schema.pattern });
          }
        }
        if (schema.format === 'uri') {
          if (!this._isValidUrl(value)) {
            errors.push({ path: path || '/', message: 'String is not a valid URI' });
          }
        }
        if (schema.format === 'uuid') {
          if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) {
            errors.push({ path: path || '/', message: 'String is not a valid UUID' });
          }
        }
      }

      // Number constraints
      if ((schema.type === 'number' || schema.type === 'integer') && typeof value === 'number') {
        if (schema.minimum !== undefined && value < schema.minimum) {
          errors.push({ path: path || '/', message: 'Value ' + value + ' is less than minimum ' + schema.minimum });
        }
        if (schema.maximum !== undefined && value > schema.maximum) {
          errors.push({ path: path || '/', message: 'Value ' + value + ' is greater than maximum ' + schema.maximum });
        }
        if (schema.type === 'integer' && value !== Math.floor(value)) {
          errors.push({ path: path || '/', message: 'Expected integer, got floating point' });
        }
      }

      // Object validation
      if (schema.type === 'object' && typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Required properties
        if (schema.required) {
          schema.required.forEach(function (key) {
            if (!(key in value)) {
              errors.push({ path: path + '/' + key, message: 'Required property "' + key + '" is missing' });
            }
          });
        }

        // Property count (minProperties / maxProperties)
        var propCount = Object.keys(value).length;
        if (schema.minProperties !== undefined && propCount < schema.minProperties) {
          errors.push({ path: path || '/', message: 'Object has ' + propCount + ' properties, minimum is ' + schema.minProperties });
        }
        if (schema.maxProperties !== undefined && propCount > schema.maxProperties) {
          errors.push({ path: path || '/', message: 'Object has ' + propCount + ' properties, maximum is ' + schema.maxProperties });
        }

        // Validate known properties
        if (schema.properties) {
          var self = this;
          Object.keys(value).forEach(function (key) {
            if (schema.properties[key]) {
              var subErrors = self._validateAgainstSchema(value[key], schema.properties[key], path + '/' + key);
              errors = errors.concat(subErrors);
            } else if (schema.additionalProperties === false) {
              errors.push({ path: path + '/' + key, message: 'Additional property "' + key + '" is not allowed' });
            } else if (schema.additionalProperties && typeof schema.additionalProperties === 'object') {
              var subErrors2 = self._validateAgainstSchema(value[key], schema.additionalProperties, path + '/' + key);
              errors = errors.concat(subErrors2);
            }
          });
        } else if (schema.additionalProperties && typeof schema.additionalProperties === 'object') {
          var self2 = this;
          Object.keys(value).forEach(function (key) {
            var subErrors3 = self2._validateAgainstSchema(value[key], schema.additionalProperties, path + '/' + key);
            errors = errors.concat(subErrors3);
          });
        }
      }

      // Array validation
      if (schema.type === 'array' && Array.isArray(value)) {
        if (schema.items) {
          var self3 = this;
          value.forEach(function (item, index) {
            var subErrors4 = self3._validateAgainstSchema(item, schema.items, path + '[' + index + ']');
            errors = errors.concat(subErrors4);
          });
        }
      }

      return errors;
    }

    /**
     * Check if a value matches a JSON Schema type.
     * @private
     */
    _checkType(value, type) {
      switch (type) {
        case 'string': return typeof value === 'string';
        case 'number': return typeof value === 'number' && isFinite(value);
        case 'integer': return typeof value === 'number' && isFinite(value) && value === Math.floor(value);
        case 'boolean': return typeof value === 'boolean';
        case 'object': return typeof value === 'object' && value !== null && !Array.isArray(value);
        case 'array': return Array.isArray(value);
        case 'null': return value === null;
        default: return true;
      }
    }

    /**
     * Get the JSON Schema type name for a value.
     * @private
     */
    _getType(value) {
      if (value === null) return 'null';
      if (Array.isArray(value)) return 'array';
      return typeof value;
    }

    /**
     * Basic URI validation.
     * @private
     */
    _isValidUrl(str) {
      try {
        var url = new URL(str);
        return url.protocol === 'http:' || url.protocol === 'https:';
      } catch (e) {
        return false;
      }
    }
  }

  // ---------------------------------------------------------------------------
  // Custom Error Types
  // ---------------------------------------------------------------------------

  class ConfigFetchError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.name = 'ConfigFetchError';
      this.statusCode = statusCode;
    }
  }

  class ConfigValidationError extends Error {
    constructor(message, errors) {
      super(message);
      this.name = 'ConfigValidationError';
      this.validationErrors = errors;
    }
  }

  // ---------------------------------------------------------------------------
  // DeepLinkParser — reads and sanitizes deep link state from URL and DOM
  // ---------------------------------------------------------------------------

  class DeepLinkParser {
    /**
     * Parse deep link state from URL query parameters and container data attributes.
     * URL params take priority over data attributes. All values are sanitized.
     * Tab/item references are validated against config; invalid refs fall back to defaults.
     *
     * @param {HTMLElement} container - The widget container element
     * @param {Object} config - The validated widget configuration
     * @returns {{ tab: string|null, item: string|null, view: string|null, prompt: string|null }}
     */
    parse(container, config) {
      var urlParams = this._readUrlParams();
      var dataAttrs = this._readDataAttributes(container);
      var merged = this._mergeWithPriority(urlParams, dataAttrs);
      var state = this._validateAgainstConfig(merged, config);
      return state;
    }

    /**
     * Read deep link parameters from the current URL query string.
     * @returns {{ tab: string|null, item: string|null, view: string|null, prompt: string|null }}
     */
    _readUrlParams() {
      var params = { tab: null, item: null, view: null, prompt: null };

      if (typeof window === 'undefined' || !window.location || !window.location.search) {
        return params;
      }

      var searchParams;
      try {
        searchParams = new URLSearchParams(window.location.search);
      } catch (e) {
        return params;
      }

      var tab = searchParams.get('tab');
      var item = searchParams.get('item');
      var view = searchParams.get('view');
      var prompt = searchParams.get('prompt');

      if (tab !== null) params.tab = this._sanitize(tab);
      if (item !== null) params.item = this._sanitize(item);
      if (view !== null) params.view = this._sanitize(view);
      if (prompt !== null) params.prompt = this._sanitize(prompt);

      return params;
    }

    /**
     * Read deep link parameters from HTML data attributes on the container element.
     * @param {HTMLElement} container - The widget container element
     * @returns {{ tab: string|null, item: string|null }}
     */
    _readDataAttributes(container) {
      var attrs = { tab: null, item: null };

      if (!container || typeof container.getAttribute !== 'function') {
        return attrs;
      }

      var tab = container.getAttribute('data-initial-tab');
      var item = container.getAttribute('data-initial-item');

      if (tab !== null) attrs.tab = this._sanitize(tab);
      if (item !== null) attrs.item = this._sanitize(item);

      return attrs;
    }

    /**
     * Sanitize a deep link parameter value.
     * - URL-decodes the value
     * - Strips HTML tags
     * - Strips characters outside alphanumeric, hyphen, underscore, dot, tilde, and URL-safe set
     * - Limits to 200 characters
     *
     * @param {string} value - Raw parameter value
     * @returns {string} Sanitized value
     */
    _sanitize(value) {
      if (value === null || value === undefined) {
        return '';
      }

      var decoded = value;
      try {
        decoded = decodeURIComponent(String(value));
      } catch (e) {
        // If decoding fails, use the raw value
        decoded = String(value);
      }

      // Strip HTML tags
      decoded = decoded.replace(/<[^>]*>/g, '');

      // Strip characters outside alphanumeric, hyphen, underscore, dot, space, tilde, and common URL-safe chars
      decoded = decoded.replace(/[^a-zA-Z0-9\-_.~ ]/g, '');

      // Limit to 200 characters
      if (decoded.length > 200) {
        decoded = decoded.substring(0, 200);
      }

      return decoded;
    }

    /**
     * Merge URL params and data attributes, with URL params taking priority.
     * @param {{ tab: string|null, item: string|null, view: string|null, prompt: string|null }} urlParams
     * @param {{ tab: string|null, item: string|null }} dataAttrs
     * @returns {{ tab: string|null, item: string|null, view: string|null, prompt: string|null }}
     */
    _mergeWithPriority(urlParams, dataAttrs) {
      return {
        tab: urlParams.tab !== null ? urlParams.tab : (dataAttrs.tab || null),
        item: urlParams.item !== null ? urlParams.item : (dataAttrs.item || null),
        view: urlParams.view || null,
        prompt: urlParams.prompt || null
      };
    }

    /**
     * Validate tab/item references against config. Falls back to defaults for invalid refs.
     * Truncates prompt to 500 characters.
     *
     * @param {{ tab: string|null, item: string|null, view: string|null, prompt: string|null }} state
     * @param {Object} config - The validated widget configuration
     * @returns {{ tab: string|null, item: string|null, view: string|null, prompt: string|null }}
     */
    _validateAgainstConfig(state, config) {
      var result = { tab: null, item: null, view: state.view, prompt: state.prompt };

      // Determine available tab IDs from config navigation
      var navigation = (config && config.navigation) ? config.navigation : {};
      var tabIds = Object.keys(navigation);
      var defaultTab = tabIds.length > 0 ? tabIds[0] : null;
      var chatEnabled = !!(config && config.chatEnabled);

      // If chatEnabled is false, reject any deep link targeting the chat view
      // or a chat-type tab, falling back to the default tab (Requirement 4.9)
      var requestedTab = state.tab;
      if (requestedTab && navigation[requestedTab] && navigation[requestedTab].type === 'chat' && !chatEnabled) {
        console.warn('[QuickSuite] Deep link targets chat tab "' + requestedTab + '" but chat is disabled; falling back to default.');
        requestedTab = null;
      }
      if (state.view === 'chat' && !chatEnabled) {
        console.warn('[QuickSuite] Deep link view=chat but chat is disabled; falling back to default.');
        result.view = null;
        result.prompt = null;
      }

      // Validate tab reference
      if (requestedTab && tabIds.indexOf(requestedTab) !== -1) {
        result.tab = requestedTab;
      } else {
        if (requestedTab) {
          console.warn('[QuickSuite] Deep link tab "' + requestedTab + '" not found in config; falling back to default.');
        }
        result.tab = defaultTab;
      }

      // Validate item reference within the resolved tab
      if (result.tab && navigation[result.tab]) {
        var tabConfig = navigation[result.tab];
        var subItems = tabConfig.subItems || [];
        var subItemIds = subItems.map(function (si) { return si.id; });
        var defaultItem = subItemIds.length > 0 ? subItemIds[0] : null;

        if (state.item && subItemIds.indexOf(state.item) !== -1) {
          result.item = state.item;
        } else {
          if (state.item) {
            console.warn('[QuickSuite] Deep link item "' + state.item + '" not found in tab "' + result.tab + '"; falling back to default.');
          }
          result.item = defaultItem;
        }
      }

      // Truncate prompt to 500 characters
      if (result.prompt && result.prompt.length > 500) {
        result.prompt = result.prompt.substring(0, 500);
      }

      return result;
    }
  }

  // ---------------------------------------------------------------------------
  // AuthManager — Cognito Hosted UI login + id-token handling (per-user auth)
  // ---------------------------------------------------------------------------

  /**
   * Manages end-user authentication against a Cognito User Pool using the
   * Hosted UI implicit OAuth flow. When the widget config includes an `auth`
   * block, unauthenticated visitors are redirected to the Hosted UI to log in;
   * on return, the id token in the URL fragment is captured and sent as a
   * Bearer token on backend embed requests, so the backend embeds each viewer
   * as their own registered QuickSight identity.
   *
   * When no `auth` block is configured the AuthManager is inert (no login is
   * required) — supporting anonymous/shared-identity deployments.
   */
  class AuthManager {
    /**
     * @param {Object|null} authConfig - config.auth, or null/undefined to disable auth
     */
    constructor(authConfig) {
      this._cfg = authConfig || null;
      this._storageKey = 'qs_id_token';
    }

    /** @returns {boolean} whether Cognito auth is configured for this widget */
    isEnabled() {
      return !!(this._cfg && this._cfg.userPoolDomain && this._cfg.clientId);
    }

    /**
     * Capture an id token returned in the URL fragment after a Hosted UI
     * redirect (implicit flow), persist it, and strip it from the address bar.
     */
    captureTokenFromRedirect() {
      if (!this.isEnabled()) return;
      if (typeof window === 'undefined' || !window.location) return;
      var hash = window.location.hash || '';
      if (hash.indexOf('id_token=') === -1) return;

      var params = {};
      hash.replace(/^#/, '').split('&').forEach(function (pair) {
        var kv = pair.split('=');
        if (kv.length === 2) params[decodeURIComponent(kv[0])] = decodeURIComponent(kv[1]);
      });

      if (params.id_token) {
        try {
          sessionStorage.setItem(this._storageKey, params.id_token);
        } catch (e) {
          console.warn('[QuickSuite] Unable to persist auth token.');
        }
        // Remove the token fragment from the URL so it is not left in history.
        try {
          var clean = window.location.pathname + window.location.search;
          window.history.replaceState({}, document.title, clean);
        } catch (e) { /* non-fatal */ }
      }
    }

    /** @returns {string|null} the stored id token, or null */
    getIdToken() {
      try {
        return sessionStorage.getItem(this._storageKey);
      } catch (e) {
        return null;
      }
    }

    /** @returns {boolean} true if a non-expired id token is stored */
    isAuthenticated() {
      if (!this.isEnabled()) return true; // auth not required
      var token = this.getIdToken();
      if (!token) return false;
      var payload = this._decodeJwt(token);
      if (!payload || !payload.exp) return false;
      // exp is in seconds; add a small skew buffer
      return (payload.exp * 1000) > (Date.now() + 5000);
    }

    /** Redirect the browser to the Cognito Hosted UI login page (implicit flow). */
    login() {
      if (!this.isEnabled() || typeof window === 'undefined') return;
      var scopes = (this._cfg.scopes && this._cfg.scopes.length)
        ? this._cfg.scopes.join('+')
        : 'openid+email+profile';
      var redirectUri = this._cfg.redirectUri || (window.location.origin + window.location.pathname);
      var url = this._normalizeDomain() +
        '/oauth2/authorize' +
        '?response_type=token' +
        '&client_id=' + encodeURIComponent(this._cfg.clientId) +
        '&redirect_uri=' + encodeURIComponent(redirectUri) +
        '&scope=' + scopes;
      window.location.assign(url);
    }

    /** Clear the local token and redirect to the Hosted UI logout endpoint. */
    logout() {
      try { sessionStorage.removeItem(this._storageKey); } catch (e) { /* ignore */ }
      if (!this.isEnabled() || typeof window === 'undefined') return;
      var logoutUri = this._cfg.logoutUri || (window.location.origin + window.location.pathname);
      var url = this._normalizeDomain() +
        '/logout' +
        '?client_id=' + encodeURIComponent(this._cfg.clientId) +
        '&logout_uri=' + encodeURIComponent(logoutUri);
      window.location.assign(url);
    }

    /** @private normalize the configured domain into an https origin (no trailing slash) */
    _normalizeDomain() {
      var d = String(this._cfg.userPoolDomain || '').replace(/\/$/, '');
      if (d.indexOf('http://') === 0 || d.indexOf('https://') === 0) return d;
      return 'https://' + d;
    }

    /** @private decode a JWT payload without verifying the signature (client-side, display/expiry only) */
    _decodeJwt(token) {
      try {
        var parts = token.split('.');
        if (parts.length < 2) return null;
        var b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        var json = decodeURIComponent(
          atob(b64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join('')
        );
        return JSON.parse(json);
      } catch (e) {
        return null;
      }
    }
  }

  // ---------------------------------------------------------------------------
  // WidgetInitializer — orchestrates initialization
  // ---------------------------------------------------------------------------

  class WidgetInitializer {
    constructor() {
      this._config = null;
      this._container = null;
      this._configLoader = new ConfigLoader();
      this._errorHandler = new ErrorHandler();
      this._deepLinkParser = new DeepLinkParser();
      this._navRenderer = null;
      this._embedManager = null;
      this._deepLinkState = null;
      this._authManager = null;
      this._chatBubble = null;
      this._filterBar = null;
    }

    /**
     * First navigation tab that is not a chat tab (chat is a bubble, not a tab).
     * @private
     * @returns {string|null}
     */
    _firstDashboardTabId() {
      var navigation = this._config.navigation || {};
      var tabIds = Object.keys(navigation);
      for (var i = 0; i < tabIds.length; i++) {
        if (navigation[tabIds[i]].type !== 'chat') {
          return tabIds[i];
        }
      }
      return null;
    }

    /**
     * Start the widget initialization process.
     * Called at DOMContentLoaded or when the script loads.
     */
    async init() {
      try {
        // Step 1: Detect the container element
        this._container = await this._detectContainer();
        if (!this._container) {
          return; // Warning already logged
        }

        // Step 2: Resolve config.json URL relative to this script
        var configUrl = this._resolveConfigUrl();

        // Step 3: Load and validate configuration
        this._showLoadingScreen();
        this._config = await this._configLoader.load(configUrl);

        // Step 3b: Authentication gate (per-user Cognito login).
        // If auth is configured: capture any token returned from the Hosted UI
        // redirect, and if the user is not authenticated, send them to log in.
        this._authManager = new AuthManager(this._config.auth);
        this._authManager.captureTokenFromRedirect();
        if (this._authManager.isEnabled() && !this._authManager.isAuthenticated()) {
          console.log('[QuickSuite] Not authenticated; redirecting to login.');
          this._authManager.login();
          return; // navigation away; stop initialization
        }

        // Step 4: Parse deep link state (URL params + data attributes)
        this._deepLinkState = this._deepLinkParser.parse(this._container, this._config);

        // Step 5: Render navigation
        var self = this;
        this._navRenderer = new NavigationRenderer({
          container: this._container,
          config: this._config,
          onTabChange: function (tabId) { self._handleTabChange(tabId); },
          onSubItemChange: function (itemId) { self._handleSubItemChange(itemId); },
          onBreakpointChange: function () { self._handleBreakpointChange(); }
        });
        this._navRenderer.render();

        // Step 6: Initialize the embedding SDK context
        this._embedManager = new EmbedManager(this._config, this._container, this._errorHandler, this._authManager);
        await this._embedManager.init();

        // Step 6b: App-level filter bar. The widget renders its own filter bar
        // (below the navigation) in the widget-driven layout. In host-driven /
        // split-pane layouts (container marked data-no-chat-bubble) the host
        // page renders its own filter bar, so it is skipped here to avoid two.
        var hostDriven = this._container && this._container.hasAttribute('data-no-chat-bubble');
        if (!hostDriven && this._config.filters && this._config.filters.length) {
          var selF = this;
          this._filterBar = new FilterBar({
            container: this._container,
            config: this._config,
            getFrame: function () { return selF._embedManager.getDashboardFrame(); },
            getSheetId: function () { return selF._embedManager.getCurrentSheetId(); }
          });
          this._filterBar.mount();
        }

        // Step 6c: Chat panel. Mounted BEFORE the (slower) dashboard embed so it
        // appears immediately and its own embed loads in parallel — rather than
        // popping in several seconds after the dashboard. Skipped when the host
        // marks the container data-no-chat-bubble (split-pane handles chat).
        var noBubble = this._container && this._container.hasAttribute('data-no-chat-bubble');
        if (this._config.chatEnabled && !noBubble) {
          var self2 = this;
          var chatNav = this._config.navigation || {};
          var chatTabId = this._findChatTabId();
          var chatTitle = (chatTabId && chatNav[chatTabId] && chatNav[chatTabId].label) ? chatNav[chatTabId].label : 'Ask Analytics';
          this._chatBubble = new ChatBubble({
            container: this._container,
            config: this._config,
            title: chatTitle,
            onFirstOpen: function (panelInner, prompt) {
              return self2._embedManager.embedChatInto(panelInner, prompt);
            }
          });
          this._chatBubble.mount();
          // Auto-open beside the dashboard on desktop so the assistant is
          // immediately available. On narrow/mobile viewports the panel is
          // full-screen, so leave it as a launcher to avoid covering the dashboard.
          var isNarrow = (typeof window !== 'undefined' && window.innerWidth <= 768);
          if (!isNarrow) {
            var dlPrompt = (this._deepLinkState.view === 'chat') ? this._deepLinkState.prompt : null;
            this._chatBubble.open(dlPrompt);
          }
        }

        // Step 7: Resolve the initial dashboard tab. Chat is a floating bubble,
        // not a tab, so the active tab is always a dashboard tab.
        var navCfg = this._config.navigation || {};
        var initialTab = this._deepLinkState.tab;
        if (!initialTab || !navCfg[initialTab] || navCfg[initialTab].type === 'chat') {
          initialTab = this._firstDashboardTabId();
        }

        if (initialTab) {
          this._navRenderer.setActiveTab(initialTab, this._deepLinkState.item);
          await this._loadActiveView();
        } else {
          console.warn('[QuickSuite] No dashboard navigation tabs configured; nothing to render.');
        }

        // (The chat panel is mounted earlier, in Step 6c, so it appears without
        // waiting for the dashboard embed.)

        console.log('[QuickSuite] Widget initialized successfully.');

      } catch (err) {
        this._handleInitError(err);
      }
    }

    /**
     * Get the current embedded dashboard frame for host-page integration.
     * Use this to call setParameters(), setFilterValues(), etc.
     * @returns {object|null}
     */
    getDashboardFrame() {
      if (this._embedManager) {
        return this._embedManager.getDashboardFrame();
      }
      return null;
    }

    /**
     * Embed chat into an external container (for split-pane layouts).
     * Resilient to init timing: if the widget is still initializing when the
     * host page calls this, it waits (up to ~15s) for the embed manager
     * instead of silently doing nothing.
     * @param {HTMLElement} el - Target container
     * @param {string} [prompt] - Optional initial prompt
     * @returns {Promise<void>}
     */
    embedChatInto(el, prompt) {
      var self = this;
      if (this._embedManager) {
        return this._embedManager.embedChatInto(el, prompt);
      }
      return new Promise(function (resolve, reject) {
        var waited = 0;
        var timer = setInterval(function () {
          if (self._embedManager) {
            clearInterval(timer);
            resolve(self._embedManager.embedChatInto(el, prompt));
            return;
          }
          waited += 250;
          if (waited >= 15000) {
            clearInterval(timer);
            reject(new Error('[QuickSuite] Widget not initialized; cannot embed chat.'));
          }
        }, 250);
      });
    }

    /**
     * Show the branded loading/splash screen during initialization, honoring
     * the config's loadingScreen flag (Requirement 11.7). Capped at 5 seconds —
     * it is cleared as soon as the first view finishes loading.
     * @private
     */
    _showLoadingScreen() {
      if (this._config && this._config.loadingScreen === false) return;
      this._errorHandler.showLoading(this._container, 'Loading…');
    }

    /**
     * Load whichever view (dashboard sub-item or chat) is currently active
     * according to the navigation renderer and deep link state.
     * @private
     */
    async _loadActiveView() {
      var tabId = this._navRenderer.getActiveTab();
      if (!tabId) return;
      var tabConfig = this._config.navigation[tabId];
      if (!tabConfig) return;

      if (tabConfig.type === 'chat') {
        var prompt = (this._deepLinkState && this._deepLinkState.view === 'chat') ? this._deepLinkState.prompt : null;
        await this._embedManager.loadChat(prompt);
        return;
      }

      var subItemId = this._navRenderer.getActiveSubItem();
      var subItems = tabConfig.subItems || [];
      var subItem = subItems.filter(function (si) { return si.id === subItemId; })[0] || subItems[0];
      if (!subItem) {
        console.warn('[QuickSuite] Tab "' + tabId + '" has no sub-items to display.');
        return;
      }

      // Render the filter controls immediately (they are config-driven and do
      // not depend on the dashboard iframe), so the filter bar paints with the
      // navigation instead of only after the embed finishes loading.
      if (this._filterBar) this._filterBar.renderFor(subItem);

      await this._embedManager.loadDashboard(subItem.dashboardId, subItem.sheetId);

      // Now that the dashboard frame exists, apply the current selections to it
      // (scoped to this sheet). A no-op initially when nothing is selected.
      if (this._filterBar) this._filterBar.reconcile();

      // If the deep link included a chat prompt for a later chat visit, it is
      // consumed the first time the chat tab actually loads (see _handleTabChange).
    }

    /**
     * Handle a top-level navigation tab change triggered by the user.
     * @private
     */
    async _handleTabChange(tabId) {
      try {
        await this._loadActiveView();
      } catch (err) {
        console.error('[QuickSuite] Failed to load tab "' + tabId + '":', err.message);
      }
    }

    /**
     * Handle a secondary sub-navigation change triggered by the user.
     * @private
     */
    async _handleSubItemChange(itemId) {
      try {
        await this._loadActiveView();
      } catch (err) {
        console.error('[QuickSuite] Failed to load item "' + itemId + '":', err.message);
      }
    }

    /**
     * Handle the viewport crossing the mobile/desktop breakpoint: reload the
     * current view so the appropriate mobile/desktop sheet ID is used (Requirement 7.5).
     * @private
     */
    async _handleBreakpointChange() {
      try {
        await this._loadActiveView();
      } catch (err) {
        console.error('[QuickSuite] Failed to reload view after breakpoint change:', err.message);
      }
    }

    /**
     * Detect the container element. If not present at call time,
     * observe the DOM via MutationObserver for up to 10 seconds.
     * @private
     * @returns {Promise<HTMLElement|null>}
     */
    _detectContainer() {
      var containerId = 'quicksuite-widget-container'; // default

      // Check if container exists immediately
      var element = document.getElementById(containerId);
      if (element) {
        return Promise.resolve(element);
      }

      // Not found — observe DOM for up to 10 seconds
      return new Promise(function (resolve) {
        var timeoutMs = 10000;
        var observer = null;
        var timeoutId = null;

        function cleanup() {
          if (observer) {
            observer.disconnect();
            observer = null;
          }
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }
        }

        observer = new MutationObserver(function () {
          var el = document.getElementById(containerId);
          if (el) {
            cleanup();
            resolve(el);
          }
        });

        observer.observe(document.documentElement, {
          childList: true,
          subtree: true
        });

        timeoutId = setTimeout(function () {
          cleanup();
          console.warn(
            '[QuickSuite] Container element with ID "' + containerId +
            '" not found within 10 seconds. Widget initialization aborted.'
          );
          resolve(null);
        }, timeoutMs);

        // One more check in case it appeared between getElementById and observer setup
        var recheckEl = document.getElementById(containerId);
        if (recheckEl) {
          cleanup();
          resolve(recheckEl);
        }
      });
    }

    /**
     * Find the first navigation tab of type "chat", if one exists.
     * @private
     * @returns {string|null}
     */
    _findChatTabId() {
      var navigation = this._config.navigation || {};
      var tabIds = Object.keys(navigation);
      for (var i = 0; i < tabIds.length; i++) {
        if (navigation[tabIds[i]].type === 'chat') {
          return tabIds[i];
        }
      }
      return null;
    }

    /**
     * Resolve config.json URL relative to the script's own URL.
     * @private
     * @returns {string}
     */
    _resolveConfigUrl() {
      var scriptUrl = '';
      if (document.currentScript) {
        scriptUrl = document.currentScript.src;
      } else {
        // Fallback: find the script tag by scanning all scripts
        var scripts = document.querySelectorAll('script[src]');
        for (var i = scripts.length - 1; i >= 0; i--) {
          if (scripts[i].src.indexOf('quicksuite-widget') !== -1) {
            scriptUrl = scripts[i].src;
            break;
          }
        }
      }

      var baseUrl = scriptUrl.substring(0, scriptUrl.lastIndexOf('/') + 1);
      return baseUrl + 'config.json';
    }

    /**
     * Handle initialization errors by displaying inline messages.
     * @private
     */
    _handleInitError(err) {
      this._errorHandler.clear(this._container);
      if (err instanceof ConfigFetchError) {
        this._showInlineError('Configuration could not be loaded.');
      } else if (err instanceof ConfigValidationError) {
        this._showInlineError('Configuration is invalid. Check the browser console for details.');
      } else {
        console.error('[QuickSuite] Initialization error:', err.message);
        this._showInlineError('Widget initialization failed.');
      }
    }

    /**
     * Display an inline error message within the container div.
     * @private
     */
    _showInlineError(message) {
      if (!this._container) {
        console.error('[QuickSuite] ' + message);
        return;
      }

      var errorDiv = document.createElement('div');
      errorDiv.setAttribute('role', 'alert');
      errorDiv.setAttribute('aria-live', 'assertive');
      errorDiv.style.cssText =
        'padding: 16px; margin: 8px; border: 1px solid #dc2626; ' +
        'border-radius: 4px; background-color: #fef2f2; color: #991b1b; ' +
        'font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; ' +
        'font-size: 14px; line-height: 1.5;';
      errorDiv.textContent = message;
      this._container.appendChild(errorDiv);
    }
  }

  // ---------------------------------------------------------------------------
  // NavigationRenderer — renders navigation tabs and sub-navigation
  // ---------------------------------------------------------------------------

  class NavigationRenderer {
    /**
     * @param {Object} options
     * @param {HTMLElement} options.container - The widget container element
     * @param {Object} options.config - Validated widget configuration
     * @param {Function} options.onTabChange - Callback when a tab is selected
     * @param {Function} options.onSubItemChange - Callback when a sub-item is selected
     */
    constructor({ container, config, onTabChange, onSubItemChange, onBreakpointChange }) {
      this._container = container;
      this._config = config;
      this._onTabChange = onTabChange || function () {};
      this._onSubItemChange = onSubItemChange || function () {};
      this._onBreakpointChange = onBreakpointChange || function () {};
      this._activeTab = null;
      this._activeSubItem = null;
      this._navElement = null;
      this._subNavElement = null;
      this._wasMobile = this._isMobile();

      // Bind resize handler
      this._handleResizeBound = this._handleResize.bind(this);
      window.addEventListener('resize', this._handleResizeBound);
    }

    /**
     * @returns {string|null} The currently active tab ID
     */
    getActiveTab() {
      return this._activeTab;
    }

    /**
     * @returns {string|null} The currently active sub-item ID
     */
    getActiveSubItem() {
      return this._activeSubItem;
    }

    /**
     * Render the full navigation (header + tabs + sub-nav).
     */
    render() {
      // Remove existing nav if re-rendering
      if (this._navElement) {
        this._navElement.remove();
      }
      if (this._subNavElement) {
        this._subNavElement.remove();
      }

      var branding = this._config.branding || {};
      var primaryColor = this._isValidHex(branding.primaryColor) ? branding.primaryColor : '#6B7280';
      var secondaryColor = this._isValidHex(branding.secondaryColor) ? branding.secondaryColor : '#3B82F6';

      // Set CSS custom properties on the container for scoped branding
      this._container.style.setProperty('--qs-primary', primaryColor);
      this._container.style.setProperty('--qs-secondary', secondaryColor);

      // Create navigation wrapper
      this._navElement = document.createElement('div');
      this._navElement.className = 'qs-nav';

      // Inject scoped styles
      var styleEl = document.createElement('style');
      styleEl.textContent = this._getScopedStyles();
      this._navElement.appendChild(styleEl);

      // Render logo + tabs header
      var headerEl = document.createElement('div');
      headerEl.className = 'qs-nav-header';
      headerEl.style.cssText = 'display:flex;align-items:center;background-color:' + primaryColor + ';padding:0 16px;min-height:48px;';

      // Logo
      if (branding.logoUrl) {
        var logoImg = document.createElement('img');
        logoImg.className = 'qs-nav-logo';
        logoImg.src = branding.logoUrl;
        logoImg.alt = 'Logo';
        logoImg.style.cssText = 'max-height:40px;width:auto;margin-right:16px;';
        logoImg.onerror = function () {
          logoImg.style.display = 'none';
        };
        headerEl.appendChild(logoImg);
      }

      // Tabs container
      var tabsContainer = document.createElement('div');
      tabsContainer.className = 'qs-nav-tabs';
      tabsContainer.style.cssText = 'display:flex;flex:1;overflow-x:auto;gap:4px;';

      this._renderTabs(tabsContainer, primaryColor, secondaryColor);
      headerEl.appendChild(tabsContainer);
      this._navElement.appendChild(headerEl);

      // Insert nav at the top of the container
      this._container.insertBefore(this._navElement, this._container.firstChild);

      // Render sub-nav for active tab
      if (this._activeTab) {
        this._renderSubNav(this._activeTab);
      }
    }

    /**
     * Set the active tab and update UI.
     * @param {string} tabId - The tab key to activate
     * @param {string} [initialSubItemId] - Optional sub-item ID to activate instead of the default (used for deep links)
     */
    setActiveTab(tabId, initialSubItemId) {
      if (!this._config.navigation || !this._config.navigation[tabId]) {
        return;
      }
      this._activeTab = tabId;
      this._activeSubItem = null;

      // Update tab active states
      this._updateTabActiveStates();

      // Render sub-nav for new tab
      this._renderSubNav(tabId);

      // Set default (or requested) sub-item if applicable
      var tabConfig = this._config.navigation[tabId];
      if (tabConfig.subItems && tabConfig.subItems.length > 0) {
        var subItemIds = tabConfig.subItems.map(function (si) { return si.id; });
        this._activeSubItem = (initialSubItemId && subItemIds.indexOf(initialSubItemId) !== -1)
          ? initialSubItemId
          : tabConfig.subItems[0].id;
        this._updateSubNavActiveStates();
      }
    }

    /**
     * Set the active sub-item and update UI.
     * @param {string} itemId - The sub-item ID to activate
     */
    setActiveSubItem(itemId) {
      this._activeSubItem = itemId;
      this._updateSubNavActiveStates();
    }

    /**
     * Render tab buttons into the given container.
     * @private
     */
    _renderTabs(tabsContainer, primaryColor, secondaryColor) {
      var self = this;
      var navigation = this._config.navigation || {};
      var tabKeys = Object.keys(navigation);
      var mobile = this._isMobile();

      tabKeys.forEach(function (tabId) {
        var tabConfig = navigation[tabId];

        // Skip hidden tabs
        if (tabConfig.hidden) {
          return;
        }

        // Chat is presented as a floating bubble, not a top-nav tab, so
        // chat-type entries never render in the tab bar.
        if (tabConfig.type === 'chat') {
          return;
        }

        var tabBtn = document.createElement('button');
        tabBtn.className = 'qs-nav-tab';
        tabBtn.setAttribute('data-tab-id', tabId);
        tabBtn.setAttribute('role', 'tab');
        tabBtn.setAttribute('aria-selected', tabId === self._activeTab ? 'true' : 'false');

        // Label (truncate to 40 chars)
        var label = (tabConfig.label || '').substring(0, 40);

        if (mobile) {
          // Mobile: icon-only or abbreviated labels
          if (tabConfig.icon) {
            tabBtn.textContent = tabConfig.icon;
            tabBtn.setAttribute('title', label);
            tabBtn.setAttribute('aria-label', label);
          } else {
            // Abbreviated: first 3 chars
            tabBtn.textContent = label.substring(0, 3);
            tabBtn.setAttribute('title', label);
            tabBtn.setAttribute('aria-label', label);
          }
        } else {
          // Desktop: show icon + full label
          var content = '';
          if (tabConfig.icon) {
            content = tabConfig.icon + ' ';
          }
          content += label;
          tabBtn.textContent = content;
        }

        // Styling
        var isActive = tabId === self._activeTab;
        tabBtn.style.cssText = 'border:none;cursor:pointer;padding:8px 16px;font-size:14px;font-family:inherit;border-radius:4px 4px 0 0;transition:background-color 0.2s;' +
          'background-color:' + (isActive ? secondaryColor : 'transparent') + ';' +
          'color:' + (isActive ? '#ffffff' : 'rgba(255,255,255,0.8)') + ';' +
          'font-weight:' + (isActive ? '600' : '400') + ';white-space:nowrap;';

        tabBtn.addEventListener('click', function () {
          self.setActiveTab(tabId);
          self._onTabChange(tabId);
        });

        tabsContainer.appendChild(tabBtn);
      });
    }

    /**
     * Render secondary sub-navigation for a tab.
     * @param {string} tabId - The tab key to render sub-nav for
     * @private
     */
    _renderSubNav(tabId) {
      // Remove existing sub-nav
      if (this._subNavElement) {
        this._subNavElement.remove();
        this._subNavElement = null;
      }

      var navigation = this._config.navigation || {};
      var tabConfig = navigation[tabId];
      if (!tabConfig || !tabConfig.subItems) {
        return;
      }

      // Only show sub-nav when tab has 2+ sub-items
      if (tabConfig.subItems.length < 2) {
        return;
      }

      // On mobile, respect mobileShowSubNav setting
      if (this._isMobile() && tabConfig.mobileShowSubNav === false) {
        return;
      }

      var branding = this._config.branding || {};
      var secondaryColor = this._isValidHex(branding.secondaryColor) ? branding.secondaryColor : '#3B82F6';

      this._subNavElement = document.createElement('div');
      this._subNavElement.className = 'qs-sub-nav';
      this._subNavElement.style.cssText = 'display:flex;gap:4px;padding:4px 16px;background-color:#f3f4f6;border-bottom:1px solid #e5e7eb;overflow-x:auto;';
      this._subNavElement.setAttribute('role', 'tablist');
      this._subNavElement.setAttribute('aria-label', 'Sub-navigation');

      var self = this;
      tabConfig.subItems.forEach(function (item) {
        var itemBtn = document.createElement('button');
        itemBtn.className = 'qs-sub-nav-item';
        itemBtn.setAttribute('data-item-id', item.id);
        itemBtn.setAttribute('role', 'tab');
        itemBtn.setAttribute('aria-selected', item.id === self._activeSubItem ? 'true' : 'false');

        var itemLabel = (item.label || '').substring(0, 40);
        itemBtn.textContent = itemLabel;

        var isItemActive = item.id === self._activeSubItem;
        itemBtn.style.cssText = 'border:none;cursor:pointer;padding:6px 12px;font-size:13px;font-family:inherit;border-radius:4px;transition:background-color 0.2s;' +
          'background-color:' + (isItemActive ? secondaryColor : 'transparent') + ';' +
          'color:' + (isItemActive ? '#ffffff' : '#374151') + ';' +
          'font-weight:' + (isItemActive ? '600' : '400') + ';white-space:nowrap;';

        itemBtn.addEventListener('click', function () {
          self._activeSubItem = item.id;
          self._updateSubNavActiveStates();
          self._onSubItemChange(item.id);
        });

        self._subNavElement.appendChild(itemBtn);
      });

      // Insert after nav element
      if (this._navElement && this._navElement.nextSibling) {
        this._container.insertBefore(this._subNavElement, this._navElement.nextSibling);
      } else {
        this._container.appendChild(this._subNavElement);
      }
    }

    /**
     * Handle window resize — re-render if crossing the 768px breakpoint.
     * @private
     */
    _handleResize() {
      var isMobileNow = this._isMobile();
      if (isMobileNow !== this._wasMobile) {
        this._wasMobile = isMobileNow;
        this.render();

        // Restore active states after re-render
        if (this._activeTab) {
          this._updateTabActiveStates();
          this._renderSubNav(this._activeTab);
          if (this._activeSubItem) {
            this._updateSubNavActiveStates();
          }
        }

        // Notify caller so it can reload the dashboard using the sheet ID
        // appropriate for the new viewport classification (Requirement 7.5)
        this._onBreakpointChange(isMobileNow ? 'mobile' : 'desktop');
      }
    }

    /**
     * Returns true if viewport width is ≤768px.
     * @returns {boolean}
     * @private
     */
    _isMobile() {
      return window.innerWidth <= 768;
    }

    /**
     * Update visual active states on tab buttons.
     * @private
     */
    _updateTabActiveStates() {
      if (!this._navElement) return;

      var branding = this._config.branding || {};
      var secondaryColor = this._isValidHex(branding.secondaryColor) ? branding.secondaryColor : '#3B82F6';
      var self = this;

      var tabs = this._navElement.querySelectorAll('.qs-nav-tab');
      tabs.forEach(function (tab) {
        var tabId = tab.getAttribute('data-tab-id');
        var isActive = tabId === self._activeTab;
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        tab.style.backgroundColor = isActive ? secondaryColor : 'transparent';
        tab.style.color = isActive ? '#ffffff' : 'rgba(255,255,255,0.8)';
        tab.style.fontWeight = isActive ? '600' : '400';
        // On mobile the tab bar scrolls horizontally; keep the active tab in view.
        if (isActive && self._isMobile() && typeof tab.scrollIntoView === 'function') {
          try { tab.scrollIntoView({ inline: 'center', block: 'nearest' }); } catch (e) { /* non-fatal */ }
        }
      });
    }

    /**
     * Update visual active states on sub-nav buttons.
     * @private
     */
    _updateSubNavActiveStates() {
      if (!this._subNavElement) return;

      var branding = this._config.branding || {};
      var secondaryColor = this._isValidHex(branding.secondaryColor) ? branding.secondaryColor : '#3B82F6';
      var self = this;

      var items = this._subNavElement.querySelectorAll('.qs-sub-nav-item');
      items.forEach(function (item) {
        var itemId = item.getAttribute('data-item-id');
        var isActive = itemId === self._activeSubItem;
        item.setAttribute('aria-selected', isActive ? 'true' : 'false');
        item.style.backgroundColor = isActive ? secondaryColor : 'transparent';
        item.style.color = isActive ? '#ffffff' : '#374151';
        item.style.fontWeight = isActive ? '600' : '400';
      });
    }

    /**
     * Validate a hex color value.
     * @param {string} color
     * @returns {boolean}
     * @private
     */
    _isValidHex(color) {
      return typeof color === 'string' && /^#[0-9A-Fa-f]{6}$/.test(color);
    }

    /**
     * Generate scoped CSS styles for the navigation.
     * All styles are scoped via class selectors within the container.
     * @returns {string}
     * @private
     */
    _getScopedStyles() {
      return [
        '.qs-nav { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }',
        '.qs-nav-header { box-sizing: border-box; }',
        '.qs-nav-tabs { scrollbar-width: thin; }',
        '.qs-nav-tabs::-webkit-scrollbar { height: 4px; }',
        '.qs-nav-tabs::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 2px; }',
        '.qs-nav-tab:hover { opacity: 0.9; }',
        '.qs-nav-tab:focus { outline: 2px solid var(--qs-secondary, #3B82F6); outline-offset: 2px; }',
        '.qs-sub-nav { box-sizing: border-box; }',
        '.qs-sub-nav-item:hover { background-color: #e5e7eb !important; }',
        '.qs-sub-nav-item:focus { outline: 2px solid var(--qs-secondary, #3B82F6); outline-offset: 2px; }',
        '.qs-nav-logo { object-fit: contain; }'
      ].join('\n');
    }

    /**
     * Clean up event listeners.
     */
    destroy() {
      window.removeEventListener('resize', this._handleResizeBound);
      if (this._navElement) {
        this._navElement.remove();
      }
      if (this._subNavElement) {
        this._subNavElement.remove();
      }
    }
  }

  // ---------------------------------------------------------------------------
  // SessionCache — manages embed URL caching in sessionStorage
  // ---------------------------------------------------------------------------

  class SessionCache {
    /**
     * @param {number} expirationMinutes - Max age of cached entries in minutes
     */
    constructor(expirationMinutes) {
      this._expirationMinutes = expirationMinutes || 30;
      this._prefix = 'qs_embed_';
    }

    /**
     * Retrieve a cached embed URL if it exists and is not expired.
     * @param {string} cacheKey - Identifier (e.g., dashboardId)
     * @returns {string|null} The cached URL or null if missing/expired
     */
    get(cacheKey) {
      try {
        var raw = sessionStorage.getItem(this._prefix + cacheKey);
        if (!raw) return null;
        var entry = JSON.parse(raw);
        if (this._isExpired(entry)) {
          sessionStorage.removeItem(this._prefix + cacheKey);
          return null;
        }
        return entry.url;
      } catch (e) {
        // sessionStorage unavailable or corrupt entry
        return null;
      }
    }

    /**
     * Store an embed URL with current timestamp.
     * @param {string} cacheKey - Identifier (e.g., dashboardId)
     * @param {string} url - The embed URL to cache
     */
    set(cacheKey, url) {
      try {
        var entry = {
          url: url,
          timestamp: Date.now()
        };
        sessionStorage.setItem(this._prefix + cacheKey, JSON.stringify(entry));
      } catch (e) {
        // sessionStorage full or unavailable — silently fail
        console.warn('[QuickSuite] SessionCache: unable to write to sessionStorage.');
      }
    }

    /**
     * Remove all qs_embed_ entries from sessionStorage.
     */
    clear() {
      try {
        var keysToRemove = [];
        for (var i = 0; i < sessionStorage.length; i++) {
          var key = sessionStorage.key(i);
          if (key && key.indexOf(this._prefix) === 0) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(function (key) {
          sessionStorage.removeItem(key);
        });
      } catch (e) {
        // sessionStorage unavailable
      }
    }

    /**
     * Check if a cache entry has expired.
     * @private
     * @param {Object} entry - { url, timestamp }
     * @returns {boolean}
     */
    _isExpired(entry) {
      if (!entry || !entry.timestamp) return true;
      var ageMs = Date.now() - entry.timestamp;
      var maxAgeMs = this._expirationMinutes * 60 * 1000;
      return ageMs >= maxAgeMs;
    }
  }

  // ---------------------------------------------------------------------------
  // EmbedManager — orchestrates QuickSight Embedding SDK interactions
  // ---------------------------------------------------------------------------

  class EmbedManager {
    /**
     * @param {Object} config - Validated widget configuration
     * @param {HTMLElement} container - Widget container element
     */
    constructor(config, container, errorHandler, authManager) {
      this._config = config;
      this._container = container;
      this._embeddingContext = null;
      this._dashboardEmbed = null;
      this._chatEmbed = null;
      this._currentDashboardId = null;
      this._currentSheetId = null;
      this._sessionCache = new SessionCache(
        (config.session && config.session.expirationMinutes) || 30
      );
      this._embedContainer = null;
      this._errorHandler = errorHandler || new ErrorHandler();
      this._authManager = authManager || null;
    }

    /**
     * Initialize the QuickSight Embedding SDK context.
     * Must be called before loadDashboard or loadChat.
     * @returns {Promise<void>}
     */
    async init() {
      if (typeof QuickSightEmbedding !== 'undefined' && QuickSightEmbedding.createEmbeddingContext) {
        this._embeddingContext = await QuickSightEmbedding.createEmbeddingContext();
      } else if (typeof window !== 'undefined' && window.QuickSightEmbedding && window.QuickSightEmbedding.createEmbeddingContext) {
        this._embeddingContext = await window.QuickSightEmbedding.createEmbeddingContext();
      } else {
        console.warn('[QuickSuite] QuickSight Embedding SDK not found. Embedding will not be available.');
      }
      this._ensureEmbedContainer();
    }

    /**
     * Load and embed a dashboard.
     * Uses cache when available; for same-dashboard/different-sheet navigation,
     * uses SDK setSelectedSheetId without fetching a new URL.
    /**
     * Get the current dashboard embed frame for host-page SDK interactions
     * (setParameters, setFilterValues, etc.).
     * @returns {object|null} The dashboard experience object, or null if no dashboard is embedded
     */
    getDashboardFrame() {
      return this._dashboardEmbed || null;
    }

    /**
     * @returns {string|null} the currently displayed (resolved) sheet id, used
     * by the widget's FilterBar to scope filter groups to the active sheet.
     */
    getCurrentSheetId() {
      return this._currentSheetId || null;
    }

    /**
     * Load and embed a QuickSight dashboard.
     * @param {string} dashboardId - QuickSight dashboard ID
     * @param {string} sheetId - Sheet ID to display
     * @returns {Promise<void>}
     */
    async loadDashboard(dashboardId, sheetId) {
      var self = this;
      var resolvedDashboardId = this._isMobile()
        ? this._getMobileId('dashboardId', dashboardId) || dashboardId
        : dashboardId;
      var resolvedSheetId = this._isMobile()
        ? this._getMobileId('sheetId', sheetId) || sheetId
        : sheetId;

      // Same dashboard, different sheet — use SDK navigation (no loading UI needed,
      // this is a fast in-place operation via the Embedding SDK)
      if (this._currentDashboardId === resolvedDashboardId && this._dashboardEmbed) {
        await this.navigateToSheet(resolvedSheetId);
        return;
      }

      this._errorHandler.showLoading(this._container, (this._config.loadingScreen === false) ? '' : 'Loading dashboard…');

      try {
        // Different dashboard — always fetch a FRESH embed URL.
        //
        // QuickSight embed URLs are single-use: once the Embedding SDK consumes
        // one to start a session it cannot be replayed (a reused URL fails with
        // "Embedding failed because of invalid URL or authorization code").
        // They are therefore never cached/reused across loads. In-session
        // navigation between sheets of the SAME dashboard uses the SDK's
        // setSelectedSheetId (handled above) and needs no new URL.
        var embedUrl = await this._errorHandler.withRetry(function () {
          return self._fetchEmbedUrl('/dashboard-embed', {
            dashboardId: resolvedDashboardId,
            sheetId: resolvedSheetId,
            sessionLifetimeInMinutes: (self._config.session && self._config.session.expirationMinutes) || 30,
            deviceType: self._isMobile() ? 'mobile' : 'desktop'
          });
        }, 'dashboard embed URL fetch');

        // Embed the dashboard
        this._setContainerHeight();
        this._errorHandler.clear(this._container);
        this._clearEmbedContainer();

        if (this._embeddingContext) {
          // Use an explicit pixel height (not '100%', which collapses when the
          // parent has no fixed height) plus resizeHeightOnSizeChangedEvent so
          // the iframe grows to fit the dashboard's content.
          // Single-sheet mode: hide QuickSight's native sheet tabs so the
          // widget's own sub-navigation is the sole sheet switcher. Sub-nav
          // clicks call setSelectedSheetId to swap the visible sheet in place
          // (no new embed URL — same dashboard).
          // Single-sheet display: render only the active sheet and hide
          // QuickSight's native sheet tab bar. The host page sidebar drives
          // sheet switching via setSelectedSheetId (which works in singleSheet
          // mode — it swaps the displayed sheet in place).
          // emitSizeChangedEventOnSheetChange makes the SDK re-emit SIZE_CHANGED
          // when the active sheet changes, so the iframe re-fits to each sheet's
          // content height (works with resizeHeightOnSizeChangedEvent below).
          var contentOptions = { sheetOptions: { singleSheet: true, emitSizeChangedEventOnSheetChange: true } };
          if (resolvedSheetId) {
            contentOptions.sheetOptions.initialSheetId = resolvedSheetId;
          }
          this._dashboardEmbed = await this._embeddingContext.embedDashboard({
            url: embedUrl,
            container: this._embedContainer,
            height: this._isMobile() ? '600px' : '920px',
            width: '100%',
            withIframePlaceholder: false,
            resizeHeightOnSizeChangedEvent: true
          }, contentOptions);
          this._attachSdkErrorLogging(this._dashboardEmbed);
          // Ensure the requested sheet is shown (also switches the single sheet
          // if the SDK loaded a different default).
          if (resolvedSheetId && typeof this._dashboardEmbed.setSelectedSheetId === 'function') {
            try { await this._dashboardEmbed.setSelectedSheetId(resolvedSheetId); } catch (e) { /* sheet select is best-effort */ }
          }
        } else {
          this._errorHandler.clear(this._container);
        }

        this._currentDashboardId = resolvedDashboardId;
        this._currentSheetId = resolvedSheetId;
      } catch (err) {
        this._handleLoadError(err, function () { self.loadDashboard(dashboardId, sheetId); });
      }
    }

    /**
     * Load and embed the Q&A chat experience.
     * @returns {Promise<void>}
     */
    async loadChat(initialPrompt) {
      var self = this;
      this._errorHandler.showLoading(this._container, (this._config.loadingScreen === false) ? '' : 'Loading chat…');

      try {
        var embedUrl = await this._errorHandler.withRetry(function () {
          return self._fetchEmbedUrl('/chat-embed', {
            sessionLifetimeInMinutes: (self._config.session && self._config.session.expirationMinutes) || 15,
            deviceType: self._isMobile() ? 'mobile' : 'desktop'
          });
        }, 'chat embed URL fetch');

        this._setContainerHeight();
        this._errorHandler.clear(this._container);
        this._clearEmbedContainer();

        if (this._embeddingContext) {
          // QuickChat (agent-based) experience — uses the furniture-operations-assistant agent.
          if (typeof this._embeddingContext.embedQuickChat !== 'function') {
            throw new Error('[QuickSuite] QuickSight Embedding SDK does not support embedQuickChat; upgrade the SDK to 2.11.3+.');
          }
          var chatContentOptions = {
            agentOptions: {
              // Configurable via config.chat.agentId; falls back to the sample agent.
              fixedAgentId: (this._config.chat && this._config.chat.agentId) || 'furniture-operations-assistant'
            },
            promptOptions: {
              showWebSearch: true,
              showChatHistory: true,
              showPromptArea: true,
              allowFileAttachments: true,
              enablePrivateMode: false
            },
            footerOptions: {
              showBrandAttribution: true,
              showUsagePolicy: true
            }
          };
          if (initialPrompt) {
            chatContentOptions.promptOptions.initialPrompt = initialPrompt;
            chatContentOptions.promptOptions.showInitialPromptMessage = true;
          }
          this._chatEmbed = await this._embeddingContext.embedQuickChat({
            url: embedUrl,
            container: this._embedContainer,
            height: this._isMobile() ? '600px' : '920px',
            width: '100%',
            withIframePlaceholder: false,
            resizeHeightOnSizeChangedEvent: true
          }, chatContentOptions);
          this._attachSdkErrorLogging(this._chatEmbed);
        } else {
          this._errorHandler.clear(this._container);
        }

        // Clear dashboard tracking since we switched to chat
        this._currentDashboardId = null;
        this._currentSheetId = null;
      } catch (err) {
        this._handleLoadError(err, function () { self.loadChat(initialPrompt); });
      }
    }

    /**
     * Embed the generative Q&A chat into an arbitrary container element
     * (used by the floating ChatBubble panel). Unlike loadChat, this does NOT
     * touch the main dashboard embed container, so the dashboard stays visible
     * behind the chat panel.
     * @param {HTMLElement} targetEl - element to embed the chat iframe into
     * @param {string} [initialPrompt] - optional prompt to pre-fill (not submitted)
     * @returns {Promise<void>}
     */
    async embedChatInto(targetEl, initialPrompt) {
      if (!targetEl) return;
      var self = this;
      this._errorHandler.showLoading(targetEl, (this._config.loadingScreen === false) ? '' : 'Loading chat…');

      try {
        var embedUrl = await this._errorHandler.withRetry(function () {
          return self._fetchEmbedUrl('/chat-embed', {
            sessionLifetimeInMinutes: (self._config.session && self._config.session.expirationMinutes) || 15,
            deviceType: self._isMobile() ? 'mobile' : 'desktop'
          });
        }, 'chat embed URL fetch');

        this._errorHandler.clear(targetEl);
        targetEl.innerHTML = '';

        if (this._embeddingContext) {
          if (typeof this._embeddingContext.embedQuickChat !== 'function') {
            throw new Error('[QuickSuite] QuickSight Embedding SDK does not support embedQuickChat; upgrade the SDK to 2.11.3+.');
          }
          var chatContentOptions = {
            agentOptions: {
              // Configurable via config.chat.agentId; falls back to the sample agent.
              fixedAgentId: (this._config.chat && this._config.chat.agentId) || 'furniture-operations-assistant'
            },
            promptOptions: {
              showWebSearch: true,
              showChatHistory: true,
              showPromptArea: true,
              allowFileAttachments: true,
              enablePrivateMode: false
            },
            footerOptions: {
              showBrandAttribution: true,
              showUsagePolicy: true
            }
          };
          if (initialPrompt) {
            chatContentOptions.promptOptions.initialPrompt = initialPrompt;
            chatContentOptions.promptOptions.showInitialPromptMessage = true;
          }
          this._chatEmbed = await this._embeddingContext.embedQuickChat({
            url: embedUrl,
            container: targetEl,
            height: '100%',
            width: '100%',
            withIframePlaceholder: false,
            resizeHeightOnSizeChangedEvent: false
          }, chatContentOptions);
          this._attachSdkErrorLogging(this._chatEmbed);
        }
      } catch (err) {
        this._handleChatError(err, targetEl, function () { self.embedChatInto(targetEl, initialPrompt); });
      }
    }

    /**
     * Render a chat load failure into the chat panel container: a busy state
     * with countdown for pool exhaustion (503), otherwise the configured/
     * default error message with a Retry button.
     * @private
     */
    _handleChatError(err, targetEl, retryFn) {
      console.error('[QuickSuite] Chat embed failed:', err && err.message);
      if (err instanceof PoolExhaustedError) {
        var remaining = err.retryAfterSeconds || 60;
        var self = this;
        var render = function () {
          self._errorHandler.showError(targetEl, 'Chat is busy, retrying in ' + remaining + 's…',
            { showRetryButton: true, retryLabel: 'Retry now', onRetry: function () { clearInterval(t); retryFn(); } });
        };
        render();
        var t = setInterval(function () {
          remaining -= 1;
          if (remaining <= 0) { clearInterval(t); retryFn(); return; }
          render();
        }, 1000);
        return;
      }
      var message = this._config.errorMessage || 'The chat service is temporarily unavailable. Please try again later.';
      this._errorHandler.showError(targetEl, message, {
        showRetryButton: this._config.fallbackMode !== false,
        onRetry: retryFn
      });
    }

    /**
     * Translate a load failure into the appropriate user-facing state:
     * pool-busy countdown, auth failure message, or the configured/default
     * error message with an optional Retry button (Requirements 9.2, 9.3, 4.6).
     * @private
     */
    _handleLoadError(err, retryFn) {
      console.error('[QuickSuite] Embed load failed:', err && err.message);

      if (err instanceof PoolExhaustedError) {
        this._showBusyState(err.retryAfterSeconds, retryFn);
        return;
      }

      if (err instanceof EmbedAuthError) {
        // With Cognito auth, an auth failure usually means the id token expired.
        // Send the user back through the Hosted UI to re-authenticate.
        if (this._authManager && this._authManager.isEnabled()) {
          console.log('[QuickSuite] Auth failed (token likely expired); redirecting to login.');
          this._authManager.login();
          return;
        }
        this._errorHandler.showError(this._container, 'Session could not be authenticated.');
        return;
      }

      var message = this._config.errorMessage || 'The service is temporarily unavailable. Please try again later.';
      this._errorHandler.showError(this._container, message, {
        showRetryButton: this._config.fallbackMode !== false,
        onRetry: retryFn
      });
    }

    /**
     * Show a busy state with a countdown, per Requirement 4.6 (503 pool exhausted).
     * @private
     */
    _showBusyState(retryAfterSeconds, retryFn) {
      var self = this;
      var remaining = retryAfterSeconds;
      var render = function () {
        self._errorHandler.showError(
          self._container,
          'Service is busy, retrying in ' + remaining + 's…',
          { showRetryButton: true, onRetry: function () { clearInterval(intervalId); retryFn(); }, retryLabel: 'Retry now' }
        );
      };
      render();
      var intervalId = setInterval(function () {
        remaining -= 1;
        if (remaining <= 0) {
          clearInterval(intervalId);
          retryFn();
          return;
        }
        render();
      }, 1000);
    }

    /**
     * Navigate to a different sheet within the currently embedded dashboard.
     * Uses SDK's setSelectedSheetId — no new embed URL needed.
     * @param {string} sheetId - Target sheet ID
     * @returns {Promise<void>}
     */
    async navigateToSheet(sheetId) {
      if (this._dashboardEmbed && typeof this._dashboardEmbed.setSelectedSheetId === 'function') {
        await this._dashboardEmbed.setSelectedSheetId(sheetId);
        this._currentSheetId = sheetId;
        // Re-fit the iframe to the new sheet's content height. The SDK's
        // SIZE_CHANGED-on-sheet-change is unreliable cross-origin, so force a
        // few re-measures as the new sheet renders and its height settles.
        this._nudgeResize();
      } else {
        console.warn('[QuickSuite] Cannot navigate to sheet: no active dashboard embed.');
      }
    }

    /**
     * Force the QuickSight iframe to re-measure and re-fit its height.
     * A brief width toggle triggers the embedded app's ResizeObserver, which
     * makes QuickSight re-emit SIZE_CHANGED so resizeHeightOnSizeChangedEvent
     * updates the iframe height. Runs a few times because the new sheet's
     * final height isn't known until it finishes rendering.
     * @private
     */
    _nudgeResize() {
      var self = this;
      var toggle = function () {
        try {
          var frame = self._embedContainer && self._embedContainer.querySelector('iframe');
          if (!frame) return;
          var origW = frame.style.width || '100%';
          frame.style.width = '99.9%';
          requestAnimationFrame(function () { frame.style.width = origW; });
        } catch (e) { /* best-effort */ }
      };
      toggle();
      setTimeout(toggle, 350);
      setTimeout(toggle, 900);
      setTimeout(toggle, 1600);
    }

    /**
     * Fetch an embed URL from the backend.
     * On 401/403: clear cache, retry once. If retry fails, show auth error.
     * @private
     * @param {string} path - API path (e.g., '/dashboard-embed')
     * @param {Object} body - Request body
     * @returns {Promise<string>} The embed URL
     */
    async _fetchEmbedUrl(path, body) {
      var apiEndpoint = this._config.apiEndpoint;
      var url = apiEndpoint.replace(/\/$/, '') + path;
      var self = this;
      var retried = false;

      async function doFetch() {
        var headers = { 'Content-Type': 'application/json' };
        // Attach the Cognito id token so the backend embeds as this user.
        if (self._authManager && self._authManager.getIdToken) {
          var token = self._authManager.getIdToken();
          if (token) {
            headers['Authorization'] = 'Bearer ' + token;
          }
        }

        var response = await fetch(url, {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(body)
        });

        if (response.status === 401 || response.status === 403) {
          if (!retried) {
            retried = true;
            self._sessionCache.clear();
            return doFetch();
          }
          throw new EmbedAuthError('Session could not be authenticated.');
        }

        if (response.status === 503) {
          var retryAfterHeader = (response.headers && typeof response.headers.get === 'function')
            ? response.headers.get('Retry-After')
            : null;
          var retryAfterSeconds = retryAfterHeader ? parseInt(retryAfterHeader, 10) : 60;
          throw new PoolExhaustedError('Service is busy.', isNaN(retryAfterSeconds) ? 60 : retryAfterSeconds);
        }

        if (!response.ok) {
          var httpErr = new Error('[QuickSuite] Embed URL fetch failed: HTTP ' + response.status);
          httpErr.statusCode = response.status;
          throw httpErr;
        }

        var data = await response.json();
        return data.embedUrl || data.EmbedUrl || '';
      }

      return doFetch();
    }

    /**
     * Check if the viewport is classified as mobile (≤768px).
     * @returns {boolean}
     */
    _isMobile() {
      if (typeof window === 'undefined') return false;
      return window.innerWidth <= 768;
    }

    /**
     * Resolve mobile-specific IDs from the active navigation item context.
     * Looks through config navigation for matching standard IDs and returns mobile variants.
     * @private
     * @param {string} idType - 'dashboardId' or 'sheetId'
     * @param {string} standardId - The standard (desktop) ID
     * @returns {string|null} Mobile ID if found, null otherwise
     */
    _getMobileId(idType, standardId) {
      var navigation = this._config.navigation;
      if (!navigation) return null;
      var mobileKey = idType === 'dashboardId' ? 'mobileDashboardId' : 'mobileSheetId';
      var tabKeys = Object.keys(navigation);
      for (var i = 0; i < tabKeys.length; i++) {
        var tab = navigation[tabKeys[i]];
        if (!tab.subItems) continue;
        for (var j = 0; j < tab.subItems.length; j++) {
          var item = tab.subItems[j];
          if (item[idType] === standardId && item[mobileKey]) {
            return item[mobileKey];
          }
        }
      }
      return null;
    }

    /**
     * Set minimum container height based on viewport classification.
     * Mobile: 600px, Desktop: 920px.
     * @private
     */
    _setContainerHeight() {
      if (!this._embedContainer) return;
      var minHeight = this._isMobile() ? '600px' : '920px';
      this._embedContainer.style.minHeight = minHeight;
    }

    /**
     * Ensure the embed sub-container exists within the widget container.
     * @private
     */
    _ensureEmbedContainer() {
      if (this._embedContainer) return;
      this._embedContainer = document.createElement('div');
      this._embedContainer.className = 'qs-embed-frame';
      this._embedContainer.style.width = '100%';
      this._embedContainer.style.position = 'relative';
      this._container.appendChild(this._embedContainer);
    }

    /**
     * Clear the embed container's children for re-embedding.
     * @private
     */
    _clearEmbedContainer() {
      if (!this._embedContainer) return;
      this._embedContainer.innerHTML = '';
      this._dashboardEmbed = null;
      this._chatEmbed = null;
    }

    /**
     * Attach an error listener to a QuickSight embed instance, logging
     * SDK rendering errors (error type + message) to the console (Requirement 9.5).
     * @private
     */
    _attachSdkErrorLogging(embedInstance) {
      if (!embedInstance || typeof embedInstance.on !== 'function') return;
      embedInstance.on('error', function (payload) {
        var errorType = (payload && (payload.errorType || payload.eventName)) || 'unknown';
        var message = (payload && (payload.message || JSON.stringify(payload))) || 'No details provided';
        console.error('[QuickSuite] Embedding SDK rendering error — type: ' + errorType + ', message: ' + message);
      });
    }
  }

  // ---------------------------------------------------------------------------
  // EmbedAuthError — thrown when auth retry fails
  // ---------------------------------------------------------------------------

  class EmbedAuthError extends Error {
    constructor(message) {
      super(message);
      this.name = 'EmbedAuthError';
    }
  }

  /**
   * Thrown when an operation exceeds its allotted time budget.
   */
  class TimeoutError extends Error {
    constructor(message) {
      super(message);
      this.name = 'TimeoutError';
    }
  }

  /**
   * Thrown when the backend returns HTTP 503 because the chat user pool
   * is exhausted (all registered users have an active session).
   */
  class PoolExhaustedError extends Error {
    constructor(message, retryAfterSeconds) {
      super(message);
      this.name = 'PoolExhaustedError';
      this.retryAfterSeconds = retryAfterSeconds || 60;
    }
  }

  // ---------------------------------------------------------------------------
  // ErrorHandler — loading/error UI and exponential backoff retry logic
  // ---------------------------------------------------------------------------

  class ErrorHandler {
    /**
     * @param {Object} [options]
     * @param {number} [options.maxRetries=3] - Max retry attempts
     * @param {number[]} [options.delays=[1000,2000,4000]] - Delay before each retry (ms)
     * @param {number} [options.attemptTimeoutMs=10000] - Per-attempt timeout (ms)
     */
    constructor(options) {
      options = options || {};
      this._maxRetries = options.maxRetries != null ? options.maxRetries : 3;
      this._delays = options.delays || [1000, 2000, 4000];
      this._attemptTimeoutMs = options.attemptTimeoutMs || 10000;
      this._loadingEl = null;
    }

    /**
     * Display a visible loading indicator within the container.
     * @param {HTMLElement} container
     * @param {string} [message]
     */
    showLoading(container, message) {
      if (!container) return;
      this.clear(container);
      var div = document.createElement('div');
      div.className = 'qs-loading';
      div.setAttribute('role', 'status');
      div.setAttribute('aria-live', 'polite');
      div.style.cssText =
        'display:flex;align-items:center;justify-content:center;padding:32px;' +
        'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;' +
        'color:#374151;font-size:14px;min-height:200px;';
      div.textContent = message || 'Loading…';
      container.appendChild(div);
      this._loadingEl = div;
    }

    /**
     * Remove any loading indicator or error message currently shown.
     * @param {HTMLElement} container
     */
    clear(container) {
      if (this._loadingEl && this._loadingEl.parentNode) {
        this._loadingEl.parentNode.removeChild(this._loadingEl);
      }
      this._loadingEl = null;
      if (container && typeof container.querySelectorAll === 'function') {
        var existing = container.querySelectorAll('.qs-loading, .qs-error');
        existing.forEach(function (el) {
          if (el.parentNode) el.parentNode.removeChild(el);
        });
      }
    }

    /**
     * Display an error message within the container, optionally with a Retry button.
     * @param {HTMLElement} container
     * @param {string} message
     * @param {Object} [options]
     * @param {boolean} [options.showRetryButton]
     * @param {Function} [options.onRetry]
     * @param {string} [options.retryLabel]
     */
    showError(container, message, options) {
      if (!container) return;
      options = options || {};
      this.clear(container);

      var wrapper = document.createElement('div');
      wrapper.className = 'qs-error';
      wrapper.setAttribute('role', 'alert');
      wrapper.setAttribute('aria-live', 'assertive');
      wrapper.style.cssText =
        'padding:24px;margin:8px;border:1px solid #dc2626;border-radius:4px;' +
        'background-color:#fef2f2;color:#991b1b;' +
        'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;' +
        'font-size:14px;line-height:1.5;text-align:center;min-height:200px;' +
        'display:flex;flex-direction:column;align-items:center;justify-content:center;';

      var msgEl = document.createElement('div');
      msgEl.textContent = message;
      wrapper.appendChild(msgEl);

      if (options.showRetryButton && typeof options.onRetry === 'function') {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = options.retryLabel || 'Retry';
        btn.style.cssText =
          'margin-top:12px;padding:8px 20px;border:none;border-radius:4px;' +
          'background-color:#991b1b;color:#ffffff;cursor:pointer;font-size:14px;';
        btn.addEventListener('click', options.onRetry);
        wrapper.appendChild(btn);
      }

      container.appendChild(wrapper);
    }

    /**
     * Run an operation with a per-attempt timeout and exponential backoff retry.
     * Retries on TimeoutError or 5xx HTTP errors. Non-retryable errors
     * (auth failures, pool exhaustion, config errors, 4xx) are rethrown immediately.
     *
     * @param {Function} operation - Function returning a Promise
     * @param {string} [name] - Label used in timeout error messages
     * @param {Object} [options] - Override constructor defaults for this call
     * @returns {Promise<any>}
     */
    async withRetry(operation, name, options) {
      options = options || {};
      var maxRetries = options.maxRetries != null ? options.maxRetries : this._maxRetries;
      var delays = options.delays || this._delays;
      var attemptTimeoutMs = options.attemptTimeoutMs || this._attemptTimeoutMs;

      var attempt = 0;
      var lastError = null;

      while (attempt <= maxRetries) {
        try {
          return await this._withTimeout(operation, attemptTimeoutMs, name);
        } catch (err) {
          lastError = err;
          if (this.isNonRetryableError(err) || attempt === maxRetries) {
            throw err;
          }
          var delay = delays[attempt] != null ? delays[attempt] : delays[delays.length - 1];
          await this._sleep(delay);
          attempt++;
        }
      }

      throw lastError;
    }

    /**
     * Race an operation against a timeout.
     * @private
     */
    _withTimeout(operation, timeoutMs, name) {
      return new Promise(function (resolve, reject) {
        var settled = false;
        var timer = setTimeout(function () {
          if (settled) return;
          settled = true;
          reject(new TimeoutError('[QuickSuite] ' + (name || 'Operation') + ' timed out after ' + timeoutMs + 'ms'));
        }, timeoutMs);

        Promise.resolve()
          .then(operation)
          .then(function (result) {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            resolve(result);
          })
          .catch(function (err) {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            reject(err);
          });
      });
    }

    /** @private */
    _sleep(ms) {
      return new Promise(function (resolve) { setTimeout(resolve, ms); });
    }

    /**
     * Determine whether an error should NOT be retried.
     * Auth failures, pool exhaustion, config errors, and 4xx responses are
     * non-retryable. Timeouts and 5xx responses (and unknown/network errors) are retryable.
     * @param {Error} error
     * @returns {boolean}
     */
    isNonRetryableError(error) {
      if (!error) return false;
      if (error instanceof EmbedAuthError) return true;
      if (error instanceof PoolExhaustedError) return true;
      if (error instanceof ConfigValidationError) return true;
      if (error instanceof ConfigFetchError) return true;
      if (error instanceof TimeoutError) return false;
      if (typeof error.statusCode === 'number') {
        return error.statusCode < 500;
      }
      return false;
    }
  }

  // ---------------------------------------------------------------------------
  // FilterBar — widget-rendered app-level filter controls
  // ---------------------------------------------------------------------------

  /**
   * Renders an app-level filter bar (multi-select + date-range controls) beneath
   * the widget's navigation and applies the selections as QuickSight SDK filter
   * groups scoped to the currently displayed sheet. Selections are preserved
   * across sheets; each sheet shows only the filters listed in its config
   * (subItem.filters, or all filters when unspecified), and a filter's selection
   * carries over to any other sheet that also enables it.
   *
   * This is the WIDGET-DRIVEN filter bar: the widget owns navigation and renders
   * the filters itself (the classic top-nav layout). In host-driven/split-pane
   * layouts (container marked data-no-chat-bubble) the host page renders its own
   * filter bar, so this is not mounted there.
   *
   * All styles are scoped to qs-flt-* classes injected inside the container.
   */
  class FilterBar {
    /**
     * @param {Object} opts
     * @param {HTMLElement} opts.container - widget container element
     * @param {Object} opts.config - validated widget config
     * @param {Function} opts.getFrame - fn() -> current dashboard embed frame (or null)
     * @param {Function} opts.getSheetId - fn() -> currently displayed (resolved) sheet id
     */
    constructor(opts) {
      opts = opts || {};
      this._container = opts.container;
      this._config = opts.config || {};
      this._getFrame = opts.getFrame || function () { return null; };
      this._getSheetId = opts.getSheetId || function () { return null; };
      this._bar = null;
      this._currentSubItem = null;
      this._filtersById = {};
      this._filterState = {};
      this._datasetDefault = this._config.datasetIdentifier || '';
      this._reconciling = false;
      this._reconcilePending = false;
      this._reconcileRetries = 0;

      var self = this;
      (this._config.filters || []).forEach(function (f) {
        var id = f.id || f.column;
        f.__id = id;
        self._filtersById[id] = f;
        self._filterState[id] = { values: [], start: '', end: '', label: '' };
      });

      this._onDocClickBound = this._onDocClick.bind(this);
    }

    /** @returns {boolean} at least one filter is configured. */
    hasFilters() {
      return !!(this._config.filters && this._config.filters.length);
    }

    /** Inject scoped styles + the (initially empty) bar above the embed frame. */
    mount() {
      if (this._bar || !this.hasFilters()) return;

      var style = document.createElement('style');
      style.textContent = this._scopedCss();

      this._bar = document.createElement('div');
      this._bar.className = 'qs-flt-bar';
      this._bar.setAttribute('role', 'group');
      this._bar.setAttribute('aria-label', 'Filters');
      this._bar.appendChild(style);

      // Insert above the embed frame (created by EmbedManager.init()), so the
      // order is nav -> sub-nav -> filter bar -> dashboard.
      var frame = this._container.querySelector('.qs-embed-frame');
      if (frame) {
        this._container.insertBefore(this._bar, frame);
      } else {
        this._container.appendChild(this._bar);
      }

      document.addEventListener('click', this._onDocClickBound);
    }

    /** Filter defs enabled for a sub-item, in config order (all if unspecified). */
    _enabledFiltersFor(subItem) {
      var all = this._config.filters || [];
      if (!subItem || !Array.isArray(subItem.filters)) return all;
      var self = this;
      return subItem.filters.map(function (id) { return self._filtersById[id]; }).filter(Boolean);
    }

    /**
     * (Re)render the controls for a sub-item (sheet), restoring current
     * selections. Only the filters enabled for that sheet are shown.
     * @param {Object} subItem - the active navigation sub-item (sheet) config
     */
    renderFor(subItem) {
      if (!this._bar) return;
      this._currentSubItem = subItem;

      // Clear controls but keep the injected <style>.
      var style = this._bar.querySelector('style');
      this._bar.innerHTML = '';
      if (style) this._bar.appendChild(style);

      var defs = this._enabledFiltersFor(subItem);
      if (!defs.length) { this._bar.style.display = 'none'; return; }
      this._bar.style.display = '';

      var label = document.createElement('span');
      label.className = 'qs-flt-label';
      label.textContent = 'Filters';
      this._bar.appendChild(label);

      var self = this;
      defs.forEach(function (def) {
        var type = def.type || 'multiselect';
        self._bar.appendChild(type === 'daterange' ? self._buildDateControl(def) : self._buildMultiSelectControl(def));
      });
    }

    // ---- Multi-select (category) control ----
    _buildMultiSelectControl(def) {
      var self = this;
      var id = def.__id;
      var group = document.createElement('div');
      group.className = 'qs-flt-group';

      var glabel = document.createElement('span');
      glabel.className = 'qs-flt-glabel';
      glabel.textContent = def.label;
      group.appendChild(glabel);

      var ms = document.createElement('div');
      ms.className = 'qs-flt-ms';

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'qs-flt-btn';
      btn.setAttribute('aria-haspopup', 'true');
      btn.setAttribute('aria-expanded', 'false');
      this._updateMsButtonLabel(btn, def);
      btn.onclick = function (e) {
        e.stopPropagation();
        var open = ms.classList.toggle('qs-open');
        btn.setAttribute('aria-expanded', String(open));
        self._closeOthers(ms);
      };
      ms.appendChild(btn);

      var pop = document.createElement('div');
      pop.className = 'qs-flt-pop';

      (def.options || []).forEach(function (opt) {
        var row = document.createElement('label');
        row.className = 'qs-flt-row';
        var cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.value = opt;
        cb.checked = self._filterState[id].values.indexOf(opt) !== -1;
        cb.onchange = function () {
          var vals = self._filterState[id].values;
          if (cb.checked) { if (vals.indexOf(opt) === -1) vals.push(opt); }
          else { var ix = vals.indexOf(opt); if (ix !== -1) vals.splice(ix, 1); }
          self._updateMsButtonLabel(btn, def);
          self.reconcile();
        };
        var txt = document.createElement('span');
        txt.textContent = opt;
        row.appendChild(cb);
        row.appendChild(txt);
        pop.appendChild(row);
      });

      var clear = document.createElement('button');
      clear.type = 'button';
      clear.className = 'qs-flt-clear';
      clear.textContent = def.allLabel || 'All';
      clear.onclick = function () {
        self._filterState[id].values = [];
        var boxes = pop.querySelectorAll('input[type=checkbox]');
        for (var i = 0; i < boxes.length; i++) boxes[i].checked = false;
        self._updateMsButtonLabel(btn, def);
        self.reconcile();
      };
      pop.appendChild(clear);

      ms.appendChild(pop);
      group.appendChild(ms);
      return group;
    }

    _updateMsButtonLabel(btn, def) {
      var vals = this._filterState[def.__id].values;
      if (!vals.length) btn.textContent = def.allLabel || 'All';
      else if (vals.length === 1) btn.textContent = vals[0];
      else btn.textContent = vals.length + ' selected';
    }

    // ---- Date-range control (presets + custom From/To in one popover) ----
    _buildDateControl(def) {
      var self = this;
      var id = def.__id;
      var group = document.createElement('div');
      group.className = 'qs-flt-group';
      var glabel = document.createElement('span');
      glabel.className = 'qs-flt-glabel';
      glabel.textContent = def.label;
      group.appendChild(glabel);

      var ms = document.createElement('div');
      ms.className = 'qs-flt-ms';

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'qs-flt-btn';
      btn.setAttribute('aria-haspopup', 'true');
      btn.setAttribute('aria-expanded', 'false');
      btn.onclick = function (e) {
        e.stopPropagation();
        var open = ms.classList.toggle('qs-open');
        btn.setAttribute('aria-expanded', String(open));
        self._closeOthers(ms);
      };
      ms.appendChild(btn);

      var pop = document.createElement('div');
      pop.className = 'qs-flt-pop qs-flt-date-pop';

      var from = document.createElement('input');
      from.type = 'date'; from.className = 'qs-flt-date-input';
      from.setAttribute('aria-label', def.label + ' from');
      var to = document.createElement('input');
      to.type = 'date'; to.className = 'qs-flt-date-input';
      to.setAttribute('aria-label', def.label + ' to');
      if (def.min) { from.min = def.min; to.min = def.min; }
      if (def.max) { from.max = def.max; to.max = def.max; }

      function syncInputs() {
        var st = self._filterState[id];
        from.value = st.start || '';
        to.value = st.end || '';
        self._updateDateLabel(btn, def);
      }

      var presets = def.presets || [
        { label: 'Last 7 days', n: 7, unit: 'day' },
        { label: 'Last 30 days', n: 30, unit: 'day' },
        { label: 'Last 3 months', n: 3, unit: 'month' },
        { label: 'Last 12 months', n: 12, unit: 'month' }
      ];
      var presetWrap = document.createElement('div');
      presetWrap.className = 'qs-flt-date-presets';
      presets.forEach(function (p) {
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'qs-flt-date-preset'; b.textContent = p.label;
        b.onclick = function () {
          var r = self._computeRelativeRange(p.n, p.unit);
          self._applyDateRange(def, r.start, r.end, p.label);
          syncInputs();
        };
        presetWrap.appendChild(b);
      });
      pop.appendChild(presetWrap);

      var rangeWrap = document.createElement('div');
      rangeWrap.className = 'qs-flt-date-range';
      var fromField = document.createElement('label'); fromField.className = 'qs-flt-date-field';
      var fromSpan = document.createElement('span'); fromSpan.textContent = 'From';
      fromField.appendChild(fromSpan); fromField.appendChild(from);
      var toField = document.createElement('label'); toField.className = 'qs-flt-date-field';
      var toSpan = document.createElement('span'); toSpan.textContent = 'To';
      toField.appendChild(toSpan); toField.appendChild(to);
      rangeWrap.appendChild(fromField);
      rangeWrap.appendChild(toField);
      pop.appendChild(rangeWrap);

      from.onchange = function () { self._applyDateRange(def, from.value, self._filterState[id].end, null); self._updateDateLabel(btn, def); };
      to.onchange = function () { self._applyDateRange(def, self._filterState[id].start, to.value, null); self._updateDateLabel(btn, def); };

      var clear = document.createElement('button');
      clear.type = 'button'; clear.className = 'qs-flt-clear';
      clear.textContent = def.allLabel || 'All dates';
      clear.onclick = function () { self._applyDateRange(def, '', '', null); syncInputs(); };
      pop.appendChild(clear);

      ms.appendChild(pop);
      group.appendChild(ms);
      syncInputs();
      return group;
    }

    _computeRelativeRange(n, unit) {
      var end = new Date();
      var start = new Date();
      if (unit === 'week') start.setDate(start.getDate() - n * 7);
      else if (unit === 'month') start.setMonth(start.getMonth() - n);
      else start.setDate(start.getDate() - n);
      return { start: this._toISODate(start), end: this._toISODate(end) };
    }

    _toISODate(d) {
      var m = String(d.getMonth() + 1);
      if (m.length < 2) m = '0' + m;
      var day = String(d.getDate());
      if (day.length < 2) day = '0' + day;
      return d.getFullYear() + '-' + m + '-' + day;
    }

    _applyDateRange(def, start, end, label) {
      var st = this._filterState[def.__id];
      st.start = start || '';
      st.end = end || '';
      st.label = label || '';
      this.reconcile();
    }

    _updateDateLabel(btn, def) {
      var st = this._filterState[def.__id];
      if (st.label) btn.textContent = st.label;
      else if (st.start && st.end) btn.textContent = this._fmtShortDate(st.start) + ' – ' + this._fmtShortDate(st.end);
      else if (st.start) btn.textContent = 'From ' + this._fmtShortDate(st.start);
      else if (st.end) btn.textContent = 'Until ' + this._fmtShortDate(st.end);
      else btn.textContent = def.allLabel || 'All dates';
    }

    _fmtShortDate(iso) {
      var parts = String(iso).split('-');
      if (parts.length !== 3) return iso;
      var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return months[parseInt(parts[1], 10) - 1] + ' ' + parseInt(parts[2], 10) + ', ' + parts[0];
    }

    // ---- SDK filter-group reconciliation (scoped to the current sheet) ----
    _filterActive(def) {
      var st = this._filterState[def.__id];
      if ((def.type || 'multiselect') === 'daterange') return !!(st.start || st.end);
      return st.values.length > 0;
    }

    _scopeForSheet(sheetId) {
      return { SelectedSheets: { SheetVisualScopingConfigurations: [{ SheetId: sheetId, Scope: 'ALL_VISUALS' }] } };
    }

    _buildFilterGroup(def, sheetId) {
      var id = def.__id;
      var dataset = def.dataSetIdentifier || this._datasetDefault;
      var fgId = 'appfilter-' + id;
      var filterId = 'appflt-' + id;
      var st = this._filterState[id];

      if ((def.type || 'multiselect') === 'daterange') {
        var trf = {
          FilterId: filterId,
          Column: { DataSetIdentifier: dataset, ColumnName: def.column },
          NullOption: 'NON_NULLS_ONLY',
          IncludeMinimum: true,
          IncludeMaximum: true,
          TimeGranularity: 'DAY'
        };
        if (st.start) trf.RangeMinimumValue = { StaticValue: st.start + 'T00:00:00.000Z' };
        if (st.end) trf.RangeMaximumValue = { StaticValue: st.end + 'T23:59:59.999Z' };
        return {
          FilterGroupId: fgId,
          Filters: [{ TimeRangeFilter: trf }],
          ScopeConfiguration: this._scopeForSheet(sheetId),
          Status: 'ENABLED',
          CrossDataset: 'SINGLE_DATASET'
        };
      }

      return {
        FilterGroupId: fgId,
        Filters: [{
          CategoryFilter: {
            FilterId: filterId,
            Column: { DataSetIdentifier: dataset, ColumnName: def.column },
            Configuration: {
              FilterListConfiguration: {
                MatchOperator: 'CONTAINS',
                CategoryValues: st.values.slice(),
                NullOption: 'NON_NULLS_ONLY'
              }
            }
          }
        }],
        ScopeConfiguration: this._scopeForSheet(sheetId),
        Status: 'ENABLED',
        CrossDataset: 'SINGLE_DATASET'
      };
    }

    /**
     * Reconcile the current sheet's app filter groups to match selection state.
     * Only filters enabled for the current sheet are applied; others removed.
     * If the embed frame/sheet is not ready yet (initial load), retries briefly.
     */
    reconcile() {
      var self = this;
      var frame = this._getFrame();
      var sheetId = this._getSheetId();
      if (!frame || typeof frame.getFilterGroupsForSheet !== 'function' || !sheetId) {
        if (this._reconcileRetries < 20) {
          this._reconcileRetries += 1;
          setTimeout(function () { self.reconcile(); }, 500);
        }
        return;
      }
      this._reconcileRetries = 0;
      if (this._reconciling) { this._reconcilePending = true; return; }
      this._reconciling = true;

      var enabled = {};
      this._enabledFiltersFor(this._currentSubItem).forEach(function (d) { enabled[d.__id] = true; });

      frame.getFilterGroupsForSheet(sheetId).then(function (existing) {
        var existingIds = {};
        (existing || []).forEach(function (g) { existingIds[g.FilterGroupId] = true; });

        var toAdd = [], toUpdate = [], toRemove = [];
        (self._config.filters || []).forEach(function (def) {
          var fgId = 'appfilter-' + def.__id;
          var want = enabled[def.__id] && self._filterActive(def);
          if (want) {
            var fg = self._buildFilterGroup(def, sheetId);
            if (existingIds[fgId]) toUpdate.push(fg); else toAdd.push(fg);
          } else if (existingIds[fgId]) {
            toRemove.push(fgId);
          }
        });

        var chain = Promise.resolve();
        if (toAdd.length) chain = chain.then(function () { return frame.addFilterGroups(toAdd); });
        if (toUpdate.length) chain = chain.then(function () { return frame.updateFilterGroups(toUpdate); });
        if (toRemove.length) chain = chain.then(function () { return frame.removeFilterGroups(toRemove); });
        return chain;
      }).then(function () {
        self._reconciling = false;
        if (self._reconcilePending) { self._reconcilePending = false; self.reconcile(); }
      }).catch(function (err) {
        self._reconciling = false;
        console.warn('[QuickSuite] Filter reconcile failed:', err && err.message);
        if (self._reconcilePending) { self._reconcilePending = false; self.reconcile(); }
      });
    }

    /** Close every open popover except `exceptMs`. @private */
    _closeOthers(exceptMs) {
      if (!this._bar) return;
      var open = this._bar.querySelectorAll('.qs-flt-ms.qs-open');
      for (var i = 0; i < open.length; i++) {
        if (open[i] === exceptMs) continue;
        open[i].classList.remove('qs-open');
        var b = open[i].querySelector('.qs-flt-btn');
        if (b) b.setAttribute('aria-expanded', 'false');
      }
    }

    /** Close popovers when clicking outside them. @private */
    _onDocClick(e) {
      if (!this._bar) return;
      var open = this._bar.querySelectorAll('.qs-flt-ms.qs-open');
      for (var i = 0; i < open.length; i++) {
        if (!open[i].contains(e.target)) {
          open[i].classList.remove('qs-open');
          var b = open[i].querySelector('.qs-flt-btn');
          if (b) b.setAttribute('aria-expanded', 'false');
        }
      }
    }

    /** @private scoped CSS for the filter bar + controls */
    _scopedCss() {
      return [
        '.qs-flt-bar{display:flex;align-items:center;flex-wrap:wrap;gap:14px;padding:10px 16px;background:#faf9f8;border-bottom:1px solid #e5e7eb;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;}',
        '.qs-flt-label{font-size:12px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.5px;}',
        '.qs-flt-group{position:relative;display:flex;align-items:center;gap:8px;}',
        '.qs-flt-glabel{font-size:12px;color:#6b7280;font-weight:500;}',
        '.qs-flt-ms{position:relative;}',
        '.qs-flt-btn{appearance:none;-webkit-appearance:none;padding:8px 30px 8px 12px;border:1px solid #d1d5db;border-radius:8px;background:#fff;color:#111827;font-size:13px;font-weight:500;font-family:inherit;cursor:pointer;min-width:140px;text-align:left;position:relative;white-space:nowrap;}',
        '.qs-flt-btn::after{content:"\\25BE";position:absolute;right:12px;top:50%;transform:translateY(-50%);font-size:10px;color:#6b7280;}',
        '.qs-flt-btn:hover{border-color:var(--qs-secondary,#3B82F6);}',
        '.qs-flt-btn:focus{outline:none;border-color:var(--qs-secondary,#3B82F6);box-shadow:0 0 0 3px rgba(59,130,246,0.15);}',
        '.qs-flt-pop{display:none;position:absolute;top:calc(100% + 4px);left:0;z-index:2147482000;background:#fff;border:1px solid #d1d5db;border-radius:8px;box-shadow:0 6px 20px rgba(0,0,0,0.15);padding:6px;min-width:200px;max-height:280px;overflow-y:auto;}',
        '.qs-flt-ms.qs-open .qs-flt-pop{display:block;}',
        '.qs-flt-row{display:flex;align-items:center;gap:8px;padding:6px 8px;border-radius:6px;font-size:13px;color:#111827;cursor:pointer;}',
        '.qs-flt-row:hover{background:#f3f4f6;}',
        '.qs-flt-row input{cursor:pointer;}',
        '.qs-flt-clear{width:100%;margin-top:4px;padding:7px 8px;border:none;border-top:1px solid #e5e7eb;background:transparent;color:var(--qs-primary,#374151);font-size:12px;font-weight:600;cursor:pointer;text-align:left;}',
        '.qs-flt-clear:hover{background:#f3f4f6;}',
        '.qs-flt-date-pop{min-width:240px;padding:10px;}',
        '.qs-flt-date-presets{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px;}',
        '.qs-flt-date-preset{padding:7px 8px;border:1px solid #d1d5db;border-radius:6px;background:#fff;color:#111827;font-size:12px;font-weight:500;cursor:pointer;text-align:center;}',
        '.qs-flt-date-preset:hover{border-color:var(--qs-secondary,#3B82F6);}',
        '.qs-flt-date-range{display:flex;gap:8px;margin-bottom:4px;}',
        '.qs-flt-date-field{display:flex;flex-direction:column;gap:3px;flex:1;font-size:11px;color:#6b7280;}',
        '.qs-flt-date-input{padding:7px 10px;border:1px solid #d1d5db;border-radius:8px;background:#fff;color:#111827;font-size:13px;width:100%;}',
        '.qs-flt-date-input:focus{outline:none;border-color:var(--qs-secondary,#3B82F6);}',
        // Mobile: tighter spacing and keep popovers within the viewport.
        '@media (max-width:768px){.qs-flt-bar{gap:10px;padding:10px 12px;}.qs-flt-btn{min-width:110px;}.qs-flt-pop{max-width:calc(100vw - 48px);}}'
      ].join('\n');
    }

    /** Remove listeners and the bar from the DOM. */
    destroy() {
      document.removeEventListener('click', this._onDocClickBound);
      if (this._bar) { this._bar.remove(); this._bar = null; }
    }
  }

  // ---------------------------------------------------------------------------
  // ChatBubble — floating chat launcher + slide-up panel
  // ---------------------------------------------------------------------------

  /**
   * Renders a floating circular chat button in the bottom-right corner. Clicking
   * it opens a chat panel (header with maximize/close, embedded generative Q&A
   * body) that overlays the page. The embed is lazy-loaded on first open via the
   * `onFirstOpen` callback. On mobile the panel goes full-screen with a backdrop.
   *
   * All styles are scoped to qs-chat-* classes and injected inside the widget
   * container (no document-level style pollution).
   */
  class ChatBubble {
    /**
     * @param {Object} opts
     * @param {HTMLElement} opts.container - widget container element
     * @param {Object} opts.config - validated widget config
     * @param {Function} opts.onFirstOpen - async fn(panelInner, prompt) invoked once on first open
     * @param {string} [opts.title] - panel/button label
     */
    constructor(opts) {
      opts = opts || {};
      this._container = opts.container;
      this._config = opts.config || {};
      this._onFirstOpen = opts.onFirstOpen || function () {};
      this._title = opts.title || 'Ask Analytics';
      this._loaded = false;
      this._open = false;
      this._maximized = false;
      this._root = null;
      this._btn = null;
      this._panel = null;
      this._panelInner = null;
      this._backdrop = null;
      var b = this._config.branding || {};
      this._brand = (typeof b.secondaryColor === 'string' && /^#[0-9A-Fa-f]{6}$/.test(b.secondaryColor)) ? b.secondaryColor : '#3B82F6';
    }

    /** @returns {boolean} viewport is mobile (≤768px) */
    _isMobile() {
      return typeof window !== 'undefined' && window.innerWidth <= 768;
    }

    /** Inject the bubble, panel, and backdrop into the container. */
    mount() {
      if (this._root) return;
      var root = document.createElement('div');
      root.className = 'qs-chat-root';

      var style = document.createElement('style');
      style.textContent = this._scopedCss();
      root.appendChild(style);

      // Backdrop (mobile)
      this._backdrop = document.createElement('div');
      this._backdrop.className = 'qs-chat-backdrop';
      this._backdrop.addEventListener('click', this.close.bind(this));
      root.appendChild(this._backdrop);

      // Floating launcher button
      this._panelId = 'qs-chat-panel-' + Math.random().toString(36).slice(2, 8);
      this._btn = document.createElement('button');
      this._btn.className = 'qs-chat-bubble-btn';
      this._btn.setAttribute('type', 'button');
      this._btn.setAttribute('aria-label', 'Open ' + this._title);
      this._btn.setAttribute('title', this._title);
      this._btn.setAttribute('aria-haspopup', 'dialog');
      this._btn.setAttribute('aria-expanded', 'false');
      this._btn.setAttribute('aria-controls', this._panelId);
      this._btn.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17L4 17.17V4h16v12zM7 9h2v2H7zm4 0h2v2h-2zm4 0h2v2h-2z"/></svg>';
      this._btn.addEventListener('click', this.toggle.bind(this));
      root.appendChild(this._btn);

      // Panel (modal dialog semantics; Escape closes, Tab is trapped inside)
      this._panel = document.createElement('div');
      this._panel.className = 'qs-chat-panel qs-hidden';
      this._panel.id = this._panelId;
      this._panel.setAttribute('role', 'dialog');
      this._panel.setAttribute('aria-modal', 'true');
      this._panel.setAttribute('aria-label', this._title);
      this._panel.addEventListener('keydown', this._onPanelKeydown.bind(this));

      var header = document.createElement('div');
      header.className = 'qs-chat-header';
      var titleEl = document.createElement('span');
      titleEl.className = 'qs-chat-title';
      titleEl.textContent = this._title;
      header.appendChild(titleEl);

      var maxBtn = document.createElement('button');
      maxBtn.className = 'qs-chat-ctrl';
      maxBtn.setAttribute('type', 'button');
      maxBtn.setAttribute('aria-label', 'Maximize chat');
      maxBtn.setAttribute('title', 'Maximize');
      maxBtn.innerHTML = this._iconExpand();
      maxBtn.addEventListener('click', this.toggleMax.bind(this));
      this._maxBtn = maxBtn;
      header.appendChild(maxBtn);

      var closeBtn = document.createElement('button');
      closeBtn.className = 'qs-chat-ctrl';
      closeBtn.setAttribute('type', 'button');
      closeBtn.setAttribute('aria-label', 'Close chat');
      closeBtn.setAttribute('title', 'Close');
      closeBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 10 10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M1 1L9 9"/><path d="M9 1L1 9"/></svg>';
      closeBtn.addEventListener('click', this.close.bind(this));
      this._closeBtn = closeBtn;
      header.appendChild(closeBtn);

      this._panel.appendChild(header);

      var body = document.createElement('div');
      body.className = 'qs-chat-body';
      this._panelInner = document.createElement('div');
      this._panelInner.className = 'qs-chat-frame';
      body.appendChild(this._panelInner);
      this._panel.appendChild(body);

      root.appendChild(this._panel);

      this._container.appendChild(root);
      this._root = root;
    }

    /** @returns {HTMLElement} the inner element the chat iframe embeds into */
    getPanelInner() {
      return this._panelInner;
    }

    /** Open the panel (lazy-load embed on first open). Moves focus into the dialog. */
    open(prompt) {
      if (!this._panel) return;
      this._open = true;
      this._panel.classList.remove('qs-hidden');
      this._btn.classList.add('qs-hidden');
      this._btn.setAttribute('aria-expanded', 'true');
      if (this._isMobile()) this._backdrop.classList.add('qs-show');
      if (!this._loaded) {
        this._loaded = true;
        try { this._onFirstOpen(this._panelInner, prompt || null); } catch (e) { console.error('[QuickSuite] Chat open failed:', e && e.message); }
      }
      // Move focus into the dialog (WCAG 2.4.3) — the close button is the
      // first meaningful, always-present control.
      if (this._closeBtn && typeof this._closeBtn.focus === 'function') {
        try { this._closeBtn.focus(); } catch (e) { /* non-fatal */ }
      }
    }

    /** Close the panel; the launcher button reappears and regains focus. */
    close() {
      if (!this._panel) return;
      this._open = false;
      this._panel.classList.add('qs-hidden');
      this._panel.classList.remove('qs-max');
      this._maximized = false;
      if (this._maxBtn) { this._maxBtn.innerHTML = this._iconExpand(); this._maxBtn.title = 'Maximize'; }
      this._btn.classList.remove('qs-hidden');
      this._btn.setAttribute('aria-expanded', 'false');
      this._backdrop.classList.remove('qs-show');
      // Return focus to the launcher (WCAG 2.4.3)
      if (this._btn && typeof this._btn.focus === 'function') {
        try { this._btn.focus(); } catch (e) { /* non-fatal */ }
      }
    }

    /**
     * Dialog keyboard behavior: Escape closes; Tab cycles within the panel's
     * focusable elements (buttons + embedded iframe) — a lightweight focus trap.
     * @private
     */
    _onPanelKeydown(e) {
      if (!this._open) return;
      if (e.key === 'Escape' || e.key === 'Esc') {
        e.preventDefault();
        this.close();
        return;
      }
      if (e.key !== 'Tab') return;
      var focusables = this._panel.querySelectorAll('button, iframe, [tabindex]:not([tabindex="-1"])');
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        try { last.focus(); } catch (err) { /* non-fatal */ }
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        try { first.focus(); } catch (err) { /* non-fatal */ }
      }
    }

    /** Toggle open/closed. */
    toggle() {
      if (this._open) { this.close(); } else { this.open(); }
    }

    /** Toggle maximized (desktop) — panel grows to fill most of the viewport. */
    toggleMax() {
      if (!this._panel) return;
      this._maximized = !this._maximized;
      this._panel.classList.toggle('qs-max', this._maximized);
      if (this._maxBtn) {
        this._maxBtn.innerHTML = this._maximized ? this._iconCollapse() : this._iconExpand();
        this._maxBtn.title = this._maximized ? 'Restore' : 'Maximize';
        this._maxBtn.setAttribute('aria-label', this._maximized ? 'Restore chat' : 'Maximize chat');
      }
    }

    /** @private */
    _iconExpand() {
      return '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7.5 1H11V4.5"/><path d="M4.5 11H1V7.5"/><path d="M11 1L7 5"/><path d="M1 11L5 7"/></svg>';
    }

    /** @private */
    _iconCollapse() {
      return '<svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 7.5H1"/><path d="M4.5 7.5V11"/><path d="M7.5 4.5H11"/><path d="M7.5 4.5V1"/></svg>';
    }

    /** @private scoped CSS for the bubble + panel */
    _scopedCss() {
      var brand = this._brand;
      return [
        '.qs-chat-bubble-btn{position:fixed;bottom:24px;right:24px;width:56px;height:56px;border-radius:50%;border:none;cursor:pointer;background:' + brand + ';color:#fff;box-shadow:0 4px 14px rgba(0,0,0,0.28);display:flex;align-items:center;justify-content:center;z-index:2147483000;transition:transform .15s ease,box-shadow .15s ease;}',
        '.qs-chat-bubble-btn:hover{transform:scale(1.06);box-shadow:0 6px 18px rgba(0,0,0,0.32);}',
        '.qs-chat-bubble-btn svg{width:26px;height:26px;fill:#fff;}',
        '.qs-chat-bubble-btn.qs-hidden{display:none;}',
        '.qs-chat-panel{position:fixed;bottom:24px;right:24px;width:400px;height:600px;max-height:calc(100vh - 48px);background:#fff;border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,0.30);display:flex;flex-direction:column;overflow:hidden;z-index:2147483001;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;}',
        '.qs-chat-panel.qs-hidden{display:none;}',
        '.qs-chat-panel.qs-max{width:min(1100px,calc(100vw - 48px));height:calc(100vh - 48px);}',
        '.qs-chat-header{display:flex;align-items:center;gap:6px;padding:10px 12px;background:' + brand + ';color:#fff;flex:0 0 auto;}',
        '.qs-chat-title{flex:1;font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}',
        '.qs-chat-ctrl{background:transparent;border:none;color:#fff;cursor:pointer;padding:5px;border-radius:4px;display:flex;align-items:center;justify-content:center;}',
        '.qs-chat-ctrl:hover{background:rgba(255,255,255,0.22);}',
        '.qs-chat-body{flex:1 1 auto;position:relative;min-height:0;background:#fff;}',
        '.qs-chat-frame{position:absolute;inset:0;width:100%;height:100%;}',
        '.qs-chat-frame iframe{width:100%;height:100%;border:0;}',
        '.qs-chat-backdrop{position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:2147482999;display:none;}',
        '.qs-chat-backdrop.qs-show{display:block;}',
        '@media (max-width:768px){.qs-chat-panel{inset:0;width:100%;height:100%;max-height:none;border-radius:0;}.qs-chat-panel.qs-max{width:100%;height:100%;}.qs-chat-bubble-btn{bottom:20px;right:20px;}}',
        '@media (prefers-reduced-motion: reduce){.qs-chat-bubble-btn{transition:none;}.qs-chat-bubble-btn:hover{transform:none;}}'
      ].join('\n');
    }

    /** Remove the bubble and panel from the DOM. */
    destroy() {
      if (this._root && this._root.parentNode) this._root.parentNode.removeChild(this._root);
      this._root = null;
    }
  }

  // ---------------------------------------------------------------------------
  // Auto-initialization
  // ---------------------------------------------------------------------------

  function startInitialization() {
    var widget = new WidgetInitializer();
    widget.init();
    // Expose globally for host-page integration (filter bars, external nav, etc.)
    window.__quicksuiteWidget = widget;
  }

  // Whether this module is being loaded as a CommonJS module (Node.js / Jest /
  // a bundler's require) rather than executed directly as a browser <script>.
  var _isCommonJsModule = (typeof module !== 'undefined' && module.exports);

  // ---------------------------------------------------------------------------
  // Exports for testing (not exposed to global scope in production)
  // ---------------------------------------------------------------------------
  if (_isCommonJsModule) {
    module.exports = {
      ConfigLoader: ConfigLoader,
      WidgetInitializer: WidgetInitializer,
      ConfigFetchError: ConfigFetchError,
      ConfigValidationError: ConfigValidationError,
      DeepLinkParser: DeepLinkParser,
      NavigationRenderer: NavigationRenderer,
      SessionCache: SessionCache,
      EmbedManager: EmbedManager,
      EmbedAuthError: EmbedAuthError,
      ErrorHandler: ErrorHandler,
      TimeoutError: TimeoutError,
      PoolExhaustedError: PoolExhaustedError,
      AuthManager: AuthManager,
      ChatBubble: ChatBubble,
      startInitialization: startInitialization
    };
  }

  // ---------------------------------------------------------------------------
  // Auto-initialization
  // ---------------------------------------------------------------------------
  // Only auto-initialize when loaded as a real browser <script> (the intended
  // single-script-tag deployment, Requirement 12.2). When the module is
  // require()'d — e.g. in Jest/Node unit tests or via a bundler — we skip
  // auto-init so that importing the module has no side effects. (Auto-init
  // otherwise schedules a MutationObserver + 10s container-detection timeout
  // that can outlive a test and fire after the jsdom environment is torn down.)
  if (!_isCommonJsModule && typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', startInitialization);
    } else {
      // DOM already loaded
      startInitialization();
    }
  }

})();
