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
          // Update the array in the profiles table
          await supabase.from('profiles').update({ wishlist: next }).eq('id', userId);
        }
      },
      syncWithServer: async (supabase, userId) => {
        const { wishlistIds } = get();
        // 1. Fetch from server
        const { data, error } = await supabase
          .from('profiles')
          .select('wishlist')
          .eq('id', userId)
          .single();
          
        if (!error && data?.wishlist) {
          // If local has items, we've already synced them via AuthModal 
          // So we just take the latest from the server
          set({ wishlistIds: data.wishlist });
        }
      },
    }),
    {
      name: 'lamsse_wishlist_storage',
    }
  )
);
