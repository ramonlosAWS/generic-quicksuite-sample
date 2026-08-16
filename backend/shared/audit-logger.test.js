// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

'use strict';

// Mock AWS SDK modules before requiring the audit-logger
jest.mock('@aws-sdk/client-dynamodb', () => ({
  DynamoDBClient: jest.fn().mockImplementation(() => ({}))
}));

jest.mock('@aws-sdk/lib-dynamodb', () => ({
  DynamoDBDocumentClient: {
    from: jest.fn().mockReturnValue({ send: jest.fn() })
  },
  PutCommand: jest.fn().mockImplementation((params) => ({ input: params }))
}));

const { logRequest, calculateTtl, setDocClient, DEFAULT_TTL_DAYS, SECONDS_PER_DAY } = require('./audit-logger');

describe('audit-logger module', () => {
  const originalEnv = process.env;
  let mockSend;
  let consoleErrorSpy;

  beforeEach(() => {
    process.env = { ...originalEnv };
    process.env.AUDIT_TABLE_NAME = 'test-audit-table';
    process.env.AUDIT_TTL_DAYS = '90';

    mockSend = jest.fn().mockResolvedValue({});
    setDocClient({ send: mockSend });

    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    setDocClient(null);
    consoleErrorSpy.mockRestore();
    process.env = originalEnv;
  });

  describe('calculateTtl', () => {
    it('calculates TTL based on AUDIT_TTL_DAYS env variable', () => {
      process.env.AUDIT_TTL_DAYS = '30';
      const now = Math.floor(Date.now() / 1000);
      const ttl = calculateTtl();
      const expected = now + (30 * SECONDS_PER_DAY);
      // Allow 2 seconds tolerance for test execution time
      expect(ttl).toBeGreaterThanOrEqual(expected - 2);
      expect(ttl).toBeLessThanOrEqual(expected + 2);
    });

    it('uses default 90 days when AUDIT_TTL_DAYS is not set', () => {
      delete process.env.AUDIT_TTL_DAYS;
      const now = Math.floor(Date.now() / 1000);
      const ttl = calculateTtl();
      const expected = now + (DEFAULT_TTL_DAYS * SECONDS_PER_DAY);
      expect(ttl).toBeGreaterThanOrEqual(expected - 2);
      expect(ttl).toBeLessThanOrEqual(expected + 2);
    });

    it('uses explicit ttlDays parameter when provided', () => {
      const now = Math.floor(Date.now() / 1000);
      const ttl = calculateTtl(7);
      const expected = now + (7 * SECONDS_PER_DAY);
      expect(ttl).toBeGreaterThanOrEqual(expected - 2);
      expect(ttl).toBeLessThanOrEqual(expected + 2);
    });

    it('uses default when AUDIT_TTL_DAYS is non-numeric', () => {
      process.env.AUDIT_TTL_DAYS = 'invalid';
      const now = Math.floor(Date.now() / 1000);
      const ttl = calculateTtl();
      const expected = now + (DEFAULT_TTL_DAYS * SECONDS_PER_DAY);
      expect(ttl).toBeGreaterThanOrEqual(expected - 2);
      expect(ttl).toBeLessThanOrEqual(expected + 2);
    });
  });

  describe('logRequest', () => {
    const validParams = {
      requestId: 'req-abc123',
      origin: 'https://example.com',
      dashboardId: '550e8400-e29b-41d4-a716-446655440000',
      sessionId: 'session-xyz',
      status: 'success',
      embedType: 'dashboard',
      deviceType: 'desktop',
      userArn: 'arn:aws:quicksight:us-east-1:123456789012:user/default/embed-user'
    };

    it('writes a complete audit entry to DynamoDB', async () => {
      await logRequest(validParams);

      expect(mockSend).toHaveBeenCalledTimes(1);
      const putCommand = mockSend.mock.calls[0][0];
      const item = putCommand.input.Item;

      expect(putCommand.input.TableName).toBe('test-audit-table');
      expect(item.requestId).toBe('req-abc123');
      expect(item.origin).toBe('https://example.com');
      expect(item.dashboardId).toBe('550e8400-e29b-41d4-a716-446655440000');
      expect(item.sessionId).toBe('session-xyz');
      expect(item.status).toBe('success');
      expect(item.embedType).toBe('dashboard');
      expect(item.deviceType).toBe('desktop');
      expect(item.userArn).toBe('arn:aws:quicksight:us-east-1:123456789012:user/default/embed-user');
    });

    it('includes a numeric timestamp (Unix epoch milliseconds)', async () => {
      const before = Date.now();
      await logRequest(validParams);
      const after = Date.now();

      const item = mockSend.mock.calls[0][0].input.Item;
      expect(typeof item.timestamp).toBe('number');
      expect(item.timestamp).toBeGreaterThanOrEqual(before);
      expect(item.timestamp).toBeLessThanOrEqual(after);
    });

    it('includes a TTL attribute (Unix epoch seconds)', async () => {
      await logRequest(validParams);

      const item = mockSend.mock.calls[0][0].input.Item;
      expect(typeof item.ttl).toBe('number');
      const nowSeconds = Math.floor(Date.now() / 1000);
      const expectedMin = nowSeconds + (90 * SECONDS_PER_DAY) - 2;
      expect(item.ttl).toBeGreaterThanOrEqual(expectedMin);
    });

    it('does not throw when DynamoDB write fails', async () => {
      mockSend.mockRejectedValue(new Error('DynamoDB connection timeout'));

      // Should not throw
      await expect(logRequest(validParams)).resolves.toBeUndefined();
    });

    it('logs error to console when DynamoDB write fails', async () => {
      mockSend.mockRejectedValue(new Error('DynamoDB connection timeout'));

      await logRequest(validParams);

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Audit log write failed:',
        'DynamoDB connection timeout'
      );
    });

    it('does not call DynamoDB when AUDIT_TABLE_NAME is not set', async () => {
      delete process.env.AUDIT_TABLE_NAME;

      await logRequest(validParams);

      expect(mockSend).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Audit log write failed: AUDIT_TABLE_NAME environment variable is not set'
      );
    });

    it('uses default values for missing optional fields', async () => {
      await logRequest({ requestId: 'req-minimal' });

      const item = mockSend.mock.calls[0][0].input.Item;
      expect(item.requestId).toBe('req-minimal');
      expect(item.origin).toBe('unknown');
      expect(item.dashboardId).toBe('N/A');
      expect(item.sessionId).toBe('unknown');
      expect(item.status).toBe('unknown');
      expect(item.embedType).toBe('unknown');
      expect(item.deviceType).toBe('unknown');
      expect(item.userArn).toBe('unknown');
    });

    it('returns a Promise (fire-and-forget pattern)', () => {
      const result = logRequest(validParams);
      expect(result).toBeInstanceOf(Promise);
    });

    it('uses the configured table name from environment', async () => {
      process.env.AUDIT_TABLE_NAME = 'custom-audit-table';

      await logRequest(validParams);

      const putCommand = mockSend.mock.calls[0][0];
      expect(putCommand.input.TableName).toBe('custom-audit-table');
    });

    it('handles chat embed type correctly', async () => {
      await logRequest({
        ...validParams,
        embedType: 'chat',
        dashboardId: 'N/A'
      });

      const item = mockSend.mock.calls[0][0].input.Item;
      expect(item.embedType).toBe('chat');
      expect(item.dashboardId).toBe('N/A');
    });
  });
});
