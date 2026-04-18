import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  isMobileMenuOpen: boolean;
  isSearchOpen: boolean;
  gridColumns: number; // 2, 3, 4
  setMobileMenuOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  setGridColumns: (columns: number) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isMobileMenuOpen: false,
      isSearchOpen: false,
      gridColumns: 2, // Default to 2 for that "Fashion Nova" mobile feel
      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
      setSearchOpen: (open) => set({ isSearchOpen: open }),
      toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
      setGridColumns: (columns) => set({ gridColumns: columns }),
    }),
    {
      name: 'lamss-luxe-ui-store',
      partialize: (state) => ({ gridColumns: state.gridColumns }), // Only persist grid columns
    }
  )
);
