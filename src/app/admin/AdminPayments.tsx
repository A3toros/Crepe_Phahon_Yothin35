import { useState, useEffect } from 'react';
import { Card } from '@src/components/ui/Card';
import { Button } from '@src/components/ui/Button';

interface Payment {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  method: 'kbank' | 'bangkokbank';
  qrCode?: string;
  transactionId?: string;
  createdAt: string;
  completedAt?: string;
  customerEmail: string;
}

export function AdminPayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    status: '',
    method: '',
    dateFrom: '',
    dateTo: ''
  });

  useEffect(() => {
    loadPayments();
  }, [filter]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockPayments: Payment[] = [
        {
          id: 'PAY-001',
          orderId: 'ORD-001',
          amount: 54,
          currency: 'THB',
          status: 'completed',
          method: 'kbank',
          qrCode: 'QR123456',
          transactionId: 'TXN789012',
          createdAt: '2024-01-15T10:30:00Z',
          completedAt: '2024-01-15T10:32:00Z',
          customerEmail: 'john@example.com'
        },
        {
          id: 'PAY-002',
          orderId: 'ORD-002',
          amount: 47,
          currency: 'THB',
          status: 'pending',
          method: 'bangkokbank',
          qrCode: 'QR345678',
          createdAt: '2024-01-15T11:15:00Z',
          customerEmail: 'jane@example.com'
        },
        {
          id: 'PAY-003',
          orderId: 'ORD-003',
          amount: 40,
          currency: 'THB',
          status: 'failed',
          method: 'kbank',
          qrCode: 'QR901234',
          createdAt: '2024-01-15T12:00:00Z',
          customerEmail: 'mike@example.com'
        }
      ];
      setPayments(mockPayments);
    } catch (error) {
      console.error('Failed to load payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'kbank': return 'bg-blue-100 text-blue-800';
      case 'bangkokbank': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingAmount = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  const failedAmount = payments
    .filter(p => p.status === 'failed')
    .reduce((sum, p) => sum + p.amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Payment Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-green-600">฿{totalRevenue.toLocaleString()}</p>
            </div>
            <div className="text-3xl">💰</div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Payments</p>
              <p className="text-2xl font-bold text-yellow-600">฿{pendingAmount.toLocaleString()}</p>
            </div>
            <div className="text-3xl">⏳</div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Failed Payments</p>
              <p className="text-2xl font-bold text-red-600">฿{failedAmount.toLocaleString()}</p>
            </div>
            <div className="text-3xl">❌</div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-blue-600">
                {payments.length > 0 
                  ? Math.round((payments.filter(p => p.status === 'completed').length / payments.length) * 100)
                  : 0}%
              </p>
            </div>
            <div className="text-3xl">📊</div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
            <select
              value={filter.method}
              onChange={(e) => setFilter({ ...filter, method: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="">All Methods</option>
              <option value="kbank">K-Bank</option>
              <option value="bangkokbank">Bangkok Bank</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
            <input
              type="date"
              value={filter.dateFrom}
              onChange={(e) => setFilter({ ...filter, dateFrom: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
            <input
              type="date"
              value={filter.dateTo}
              onChange={(e) => setFilter({ ...filter, dateTo: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>
        </div>
      </Card>

      {/* Payments Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {payment.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.orderId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.customerEmail}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ฿{payment.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMethodColor(payment.method)}`}>
                      {payment.method.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="secondary">
                        View
                      </Button>
                      {payment.status === 'completed' && (
                        <Button size="sm" variant="secondary">
                          Refund
                        </Button>
                      )}
                      {payment.status === 'failed' && (
                        <Button size="sm">
                          Retry
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

      {/* Payment Methods Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">K-Bank Payments</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Transactions:</span>
              <span className="text-sm font-medium">{payments.filter(p => p.method === 'kbank').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Amount:</span>
              <span className="text-sm font-medium">
                ฿{payments.filter(p => p.method === 'kbank').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Success Rate:</span>
              <span className="text-sm font-medium">
                {payments.filter(p => p.method === 'kbank').length > 0 
                  ? Math.round((payments.filter(p => p.method === 'kbank' && p.status === 'completed').length / payments.filter(p => p.method === 'kbank').length) * 100)
                  : 0}%
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bangkok Bank Payments</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Transactions:</span>
              <span className="text-sm font-medium">{payments.filter(p => p.method === 'bangkokbank').length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Total Amount:</span>
              <span className="text-sm font-medium">
                ฿{payments.filter(p => p.method === 'bangkokbank').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Success Rate:</span>
              <span className="text-sm font-medium">
                {payments.filter(p => p.method === 'bangkokbank').length > 0 
                  ? Math.round((payments.filter(p => p.method === 'bangkokbank' && p.status === 'completed').length / payments.filter(p => p.method === 'bangkokbank').length) * 100)
                  : 0}%
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
