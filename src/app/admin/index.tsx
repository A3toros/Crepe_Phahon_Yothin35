import { useState, useEffect } from 'react';
import { Card } from '@src/components/ui/Card';
import { Button } from '@src/components/ui/Button';
import { AdminStats } from '@src/types';
import { AdminOrders } from './AdminOrders';
import { AdminPayments } from './AdminPayments';
import { AdminAnalytics } from './AdminAnalytics';
import { AdminSettings } from './AdminSettings';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'payments' | 'analytics' | 'settings'>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load admin stats
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API call
      setStats({
        totalOrders: 1247,
        totalRevenue: 45680,
        pendingOrders: 12,
        todayOrders: 23,
        todayRevenue: 1840,
        avgOrderValue: 36.7,
        topItems: [
          { name: 'Banana Chocolate', count: 45, revenue: 1620 },
          { name: 'Strawberry Honey', count: 38, revenue: 1368 },
          { name: 'Ham Ketchup', count: 32, revenue: 1152 }
        ]
      });
    } catch (error) {
      console.error('Failed to load admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'orders', label: 'Orders', icon: '📋' },
    { id: 'payments', label: 'Payments', icon: '💳' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ] as const;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Manage orders, payments, and system settings</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, Admin</span>
              <Button variant="secondary" size="sm">Logout</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && <AdminOverview stats={stats} />}
        {activeTab === 'orders' && <AdminOrders />}
        {activeTab === 'payments' && <AdminPayments />}
        {activeTab === 'analytics' && <AdminAnalytics />}
        {activeTab === 'settings' && <AdminSettings />}
      </div>
    </div>
  );
}

function AdminOverview({ stats }: { stats: AdminStats | null }) {
  if (!stats) return null;

  const statCards = [
    { title: 'Total Orders', value: stats.totalOrders.toLocaleString(), icon: '📋', color: 'blue' },
    { title: 'Total Revenue', value: `฿${stats.totalRevenue.toLocaleString()}`, icon: '💰', color: 'green' },
    { title: 'Pending Orders', value: stats.pendingOrders.toString(), icon: '⏳', color: 'yellow' },
    { title: 'Today\'s Orders', value: stats.todayOrders.toString(), icon: '📅', color: 'purple' },
    { title: 'Today\'s Revenue', value: `฿${stats.todayRevenue.toLocaleString()}`, icon: '💵', color: 'green' },
    { title: 'Avg Order Value', value: `฿${stats.avgOrderValue.toFixed(1)}`, icon: '📊', color: 'blue' }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
              <div className="text-3xl">{card.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Top Items */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Selling Items</h3>
        <div className="space-y-3">
          {stats.topItems.map((item, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
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

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button className="w-full">View All Orders</Button>
          <Button variant="secondary" className="w-full">Payment Reports</Button>
          <Button variant="secondary" className="w-full">System Settings</Button>
        </div>
      </Card>
    </div>
  );
}
