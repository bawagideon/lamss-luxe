'use server';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { unstable_noStore as noStore, revalidatePath } from 'next/cache';
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js';
import { sendShippingConfirmationEmail } from '@/lib/resend';

const getAdminSupabase = () => createSupabaseAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: { persistSession: false },
    global: { fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }) }
  }
);


// 1. Dashboard Metrics
export async function getAdminMetrics() {
  noStore();
  const supabase = getAdminSupabase();
  
  let totalRevenue = 0;
  const { data: revenueData } = await supabase.from('orders').select('total_amount').eq('status', 'paid');
  if (revenueData) {
    totalRevenue = revenueData.reduce((sum: number, order: any) => sum + Number(order.total_amount || 0), 0);
  }

  const { count: ordersCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });
  const { count: activeProducts } = await supabase.from('products').select('*', { count: 'exact', head: true }).gt('stock', 0);
  
  // Reusing orders counting for waitlist mockup/customers scope
  const { count: customersCount } = await supabase.from('orders').select('customer_email', { count: 'exact', head: true });

  return {
    totalRevenue: totalRevenue.toFixed(2),
    ordersCount: ordersCount || 0,
    activeProducts: activeProducts || 0,
    waitlistCount: customersCount || 0
  };
}

export async function getAdminRecentOrders() {
  noStore();
  const supabase = getAdminSupabase();
  const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(6);
  return data || [];
}

// 2. General Orders Engine
export async function updateOrderStatus(orderId: string, status: string) {
  noStore();
  const supabase = getAdminSupabase();
  await supabase.from('orders').update({ status }).eq('id', orderId);

  // Dispatch shipping confirmation using Resend
  if (status === 'shipped') {
    const { data: order } = await supabase.from('orders').select('customer_email').eq('id', orderId).single();
    if (order?.customer_email) {
      await sendShippingConfirmationEmail(order.customer_email, { id: orderId });
    }
  }

  revalidatePath('/admin/orders');
  revalidatePath('/admin');
}

export async function getAdminAllOrders() {
  noStore();
  const supabase = getAdminSupabase();
  const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  return data || [];
}

// 3. Product Catalog Sandbox
export async function addProduct(formData: FormData) {
  noStore();
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = Number(formData.get('price'));
  const stock = Number(formData.get('stock'));
  const category = formData.get('category') as string;
  const sizesStr = formData.get('sizes') as string || "";
  const colorsStr = formData.get('colors') as string || "";
  const image_main = formData.get('image_main') as string || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200&auto=format&fit=crop"; 
  const image_front = formData.get('image_front') as string || null;
  const image_side = formData.get('image_side') as string || null;
  const image_back = formData.get('image_back') as string || null;

  const sizes = sizesStr.split(',').map(s => s.trim()).filter(Boolean);
  const colors = colorsStr.split(',').map(c => c.trim()).filter(Boolean);

  const supabase = getAdminSupabase();
  await supabase.from('products').insert({
    name, description, price, stock, category, 
    image_url: image_main,
    image_front, image_side, image_back,
    sizes, colors
  });

  revalidatePath('/admin/products');
  revalidatePath('/shop');
}

export async function getAdminProducts() {
  noStore();
  const supabase = getAdminSupabase();
  const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  return data || [];
}

// 4. Customers Tracking
export async function getCustomers() {
  noStore();
  const supabase = getAdminSupabase();
  const { data } = await supabase.from('orders').select('customer_email, total_amount, created_at');
  
  if (!data) return [];

  const customerMap = new Map();
  data.forEach((order: any) => {
    // Graceful fallback if customer_email doesn't exist to prevent crash loop
    const email = order.customer_email || 'guest@anonymous.com';
    
    if (!customerMap.has(email)) {
      customerMap.set(email, {
        id: email,
        name: email.split('@')[0],
        email: email,
        joined: new Date(order.created_at).toLocaleDateString(),
        orders: 0,
        spent: 0
      });
    }
    const customer = customerMap.get(email);
    customer.orders += 1;
    customer.spent += Number(order.total_amount || 0);
  });

  return Array.from(customerMap.values()).map(c => ({
    ...c,
    spent: `$${c.spent.toFixed(2)}`,
    status: 'Active'
  }));
}
