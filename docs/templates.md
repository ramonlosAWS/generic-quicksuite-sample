<!--
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
-->

# Layout Templates

The widget ships with **two ready-to-host page templates**. Both embed the same
dashboards and generative Q&A, both are driven by the same `widget/config.json`,
and both use the same widget bundle. They differ in **who composes the page**:
the top-nav template is widget-driven (the widget renders navigation, the filter
bar, and chat as a single drop-in), while the split-pane template is host-driven
(the host page renders a sidebar, filter bar, and docked chat around the widget).
Pick the one that fits the page you are embedding into.

| Template file | Name | Navigation | Chat |
|---|---|---|---|
| `widget/index.html` | **Modern split-pane** | Left sidebar (host-driven) | Docked side panel |
| `widget/index-topnav.html` | **Classic top-navigation** | Horizontal top tab bar (widget-driven) | Auto-opening side panel |

Both templates are interchangeable: change which HTML file you host (and, if you
use CloudFront, which file you upload) — nothing else changes. `config.json`,
`quicksuite-widget.js` / the bundle, and the backend are identical for both.

## The two templates at a glance

### Classic top-navigation (`index-topnav.html`)

A full-width, **widget-driven** layout: the widget renders everything inside the
container from `config.json` — a horizontal top tab bar (plus a secondary sub-nav
for a tab's sub-items), an **app-level filter bar** beneath the navigation, the
embedded dashboard, and a **chat panel that opens automatically** beside the
dashboard on desktop. The host page contributes only a slim brand bar.

```
┌─────────────────────────────────────────────────────┐
│  🪑  Brand name                    (host brand bar)  │
├──────────────────────────────────────────────────────┤
│  [ Sheet 1 ] [ Sheet 2 ] [ Sheet 3 ]  (widget nav)   │
│  Filters:  [ Facility ▾ ]  [ Severity ▾ ]  (widget)  │
├───────────────────────────────────────────┬──────────┤
│                                            │  chat    │
│              embedded dashboard            │  panel   │
│                                            │ (opens)  │
└───────────────────────────────────────────┴──────────┘
```

Choose this for a true single-`<script>` drop-in where the widget owns the whole
experience — navigation, filters, and chat — while still getting a filter bar and
side-by-side chat. It is the best choice when embedding into a page that does not
have its own navigation shell.

**How it is wired (what makes it "top-nav"):**
- The host page does **not** hide `.qs-nav` / `.qs-sub-nav`, so the widget
  renders its own top navigation, secondary sub-navigation, and the app filter
  bar (beneath the nav) from `config.filters`.
- The container has **no** `data-no-chat-bubble`, so the widget mounts its own
  chat panel and auto-opens it beside the dashboard on desktop.
- The only host JavaScript reads `config.json` to fill the brand bar; navigation,
  filtering, embedding, and chat are all handled inside the widget.

### Modern split-pane (`index.html`)

A full app shell: a top bar, a **collapsible left sidebar** for navigation, the
dashboard in the center, and chat **docked in a right-hand panel**. Here the
**host page drives navigation** (it hides the widget's built-in nav) and controls
the chat panel.

```
┌───────────────────────────────────────────────┐
│  🪑  Brand name              [ AI Assistant ]   │  ← top bar + chat toggle
├──────┬──────────────────────────────┬──────────┤
│ nav  │  filter bar                  │  chat    │
│ ▸ S1 │                              │  panel   │
│ ▸ S2 │      embedded dashboard      │ (docked) │
│ ▸ S3 │                              │          │
└──────┴──────────────────────────────┴──────────┘
```

Choose this when you want a self-contained analytics portal, a persistent
side-by-side chat experience, or a global filter bar above the dashboard.

**How it is wired (what makes it "split-pane"):**
- The host page hides `.qs-nav` / `.qs-sub-nav` with CSS and renders its own
  sidebar from `config.navigation`.
- The container sets `data-no-chat-bubble` to suppress the floating bubble, and
  the host page instead calls `window.__quicksuiteWidget.embedChatInto(...)` to
  dock chat in the right panel.
- The host page renders the filter bar and calls `getDashboardFrame()` to drive
  sheet switching and filters.

## Choosing a template

| If you want… | Use |
|---|---|
| Navigation as tabs across the top | **Classic top-navigation** |
| Navigation as a left sidebar | **Modern split-pane** |
| A filter bar, docked side-by-side chat, and a full-width app shell | either template (both include these) |
| The smallest amount of host-page code | a custom minimal page (see "Building your own host page") |

## Shared setup (applies to both templates)

Both templates depend on the same three inputs, documented in the main README
and [`configuration-reference.md`](configuration-reference.md):

1. **`config.json`** — `apiEndpoint`, `navigation`, `branding`, `chatEnabled`,
   `session`, and (registered-user variant) the `auth` block. Both templates
   read these fields; branding colors, `appName`/`appIcon`/`tagline`, and the
   navigation map behave identically across templates.
2. **The widget** — `quicksuite-widget.js` for local testing, or the built
   `quicksuite-widget-bundled.js` for production (see the README's
   "Build the self-contained bundle" step).
3. **The backend** — the deployed SAM API whose `ApiEndpoint` you put in
   `config.json`. Neither template changes the backend.

### Navigation behavior by template

The `navigation` map drives both templates, but is surfaced differently:

- **Classic top-navigation** — the widget renders each dashboard tab as a top
  tab (a tab with 2+ `subItems` also gets a horizontal sub-nav row) and renders
  the app filter bar beneath the nav. `type: "chat"` tabs are not shown as tabs —
  chat is the widget's own auto-opening panel.
- **Modern split-pane** — the host page hides the widget's nav and lists the
  first dashboard tab's `subItems` as left-sidebar entries, and the host renders
  the filter bar. Chat is the docked panel.

### Chat behavior by template

Chat requires `chatEnabled: true` in `config.json` **and** `ChatEnabled=true` on
the backend deployment (see the README).

- **Classic top-navigation** → the widget mounts its own chat panel and
  auto-opens it beside the dashboard on desktop.
- **Modern split-pane** → docked right-hand panel mounted by the host page via
  `embedChatInto`. The container's `data-no-chat-bubble` suppresses the widget's
  own panel so you don't get both.

To hide chat entirely in either template, set `chatEnabled: false`.

## Switching templates

### Local testing

Serve the `widget/` directory and open whichever file you want:

```bash
cd widget
python3 -m http.server 8080
# Classic top-navigation:
#   http://localhost:8080/index-topnav.html
# Modern split-pane:
#   http://localhost:8080/index.html
```

Deep-link parameters work the same in both:
`?tab=overview&item=quality` or `?view=chat&prompt=Top%20products%20this%20quarter`.

### CloudFront hosting

Host whichever template you prefer as your entry page. If you want the classic
top-nav layout to be the default page, upload `index-topnav.html` and either
reference it directly or set it as the CloudFront default root object. See
[`operations.md`](operations.md) for upload + cache-invalidation commands. You
can also host both files and link between them.

## Building your own host page

Neither template is required — they are references. To embed in your own page,
copy the wiring from whichever template is closer:

- For a **widget-driven** page (like `index-topnav.html`), do the least: a
  container `<div>` and the widget `<script>`. Do not hide `.qs-nav` and do not
  set `data-no-chat-bubble` — the widget renders its own nav, app filter bar, and
  chat panel.
- For a **host-driven** page (like `index.html`), hide `.qs-nav` / `.qs-sub-nav`,
  add `data-no-chat-bubble`, drive navigation with `getDashboardFrame()` +
  `setSelectedSheetId(...)`, render your own filter bar, and dock chat with
  `embedChatInto(...)`.

See [`customization.md`](customization.md) for the full list of host-page
integration hooks exposed on `window.__quicksuiteWidget`.
