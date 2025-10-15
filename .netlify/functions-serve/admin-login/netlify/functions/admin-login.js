"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// netlify/functions/admin-login.ts
var admin_login_exports = {};
__export(admin_login_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(admin_login_exports);
var allowedOrigins = [
  "http://localhost:8888",
  "http://localhost:3000",
  "http://127.0.0.1:8888",
  "https://crepephahonyothin35.netlify.app"
];
var corsHeaders = (origin) => {
  const allowOrigin = origin && allowedOrigins.includes(origin) ? origin : "*";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json"
  };
};
var handler = async (event) => {
  const headers = corsHeaders(event.headers?.origin);
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method Not Allowed" }) };
  }
  let body = {};
  try {
    body = event.body ? JSON.parse(event.body) : {};
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid JSON" }) };
  }
  const { username, password } = body;
  const debug = {
    receivedAt: (/* @__PURE__ */ new Date()).toISOString(),
    method: event.httpMethod,
    path: event.path,
    hasBody: !!event.body,
    username
  };
  const isValid = username === "admin" && password === "admin123";
  if (!isValid) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ ok: false, debug, error: "Invalid credentials" })
    };
  }
  const mockToken = "mock-admin-jwt." + Math.random().toString(36).slice(2);
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ ok: true, debug, token: mockToken, role: "admin" })
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=admin-login.js.map
