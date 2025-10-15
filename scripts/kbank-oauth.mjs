#!/usr/bin/env node

// K-Bank OAuth 2.0 Client Credentials flow (Sandbox)
// Usage:
//   node scripts/kbank-oauth.mjs --id <CONSUMER_ID> --secret <CONSUMER_SECRET>
// Or set env vars:
//   KBANK_CONSUMER_ID, KBANK_CONSUMER_SECRET
// Optional flags:
//   --prod (use production base URL instead of sandbox)
//   --no-test-mode (omit x-test-mode/env-id headers)

const ARGS = new Map();
for (let i = 2; i < process.argv.length; i += 2) {
  const k = process.argv[i];
  const v = process.argv[i + 1];
  if (k && k.startsWith('--')) ARGS.set(k.replace(/^--/, ''), v ?? '');
}

const CONSUMER_ID = ARGS.get('id') || process.env.KBANK_CONSUMER_ID || '';
const CONSUMER_SECRET = ARGS.get('secret') || process.env.KBANK_CONSUMER_SECRET || '';
const USE_PROD = ARGS.has('prod');
const TEST_MODE = !ARGS.has('no-test-mode');

if (!CONSUMER_ID || !CONSUMER_SECRET) {
  console.error('Missing credentials. Provide --id and --secret or set KBANK_CONSUMER_ID/KBANK_CONSUMER_SECRET.');
  process.exit(1);
}

const baseUrl = USE_PROD ? 'https://openapi.kasikornbank.com' : 'https://openapi-sandbox.kasikornbank.com';
const tokenUrl = baseUrl + '/v2/oauth/token';

const basicAuth = Buffer.from(`${CONSUMER_ID}:${CONSUMER_SECRET}`).toString('base64');

const headers = {
  'Authorization': `Basic ${basicAuth}`,
  'Content-Type': 'application/x-www-form-urlencoded'
};
if (TEST_MODE) {
  headers['x-test-mode'] = 'true';
  headers['env-id'] = 'OAUTH2';
}

const body = new URLSearchParams({ grant_type: 'client_credentials' }).toString();

console.log('Requesting token...');
console.log('URL:', tokenUrl);
console.log('Headers:', Object.keys(headers).join(', '));

try {
  const res = await fetch(tokenUrl, { method: 'POST', headers, body });
  const text = await res.text();
  console.log('Status:', res.status, res.statusText);
  if (res.headers?.get) {
    console.log('RateLimit-Remaining:', res.headers.get('x-ratelimit-remaining') || 'n/a');
  }
  try {
    const json = JSON.parse(text);
    console.log(JSON.stringify(json, null, 2));
  } catch {
    console.log(text);
  }
} catch (err) {
  console.error('Request failed:', err?.message || err);
  process.exit(1);
}
