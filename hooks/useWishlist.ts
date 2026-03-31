"use client";

import { useWishlistStore } from "@/store/useWishlist";
import { useEffect, useState } from "react";

/**
 * Bridge hook that maintains the same API as the original but uses the 
 * synchronized Zustand store under the hood.
 */
export function useWishlist() {
  const { wishlistIds, toggleWishlist } = useWishlistStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return { wishlistIds, toggleWishlist, mounted };
}
