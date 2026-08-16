<!--
Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
-->

# Contributing to Generic QuickSuite Sample

Thank you for your interest in contributing to this project. This document provides guidelines and information for contributors.

## Prerequisites

Before contributing, ensure you have the following installed:

- **Node.js** 18.x or later
- **AWS CLI** v2
- **AWS SAM CLI** v1.90 or later
- **Git** 2.30 or later
- An **AWS account** with QuickSight Enterprise Edition enabled
- A configured AWS CLI profile with appropriate permissions

## Local Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/aws-samples/generic-quicksuite-sample.git
   cd generic-quicksuite-sample
   ```

2. Install dev/test dependencies (from the repo root):
   ```bash
   npm install
   ```

3. Build the SAM application:
   ```bash
   cd backend
   sam build
   ```

4. Run the widget locally:
   Open `widget/index.html` in a browser. The widget loads `config.json` relative to its own script URL.

5. Run tests:
   ```bash
   npm test
   ```

## Branch Naming Conventions

Use the following prefixes for branch names:

| Prefix | Purpose | Example |
|--------|---------|---------|
| `feat/` | New features | `feat/add-theme-support` |
| `fix/` | Bug fixes | `fix/session-cache-expiry` |
| `docs/` | Documentation updates | `docs/update-setup-guide` |
| `refactor/` | Code refactoring | `refactor/embed-manager` |
| `test/` | Test additions or fixes | `test/add-deeplink-tests` |

Keep branch names short, descriptive, and lowercase with hyphens.

## Pull Request Process

1. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```

2. **Make your changes** following the code style guidelines below.

3. **Add or update tests** for any new functionality.

4. **Ensure all tests pass** before submitting:
   ```bash
   npm test
   ```

5. **Verify SPDX headers** are present on all new source files.

6. **Submit a pull request** against `main` with:
   - A clear title describing the change
   - A description explaining what was changed and why
   - References to any related issues

7. **Address review feedback** promptly. PRs require at least one approval before merging.

## Code Style

### General

- Use 2-space indentation for JavaScript and YAML files
- Use single quotes for strings in JavaScript
- End files with a newline
- Remove trailing whitespace

### JavaScript

- Use ES6+ syntax (const/let, arrow functions, template literals)
- Use JSDoc comments for public functions
- Keep functions focused and under 50 lines where practical
- Handle errors explicitly — no silent catches

### SPDX Headers

All source files (JavaScript, YAML, Shell) must include the SPDX license header as the first non-shebang lines:

```javascript
// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
```

### Naming Conventions

- **Files**: lowercase with hyphens (`cors-helper.js`)
- **Functions**: camelCase (`validateDashboardId`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRY_COUNT`)
- **Classes**: PascalCase (`EmbedManager`)

### Security

- Never commit credentials, API keys, or secrets
- Use environment variables for configuration
- Validate all inputs before processing
- Follow least-privilege principles in IAM policies

## Reporting Issues

When reporting issues, include:

- Steps to reproduce the problem
- Expected vs actual behavior
- Browser/Node.js version
- AWS region and QuickSight edition

## License

By contributing, you agree that your contributions will be licensed under the Apache License 2.0.
