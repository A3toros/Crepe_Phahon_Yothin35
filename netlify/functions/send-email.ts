import type { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  const jsonHeaders: Record<string, string> = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };
  const textHeaders: Record<string, string> = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'text/plain',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: textHeaders,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: textHeaders, body: 'Method not allowed' };
  }

  try {
    const origin = event.headers?.origin || event.headers?.referer || '';
    const hasKey = !!process.env.BREVO_API_KEY;
    const maskedKey = (process.env.BREVO_API_KEY || '').slice(0, 4) + '***';
    console.log('[send-email] request', {
      method: event.httpMethod,
      origin,
      hasKey,
      keyPreview: hasKey ? maskedKey : 'missing'
    });

    const emailData = JSON.parse(event.body || '{}');
    console.log('[send-email] payload fields', {
      to: !!emailData.to,
      subject: !!emailData.subject,
      html: !!emailData.html,
      from: emailData.from,
      fromName: emailData.fromName
    });

    if (!emailData.to || !emailData.subject || !emailData.html) {
      return { statusCode: 400, headers: textHeaders, body: 'Missing required fields' };
    }

    const brevoApiKey = process.env.BREVO_API_KEY;
    if (!brevoApiKey) {
      console.error('BREVO_API_KEY not found');
      return { statusCode: 500, headers: textHeaders, body: 'Email service not configured' };
    }

    // Use proper domain for sender
    const senderEmail = emailData.from || process.env.BREVO_SENDER_EMAIL || 'noreply@crepephahonyothin35.netlify.app';
    const senderName = emailData.fromName || process.env.BREVO_SENDER_NAME || 'Crepe Phahon Yothin35';
    
    console.log('[send-email] sender config', { senderEmail, senderName });
    
    const emailPayload = {
      sender: {
        name: senderName,
        email: senderEmail,
      },
      to: [
        {
          email: emailData.to,
          name: emailData.to,
        },
      ],
      subject: emailData.subject,
      htmlContent: emailData.html,
      textContent: emailData.text || '',
      replyTo: {
        email: senderEmail,
        name: senderName,
      },
    };

    const resp = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': brevoApiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(emailPayload),
    });

    if (!resp.ok) {
      const errorText = await resp.text();
      console.error('Brevo API error:', resp.status, errorText);
      return { statusCode: resp.status, headers: jsonHeaders, body: JSON.stringify({ success: false, status: resp.status, error: errorText }) };
    }

    const result = await resp.json();
    console.log('[send-email] success', { messageId: result.messageId });

    return {
      statusCode: 200,
      headers: jsonHeaders,
      body: JSON.stringify({ success: true, messageId: result.messageId }),
    };
  } catch (error: any) {
    console.error('Email service error:', error?.message || error);
    return { statusCode: 500, headers: jsonHeaders, body: JSON.stringify({ success: false, error: error?.message || String(error) }) };
  }
};

// Note: Do not export default; Netlify looks for named `handler` export.