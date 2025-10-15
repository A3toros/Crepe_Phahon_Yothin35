import { supabase } from '../supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';

export function subscribeToOrderStatus(orderId: string, onChange: (status: string) => void): () => void {
  const channel: RealtimeChannel = supabase
    .channel(`order-status-${orderId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${orderId}`,
      },
      (payload: any) => {
        const status = payload.new?.status as string;
        if (status) onChange(status);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}


