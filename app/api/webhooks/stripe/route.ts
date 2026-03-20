import Stripe from 'stripe';
import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_dummy', { apiVersion: '2026-02-25.clover' });

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature') as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const error = err as Error;
    console.error('Webhook signature verification failed:', error.message);
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const productId = session.metadata?.productId;
    const customerEmail = session.customer_details?.email || session.customer_email || 'guest@anonymous.com';
    const amountTotal = session.amount_total ? session.amount_total / 100 : 0;

    if (productId) {
      // Intentionally bypassed schema checks using Service Role if user_id binds are strict
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      );
      
      const { error } = await supabase
        .from('orders')
        .insert({
          total_amount: amountTotal,
          status: 'paid',
          customer_email: customerEmail
        });

      if (error) {
        console.error('Failed to create background order fulfillment:', error);
      } else {
        console.log(`Checkout ${session.id} organically processed into database.`);
      }
    }
  }

  return new Response('OK', { status: 200 });
}
