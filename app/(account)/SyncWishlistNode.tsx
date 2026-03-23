"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function SyncWishlistNode({ userId }: { userId: string }) {
  useEffect(() => {
    // Read directly from browser storage securely without throwing SSR hydration panics
    const rawLocal = typeof window !== 'undefined' ? localStorage.getItem('lamsseluxe-wishlist') : null;
    const items = rawLocal ? JSON.parse(rawLocal) : [];
    
    // Only fire sync if the user has anonymous wishlist items locally
    if (items.length > 0) {
      const syncToCloud = async () => {
        const supabase = createClient();
        
        // Fetch existing cloud wishlist
        const { data } = await supabase
          .from("profiles")
          .select("wishlist")
          .eq("id", userId)
          .single();

        if (data) {
          const cloudList = data.wishlist || [];
          const mergedList = Array.from(new Set([...cloudList, ...items]));
          
          await supabase
            .from("profiles")
            .update({ wishlist: mergedList })
            .eq("id", userId);
        }
      };
      
      syncToCloud();
    }
  }, [userId]);

  return null;
}
