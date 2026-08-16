<!--
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
-->

# Generic QuickSuite Widget

A generic, open-source sample that embeds Amazon QuickSight dashboards and
generative Q&A (Chat) into any web page using a **single `<script>` tag**,
backed by a serverless AWS SAM API. It is a reference architecture for
Solutions Architects and developers evaluating QuickSight embedding.

> **Disclaimer:** This code is provided as a sample for demonstration purposes.
> It is not intended for production use without review and modification to meet
> your own security, scalability, and operational requirements.

## Features

- **Single script tag deployment** — no build tools or framework dependencies
  on the host page.
- **Registered-user embedding only** — uses
  `GenerateEmbedUrlForRegisteredUser`; never anonymous/public embedding.
- **End-user login via Amazon Cognito** — viewers authenticate through the
  Cognito Hosted UI; the API is protected by a Cognito authorizer and every
  embed request carries the user's verified token.
- **Config-driven navigation** — tabs, sub-navigation, branding, and session
  settings all live in a single `config.json`.
- **Dashboard + generative Q&A (Chat)** embedding via the QuickSight Embedding
  SDK, with LRU rotation across a pool of registered chat users.
- **Deep linking** — control the initial tab, sub-item, or chat prompt via URL
  parameters or `data-*` attributes.
- **Mobile responsive**, with per-viewport sheet IDs.
- **Resilient** — session caching, exponential-backoff retries, and graceful
  error/busy states.
- **Auditable** — every embed request is logged to DynamoDB with a TTL.

## Architecture overview

```
Host page (script tag + div)
   → Widget (config-driven, QuickSight Embedding SDK)
      → API Gateway  →  Lambda (GenerateEmbedUrlForRegisteredUser)
                              → QuickSight
                              → DynamoDB (audit log)
                              → S3 (chat user-pool state)
```

See [`docs/architecture.md`](docs/architecture.md) for the full component
diagram and design decisions.

## Repository layout

```
generic-quicksuite-sample/
├── README.md                 # this file
├── CONTRIBUTING.md
├── LICENSE                   # Apache 2.0
├── backend/                  # AWS SAM app (API Gateway + Lambda + DynamoDB + S3)
│   ├── template.yaml
│   ├── dashboard-embed/      # dashboard embed Lambda
│   ├── chat-embed/           # chat embed Lambda (LRU user pool)
│   └── shared/               # validator, cors-helper, audit-logger
├── widget/                   # browser widget
│   ├── quicksuite-widget.js  # source
│   ├── build-bundled.js      # produces the self-contained bundle
│   ├── config.json           # sample configuration
│   ├── config.schema.json    # JSON Schema for config validation
│   └── index.html            # sample host page
├── docs/                     # architecture, configuration, troubleshooting
└── sample-data/              # sample CSV + dashboard setup guide
```

## Prerequisites

| Requirement | Version / note |
|---|---|
| Node.js | 18.x or later |
| AWS CLI | v2 |
| AWS SAM CLI | v1.90 or later |
| AWS account | QuickSight **Enterprise** edition enabled |
| Permissions | QuickSight author + embedding, plus CloudFormation/Lambda/API Gateway/DynamoDB/S3/IAM for deployment |

## Deployment

Estimated time: **under 30 minutes.**

### 1. Clone and install

```bash
git clone https://github.com/aws-samples/generic-quicksuite-sample.git
cd generic-quicksuite-sample
npm install            # dev/test tooling
```

### 2. Prepare a dashboard and embed users

If you do not already have a dashboard, follow
[`sample-data/setup-guide.md`](sample-data/setup-guide.md) to create one from
the included sample data and to register the reader user(s) used for embedding.
Collect:

- your **dashboard ID(s)** and **sheet ID(s)**,
- the **dashboard embed user ARN**,
- (for chat) at least **two chat user ARNs**,
- the **host domain(s)** that will embed the widget.

### 3. Build and deploy the backend

```bash
cd backend
sam build
sam deploy --guided
```

During `--guided`, supply these parameters:

| Parameter | Example | Notes |
|---|---|---|
| `QuickSightAccountId` | `123456789012` | 12-digit account ID |
| `QuickSightRegion` | `us-east-1` | from the allowed list |
| `QuickSightNamespace` | `default` | |
| `DashboardIds` | `aaaaaaaa-...-01,aaaaaaaa-...-02` | comma-delimited allowlist |
| `AllowedOrigins` | `https://example.com,http://localhost:8080` | comma-delimited |
| `DashboardEmbedUserArn` | `arn:aws:quicksight:us-east-1:123456789012:user/default/embed-reader-1` | |
| `ChatUserArns` | `arn:...chat-user-1,arn:...chat-user-2` | min 2 (required if chat enabled) |
| `ChatEnabled` | `true` | `true`/`false` |
| `AuditLogTtlDays` | `90` | 1–365 |
| `CognitoDomainPrefix` | `myco-analytics-<acct>` | globally-unique Hosted UI domain prefix |
| `CallbackUrls` | `http://localhost:8080/index.html` | OAuth login redirect URL(s) |
| `LogoutUrls` | `http://localhost:8080/index.html` | post-logout redirect URL(s) |
| `EmbedIdentityMode` | `per-user` | `per-user` (JIT per email) or `shared` (one existing user; required for IAM Identity Center accounts) |
| `RateLimitPerMinute` | `60` | Per-IP embed requests/min (0 disables). Enforced in-Lambda (fail-open). |
| `ApiThrottleRateLimit` | `50` | API Gateway steady-state requests/sec |
| `ApiThrottleBurstLimit` | `100` | API Gateway burst capacity |

### Built-in protections (no extra setup)

- **Cognito authorizer** on both endpoints (unauthenticated calls get `401`).
- **Per-IP rate limiting** (DynamoDB counter, fail-open) → HTTP `429` + `Retry-After`.
- **API Gateway stage throttling** and a **15-minute chat session cap**.
- **CloudFront security headers**: HSTS, `nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy`, scoped **CSP**.
- For production, prefer Authorization Code + PKCE over the implicit flow and enable Cognito MFA / Advanced Security.

After deploy, copy the `CognitoUserPoolClientId` and `CognitoHostedUiDomain`
outputs into the widget's `config.json` `auth` block (see
[Authentication](#authentication-amazon-cognito)). Then, in the Cognito console
(or CLI), create at least one user in the pool so someone can log in.

**Expected output:** the deploy prints stack outputs including
`ApiEndpoint` — copy this value.

```
Key                 ApiEndpoint
Description         API Gateway endpoint URL
Value               https://abc123.execute-api.us-east-1.amazonaws.com/prod
```

### 4. Configure the widget

Edit `widget/config.json`:

- set `apiEndpoint` to the `ApiEndpoint` output from step 3,
- set each sub-item's `dashboardId` / `sheetId` to your real values,
- set `chatEnabled` to match how you deployed the backend,
- optionally adjust `branding`, `session.expirationMinutes`, etc.

See [`docs/configuration-reference.md`](docs/configuration-reference.md) for
every option.

### 5. (Optional) Build the self-contained bundle

For a true single-file distribution that inlines the QuickSight Embedding SDK:

```bash
cd widget
node build-bundled.js       # writes quicksuite-widget-bundled.js
```

Host pages can then use just the bundle (no separate SDK script tag).

### 6. Verify

```bash
cd widget
python3 -m http.server 8080
```

Open <http://localhost:8080/index.html>. You should see the widget's navigation
bar and your embedded dashboard rendering live visuals. Switching tabs/sub-items
navigates between sheets; the chat tab (if enabled) opens QuickSight Q&A.

To preview the classic top-navigation layout instead, open
<http://localhost:8080/index-topnav.html> (see
[Layout templates](#layout-templates)).

Deep-link examples:
- `http://localhost:8080/index.html?tab=regional&item=territory-detail`
- `http://localhost:8080/index.html?view=chat&prompt=Top%20products%20this%20quarter`

### 7. (Optional) Host the widget on CloudFront

The included `hosting/` stack provisions a private S3 bucket served over HTTPS
via CloudFront (Origin Access Control + security headers):

```bash
aws cloudformation deploy \
  --template-file hosting/template.yaml \
  --stack-name quicksuite-widget-hosting \
  --region us-east-1
```

Then upload `widget/index.html`, `widget/quicksuite-widget-bundled.js`, and
`widget/config.json` to the bucket and invalidate the cache. Add the resulting
CloudFront URL to the backend `AllowedOrigins` (and to the Cognito
`CallbackUrls`/`LogoutUrls`), then redeploy. Full commands are in
[`docs/operations.md`](docs/operations.md#host-the-widget-cloudfront).

## Managing, monitoring & customizing

Once deployed, see:

- [`docs/operations.md`](docs/operations.md) — update config and invalidate the
  CDN, redeploy with changed parameters, manage the Cognito user pool and the
  chat reader pool, and **tear everything down**.
- [`docs/monitoring.md`](docs/monitoring.md) — CloudWatch log groups, Logs
  Insights queries, querying the DynamoDB audit log, recommended alarms, and
  cost tracking.
- [`docs/customization.md`](docs/customization.md) — rebrand, add tabs and
  dashboards, add filter dropdowns, and point chat at your own agent.

## Authentication (Amazon Cognito)

Viewers log in before any dashboard is embedded. The flow:

1. The widget loads and checks for a valid Cognito **id token**. If none, it
   redirects the browser to the Cognito **Hosted UI** to log in.
2. After login, Cognito redirects back to the host page with the id token in
   the URL fragment. The widget captures it, stores it in `sessionStorage`,
   and removes it from the address bar.
3. Every call to `/dashboard-embed` and `/chat-embed` sends the id token as an
   `Authorization: Bearer <token>` header.
4. API Gateway's **Cognito authorizer** cryptographically validates the token
   and rejects anything unauthenticated with **401**. The Lambda reads the
   verified identity from the token claims (never from the request body).

Configure the widget's `config.json` `auth` block with the stack's Cognito
outputs (`CognitoUserPoolClientId`, `CognitoHostedUiDomain`):

```json
"auth": {
  "userPoolDomain": "https://<prefix>.auth.<region>.amazoncognito.com",
  "clientId": "<CognitoUserPoolClientId>",
  "region": "us-east-1",
  "scopes": ["openid", "email", "profile"],
  "redirectUri": "http://localhost:8080/index.html",
  "logoutUri": "http://localhost:8080/index.html"
}
```

Both the `redirectUri` and `logoutUri` must also be registered on the app
client (the `CallbackUrls` / `LogoutUrls` deploy parameters). Omit the `auth`
block entirely to run without login (anonymous/shared-identity mode).

### Embed identity: `per-user` vs `shared` (the `EmbedIdentityMode` parameter)

Once a viewer is authenticated, the backend must embed as a **registered
QuickSight user**. There are two modes:

- **`per-user`** (default) — the viewer's verified email becomes their
  QuickSight username, and a reader is registered just-in-time if needed. Each
  viewer is their own QuickSight identity (per-person row-level security and
  audit). Requires a **classic QuickSight-namespace account** where
  `RegisterUser` is available.
- **`shared`** — login is still required, but every authenticated viewer is
  embedded as a single pre-existing registered user (`DashboardEmbedUserArn` /
  the first `ChatUserArns` entry). No user provisioning occurs. Use this when
  QuickSight is managed by **IAM Identity Center**, where `RegisterUser` is
  disabled, or when all viewers should share one BI identity.

> If you deploy `per-user` into an IAM Identity Center-managed account, embed
> calls fail because QuickSight blocks `RegisterUser`
> (`Operation is disabled for identities managed by IAM Identity Center`). Use
> `shared` mode there, or federate the Identity Center users into QuickSight
> and embed as those existing identities.

## Host page integration

On any allowed domain, the integration is a container `<div>` plus a script tag:

```html
<div id="quicksuite-widget-container"></div>
<script src="https://your-cdn.example.com/quicksuite-widget-bundled.js"></script>
```

The widget resolves `config.json` relative to its own script URL, so host it
alongside the bundle.

### Layout templates

Two ready-to-host page templates are included; both embed the same content from
the same `config.json` and differ only in layout:

| Template | Navigation | Chat | Best for |
|---|---|---|---|
| `widget/index.html` — **modern split-pane** | left sidebar | docked side panel | a full analytics portal / app shell |
| `widget/index-topnav.html` — **classic top-navigation** | widget's own top tab bar | floating bubble | a minimal drop-in where the widget owns navigation |

Switch layouts by hosting a different HTML file — nothing else changes. See
[`docs/templates.md`](docs/templates.md) for the full comparison and setup
options.

## Testing

```bash
npm test                 # Jest unit + property-based tests
cd backend && sam validate --lint   # validate the SAM template
```

## Cost estimate

Costs depend on usage. For a small pilot — **~10 dashboard viewers**,
**~50,000 embed API requests/month**, and **default (on-demand) DynamoDB** —
the serverless backend (Lambda + API Gateway + DynamoDB + a tiny S3 object)
typically falls within or near the AWS Free Tier, on the order of a few US
dollars per month. QuickSight itself is billed separately (Enterprise edition
author/reader pricing and SPICE capacity) and is usually the dominant cost.
Review current [AWS](https://aws.amazon.com/pricing/) and
[QuickSight](https://aws.amazon.com/quicksight/pricing/) pricing for your
region and usage tier.

## Security notes

- Embed URLs are generated only for **registered** QuickSight users.
- The backend enforces an **origin allowlist**, a **dashboard-ID allowlist**, a
  **10 KB request body limit**, and returns generic errors that do not leak
  account IDs, ARNs, or resource names.
- IAM roles are **per-Lambda and least-privilege**, scoped to specific resource
  ARNs with no wildcard service permissions and no anonymous-embedding actions.
- All responses include `X-Content-Type-Options: nosniff` and HSTS headers.

## Documentation

- [Architecture](docs/architecture.md)
- [Configuration reference](docs/configuration-reference.md)
- [Layout templates](docs/templates.md) (modern split-pane vs classic top-nav)
- [Customization guide](docs/customization.md)
- [Operations & management](docs/operations.md) (updates, redeploys, teardown)
- [Monitoring & observability](docs/monitoring.md)
- [Troubleshooting](docs/troubleshooting.md)
- [Sample dashboard setup guide](sample-data/setup-guide.md)
- [Contributing](CONTRIBUTING.md)

## License

Licensed under the [Apache License 2.0](LICENSE).
