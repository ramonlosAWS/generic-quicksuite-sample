// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

'use strict';

const { DynamoDBClient, UpdateItemCommand } = require('@aws-sdk/client-dynamodb');

/**
 * Per-IP Rate Limiter
 *
 * Fixed-window counter stored in the existing audit-log DynamoDB table
 * (no extra infrastructure). One item per client IP per minute:
 *   requestId = "rl#<ip>"   (partition key, reuses the audit table schema)
 *   timestamp = <epoch-minute bucket>  (sort key)
 *   reqCount  = atomic counter (ADD)
 *   ttl       = bucket + 2 minutes (auto-cleanup via the table's TTL)
 *
 * Design properties:
 *   - Atomic: UpdateItem ADD is safe under concurrent invocations.
 *   - FAIL-OPEN: if DynamoDB is unreachable, requests are allowed (and the
 *     failure logged) rather than blocking legitimate traffic.
 *   - Cheap: one write per request; TTL removes stale buckets automatically.
 *
 * Environment variables:
 *   AUDIT_TABLE_NAME       - DynamoDB table (same as the audit logger)
 *   RATE_LIMIT_PER_MINUTE  - max requests per IP per minute (default 60; 0 disables)
 */

/** DynamoDB client — lazy-initialized */
let ddbClient = null;

function getClient() {
  if (!ddbClient) {
    ddbClient = new DynamoDBClient({});
  }
  return ddbClient;
}

/** Override the DynamoDB client (for testing). */
function setClient(client) {
  ddbClient = client;
}

/**
 * Check and count a request against the per-IP limit.
 *
 * @param {string} ipAddress - client IP (from API Gateway requestContext)
 * @returns {Promise<{allowed: boolean, retryAfterSeconds: number, count: number}>}
 */
async function checkRateLimit(ipAddress) {
  const limit = parseInt(process.env.RATE_LIMIT_PER_MINUTE || '60', 10);
  if (!limit || limit <= 0) {
    return { allowed: true, retryAfterSeconds: 0, count: 0 };
  }

  const tableName = process.env.AUDIT_TABLE_NAME;
  if (!tableName || !ipAddress) {
    // Cannot rate limit without a table or IP — fail open.
    return { allowed: true, retryAfterSeconds: 0, count: 0 };
  }

  const nowSec = Math.floor(Date.now() / 1000);
  const minuteBucket = Math.floor(nowSec / 60); // fixed 60s window

  try {
    const result = await getClient().send(new UpdateItemCommand({
      TableName: tableName,
      Key: {
        requestId: { S: 'rl#' + ipAddress },
        timestamp: { N: String(minuteBucket) }
      },
      UpdateExpression: 'ADD reqCount :one SET #ttl = if_not_exists(#ttl, :ttl)',
      ExpressionAttributeNames: { '#ttl': 'ttl' },
      ExpressionAttributeValues: {
        ':one': { N: '1' },
        ':ttl': { N: String((minuteBucket + 2) * 60) } // expire 2 minutes after the window
      },
      ReturnValues: 'UPDATED_NEW'
    }));

    const count = parseInt(result.Attributes?.reqCount?.N || '1', 10);
    if (count > limit) {
      const retryAfterSeconds = 60 - (nowSec % 60); // seconds until the window resets
      return { allowed: false, retryAfterSeconds: Math.max(1, retryAfterSeconds), count };
    }
    return { allowed: true, retryAfterSeconds: 0, count };
  } catch (err) {
    // FAIL-OPEN: availability over strictness, but make the failure visible.
    console.error('Rate limiter unavailable (failing open):', err.message);
    return { allowed: true, retryAfterSeconds: 0, count: 0 };
  }
}

/**
 * Extract the client IP from an API Gateway REST event.
 * @param {object} event
 * @returns {string} IP address or '' if unavailable
 */
function getClientIp(event) {
  return (event
    && event.requestContext
    && event.requestContext.identity
    && event.requestContext.identity.sourceIp) || '';
}

module.exports = { checkRateLimit, getClientIp, setClient };
