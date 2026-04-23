'use server';

import { cookies } from 'next/headers';
import { unstable_noStore as noStore } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

const getServiceSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: { persistSession: false }
  }
);

/**
 * Handles the admin login process securely.
 * Verifies the email and password against the admin_staff table and enforces device limits.
 */
export async function performAdminLogin(email: string, password: string, deviceName: string = 'Unknown Device') {
  noStore();
  const supabase = getServiceSupabase();

  // 1. Fetch staff member matching BOTH email and password
  const { data: staff, error: staffError } = await supabase
    .from('admin_staff')
    .select('*')
    .eq('email', email)
    .eq('password', password)
    .single();

  if (staffError || !staff) {
    return { error: "Invalid administrative credentials." };
  }

  // 2. Check Device Limits
  const { data: settings } = await supabase.from('site_settings').select('max_admin_devices').single();
  const maxDevices = settings?.max_admin_devices || 3;

  const { count: activeSessions } = await supabase
    .from('admin_sessions')
    .select('*', { count: 'exact', head: true })
    .eq('staff_id', staff.id);

  if (activeSessions && activeSessions >= maxDevices) {
    return { 
      error: `Access Denied: You have reached the maximum of ${maxDevices} active devices. Please logout from another device.`,
      limitReached: true 
    };
  }

  // 3. Create Session
  const sessionToken = randomUUID();
  const { error: sessionError } = await supabase.from('admin_sessions').insert({
    staff_id: staff.id,
    token: sessionToken,
    device_id: deviceName,
    last_active: new Date().toISOString()
  });

  if (sessionError) {
    return { error: "Failed to initialize secure session." };
  }

  const cookieStore = cookies();
  cookieStore.set('admin_session', sessionToken, {
    path: '/',
    maxAge: 86400, // 24 hours
    sameSite: 'strict',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  return { success: true };
}
