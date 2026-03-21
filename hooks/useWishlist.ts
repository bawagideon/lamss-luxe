"use client";

import { useState, useEffect } from "react";

export function useWishlist() {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("lamsse_wishlist");
    if (stored) {
      try {
        setWishlistIds(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse wishlist");
      }
    }
  }, []);

  const toggleWishlist = (id: string) => {
    let newWishlist;
    if (wishlistIds.includes(id)) {
      newWishlist = wishlistIds.filter((item) => item !== id);
    } else {
      newWishlist = [...wishlistIds, id];
    }
    setWishlistIds(newWishlist);
    localStorage.setItem("lamsse_wishlist", JSON.stringify(newWishlist));
    
    // Dispatch custom event to sync parallel tabs or nested components
    window.dispatchEvent(new Event("wishlist_updated"));
  };

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem("lamsse_wishlist");
      if (stored) {
        setWishlistIds(JSON.parse(stored));
      } else {
        setWishlistIds([]);
      }
    };

    window.addEventListener("wishlist_updated", handleStorageChange);
    window.addEventListener("storage", handleStorageChange); // Cover cross-tab sync

    return () => {
      window.removeEventListener("wishlist_updated", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return { wishlistIds, toggleWishlist, mounted };
}
