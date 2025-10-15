import { createClient } from '@supabase/supabase-js';

// Use environment variables that are available in the build
const url = (import.meta as any).env?.VITE_SUPABASE_URL || (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_URL || '';
const key = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || (import.meta as any).env?.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!url) {
  throw new Error('Missing Supabase URL. Please set VITE_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL environment variable.');
}

if (!key) {
  throw new Error('Missing Supabase anon key. Please set VITE_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable.');
}

export const supabase = createClient(url, key, {
  auth: {
    detectSessionInUrl: true
  }
});
