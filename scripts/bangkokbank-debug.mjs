#!/usr/bin/env node

// Debug script to see exactly what we're sending to Bangkok Bank API
const CONSUMER_KEY = '5SG5Q4We2LeIOGtDX3XBINDjWwdNdJEG';
const CONSUMER_SECRET = 'DJjA1USzLPT6OUAr';

console.log('=== Bangkok Bank OAuth Debug ===');
console.log('Consumer Key:', CONSUMER_KEY);
console.log('Consumer Secret:', CONSUMER_SECRET);

// Step 1: Create credentials string
const credentials = `${CONSUMER_KEY}:${CONSUMER_SECRET}`;
console.log('Credentials string:', credentials);

// Step 2: Base64 encode
const encodedCredentials = Buffer.from(credentials).toString('base64');
console.log('Base64 encoded:', encodedCredentials);

// Step 3: Verify decoding
const decoded = Buffer.from(encodedCredentials, 'base64').toString();
console.log('Decoded back:', decoded);
console.log('Match original:', decoded === credentials);

// Step 4: Create request body
const body = new URLSearchParams({
  grant_type: 'client_credentials',
  scope: 'CREATE READ'
});

console.log('\n=== Request Details ===');
console.log('URL: https://api-sandbox.bangkokbank.com/oauth/accesstoken');
console.log('Method: POST');
console.log('Headers:');
console.log('  Authorization: Basic', encodedCredentials);
console.log('  Content-Type: application/x-www-form-urlencoded');
console.log('Body:');
console.log('  grant_type=client_credentials');
console.log('  scope=CREATE READ');
console.log('Body (URLSearchParams):', body.toString());

// Step 5: Test the actual request
console.log('\n=== Making Request ===');
const url = 'https://api-sandbox.bangkokbank.com/oauth/accesstoken';
const headers = {
  'Authorization': `Basic ${encodedCredentials}`,
  'Content-Type': 'application/x-www-form-urlencoded'
};

console.log('Sending request...');
fetch(url, {
  method: 'POST',
  headers,
  body: body.toString()
})
.then(async response => {
  console.log('Status:', response.status, response.statusText);
  console.log('Response headers:', Object.fromEntries(response.headers));
  
  const text = await response.text();
  console.log('Response body:', text);
  
  if (response.status !== 200) {
    console.log('\n=== DEBUGGING INFO ===');
    console.log('If you get 401, check:');
    console.log('1. Are the credentials correct?');
    console.log('2. Is the Base64 encoding correct?');
    console.log('3. Is the scope format correct?');
    console.log('4. Are you using the right environment?');
  }
})
.catch(error => {
  console.error('Request failed:', error.message);
});
