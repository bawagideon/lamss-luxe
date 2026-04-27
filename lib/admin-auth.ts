import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Validates if the current request has a valid admin session cookie.
 * Simple cookie-based check matching the single-password auth system.
 */
export async function validateAdminSession() {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('admin_session')?.value;
  
  if (!sessionToken) {
    redirect('/admin/login');
  }

  // Return a default admin profile since we use a single global password
  return { name: 'Admin', role: 'admin', email: '' };
}
