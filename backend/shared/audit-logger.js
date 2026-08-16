// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

'use strict';

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

/**
 * Audit Logger Module
 *
 * Provides asynchronous (fire-and-forget) audit logging to DynamoDB.
 * Writes are non-blocking — the caller should NOT await the returned Promise.
 * If the DynamoDB write fails, the error is logged to CloudWatch (console.error)
 * without affecting the API response.
 *
 * Environment variables:
 *   AUDIT_TABLE_NAME - DynamoDB table name for audit logs
 *   AUDIT_TTL_DAYS   - TTL in days for auto-expiration (default: 90)
 */

/** Default TTL in days if AUDIT_TTL_DAYS is not set */
const DEFAULT_TTL_DAYS = 90;

/** Seconds in one day */
const SECONDS_PER_DAY = 86400;

// Lazy-initialized DynamoDB Document Client
let docClient = null;

/**
 * Get or create the DynamoDB Document Client (singleton).
 * @returns {DynamoDBDocumentClient}
 */
function getDocClient() {
  if (!docClient) {
    const client = new DynamoDBClient({});
    docClient = DynamoDBDocumentClient.from(client);
  }
  return docClient;
}

/**
 * Override the DynamoDB Document Client (for testing).
 * @param {DynamoDBDocumentClient|null} client - Mock client or null to reset
 */
function setDocClient(client) {
  docClient = client;
}

/**
 * Calculate the TTL value (Unix epoch seconds) for auto-expiration.
 * @param {number} [ttlDays] - Number of days until expiration
 * @returns {number} Unix epoch seconds for the TTL attribute
 */
function calculateTtl(ttlDays) {
  const days = ttlDays || parseInt(process.env.AUDIT_TTL_DAYS, 10) || DEFAULT_TTL_DAYS;
  const nowSeconds = Math.floor(Date.now() / 1000);
  return nowSeconds + (days * SECONDS_PER_DAY);
}

/**
 * Write an audit log entry to DynamoDB (fire-and-forget).
 *
 * This function returns a Promise but is designed to be called WITHOUT await.
 * If the write fails, the error is logged to console (CloudWatch) and the
 * Promise resolves (does not throw).
 *
 * @param {object} params - Audit log entry fields
 * @param {string} params.requestId - Unique request identifier (PK)
 * @param {string} params.origin - HTTP Origin header value
 * @param {string} params.dashboardId - Requested dashboard ID
 * @param {string} params.sessionId - Client-generated session ID
 * @param {string} params.status - 'success' or error category
 * @param {string} params.embedType - 'dashboard' or 'chat'
 * @param {string} params.deviceType - 'desktop' or 'mobile'
 * @param {string} params.userArn - QuickSight user ARN used
 * @returns {Promise<void>} Resolves when write completes or fails (never rejects)
 */
async function logRequest(params) {
  const {
    requestId,
    origin,
    dashboardId,
    sessionId,
    status,
    embedType,
    deviceType,
    userArn
  } = params;

  const tableName = process.env.AUDIT_TABLE_NAME;
  if (!tableName) {
    console.error('Audit log write failed: AUDIT_TABLE_NAME environment variable is not set');
    return;
  }

  const timestamp = Date.now();
  const ttl = calculateTtl();

  const item = {
    requestId,
    timestamp,
    origin: origin || 'unknown',
    dashboardId: dashboardId || 'N/A',
    sessionId: sessionId || 'unknown',
    status: status || 'unknown',
    embedType: embedType || 'unknown',
    deviceType: deviceType || 'unknown',
    userArn: userArn || 'unknown',
    ttl
  };

  try {
    const client = getDocClient();
    await client.send(new PutCommand({
      TableName: tableName,
      Item: item
    }));
  } catch (err) {
    console.error('Audit log write failed:', err.message);
  }
}

module.exports = {
  logRequest,
  calculateTtl,
  setDocClient,
  getDocClient,
  DEFAULT_TTL_DAYS,
  SECONDS_PER_DAY
};
