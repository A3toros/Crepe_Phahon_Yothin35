import { useEffect, useState } from 'react';
import { OrderSummary, OrderStatus } from '@src/types';
import { Button } from '@src/components/ui/Button';
import { QrModal } from '@src/components/order/QrModal';
import { subscribeToOrderStatus } from '@src/lib/orders/realtime';

export function RecentOrder() {
  const [recent, setRecent] = useState<OrderSummary | null>(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [qrText, setQrText] = useState('');
  const [expiresAt, setExpiresAt] = useState('');

  useEffect(() => {
    // TODO: fetch recent order for user and set state
    setRecent(null);
  }, []);

  useEffect(() => {
    if (!recent) return;
    const unsubscribe = subscribeToOrderStatus(recent.id, (status) => setRecent({ ...recent, status: status as OrderStatus }));
    return unsubscribe;
  }, [recent?.id]);

  if (!recent) return <div className="text-sm text-gray-600">No recent order.</div>;

  return (
    <div className="rounded border p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold">Recent order</div>
          <div className="text-sm text-gray-600">{new Date(recent.createdAt).toLocaleString()}</div>
        </div>
        <div className={`text-sm px-2 py-1 rounded ${recent.status==='paid'?'bg-green-100 text-green-700':'bg-blueSoft'}`}>{recent.status}</div>
      </div>
      <div className="mt-2">Total: {recent.totalBaht} THB</div>
      {recent.status !== 'paid' && (
        <div className="mt-3 flex gap-2">
          <Button onClick={()=>{ setQrText('PROMPTPAY|ORDER:'+recent.id); setExpiresAt(new Date(Date.now()+300000).toISOString()); setQrOpen(true); }}>Show QR</Button>
          <Button variant="secondary">Cancel</Button>
        </div>
      )}
      <QrModal open={qrOpen} onClose={()=>setQrOpen(false)} qrText={qrText} expiresAt={expiresAt} />
    </div>
  );
}


