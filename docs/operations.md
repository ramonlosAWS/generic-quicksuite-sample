<!--
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
-->

# Operations & Management

Day-2 operations for a deployed stack: updating configuration, hosting the
widget, redeploying with changed parameters, managing the Cognito user pool and
the chat reader pool, and full teardown. For first-time deployment see the
[README](../README.md); for observability see [`monitoring.md`](monitoring.md).

Throughout, `STACK` is your backend stack name and `HOSTING_STACK` your hosting
stack name (the values you passed to `sam deploy --stack-name` /
`aws cloudformation deploy`). Set your region once:

```bash
export AWS_REGION=us-east-1
export STACK=quicksuite-embed-backend
export HOSTING_STACK=quicksuite-widget-hosting
```

## Read stack outputs

Everything you need (API endpoint, table name, bucket, Cognito IDs) is in the
CloudFormation outputs:

```bash
aws cloudformation describe-stacks --stack-name "$STACK" \
  --query 'Stacks[0].Outputs' --output table --region "$AWS_REGION"
```

Grab a single value:

```bash
aws cloudformation describe-stacks --stack-name "$STACK" \
  --query "Stacks[0].Outputs[?OutputKey=='ApiEndpoint'].OutputValue" \
  --output text --region "$AWS_REGION"
```

## Host the widget (CloudFront)

The `hosting/` stack provisions a private S3 bucket served over HTTPS via
CloudFront (Origin Access Control + security headers). Deploy it once, then
upload the widget assets.

### Deploy the hosting stack

```bash
aws cloudformation deploy \
  --template-file hosting/template.yaml \
  --stack-name "$HOSTING_STACK" \
  --region "$AWS_REGION"

aws cloudformation describe-stacks --stack-name "$HOSTING_STACK" \
  --query 'Stacks[0].Outputs' --output table --region "$AWS_REGION"
```

Note the `BucketName`, `DistributionId`, and `WidgetUrl` outputs.

### Upload assets

For the bundled distribution, upload the host page, the bundle, and the config:

```bash
export BUCKET=$(aws cloudformation describe-stacks --stack-name "$HOSTING_STACK" \
  --query "Stacks[0].Outputs[?OutputKey=='BucketName'].OutputValue" --output text --region "$AWS_REGION")

aws s3 cp widget/index.html                    "s3://$BUCKET/index.html"                    --region "$AWS_REGION"
aws s3 cp widget/quicksuite-widget-bundled.js  "s3://$BUCKET/quicksuite-widget-bundled.js"  --region "$AWS_REGION"
aws s3 cp widget/config.json                   "s3://$BUCKET/config.json"                   --region "$AWS_REGION"
```

(If you serve the non-bundled widget, also upload `quicksuite-widget.js` and
`quicksight-embedding-sdk.min.js`.)

### Invalidate the CloudFront cache after every change

Any time you re-upload `config.json` or the widget JS, invalidate the cache so
viewers get the new files:

```bash
export DIST=$(aws cloudformation describe-stacks --stack-name "$HOSTING_STACK" \
  --query "Stacks[0].Outputs[?OutputKey=='DistributionId'].OutputValue" --output text --region "$AWS_REGION")

aws cloudfront create-invalidation --distribution-id "$DIST" --paths "/*"
```

> The sample hosting stack uses the managed **CachingDisabled** policy so config
> changes appear immediately during evaluation. If you switch to
> **CachingOptimized** for production, the invalidation step above becomes
> mandatory after each upload.

## Update the widget configuration

Editing `config.json` (branding, navigation, filters, chat, session) is a
client-only change — no backend redeploy:

1. Edit `widget/config.json`. Validate it against the schema
   (`widget/config.schema.json`) with any draft-07 validator, or just run
   `npm test` (the config-schema test loads the sample).
2. If you edited `widget/quicksuite-widget.js`, rebuild the bundle:
   `cd widget && node build-bundled.js`.
3. Re-upload the changed files and invalidate CloudFront (above).

## Redeploy the backend with changed parameters

Backend behavior lives in SAM parameters. Common changes and the parameter to
edit:

| Change | Parameter |
|---|---|
| Allow a new dashboard | add its UUID to `DashboardIds` |
| Allow a new host origin | add it to `AllowedOrigins` |
| Turn chat on/off | `ChatEnabled` |
| Grow/rotate the chat pool | `ChatUserArns` |
| Switch embed identity model | `EmbedIdentityMode` (`per-user`/`shared`) |
| Tune per-IP rate limit | `RateLimitPerMinute` (0 disables) |
| Tune API Gateway throttling | `ApiThrottleRateLimit` / `ApiThrottleBurstLimit` |
| Change audit retention | `AuditLogTtlDays` (1–365) |
| Add Cognito callback/logout URLs | `CallbackUrls` / `LogoutUrls` |

Redeploy:

```bash
cd backend
sam build
sam deploy            # reuses saved params from samconfig.toml
# or re-run guided to change values interactively:
sam deploy --guided
```

`sam deploy` performs an in-place CloudFormation update — existing resources
(the audit table, the S3 state, Cognito users) are preserved.

## Manage the Cognito user pool

End users must exist in the pool to log in. The pool defaults to
**admin-creates-users** (no self-signup).

Read the pool id:

```bash
export POOL=$(aws cloudformation describe-stacks --stack-name "$STACK" \
  --query "Stacks[0].Outputs[?OutputKey=='CognitoUserPoolId'].OutputValue" --output text --region "$AWS_REGION")
```

Create a user and set a permanent password:

```bash
aws cognito-idp admin-create-user --user-pool-id "$POOL" \
  --username viewer@example.com \
  --user-attributes Name=email,Value=viewer@example.com Name=email_verified,Value=true \
  --message-action SUPPRESS --region "$AWS_REGION"

aws cognito-idp admin-set-user-password --user-pool-id "$POOL" \
  --username viewer@example.com --password 'S3cure-Pass!' --permanent --region "$AWS_REGION"
```

Reset a password / disable / delete a user:

```bash
aws cognito-idp admin-reset-user-password --user-pool-id "$POOL" --username viewer@example.com --region "$AWS_REGION"
aws cognito-idp admin-disable-user       --user-pool-id "$POOL" --username viewer@example.com --region "$AWS_REGION"
aws cognito-idp admin-delete-user        --user-pool-id "$POOL" --username viewer@example.com --region "$AWS_REGION"
```

To allow self-signup instead of admin-only, set
`AdminCreateUserConfig.AllowAdminCreateUserOnly: false` in
`backend/template.yaml` and redeploy. For production, prefer Authorization Code
+ PKCE over the implicit flow and enable Cognito MFA / Advanced Security.

## Manage the chat reader pool

Chat embeds as a registered QuickSight reader. With a **single** `ChatUserArns`
entry, every chat session uses that one identity. With **2+** entries, the
backend rotates them least-recently-used and persists assignment state to
`user-pool-state.json` in the state bucket.

- **Add/rotate readers:** register the new reader user(s) in QuickSight, add
  their ARNs to `ChatUserArns`, and redeploy the backend.
- **Reset rotation state** (e.g., after removing a user): delete the state
  object; the backend recreates it on the next request.

  ```bash
  export STATE_BUCKET=$(aws cloudformation describe-stacks --stack-name "$STACK" \
    --query "Stacks[0].Outputs[?OutputKey=='UserPoolStateBucketName'].OutputValue" --output text --region "$AWS_REGION")
  aws s3 rm "s3://$STATE_BUCKET/user-pool-state.json" --region "$AWS_REGION"
  ```

- **Busy (HTTP 503)?** The pool is exhausted (all readers have active sessions).
  Add more ARNs sized to peak concurrency, or lower `session.expirationMinutes`
  so sessions free up sooner.

## Audit log retention

Records in the DynamoDB audit table auto-expire via TTL after `AuditLogTtlDays`.
To change retention, update the parameter and redeploy. Existing rows keep their
original TTL; new rows use the new value. See [`monitoring.md`](monitoring.md)
for querying the log.

## Teardown / cleanup

Delete in reverse order. **Both S3 buckets have versioning enabled and are not
auto-emptied**, so you must empty them (including versions) before the stacks
will delete.

### 1. Empty and delete the hosting stack

```bash
export BUCKET=$(aws cloudformation describe-stacks --stack-name "$HOSTING_STACK" \
  --query "Stacks[0].Outputs[?OutputKey=='BucketName'].OutputValue" --output text --region "$AWS_REGION")

aws s3 rm "s3://$BUCKET" --recursive --region "$AWS_REGION"
aws cloudformation delete-stack --stack-name "$HOSTING_STACK" --region "$AWS_REGION"
aws cloudformation wait stack-delete-complete --stack-name "$HOSTING_STACK" --region "$AWS_REGION"
```

CloudFront distributions take several minutes to disable and delete; the `wait`
above blocks until done.

### 2. Empty the state bucket and delete the backend stack

Empty **all versions** of the state bucket (versioned buckets need version
deletion, not just `rm`):

```bash
export STATE_BUCKET=$(aws cloudformation describe-stacks --stack-name "$STACK" \
  --query "Stacks[0].Outputs[?OutputKey=='UserPoolStateBucketName'].OutputValue" --output text --region "$AWS_REGION")

aws s3api delete-objects --bucket "$STATE_BUCKET" --region "$AWS_REGION" \
  --delete "$(aws s3api list-object-versions --bucket "$STATE_BUCKET" --region "$AWS_REGION" \
    --query '{Objects: (Versions // `[]`)[].{Key:Key,VersionId:VersionId} + (DeleteMarkers // `[]`)[].{Key:Key,VersionId:VersionId}}' --output json)" 2>/dev/null || true

cd backend && sam delete --stack-name "$STACK" --region "$AWS_REGION"
```

`sam delete` removes the API, Lambdas, IAM roles, the DynamoDB audit table, the
Cognito user pool (and its users), and the state bucket.

### 3. QuickSight resources (manual)

The stacks never create QuickSight dashboards, datasets, topics, or reader
users — remove those in QuickSight yourself if they were created only for this
sample. If you enabled a host domain under **Manage QuickSight → Domains and
Embedding**, remove it too.
