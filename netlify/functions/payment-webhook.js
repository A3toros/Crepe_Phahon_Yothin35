// Netlify Function: Payment Webhook Handler
import { supabase, corsHeaders, handleCors } from './supabase-client.js';
import crypto from 'crypto';

export const handler = async (event, context) => {
  // Handle CORS preflight
  const corsResponse = handleCors(event);
  if (corsResponse) return corsResponse;

  try {
    const { body, headers } = event;
    const webhookSecret = process.env.PSP_WEBHOOK_SECRET;

    // Verify webhook signature
    if (!verifyWebhookSignature(body, headers, webhookSecret)) {
      return {
        statusCode: 401,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid signature' }),
      };
    }

    const paymentData = JSON.parse(body);
    console.log('Payment webhook received:', paymentData);

    // Process payment notification
    await processPaymentNotification(paymentData);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    console.error('Webhook processing error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

// Verify webhook signature
function verifyWebhookSignature(body, headers, secret) {
  if (!secret) {
    console.warn('No webhook secret configured');
    return true; // Allow in development
  }

  const signature = headers['x-webhook-signature'] || headers['x-signature'];
  if (!signature) {
    return false;
  }

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

// Process payment notification
async function processPaymentNotification(paymentData) {
  const { 
    orderId, 
    transactionId, 
    status, 
    amount, 
    currency,
    paymentMethod,
    paidAt 
  } = paymentData;

  if (!orderId) {
    throw new Error('Order ID is required');
  }

  // Update order status in Supabase
  const updateFields = {
    updated_at: new Date().toISOString(),
  };

  if (status === 'paid' || status === 'completed') {
    updateFields.status = 'paid';
    updateFields.payment_status = 'paid';
  } else if (status === 'failed' || status === 'cancelled') {
    updateFields.status = 'cancelled';
    updateFields.payment_status = 'failed';
  }

  if (transactionId) {
    updateFields.transaction_id = transactionId;
  }
  if (paidAt) {
    updateFields.paid_at = paidAt;
  }

  const { error } = await supabase
    .from('orders')
    .update(updateFields)
    .eq('id', orderId);

  if (error) {
    throw new Error(`Database update failed: ${error.message}`);
  }

  // Log payment event
  await supabase
    .from('payment_events')
    .insert({
      order_id: orderId,
      transaction_id: transactionId,
      status: status,
      amount: amount,
      currency: currency,
      payment_method: paymentMethod,
      event_data: paymentData,
      created_at: new Date().toISOString(),
    });

  console.log(`Payment processed for order ${orderId}: ${status}`);
}
