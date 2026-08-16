<!--
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
-->

# Configuration Reference

The widget is driven entirely by `widget/config.json`, validated at load time
against `widget/config.schema.json`. This page documents every option: its
type, default, valid range, and an example.

> **Who reads each option.** Two pieces of code consume `config.json`:
> the **widget bundle** (`quicksuite-widget.js`) and the **sample host page**
> (`widget/index.html`). Options are tagged below with **[widget]** or
> **[host page]** so you know where a value takes effect. Host-page options are
> rendered by the sample `index.html` (the top bar, the filter bar, the chat
> panel chrome); if you embed the widget in your own page, you own that chrome
> and can read the same fields yourself. Everything validates against
> `config.schema.json` regardless of which consumer uses it.

## Top-level options

### `apiEndpoint` (required)

- **Type:** string (URI)
- **Default:** none
- **Description:** Base URL of the deployed SAM API Gateway stage. The widget
  POSTs to `{apiEndpoint}/dashboard-embed` and `{apiEndpoint}/chat-embed`.
- **Example:** `"https://abc123.execute-api.us-east-1.amazonaws.com/prod"`

### `navigation` (required)

- **Type:** object (1–10 properties)
- **Default:** none
- **Description:** Map of tab-id → tab definition. Each property key is the tab
  identifier used by deep links. Between 1 and 10 tabs are allowed.
- **Example:** see [Navigation tab](#navigation-tab-object) below.

### `session`

- **Type:** object
- **Description:** Session/caching settings.
- `session.expirationMinutes`
  - **Type:** number
  - **Default:** `30`
  - **Range:** `1`–`120`
  - **Description:** How long a cached embed URL is reused before a fresh one is
    requested.
  - **Example:** `{ "session": { "expirationMinutes": 60 } }`

### `branding`

- **Type:** object
- **Description:** Visual theming and top-bar identity. Invalid values fall
  back to defaults.
- `branding.appName` **[host page]**
  - **Type:** string, max 60 chars
  - **Default:** `"Analytics Portal"`
  - **Description:** Application name shown in the sample host page's top bar
    and used in the document title.
  - **Example:** `"Artisan Furnishings"`
- `branding.appIcon` **[host page]**
  - **Type:** string, max 4 chars
  - **Default:** none
  - **Description:** Emoji or short glyph shown as the app logo mark in the top
    bar (used when `logoUrl` is not set).
  - **Example:** `"🪑"`
- `branding.tagline` **[host page]**
  - **Type:** string, max 120 chars
  - **Default:** none
  - **Description:** Subtitle shown beside the app name in the top bar and
    appended to the document title.
  - **Example:** `"Operations Portal — Sales, Quality & Suppliers"`
- `branding.primaryColor` **[widget]**
  - **Type:** string, pattern `^#[0-9A-Fa-f]{6}$`
  - **Default:** `#6B7280` (gray)
  - **Description:** Navigation background and loading-screen color.
  - **Example:** `"#1E3A5F"`
- `branding.secondaryColor` **[widget]**
  - **Type:** string, pattern `^#[0-9A-Fa-f]{6}$`
  - **Default:** `#3B82F6` (blue)
  - **Description:** Accent color for the active tab and interactive elements.
  - **Example:** `"#4A90D9"`
- `branding.logoUrl` **[widget]**
  - **Type:** string (URI), max 2048 chars
  - **Default:** none (no logo shown)
  - **Description:** Logo image displayed in the nav header, scaled to max 32px
    height. Hidden automatically if it fails to load.
  - **Example:** `"https://example.com/assets/logo.png"`

### `datasetIdentifier`

- **Type:** string
- **Default:** none
- **Description:** Default QuickSight **DataSetIdentifier** used by app-level
  filters — the dataset identifier the dashboard references (visible in the
  dashboard's definition). Individual filters may override it with their own
  `dataSetIdentifier`. Required in practice when `filters` are used.
- **Example:** `"furniture-ops-quality-events"`

### `filters`

- **Type:** array of filter objects
- **Default:** none (no filter bar rendered)
- **Description:** App-level filter controls rendered above the dashboard —
  by the **widget** in the top-nav (widget-driven) layout, or by the **host
  page** in the split-pane layout. Each control applies a QuickSight **SDK
  filter group** (`addFilterGroups` / `updateFilterGroups` /
  `removeFilterGroups`) against a real **dataset column**, scoped to the
  currently selected sheet. No dashboard parameters are required. Selections
  are preserved when switching sheets and re-applied automatically.
- Each filter object:

  | Field | Type | Required | Description |
  |---|---|---|---|
  | `id` | string | no | Unique filter id, referenced by a sub-item's `filters` array. Defaults to `column`. |
  | `label` | string (≤30 chars) | yes | Display label for the control. |
  | `column` | string | yes | Dataset column name to filter on. |
  | `type` | `"multiselect"` \| `"single"` \| `"daterange"` | no (default `multiselect`) | Control type: checkbox category filter, single-value category filter, or start/end date `TimeRangeFilter`. |
  | `dataSetIdentifier` | string | no | Per-filter override of the top-level `datasetIdentifier`. |
  | `options` | string[] | category types | Selectable values (omit for `daterange`). |
  | `allLabel` | string | no (default `"All"`) | Label for the clear/"show all" entry. |
  | `min` / `max` | string (ISO date) | no | `daterange` only: bounds for the date inputs and the "Full range" shortcut. |
  | `presets` | array of `{label, n, unit}` | no | `daterange` only: relative presets (unit: `day`/`week`/`month`). Defaults to Last 7/30 days, 3/12 months. |
  | `parameterName` | string | no | **Deprecated.** Legacy dashboard-parameter name; retained for backward compatibility, not used by the current filter engine. |

- **Example:**
  ```json
  "datasetIdentifier": "furniture-ops-quality-events",
  "filters": [
    { "id": "facility", "label": "Facility", "column": "facility",
      "type": "multiselect", "allLabel": "All Facilities",
      "options": ["Atlanta", "Chicago", "Portland"] },
    { "id": "event_date", "label": "Event Date", "column": "event_timestamp",
      "type": "daterange" }
  ]
  ```

### Per-sheet filters (`subItems[].filters`)

Each navigation sub-item may list the filter **ids** enabled on that sheet:

```json
{ "id": "quality", "label": "Defect & Root Cause",
  "dashboardId": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeee01",
  "sheetId": "sheet-defects-001",
  "filters": ["severity", "defect_type", "event_date"] }
```

- Omit `filters` on a sub-item to enable **all** configured filters there.
- A selection made on one sheet carries over to any other sheet that enables
  the same filter id.

### `chat`

- **Type:** object
- **Description:** Generative Q&A (QuickChat) settings.
- `chat.agentId` **[widget]**
  - **Type:** string
  - **Default:** `"furniture-operations-assistant"` (the sample agent)
  - **Description:** QuickSight Agent ID passed to the Embedding SDK's
    `embedQuickChat` as `fixedAgentId`. Set this to your own agent ID to point
    chat at a different assistant. If omitted, the sample default is used.
  - **Example:** `"my-sales-assistant"`
- `chat.panelTitle` **[host page]**
  - **Type:** string
  - **Default:** `"AI Assistant"`
  - **Description:** Title shown in the sample host page's chat panel header.
  - **Example:** `"Operations Assistant"`
- `chat.toggleLabel` **[host page]**
  - **Type:** string
  - **Default:** `"AI Assistant"`
  - **Description:** Label on the top-bar button that opens the chat panel.
  - **Example:** `"AI Assistant"`

### `auth`

- **Type:** object
- **Default:** none (omit to run without login)
- **Description:** Amazon Cognito Hosted UI login. When present, the widget's
  AuthManager requires viewers to log in before any embed request, and attaches
  the returned id token as a bearer token. Populate from the backend stack's
  Cognito outputs. Omitting this block disables login (shared/anonymous embed
  identity).
- Fields:

  | Field | Type | Required | Description |
  |---|---|---|---|
  | `userPoolDomain` | string | yes | Cognito Hosted UI base URL (`CognitoHostedUiDomain` output). |
  | `clientId` | string | yes | App client ID (`CognitoUserPoolClientId` output). |
  | `region` | string | no | QuickSight/Cognito region. |
  | `scopes` | string[] | no | OAuth scopes (e.g. `["openid","email","profile"]`). |
  | `redirectUri` | string | no | Post-login redirect; must match a `CallbackUrls` entry. |
  | `logoutUri` | string | no | Post-logout redirect; must match a `LogoutUrls` entry. |

- **Example:**
  ```json
  "auth": {
    "userPoolDomain": "https://myco-analytics.auth.us-east-1.amazoncognito.com",
    "clientId": "YOUR_COGNITO_APP_CLIENT_ID",
    "region": "us-east-1",
    "scopes": ["openid", "email", "profile"],
    "redirectUri": "https://app.example.com/index.html",
    "logoutUri": "https://app.example.com/index.html"
  }
  ```

### `chatEnabled`

- **Type:** boolean
- **Default:** `false`
- **Description:** When `true`, chat-type tabs render and Q&A embedding is
  active. When `false`, chat tabs are hidden and deep links targeting chat fall
  back to the default tab.
- **Example:** `true`

### `chatUserPoolSize`

- **Type:** integer
- **Default:** none
- **Minimum:** `2`
- **Description:** Number of pre-provisioned QuickSight reader users available
  for chat session rotation. Informational on the client; the actual pool is
  configured in the SAM `ChatUserArns` parameter.
- **Example:** `5`

### `containerId`

- **Type:** string
- **Default:** `"quicksuite-widget-container"`
- **Description:** HTML `id` of the container `<div>` the widget renders into.
- **Example:** `"analytics-widget"`

### `errorMessage`

- **Type:** string
- **Default:** a generic "service temporarily unavailable" message
- **Description:** Message shown after all retries fail.
- **Example:** `"Analytics are temporarily unavailable. Please try again."`

### `fallbackMode`

- **Type:** boolean
- **Default:** `true`
- **Description:** When `true`, the failure state includes a **Retry** button.
- **Example:** `false`

### `loadingScreen`

- **Type:** boolean
- **Default:** `true`
- **Description:** When `true`, a branded loading indicator shows during
  initialization and view loads.
- **Example:** `false`

## Navigation tab object

Each entry under `navigation` has this shape:

| Field | Type | Required | Description |
|---|---|---|---|
| `label` | string (≤40 chars) | yes | Display label for the tab. |
| `icon` | string | no | Icon identifier / glyph shown before the label. |
| `hidden` | boolean | no (default `false`) | When `true`, the tab is not rendered. |
| `type` | `"dashboard"` \| `"chat"` | no | Tab kind. `chat` embeds Q&A; anything else embeds dashboards. |
| `mobileShowSubNav` | boolean | no (default `true`) | When `false`, the secondary sub-nav is hidden on mobile (≤768px). |
| `subItems` | array | no | Sub-navigation entries (see below). |

### Sub-item object

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | string | yes | Unique sub-item identifier (used by deep links). |
| `label` | string (≤40 chars) | yes | Display label. |
| `icon` | string | no | Icon (emoji or name) shown for this sub-item in the sidebar. |
| `dashboardId` | string (UUID) | yes | QuickSight dashboard ID. |
| `sheetId` | string | yes | Sheet ID within the dashboard. |
| `mobileDashboardId` | string (UUID) | no | Dashboard ID used on mobile viewports. |
| `mobileSheetId` | string | no | Sheet ID used on mobile viewports (falls back to `sheetId`). |
| `filters` | string[] | no | Filter ids enabled on this sheet (see [Per-sheet filters](#per-sheet-filters-subitemsfilters)). Omit to enable all. |

Rendering rules:
- A tab with **2 or more** sub-items renders a secondary navigation bar.
- A tab with **exactly 1** sub-item loads that sub-item directly (no sub-nav).

## Deep linking

The initial view can be controlled via URL query parameters (highest priority)
or `data-*` attributes on the container:

| Parameter | Data attribute | Description |
|---|---|---|
| `tab` | `data-initial-tab` | Tab id to open. Invalid → default (first) tab. |
| `item` | `data-initial-item` | Sub-item id within the tab. Invalid → tab's first sub-item. |
| `view` | — | `view=chat` opens the chat tab (if `chatEnabled`). |
| `prompt` | — | With `view=chat`, pre-fills the Q&A input (max 500 chars, not auto-submitted). |

All values are URL-decoded, HTML-stripped, and length-limited before use.

Example: `?tab=regional&item=territory-detail`

## Full example

```json
{
  "apiEndpoint": "https://abc123.execute-api.us-east-1.amazonaws.com/prod",
  "navigation": {
    "overview": {
      "label": "Overview",
      "icon": "chart-bar",
      "type": "dashboard",
      "subItems": [
        { "id": "revenue-summary", "label": "Revenue Summary",
          "dashboardId": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeee01",
          "sheetId": "sheet-revenue-001" },
        { "id": "quarterly-trends", "label": "Quarterly Trends",
          "dashboardId": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeee01",
          "sheetId": "sheet-trends-002" }
      ]
    },
    "qa": { "label": "Ask Analytics", "icon": "message-circle", "type": "chat" }
  },
  "session": { "expirationMinutes": 60 },
  "branding": {
    "appName": "Acme Analytics",
    "appIcon": "📊",
    "tagline": "Revenue, trends & AI assistant",
    "primaryColor": "#1E3A5F",
    "secondaryColor": "#4A90D9"
  },
  "datasetIdentifier": "sales-analytics",
  "filters": [
    { "id": "region", "label": "Region", "column": "region",
      "type": "multiselect", "allLabel": "All Regions",
      "options": ["North", "South", "East", "West"] },
    { "id": "order_date", "label": "Order Date", "column": "order_date",
      "type": "daterange" }
  ],
  "chat": {
    "agentId": "my-analytics-assistant",
    "panelTitle": "Ask Analytics",
    "toggleLabel": "AI Assistant"
  },
  "auth": {
    "userPoolDomain": "https://acme-analytics.auth.us-east-1.amazoncognito.com",
    "clientId": "YOUR_COGNITO_APP_CLIENT_ID",
    "region": "us-east-1",
    "scopes": ["openid", "email", "profile"],
    "redirectUri": "https://app.example.com/index.html",
    "logoutUri": "https://app.example.com/index.html"
  },
  "chatEnabled": true,
  "chatUserPoolSize": 5,
  "containerId": "quicksuite-widget-container",
  "fallbackMode": true,
  "loadingScreen": true
}
```
