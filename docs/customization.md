<!--
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
-->

# Customization Guide

Almost everything visible in the widget is driven by `widget/config.json` — no
code changes required. This guide walks through the common customizations. For
the exhaustive field reference (types, defaults, ranges) see
[`configuration-reference.md`](configuration-reference.md).

## Where customization happens

There are two consumers of `config.json`, and knowing which one owns a setting
tells you where to look when something doesn't render:

| Layer | File | Owns |
|---|---|---|
| **Widget** | `widget/quicksuite-widget.js` (built into `-bundled.js`) | Navigation bar, dashboard/chat embedding, theme colors (`primaryColor`/`secondaryColor`), nav logo (`logoUrl`), the chat agent (`chat.agentId`), session caching, deep links. |
| **Sample host page** | `widget/index.html` | Top bar (`appName`, `appIcon`, `tagline`), the filter bar (`filters`), the chat panel chrome (`chat.panelTitle`, `chat.toggleLabel`). |

If you embed the widget into your **own** page instead of the sample
`index.html`, the widget still renders navigation and the embeds; the top
bar/filter bar/chat-panel chrome are yours to build (you can read the same
`config.json` fields to drive them).

After editing `config.json`, if you host via CloudFront you must invalidate the
cache — see [`operations.md`](operations.md).

## Layout templates (pick a host page)

The widget ships with **two host-page templates**. Both embed the same content
from the same `config.json`; they differ only in how navigation and chat are
laid out:

| Template file | Name | Navigation | Chat |
|---|---|---|---|
| `widget/index.html` | **Modern split-pane** | Left sidebar (host-driven) | Docked side panel |
| `widget/index-topnav.html` | **Classic top-navigation** | Horizontal top tab bar (widget-driven) | Floating bubble |

- **Classic top-navigation** is the minimal, "widget owns everything" option:
  the widget renders its own top tab bar and a floating chat bubble; the host
  page is just a slim brand bar. Best when embedding into a page that has no
  side navigation of its own.
- **Modern split-pane** is the full app-shell option used by the rest of this
  guide: a left sidebar drives navigation, chat is docked in a right panel, and
  a filter bar sits above the dashboard.

Switch templates by hosting a different HTML file — nothing else changes. See
[`templates.md`](templates.md) for the full comparison, wiring details, and a
"which should I use" guide. The customization sections below (branding,
navigation, chat, session) apply to both templates; the filter bar and
chat-panel chrome (sections 3 and 4) are specific to the split-pane host page.

## 1. Rebrand (name, tagline, colors, logo)

```json
"branding": {
  "appName": "Acme Analytics",
  "appIcon": "📊",
  "tagline": "Revenue, trends & AI assistant",
  "primaryColor": "#1E3A5F",
  "secondaryColor": "#4A90D9",
  "logoUrl": "https://cdn.example.com/logo.png"
}
```

- `primaryColor` sets the navigation background and loading screen; `secondaryColor`
  is the active-tab / accent color. Both must be 6-digit hex (`#RRGGBB`).
- `logoUrl` renders in the widget's nav header (max 32px tall). If it fails to
  load it is hidden automatically. When `logoUrl` is unset, the host page shows
  `appIcon` as the logo mark instead.
- `appName` / `tagline` populate the sample host page's top bar and the browser
  tab title.

## 2. Change the navigation (tabs, sub-items, dashboards)

Navigation is a map of `tab-id → tab definition`. The key is the tab id used by
deep links. You can have 1–10 tabs.

```json
"navigation": {
  "overview": {
    "label": "Overview",
    "icon": "chart-bar",
    "type": "dashboard",
    "subItems": [
      { "id": "revenue", "label": "Revenue",
        "dashboardId": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeee01",
        "sheetId": "sheet-revenue-001" },
      { "id": "trends", "label": "Trends",
        "dashboardId": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeee01",
        "sheetId": "sheet-trends-002" }
    ]
  },
  "qa": { "label": "Ask Analytics", "icon": "message-circle", "type": "chat" }
}
```

Rules:
- A tab with **2+ sub-items** renders a secondary sub-navigation bar. A tab with
  **exactly 1** sub-item loads it directly (no sub-nav).
- `type: "dashboard"` (default) embeds a dashboard sheet; `type: "chat"` embeds
  generative Q&A (requires `chatEnabled: true`).
- `hidden: true` keeps a tab defined but unrendered — handy for staging.

### Add a new dashboard

1. Note the dashboard's **dashboard ID** and the target **sheet ID** in
   QuickSight.
2. Add a sub-item (or a new tab) with those IDs.
3. Add the dashboard ID to the backend `DashboardIds` allowlist parameter and
   redeploy (see [`operations.md`](operations.md)). Requests for IDs not in the
   allowlist are rejected with HTTP 403 by design.
4. Share the dashboard with the embed user(s) in QuickSight.

### Mobile-specific sheets

Set `mobileDashboardId` / `mobileSheetId` on a sub-item to swap in a
mobile-optimized sheet below the 768px breakpoint. `mobileSheetId` falls back
to `sheetId` if omitted.

## 3. Add filter controls

`filters` renders a row of filter controls above the dashboard. Filtering uses
the QuickSight Embedding SDK's **filter-group API** against real dataset
columns — no dashboard parameters needed. Set the top-level
`datasetIdentifier` to the DataSetIdentifier your dashboard references, then
declare each control:

```json
"datasetIdentifier": "sales-analytics",
"filters": [
  { "id": "region", "label": "Region", "column": "region",
    "type": "multiselect", "allLabel": "All Regions",
    "options": ["North", "South", "East", "West"] },
  { "id": "order_date", "label": "Order Date", "column": "order_date",
    "type": "daterange" }
]
```

- `type` is `multiselect` (default), `single`, or `daterange`. Date filters
  support optional `min`/`max` bounds and custom relative `presets`
  (`{label, n, unit}`).
- Scope filters per sheet with the sub-item's `filters` array (list of filter
  `id`s). Omit it to enable all filters on that sheet. Selections persist when
  switching between sheets that share a filter.
- Filter groups are scoped to the selected sheet and re-applied automatically
  on every sheet change.

## 4. Configure chat (Q&A)

```json
"chatEnabled": true,
"chat": {
  "agentId": "my-analytics-assistant",
  "panelTitle": "Ask Analytics",
  "toggleLabel": "AI Assistant"
}
```

- `chatEnabled` must be `true` for chat tabs/panel to render — and the backend
  must be deployed with `ChatEnabled=true`.
- `chat.agentId` points chat at a specific QuickSight Agent (passed to the
  Embedding SDK as `fixedAgentId`). If omitted, the sample agent
  (`furniture-operations-assistant`) is used.
- `panelTitle` / `toggleLabel` label the floating chat panel and its toggle
  button in the sample host page.

## 5. Session and resilience behavior

```json
"session": { "expirationMinutes": 60 },
"loadingScreen": true,
"fallbackMode": true,
"errorMessage": "Analytics are temporarily unavailable. Please try again."
```

- `session.expirationMinutes` (1–120, default 30) controls how long a cached
  embed URL is reused before a fresh one is fetched.
- `loadingScreen: false` suppresses the branded loading indicator.
- `fallbackMode: true` shows a **Retry** button on the failure state.
- `errorMessage` overrides the generic failure text.

## 6. Authentication (Cognito)

The `auth` block turns on Cognito Hosted UI login. Populate it from the backend
stack's Cognito outputs:

```json
"auth": {
  "userPoolDomain": "https://<prefix>.auth.us-east-1.amazoncognito.com",
  "clientId": "<CognitoUserPoolClientId>",
  "region": "us-east-1",
  "scopes": ["openid", "email", "profile"],
  "redirectUri": "https://app.example.com/index.html",
  "logoutUri": "https://app.example.com/index.html"
}
```

- `redirectUri` / `logoutUri` must exactly match the backend `CallbackUrls` /
  `LogoutUrls` parameters (scheme, host, port, path).
- Omit the entire `auth` block to run without login (shared/anonymous embed
  identity). See the main README for `per-user` vs `shared` embed identity.

## 7. Change the container id

If the host page's mount `<div>` uses a different id:

```json
"containerId": "analytics-widget"
```

Match it in the host page: `<div id="analytics-widget"></div>`.

## 8. Restyle beyond config (advanced)

The widget scopes all its CSS to the container element, so it won't collide with
host-page styles. To go past what `branding` exposes:

- Edit the sample host page `widget/index.html` — its top bar, filter bar, and
  chat panel are plain HTML/CSS you fully control.
- To alter the widget's internal chrome, edit `widget/quicksuite-widget.js` and
  **rebuild the bundle**: `node build-bundled.js`. Never hand-edit
  `quicksuite-widget-bundled.js` (it is generated).

## Applying changes

- **Local:** re-run `python3 -m http.server 8080` in `widget/` and reload.
- **CloudFront-hosted:** re-upload the changed files and invalidate the cache —
  see [`operations.md`](operations.md).
- **Backend-affecting changes** (new dashboard IDs, new origins, chat toggle,
  chat pool): update the SAM parameters and redeploy — see
  [`operations.md`](operations.md).
