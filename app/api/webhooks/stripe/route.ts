import Stripe from 'stripe';
import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_dummy', { apiVersion: '2023-10-16' as any });

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature') as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return new Response(`Webhook Error`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_details?.email || session.customer_email || 'guest@anonymous.com';
    const amountTotal = session.amount_total ? session.amount_total / 100 : 0;
    
    // Secure identity binding harvested natively from NextJs auth
    const userId = session.client_reference_id;

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    
    // Create the master Order Row
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        total_amount: amountTotal,
        status: 'paid',
        customer_email: customerEmail,
        user_id: userId || null
      }).select().single();

    if (error) {
      console.error('Failed to parse order row:', error);
    } else if (order && session.metadata?.cart_payload) {
      try {
        const cartItems = JSON.parse(session.metadata.cart_payload);
        const orderItemsBatch = cartItems.map((item: any) => ({
          order_id: order.id,
          product_id: item.id,
          quantity: item.qty,
          price: item.price,
          selected_size: item.size,
          selected_color: item.color
        }));

        await supabase.from('order_items').insert(orderItemsBatch);
        console.log(`Checkout ${session.id} organically processed into database. User Bound: ${userId}`);
      } catch (err) {
        console.error("Cart payload hydration failed", err);
      }
    }
  }

  return new Response('OK', { status: 200 });
}
