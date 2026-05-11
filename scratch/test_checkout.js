require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_dummy', { apiVersion: '2026-02-25.clover' });

async function run() {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'cad',
          product_data: { name: "Test" },
          unit_amount: 1000,
        },
        quantity: 1,
      }],
      success_url: 'http://localhost/success',
      cancel_url: 'http://localhost/cancel',
      billing_address_collection: 'required',
      shipping_address_collection: { 
        allowed_countries: ['US', 'CA', 'GB', 'NG', 'GH'] 
      },
      shipping_options: [
        { shipping_rate: 'shr_1TOJXeQULXOBgYBBlffTbzNb' },
        { shipping_rate: 'shr_1TOJYjQULXOBgYBBM5XGQpVD' },
        { shipping_rate: 'shr_1TOJHUQULXOBgYBB6UgxDC26' },
        { shipping_rate: 'shr_1TOJSjQULXOBgYBBNQuSHjkJ' },
        { shipping_rate: 'shr_1TOJWUQULXOBgYBB6Pyl7u44' },
        { shipping_rate: 'shr_1TOJXHQULXOBgYBB170Egmnp' },
      ],
    });
    console.log("Success:", session.url);
  } catch (err) {
    console.error("Error:", err.message);
  }
}
run();
