'use server';

import { unstable_noStore as noStore, revalidatePath } from 'next/cache';
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js';

const getAdminSupabase = () => createSupabaseAdmin(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: { persistSession: false },
    global: { fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }) }
  }
);

// Private Helper: Hydrates raw browser File payloads into absolute Supabase CDNs for community bucket
async function uploadCommunityImage(file: File | null) {
  if (!file || file.size === 0) return null;
  const supabase = getAdminSupabase();
  
  // Failsafe: Ensure target bucket 'community_images' physically exists natively before upload
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.find(b => b.name === 'community_images')) {
    await supabase.storage.createBucket('community_images', { public: true });
  }

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  
  // Explicitly setting contentType for videos to ensure proper browser rendering
  const contentType = file.type;
  
  const { error } = await supabase.storage.from('community_images').upload(fileName, file, { 
    cacheControl: '3600', 
    upsert: false,
    contentType: contentType 
  });

  if (error) {
    console.error("Supabase Community Storage Upload Error:", error);
    return null;
  }
  
  const { data } = supabase.storage.from('community_images').getPublicUrl(fileName);
  return data.publicUrl;
}

export async function getCommunityMoments() {
  noStore();
  try {
    const supabase = getAdminSupabase();
    const { data, error } = await supabase
      .from('community_moments')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
       // Table might not exist yet if SQL wasn't run, return empty array gracefully
       console.warn("community_moments table might not exist:", error.message);
       return [];
    }
    return data || [];
  } catch (err) {
    console.error("Fatal Error in getCommunityMoments:", err);
    return [];
  }
}

export async function uploadCommunityMoment(formData: FormData) {
  noStore();
  try {
    const instagram_link = formData.get('instagram_link') as string || null;
    const imageFile = formData.get('image') as File | null;

    if (!imageFile || imageFile.size === 0) {
      return { error: "No image file provided." };
    }

    const image_url = await uploadCommunityImage(imageFile);
    if (!image_url) {
      return { error: "Failed to upload image to storage." };
    }

    const supabase = getAdminSupabase();
    const { error } = await supabase.from('community_moments').insert({
      image_url,
      instagram_link
    });

    if (error) throw new Error(error.message);

    revalidatePath('/admin/community');
    revalidatePath('/community');
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to upload community moment.";
    return { error: message };
  }
}

export async function deleteCommunityMoment(id: string, imageUrl: string) {
  noStore();
  try {
    const supabase = getAdminSupabase();
    
    // 1. Delete from Database
    const { error: dbError } = await supabase.from('community_moments').delete().eq('id', id);
    if (dbError) throw new Error(dbError.message);

    // 2. Delete from Storage (extracting filename from URL)
    const fileName = imageUrl.split('/').pop();
    if (fileName) {
      await supabase.storage.from('community_images').remove([fileName]);
    }

    revalidatePath('/admin/community');
    revalidatePath('/community');
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete community moment.";
    return { error: message };
  }
}

export async function subscribeToNewsletter(formData: FormData) {
  noStore();
  try {
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    const city = formData.get('city') as string;
    
    if (!email) return { error: "Email is required." };

    const supabase = getAdminSupabase();
    const { error } = await supabase.from('newsletter_subscribers').upsert({
      email,
      name,
      city,
      created_at: new Date().toISOString()
    }, { onConflict: 'email' });

    if (error) throw new Error(error.message);

    revalidatePath('/admin/newsletter');
    return { success: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to join waitlist.";
    console.error("Newsletter Subscription Error:", err);
    return { error: message };
  }
}
