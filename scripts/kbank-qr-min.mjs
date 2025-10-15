#!/usr/bin/env node

// K-Bank Thai QR Exercise 2 (Minimal payload)
// Usage:
//   node scripts/kbank-qr-min.mjs --token <ACCESS_TOKEN>
// Optional overrides:
//   --partnerId PTR1051673 --partnerSecret d4bded59200547bc85903574a293831b --merchantId KB102057149704

const ARGS = new Map();
for (let i = 2; i < process.argv.length; i += 2) {
  const k = process.argv[i];
  const v = process.argv[i + 1];
  if (k && k.startsWith('--')) ARGS.set(k.replace(/^--/, ''), v ?? '');
}

const ACCESS_TOKEN = ARGS.get('token') || process.env.KBANK_ACCESS_TOKEN || '';
if (!ACCESS_TOKEN) {
  console.error('Missing access token. Provide --token or set KBANK_ACCESS_TOKEN.');
  process.exit(1);
}

const partnerId = ARGS.get('partnerId') || 'PTR1051673';
const partnerSecret = ARGS.get('partnerSecret') || 'd4bded59200547bc85903574a293831b';
const merchantId = ARGS.get('merchantId') || 'KB102057149704';

const url = 'https://openapi-sandbox.kasikornbank.com/v1/qrpayment/request';

const headers = {
  'Authorization': `Bearer ${ACCESS_TOKEN}`,
  'Content-Type': 'application/json',
  'x-test-mode': 'true',
  'env-id': 'QR002'
};

const body = {
  partnerId,
  partnerSecret,
  merchantId
};

console.log('Requesting Thai QR (minimal)...');
console.log('URL:', url);
console.log('Body:', JSON.stringify(body));

try {
  const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
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
