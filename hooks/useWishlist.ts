"use client";

import { useWishlistStore } from "@/store/useWishlist";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

/**
 * Bridge hook that maintains the same API as the original but uses the 
 * synchronized Zustand store under the hood.
 */
export function useWishlist() {
  const { wishlistIds, toggleWishlist: storeToggle } = useWishlistStore();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    supabase.auth.getUser().then(({ data }) => setUser(data?.user || null));
    
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });
    return () => authListener.subscription.unsubscribe();
  }, [supabase.auth]);

  const toggleWishlist = (id: string) => {
    storeToggle(id, supabase, user?.id);
  };

  return { wishlistIds, toggleWishlist, mounted, user };
}
