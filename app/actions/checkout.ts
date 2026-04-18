'use server';

import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { applyLaunchPromo } from '@/lib/promo';

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

  let promoApplied = false;

  const line_items = await Promise.all(cartItems.map(async (item) => {
    const { finalPrice, applied } = await applyLaunchPromo(userEmail, item.rawPrice);
    if (applied) promoApplied = true;
    
    return {
      price_data: {
        currency: 'cad',
        product_data: { 
          name: `${item.name} - Size: ${item.selectedSize} | Color: ${item.selectedColor}`, 
          images: item.image ? [item.image] : undefined 
        },
        unit_amount: Math.round(finalPrice * 100),
      },
      quantity: item.quantity,
    };
  }));

  // Stringify concise parameters mapping strict limits of Stripe's 500-char metadata boundary
  const orderMetadata = JSON.stringify(cartItems.map(i => ({
    id: i.productId, size: i.selectedSize, color: i.selectedColor, qty: i.quantity, price: i.rawPrice
  }))).substring(0, 500);

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items,
    client_reference_id: user?.id || undefined, // Strict Database Profile Binding
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/shop`,
    billing_address_collection: 'required',
    shipping_address_collection: { 
      allowed_countries: ['US', 'CA', 'GB', 'NG', 'GH'] 
    },
    metadata: { 
        cart_payload: orderMetadata,
        is_launch_promo: promoApplied ? "true" : "false" 
    },
  });

  return session.url!;
}
