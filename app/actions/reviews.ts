'use server';

import { unstable_noStore as noStore, revalidatePath } from 'next/cache';
import { createClient } from '@supabase/supabase-js';

const getServiceSupabase = () => createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: { persistSession: false },
    global: { fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }) }
  }
);

export async function submitReview(formData: FormData) {
  noStore();
  try {
    const product_id = formData.get('product_id') as string;
    const user_id = formData.get('user_id') as string;
    const user_name = formData.get('user_name') as string;
    const rating = Number(formData.get('rating'));
    const comment = formData.get('comment') as string;
    const fit_rating = formData.get('fit_rating') as string;
    
    const supabase = getServiceSupabase();
    
    const { error } = await supabase.from('reviews').insert({
      product_id,
      user_id,
      user_name,
      rating,
      comment,
      fit_rating,
      is_verified: false // REQUIRES MODERATION BY DEFAULT
    });

    if (error) throw error;

    // We don't revalidatePath here because it's not visible yet
    return { success: true };
  } catch (error) {
    console.error("Review Submission Error:", error);
    return { error: error instanceof Error ? error.message : "Failed to submit review." };
  }
}

export async function getProductReviews(productId: string) {
  noStore();
  try {
    const supabase = getServiceSupabase();
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('product_id', productId)
      .eq('is_verified', true) // ONLY SHOW VERIFIED REVIEWS
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Fetch Reviews Error:", error);
    return [];
  }
}

export async function getPendingReviewsCount() {
    noStore();
    try {
        const supabase = getServiceSupabase();
        const { count, error } = await supabase
            .from('reviews')
            .select('*', { count: 'exact', head: true })
            .eq('is_verified', false);
        
        if (error) throw error;
        return count || 0;
    } catch (err) {
        console.error("Pending count error:", err);
        return 0;
    }
}

export async function updateReviewStatus(id: string, is_verified: boolean) {
    noStore();
    try {
        const supabase = getServiceSupabase();
        const { data: review } = await supabase.from('reviews').select('product_id').eq('id', id).single();
        
        const { error } = await supabase
            .from('reviews')
            .update({ is_verified })
            .eq('id', id);
        
        if (error) throw error;
        
        if (review?.product_id) {
            revalidatePath(`/product/${review.product_id}`);
        }
        revalidatePath('/admin/reviews');
        return { success: true };
    } catch (err) {
        console.error("Status update error:", err);
        return { error: "Failed to update review status" };
    }
}

export async function deleteReview(id: string) {
    noStore();
    try {
        const supabase = getServiceSupabase();
        const { data: review } = await supabase.from('reviews').select('product_id').eq('id', id).single();
        
        const { error } = await supabase.from('reviews').delete().eq('id', id);
        if (error) throw error;

        if (review?.product_id) {
            revalidatePath(`/product/${review.product_id}`);
        }
        revalidatePath('/admin/reviews');
        return { success: true };
    } catch (err) {
        console.error("Delete review error:", err);
        return { error: "Failed to delete review" };
    }
}

export async function getAdminReviews() {
  noStore();
  try {
    const supabase = getServiceSupabase();
    // Fetch user details from profiles and product details from products
    const { data, error } = await supabase
      .from('reviews')
      .select('*, products(name, image_url)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Fetch Admin Reviews Error:", error);
    return [];
  }
}
