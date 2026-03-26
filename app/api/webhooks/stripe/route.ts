import Stripe from 'stripe';
import { headers } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_dummy', { apiVersion: '2026-02-25.clover' });

interface ExtendedStripeSession extends Stripe.Checkout.Session {
  shipping_details?: {
    name: string;
    address: {
      line1: string;
      line2?: string | null;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  } | null;
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature') as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return new Response(`Webhook Error`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as ExtendedStripeSession;
    
    // Core Transaction Data
    const customerEmail = session.customer_details?.email || session.customer_email || 'guest@anonymous.com';
    const amountTotal = (session.amount_total || 0) / 100;
    const userId = session.client_reference_id;

    // Capture Shipping and Contact Details for Fulfillment
    const shippingDetails = session.shipping_details;
    const customerName = session.customer_details?.name || shippingDetails?.name || 'Guest Customer';
    const customerPhone = session.customer_details?.phone || 'N/A';

    const shippingAddress = {
      name: customerName,
      phone: customerPhone,
      line1: shippingDetails?.address?.line1,
      line2: shippingDetails?.address?.line2,
      city: shippingDetails?.address?.city,
      state: shippingDetails?.address?.state,
      postal_code: shippingDetails?.address?.postal_code,
      country: shippingDetails?.address?.country,
    };

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    
    // Create the master Order Row with explicit Shipping injection
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        total_amount: amountTotal,
        status: 'paid',
        customer_email: customerEmail,
        user_id: userId || null,
        shipping_address: shippingAddress
      }).select().single();

    if (error) {
      console.error('Failed to parse order row:', error);
    } else if (order && session.metadata?.cart_payload) {
      try {
        const cartItems = JSON.parse(session.metadata.cart_payload);
        const orderItemsBatch = cartItems.map((item: { id: string; qty: number; price: number; size: string; color: string; }) => ({
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
