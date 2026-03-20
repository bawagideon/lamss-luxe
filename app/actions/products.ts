'use server';

import { createClient } from '@supabase/supabase-js';

export async function getActiveProducts() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  const { data, error } = await supabase.from('products').select('*');
  
  if (error) {
    console.error("Error fetching products:", error);
    return null;
  }
  
  return data;
}
