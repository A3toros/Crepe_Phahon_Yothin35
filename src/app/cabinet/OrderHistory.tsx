import { useEffect, useState } from 'react';
import { OrderSummary } from '@src/types';

export function OrderHistory() {
  const [items, setItems] = useState<OrderSummary[]>([]);

  useEffect(() => {
    // TODO: fetch order history for user
    setItems([]);
  }, []);

  if (!items.length) return <div className="text-sm text-gray-600">No orders yet.</div>;

  return (
    <div className="overflow-x-auto border rounded">
      <table className="w-full text-left text-sm">
        <thead className="bg-blueSoft">
          <tr>
            <th className="px-3 py-2">Date</th>
            <th className="px-3 py-2">Status</th>
            <th className="px-3 py-2">Total (THB)</th>
          </tr>
        </thead>
        <tbody>
          {items.map(o => (
            <tr key={o.id} className="border-t">
              <td className="px-3 py-2">{new Date(o.createdAt).toLocaleString()}</td>
              <td className="px-3 py-2">{o.status}</td>
              <td className="px-3 py-2">{o.totalBaht}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


