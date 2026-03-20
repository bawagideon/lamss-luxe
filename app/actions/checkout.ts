'use server';

import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_dummy', { apiVersion: '2026-02-25.clover' });

export async function createCheckoutSession(formData: FormData) {
  const productId = formData.get('productId') as string;
  const quantity = Number(formData.get('quantity') || 1);

  const supabase = createClient();
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single();

  if (error || !product || product.stock < quantity) {
    console.error("Product DB Validation Failed:", error || "Not found");
    redirect('/collections?error=product_unavailable');
  }

  // Bypass pre-creating the order to prevent RLS and Guest Constraint 500 Blocks on Vercel.
  // We will let the background Stripe Webhook handle the organic order manifestation.

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'cad', // Standardized to CAD per requirements, change to USD if US is primary
          product_data: { name: product.name, images: product.image_url ? [product.image_url] : undefined },
          unit_amount: Math.round(product.price * 100), // Stripe expects amounts in cents
        },
        quantity,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/shop`,
    shipping_address_collection: { allowed_countries: ['CA', 'US'] },
    shipping_options: [
      // IMPORTANT: Add the actual Shipping Rate IDs from your Stripe dashboard here
      // { shipping_rate: 'shr_123CanadaID' },
      // { shipping_rate: 'shr_456UnitedStatesID' },
    ],
    metadata: { productId: product.id },
  });

  redirect(session.url!);
}

// Cleaned up synchronous order logic to prevent strict relational bounds from blocking guest purchases.
