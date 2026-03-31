import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string; // composite key: `${productId}-${selectedSize}-${selectedColor}`
  productId: string;
  name: string;
  price: string;
  rawPrice: number;
  image: string;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  maxStock: number;
}

interface CartState {
  cartItems: CartItem[];
  addItem: (item: Omit<CartItem, 'id' | 'quantity'> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
  syncWithServer: (supabase: any, userId: string) => Promise<void>;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      addItem: (item) => {
        const id = `${item.productId}-${item.selectedSize}-${item.selectedColor}`;
        set((state) => {
          const existingItem = state.cartItems.find((i) => i.id === id);
          if (existingItem) {
            return {
              cartItems: state.cartItems.map((i) =>
                i.id === id
                  ? { ...i, quantity: Math.min(i.quantity + (item.quantity || 1), i.maxStock) }
                  : i
              ),
            };
          }
          return {
            cartItems: [...state.cartItems, { ...item, id, quantity: item.quantity || 1 }],
          };
        });
      },
      removeItem: (id) =>
        set((state) => ({
          cartItems: state.cartItems.filter((i) => i.id !== id),
        })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          cartItems: state.cartItems.map((i) =>
            i.id === id ? { ...i, quantity: Math.min(Math.max(1, quantity), i.maxStock) } : i
          ),
        })),
      clearCart: () => set({ cartItems: [] }),
      getCartTotal: () => {
        const { cartItems } = get();
        return cartItems.reduce((total, item) => total + item.rawPrice * item.quantity, 0);
      },
      getItemCount: () => {
        const { cartItems } = get();
        return cartItems.reduce((count, item) => count + item.quantity, 0);
      },
      syncWithServer: async (supabase, userId) => {
        const { cartItems } = get();
        // 1. Fetch current cart from server
        const { data, error } = await supabase
          .from('carts')
          .select('*')
          .eq('user_id', userId);
          
        if (!error && data) {
          const serverItems = data.map((d: any) => ({
            id: d.variant_id,
            productId: d.product_id,
            ...d.metadata,
            quantity: d.quantity
          }));

          if (cartItems.length > 0) {
            // MERGE: If there are local items, we sync them up
            // (Note: AuthModal already calls syncCartOnAuth action, this is secondary sync)
            set({ cartItems: serverItems }); 
          } else {
            // HYDRATE: If local is empty, just take what's on the server
            set({ cartItems: serverItems });
          }
        }
      },
    }),
    {
      name: 'lamsseluxe-cart-storage',
    }
  )
);
