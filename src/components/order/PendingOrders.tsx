import { useState, useEffect } from 'react';
import { Button } from '@src/components/ui/Button';
import { 
  getPendingOrders, 
  removePendingOrder, 
  markOrderAsExpired,
  checkAbandonedOrders,
  getOrderStats,
  type StoredOrder
} from '@src/lib/orders/persistence';

interface PendingOrdersProps {
  onOrderSelect?: (order: StoredOrder) => void;
}

export function PendingOrders({ onOrderSelect }: PendingOrdersProps) {
  const [pendingOrders, setPendingOrders] = useState<StoredOrder[]>([]);
  const [stats, setStats] = useState(getOrderStats());

  useEffect(() => {
    loadPendingOrders();
    
    // Check for abandoned orders every minute
    const interval = setInterval(() => {
      checkAndMarkExpiredOrders();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const loadPendingOrders = () => {
    const orders = getPendingOrders();
    setPendingOrders(orders);
    setStats(getOrderStats());
  };

  const checkAndMarkExpiredOrders = () => {
    const abandonedOrders = checkAbandonedOrders();
    abandonedOrders.forEach(order => {
      markOrderAsExpired(order.id);
    });
    
    if (abandonedOrders.length > 0) {
      loadPendingOrders();
    }
  };

  const handleRemoveOrder = (orderId: string) => {
    removePendingOrder(orderId);
    loadPendingOrders();
  };

  const handleSelectOrder = (order: StoredOrder) => {
    if (onOrderSelect) {
      onOrderSelect(order);
    }
  };

  if (pendingOrders.length === 0) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-yellow-800">
          Pending Orders ({pendingOrders.length})
        </h3>
        <div className="text-sm text-yellow-700">
          Total Value: {stats.totalValue} THB
        </div>
      </div>
      
      <div className="space-y-2">
        {pendingOrders.map((order) => (
          <div 
            key={order.id} 
            className={`p-3 rounded border ${
              order.status === 'expired' 
                ? 'bg-red-50 border-red-200' 
                : order.status === 'qr_issued'
                ? 'bg-blue-50 border-blue-200'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    Order {order.id.slice(-8)}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded ${
                    order.status === 'expired' 
                      ? 'bg-red-100 text-red-700'
                      : order.status === 'qr_issued'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 mt-1">
                  {order.items.length} items • {order.totalAmount} THB
                  {order.notes && (
                    <div className="text-xs text-gray-500 mt-1 italic">
                      Note: {order.notes}
                    </div>
                  )}
                </div>
                
              </div>
              
              <div className="flex gap-2">
                {onOrderSelect && (
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => handleSelectOrder(order)}
                  >
                    View
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleRemoveOrder(order.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {stats.expiredOrders > 0 && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {stats.expiredOrders} expired orders will be cleaned up automatically
        </div>
      )}
    </div>
  );
}
