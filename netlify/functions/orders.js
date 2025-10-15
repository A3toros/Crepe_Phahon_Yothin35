// Netlify Function: Orders API
import { supabase, corsHeaders, handleCors } from './supabase-client.js';

export const handler = async (event, context) => {
  // Handle CORS preflight
  const corsResponse = handleCors(event);
  if (corsResponse) return corsResponse;

  try {
    const { httpMethod, body, queryStringParameters } = event;
    const params = queryStringParameters || {};

    switch (httpMethod) {
      case 'GET':
        return await getOrders(params);
      case 'POST':
        return await createOrder(JSON.parse(body || '{}'));
      case 'PUT':
        return await updateOrder(JSON.parse(body || '{}'));
      default:
        return {
          statusCode: 405,
          headers: corsHeaders,
          body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }
  } catch (error) {
    console.error('Orders API error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

// Get orders with filtering
async function getOrders(params) {
  const { userId, status, limit = 50, offset = 0 } = params;
  
  let query = supabase
    .from('orders')
    .select(`
      id,
      user_id,
      items,
      total,
      status,
      payment_status,
      qr_code,
      qr_expires_at,
      created_at,
      updated_at
    `)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  // Apply filters
  if (userId) {
    query = query.eq('user_id', userId);
  }
  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ orders: data }),
  };
}

// Create new order
async function createOrder(orderData) {
  const { userId, items, total, status = 'pending' } = orderData;

  if (!userId || !items || !total) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Missing required fields' }),
    };
  }

  const { data, error } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      items: items,
      total: total,
      status: status,
      payment_status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }

  return {
    statusCode: 201,
    headers: corsHeaders,
    body: JSON.stringify({ order: data }),
  };
}

// Update order status
async function updateOrder(updateData) {
  const { orderId, status, paymentStatus, qrCode, qrExpiresAt } = updateData;

  if (!orderId) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Order ID is required' }),
    };
  }

  const updateFields = {
    updated_at: new Date().toISOString(),
  };

  if (status) updateFields.status = status;
  if (paymentStatus) updateFields.payment_status = paymentStatus;
  if (qrCode) updateFields.qr_code = qrCode;
  if (qrExpiresAt) updateFields.qr_expires_at = qrExpiresAt;

  const { data, error } = await supabase
    .from('orders')
    .update(updateFields)
    .eq('id', orderId)
    .select()
    .single();

  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }

  return {
    statusCode: 200,
    headers: corsHeaders,
    body: JSON.stringify({ order: data }),
  };
}
