'use server';

import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { checkLaunchPromoEligibility } from '@/lib/promo';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_dummy', { apiVersion: '2026-02-25.clover' });

export type CheckoutCartItem = {
  productId: string;
  name: string;
  rawPrice: number;
  image: string;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
};

export async function createCheckoutSession(cartItems: CheckoutCartItem[]) {
  if (!cartItems || cartItems.length === 0) {
    redirect('/shop');
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const userEmail = user?.email || "";

  const cartTotal = cartItems.reduce((acc, item) => acc + (item.rawPrice * item.quantity), 0);
  const isPromoEligible = await checkLaunchPromoEligibility(userEmail, cartTotal);
  const promoApplied = isPromoEligible;

  const line_items = cartItems.map((item) => {
    return {
      price_data: {
        currency: 'cad',
        product_data: { 
          name: `${item.name} - Size: ${item.selectedSize} | Color: ${item.selectedColor}`, 
          images: item.image ? [item.image] : undefined 
        },
        unit_amount: Math.round(item.rawPrice * 100),
      },
      quantity: item.quantity,
    };
  });

  let discounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined = undefined;
  if (isPromoEligible) {
    // Find or create a Stripe coupon for the 20% off total
    const coupons = await stripe.coupons.list({ limit: 100 });
    let coupon = coupons.data.find(c => c.name === 'Launch Promo 20% OFF' && c.percent_off === 20 && c.valid);
    
    if (!coupon) {
      coupon = await stripe.coupons.create({
        percent_off: 20,
        duration: 'once',
        name: 'Launch Promo 20% OFF',
      });
    }
    discounts = [{ coupon: coupon.id }];
  }

  // Stringify concise parameters mapping strict limits of Stripe's 500-char metadata boundary
  const orderMetadata = JSON.stringify(cartItems.map(i => ({
    id: i.productId, size: i.selectedSize, color: i.selectedColor, qty: i.quantity, price: i.rawPrice
  }))).substring(0, 500);

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items,
    discounts,
    client_reference_id: user?.id || undefined, // Strict Database Profile Binding
    success_url: `${process.env.NODE_ENV === 'production' ? 'https://www.lamsseluxe.ca' : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NODE_ENV === 'production' ? 'https://www.lamsseluxe.ca' : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')}/shop`,
    billing_address_collection: 'required',
    shipping_address_collection: { 
      allowed_countries: ['US', 'CA', 'GB', 'NG', 'GH'] 
    },
    shipping_options: [
      { 
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: cartTotal >= 200 ? 0 : 3000, currency: 'cad' },
          display_name: cartTotal >= 200 ? 'Free Standard Shipping (Canada)' : 'Canada Standard',
          delivery_estimate: { minimum: { unit: 'business_day', value: 3 }, maximum: { unit: 'business_day', value: 7 } },
        }
      },
      { 
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 4500, currency: 'cad' },
          display_name: 'Canada Express',
          delivery_estimate: { minimum: { unit: 'business_day', value: 1 }, maximum: { unit: 'business_day', value: 3 } },
        }
      },
      { 
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: cartTotal >= 200 ? 0 : 3000, currency: 'cad' },
          display_name: cartTotal >= 200 ? 'Free Standard Shipping (US)' : 'US Standard',
          delivery_estimate: { minimum: { unit: 'business_day', value: 5 }, maximum: { unit: 'business_day', value: 10 } },
        }
      },
      { 
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 5000, currency: 'cad' },
          display_name: 'US Express',
          delivery_estimate: { minimum: { unit: 'business_day', value: 2 }, maximum: { unit: 'business_day', value: 5 } },
        }
      },
      { 
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: { amount: 1500, currency: 'cad' },
          display_name: 'Local Delivery (St. John\'s)',
          delivery_estimate: { minimum: { unit: 'business_day', value: 1 }, maximum: { unit: 'business_day', value: 2 } },
        }
      },
    ],
    metadata: { 
        cart_payload: orderMetadata,
        is_launch_promo: promoApplied ? "true" : "false" 
    },
  });

  return session.url!;
}

export async function clearServerCart() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { error } = await supabase.from('carts').delete().eq('user_id', user.id);
    if (error) {
      console.error("Failed to clear server-side cart:", error);
      return { error: error.message };
    }
  }
  return { success: true };
}
