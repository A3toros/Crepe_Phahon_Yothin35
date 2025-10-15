#!/usr/bin/env node

// Bangkok Bank OAuth 2.0 Token Generation (Sandbox)
// Usage: node scripts/bangkokbank-oauth.mjs --key <CONSUMER_KEY> --secret <CONSUMER_SECRET>

const ARGS = new Map();
for (let i = 2; i < process.argv.length; i += 2) {
  const k = process.argv[i];
  const v = process.argv[i + 1];
  if (k && k.startsWith('--')) ARGS.set(k.replace(/^--/, ''), v ?? '');
}

const CONSUMER_KEY = ARGS.get('key') || process.env.BANGKOKBANK_CONSUMER_KEY || '5SG5Q4We2LeIOGtDX3XBINDjWwdNdJEG';
const CONSUMER_SECRET = ARGS.get('secret') || process.env.BANGKOKBANK_CONSUMER_SECRET || 'DJjA1USzLPT6OUAr';

if (!CONSUMER_KEY || !CONSUMER_SECRET) {
  console.error('Missing credentials. Provide --key and --secret or set environment variables.');
  process.exit(1);
}

// Encode credentials
const credentials = `${CONSUMER_KEY}:${CONSUMER_SECRET}`;
const encodedCredentials = Buffer.from(credentials).toString('base64');

console.log('Testing Bangkok Bank OAuth 2.0 API...');
console.log('Consumer Key:', CONSUMER_KEY);
console.log('Consumer Secret:', CONSUMER_SECRET);
console.log('Encoded Credentials:', encodedCredentials);

const url = 'https://api-sandbox.bangkokbank.com/oauth/accesstoken';

const headers = {
  'Authorization': `Basic ${encodedCredentials}`,
  'Content-Type': 'application/x-www-form-urlencoded'
};

const body = new URLSearchParams({
  grant_type: 'client_credentials',
  scope: 'CREATE READ'
});

console.log('Requesting token...');
console.log('URL:', url);
console.log('Headers:', Object.keys(headers).join(', '));

try {
  const res = await fetch(url, { method: 'POST', headers, body: body.toString() });
  const text = await res.text();
  console.log('Status:', res.status, res.statusText);
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
