import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  isMobileMenuOpen: boolean;
  gridColumns: number; // 2, 3, 5
  setMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;
  setGridColumns: (columns: number) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isMobileMenuOpen: false,
      gridColumns: 2, // Default to 2 for that "Fashion Nova" mobile feel
      setMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
      toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
      setGridColumns: (columns) => set({ gridColumns: columns }),
    }),
    {
      name: 'lamss-luxe-ui-store',
      partialize: (state) => ({ gridColumns: state.gridColumns }), // Only persist grid columns
    }
  )
);
