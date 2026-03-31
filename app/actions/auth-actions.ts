"use server";

import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";
import { revalidatePath } from "next/cache";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  redirectTo?: string;
}

export async function signUpUser(data: SignUpData) {
  const supabase = createClient();
  
  // 1. Supabase Signup
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: data.redirectTo || `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/confirm`,
      data: {
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
      },
    },
  });

  if (authError) return { error: authError.message };

  // 2. Send Premium Welcome Email via Resend
  if (authData.user) {
    try {
      await resend.emails.send({
        from: 'Lamssé Luxe <welcome@lamsseluxe.ca>',
        to: data.email,
        subject: 'Welcome to the Vault | Lamssé Luxe',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #000;">
            <div style="background: #000; padding: 40px; text-align: center;">
              <h1 style="color: #fff; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 4px;">LAMSSÉ LUXE</h1>
            </div>
            <div style="padding: 40px; background: #fff; border: 1px solid #eee;">
              <h2 style="font-size: 20px; font-weight: 900; text-transform: uppercase;">Welcome to the Vault, ${data.firstName}!</h2>
              <p style="font-size: 16px; line-height: 1.6; color: #666;">
                You're officially part of the elite. Lamssé Luxe is more than a brand—it's an intention. We're here to ensure you show up with confidence, every single time.
              </p>
              <div style="margin: 40px 0; text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}" style="background: #000; color: #fff; padding: 16px 32px; text-decoration: none; border-radius: 50px; font-weight: bold; text-transform: uppercase; font-size: 14px;">Shop the Latest Drops</a>
              </div>
              <p style="font-size: 12px; color: #999; text-align: center;">
                If you didn't create an account, you can safely ignore this email.
              </p>
            </div>
          </div>
        `
      });
    } catch (e) {
      console.error("Resend welcome email failed:", e);
    }
  }

  return { success: true, user: authData.user };
}

export async function signOutUser() {
  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  return { success: true };
}

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: string;
  rawPrice: number;
  image: string;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  maxStock: number;
}

export async function syncCartOnAuth(items: CartItem[]) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !items.length) return { success: false };

  try {
    for (const item of items) {
      await supabase.rpc('sync_cart_item', {
        p_user_id: user.id,
        p_product_id: item.productId,
        p_variant_id: item.id,
        p_quantity: item.quantity,
        p_metadata: {
          name: item.name,
          price: item.price,
          rawPrice: item.rawPrice,
          image: item.image,
          selectedSize: item.selectedSize,
          selectedColor: item.selectedColor,
          maxStock: item.maxStock
        }
      });
    }

    revalidatePath("/cart");
    return { success: true };
  } catch (err) {
    console.error("Cart sync error:", err);
    return { error: "Failed to sync cart" };
  }
}
export async function syncWishlistOnAuth(productIds: string[]) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !productIds.length) return { success: false };

  try {
    const records = productIds.map(pid => ({
      user_id: user.id,
      product_id: pid
    }));

    // Upsert to ignore duplicates
    const { error } = await supabase
      .from('wishlist')
      .upsert(records, { onConflict: 'user_id,product_id' });

    if (error) throw error;

    revalidatePath("/account/wishlist");
    return { success: true };
  } catch (err) {
    console.error("Wishlist sync error:", err);
    return { error: "Failed to sync wishlist" };
  }
}
