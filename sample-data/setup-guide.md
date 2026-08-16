<!--
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
-->

# Sample Dashboard Setup Guide

This guide walks through creating a QuickSight dataset and dashboard from the
included sample data (`sales-analytics.csv`), then wiring it up for embedding
with the QuickSuite Widget. Follow the numbered steps in order; each step lists
the expected result so you can confirm you are on track.

## What you will build

An interactive sales-analytics dashboard (regions, products, channels, and
monthly revenue/quantity) that renders inside the widget on any web page via a
single `<script>` tag.

## Prerequisites

Complete these before the first procedural step:

1. **QuickSight edition** — Enterprise edition is required for embedding and for
   registered-user embed URLs (`GenerateEmbedUrlForRegisteredUser`). Standard
   edition cannot embed.
2. **AWS region** — Decide which region hosts QuickSight (e.g. `us-east-1`). Use
   the same region consistently for the dataset, dashboard, and the SAM backend.
   Note: QuickSight user/group ARNs always live in the identity region
   (commonly `us-east-1`) even when your dataset is in another region.
3. **IAM permissions** — The identity you use needs QuickSight author
   permissions (create datasets, analyses, dashboards) and, for the embedding
   setup, `quicksight:RegisterUser`, `quicksight:GenerateEmbedUrlForRegisteredUser`,
   `quicksight:DescribeDashboard`, and `quicksight:DescribeUser`.
4. **The sample file** — `sample-data/sales-analytics.csv` from this repository
   (245 rows: 4 regions, 6 products, 3 channels, 12 months of 2025 data).

## Column reference

| Column | Type | Description |
|---|---|---|
| `region` | String | Sales region (4 distinct values) |
| `product` | String | Product name (6 distinct values) |
| `channel` | String | Sales channel: Online, Retail, or Partner |
| `order_date` | Date (`yyyy-MM-dd`) | Order date within calendar year 2025 |
| `revenue` | Decimal | Line-item revenue in USD |
| `quantity` | Integer | Units sold |

## Step 1 — Upload the sample data and create a dataset

1. In the QuickSight console choose **Datasets → New dataset → Upload a file**.
2. Select `sample-data/sales-analytics.csv`.
3. In the upload preview, confirm the field types match the table above. Set
   `order_date` to **Date** with format `yyyy-MM-dd`, `revenue` to **Decimal**,
   and `quantity` to **Integer**. Leave `region`, `product`, and `channel` as
   **String**.
4. Choose **Import to SPICE** for fast performance, then **Create dataset**.

**Expected result:** a dataset named `sales-analytics` with 245 imported rows
and 6 fields.

## Step 2 — Create an analysis and visuals

1. From the dataset, choose **Create analysis**.
2. Add these visuals (each demonstrates a different chart the widget can host):
   - **Revenue by Region** — a bar chart: `region` on the X axis, `Sum(revenue)`
     as the value.
   - **Monthly Revenue Trend** — a line chart: `order_date` (aggregated by month)
     on the X axis, `Sum(revenue)` as the value.
   - **Product Performance** — a table: rows `product`, values `Sum(revenue)` and
     `Sum(quantity)`.
3. Optionally add a second sheet named "Regional" and repeat with `channel` as a
   breakdown, so you can exercise the widget's secondary sub-navigation.

**Expected result:** an analysis with at least one sheet showing populated
visuals (no "no data" placeholders).

## Step 3 — Publish the dashboard

1. In the analysis choose **Share → Publish dashboard**.
2. Name it (e.g. `Sales Analytics`) and publish.
3. Open the published dashboard and copy two values from the browser URL
   `.../dashboards/<DASHBOARD_ID>/sheets/<SHEET_ID>`:
   - the **dashboard ID** (a UUID)
   - the **sheet ID** for each sheet you want to expose

**Expected result:** a published dashboard that renders in the QuickSight
console. Record the dashboard ID and sheet ID(s) — you will put them in the
widget's `config.json`.

## Step 4 — Create registered reader users for embedding

The widget embeds as **registered** QuickSight users (never anonymous). Create
at least one reader for dashboard embedding, and — if you enable chat — a small
pool (minimum 2) for Q&A session rotation.

Using the AWS CLI (adjust region, account ID, and identity type to your setup):

```bash
aws quicksight register-user \
  --aws-account-id <ACCOUNT_ID> \
  --namespace default \
  --region us-east-1 \
  --identity-type IAM \
  --user-role READER \
  --iam-arn arn:aws:iam::<ACCOUNT_ID>:role/<EMBED_READER_ROLE> \
  --session-name embed-reader-1 \
  --email embed-reader-1@example.com
```

Repeat with `--session-name embed-reader-2`, `-3`, etc. for the chat pool.

**Expected result:** each call returns a `UserArn` like
`arn:aws:quicksight:us-east-1:<ACCOUNT_ID>:user/default/<name>`. Collect these
ARNs — the dashboard reader ARN and the chat pool ARNs are SAM template
parameters (`DashboardEmbedUserArn`, `ChatUserArns`).

## Step 5 — Grant the users access to the dashboard

1. Open the dashboard, choose **Share → Share dashboard**.
2. Add each registered reader user created in Step 4 with **Viewer** access.

**Expected result:** the users appear in the dashboard's shared-with list.

## Step 6 — Allow your host domain for embedding

1. In QuickSight choose **Manage QuickSight → Domains and Embedding**.
2. Add the domain(s) that will host the widget (for local testing add
   `http://localhost:8080`). Include the exact scheme and port.

**Expected result:** your domain is listed under allowed domains. Embed URLs
generated for these domains will render; others will be blocked by QuickSight.

## Step 7 — Deploy the backend and configure the widget

1. Deploy the SAM backend (see the repository `README.md`), supplying the
   dashboard ID from Step 3 in `DashboardIds`, the reader ARN from Step 4 in
   `DashboardEmbedUserArn`, the chat pool ARNs in `ChatUserArns`, and your host
   domain in `AllowedOrigins`.
2. Copy the deployed API endpoint into `widget/config.json` (`apiEndpoint`), and
   set each sub-item's `dashboardId`/`sheetId` to the values from Step 3.

**Expected result:** `widget/config.json` points at your API endpoint and real
dashboard/sheet IDs.

## Step 8 — Verify end to end

1. Serve the `widget/` directory over HTTP:
   ```bash
   cd widget
   python3 -m http.server 8080
   ```
2. Open `http://localhost:8080/index.html`.

**Expected end state:** the page shows the widget's navigation bar, and the
first tab renders your embedded Sales Analytics dashboard with live visuals
(Revenue by Region, Monthly Revenue Trend, etc.). Switching tabs/sub-items
navigates between sheets. If chat is enabled, the chat tab opens a QuickSight
Q&A experience. Seeing the rendered dashboard confirms the full path
(host page → widget → API Gateway → Lambda → QuickSight) is working.

## Troubleshooting

See `../docs/troubleshooting.md` for common errors (blank container, 403 from
the API, domain-not-allowed, expired session, and pool-exhausted responses).
