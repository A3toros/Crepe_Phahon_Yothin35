// Order persistence utilities
// Handles localStorage and database synchronization for orders

import { supabase } from '@src/lib/supabase/client';

export interface OrderItem {
  id: string;
  toppings: string[];
  sauces: string[];
  whipped: boolean;
  total: number;
  createdAt: string;
}

export interface StoredOrder {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'draft' | 'qr_issued' | 'paid' | 'expired' | 'cancelled';
  qrCode?: string;
  notes?: string;
  createdAt: string;
}

// localStorage keys
const DRAFT_ORDER_KEY = 'crepe_shop_draft_order';
const PENDING_ORDERS_KEY = 'crepe_shop_pending_orders';

// Save draft order to localStorage
export function saveDraftOrder(order: StoredOrder): void {
  try {
    localStorage.setItem(DRAFT_ORDER_KEY, JSON.stringify(order));
  } catch (error) {
    console.error('Failed to save draft order to localStorage:', error);
  }
}

// Load draft order from localStorage
export function loadDraftOrder(): StoredOrder | null {
  try {
    const stored = localStorage.getItem(DRAFT_ORDER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Failed to load draft order from localStorage:', error);
    return null;
  }
}

// Clear draft order from localStorage
export function clearDraftOrder(): void {
  try {
    localStorage.removeItem(DRAFT_ORDER_KEY);
  } catch (error) {
    console.error('Failed to clear draft order from localStorage:', error);
  }
}

// Save pending order to localStorage
export function savePendingOrder(order: StoredOrder): void {
  try {
    const pendingOrders = getPendingOrders();
    const updatedOrders = pendingOrders.filter(o => o.id !== order.id);
    updatedOrders.push(order);
    localStorage.setItem(PENDING_ORDERS_KEY, JSON.stringify(updatedOrders));
  } catch (error) {
    console.error('Failed to save pending order to localStorage:', error);
  }
}

// Get all pending orders from localStorage
export function getPendingOrders(): StoredOrder[] {
  try {
    const stored = localStorage.getItem(PENDING_ORDERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load pending orders from localStorage:', error);
    return [];
  }
}

// Remove pending order from localStorage
export function removePendingOrder(orderId: string): void {
  try {
    const pendingOrders = getPendingOrders();
    const updatedOrders = pendingOrders.filter(o => o.id !== orderId);
    localStorage.setItem(PENDING_ORDERS_KEY, JSON.stringify(updatedOrders));
  } catch (error) {
    console.error('Failed to remove pending order from localStorage:', error);
  }
}

// Clean up expired orders from localStorage
export function cleanupExpiredOrders(): void {
  try {
    const now = new Date();
    const pendingOrders = getPendingOrders();
    // Remove orders older than 1 hour (since QR codes expire in 15 minutes)
    const validOrders = pendingOrders.filter(order => {
      const orderTime = new Date(order.createdAt);
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
      return orderTime > oneHourAgo;
    });
    
    if (validOrders.length !== pendingOrders.length) {
      localStorage.setItem(PENDING_ORDERS_KEY, JSON.stringify(validOrders));
    }
  } catch (error) {
    console.error('Failed to cleanup expired orders:', error);
  }
}

// Create order in database
export async function createOrderInDatabase(order: StoredOrder): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    // Create order in database
    const { data, error } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        items: order.items,
        total_amount: order.totalAmount,
        status: order.status,
        qr_code: order.qrCode,
        notes: order.notes || `Order created from localStorage - ${order.items.length} items`
      })
      .select('id')
      .single();

    if (error) {
      console.error('Database error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, orderId: data.id };
  } catch (error) {
    console.error('Failed to create order in database:', error);
    return { success: false, error: 'Failed to create order' };
  }
}

// Update order status in database
export async function updateOrderStatus(orderId: string, status: string, qrCode?: string): Promise<{ success: boolean; error?: string }> {
  try {
    const updateData: any = { status };
    
    if (qrCode) updateData.qr_code = qrCode;

    const { error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId);

    if (error) {
      console.error('Database error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to update order status:', error);
    return { success: false, error: 'Failed to update order' };
  }
}

// Sync pending orders to database
export async function syncPendingOrdersToDatabase(): Promise<{ synced: number; errors: string[] }> {
  const pendingOrders = getPendingOrders();
  const errors: string[] = [];
  let synced = 0;

  for (const order of pendingOrders) {
    try {
      const result = await createOrderInDatabase(order);
      if (result.success) {
        // Remove from localStorage after successful sync
        removePendingOrder(order.id);
        synced++;
      } else {
        errors.push(`Order ${order.id}: ${result.error}`);
      }
    } catch (error) {
      errors.push(`Order ${order.id}: ${error}`);
    }
  }

  return { synced, errors };
}

// Check for abandoned orders and clean them up
export function checkAbandonedOrders(): StoredOrder[] {
  const now = new Date();
  const pendingOrders = getPendingOrders();
  
  return pendingOrders.filter(order => {
    if (order.status !== 'qr_issued') return false;
    
    // Consider orders abandoned if they're older than 15 minutes
    const orderTime = new Date(order.createdAt);
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);
    return orderTime <= fifteenMinutesAgo;
  });
}

// Mark order as expired
export function markOrderAsExpired(orderId: string): void {
  const pendingOrders = getPendingOrders();
  const updatedOrders = pendingOrders.map(order => {
    if (order.id === orderId) {
      return { ...order, status: 'expired' as const };
    }
    return order;
  });
  
  localStorage.setItem(PENDING_ORDERS_KEY, JSON.stringify(updatedOrders));
}

// Get order statistics
export function getOrderStats(): {
  draftOrders: number;
  pendingOrders: number;
  expiredOrders: number;
  totalValue: number;
} {
  const draftOrder = loadDraftOrder();
  const pendingOrders = getPendingOrders();
  
  const draftOrders = draftOrder ? 1 : 0;
  const expiredOrders = pendingOrders.filter(o => o.status === 'expired').length;
  const activePending = pendingOrders.filter(o => o.status === 'qr_issued').length;
  
  const totalValue = pendingOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  
  return {
    draftOrders,
    pendingOrders: activePending,
    expiredOrders,
    totalValue
  };
}

// Initialize order persistence (call on app start)
export function initializeOrderPersistence(): void {
  // Clean up expired orders
  cleanupExpiredOrders();
  
  // Check for abandoned orders
  const abandonedOrders = checkAbandonedOrders();
  if (abandonedOrders.length > 0) {
    console.log(`Found ${abandonedOrders.length} abandoned orders`);
    // You could show a notification to the user here
  }
}
