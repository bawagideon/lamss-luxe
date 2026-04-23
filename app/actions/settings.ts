'use server';

import { unstable_noStore as noStore, revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import { validateAdminSession } from '@/lib/admin-auth';

const getServiceSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: { persistSession: false },
    global: { fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }) }
  }
);

export interface Settings {
  store_name: string;
  contact_email: string;
  industry_tag: string;
  stripe_public_key: string;
  stripe_secret_key: string;
  supabase_url: string;
  max_admin_devices: number;
}

/**
 * Fetches store settings securely.
 * Masks sensitive keys (Stripe Secret) to prevent exposure in the client-side UI.
 */
export async function getAdminSettings() {
  noStore();
  
  const defaultSettings: Settings = {
    store_name: "Lamssé Luxe",
    contact_email: "founder@lamsseluxe.com",
    industry_tag: "Luxury Fashion & Community Network",
    stripe_public_key: "pk_live_********************",
    stripe_secret_key: "sk_live_********************",
    supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    max_admin_devices: 3
  };

  try {
    const user = await validateAdminSession();
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .single();

    let settingsData = data || defaultSettings;

    // MASK SENSITIVE KEYS ALWAYS
    const maskedSettings = {
      ...settingsData,
      stripe_secret_key: (settingsData.stripe_secret_key || "").replace(/.(?=.{4})/g, '*')
    } as Settings;

    return {
      settings: maskedSettings,
      userRole: user.role
    };
  } catch (error) {
    console.error("Fetch Settings Error (Falling back to defaults):", error);
    return {
      settings: defaultSettings,
      userRole: 'editor' // Failsafe to lowest permission
    };
  }
}

/**
 * Updates store settings.
 * Ensures the user is authorized before making any infrastructure changes.
 */
export async function updateAdminSettings(settings: Partial<Settings>) {
  noStore();
  await validateAdminSession();
  
  try {
    const supabase = getServiceSupabase();
    
    // Prevent accidentally overwriting a real secret with a masked one from the UI
    const payload = { ...settings };
    if (payload.stripe_secret_key?.includes('*')) {
      delete payload.stripe_secret_key;
    }

    const { error } = await supabase
      .from('site_settings')
      .upsert({ 
        id: 1, // Single row for settings
        ...payload,
        updated_at: new Date().toISOString()
      });

    if (error) throw error;
    
    revalidatePath('/admin/settings');
    return { success: true };
  } catch (error) {
    console.error("Update Settings Error:", error);
    return { error: "Failed to update configuration." };
  }
}
