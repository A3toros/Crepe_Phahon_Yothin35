import type { Handler } from '@netlify/functions';

// Simple admin login mock with debug output. Replace with real auth as needed.
const allowedOrigins = [
  'http://localhost:8888',
  'http://localhost:3000',
  'http://127.0.0.1:8888',
  'https://crepephahonyothin35.netlify.app'
];

const corsHeaders = (origin: string | undefined) => {
  const allowOrigin = origin && allowedOrigins.includes(origin) ? origin : '*';
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json'
  } as Record<string, string>;
};

export const handler: Handler = async (event) => {
  const headers = corsHeaders(event.headers?.origin);

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  let body: { username?: string; password?: string } = {};
  try {
    body = event.body ? JSON.parse(event.body) : {};
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const { username, password } = body;

  // Debug output - echo limited info (never echo raw password in production)
  const debug = {
    receivedAt: new Date().toISOString(),
    method: event.httpMethod,
    path: event.path,
    hasBody: !!event.body,
    username
  };

  // Mock check
  const isValid = username === 'admin' && password === 'admin123';

  if (!isValid) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ ok: false, debug, error: 'Invalid credentials' })
    };
  }

  // Return a simple mock token for testing
  const mockToken = 'mock-admin-jwt.' + Math.random().toString(36).slice(2);
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ ok: true, debug, token: mockToken, role: 'admin' })
  };
};


