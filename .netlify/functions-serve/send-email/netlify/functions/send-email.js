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
    const origin = event.headers?.origin || event.headers?.referer || "";
    const hasKey = !!process.env.BREVO_API_KEY;
    const maskedKey = (process.env.BREVO_API_KEY || "").slice(0, 4) + "***";
    console.log("[send-email] request", {
      method: event.httpMethod,
      origin,
      hasKey,
      keyPreview: hasKey ? maskedKey : "missing"
    });
    const emailData = JSON.parse(event.body || "{}");
    console.log("[send-email] payload fields", {
      to: !!emailData.to,
      subject: !!emailData.subject,
      html: !!emailData.html,
      from: emailData.from,
      fromName: emailData.fromName
    });
    if (!emailData.to || !emailData.subject || !emailData.html) {
      return { statusCode: 400, headers: textHeaders, body: "Missing required fields" };
    }
    const brevoApiKey = process.env.BREVO_API_KEY;
    if (!brevoApiKey) {
      console.error("BREVO_API_KEY not found");
      return { statusCode: 500, headers: textHeaders, body: "Email service not configured" };
    }
    const senderEmail = emailData.from || process.env.BREVO_SENDER_EMAIL || "noreply@crepephahonyothin35.netlify.app";
    const senderName = emailData.fromName || process.env.BREVO_SENDER_NAME || "Crepe Phahon Yothin35";
    console.log("[send-email] sender config", { senderEmail, senderName });
    const emailPayload = {
      sender: {
        name: senderName,
        email: senderEmail
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
        email: senderEmail,
        name: senderName
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
      const errorText = await resp.text();
      console.error("Brevo API error:", resp.status, errorText);
      return { statusCode: resp.status, headers: jsonHeaders, body: JSON.stringify({ success: false, status: resp.status, error: errorText }) };
    }
    const result = await resp.json();
    console.log("[send-email] success", { messageId: result.messageId });
    return {
      statusCode: 200,
      headers: jsonHeaders,
      body: JSON.stringify({ success: true, messageId: result.messageId })
    };
  } catch (error) {
    console.error("Email service error:", error?.message || error);
    return { statusCode: 500, headers: jsonHeaders, body: JSON.stringify({ success: false, error: error?.message || String(error) }) };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
//# sourceMappingURL=send-email.js.map
