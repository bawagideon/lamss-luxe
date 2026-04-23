'use server';

import { unstable_noStore as noStore, revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';
import { validateAdminSession } from '@/lib/admin-auth';

const getServiceSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: { persistSession: false }
  }
);

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  created_at: string;
}

export interface AdminSession {
  id: string;
  staff_id: string;
  device_id: string;
  last_active: string;
  staff_name?: string;
}

export async function getStaffMembers() {
  noStore();
  await validateAdminSession();
  const supabase = getServiceSupabase();
  const { data, error } = await supabase.from('admin_staff').select('id, name, email, role, created_at');
  if (error) return [];
  return data as StaffMember[];
}

export async function addStaffMember(name: string, email: string, password: string, role: string = 'editor') {
  noStore();
  await validateAdminSession();
  const supabase = getServiceSupabase();
  
  const { error } = await supabase.from('admin_staff').insert({
    name,
    email,
    password, 
    role
  });

  if (error) throw error;
  revalidatePath('/admin/settings');
  return { success: true };
}

export async function removeStaffMember(id: string) {
  noStore();
  await validateAdminSession();
  const supabase = getServiceSupabase();
  const { error } = await supabase.from('admin_staff').delete().eq('id', id);
  if (error) throw error;
  
  // Also remove all their sessions
  await supabase.from('admin_sessions').delete().eq('staff_id', id);
  
  revalidatePath('/admin/settings');
  return { success: true };
}

export async function getActiveSessions() {
  noStore();
  await validateAdminSession();
  const supabase = getServiceSupabase();
  const { data, error } = await supabase
    .from('admin_sessions')
    .select('*, admin_staff(name)')
    .order('last_active', { ascending: false });
    
  if (error) return [];
  return (data as any[]).map(s => ({
    ...s,
    staff_name: s.admin_staff?.name
  })) as AdminSession[];
}

export async function revokeSession(sessionId: string) {
  noStore();
  await validateAdminSession();
  const supabase = getServiceSupabase();
  const { error } = await supabase.from('admin_sessions').delete().eq('id', sessionId);
  if (error) throw error;
  revalidatePath('/admin/settings');
  return { success: true };
}
