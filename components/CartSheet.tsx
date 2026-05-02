"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/useCart";
import { ShoppingBag, Minus, Plus, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { createCheckoutSession } from "@/app/actions/checkout";
import { PriceDisplay } from "@/components/PriceDisplay";

export function CartSheet() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { cartItems, getItemCount, getCartTotal, updateQuantity, removeItem, syncWithServer } = useCart();
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
    
    // Auth Awareness & Syncing
    supabase.auth.getUser().then(({ data }) => {
      const currentUser = data?.user || null;
      setUser(currentUser);
      if (currentUser) {
        syncWithServer(supabase, currentUser.id);
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (currentUser) {
        syncWithServer(supabase, currentUser.id);
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, [supabase, syncWithServer]);

  if (!mounted) {
    // Return a dummy trigger matching the navbar icon size to avoid CLS
    return (
      <button className="hover:opacity-80 transition-opacity relative pointer-events-none" aria-label="Cart">
        <ShoppingBag className="w-6 h-6" />
        <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-md">
          0
        </span>
      </button>
    );
  }

  const count = getItemCount();
  const rawTotal = getCartTotal();
  
  const threshold = 150;
  const awayFromShipping = Math.max(0, threshold - rawTotal);
  const progressPercent = Math.min(100, (rawTotal / threshold) * 100);

  const handleCheckout = async () => {
    try {
      const url = await createCheckoutSession(cartItems);
      if (url) window.location.href = url;
    } catch (err) {
      console.error("Checkout handoff pipeline blocked", err);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="hover:opacity-80 transition-opacity relative" aria-label="Cart">
          <ShoppingBag className="w-6 h-6 stroke-[1.5px]" />
          {count > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-[#cc0000] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black shadow-lg animate-in zoom-in-50 duration-300">
              {count}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col bg-background border-l-0 sm:border-l">
        <SheetHeader className="p-6 border-b border-border sr-only">
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>

        {count === 0 ? (
          // EMPTY STATE (Image 1 Ref)
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-bold tracking-tight">Your bag is empty.</h2>
              <p className="text-sm text-muted-foreground font-medium">
                {user 
                  ? `Go ahead and find something you love, ${user.user_metadata?.first_name || 'Queen'}.`
                  : "Have an account? Sign in to view your bag"
                }
              </p>
            </div>
            <div className={`flex gap-3 w-full max-w-sm ${user ? "justify-center" : ""}`}>
              <Button 
                onClick={() => setIsOpen(false)} 
                asChild 
                className="flex-1 max-w-[240px] rounded-full bg-black text-white hover:bg-black/90 font-bold tracking-wide h-12"
              >
                <Link href="/shop">Start Shopping</Link>
              </Button>
              
              {!user && (
                <Button 
                  onClick={() => {
                    setIsOpen(false);
                    document.dispatchEvent(new CustomEvent('open-auth-modal'));
                  }} 
                  className="flex-1 rounded-full bg-gray-100 text-black hover:bg-gray-200 hover:text-black font-bold tracking-wide border-none h-12"
                  variant="outline"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        ) : (
          // POPULATED STATE (Image 2 Ref)
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Fixed Header */}
            <div className="p-4 sm:p-6 border-b border-border shrink-0 bg-background z-10 space-y-4 shadow-sm relative">
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-4 sm:top-6 left-4 sm:left-6 p-2 -ml-2 -mt-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close cart"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 md:w-6 md:h-6 transition-transform hover:-translate-x-1">
                  <path d="M19 12H5M12 19l-7-7 7-7"/>
                </svg>
              </button>
              
              <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-end w-full pt-1">
                <span className="mr-3">Subtotal:</span>
                <PriceDisplay priceCAD={rawTotal} className="font-black text-foreground text-2xl tracking-tighter italic" />
              </h2>
              <div className="flex gap-3">
                <Button 
                  onClick={() => setIsOpen(false)}
                  variant="outline" 
                  className="flex-1 rounded-full font-black border-2 border-black tracking-wide h-12 hover:bg-black hover:text-white transition-colors"
                >
                  View bag ({count})
                </Button>
                <Button 
                  onClick={handleCheckout}
                  className="flex-1 rounded-full bg-black text-white font-black tracking-wide h-12 hover:bg-black/90"
                >
                  Proceed to Checkout
                </Button>
              </div>

              {/* Free Shipping Progress */}
              <div className="pt-2">
                <p className="text-[13px] font-medium text-center mb-3 text-muted-foreground">
                  {awayFromShipping > 0 
                    ? <>You&apos;re just <span className="font-bold text-foreground">
                        <PriceDisplay priceCAD={awayFromShipping} className="inline-block" />
                      </span> away from Free Shipping!</>
                    : <span className="font-bold text-green-600 tracking-wide uppercase">You qualify for Free Shipping!</span>
                  }
                </p>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-600 rounded-full transition-all duration-700 ease-out" 
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Scrollable Items Payload */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50/50 dark:bg-zinc-950">
              <div className="bg-white dark:bg-zinc-900 border text-[13px] text-center font-medium p-3 hover:border-black dark:hover:border-white transition-colors rounded-lg shadow-sm">
                {user ? (
                   <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-500 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Bag synced to {user.email}</span>
                   </div>
                ) : (
                  <>Don&apos;t lose your bag! Sync it to <button onClick={() => { setIsOpen(false); document.dispatchEvent(new CustomEvent('open-auth-modal')); }} className="underline underline-offset-4 font-bold hover:text-primary transition-colors">your email.</button></>
                )}
              </div>

              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-white dark:bg-zinc-900 border border-border hover:border-black/20 dark:hover:border-white/20 transition-colors rounded-xl shadow-sm">
                  {/* Thumbnail */}
                  <div className="relative w-24 h-[120px] shrink-0 bg-gray-100 rounded-md overflow-hidden">
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      fill 
                      sizes="96px"
                      className="object-cover" 
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="flex flex-col flex-1 py-1">
                    <h3 className="text-[13px] font-bold line-clamp-2 pr-4 leading-tight mb-1">{item.name}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <PriceDisplay priceCAD={item.rawPrice} className="font-black text-primary text-sm" />
                    </div>

                    <div className="flex items-center text-[11px] text-muted-foreground dark:text-zinc-400 bg-gray-50 dark:bg-zinc-800 border border-border w-fit pl-2 max-w-full rounded-[4px] font-bold overflow-hidden mb-auto">
                      <span className="py-1 pr-2 truncate">Size: {item.selectedSize}</span>
                      <div className="h-4 border-l border-border" />
                      <span className="flex items-center gap-1.5 py-1 px-2 shrink-0">Color: <span className="w-2.5 h-2.5 rounded-full ring-1 ring-border/50" style={{ backgroundColor: item.selectedColor }} /></span>
                    </div>

                    <div className="pt-3 flex items-center justify-between mt-2">
                      {/* Quantity Toggler */}
                      <div className="flex items-center border-2 border-border/60 hover:border-black dark:hover:border-white transition-colors rounded-full h-8 overflow-hidden bg-white dark:bg-zinc-900">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-full flex items-center justify-center hover:bg-gray-100 transition-colors text-muted-foreground hover:text-black"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-8 text-center text-[13px] font-black tabular-nums pointer-events-none">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-full flex items-center justify-center hover:bg-gray-100 transition-colors text-muted-foreground hover:text-black"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-[11px] font-bold underline underline-offset-4 text-muted-foreground hover:text-red-600 transition-colors uppercase tracking-wider"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
