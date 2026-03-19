'use server';

import { createClient } from '@/lib/supabase/server';

export async function getActiveProducts() {
  const supabase = createClient();
  const { data, error } = await supabase.from('products').select('*');
  
  if (error) {
    console.error("Error fetching products:", error);
    return null;
  }
  
  return data;
}
