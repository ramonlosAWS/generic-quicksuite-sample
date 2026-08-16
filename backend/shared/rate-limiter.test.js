// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

'use strict';

jest.mock('@aws-sdk/client-dynamodb', () => ({
  DynamoDBClient: jest.fn().mockImplementation(() => ({ send: jest.fn() })),
  UpdateItemCommand: jest.fn().mockImplementation((p) => p)
}), { virtual: true });

const { checkRateLimit, getClientIp, setClient } = require('./rate-limiter');

const originalEnv = process.env;
beforeEach(() => {
  process.env = { ...originalEnv, AUDIT_TABLE_NAME: 'audit', RATE_LIMIT_PER_MINUTE: '60' };
});
afterEach(() => { process.env = originalEnv; });

describe('rate-limiter.getClientIp', () => {
  it('reads sourceIp from the API Gateway request context', () => {
    expect(getClientIp({ requestContext: { identity: { sourceIp: '1.2.3.4' } } })).toBe('1.2.3.4');
  });
  it('returns empty string when absent', () => {
    expect(getClientIp({})).toBe('');
  });
});

describe('rate-limiter.checkRateLimit', () => {
  it('is disabled (always allowed) when RATE_LIMIT_PER_MINUTE=0', async () => {
    process.env.RATE_LIMIT_PER_MINUTE = '0';
    const r = await checkRateLimit('1.2.3.4');
    expect(r.allowed).toBe(true);
  });

  it('allows when the per-minute count is at or below the limit', async () => {
    setClient({ send: jest.fn().mockResolvedValue({ Attributes: { reqCount: { N: '60' } } }) });
    const r = await checkRateLimit('1.2.3.4');
    expect(r.allowed).toBe(true);
    expect(r.count).toBe(60);
  });

  it('blocks with Retry-After when the count exceeds the limit', async () => {
    setClient({ send: jest.fn().mockResolvedValue({ Attributes: { reqCount: { N: '61' } } }) });
    const r = await checkRateLimit('1.2.3.4');
    expect(r.allowed).toBe(false);
    expect(r.retryAfterSeconds).toBeGreaterThanOrEqual(1);
    expect(r.retryAfterSeconds).toBeLessThanOrEqual(60);
  });

  it('FAILS OPEN when DynamoDB is unreachable', async () => {
    setClient({ send: jest.fn().mockRejectedValue(new Error('DDB down')) });
    const r = await checkRateLimit('1.2.3.4');
    expect(r.allowed).toBe(true);
  });

  it('fails open (allowed) when no IP is available', async () => {
    const r = await checkRateLimit('');
    expect(r.allowed).toBe(true);
  });
});
