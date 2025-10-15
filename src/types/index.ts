export type OrderStatus = 'pending' | 'qr_issued' | 'paid' | 'expired' | 'cancelled';

export interface OrderSummary {
  id: string;
  createdAt: string; // ISO
  totalBaht: number;
  status: OrderStatus;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  permissions: string[];
  createdAt: string;
  lastLoginAt?: string;
}

export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  todayOrders: number;
  todayRevenue: number;
  avgOrderValue: number;
  topItems: { name: string; count: number; revenue: number }[];
}

export interface AdminOrderFilter {
  status?: string;
  paymentStatus?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}


