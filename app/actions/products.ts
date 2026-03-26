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

export async function getNewArrivals() {
  noStore();
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!url || !key) return [];

    const supabase = createClient(url, key, {
      auth: { persistSession: false },
      global: { fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }) }
    });
    
    // Calculate the threshold date (30 days ago)
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - 30);
    const thresholdISO = thresholdDate.toISOString();
    
    // Fetch only products created within the last 30 days
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .gte('created_at', thresholdISO)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching new arrivals:", error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error("Fatal Server Action Runtime Crash in getNewArrivals:", err);
    return [];
  }
}

export async function searchProducts(query: string) {
  noStore();
  if (!query) return [];
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!url || !key) return [];

    const supabase = createClient(url, key, {
      auth: { persistSession: false },
      global: { fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }) }
    });
    
    // Fuzzy search prioritizing product name or category hits
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,category.ilike.%${query}%`)
      .limit(6);
      
    if (error) {
      console.error("Error fuzzy searching products:", error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error("Fatal Server Action Runtime Crash in searchProducts:", err);
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

export async function getProductsByCategory(category: string) {
  noStore();
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
      .eq('category', category)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error(`Error fetching products for category ${category}:`, error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error(`Fatal Server Action Runtime Crash in getProductsByCategory(${category}):`, err);
    return [];
  }
}

export async function getFilteredProducts(filters: {
  category?: string[];
  size?: string[];
  color?: string[];
  material?: string[];
  occasion?: string[];
}) {
  noStore();
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) return [];

    const supabase = createClient(url, key, {
      auth: { persistSession: false },
      global: { fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }) }
    });

    let query = supabase.from('products').select('*');

    // Multi-select Category (Text column)
    if (filters.category && filters.category.length > 0) {
      query = query.in('category', filters.category);
    }

    // Multi-select Sizes (Array column - using overlaps)
    if (filters.size && filters.size.length > 0) {
      query = query.overlaps('sizes', filters.size);
    }

    // Multi-select Colors (Array column - using overlaps)
    if (filters.color && filters.color.length > 0) {
      query = query.overlaps('colors', filters.color);
    }

    // Multi-select Material (Text column)
    if (filters.material && filters.material.length > 0) {
      query = query.in('material', filters.material);
    }

    // Multi-select Occasion (Text column)
    if (filters.occasion && filters.occasion.length > 0) {
      query = query.in('occasion', filters.occasion);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
       console.error("Supabase Filter Error:", error);
       return [];
    }

    return data || [];
  } catch (err) {
    console.error("Fatal Error in getFilteredProducts:", err);
    return [];
  }
}
