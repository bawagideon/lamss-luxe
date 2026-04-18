import { createClient } from "@supabase/supabase-js";

// Launch Date: April 13, 2026
const LAUNCH_DATE = new Date("2026-04-13T00:00:00Z");
const PROMO_DURATION_DAYS = 7;
const DISCOUNT_MULTIPLIER = 0.7; // 30% OFF

/**
 * Checks if the current date is within the first week of launch
 */
export function isLaunchWeek(): boolean {
  const now = new Date();
  const diffTime = now.getTime() - LAUNCH_DATE.getTime();
  const diffDays = diffTime / (1000 * 3600 * 24);
  return diffDays >= 0 && diffDays <= PROMO_DURATION_DAYS;
}

/**
 * Verifies if an email is subscribed to the newsletter
 */
export async function isNewsletterSubscriber(email: string): Promise<boolean> {
  if (!email) return false;
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  // Use a minimal client for quick check
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .select('email')
    .eq('email', email.toLowerCase())
    .single();
    
  return !!data && !error;
}

/**
 * Calculates the final price with launch discount if eligible
 */
export async function applyLaunchPromo(email: string, rawPrice: number): Promise<{ finalPrice: number; applied: boolean }> {
  const launchActive = isLaunchWeek();
  const subscriber = await isNewsletterSubscriber(email);
  
  if (launchActive && subscriber) {
    return {
      finalPrice: Math.round(rawPrice * DISCOUNT_MULTIPLIER),
      applied: true
    };
  }
  
  return {
    finalPrice: rawPrice,
    applied: false
  };
}
