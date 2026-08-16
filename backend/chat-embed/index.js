// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

'use strict';

const { QuickSightClient, GenerateEmbedUrlForRegisteredUserCommand } = require('@aws-sdk/client-quicksight');
const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const { validateOrigin, validateBodySize, parseEnvList } = require('../shared/validator');
const { createResponse } = require('../shared/cors-helper');
const { logRequest } = require('../shared/audit-logger');
const { resolveRegisteredUser } = require('../shared/user-resolver');
const { checkRateLimit, getClientIp } = require('../shared/rate-limiter');

/**
 * Chat Embed Lambda Handler
 *
 * Generates Q&A embed URLs for QuickSight generative chat via
 * GenerateEmbedUrlForRegisteredUser. Implements LRU (least-recently-used)
 * rotation through a pre-provisioned user pool stored in S3.
 *
 * Environment variables:
 *   QUICKSIGHT_ACCOUNT_ID - 12-digit AWS account ID for QuickSight
 *   QUICKSIGHT_REGION     - AWS region where QuickSight is deployed
 *   USER_POOL_BUCKET      - S3 bucket name for user pool state
 *   USER_POOL_KEY         - S3 object key for the user pool JSON file
 *   CHAT_USER_ARNS        - Comma-separated list of QuickSight user ARNs for the pool
 *   ALLOWED_ORIGINS       - Comma-separated list of allowed request origins
 *   AUDIT_TABLE_NAME      - DynamoDB table name for audit logs
 */

/** QuickSight client — lazy-initialized */
let qsClient = null;

/** S3 client — lazy-initialized */
let s3Client = null;

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
 * Get or create the S3 client (singleton).
 * @returns {S3Client}
 */
function getS3Client() {
  if (!s3Client) {
    s3Client = new S3Client({});
  }
  return s3Client;
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
 * Initialize a fresh user pool state from the CHAT_USER_ARNS environment variable.
 * Each user starts with epoch-zero timestamps (immediately available).
 *
 * @returns {object} User pool state with `users` array
 * @throws {Error} If no user ARNs are configured (CHAT_USER_ARNS is empty)
 */
function initializeUserPool() {
  const arnsEnv = process.env.CHAT_USER_ARNS || '';
  const arns = arnsEnv
    .split(',')
    .map(a => a.trim())
    .filter(a => a.length > 0);

  if (arns.length < 1) {
    throw new Error('CHAT_USER_ARNS must contain at least 1 user ARN');
  }

  return {
    users: arns.map(arn => ({
      arn,
      lastAssigned: '1970-01-01T00:00:00.000Z',
      sessionExpires: '1970-01-01T00:00:00.000Z'
    }))
  };
}

/**
 * Load user pool state from S3.
 * If the S3 object does not exist, initializes a fresh pool from environment.
 * @returns {Promise<object>} User pool state object with `users` array
 */
async function loadUserPoolState() {
  const bucket = process.env.USER_POOL_BUCKET;
  const key = process.env.USER_POOL_KEY;

  if (!bucket || !key) {
    // Fall back to initializing from environment variable
    return initializeUserPool();
  }

  try {
    const client = getS3Client();
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key
    });

    const response = await client.send(command);
    const bodyString = await response.Body.transformToString('utf-8');
    return JSON.parse(bodyString);
  } catch (err) {
    if (err.name === 'NoSuchKey' || err.Code === 'NoSuchKey') {
      // First invocation — initialize from environment
      return initializeUserPool();
    }
    throw err;
  }
}

/**
 * Save user pool state to S3.
 * @param {object} state - User pool state object with `users` array
 * @returns {Promise<void>}
 */
async function saveUserPoolState(state) {
  const bucket = process.env.USER_POOL_BUCKET;
  const key = process.env.USER_POOL_KEY;

  if (!bucket || !key) {
    console.warn('USER_POOL_BUCKET or USER_POOL_KEY not set — skipping state save');
    return;
  }

  const client = getS3Client();
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: JSON.stringify(state, null, 2),
    ContentType: 'application/json'
  });

  await client.send(command);
}

/**
 * Select the least-recently-used user from the pool.
 *
 * LRU algorithm:
 * 1. Sort users by `lastAssigned` ascending (oldest first)
 * 2. Skip users whose `sessionExpires` is in the future (active session)
 * 3. Select the first available user
 *
 * @param {object} poolState - User pool state with `users` array
 * @returns {{ user: object, index: number }|null} Selected user and its index, or null if all users are active
 */
function selectLruUser(poolState) {
  const now = new Date();
  const users = poolState.users;

  // Single-user configuration: the one registered user acts as a shared,
  // non-rotating embed identity (the same user used for dashboard embedding).
  // There is no pool to exhaust, so it is always available. LRU rotation and
  // session-exhaustion (503) only apply when a pool of 2+ users is configured
  // — that pattern is intended for anonymous-app scenarios where each session
  // needs an isolated identity.
  if (users.length === 1) {
    return { user: users[0], index: 0 };
  }

  // Create index-tagged entries for tracking original position
  const indexed = users.map((user, index) => ({ user, index }));

  // Sort by lastAssigned ascending (least recently used first)
  indexed.sort((a, b) => {
    const dateA = a.user.lastAssigned ? new Date(a.user.lastAssigned) : new Date(0);
    const dateB = b.user.lastAssigned ? new Date(b.user.lastAssigned) : new Date(0);
    return dateA.getTime() - dateB.getTime();
  });

  // Find the first user whose session has expired (or was never assigned)
  for (const entry of indexed) {
    if (!entry.user.sessionExpires) {
      return { user: entry.user, index: entry.index };
    }
    const expiresAt = new Date(entry.user.sessionExpires);
    if (expiresAt <= now) {
      return { user: entry.user, index: entry.index };
    }
  }

  // All users have active sessions — pool is exhausted
  return null;
}

/**
 * Lambda handler for POST /chat-embed
 *
 * Accepts: { sessionLifetimeInMinutes, deviceType, sessionId }
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
      embedType: 'chat',
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

  // --- Validate body size ---
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

  const { sessionLifetimeInMinutes, deviceType, sessionId } = body;
  // Cap chat sessions at 15 min — bounds reader-pool session cost/duration.
  const lifetime = Math.min(sessionLifetimeInMinutes || 15, 15);

  // --- Per-user (authenticated) path ---
  // When an authenticated identity is present (verified Cognito token claims),
  // embed as that user's own registered QuickSight identity. The LRU user pool
  // below is used ONLY when there is no authenticated identity (anonymous-app
  // deployments that rotate a pool of shared readers).
  let authedUser = null;
  try {
    const chatSharedArn = parseEnvList(process.env.CHAT_USER_ARNS)[0] || '';
    authedUser = await resolveRegisteredUser(event, {
      accountId: process.env.QUICKSIGHT_ACCOUNT_ID,
      namespace: process.env.QUICKSIGHT_NAMESPACE || 'default',
      region: process.env.QUICKSIGHT_REGION || 'us-east-1',
      qsClient: getQuickSightClient(),
      identityMode: process.env.EMBED_IDENTITY_MODE || 'per-user',
      sharedUserArn: chatSharedArn,
    });
  } catch (err) {
    console.error('User resolution error:', err.message);
    audit('error_user_resolution', {
      sessionId: sessionId || 'unknown',
      deviceType: deviceType || 'unknown',
    });
    return createResponse(500, { message: 'Internal Server Error', requestId, status: 'error' }, origin);
  }

  if (authedUser) {
    try {
      const client = getQuickSightClient();
      const allowedDomains = parseEnvList(process.env.ALLOWED_ORIGINS);
      const result = await client.send(new GenerateEmbedUrlForRegisteredUserCommand({
        AwsAccountId: process.env.QUICKSIGHT_ACCOUNT_ID,
        UserArn: authedUser.userArn,
        SessionLifetimeInMinutes: lifetime,
        // QuickChat (agent-based) experience — pairs with the widget's
        // embedQuickChat SDK call.
        ExperienceConfiguration: { QuickChat: {} },
        AllowedDomains: allowedDomains.length ? allowedDomains : undefined
      }));

      audit('success', {
        sessionId: sessionId || 'unknown',
        deviceType: deviceType || 'unknown',
        userArn: authedUser.userArn,
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
        sessionId: sessionId || 'unknown',
        deviceType: deviceType || 'unknown',
        userArn: authedUser.userArn,
      });
      return createResponse(500, { message: 'Internal Server Error', requestId, status: 'error' }, origin);
    }
  }

  // --- Load user pool state from S3 ---
  let poolState;
  try {
    poolState = await loadUserPoolState();
  } catch (err) {
    console.error('Failed to load user pool state:', err.message);
    audit('error_pool_load', {
      sessionId: sessionId || 'unknown',
      deviceType: deviceType || 'unknown',
    });
    return createResponse(500, {
      message: 'Internal Server Error',
      requestId,
      status: 'error'
    }, origin);
  }

  // --- Select least-recently-used user ---
  const selection = selectLruUser(poolState);

  if (!selection) {
    // All users have active sessions — pool exhausted
    audit('pool_exhausted', {
      sessionId: sessionId || 'unknown',
      deviceType: deviceType || 'unknown',
    });

    const response = createResponse(503, {
      message: 'Service Unavailable',
      requestId,
      status: 'pool_exhausted'
    }, origin);

    // Add Retry-After header per requirement 4.6
    response.headers['Retry-After'] = '60';
    return response;
  }

  const selectedUser = selection.user;

  // --- Generate embed URL via GenerateEmbedUrlForRegisteredUser ---
  const accountId = process.env.QUICKSIGHT_ACCOUNT_ID;

  try {
    const client = getQuickSightClient();
    const allowedDomains = parseEnvList(process.env.ALLOWED_ORIGINS);
    const command = new GenerateEmbedUrlForRegisteredUserCommand({
      AwsAccountId: accountId,
      UserArn: selectedUser.arn,
      SessionLifetimeInMinutes: lifetime,
      // QuickChat (agent-based) experience — pairs with the widget's
      // embedQuickChat SDK call.
      ExperienceConfiguration: {
        QuickChat: {}
      },
      AllowedDomains: allowedDomains.length ? allowedDomains : undefined
    });

    const result = await client.send(command);

    // --- Update user pool state in S3 ---
    const now = new Date();
    const expiresAt = new Date(now.getTime() + lifetime * 60 * 1000);

    poolState.users[selection.index].lastAssigned = now.toISOString();
    poolState.users[selection.index].sessionExpires = expiresAt.toISOString();

    // Save updated state asynchronously (fire-and-forget to reduce latency)
    saveUserPoolState(poolState).catch(err => {
      console.error('Failed to save user pool state to S3:', err.message);
    });

    audit('success', {
      sessionId: sessionId || 'unknown',
      deviceType: deviceType || 'unknown',
      userArn: selectedUser.arn,
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
      sessionId: sessionId || 'unknown',
      deviceType: deviceType || 'unknown',
      userArn: selectedUser.arn,
    });

    // Return generic error — never expose internal details
    return createResponse(500, {
      message: 'Internal Server Error',
      requestId,
      status: 'error'
    }, origin);
  }
};

// Exported for testing
exports._internal = {
  selectLruUser,
  initializeUserPool,
  loadUserPoolState,
  saveUserPoolState,
  getQuickSightClient,
  getS3Client,
  generateRequestId,
  getOrigin
};
