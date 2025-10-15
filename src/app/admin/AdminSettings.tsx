import { useState, useEffect } from 'react';
import { Card } from '@src/components/ui/Card';
import { Button } from '@src/components/ui/Button';

interface SystemSettings {
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  businessEmail: string;
  operatingHours: {
    open: string;
    close: string;
    days: string[];
  };
  pricing: {
    basePrice: number;
    singleToppingPrice: number;
    bundle3Price: number;
    whippedCreamPrice: number;
  };
  paymentSettings: {
    kbankEnabled: boolean;
    bangkokbankEnabled: boolean;
    qrExpiryMinutes: number;
  };
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    webhookUrl: string;
  };
}

export function AdminSettings() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'pricing' | 'payments' | 'notifications'>('general');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockSettings: SystemSettings = {
        businessName: 'Crepe Phahon Yothin35',
        businessAddress: '123 Yothin Road, Bangkok, Thailand',
        businessPhone: '+66 2 123 4567',
        businessEmail: 'info@crepephahon.com',
        operatingHours: {
          open: '08:00',
          close: '20:00',
          days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        pricing: {
          basePrice: 20,
          singleToppingPrice: 7,
          bundle3Price: 20,
          whippedCreamPrice: 20
        },
        paymentSettings: {
          kbankEnabled: true,
          bangkokbankEnabled: true,
          qrExpiryMinutes: 15
        },
        notifications: {
          emailEnabled: true,
          smsEnabled: false,
          webhookUrl: 'https://api.crepephahon.com/webhooks/payment'
        }
      };
      setSettings(mockSettings);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      // API call to save settings
      console.log('Saving settings:', settings);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Failed to save settings:', error);
      alert('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (path: string, value: any) => {
    if (!settings) return;
    
    const keys = path.split('.');
    const newSettings = { ...settings };
    let current = newSettings;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i] as keyof typeof current] as any;
    }
    
    current[keys[keys.length - 1] as keyof typeof current] = value;
    setSettings(newSettings);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (!settings) return null;

  const tabs = [
    { id: 'general', label: 'General', icon: '⚙️' },
    { id: 'pricing', label: 'Pricing', icon: '💰' },
    { id: 'payments', label: 'Payments', icon: '💳' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' }
  ] as const;

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <Card className="p-6">
        <div className="flex space-x-8">
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
        </div>
      </Card>

      {/* General Settings */}
      {activeTab === 'general' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">General Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
              <input
                type="text"
                value={settings.businessName}
                onChange={(e) => updateSetting('businessName', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Phone</label>
              <input
                type="text"
                value={settings.businessPhone}
                onChange={(e) => updateSetting('businessPhone', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Address</label>
              <textarea
                value={settings.businessAddress}
                onChange={(e) => updateSetting('businessAddress', e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Email</label>
              <input
                type="email"
                value={settings.businessEmail}
                onChange={(e) => updateSetting('businessEmail', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Operating Hours</label>
              <div className="flex gap-2">
                <input
                  type="time"
                  value={settings.operatingHours.open}
                  onChange={(e) => updateSetting('operatingHours.open', e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                />
                <span className="flex items-center">to</span>
                <input
                  type="time"
                  value={settings.operatingHours.close}
                  onChange={(e) => updateSetting('operatingHours.close', e.target.value)}
                  className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Pricing Settings */}
      {activeTab === 'pricing' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Pricing Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Base Crepe Price (฿)</label>
              <input
                type="number"
                value={settings.pricing.basePrice}
                onChange={(e) => updateSetting('pricing.basePrice', parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Single Topping Price (฿)</label>
              <input
                type="number"
                value={settings.pricing.singleToppingPrice}
                onChange={(e) => updateSetting('pricing.singleToppingPrice', parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">3 Toppings Bundle Price (฿)</label>
              <input
                type="number"
                value={settings.pricing.bundle3Price}
                onChange={(e) => updateSetting('pricing.bundle3Price', parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Whipped Cream Price (฿)</label>
              <input
                type="number"
                value={settings.pricing.whippedCreamPrice}
                onChange={(e) => updateSetting('pricing.whippedCreamPrice', parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Payment Settings */}
      {activeTab === 'payments' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Settings</h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Payment Methods</h4>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.paymentSettings.kbankEnabled}
                    onChange={(e) => updateSetting('paymentSettings.kbankEnabled', e.target.checked)}
                    className="mr-3"
                  />
                  <span>K-Bank QR Payment</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.paymentSettings.bangkokbankEnabled}
                    onChange={(e) => updateSetting('paymentSettings.bangkokbankEnabled', e.target.checked)}
                    className="mr-3"
                  />
                  <span>Bangkok Bank QR Payment</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">QR Code Expiry (minutes)</label>
              <input
                type="number"
                value={settings.paymentSettings.qrExpiryMinutes}
                onChange={(e) => updateSetting('paymentSettings.qrExpiryMinutes', parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Notification Settings */}
      {activeTab === 'notifications' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Settings</h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-md font-medium text-gray-900 mb-4">Notification Methods</h4>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.notifications.emailEnabled}
                    onChange={(e) => updateSetting('notifications.emailEnabled', e.target.checked)}
                    className="mr-3"
                  />
                  <span>Email Notifications</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.notifications.smsEnabled}
                    onChange={(e) => updateSetting('notifications.smsEnabled', e.target.checked)}
                    className="mr-3"
                  />
                  <span>SMS Notifications</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Webhook URL</label>
              <input
                type="url"
                value={settings.notifications.webhookUrl}
                onChange={(e) => updateSetting('notifications.webhookUrl', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="https://api.example.com/webhooks/payment"
              />
              <p className="text-sm text-gray-600 mt-1">
                URL to receive payment notifications and status updates
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Save Button */}
      <Card className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Save Changes</h3>
            <p className="text-sm text-gray-600">Your changes will be applied immediately</p>
          </div>
          <Button
            onClick={saveSettings}
            disabled={saving}
            className="min-w-[120px]"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
