// Netlify Function: Admin Analytics API
import { supabase, corsHeaders, handleCors } from './supabase-client.js';

export const handler = async (event, context) => {
  // Handle CORS preflight
  const corsResponse = handleCors(event);
  if (corsResponse) return corsResponse;

  try {
    const { httpMethod, queryStringParameters } = event;
    const params = queryStringParameters || {};

    if (httpMethod !== 'GET') {
      return {
        statusCode: 405,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Method not allowed' }),
      };
    }

    const { period = '30d' } = params;
    const analytics = await getAnalytics(period);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(analytics),
    };
  } catch (error) {
    console.error('Analytics API error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};

// Get analytics data
async function getAnalytics(period) {
  const now = new Date();
  let startDate;

  switch (period) {
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  // Get total orders and revenue
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('total, status, payment_status, created_at')
    .gte('created_at', startDate.toISOString());

  if (ordersError) {
    throw new Error(`Database error: ${ordersError.message}`);
  }

  // Calculate metrics
  const totalOrders = orders.length;
  const totalRevenue = orders
    .filter(order => order.payment_status === 'paid')
    .reduce((sum, order) => sum + order.total, 0);
  
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const todayOrders = orders.filter(order => {
    const orderDate = new Date(order.created_at);
    const today = new Date();
    return orderDate.toDateString() === today.toDateString();
  }).length;

  const todayRevenue = orders
    .filter(order => {
      const orderDate = new Date(order.created_at);
      const today = new Date();
      return orderDate.toDateString() === today.toDateString() && order.payment_status === 'paid';
    })
    .reduce((sum, order) => sum + order.total, 0);

  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Get top items (mock data for now)
  const topItems = [
    { name: 'Banana Chocolate', count: 45, revenue: 1620 },
    { name: 'Strawberry Honey', count: 38, revenue: 1368 },
    { name: 'Ham Ketchup', count: 32, revenue: 1152 },
  ];

  // Get daily revenue for chart
  const dailyRevenue = await getDailyRevenue(startDate, now);

  // Get hourly orders for chart
  const hourlyOrders = await getHourlyOrders(startDate, now);

  return {
    totalOrders,
    totalRevenue,
    pendingOrders,
    todayOrders,
    todayRevenue,
    avgOrderValue,
    topItems,
    dailyRevenue,
    hourlyOrders,
    period,
  };
}

// Get daily revenue data
async function getDailyRevenue(startDate, endDate) {
  const { data, error } = await supabase
    .from('orders')
    .select('total, created_at')
    .eq('payment_status', 'paid')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString())
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }

  // Group by date
  const revenueByDate = {};
  data.forEach(order => {
    const date = new Date(order.created_at).toISOString().split('T')[0];
    revenueByDate[date] = (revenueByDate[date] || 0) + order.total;
  });

  // Fill in missing dates with 0
  const result = [];
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    result.push({
      date: dateStr,
      revenue: revenueByDate[dateStr] || 0,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
}

// Get hourly orders data
async function getHourlyOrders(startDate, endDate) {
  const { data, error } = await supabase
    .from('orders')
    .select('created_at')
    .gte('created_at', startDate.toISOString())
    .lte('created_at', endDate.toISOString());

  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }

  // Group by hour
  const ordersByHour = {};
  data.forEach(order => {
    const hour = new Date(order.created_at).getHours();
    ordersByHour[hour] = (ordersByHour[hour] || 0) + 1;
  });

  // Fill in all hours (8-19)
  const result = [];
  for (let hour = 8; hour <= 19; hour++) {
    result.push({
      hour,
      orders: ordersByHour[hour] || 0,
    });
  }

  return result;
}
