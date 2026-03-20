'use server';

import { unstable_noStore as noStore } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

export async function getActiveProducts() {
  noStore();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: { persistSession: false },
      global: { fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }) }
    }
  );
  
  const { data, error } = await supabase.from('products').select('*');
  
  if (error) {
    console.error("Error fetching products:", error);
    return null;
  }
  
  return data;
}
