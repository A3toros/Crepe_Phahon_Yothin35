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

// netlify/functions/send-email.ts
var send_email_exports = {};
__export(send_email_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(send_email_exports);
var handler = async (event) => {
  const jsonHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json"
  };
  const textHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "text/plain"
  };
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: textHeaders,
      body: ""
    };
  }
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers: textHeaders, body: "Method not allowed" };
  }
  try {
    const emailData = JSON.parse(event.body || "{}");
    if (!emailData.to || !emailData.subject || !emailData.html) {
      return { statusCode: 400, headers: textHeaders, body: "Missing required fields" };
    }
    const brevoApiKey = process.env.BREVO_API_KEY;
    if (!brevoApiKey) {
      console.error("BREVO_API_KEY not found");
      return { statusCode: 500, headers: textHeaders, body: "Email service not configured" };
    }
    const emailPayload = {
      sender: {
        name: emailData.fromName || "Crepe Phahon Yothin35",
        email: emailData.from || process.env.EMAIL_FROM || "noreply@crepephahonyothin35.netlify.app"
      },
      to: [
        {
          email: emailData.to,
          name: emailData.to
        }
      ],
      subject: emailData.subject,
      htmlContent: emailData.html,
      textContent: emailData.text || "",
      replyTo: {
        email: emailData.from || process.env.EMAIL_FROM || "noreply@crepephahonyothin35.netlify.app",
        name: emailData.fromName || "Crepe Phahon Yothin35"
      }
    };
    const resp = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": brevoApiKey,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(emailPayload)
    });
    if (!resp.ok) {
      const error = await resp.text();
      console.error("Brevo API error:", error);
      return { statusCode: 500, headers: jsonHeaders, body: JSON.stringify({ success: false, error }) };
    }
    const result = await resp.json();
    return {
      statusCode: 200,
      headers: jsonHeaders,
      body: JSON.stringify({ success: true, messageId: result.messageId })
    };
  } catch (error) {
    console.error("Email service error:", error?.message || error);
    return { statusCode: 500, headers: textHeaders, body: "Internal server error" };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=send-email.js.map
