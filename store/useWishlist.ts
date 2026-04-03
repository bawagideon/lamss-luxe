import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistState {
  wishlistIds: string[];
  toggleWishlist: (id: string, supabase?: any, userId?: string) => void;
  syncWithServer: (supabase: any, userId: string) => Promise<void>;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlistIds: [],
      toggleWishlist: async (id, supabase, userId) => {
        const { wishlistIds } = get();
        const exists = wishlistIds.includes(id);
        const next = exists
          ? wishlistIds.filter((pId) => pId !== id)
          : [...wishlistIds, id];
        
        set({ wishlistIds: next });
        
        // Dispatch event for any legacy components
        window.dispatchEvent(new Event("wishlist_updated"));

        // PERSISTENCE: If user is logged in, sync to Supabase instantly
        if (supabase && userId) {
          if (exists) {
            await supabase.from('wishlist').delete().eq('user_id', userId).eq('product_id', id);
          } else {
            await supabase.from('wishlist').insert({ user_id: userId, product_id: id });
          }
        }
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
