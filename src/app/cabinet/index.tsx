import { Header } from '@src/components/layout/Header';
import { RecentOrder } from './RecentOrder';
import { OrderHistory } from './OrderHistory';

export function Cabinet() {
  return (
    <div>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-10 space-y-6">
        <h1 className="text-3xl font-bold">Cabinet</h1>
        <section>
          <h2 className="text-xl font-semibold mb-2">Recent order</h2>
          <RecentOrder />
        </section>
        <section>
          <h2 className="text-xl font-semibold mb-2">Order history</h2>
          <OrderHistory />
        </section>
      </main>
    </div>
  );
}


