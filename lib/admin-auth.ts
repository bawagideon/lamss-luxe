import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

const getServiceSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: { persistSession: false }
  }
);

/**
 * Validates if the current request is coming from an authorized administrator session.
 * Returns the staff member's profile if valid.
 */
export async function validateAdminSession() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('admin_session')?.value;
  
  if (!sessionToken) {
    redirect('/admin/login');
  }

  // Check if token exists in active sessions and join with staff details
  const supabase = getServiceSupabase();
  const { data: session, error } = await supabase
    .from('admin_sessions')
    .select('*, admin_staff(*)')
    .eq('token', sessionToken)
    .single();

  if (error || !session || !session.admin_staff) {
    redirect('/admin/login');
  }

  return session.admin_staff;
}
