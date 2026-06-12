import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

// Emergency whitelist of master administrator/developer emails
const EMERGENCY_WHITELIST = [
  "lamsseluxe@gmail.com",
  "anifowosheolamidee@gmail.com",
  "bawagideon98@gmail.com",
  "olayemmenzo@gmail.com"
];

/**
 * Validates if the current request has a valid admin session via Supabase Auth.
 * Performs a hybrid security check checking the master whitelist and the staff database table.
 */
export async function validateAdminSession() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user || !user.email) {
    redirect('/admin/login');
  }

  const cleanEmail = user.email.toLowerCase().trim();

  // 1. Check if the user exists in the admin_staff database table
  const { data: staffMember, error } = await supabase
    .from('admin_staff')
    .select('name, role, email')
    .eq('email', cleanEmail)
    .single();

  if (error || !staffMember) {
    // 2. Fallback: If not in the DB, check the emergency master whitelist
    if (EMERGENCY_WHITELIST.includes(cleanEmail)) {
      return { name: 'Master Admin', role: 'admin', email: cleanEmail };
    }

    // 3. Unauthorized access attempt - clear session and redirect to login
    await supabase.auth.signOut();
    redirect('/admin/login');
  }

  return { name: staffMember.name, role: staffMember.role, email: staffMember.email };
}

