// Netlify Function: QR Code Creation
import { supabase, corsHeaders, handleCors } from './supabase-client.js';

export const handler = async (event, context) => {
  // Handle CORS preflight
  const corsResponse = handleCors(event);
  if (corsResponse) return corsResponse;

  try {
    const { body } = event;
    const { amount, currency = 'THB', reference, qrType = 3, orderId } = JSON.parse(body || '{}');

    if (!amount) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Amount is required' }),
      };
    }

    // For development, create a simple QR code
    // In production, you would use K-Bank API
    const qrResponse = await createSimpleQR({
      amount,
      currency,
      reference: reference || `INV${Date.now()}`,
      qrType
    });

    if (!qrResponse.success) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: qrResponse.error }),
      };
    }

    // Update order with QR code if orderId provided
    if (orderId) {
      await supabase
        .from('orders')
        .update({
          qr_code: qrResponse.qrCode,
          qr_expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes
          updated_at: new Date().toISOString(),
        })
        .eq('id', orderId);
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        qrCode: qrResponse.qrCode,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      }),
    };
  } catch (error) {
    console.error('QR creation error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

// Simple QR Code Creation for Development
async function createSimpleQR({ amount, currency, reference, qrType }) {
  try {
    // Create a simple QR code text for development
    const qrText = `PROMPTPAY|ORDER:${reference}|AMOUNT:${amount}|CURRENCY:${currency}`;
    
    return {
      success: true,
      qrCode: qrText,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// K-Bank QR Code Creation (for production)
async function createKBankQR({ amount, currency, reference, qrType }) {
  try {
    // Get access token
    const tokenResponse = await fetch('https://openapi-sandbox.kasikornbank.com/v2/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.KBANK_CONSUMER_ID}:${process.env.KBANK_CONSUMER_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'x-test-mode': 'true',
        'env-id': 'OAUTH2'
      },
      body: 'grant_type=client_credentials'
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to get K-Bank access token');
    }

    const { access_token } = await tokenResponse.json();

    // Create QR code
    const qrResponse = await fetch('https://openapi-sandbox.kasikornbank.com/v1/qrpayment/request', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json',
        'x-test-mode': 'true',
        'env-id': 'QR002'
      },
      body: JSON.stringify({
        partnerTxnUid: `PARTNERTEST${Date.now()}`,
        partnerId: process.env.KBANK_PARTNER_ID,
        partnerSecret: process.env.KBANK_PARTNER_SECRET,
        requestDt: new Date().toISOString(),
        merchantId: process.env.KBANK_MERCHANT_ID,
        qrType: qrType,
        amount: amount.toString(),
        currencyCode: currency,
        reference1: reference,
        reference2: 'HELLOWORLD',
        reference3: reference,
        reference4: reference
      })
    });

    if (!qrResponse.ok) {
      const errorData = await qrResponse.json();
      throw new Error(`K-Bank QR creation failed: ${errorData.errorDesc || 'Unknown error'}`);
    }

    const qrData = await qrResponse.json();
    
    return {
      success: true,
      qrCode: qrData.qrCode || qrData.qrRawData,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}
