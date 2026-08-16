<!--
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
-->

# Monitoring & Observability

What to watch, where to find it, and how to query it. The backend emits three
signals: **CloudWatch Logs** (Lambda), **CloudWatch metrics** (Lambda + API
Gateway + DynamoDB), and a **DynamoDB audit log** of every embed request.

Set your context once:

```bash
export AWS_REGION=us-east-1
export STACK=quicksuite-embed-backend
```

## CloudWatch Logs

Each Lambda writes to its own log group, named after the function:

| Function | Log group |
|---|---|
| Dashboard embed | `/aws/lambda/<STACK>-dashboard-embed` |
| Chat embed | `/aws/lambda/<STACK>-chat-embed` |

The functions log QuickSight API failures, audit-log write failures, and
rate-limiter fail-open events — **without leaking secrets or ARNs to clients**
(client responses are generic; detail stays in the logs).

Tail live:

```bash
sam logs --stack-name "$STACK" --name DashboardEmbedFunction --tail --region "$AWS_REGION"
# or directly:
aws logs tail "/aws/lambda/$STACK-dashboard-embed" --follow --region "$AWS_REGION"
```

### Logs Insights queries

Errors in the last hour:

```
fields @timestamp, @message
| filter @message like /(?i)(error|exception|failed)/
| sort @timestamp desc
| limit 100
```

Rate-limiter failing open (DynamoDB unreachable — investigate):

```
fields @timestamp, @message
| filter @message like /Rate limiter unavailable/
| sort @timestamp desc
```

Cold starts and duration distribution:

```
filter @type = "REPORT"
| stats count(*), avg(@duration), max(@duration), pct(@duration, 95) by bin(5m)
```

## CloudWatch metrics to watch

These are emitted automatically (no setup). Recommended alarms:

| Source | Metric | Why |
|---|---|---|
| Lambda (each function) | `Errors` | Embed generation failing (QuickSight/permission errors). |
| Lambda | `Throttles` | Concurrency limit hit. |
| Lambda | `Duration` (p95) | Approaching the 30s timeout. |
| API Gateway (`quicksuite-embed-api`) | `5XXError` | Backend failures. |
| API Gateway | `4XXError` | Spikes = misconfigured origins/dashboards (403) or rate limiting (429). |
| API Gateway | `Count` | Traffic baseline / abuse detection. |
| API Gateway | `Latency` / `IntegrationLatency` | End-to-end embed latency. |
| DynamoDB (audit table) | `ThrottledRequests` | Rare on PAY_PER_REQUEST, but worth an alarm. |

Example alarm (API Gateway 5XX):

```bash
aws cloudwatch put-metric-alarm --region "$AWS_REGION" \
  --alarm-name "$STACK-api-5xx" \
  --namespace AWS/ApiGateway --metric-name 5XXError \
  --dimensions Name=ApiName,Value=quicksuite-embed-api \
  --statistic Sum --period 300 --evaluation-periods 1 \
  --threshold 1 --comparison-operator GreaterThanOrEqualToThreshold \
  --treat-missing-data notBreaching
```

Wire alarms to an SNS topic (`--alarm-actions <topic-arn>`) for notifications.

## The DynamoDB audit log

Every embed request is recorded in the table named by the `AuditLogTableName`
output (`<STACK>-audit-logs`). Records auto-expire via TTL after
`AuditLogTtlDays` (the Lambdas read this via the `AUDIT_TTL_DAYS` env var).

**Audit record fields:**

| Field | Meaning |
|---|---|
| `requestId` (PK) | Unique request id. |
| `timestamp` (SK) | Epoch **milliseconds**. |
| `origin` | Requesting page origin. |
| `dashboardId` | Requested dashboard (`N/A` for chat). |
| `sessionId` | Client-generated session id. |
| `status` | `success` or an error category. |
| `embedType` | `dashboard` or `chat`. |
| `deviceType` | `desktop` or `mobile`. |
| `userArn` | QuickSight identity used for the embed. |
| `ttl` | Epoch seconds for auto-expiry. |

> **Note:** the same table also holds the rate-limiter's counters, stored as
> items whose `requestId` begins with `rl#<ip>` (with a `reqCount` attribute).
> Filter those out when analyzing audit traffic.

Recent failures (excluding rate-limit counters):

```bash
export TABLE=$(aws cloudformation describe-stacks --stack-name "$STACK" \
  --query "Stacks[0].Outputs[?OutputKey=='AuditLogTableName'].OutputValue" --output text --region "$AWS_REGION")

aws dynamodb scan --table-name "$TABLE" --region "$AWS_REGION" \
  --filter-expression "#s <> :ok AND NOT begins_with(requestId, :rl)" \
  --expression-attribute-names '{"#s":"status"}' \
  --expression-attribute-values '{":ok":{"S":"success"},":rl":{"S":"rl#"}}' \
  --max-items 50
```

Count requests by embed type:

```bash
aws dynamodb scan --table-name "$TABLE" --region "$AWS_REGION" \
  --filter-expression "NOT begins_with(requestId, :rl)" \
  --expression-attribute-values '{":rl":{"S":"rl#"}}' \
  --projection-expression "embedType" --output text | sort | uniq -c
```

> `Scan` reads the whole table — fine for a sample/low volume. For high volume,
> export to S3 and query with Athena, or add a GSI on the attributes you filter
> by most.

## Cost monitoring

The serverless backend is usually a rounding error next to QuickSight itself.
Track it in **AWS Cost Explorer**, filtered by service (Lambda, API Gateway,
DynamoDB, S3, CloudFront) and by region. QuickSight (author/reader/SPICE, plus
capacity if used) is billed separately and is normally the dominant line. See
the README cost estimate and current
[AWS](https://aws.amazon.com/pricing/) /
[QuickSight](https://aws.amazon.com/quicksight/pricing/) pricing.

## Optional: API Gateway access logs

The sample keeps API Gateway access logging off to stay minimal. To capture
per-request access logs, add an `AccessLogSetting` (and a log-group destination)
to the `EmbedApi` stage in `backend/template.yaml`, then redeploy. Method-level
CloudWatch metrics and Logs Insights over the Lambda log groups already cover
most needs.
