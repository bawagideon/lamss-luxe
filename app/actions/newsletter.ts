'use server';

import { unstable_noStore as noStore } from 'next/cache';
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js';
import { sendNewsletterEmail } from '@/lib/resend';

const getAdminSupabase = () => createSupabaseAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: { persistSession: false },
    global: { fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }) }
  }
);

export async function getNewsletterStats() {
  noStore();
  try {
    const supabase = getAdminSupabase();
    
    // 1. Total Subscribers
    const { count: totalSubscribers } = await supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true });

    // 2. New This Week
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const { count: newThisWeek } = await supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', lastWeek.toISOString());

    return {
      totalSubscribers: totalSubscribers || 0,
      newThisWeek: newThisWeek || 0,
    };
  } catch (error) {
    console.error("Error fetching newsletter stats:", error);
    return { totalSubscribers: 0, newThisWeek: 0 };
  }
}

export async function sendTestEmail(testAddress: string, subject: string, content: string) {
  noStore();
  if (!testAddress || !subject || !content) {
    return { error: "Missing required fields for test send." };
  }
  
  try {
    await sendNewsletterEmail(testAddress, subject, content);
    return { success: true };
  } catch (error: unknown) {
    const err = error as Error;
    return { error: err.message || "Failed to send test email." };
  }
}

export async function sendLiveNewsletter(subject: string, content: string) {
  noStore();
  if (!subject || !content) {
    return { error: "Subject and Content are required for a live blast." };
  }

  try {
    const supabase = getAdminSupabase();
    const { data: subscribers, error } = await supabase
      .from('newsletter_subscribers')
      .select('email');

    if (error) throw new Error(error.message);
    if (!subscribers || subscribers.length === 0) {
      return { error: "No subscribers found." };
    }

    // Promise.all for high-performance concurrent dispatch
    const results = await Promise.allSettled(
      subscribers.map(s => sendNewsletterEmail(s.email, subject, content))
    );

    const failures = results.filter(r => r.status === 'rejected').length;

    return { 
      success: true, 
      count: subscribers.length,
      failures: failures
    };
  } catch (error: unknown) {
    const err = error as Error;
    return { error: err.message || "Failed to dispatch live newsletter." };
  }
}
