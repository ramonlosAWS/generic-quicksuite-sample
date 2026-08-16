// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

'use strict';

// Mock the QuickSight SDK so RegisterUserCommand can be constructed in tests.
jest.mock('@aws-sdk/client-quicksight', () => ({
  RegisterUserCommand: jest.fn().mockImplementation((params) => ({ _cmd: 'RegisterUser', ...params }))
}), { virtual: true });

const { resolveRegisteredUser, getClaims } = require('./user-resolver');

const OPTS = () => ({
  accountId: '123456789012',
  namespace: 'default',
  region: 'us-east-1',
  qsClient: { send: jest.fn().mockResolvedValue({}) },
});

/** Build an API Gateway event carrying Cognito authorizer claims. */
function eventWithClaims(claims) {
  return { requestContext: { authorizer: { claims } } };
}

describe('user-resolver.getClaims', () => {
  it('returns null when there is no authorizer', () => {
    expect(getClaims({})).toBeNull();
    expect(getClaims({ requestContext: {} })).toBeNull();
  });

  it('returns the claims object when present', () => {
    const claims = { email: 'a@example.com' };
    expect(getClaims(eventWithClaims(claims))).toBe(claims);
  });
});

describe('user-resolver.resolveRegisteredUser', () => {
  it('returns null when there are no verified claims (anonymous invocation)', async () => {
    const result = await resolveRegisteredUser({}, OPTS());
    expect(result).toBeNull();
  });

  it('derives the QuickSight user ARN from the verified email claim', async () => {
    const opts = OPTS();
    const result = await resolveRegisteredUser(
      eventWithClaims({ email: 'dana@example.com' }),
      opts
    );
    expect(result).toEqual({
      userArn: 'arn:aws:quicksight:us-east-1:123456789012:user/default/dana@example.com',
      email: 'dana@example.com',
    });
    // Attempted JIT registration
    expect(opts.qsClient.send).toHaveBeenCalledTimes(1);
  });

  it('falls back to cognito:username when email claim is absent', async () => {
    const opts = OPTS();
    const result = await resolveRegisteredUser(
      eventWithClaims({ 'cognito:username': 'sam' }),
      opts
    );
    expect(result.userArn).toBe('arn:aws:quicksight:us-east-1:123456789012:user/default/sam');
  });

  it('treats ResourceExistsException from RegisterUser as success (idempotent)', async () => {
    const opts = OPTS();
    const err = new Error('exists');
    err.name = 'ResourceExistsException';
    opts.qsClient.send = jest.fn().mockRejectedValue(err);

    const result = await resolveRegisteredUser(
      eventWithClaims({ email: 'exists@example.com' }),
      opts
    );
    expect(result.email).toBe('exists@example.com');
  });

  it('rethrows non-exists errors from RegisterUser', async () => {
    const opts = OPTS();
    const err = new Error('throttled');
    err.name = 'ThrottlingException';
    opts.qsClient.send = jest.fn().mockRejectedValue(err);

    await expect(
      resolveRegisteredUser(eventWithClaims({ email: 'x@example.com' }), opts)
    ).rejects.toThrow('throttled');
  });

  it('returns null when claims exist but carry no usable identity', async () => {
    const result = await resolveRegisteredUser(eventWithClaims({ sub: 'abc' }), OPTS());
    expect(result).toBeNull();
  });

  describe('shared identity mode', () => {
    it('embeds authenticated users as the shared user ARN without registering', async () => {
      const opts = { ...OPTS(), identityMode: 'shared', sharedUserArn: 'arn:aws:quicksight:us-east-1:123456789012:user/default/reader1' };
      const result = await resolveRegisteredUser(
        eventWithClaims({ email: 'anyone@example.com' }),
        opts
      );
      expect(result.userArn).toBe('arn:aws:quicksight:us-east-1:123456789012:user/default/reader1');
      expect(result.email).toBe('anyone@example.com');
      // No RegisterUser call in shared mode
      expect(opts.qsClient.send).not.toHaveBeenCalled();
    });

    it('still requires authentication in shared mode (no claims -> null)', async () => {
      const opts = { ...OPTS(), identityMode: 'shared', sharedUserArn: 'arn:aws:quicksight:us-east-1:123456789012:user/default/reader1' };
      const result = await resolveRegisteredUser({}, opts);
      expect(result).toBeNull();
    });

    it('returns null in shared mode when no shared ARN is configured', async () => {
      const opts = { ...OPTS(), identityMode: 'shared', sharedUserArn: '' };
      const result = await resolveRegisteredUser(eventWithClaims({ email: 'a@b.com' }), opts);
      expect(result).toBeNull();
    });
  });
});
