import { useState, useEffect } from 'react';
import { Card } from '@src/components/ui/Card';
import { Button } from '@src/components/ui/Button';
import { AdminOrderFilter, OrderStatus } from '@src/types';

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: string[];
  total: number;
  status: OrderStatus;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
  qrCode?: string;
}

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<AdminOrderFilter>({});
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    loadOrders();
  }, [filter]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockOrders: Order[] = [
        {
          id: 'ORD-001',
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          items: ['Banana Chocolate', 'Strawberry Honey'],
          total: 54,
          status: 'paid',
          paymentStatus: 'paid',
          createdAt: '2024-01-15T10:30:00Z',
          qrCode: 'QR123456'
        },
        {
          id: 'ORD-002',
          customerName: 'Jane Smith',
          customerEmail: 'jane@example.com',
          items: ['Ham Ketchup', 'Pulled Pork Chili'],
          total: 47,
          status: 'pending',
          paymentStatus: 'pending',
          createdAt: '2024-01-15T11:15:00Z'
        },
        {
          id: 'ORD-003',
          customerName: 'Mike Johnson',
          customerEmail: 'mike@example.com',
          items: ['Crabstick Mayonnaise', 'Whipped Cream'],
          total: 40,
          status: 'qr_issued',
          paymentStatus: 'pending',
          createdAt: '2024-01-15T12:00:00Z',
          qrCode: 'QR789012'
        }
      ];
      setOrders(mockOrders);
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      // API call to update order status
      console.log(`Updating order ${orderId} to status ${status}`);
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'qr_issued': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filter.status || ''}
              onChange={(e) => setFilter({ ...filter, status: e.target.value || undefined })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="qr_issued">QR Issued</option>
              <option value="paid">Paid</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Payment</label>
            <select
              value={filter.paymentStatus || ''}
              onChange={(e) => setFilter({ ...filter, paymentStatus: e.target.value || undefined })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">All Payments</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Order ID, customer..."
              value={filter.search || ''}
              onChange={(e) => setFilter({ ...filter, search: e.target.value || undefined })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div className="flex items-end">
            <Button onClick={() => setFilter({})} variant="secondary" className="w-full">
              Clear Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Orders Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.id}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.customerEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {order.items.slice(0, 2).join(', ')}
                      {order.items.length > 2 && ` +${order.items.length - 2} more`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ฿{order.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setSelectedOrder(order)}
                      >
                        View
                      </Button>
                      {order.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, 'qr_issued')}
                        >
                          Issue QR
                        </Button>
                      )}
                      {order.status === 'qr_issued' && (
                        <Button
                          size="sm"
                          onClick={() => updateOrderStatus(order.id, 'paid')}
                        >
                          Mark Paid
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Order Details</h3>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedOrder(null)}
                >
                  ✕
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Order Information</h4>
                  <p className="text-sm text-gray-600">ID: {selectedOrder.id}</p>
                  <p className="text-sm text-gray-600">Created: {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Customer</h4>
                  <p className="text-sm text-gray-600">{selectedOrder.customerName}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.customerEmail}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Items</h4>
                  <ul className="text-sm text-gray-600">
                    {selectedOrder.items.map((item, index) => (
                      <li key={index}>• {item}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Total: ฿{selectedOrder.total}</h4>
                </div>
                
                {selectedOrder.qrCode && (
                  <div>
                    <h4 className="font-medium text-gray-900">QR Code</h4>
                    <p className="text-sm text-gray-600 font-mono">{selectedOrder.qrCode}</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
