import { useEffect, useState } from 'react';
import { supabase } from '@src/lib/supabase/client';
import { Cabinet } from '@src/app/cabinet';
import { Header } from '@src/components/layout/Header';

export function ProtectedCabinet() {
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSignedIn(!!data.session); setLoading(false); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setSignedIn(!!session));
    return () => { sub?.subscription.unsubscribe(); };
  }, []);

  if (loading) {
    return (
      <div>
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-10">Loading...</main>
      </div>
    );
  }

  if (!signedIn) {
    return (
      <div>
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-10">Please sign in via the menu to access your cabinet.</main>
      </div>
    );
  }

  return <Cabinet />;
}


