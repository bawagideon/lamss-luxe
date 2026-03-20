'use server';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// 1. Dashboard Metrics
export async function getAdminMetrics() {
  const supabase = createClient();
  
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
  const supabase = createClient();
  const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(6);
  return data || [];
}

// 2. General Orders Engine
export async function updateOrderStatus(orderId: string, status: string) {
  const supabase = createClient();
  await supabase.from('orders').update({ status }).eq('id', orderId);
  revalidatePath('/admin/orders');
  revalidatePath('/admin');
}

export async function getAdminAllOrders() {
  const supabase = createClient();
  const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  return data || [];
}

// 3. Product Catalog Sandbox
export async function addProduct(formData: FormData) {
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = Number(formData.get('price'));
  const stock = Number(formData.get('stock'));
  const category = formData.get('category') as string;
  // default placeholder for new products if empty image
  const image_url = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200&auto=format&fit=crop"; 

  const supabase = createClient();
  await supabase.from('products').insert({
    name, description, price, stock, category, image_url
  });

  revalidatePath('/admin/products');
  revalidatePath('/shop');
}

export async function getAdminProducts() {
  const supabase = createClient();
  const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  return data || [];
}

// 4. Customers Tracking
export async function getCustomers() {
  const supabase = createClient();
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
