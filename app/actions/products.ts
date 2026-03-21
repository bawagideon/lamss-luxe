'use server';

import { unstable_noStore as noStore } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

export async function getActiveProducts() {
  noStore();
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!url || !key) {
      console.error("[CRITICAL] Missing Vercel Environment Variables: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is perfectly undefined.");
      return [];
    }

    const supabase = createClient(url, key, {
      auth: { persistSession: false },
      global: { fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }) }
    });
    
    const { data, error } = await supabase.from('products').select('*');
    
    if (error) {
      console.error("Error fetching products:", error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error("Fatal Server Action Runtime Crash in getActiveProducts:", err);
    return [];
  }
}

export async function getProductById(id: string) {
  noStore();
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!url || !key) return null;

    const supabase = createClient(url, key, {
      auth: { persistSession: false },
      global: { fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }) }
    });
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error("Error fetching product by ID:", error);
      return null;
    }
    
    return data;
  } catch (err) {
    console.error("Fatal Server Action Runtime Crash in getProductById:", err);
    return null;
  }
}

export async function getProductsByIds(ids: string[]) {
  noStore();
  if (!ids || ids.length === 0) return [];
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return [];

    const supabase = createClient(url, key, {
      auth: { persistSession: false },
      global: { fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }) }
    });
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .in('id', ids);
    
    if (error) {
      console.error("Error fetching products by ids:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Fatal Server Action Runtime Crash in getProductsByIds:", err);
    return [];
  }
}
