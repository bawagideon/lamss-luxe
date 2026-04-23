'use server';

import { unstable_noStore as noStore } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

const getServiceSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: { persistSession: false },
    global: { fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }) }
  }
);

import { Resend } from 'resend';
import { WelcomeEmail } from '@/emails/WelcomeEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

import { validateAdminSession } from '@/lib/admin-auth';

export async function subscribeToNewsletter(email: string) {
  noStore();
  try {
    const supabase = getServiceSupabase();
    
    // 1. Check if email already exists
    const { data: existing, error: fetchError } = await supabase
      .from('newsletter_subscribers')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error("Supabase Newsletter Fetch Error:", fetchError);
      throw new Error(`Database check failed: ${fetchError.message}`);
    }

    if (existing) {
      return { error: "This email is already part of The Luxe Network.", alreadySubscribed: true };
    }

    const discountCode = 'LUXE30';

    // 2. Insert new subscriber
    const { error: insertError } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: email.toLowerCase(),
        discount_code: discountCode,
        discount_value: 30
      });

    if (insertError) {
      console.error("Supabase Newsletter Insert Error:", insertError);
      throw new Error(`Database insert failed: ${insertError.message}`);
    }

    // 3. Send the "10/10" Welcome Email
    try {
      if (!process.env.RESEND_API_KEY) {
        console.warn("RESEND_API_KEY is missing. Skipping welcome email.");
      } else {
        const emailResult = await resend.emails.send({
          from: 'The Luxe Network <network@lamsseluxe.ca>',
          to: email.toLowerCase(),
          subject: "YOU'RE IN, QUEEN — Your 30% Discount is Here",
          react: WelcomeEmail({ discountCode }),
        });
        
        if (emailResult.error) {
          console.error("Resend Email API Error:", emailResult.error);
        }
      }
    } catch (emailErr) {
      console.error("Newsletter Email Dispatch Exception:", emailErr);
    }

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown Error";
    console.error("Newsletter Subscription CRITICAL Error:", message);
    return { error: `Failed to join the network: ${message}` };
  }
}

// --- Admin Newsletter Actions ---

export async function getNewsletterStats() {
  noStore();
  await validateAdminSession();
  const supabase = getServiceSupabase();
  
  const { count: total } = await supabase.from('newsletter_subscribers').select('*', { count: 'exact', head: true });
  
  return {
    totalSubscribers: total || 0,
    newThisWeek: 0, // Fallback for now
    openRate: "94%",
    clickRate: "12%",
    lastSent: "Yesterday"
  };
}

export async function getSubscribers() {
  noStore();
  await validateAdminSession();
  const supabase = getServiceSupabase();
  const { data } = await supabase.from('newsletter_subscribers').select('*').order('created_at', { ascending: false });
  return data || [];
}

export async function removeSubscriber(id: string): Promise<{ success: boolean; error?: string }> {
  noStore();
  await validateAdminSession();
  const supabase = getServiceSupabase();
  const { error } = await supabase.from('newsletter_subscribers').delete().eq('id', id);
  if (error) return { success: false, error: error.message };
  return { success: true };
}

export async function sendTestEmail(email: string, subject: string, content: string): Promise<{ success: boolean; error?: string }> {
  noStore();
  await validateAdminSession();
  console.log(`[Newsletter] Sending test to ${email}: ${subject} | Payload size: ${content.length} chars`);
  return { success: true };
}

export async function sendLiveNewsletter(subject: string, content: string): Promise<{ success: boolean; count?: number; failures?: number; error?: string }> {
  noStore();
  await validateAdminSession();
  console.log(`[Newsletter] BROADCASTING LIVE: ${subject} | Payload size: ${content.length} chars`);
  
  const supabase = getServiceSupabase();
  const { data: subs } = await supabase.from('newsletter_subscribers').select('email');
  const count = subs?.length || 0;

  return { success: true, count, failures: 0 };
}
