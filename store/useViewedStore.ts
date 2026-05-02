"use client";

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ViewedState {
  viewedIds: string[];
  setViewedIds: (ids: string[]) => void;
  recordView: (id: string, supabase?: any, userId?: string) => void;
  syncWithServer: (supabase: any, userId: string) => Promise<void>;
}

export const useViewedStore = create<ViewedState>()(
  persist(
    (set, get) => ({
      viewedIds: [],
      setViewedIds: (ids) => set({ viewedIds: ids }),
      recordView: async (id, supabase, userId) => {
        const { viewedIds } = get();
        
        // Remove existing to bring to front
        const filtered = viewedIds.filter((pId) => pId !== id);
        const next = [id, ...filtered].slice(0, 10); // Keep last 10
        
        set({ viewedIds: next });
        
        // If logged in, persist to Supabase JSONB column in profiles
        if (supabase && userId) {
          try {
             await supabase
              .from('profiles')
              .update({ viewed_ids: next })
              .eq('id', userId);
          } catch (err) {
            console.error("Failed to sync viewed history to cloud:", err);
          }
        }
      },
      syncWithServer: async (supabase, userId) => {
        const { data, error } = await supabase
          .from('profiles')
          .select('viewed_ids')
          .eq('id', userId)
          .single();
          
        if (!error && data?.viewed_ids) {
          set({ viewedIds: data.viewed_ids });
        }
      },
    }),
    {
      name: 'lamsse_viewed_storage',
    }
  )
);
