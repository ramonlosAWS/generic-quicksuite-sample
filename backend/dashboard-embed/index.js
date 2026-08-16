// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

'use strict';

const { QuickSightClient, GenerateEmbedUrlForRegisteredUserCommand } = require('@aws-sdk/client-quicksight');
const { validateDashboardId, validateOrigin, validateBodySize, sanitizeInput, parseEnvList } = require('../shared/validator');
const { createResponse } = require('../shared/cors-helper');
const { logRequest } = require('../shared/audit-logger');
const { resolveRegisteredUser } = require('../shared/user-resolver');
const { checkRateLimit, getClientIp } = require('../shared/rate-limiter');

/**
 * Dashboard Embed Lambda Handler
 *
 * Generates embed URLs for QuickSight dashboards via GenerateEmbedUrlForRegisteredUser.
 * Registered-user embedding only — no anonymous or public embed API is used.
 *
 * Environment variables:
 *   QUICKSIGHT_ACCOUNT_ID    - 12-digit AWS account ID for QuickSight
 *   QUICKSIGHT_REGION        - AWS region where QuickSight is deployed
 *   DASHBOARD_EMBED_USER_ARN - ARN of the registered QuickSight user for embedding
 *   ALLOWED_DASHBOARD_IDS    - Comma-separated list of allowed dashboard IDs
 *   ALLOWED_ORIGINS          - Comma-separated list of allowed request origins
 *   AUDIT_TABLE_NAME         - DynamoDB table name for audit logs
 */

/** QuickSight client — lazy-initialized */
let qsClient = null;

/**
 * Get or create the QuickSight client (singleton).
 * @returns {QuickSightClient}
 */
function getQuickSightClient() {
  if (!qsClient) {
    qsClient = new QuickSightClient({
      region: process.env.QUICKSIGHT_REGION || 'us-east-1'
    });
  }
  return qsClient;
}

/**
 * Override the QuickSight client (for testing).
 * @param {QuickSightClient|null} client
 */
function setQuickSightClient(client) {
  qsClient = client;
}

/**
 * Extract the origin header from the API Gateway event.
 * Handles case-insensitive header lookup.
 * @param {object} event - API Gateway event
 * @returns {string|undefined} Origin header value
 */
function getOrigin(event) {
  if (!event.headers) return undefined;
  return event.headers.origin || event.headers.Origin || undefined;
}

/**
 * Generate a unique request ID for tracking.
 * @returns {string} Request ID in format 'req-<timestamp>-<random>'
 */
function generateRequestId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `req-${timestamp}-${random}`;
}

/**
 * Lambda handler for POST /dashboard-embed
 *
 * Accepts: { dashboardId, sessionLifetimeInMinutes, deviceType, sessionId }
 * Returns: { embedUrl, expiresIn, requestId, status }
 *
 * @param {object} event - API Gateway REST API event
 * @returns {object} API Gateway response { statusCode, headers, body }
 */
exports.handler = async (event) => {
  const origin = getOrigin(event);
  const requestId = generateRequestId();

  // Fire-and-forget audit helper. Captures the request-invariant fields; each
  // call passes only `status` plus any specifics known at that point.
  const audit = (status, extra = {}) =>
    logRequest({
      requestId,
      origin: origin || 'missing',
      dashboardId: 'N/A',
      sessionId: 'N/A',
      status,
      embedType: 'dashboard',
      deviceType: 'unknown',
      userArn: 'N/A',
      ...extra,
    }).catch((e) => console.error('Audit log error:', e.message));

  // --- Validate origin ---
  const originCheck = validateOrigin(origin);
  if (!originCheck.valid) {
    audit('rejected_origin');
    return createResponse(originCheck.statusCode, originCheck.body, origin);
  }

  // --- Validate body size (cheap sync check — before the rate-limit write) ---
  const rawBody = event.body || '';
  const bodyCheck = validateBodySize(rawBody);
  if (!bodyCheck.valid) {
    audit('rejected_body_size');
    return createResponse(bodyCheck.statusCode, bodyCheck.body, origin);
  }

  // --- Per-IP rate limit (fail-open) ---
  const rate = await checkRateLimit(getClientIp(event));
  if (!rate.allowed) {
    audit('rate_limited');
    const limited = createResponse(429, { message: 'Too Many Requests' }, origin);
    limited.headers['Retry-After'] = String(rate.retryAfterSeconds);
    return limited;
  }

  // --- Parse request body ---
  let body;
  try {
    body = typeof rawBody === 'string' ? JSON.parse(rawBody) : rawBody;
  } catch (err) {
    audit('invalid_json');
    return createResponse(400, { message: 'Bad Request' }, origin);
  }

  const { dashboardId, sessionLifetimeInMinutes, deviceType, sessionId } = body;

  // --- Sanitize string inputs ---
  const safeDashboardId = sanitizeInput(dashboardId);
  const safeSessionId = sanitizeInput(sessionId);
  const safeDeviceType = sanitizeInput(deviceType);

  // --- Validate dashboard ID against allowlist ---
  const dashboardCheck = validateDashboardId(safeDashboardId);
  if (!dashboardCheck.valid) {
    audit('rejected_dashboard_id', {
      dashboardId: safeDashboardId || 'missing',
      sessionId: safeSessionId || 'unknown',
      deviceType: safeDeviceType || 'unknown',
    });
    return createResponse(dashboardCheck.statusCode, dashboardCheck.body, origin);
  }

  // --- Resolve the embed identity ---
  // Preferred: the authenticated user from the verified Cognito token claims
  // (per-user registered embedding). Fallback: the configured service user
  // ARN (used only when the API is deployed without an authorizer).
  const accountId = process.env.QUICKSIGHT_ACCOUNT_ID;
  const namespace = process.env.QUICKSIGHT_NAMESPACE || 'default';
  const region = process.env.QUICKSIGHT_REGION || 'us-east-1';
  const lifetime = sessionLifetimeInMinutes || 30;

  let userArn = process.env.DASHBOARD_EMBED_USER_ARN || '';
  try {
    const resolved = await resolveRegisteredUser(event, {
      accountId,
      namespace,
      region,
      qsClient: getQuickSightClient(),
      identityMode: process.env.EMBED_IDENTITY_MODE || 'per-user',
      sharedUserArn: process.env.DASHBOARD_EMBED_USER_ARN || '',
    });
    if (resolved) {
      userArn = resolved.userArn;
    }
  } catch (err) {
    console.error('User resolution error:', err.message);
    audit('error_user_resolution', {
      dashboardId: safeDashboardId,
      sessionId: safeSessionId || 'unknown',
      deviceType: safeDeviceType || 'unknown',
    });
    return createResponse(500, { message: 'Internal Server Error', requestId, status: 'error' }, origin);
  }

  if (!userArn) {
    audit('error_no_user', {
      dashboardId: safeDashboardId,
      sessionId: safeSessionId || 'unknown',
      deviceType: safeDeviceType || 'unknown',
    });
    return createResponse(401, { message: 'Unauthorized', requestId, status: 'error' }, origin);
  }

  const experienceConfig = {
    Dashboard: {
      InitialDashboardId: safeDashboardId
    }
  };

  // AllowedDomains overrides the account-level static domain allowlist for this
  // embed URL, so the sample works without a manual QuickSight console step.
  const allowedDomains = parseEnvList(process.env.ALLOWED_ORIGINS);

  try {
    const client = getQuickSightClient();
    const command = new GenerateEmbedUrlForRegisteredUserCommand({
      AwsAccountId: accountId,
      UserArn: userArn,
      SessionLifetimeInMinutes: lifetime,
      ExperienceConfiguration: experienceConfig,
      AllowedDomains: allowedDomains.length ? allowedDomains : undefined
    });

    const result = await client.send(command);

    audit('success', {
      dashboardId: safeDashboardId,
      sessionId: safeSessionId || 'unknown',
      deviceType: safeDeviceType || 'unknown',
      userArn,
    });

    return createResponse(200, {
      embedUrl: result.EmbedUrl,
      expiresIn: lifetime * 60,
      requestId,
      status: 'success'
    }, origin);
  } catch (err) {
    console.error('QuickSight API error:', err.message);

    audit('error', {
      dashboardId: safeDashboardId,
      sessionId: safeSessionId || 'unknown',
      deviceType: safeDeviceType || 'unknown',
      userArn: userArn || 'N/A',
    });

    // Return generic error — never expose internal details (Req 15.2)
    return createResponse(500, {
      message: 'Internal Server Error',
      requestId,
      status: 'error'
    }, origin);
  }
};

module.exports.getQuickSightClient = getQuickSightClient;
module.exports.setQuickSightClient = setQuickSightClient;
module.exports.getOrigin = getOrigin;
module.exports.generateRequestId = generateRequestId;
