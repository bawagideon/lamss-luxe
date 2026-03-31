import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  wishlistIds: string[];
  toggleWishlist: (id: string) => void;
  syncWithServer: (supabase: any, userId: string) => Promise<void>;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlistIds: [],
      toggleWishlist: (id) => {
        const { wishlistIds } = get();
        const exists = wishlistIds.includes(id);
        const next = exists
          ? wishlistIds.filter((pId) => pId !== id)
          : [...wishlistIds, id];
        
        set({ wishlistIds: next });
        
        // Dispatch event for any non-zustand components
        window.dispatchEvent(new Event("wishlist_updated"));
      },
      syncWithServer: async (supabase, userId) => {
        const { wishlistIds } = get();
        // 1. Fetch from server
        const { data, error } = await supabase
          .from('wishlist')
          .select('product_id')
          .eq('user_id', userId);
          
        if (!error && data) {
          const serverIds = data.map((d: any) => d.product_id);
          // If local has items, we've already synced them via AuthModal 
          // So we just take the latest from the server
          set({ wishlistIds: serverIds });
        }
      },
    }),
    {
      name: 'lamsse_wishlist_storage',
    }
  )
);
