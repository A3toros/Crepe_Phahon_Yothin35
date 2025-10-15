import { useState, useEffect } from 'react';
import { Card } from '@src/components/ui/Card';
import { Button } from '@src/components/ui/Button';

interface AnalyticsData {
  dailyRevenue: { date: string; revenue: number }[];
  hourlyOrders: { hour: number; orders: number }[];
  topItems: { name: string; count: number; revenue: number }[];
  paymentMethods: { method: string; count: number; revenue: number }[];
  customerStats: {
    totalCustomers: number;
    newCustomers: number;
    returningCustomers: number;
  };
}

export function AdminAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockData: AnalyticsData = {
        dailyRevenue: [
          { date: '2024-01-08', revenue: 1200 },
          { date: '2024-01-09', revenue: 1500 },
          { date: '2024-01-10', revenue: 1800 },
          { date: '2024-01-11', revenue: 1400 },
          { date: '2024-01-12', revenue: 1600 },
          { date: '2024-01-13', revenue: 2000 },
          { date: '2024-01-14', revenue: 1750 }
        ],
        hourlyOrders: [
          { hour: 8, orders: 2 },
          { hour: 9, orders: 5 },
          { hour: 10, orders: 8 },
          { hour: 11, orders: 12 },
          { hour: 12, orders: 15 },
          { hour: 13, orders: 10 },
          { hour: 14, orders: 7 },
          { hour: 15, orders: 4 },
          { hour: 16, orders: 3 },
          { hour: 17, orders: 6 },
          { hour: 18, orders: 9 },
          { hour: 19, orders: 11 }
        ],
        topItems: [
          { name: 'Banana Chocolate', count: 45, revenue: 1620 },
          { name: 'Strawberry Honey', count: 38, revenue: 1368 },
          { name: 'Ham Ketchup', count: 32, revenue: 1152 },
          { name: 'Pulled Pork Chili', count: 28, revenue: 1008 },
          { name: 'Crabstick Mayonnaise', count: 25, revenue: 900 }
        ],
        paymentMethods: [
          { method: 'K-Bank', count: 120, revenue: 4320 },
          { method: 'Bangkok Bank', count: 85, revenue: 3060 }
        ],
        customerStats: {
          totalCustomers: 245,
          newCustomers: 23,
          returningCustomers: 45
        }
      };
      setData(mockData);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const totalRevenue = data.dailyRevenue.reduce((sum, day) => sum + day.revenue, 0);
  const avgDailyRevenue = totalRevenue / data.dailyRevenue.length;
  const peakHour = data.hourlyOrders.reduce((max, hour) => hour.orders > max.orders ? hour : max, data.hourlyOrders[0]);

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Analytics Dashboard</h3>
          <div className="flex space-x-2">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setTimeRange(range)}
              >
                {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Key Metrics */}
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
              <p className="text-sm font-medium text-gray-600">Avg Daily Revenue</p>
              <p className="text-2xl font-bold text-blue-600">฿{avgDailyRevenue.toFixed(0)}</p>
            </div>
            <div className="text-3xl">📊</div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Peak Hour</p>
              <p className="text-2xl font-bold text-purple-600">{peakHour.hour}:00</p>
              <p className="text-sm text-gray-600">{peakHour.orders} orders</p>
            </div>
            <div className="text-3xl">⏰</div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-orange-600">{data.customerStats.totalCustomers}</p>
            </div>
            <div className="text-3xl">👥</div>
          </div>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Revenue</h3>
        <div className="h-64 flex items-end space-x-2">
          {data.dailyRevenue.map((day, index) => {
            const maxRevenue = Math.max(...data.dailyRevenue.map(d => d.revenue));
            const height = (day.revenue / maxRevenue) * 200;
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="bg-blue-500 w-full rounded-t"
                  style={{ height: `${height}px` }}
                ></div>
                <div className="text-xs text-gray-600 mt-2">
                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="text-xs font-medium text-gray-900">
                  ฿{day.revenue}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Hourly Orders Chart */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Orders by Hour</h3>
        <div className="h-64 flex items-end space-x-1">
          {data.hourlyOrders.map((hour, index) => {
            const maxOrders = Math.max(...data.hourlyOrders.map(h => h.orders));
            const height = (hour.orders / maxOrders) * 200;
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="bg-green-500 w-full rounded-t"
                  style={{ height: `${height}px` }}
                ></div>
                <div className="text-xs text-gray-600 mt-2">
                  {hour.hour}:00
                </div>
                <div className="text-xs font-medium text-gray-900">
                  {hour.orders}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Top Items and Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Items</h3>
          <div className="space-y-3">
            {data.topItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">{item.count} orders</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">฿{item.revenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
          <div className="space-y-3">
            {data.paymentMethods.map((method, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">{method.method}</p>
                  <p className="text-sm text-gray-600">{method.count} transactions</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">฿{method.revenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Customer Statistics */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{data.customerStats.totalCustomers}</div>
            <div className="text-sm text-gray-600">Total Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{data.customerStats.newCustomers}</div>
            <div className="text-sm text-gray-600">New This Period</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{data.customerStats.returningCustomers}</div>
            <div className="text-sm text-gray-600">Returning Customers</div>
          </div>
        </div>
      </Card>

      {/* Export Options */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Data</h3>
        <div className="flex space-x-4">
          <Button variant="secondary">Export CSV</Button>
          <Button variant="secondary">Export PDF Report</Button>
          <Button variant="secondary">Schedule Report</Button>
        </div>
      </Card>
    </div>
  );
}
