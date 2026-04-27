'use server';

import { cookies } from 'next/headers';
import { unstable_noStore as noStore } from 'next/cache';
import { randomUUID } from 'crypto';

/**
 * Simple single-password admin login.
 * Checks against the ADMIN_PASSWORD environment variable.
 */
export async function performAdminLogin(password: string) {
  noStore();

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword || password !== adminPassword) {
    return { error: "Invalid administrative credentials." };
  }

  // Create a secure session token
  const sessionToken = randomUUID();

  const cookieStore = cookies();
  cookieStore.set('admin_session', sessionToken, {
    path: '/',
    maxAge: 86400 * 7, // 7 days
    sameSite: 'strict',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  return { success: true };
}
