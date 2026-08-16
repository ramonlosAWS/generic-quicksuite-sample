// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

'use strict';

// Mock AWS SDK clients before requiring the module
const mockQsSend = jest.fn();
const mockS3Send = jest.fn();

jest.mock('@aws-sdk/client-quicksight', () => ({
  QuickSightClient: jest.fn().mockImplementation(() => ({
    send: mockQsSend
  })),
  GenerateEmbedUrlForRegisteredUserCommand: jest.fn().mockImplementation((params) => params),
  RegisterUserCommand: jest.fn().mockImplementation((params) => params)
}), { virtual: true });

jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn().mockImplementation(() => ({
    send: mockS3Send
  })),
  GetObjectCommand: jest.fn().mockImplementation((params) => ({ ...params, _type: 'Get' })),
  PutObjectCommand: jest.fn().mockImplementation((params) => ({ ...params, _type: 'Put' }))
}), { virtual: true });

jest.mock('../shared/audit-logger.js', () => ({
  logRequest: jest.fn().mockResolvedValue(undefined)
}));

const { handler, _internal } = require('./index');
const { selectLruUser, initializeUserPool } = _internal;

describe('chat-embed Lambda', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      QUICKSIGHT_ACCOUNT_ID: '123456789012',
      QUICKSIGHT_REGION: 'us-east-1',
      QUICKSIGHT_NAMESPACE: 'default',
      CHAT_USER_ARNS: 'arn:aws:quicksight:us-east-1:123456789012:user/default/chat-user-1,arn:aws:quicksight:us-east-1:123456789012:user/default/chat-user-2',
      USER_POOL_BUCKET: 'test-bucket',
      USER_POOL_KEY: 'user-pool-state.json',
      ALLOWED_ORIGINS: 'https://example.com,https://app.example.com',
      AUDIT_TABLE_NAME: 'test-audit-table'
    };
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.clearAllMocks();
  });

  describe('selectLruUser', () => {
    it('selects the user with the oldest lastAssigned when both are available', () => {
      const state = {
        users: [
          { arn: 'arn:user1', lastAssigned: '2024-01-15T10:00:00Z', sessionExpires: '2020-01-01T00:00:00Z' },
          { arn: 'arn:user2', lastAssigned: '2024-01-15T09:00:00Z', sessionExpires: '2020-01-01T00:00:00Z' }
        ]
      };

      const result = selectLruUser(state);
      expect(result).not.toBeNull();
      expect(result.user.arn).toBe('arn:user2'); // Older lastAssigned
      expect(result.index).toBe(1);
    });

    it('skips users with active sessions', () => {
      const futureDate = new Date(Date.now() + 3600000).toISOString(); // 1 hour from now
      const state = {
        users: [
          { arn: 'arn:user1', lastAssigned: '2024-01-15T10:00:00Z', sessionExpires: futureDate },
          { arn: 'arn:user2', lastAssigned: '2024-01-15T09:00:00Z', sessionExpires: '2020-01-01T00:00:00Z' }
        ]
      };

      const result = selectLruUser(state);
      expect(result).not.toBeNull();
      expect(result.user.arn).toBe('arn:user2'); // Only available user
    });

    it('returns null when all users have active sessions', () => {
      const futureDate = new Date(Date.now() + 3600000).toISOString();
      const state = {
        users: [
          { arn: 'arn:user1', lastAssigned: '2024-01-15T10:00:00Z', sessionExpires: futureDate },
          { arn: 'arn:user2', lastAssigned: '2024-01-15T09:00:00Z', sessionExpires: futureDate }
        ]
      };

      const result = selectLruUser(state);
      expect(result).toBeNull();
    });

    it('handles epoch-zero timestamps (fresh pool)', () => {
      const state = {
        users: [
          { arn: 'arn:user1', lastAssigned: '1970-01-01T00:00:00.000Z', sessionExpires: '1970-01-01T00:00:00.000Z' },
          { arn: 'arn:user2', lastAssigned: '1970-01-01T00:00:00.000Z', sessionExpires: '1970-01-01T00:00:00.000Z' }
        ]
      };

      const result = selectLruUser(state);
      expect(result).not.toBeNull();
      // Both have same timestamp — first one wins from stable sort
      expect(result.index).toBe(0);
    });
  });

  describe('initializeUserPool', () => {
    it('creates pool from CHAT_USER_ARNS', () => {
      const pool = initializeUserPool();
      expect(pool.users).toHaveLength(2);
      expect(pool.users[0].arn).toBe('arn:aws:quicksight:us-east-1:123456789012:user/default/chat-user-1');
      expect(pool.users[1].arn).toBe('arn:aws:quicksight:us-east-1:123456789012:user/default/chat-user-2');
      expect(pool.users[0].lastAssigned).toBe('1970-01-01T00:00:00.000Z');
      expect(pool.users[0].sessionExpires).toBe('1970-01-01T00:00:00.000Z');
    });

    it('accepts a single user ARN (shared, non-rotating embed identity)', () => {
      process.env.CHAT_USER_ARNS = 'arn:aws:quicksight:us-east-1:123456789012:user/default/solo';
      const pool = initializeUserPool();
      expect(pool.users).toHaveLength(1);
      expect(pool.users[0].arn).toBe('arn:aws:quicksight:us-east-1:123456789012:user/default/solo');
    });

    it('throws when no user ARNs are configured', () => {
      process.env.CHAT_USER_ARNS = '';
      expect(() => initializeUserPool()).toThrow('CHAT_USER_ARNS must contain at least 1 user ARN');
    });
  });

  describe('handler - origin validation', () => {
    it('returns 403 for disallowed origin', async () => {
      const event = {
        headers: { origin: 'https://malicious.com' },
        body: JSON.stringify({ sessionLifetimeInMinutes: 15 })
      };

      const response = await handler(event);
      expect(response.statusCode).toBe(403);
      expect(JSON.parse(response.body).message).toBe('Forbidden');
      // No CORS headers when origin is invalid
      expect(response.headers['Access-Control-Allow-Origin']).toBeUndefined();
    });

    it('returns 403 for missing origin', async () => {
      const event = {
        headers: {},
        body: JSON.stringify({ sessionLifetimeInMinutes: 15 })
      };

      const response = await handler(event);
      expect(response.statusCode).toBe(403);
    });
  });

  describe('handler - body validation', () => {
    it('returns 413 for oversized body', async () => {
      const event = {
        headers: { origin: 'https://example.com' },
        body: 'x'.repeat(11 * 1024) // >10KB
      };

      const response = await handler(event);
      expect(response.statusCode).toBe(413);
      expect(JSON.parse(response.body).message).toBe('Payload Too Large');
    });

    it('returns 400 for invalid JSON', async () => {
      const event = {
        headers: { origin: 'https://example.com' },
        body: 'not-json{{'
      };

      const response = await handler(event);
      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.body).message).toBe('Bad Request');
    });
  });

  describe('handler - security headers', () => {
    it('includes security headers on error responses', async () => {
      const event = {
        headers: { origin: 'https://malicious.com' },
        body: '{}'
      };

      const response = await handler(event);
      expect(response.headers['Content-Type']).toBe('application/json');
      expect(response.headers['X-Content-Type-Options']).toBe('nosniff');
      expect(response.headers['Strict-Transport-Security']).toBe('max-age=31536000');
    });
  });
});
