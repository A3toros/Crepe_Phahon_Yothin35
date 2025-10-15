import { Header } from '@src/components/layout/Header';
import { OrderBuilder } from '@src/components/order/OrderBuilder';
import { PendingOrders } from '@src/components/order/PendingOrders';

export function Order() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="mx-auto max-w-6xl px-4 py-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-center">Build your crepe</h2>
          <PendingOrders />
          <OrderBuilder />
        </section>
      </main>
    </div>
  );
}
