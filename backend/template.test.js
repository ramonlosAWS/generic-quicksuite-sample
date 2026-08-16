// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

'use strict';

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const TEMPLATE_PATH = path.join(__dirname, 'template.yaml');

/**
 * Build a custom js-yaml schema that handles CloudFormation intrinsic function
 * tags (!Sub, !Ref, !GetAtt, !Join, !Select, !If, !Split, !ImportValue, !FindInMap).
 * Each tag is treated as a passthrough so the YAML parses cleanly for static analysis.
 */
function buildCfnSchema() {
  const cfnTags = [
    'Sub', 'Ref', 'GetAtt', 'Join', 'Select', 'If',
    'Split', 'ImportValue', 'FindInMap', 'Equals',
    'Not', 'And', 'Or', 'Condition', 'GetAZs',
  ];

  const types = [];
  for (const tag of cfnTags) {
    types.push(new yaml.Type(`!${tag}`, {
      kind: 'scalar',
      construct: data => ({ 'Fn::Tag': tag, value: data }),
    }));
    types.push(new yaml.Type(`!${tag}`, {
      kind: 'sequence',
      construct: data => ({ 'Fn::Tag': tag, value: data }),
    }));
    types.push(new yaml.Type(`!${tag}`, {
      kind: 'mapping',
      construct: data => ({ 'Fn::Tag': tag, value: data }),
    }));
  }

  return yaml.Schema.create(types);
}

const CFN_SCHEMA = buildCfnSchema();

describe('SAM template validation', () => {
  let template;

  beforeAll(() => {
    const raw = fs.readFileSync(TEMPLATE_PATH, 'utf8');
    template = yaml.load(raw, { schema: CFN_SCHEMA });
  });

  // --- Structural checks ---

  describe('template structure', () => {
    it('parses as valid YAML', () => {
      expect(template).toBeDefined();
      expect(typeof template).toBe('object');
    });

    it('has AWSTemplateFormatVersion and Transform', () => {
      expect(template.AWSTemplateFormatVersion).toBe('2010-09-09');
      expect(template.Transform).toBe('AWS::Serverless-2016-10-31');
    });

    it('defines an API Gateway resource', () => {
      const resources = template.Resources;
      const apiResources = Object.entries(resources).filter(
        ([, v]) => v.Type === 'AWS::Serverless::Api'
      );
      expect(apiResources.length).toBeGreaterThanOrEqual(1);
    });

    it('defines Lambda function resources', () => {
      const resources = template.Resources;
      const lambdaResources = Object.entries(resources).filter(
        ([, v]) => v.Type === 'AWS::Serverless::Function'
      );
      expect(lambdaResources.length).toBeGreaterThanOrEqual(2);
    });

    it('defines a DynamoDB table resource', () => {
      const resources = template.Resources;
      const dynamoResources = Object.entries(resources).filter(
        ([, v]) => v.Type === 'AWS::DynamoDB::Table'
      );
      expect(dynamoResources.length).toBeGreaterThanOrEqual(1);
    });

    it('defines an S3 bucket resource', () => {
      const resources = template.Resources;
      const s3Resources = Object.entries(resources).filter(
        ([, v]) => v.Type === 'AWS::S3::Bucket'
      );
      expect(s3Resources.length).toBeGreaterThanOrEqual(1);
    });
  });

  // --- Parameter validation ---

  describe('parameter validation', () => {
    it('QuickSightAccountId requires exactly 12 digits', () => {
      const param = template.Parameters.QuickSightAccountId;
      expect(param).toBeDefined();
      expect(param.AllowedPattern).toBe('^\\d{12}$');
    });

    it('AuditLogTtlDays has MinValue 1 and MaxValue 365', () => {
      const param = template.Parameters.AuditLogTtlDays;
      expect(param).toBeDefined();
      expect(param.MinValue).toBe(1);
      expect(param.MaxValue).toBe(365);
    });

    it('QuickSightRegion has AllowedValues constraint', () => {
      const param = template.Parameters.QuickSightRegion;
      expect(param).toBeDefined();
      expect(Array.isArray(param.AllowedValues)).toBe(true);
      expect(param.AllowedValues.length).toBeGreaterThan(0);
    });

    it('ChatEnabled has AllowedValues of true/false', () => {
      const param = template.Parameters.ChatEnabled;
      expect(param).toBeDefined();
      expect(param.AllowedValues).toEqual(expect.arrayContaining(['true', 'false']));
    });
  });

  // --- DynamoDB TTL ---

  describe('DynamoDB TTL configuration', () => {
    it('DynamoDB table has TTL attribute defined', () => {
      const resources = template.Resources;
      const dynamoTables = Object.entries(resources).filter(
        ([, v]) => v.Type === 'AWS::DynamoDB::Table'
      );

      for (const [name, resource] of dynamoTables) {
        const ttlSpec = resource.Properties.TimeToLiveSpecification;
        expect(ttlSpec).toBeDefined();
        expect(ttlSpec.Enabled).toBe(true);
        expect(ttlSpec.AttributeName).toBeDefined();
        expect(typeof ttlSpec.AttributeName).toBe('string');
        expect(ttlSpec.AttributeName.length).toBeGreaterThan(0);
      }
    });
  });

  // --- IAM policy security checks ---

  describe('IAM policy security', () => {
    /**
     * Recursively collect all IAM policy statements from the template.
     */
    function collectAllPolicyStatements() {
      const statements = [];
      const resources = template.Resources;

      for (const [, resource] of Object.entries(resources)) {
        // Check inline policies on IAM roles
        if (resource.Type === 'AWS::IAM::Role' && resource.Properties.Policies) {
          for (const policy of resource.Properties.Policies) {
            const stmts = policy.PolicyDocument?.Statement || [];
            statements.push(...stmts);
          }
        }

        // Check managed policies
        if (resource.Type === 'AWS::IAM::Policy' && resource.Properties.PolicyDocument) {
          const stmts = resource.Properties.PolicyDocument.Statement || [];
          statements.push(...stmts);
        }
      }

      return statements;
    }

    /**
     * Extract all Action values from a statement (handles string and array).
     */
    function getActions(statement) {
      const action = statement.Action;
      if (!action) return [];
      if (Array.isArray(action)) return action;
      return [action];
    }

    it('no wildcard service-level permissions (Action: "*" or Action: "service:*")', () => {
      const statements = collectAllPolicyStatements();
      expect(statements.length).toBeGreaterThan(0);

      for (const statement of statements) {
        const actions = getActions(statement);
        for (const action of actions) {
          // Reject full wildcard
          expect(action).not.toBe('*');
          // Reject service-level wildcard like "s3:*", "quicksight:*"
          expect(action).not.toMatch(/^[a-zA-Z0-9-]+:\*$/);
        }
      }
    });

    it('no GenerateEmbedUrlForAnonymousUser action in any IAM policy', () => {
      const statements = collectAllPolicyStatements();
      expect(statements.length).toBeGreaterThan(0);

      for (const statement of statements) {
        const actions = getActions(statement);
        for (const action of actions) {
          expect(action.toLowerCase()).not.toContain(
            'generateembedurlforanonymoususer'
          );
        }
      }
    });

    it('all Allow statements have Resource constraints (no Resource: "*")', () => {
      const statements = collectAllPolicyStatements();

      const allowStatements = statements.filter(s => s.Effect === 'Allow');
      expect(allowStatements.length).toBeGreaterThan(0);

      for (const statement of allowStatements) {
        const resource = statement.Resource;
        if (Array.isArray(resource)) {
          for (const r of resource) {
            expect(r).not.toBe('*');
          }
        } else {
          expect(resource).not.toBe('*');
        }
      }
    });
  });
});
