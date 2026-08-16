// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

/**
 * Bundle build script for the Generic QuickSuite Widget.
 *
 * Produces a single, self-contained file — `quicksuite-widget-bundled.js` —
 * that inlines the Amazon QuickSight Embedding SDK ahead of the widget
 * source. Host pages can then integrate with a single <script> tag and a
 * container <div>, with no separate SDK <script> and no build tooling on
 * their side.
 *
 * Usage:
 *   node build-bundled.js
 *
 * The QuickSight Embedding SDK is resolved in this order:
 *   1. A local file `quicksight-embedding-sdk.min.js` in this directory
 *      (offline / air-gapped builds — download it once and commit it).
 *   2. Otherwise, downloaded from the public CDN over HTTPS.
 *
 * SPDX headers are preserved: the bundle begins with this project's header,
 * and the vendored SDK retains its own license banner.
 */

'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');

const WIDGET_DIR = __dirname;
const WIDGET_SRC = path.join(WIDGET_DIR, 'quicksuite-widget.js');
const LOCAL_SDK = path.join(WIDGET_DIR, 'quicksight-embedding-sdk.min.js');
const OUTPUT = path.join(WIDGET_DIR, 'quicksuite-widget-bundled.js');

const SDK_VERSION = '2.11.3';
const SDK_CDN_URL =
  `https://unpkg.com/amazon-quicksight-embedding-sdk@${SDK_VERSION}/dist/quicksight-embedding-js-sdk.min.js`;

const BUNDLE_HEADER =
  '// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.\n' +
  '// SPDX-License-Identifier: Apache-2.0\n' +
  '//\n' +
  '// Generated bundle — DO NOT EDIT BY HAND.\n' +
  '// Produced by build-bundled.js. Edit quicksuite-widget.js and rebuild.\n' +
  `// Inlined Amazon QuickSight Embedding SDK v${SDK_VERSION}.\n` +
  '//\n\n';

/**
 * Fetch a URL over HTTPS, following simple redirects, resolving to the body.
 * @param {string} url
 * @returns {Promise<string>}
 */
function httpsGet(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          // Follow a single redirect hop (unpkg redirects to a versioned URL).
          res.resume();
          resolve(httpsGet(res.headers.location));
          return;
        }
        if (res.statusCode !== 200) {
          res.resume();
          reject(new Error(`Failed to download SDK: HTTP ${res.statusCode} from ${url}`));
          return;
        }
        let body = '';
        res.setEncoding('utf8');
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => resolve(body));
      })
      .on('error', reject);
  });
}

/**
 * Resolve the QuickSight Embedding SDK source: local file if present,
 * otherwise download from the CDN.
 * @returns {Promise<string>}
 */
async function resolveSdkSource() {
  if (fs.existsSync(LOCAL_SDK)) {
    console.log(`[build] Using local SDK: ${path.basename(LOCAL_SDK)}`);
    return fs.readFileSync(LOCAL_SDK, 'utf8');
  }
  console.log(`[build] Local SDK not found; downloading v${SDK_VERSION} from CDN…`);
  const sdk = await httpsGet(SDK_CDN_URL);
  // Cache it locally so subsequent builds are offline-capable.
  try {
    fs.writeFileSync(LOCAL_SDK, sdk, 'utf8');
    console.log(`[build] Cached SDK to ${path.basename(LOCAL_SDK)} for future offline builds.`);
  } catch (err) {
    console.warn(`[build] Could not cache SDK locally: ${err.message}`);
  }
  return sdk;
}

async function main() {
  if (!fs.existsSync(WIDGET_SRC)) {
    throw new Error(`Widget source not found: ${WIDGET_SRC}`);
  }

  const widgetSource = fs.readFileSync(WIDGET_SRC, 'utf8');
  const sdkSource = await resolveSdkSource();

  const bundle =
    BUNDLE_HEADER +
    '/* ===== BEGIN vendored Amazon QuickSight Embedding SDK ===== */\n' +
    sdkSource +
    '\n/* ===== END vendored Amazon QuickSight Embedding SDK ===== */\n\n' +
    '/* ===== BEGIN QuickSuite Widget ===== */\n' +
    widgetSource +
    '\n/* ===== END QuickSuite Widget ===== */\n';

  fs.writeFileSync(OUTPUT, bundle, 'utf8');

  const sizeKb = (Buffer.byteLength(bundle, 'utf8') / 1024).toFixed(1);
  console.log(`[build] Wrote ${path.basename(OUTPUT)} (${sizeKb} KB).`);
}

main().catch((err) => {
  console.error(`[build] ERROR: ${err.message}`);
  process.exit(1);
});
