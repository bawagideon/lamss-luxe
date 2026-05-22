"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/store/useCart';
import { clearServerCart } from '@/app/actions/checkout';
import { Button } from '@/components/ui/button';
import { Check, ShoppingBag, ArrowRight } from 'lucide-react';

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const clearCart = useCart((state) => state.clearCart);
  useEffect(() => {
    // 1. Clear Zustand Local Storage Cart
    clearCart();

    // 2. Clear Supabase Database Cart (if logged in)
    async function performServerClear() {
      try {
        await clearServerCart();
      } catch (error) {
        console.error("Error clearing server cart:", error);
      }
    }
    performServerClear();
  }, [clearCart]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-white pt-28 pb-20 animate-in fade-in duration-700">
      <div className="max-w-2xl w-full text-center space-y-10 p-12 md:p-16 border-2 border-black rounded-none shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white">
        
        {/* Luxury Monochromatic Success Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-black text-white flex items-center justify-center rounded-none border-2 border-black animate-scale-in">
            <Check className="w-10 h-10 stroke-[3]" />
          </div>
        </div>

        <div className="space-y-4">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Order Confirmed</span>
          <h1 className="text-4xl md:text-5xl font-black text-black uppercase tracking-tight italic">
            Joined The Network
          </h1>
          <p className="text-[11px] text-gray-500 uppercase tracking-widest font-semibold italic">
            Welcome to the Lamssé Network.
          </p>
        </div>

        {searchParams.session_id && (
          <div className="border-y border-zinc-200 py-6 my-4 bg-zinc-50/50">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Order Reference</p>
            <p className="font-mono text-xs font-bold text-zinc-800 break-all select-all selection:bg-black selection:text-white">
              {searchParams.session_id}
            </p>
          </div>
        )}

        <div className="space-y-6 max-w-lg mx-auto">
          <p className="text-zinc-600 text-sm leading-relaxed text-left font-medium">
            Your order is being <strong className="text-black">hand-curated</strong> by our team. A formal payment confirmation has been dispatched to your inbox.
          </p>
          <p className="text-zinc-600 text-sm leading-relaxed text-left font-medium">
            Since we process shipping fulfillment individually, once your luxury pieces are hand-selected, packaged, and handed to our courier partners, you will receive a secondary email containing your <strong className="text-black">manual tracking reference number</strong> within 24–48 hours.
          </p>
        </div>

        <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button 
            variant="outline" 
            size="lg" 
            className="h-14 rounded-none border-2 border-black font-black uppercase tracking-widest text-[11px] hover:bg-black hover:text-white transition-all duration-300" 
            asChild
          >
            <Link href="/shop" className="flex items-center justify-center gap-2">
              <ShoppingBag className="w-4 h-4" /> Continue Shopping
            </Link>
          </Button>

          <Button 
            variant="default" 
            size="lg" 
            className="h-14 rounded-none bg-black text-white hover:bg-zinc-800 font-black uppercase tracking-widest text-[11px] transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.15)]" 
            asChild
          >
            <Link href="/account/orders" className="flex items-center justify-center gap-2">
              View My Orders <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
