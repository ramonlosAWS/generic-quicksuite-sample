<!--
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
-->

# Troubleshooting

Common deployment and embedding issues, with symptom, root cause, and step-by-step
resolution.

## 1. Container is blank / nothing renders

**Symptom:** The page loads but the widget area stays empty. The browser console
shows a warning like `Container element with ID "quicksuite-widget-container"
not found within 10 seconds`.

**Cause:** The container `<div>` id does not match the widget's configured
`containerId`, or the widget script runs before the container exists and the
container never appears.

**Resolution:**
1. Confirm the host page has `<div id="quicksuite-widget-container"></div>`
   (or whatever `containerId` is set to in `config.json`).
2. Ensure the `<script>` that loads the widget is present on the page.
3. If the container is injected dynamically, make sure it appears within 10
   seconds of `DOMContentLoaded` (the widget waits via a MutationObserver).

## 2. "Configuration could not be loaded" or "Configuration is invalid"

**Symptom:** An inline error message appears in the container. The console shows
an HTTP status (for fetch failures) or a validation path + constraint (for
schema errors).

**Cause:** `config.json` could not be fetched (wrong path / opened via
`file://`) or it violates `config.schema.json`.

**Resolution:**
1. Serve the widget over HTTP, not `file://` — browsers block `fetch` of local
   files. For local testing: `python3 -m http.server 8080`.
2. For validation errors, read the console message: it names the failing
   property path (e.g. `/session/expirationMinutes`) and the constraint
   (e.g. `maximum`). Fix that field. See `configuration-reference.md`.
3. Validate quickly by loading `config.json` and `config.schema.json` through
   any JSON Schema (draft-07) validator.

## 3. API returns HTTP 403 (Forbidden)

**Symptom:** The widget shows the error/retry state; the network tab shows a 403
from `/dashboard-embed` or `/chat-embed`.

**Cause:** Either the request `Origin` is not in the backend's `AllowedOrigins`,
or the requested dashboard ID is not in the `DashboardIds` allowlist. Both are
deliberate security checks and the response intentionally does not reveal which
one failed.

**Resolution:**
1. Confirm the page's origin (scheme + host + port, e.g.
   `http://localhost:8080`) is included in the SAM `AllowedOrigins` parameter.
2. Confirm every `dashboardId` in `config.json` is included in the SAM
   `DashboardIds` parameter.
3. Redeploy the backend after changing parameters, and confirm `config.json`
   points at the redeployed API endpoint.

## 4. SPICE / dashboard shows "not authorized" or renders blank inside the embed

**Symptom:** The API returns a 200 embed URL and the QuickSight frame loads, but
shows a permission error instead of the dashboard.

**Cause:** The registered embed user does not have access to the dashboard, or
the host domain is not allowed in QuickSight's embedding settings.

**Resolution:**
1. In QuickSight, share the dashboard with the registered embed user(s) as
   **Viewer** (see `sample-data/setup-guide.md`, Step 5).
2. In **Manage QuickSight → Domains and Embedding**, add your host domain
   (exact scheme and port).
3. Confirm `DashboardEmbedUserArn` in the SAM template is a real registered
   user ARN in the identity region (usually `us-east-1`).

## 5. Session could not be authenticated (401/403 after a retry)

**Symptom:** After navigating for a while, the widget shows "Session could not
be authenticated."

**Cause:** The cached embed URL expired or the backing session is no longer
valid; the widget cleared its cache and retried once, and the retry also failed.

**Resolution:**
1. Reload the page to obtain fresh embed URLs.
2. If it recurs quickly, lower `session.expirationMinutes` in `config.json` so
   cached URLs are refreshed sooner, and confirm the embed users are still
   registered and active in QuickSight.

## 6. Chat tab shows "Service is busy" (HTTP 503)

**Symptom:** Opening the chat tab shows a busy state with a countdown, or the
network tab shows 503 with a `Retry-After` header from `/chat-embed`.

**Cause:** Every registered user in the chat pool currently has an active
session — the pool is exhausted.

**Resolution:**
1. Wait for the countdown / `Retry-After` window (a session frees up after
   `session.expirationMinutes`).
2. For sustained concurrency, add more registered users and list their ARNs in
   the SAM `ChatUserArns` parameter (minimum 2), then redeploy.

## 7. SPICE ingestion / stale data

**Symptom:** The dashboard renders but data looks stale after you updated the
source.

**Cause:** SPICE datasets serve a cached snapshot; new data is not visible until
the dataset is refreshed.

**Resolution:** Refresh the dataset in QuickSight (manual refresh or a scheduled
refresh), then reload the widget.

## 8. Embed fails with "Operation is disabled for identities managed by IAM Identity Center"

**Symptom:** In `per-user` identity mode, authenticated requests fail; the
Lambda logs an `AccessDeniedException` from `RegisterUser` with the message
above.

**Cause:** The QuickSight account is managed by IAM Identity Center, which
disables API-based `RegisterUser`. You cannot just-in-time provision QuickSight
users in such accounts.

**Resolution:** Deploy with `EmbedIdentityMode=shared` and set
`DashboardEmbedUserArn` (and the first `ChatUserArns` entry) to an existing
registered QuickSight user. Login is still enforced; all authenticated viewers
embed as that shared identity. For true per-user identity in an Identity
Center account, federate those Identity Center users into QuickSight and embed
as the existing identities.

## 9. Endless redirect to the login page / 401 on every embed call

**Symptom:** The widget keeps bouncing to the Cognito Hosted UI, or the network
tab shows 401 on `/dashboard-embed` even after logging in.

**Cause / resolution:**
- The `redirectUri` in `config.json` must exactly match a `CallbackUrls` entry
  registered on the Cognito app client (scheme, host, port, and path).
- The `clientId` and `userPoolDomain` in `config.json` must match the deployed
  stack outputs (`CognitoUserPoolClientId`, `CognitoHostedUiDomain`).
- Confirm the app client has the implicit OAuth flow and the `openid email
  profile` scopes enabled (the template sets these).
- A 401 with a token usually means the token expired — the widget will redirect
  to re-login automatically; if it loops, check that the token's `aud` matches
  the app client id.

## Still stuck?

- Backend behavior is covered by the Jest suite (`npm test`) and the SAM
  template validates with `sam validate --lint`.
- Check CloudWatch Logs for the embed Lambdas — audit-log write failures and
  QuickSight API errors are logged there (without leaking secrets to clients).
