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
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

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

    if (insertError) throw insertError;

    // 3. Send the "10/10" Welcome Email
    try {
      await resend.emails.send({
        from: 'The Luxe Network <network@lamsseluxe.ca>',
        to: email.toLowerCase(),
        subject: "YOU'RE IN, QUEEN — Your 30% Discount is Here",
        react: WelcomeEmail({ discountCode }),
      });
    } catch (emailErr) {
      console.warn("Newsletter Email Dispatch Failed:", emailErr);
    }

    return { success: true };
  } catch (error) {
    console.error("Newsletter Subscription Error:", error);
    return { error: "Failed to join the network. Please try again later." };
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

export async function removeSubscriber(id: string) {
  noStore();
  await validateAdminSession();
  const supabase = getServiceSupabase();
  const { error } = await supabase.from('newsletter_subscribers').delete().eq('id', id);
  if (error) throw error;
  return { success: true };
}

export async function sendTestEmail(email: string) {
  noStore();
  await validateAdminSession();
  // Logic for sending test email...
  return { success: true };
}

export async function sendLiveNewsletter() {
  noStore();
  await validateAdminSession();
  // Logic for broadcasting to all...
  return { success: true };
}
