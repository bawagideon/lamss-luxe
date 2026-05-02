'use server';

import { unstable_noStore as noStore, revalidatePath } from 'next/cache';
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js';
import { sendShippingConfirmationEmail } from '@/lib/resend';
import { validateAdminSession } from '@/lib/admin-auth';

export interface Order {
  id: string;
  total_amount: number;
  status: string;
  customer_email: string;
  user_id?: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  category_id?: string;
  category?: string;
  image_url: string | null;
  image_front?: string | null;
  image_side?: string | null;
  image_back?: string | null;
  colors?: string[];
  color_codes?: string[];
  stock_status?: string;
  stock?: number;
  sizes?: string[];
  material?: string | null;
  occasion?: string | null;
  size_and_fit?: string | null;
  fabric_and_care?: string | null;
  marketing_message?: string | null;
  color_images?: Record<string, { main: string | null; front: string | null; side: string | null; back: string | null }>;
  is_new?: boolean;
  promo_banner?: string | null;
  color_badges?: Record<string, string>;
  related_product_ids?: string[];
  is_set_available?: boolean;
}

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
  await validateAdminSession();
  const supabase = getAdminSupabase();
  
  let totalRevenue = 0;
  const { data: revenueData } = await supabase.from('orders').select('total_amount').eq('status', 'paid');
  if (revenueData) {
    totalRevenue = revenueData.reduce((sum: number, order: { total_amount: number }) => sum + Number(order.total_amount || 0), 0);
  }

  const { count: ordersCount } = await supabase.from('orders').select('*', { count: 'exact', head: true });
  const { count: activeProducts } = await supabase.from('products').select('*', { count: 'exact', head: true }).gt('stock', 0);
  
  // Pull real registered customer count from profiles
  const { count: customersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });

  return {
    totalRevenue: totalRevenue.toFixed(2),
    ordersCount: ordersCount || 0,
    activeProducts: activeProducts || 0,
    waitlistCount: customersCount || 0,
    promoStats: {
        discountedOrders: 0,
        totalSavings: 0,
        subscriberGrowth: 0
    }
  };
}

export async function getAdminPromoMetrics() {
    noStore();
    await validateAdminSession();
    const supabase = getAdminSupabase();
    
    // 1. Get Promo Orders summary
    const { data: promoOrders, error: ordersError } = await supabase
        .from('orders')
        .select('id, total_amount')
        .eq('status', 'paid')
        .eq('is_promo', true);

    if (ordersError || !promoOrders) {
        return { discountedOrders: 0, totalSavings: 0, revenueImpact: 0 };
    }

    const discountedOrders = promoOrders.length;
    const revenueImpact = promoOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);

    // 2. Calculate savings from all order items in those orders
    const promoOrderIds = promoOrders.map(o => o.id);
    const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .select('price, original_price, quantity')
        .in('order_id', promoOrderIds);

    let totalSavings = 0;
    if (items && !itemsError) {
        totalSavings = items.reduce((sum, item) => {
            const original = Number(item.original_price || item.price || 0);
            const paid = Number(item.price || 0);
            return sum + ((original - paid) * (item.quantity || 1));
        }, 0);
    }
    
    return {
        discountedOrders,
        totalSavings,
        revenueImpact
    };
}

export async function getAdminRecentOrders() {
  noStore();
  await validateAdminSession();
  const supabase = getAdminSupabase();
  const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(6);
  return data || [];
}

// 2. General Orders Engine
export async function updateOrderStatus(orderId: string, status: string) {
  noStore();
  await validateAdminSession();
  const supabase = getAdminSupabase();
  await supabase.from('orders').update({ status }).eq('id', orderId);

  // Dispatch shipping confirmation using Resend
  if (status === 'shipped') {
    const { data: order } = await supabase.from('orders').select('customer_email').eq('id', orderId).single();
    if (order?.customer_email) {
      await sendShippingConfirmationEmail(order.customer_email);
    }
  }

  revalidatePath('/admin/orders');
  revalidatePath('/admin');
}

export async function getAdminAllOrders() {
  noStore();
  await validateAdminSession();
  const supabase = getAdminSupabase();
  const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  return data || [];
}

// 3. Secure Asset Pivot (Proxies client uploads to bypass RLS and 4.5MB limits)
export async function uploadSingleImage(formData: FormData) {
  noStore();
  await validateAdminSession();
  try {
    const file = formData.get('file') as File;
    if (!file || file.size === 0) return { error: "No file provided" };

    const supabase = getAdminSupabase();
    
    // Failsafe: Ensure target bucket 'products' physically exists natively before upload
    const { data: buckets } = await supabase.storage.listBuckets();
    if (!buckets?.find(b => b.name === 'products')) {
      await supabase.storage.createBucket('products', { public: true });
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { error } = await supabase.storage.from('products').upload(fileName, file, { 
      cacheControl: '3600', 
      upsert: false 
    });

    if (error) throw error;
    
    const { data } = supabase.storage.from('products').getPublicUrl(fileName);
    return { url: data.publicUrl };
  } catch (error) {
    console.error("Single Upload Error:", error);
    return { error: error instanceof Error ? error.message : "Internal Upload Error" };
  }
}
export async function addProduct(formData: FormData) {
  noStore();
  await validateAdminSession();
  try {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = Number(formData.get('price'));
    const stock = Number(formData.get('stock'));
    const category = formData.get('category') as string;
    const sizesStr = formData.get('sizes') as string || "";
    const rawColorNames = formData.getAll('color_names') as string[];
    const rawColorCodes = formData.getAll('color_codes') as string[];
    const material = formData.get('material') as string || null;
    const occasion = formData.get('occasion') as string || null;
    const size_and_fit = formData.get('size_and_fit') as string || null;
    const fabric_and_care = formData.get('fabric_and_care') as string || null;
    const marketing_message = formData.get('marketing_message') as string || null;
    const is_new = formData.get('is_new') === 'true';
    const promo_banner = formData.get('promo_banner') as string || null;
    const is_set_available = formData.get('is_set_available') === 'true';
    const related_product_ids = formData.get('related_product_ids') ? (formData.get('related_product_ids') as string).split(',') : [];
    
    // Parse the multipart binary blobs
    // Receive as URLs (already uploaded by the client to bypass the 4.5MB Vercel limit)
    const image_main = (formData.get('image_main') as string) || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200&auto=format&fit=crop"; 
    const image_front = formData.get('image_front') as string || null;
    const image_side = formData.get('image_side') as string || null;
    const image_back = formData.get('image_back') as string || null;

    const sizes = sizesStr.split(',').map(s => s.trim()).filter(Boolean);
    
    const colors: string[] = [];
    const color_codes: string[] = [];

    rawColorNames.forEach((name, idx) => {
      if (name.trim() !== '') {
        colors.push(name.trim());
        color_codes.push(rawColorCodes[idx] || "#000000");
      }
    });

    // 4. Variant Image Processing (JSONB)
    const color_images: Record<string, { main: string | null; front: string | null; side: string | null; back: string | null }> = {};
    for (const color of colors) {
      const vMainUrl = formData.get(`variant_image_${color}_main`) as string | null;
      const vFrontUrl = formData.get(`variant_image_${color}_front`) as string | null;
      const vSideUrl = formData.get(`variant_image_${color}_side`) as string | null;
      const vBackUrl = formData.get(`variant_image_${color}_back`) as string | null;

      if (vMainUrl || vFrontUrl || vSideUrl || vBackUrl) {
        color_images[color] = {
          main: vMainUrl,
          front: vFrontUrl,
          side: vSideUrl,
          back: vBackUrl,
        };
      }
    }

    const supabase = getAdminSupabase();
    const { error } = await supabase.from('products').insert({
      name, description, price, stock, category, 
      image_url: image_main,
      image_front, image_side, image_back,
      sizes, colors, color_codes,
      material, occasion, size_and_fit, fabric_and_care,
      marketing_message,
      color_images,
      is_new,
      promo_banner,
      is_set_available,
      related_product_ids,
      color_badges: JSON.parse(formData.get('color_badges_json') as string || '{}')
    });

    if (error) throw new Error(error.message);

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to add product natively.";
    return { error: message };
  }
}

export async function editProduct(formData: FormData) {
  noStore();
  await validateAdminSession();
  try {
    const id = formData.get('id') as string;
    
    // Create a dynamic payload containing only non-null values from form
    const updatePayload: Record<string, unknown> = {};
    
    const name = formData.get('name');
    if (name) updatePayload.name = name;
    
    const description = formData.get('description');
    if (description !== null) updatePayload.description = description;
    
    const price = formData.get('price');
    if (price && !isNaN(Number(price))) updatePayload.price = Number(price);
    
    const stock = formData.get('stock');
    if (stock !== null && !isNaN(Number(stock))) updatePayload.stock = Number(stock);
    
    const category = formData.get('category');
    if (category) updatePayload.category = category;
    
    const sizes = formData.get('sizes');
    if (sizes !== null) updatePayload.sizes = (sizes as string).split(',').map(s => s.trim()).filter(Boolean);

    const material = formData.get('material');
    if (material !== null) updatePayload.material = material;
    
    const occasion = formData.get('occasion');
    if (occasion !== null) updatePayload.occasion = occasion;
    
    const size_and_fit = formData.get('size_and_fit');
    if (size_and_fit !== null) updatePayload.size_and_fit = size_and_fit;
    
    const fabric_and_care = formData.get('fabric_and_care');
    if (fabric_and_care !== null) updatePayload.fabric_and_care = fabric_and_care;
    
    const marketing_message = formData.get('marketing_message');
    if (marketing_message !== null) updatePayload.marketing_message = marketing_message;
    
    const promo_banner = formData.get('promo_banner');
    if (promo_banner !== null) updatePayload.promo_banner = promo_banner;

    const is_new = formData.get('is_new');
    if (is_new !== null) updatePayload.is_new = is_new === 'true';

    const is_set_available = formData.get('is_set_available');
    if (is_set_available !== null) updatePayload.is_set_available = is_set_available === 'true';

    const relIds = formData.get('related_product_ids');
    if (relIds !== null) updatePayload.related_product_ids = (relIds as string).split(',').filter(Boolean);

    const colorBadges = formData.get('color_badges_json');
    if (colorBadges) updatePayload.color_badges = JSON.parse(colorBadges as string);

    // Asset Handling
    const image_main = formData.get('image_main');
    if (typeof image_main === 'string' && image_main.startsWith('http')) updatePayload.image_url = image_main;
    
    const image_front = formData.get('image_front');
    if (typeof image_front === 'string' && image_front.startsWith('http')) updatePayload.image_front = image_front;
    
    const image_side = formData.get('image_side');
    if (typeof image_side === 'string' && image_side.startsWith('http')) updatePayload.image_side = image_side;
    
    const image_back = formData.get('image_back');
    if (typeof image_back === 'string' && image_back.startsWith('http')) updatePayload.image_back = image_back;

    // Color & Variant Logic
    const rawColorNames = formData.getAll('color_names') as string[];
    const rawColorCodes = formData.getAll('color_codes') as string[];
    if (rawColorNames.length > 0 && rawColorNames.some(n => n.trim() !== '')) {
      const colors: string[] = [];
      const color_codes: string[] = [];
      rawColorNames.forEach((name, idx) => {
        if (name.trim() !== '') {
          colors.push(name.trim());
          color_codes.push(rawColorCodes[idx] || "#000000");
        }
      });
      updatePayload.colors = colors;
      updatePayload.color_codes = color_codes;
    }

    // Merge color images
    let color_images: Record<string, { main: string | null; front: string | null; side: string | null; back: string | null }> = {};
    try {
      const existingJson = formData.get('existing_color_images') as string;
      if (existingJson) color_images = JSON.parse(existingJson);
    } catch {}

    const activeColors = (updatePayload.colors as string[]) || [];
    for (const color of activeColors) {
      const vMain = formData.get(`variant_image_${color}_main`);
      const vFront = formData.get(`variant_image_${color}_front`);
      const vSide = formData.get(`variant_image_${color}_side`);
      const vBack = formData.get(`variant_image_${color}_back`);
      
      const isUrl = (v: unknown): v is string => typeof v === 'string' && v.startsWith('http');
      
      if (isUrl(vMain) || isUrl(vFront) || isUrl(vSide) || isUrl(vBack)) {
        color_images[color] = {
          main: isUrl(vMain) ? vMain : (color_images[color]?.main || null),
          front: isUrl(vFront) ? vFront : (color_images[color]?.front || null),
          side: isUrl(vSide) ? vSide : (color_images[color]?.side || null),
          back: isUrl(vBack) ? vBack : (color_images[color]?.back || null),
        };
      }
    }
    if (Object.keys(color_images).length > 0) updatePayload.color_images = color_images;

    const supabase = getAdminSupabase();
    const { error } = await supabase.from('products').update(updatePayload).eq('id', id);

    if (error) throw new Error(error.message);

    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update product natively.";
    return { error: message };
  }
}

export async function deleteProduct(id: string) {
  noStore();
  await validateAdminSession();
  try {
    const supabase = getAdminSupabase();
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw new Error(error.message);
    
    revalidatePath('/', 'layout');
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete from DB.";
    return { error: message };
  }
}

export async function getAdminProducts() {
  noStore();
  await validateAdminSession();
  const supabase = getAdminSupabase();
  const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  return data || [];
}

// 4. Customers CRM & Tracking
export async function fetchCustomers() {
  noStore();
  await validateAdminSession();
  const supabase = getAdminSupabase();
  
  // 1. Fetch all profiles
  const { data: profiles, error: pError } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (pError) {
    console.error("Error fetching customers from profiles:", pError);
    return [];
  }

  // 2. Fetch all wishlist records to map counts
  const { data: wishlistData, error: wError } = await supabase
    .from('wishlist')
    .select('user_id');

  if (wError) {
    console.warn("Could not aggregate wishlist counts:", wError.message);
    return profiles || [];
  }

  // 3. Map counts to profiles
  const wishlistCounts: Record<string, string[]> = {};
  (wishlistData as { user_id: string }[]).forEach((row) => {
    if (!wishlistCounts[row.user_id]) wishlistCounts[row.user_id] = [];
    wishlistCounts[row.user_id].push('marker'); 
  });

  return (profiles || []).map(p => ({
    ...p,
    wishlist: wishlistCounts[p.id] || []
  }));
}

export async function fetchNewsletterSubscribers() {
  noStore();
  await validateAdminSession();
  const supabase = getAdminSupabase();
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching newsletter subscribers:", error);
    return [];
  }
  return data || [];
}

export async function fetchCustomerWishlist(wishlistIds: string[]) {
  noStore();
  await validateAdminSession();
  if (!wishlistIds || wishlistIds.length === 0) return [];
  
  const supabase = getAdminSupabase();
  const { data, error } = await supabase
    .from('products')
    .select('id, name, price, image_url')
    .in('id', wishlistIds);
  
  if (error) {
    console.error("Error fetching customer wishlist details:", error);
    return [];
  }
  return data || [];
}

export async function fetchCustomerViewed(viewedIds: string[]) {
  noStore();
  await validateAdminSession();
  if (!viewedIds || viewedIds.length === 0) return [];
  
  const supabase = getAdminSupabase();
  const { data, error } = await supabase
    .from('products')
    .select('id, name, price, image_url')
    .in('id', viewedIds);
  
  if (error) {
    console.error("Error fetching customer viewed history details:", error);
    return [];
  }
  
  // Maintain order (most recent first)
  const ordered = viewedIds.map(id => (data || []).find(p => p.id === id)).filter(Boolean);
  return ordered;
}

export async function fetchCustomerOrders(userId: string) {
  noStore();
  await validateAdminSession();
  const supabase = getAdminSupabase();
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error("Error fetching customer orders:", error);
    return [];
  }
  return data || [];
}

// Legacy Aggregated Tracking (Keeping for Metrics compatibility if needed)
export async function getCustomers() {
  noStore();
  await validateAdminSession();
  const supabase = getAdminSupabase();
  const { data } = await supabase.from('orders').select('customer_email, total_amount, created_at');
  
  if (!data) return [];

  const customerMap = new Map<string, { id: string; name: string; email: string; joined: string; orders: number; spent: number }>();
  data.forEach((order: { customer_email: string; total_amount: number; created_at: string }) => {
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
    if (customer) {
      customer.orders += 1;
      customer.spent += Number(order.total_amount || 0);
    }
  });

  return Array.from(customerMap.values()).map(c => ({
    ...c,
    spent: `$${c.spent.toFixed(2)}`,
    status: 'Active'
  }));
}
