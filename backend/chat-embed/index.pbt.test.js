// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

'use strict';

// Mock AWS SDK clients so the module can be imported without real dependencies
jest.mock('@aws-sdk/client-quicksight', () => ({
  QuickSightClient: jest.fn().mockImplementation(() => ({ send: jest.fn() })),
  GenerateEmbedUrlForRegisteredUserCommand: jest.fn(),
  RegisterUserCommand: jest.fn()
}), { virtual: true });

jest.mock('@aws-sdk/client-s3', () => ({
  S3Client: jest.fn().mockImplementation(() => ({ send: jest.fn() })),
  GetObjectCommand: jest.fn(),
  PutObjectCommand: jest.fn()
}), { virtual: true });

jest.mock('../shared/audit-logger.js', () => ({
  logRequest: jest.fn().mockResolvedValue(undefined)
}));

const fc = require('fast-check');
const { _internal } = require('./index.js');

const { selectLruUser, initializeUserPool } = _internal;

/**
 * Property-Based Tests for User Pool LRU Rotation and Anonymous Embedding Prevention
 *
 * Feature: generic-quicksuite-widget
 *
 * Tests Properties 8 and 11 from the design document.
 */

// --- Arbitrary Generators ---

/** Generate a user pool where at least one user has expired session (available) */
const arbPoolWithAvailableUsers = fc.integer({ min: 2, max: 8 }).chain(numUsers =>
  fc.array(
    fc.tuple(
      // lastAssigned: random past timestamps (varied)
      fc.date({ min: new Date('2020-01-01'), max: new Date('2025-06-01') }),
      // sessionExpires always in the past (before now) — user is available
      fc.date({ min: new Date('2020-01-01'), max: new Date('2024-12-31') })
    ),
    { minLength: numUsers, maxLength: numUsers }
  ).map(entries => ({
    users: entries.map(([lastAssigned, sessionExpires], i) => ({
      arn: `arn:aws:quicksight:us-east-1:123456789012:user/default/chat-user-${i + 1}`,
      lastAssigned: lastAssigned.toISOString(),
      sessionExpires: sessionExpires.toISOString()
    }))
  }))
);

/** Generate a user pool where ALL users have active sessions (future expiry) */
const arbPoolAllActive = fc.integer({ min: 2, max: 6 }).chain(numUsers =>
  fc.array(
    fc.tuple(
      fc.date({ min: new Date('2025-01-01'), max: new Date('2025-06-01') }),
      // sessionExpires in the far future — all active
      fc.date({ min: new Date('2099-01-01'), max: new Date('2099-12-31') })
    ),
    { minLength: numUsers, maxLength: numUsers }
  ).map(entries => ({
    users: entries.map(([lastAssigned, sessionExpires], i) => ({
      arn: `arn:aws:quicksight:us-east-1:123456789012:user/default/chat-user-${i + 1}`,
      lastAssigned: lastAssigned.toISOString(),
      sessionExpires: sessionExpires.toISOString()
    }))
  }))
);

// --- Setup and Teardown ---

const originalEnv = process.env;

beforeEach(() => {
  process.env = {
    ...originalEnv,
    CHAT_USER_ARNS: 'arn:aws:quicksight:us-east-1:123456789012:user/default/chat-user-1,arn:aws:quicksight:us-east-1:123456789012:user/default/chat-user-2,arn:aws:quicksight:us-east-1:123456789012:user/default/chat-user-3'
  };
});

afterEach(() => {
  process.env = originalEnv;
});

// --- Property 8: User Pool LRU Rotation ---

describe('Property 8: User Pool LRU Rotation', () => {
  /**
   * Feature: generic-quicksuite-widget, Property 8: User Pool LRU Rotation
   * **Validates: Requirements 4.3, 4.7**
   *
   * For any sequence of chat embed requests, the Backend shall select the
   * User_Pool member whose lastAssigned timestamp is oldest (least recently used).
   * A user shall not be selected again until their session expires.
   */

  it('selects the user with the oldest lastAssigned among available users', () => {
    fc.assert(
      fc.property(arbPoolWithAvailableUsers, (poolState) => {
        const result = selectLruUser(poolState);

        // Must select someone (pool has available users)
        expect(result).not.toBeNull();

        const selectedUser = result.user;
        const now = new Date();

        // The selected user must have an expired session (available)
        expect(new Date(selectedUser.sessionExpires).getTime()).toBeLessThan(now.getTime());

        // Among all available users, the selected one must have the oldest lastAssigned
        const availableUsers = poolState.users.filter(
          u => new Date(u.sessionExpires) < now
        );

        const oldestLastAssigned = Math.min(
          ...availableUsers.map(u => new Date(u.lastAssigned).getTime())
        );

        expect(new Date(selectedUser.lastAssigned).getTime()).toBe(oldestLastAssigned);
      }),
      { numRuns: 100 }
    );
  });

  it('returns null when all users have active sessions (pool exhausted)', () => {
    fc.assert(
      fc.property(arbPoolAllActive, (poolState) => {
        const result = selectLruUser(poolState);

        // All users are active — must return null
        expect(result).toBeNull();
      }),
      { numRuns: 100 }
    );
  });

  it('skips users with active sessions even if they have older lastAssigned', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 6 }),
        fc.date({ min: new Date('2020-01-01'), max: new Date('2023-01-01') }),
        (numUsers, oldDate) => {
          // Create pool: first user has oldest lastAssigned but active session,
          // other users have newer lastAssigned but expired sessions
          const users = [];
          for (let i = 0; i < numUsers; i++) {
            if (i === 0) {
              // Oldest lastAssigned but session still active (future expiry)
              users.push({
                arn: `arn:aws:quicksight:us-east-1:123456789012:user/default/chat-user-${i + 1}`,
                lastAssigned: oldDate.toISOString(),
                sessionExpires: '2099-12-31T23:59:59.999Z'
              });
            } else {
              // Newer lastAssigned but session expired
              const newerDate = new Date(oldDate.getTime() + i * 86400000);
              users.push({
                arn: `arn:aws:quicksight:us-east-1:123456789012:user/default/chat-user-${i + 1}`,
                lastAssigned: newerDate.toISOString(),
                sessionExpires: '2020-01-01T00:00:00.000Z'
              });
            }
          }

          const poolState = { users };
          const result = selectLruUser(poolState);

          // Must NOT select user-1 (active session)
          expect(result).not.toBeNull();
          expect(result.user.arn).not.toBe(users[0].arn);

          // Must select the available user with the oldest lastAssigned
          const availableUsers = users.filter(
            u => new Date(u.sessionExpires) < new Date()
          );
          const expectedOldest = availableUsers.reduce((min, u) =>
            new Date(u.lastAssigned) < new Date(min.lastAssigned) ? u : min
          );
          expect(result.user.arn).toBe(expectedOldest.arn);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('sequential selections follow LRU order for fresh pools', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 2, max: 5 }),
        (numUsers) => {
          process.env.CHAT_USER_ARNS = Array.from(
            { length: numUsers },
            (_, i) => `arn:aws:quicksight:us-east-1:123456789012:user/default/pool-user-${i + 1}`
          ).join(',');

          const poolState = initializeUserPool();

          // All users start with same epoch lastAssigned — first selected is index 0
          const first = selectLruUser(poolState);
          expect(first).not.toBeNull();
          expect(first.index).toBe(0);

          // Simulate assigning: update timestamps
          const now = new Date();
          poolState.users[first.index].lastAssigned = now.toISOString();
          poolState.users[first.index].sessionExpires = new Date(now.getTime() + 15 * 60000).toISOString();

          // Second selection should NOT pick the same user (session active)
          const second = selectLruUser(poolState);
          expect(second).not.toBeNull();
          expect(second.index).not.toBe(first.index);
        }
      ),
      { numRuns: 100 }
    );
  });
});

// --- Property 11: No Anonymous Embedding ---

describe('Property 11: No Anonymous Embedding', () => {
  /**
   * Feature: generic-quicksuite-widget, Property 11: No Anonymous Embedding
   * **Validates: Requirements 5.8**
   *
   * For any code path in the Backend, GenerateEmbedUrlForAnonymousUser shall
   * never be called. All embed URLs shall be generated exclusively via
   * GenerateEmbedUrlForRegisteredUser.
   */

  it('source code contains no reference to GenerateEmbedUrlForAnonymousUser', () => {
    const fs = require('fs');
    const path = require('path');

    // Read the chat-embed Lambda source
    const chatEmbedSource = fs.readFileSync(
      path.join(__dirname, 'index.js'),
      'utf8'
    );

    // Read the dashboard-embed Lambda source
    const dashboardEmbedSource = fs.readFileSync(
      path.join(__dirname, '..', 'dashboard-embed', 'index.js'),
      'utf8'
    );

    // Read all shared modules
    const sharedDir = path.join(__dirname, '..', 'shared');
    const sharedFiles = fs.readdirSync(sharedDir)
      .filter(f => f.endsWith('.js') && !f.includes('.test.'))
      .map(f => fs.readFileSync(path.join(sharedDir, f), 'utf8'));

    const allSources = [chatEmbedSource, dashboardEmbedSource, ...sharedFiles];

    // Property: no source file references the anonymous embedding API
    fc.assert(
      fc.property(
        fc.constantFrom(...allSources),
        (source) => {
          expect(source).not.toContain('GenerateEmbedUrlForAnonymousUser');
          expect(source).not.toContain('generateEmbedUrlForAnonymousUser');
          expect(source).not.toContain('AnonymousUser');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('only GenerateEmbedUrlForRegisteredUser is imported and used', () => {
    const fs = require('fs');
    const path = require('path');

    const chatEmbedSource = fs.readFileSync(
      path.join(__dirname, 'index.js'),
      'utf8'
    );

    // Verify the registered user command IS present (positive check)
    expect(chatEmbedSource).toContain('GenerateEmbedUrlForRegisteredUserCommand');

    // Verify no anonymous variant exists in any form
    const anonymousPatterns = [
      'GenerateEmbedUrlForAnonymousUser',
      'AnonymousUserEmbedding',
      'anonymousUser',
      'anonymous-user',
      'ANONYMOUS'
    ];

    fc.assert(
      fc.property(
        fc.constantFrom(...anonymousPatterns),
        (pattern) => {
          expect(chatEmbedSource).not.toContain(pattern);
        }
      ),
      { numRuns: 100 }
    );
  });
});
