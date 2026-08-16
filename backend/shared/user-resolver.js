// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

'use strict';

const {
  RegisterUserCommand,
} = require('@aws-sdk/client-quicksight');

/**
 * Resolve the QuickSight registered user to embed as, from the verified
 * identity claims attached by the API Gateway Cognito authorizer.
 *
 * Security: the identity is taken ONLY from `event.requestContext.authorizer.claims`,
 * which API Gateway populates after cryptographically validating the caller's
 * Cognito JWT. A client cannot forge these claims. We never trust a
 * user-supplied username/email from the request body.
 *
 * Behavior: the user's verified email becomes their QuickSight username. If a
 * matching QuickSight reader does not yet exist, one is registered just-in-time
 * (idempotent — an already-existing user is treated as success). The returned
 * ARN is then used with GenerateEmbedUrlForRegisteredUser.
 *
 * @param {object} event - API Gateway REST event
 * @param {object} opts
 * @param {string} opts.accountId - QuickSight AWS account ID
 * @param {string} opts.namespace - QuickSight namespace (e.g. "default")
 * @param {string} opts.region - QuickSight region
 * @param {object} opts.qsClient - QuickSightClient instance
 * @returns {Promise<{ userArn: string, email: string }|null>} resolved user, or null if no verified identity
 */
async function resolveRegisteredUser(event, opts) {
  const claims = getClaims(event);
  if (!claims) {
    return null;
  }

  const email = (claims.email || claims['cognito:username'] || '').trim();
  if (!email) {
    return null;
  }

  const { accountId, namespace, region, qsClient } = opts;
  const identityMode = opts.identityMode || 'per-user';

  // --- Shared-identity mode ---
  // Login is still required (this function only returns when the request
  // carries verified claims), but every authenticated viewer is embedded as a
  // single pre-existing registered QuickSight user. Use this when the account
  // cannot provision users on demand — e.g. QuickSight managed by IAM Identity
  // Center, where RegisterUser is disabled. No user is created here.
  if (identityMode === 'shared') {
    if (!opts.sharedUserArn) {
      return null;
    }
    return { userArn: opts.sharedUserArn, email: email };
  }

  // The verified email is the QuickSight username. Many QuickSight accounts
  // already use email-formatted usernames, so this maps cleanly.
  const userName = email;
  const userArn = `arn:aws:quicksight:${region}:${accountId}:user/${namespace}/${userName}`;

  // Just-in-time registration (idempotent). If the user already exists,
  // QuickSight returns ResourceExistsException, which we treat as success.
  try {
    await qsClient.send(new RegisterUserCommand({
      AwsAccountId: accountId,
      Namespace: namespace,
      IdentityType: 'QUICKSIGHT',
      UserRole: 'READER',
      Email: email,
      UserName: userName,
    }));
  } catch (err) {
    const name = err && (err.name || err.Code || err.__type || '');
    if (!/ResourceExistsException/i.test(String(name))) {
      // Any other error (throttling, access denied, etc.) is surfaced to the
      // caller so the handler can return a generic 500 and log it.
      throw err;
    }
  }

  return { userArn, email };
}

/**
 * Extract the authorizer-provided claims from an API Gateway REST event.
 * Returns null if none are present (e.g. local/unauthenticated invocation).
 * @param {object} event
 * @returns {object|null}
 */
function getClaims(event) {
  const authorizer = event
    && event.requestContext
    && event.requestContext.authorizer;
  if (!authorizer) return null;
  // REST API Cognito authorizer places claims under `.claims`.
  if (authorizer.claims && typeof authorizer.claims === 'object') {
    return authorizer.claims;
  }
  return null;
}

module.exports = { resolveRegisteredUser, getClaims };
