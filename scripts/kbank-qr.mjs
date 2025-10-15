#!/usr/bin/env node

// K-Bank Thai QR Payment Request (Sandbox) — Exercise 2
// Usage:
//   node scripts/kbank-qr.mjs --token <ACCESS_TOKEN> --amount 100.50 --ref INV001
// Optional overrides:
//   --partnerId <ID> --partnerSecret <SECRET> --merchantId <ID> --qrType 3
//   --r1 <ref1> --r2 <ref2> --r3 <ref3> --r4 <ref4>
//   --partnerTxnUid <UID>

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

const amountArg = ARGS.get('amount') || '100.00';
// Keep as string with exactly 2 decimal places for sandbox
const amount = parseFloat(String(amountArg)).toFixed(2);
if (!amount || amount === '0.00') {
  console.error('Invalid --amount, must be a positive number');
  process.exit(1);
}

const ref = ARGS.get('ref') || 'INV001';

// Defaults per exercise
const partnerId = ARGS.get('partnerId') || 'PTR1051673';
const partnerSecret = ARGS.get('partnerSecret') || 'd4bded59200547bc85903574a293831b';
const merchantId = ARGS.get('merchantId') || 'KB102057149704';
const qrType = Number(ARGS.get('qrType') || 3);

// Use exact ISO 8601 format as shown in the example
const nowIso = new Date().toISOString();
const partnerTxnUid = ARGS.get('partnerTxnUid') || `PARTNERTEST-${Date.now()}`; // unique per request or exercise value

const payload = {
  partnerTxnUid,
  partnerId,
  partnerSecret,
  requestDt: nowIso,
  merchantId,
  qrType,
  amount, // send numeric
  currencyCode: 'THB',
  reference1: ARGS.get('r1') || ref,
  reference2: ARGS.get('r2') || 'HELLOWORLD',
  reference3: ARGS.get('r3') || ref,
  reference4: ARGS.get('r4') || ref
};

const url = 'https://openapi-sandbox.kasikornbank.com/v1/qrpayment/request';

// Allow overriding env-id for different exercises (e.g., QR002, QR003)
const envId = ARGS.get('envId') || 'QR002';

const headers = {
  'Authorization': `Bearer ${ACCESS_TOKEN}`,
  'Content-Type': 'application/json',
  'x-test-mode': 'true',
  'env-id': envId
};

console.log('Requesting Thai QR...');
console.log('URL:', url);
console.log('Body:', JSON.stringify(payload));

try {
  const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(payload) });
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
