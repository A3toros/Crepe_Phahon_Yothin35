// Netlify Functions API client
const NETLIFY_FUNCTIONS_BASE = '/.netlify/functions';

export interface Order {
  id: string;
  user_id: string;
  items: any[];
  total: number;
  status: string;
  payment_status: string;
  qr_code?: string;
  qr_expires_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderRequest {
  userId: string;
  items: any[];
  total: number;
  status?: string;
}

export interface UpdateOrderRequest {
  orderId: string;
  status?: string;
  paymentStatus?: string;
  qrCode?: string;
  qrExpiresAt?: string;
}

export interface CreateQRRequest {
  amount: number;
  currency?: string;
  reference?: string;
  qrType?: number;
  orderId?: string;
}

export interface AnalyticsData {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  todayOrders: number;
  todayRevenue: number;
  avgOrderValue: number;
  topItems: Array<{ name: string; count: number; revenue: number }>;
  dailyRevenue: Array<{ date: string; revenue: number }>;
  hourlyOrders: Array<{ hour: number; orders: number }>;
  period: string;
}

// Orders API
export async function getOrders(params: {
  userId?: string;
  status?: string;
  limit?: number;
  offset?: number;
} = {}): Promise<{ orders: Order[] }> {
  const queryParams = new URLSearchParams();
  if (params.userId) queryParams.set('userId', params.userId);
  if (params.status) queryParams.set('status', params.status);
  if (params.limit) queryParams.set('limit', params.limit.toString());
  if (params.offset) queryParams.set('offset', params.offset.toString());

  const response = await fetch(`${NETLIFY_FUNCTIONS_BASE}/orders?${queryParams}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch orders');
  }

  return response.json();
}

export async function createOrder(orderData: CreateOrderRequest): Promise<{ order: Order }> {
  const response = await fetch(`${NETLIFY_FUNCTIONS_BASE}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create order');
  }

  return response.json();
}

export async function updateOrder(updateData: UpdateOrderRequest): Promise<{ order: Order }> {
  const response = await fetch(`${NETLIFY_FUNCTIONS_BASE}/orders`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update order');
  }

  return response.json();
}

// QR Code API
export async function createQR(request: CreateQRRequest): Promise<{
  success: boolean;
  qrCode?: string;
  expiresAt?: string;
  error?: string;
}> {
  const response = await fetch(`${NETLIFY_FUNCTIONS_BASE}/qr-create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    let errorMessage = 'Failed to create QR code';
    try {
      const error = await response.json();
      errorMessage = error.error || errorMessage;
    } catch (e) {
      // If response is not JSON, use status text
      errorMessage = response.statusText || errorMessage;
    }
    return {
      success: false,
      error: errorMessage,
    };
  }

  return response.json();
}

// Analytics API
export async function getAnalytics(period: '7d' | '30d' | '90d' = '30d'): Promise<AnalyticsData> {
  const response = await fetch(`${NETLIFY_FUNCTIONS_BASE}/admin-analytics?period=${period}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch analytics');
  }

  return response.json();
}

// Payment webhook (for testing)
export async function testPaymentWebhook(paymentData: any): Promise<{ success: boolean }> {
  const response = await fetch(`${NETLIFY_FUNCTIONS_BASE}/payment-webhook`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paymentData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Webhook test failed');
  }

  return response.json();
}
