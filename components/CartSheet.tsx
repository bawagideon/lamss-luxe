"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/useCart";
import { ShoppingBag, Minus, Plus } from "lucide-react";
import { createCheckoutSession } from "@/app/actions/checkout";

export function CartSheet() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { cartItems, getItemCount, getCartTotal, updateQuantity, removeItem } = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);

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
  const formatPrice = (price: number) => `$${price.toFixed(2)}`;
  
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
          <ShoppingBag className="w-6 h-6" />
          {count > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-md animate-in zoom-in-50 duration-300">
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
              <p className="text-sm text-muted-foreground font-medium">Have an account? Sign in to view your bag</p>
            </div>
            <div className="flex gap-3 w-full max-w-sm">
              <Button 
                onClick={() => setIsOpen(false)} 
                asChild 
                className="flex-1 rounded-full bg-black text-white hover:bg-black/90 font-bold tracking-wide h-12"
              >
                <Link href="/shop">Start Shopping</Link>
              </Button>
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
            </div>
          </div>
        ) : (
          // POPULATED STATE (Image 2 Ref)
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Fixed Header */}
            <div className="p-6 border-b border-border shrink-0 bg-background z-10 space-y-4 shadow-sm">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                Subtotal: <span className="font-black text-foreground text-xl tracking-tight">{formatPrice(rawTotal)}</span>
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
                    ? <>You&apos;re just <span className="font-bold text-foreground">{formatPrice(awayFromShipping)}</span> away from Free Shipping!</>
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
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50/50">
              <div className="bg-white border text-[13px] text-center font-medium p-3 hover:border-black transition-colors rounded-lg shadow-sm">
                Don&apos;t lose your bag! Sync it to <button onClick={() => { setIsOpen(false); document.dispatchEvent(new CustomEvent('open-auth-modal')); }} className="underline underline-offset-4 font-bold hover:text-primary transition-colors">your email.</button>
              </div>

              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-white border border-border hover:border-black/20 transition-colors rounded-xl shadow-sm">
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
                      <span className="font-black text-red-600 text-sm">{item.price}</span>
                    </div>

                    <div className="flex items-center text-[11px] text-muted-foreground bg-gray-50 border border-border w-fit pl-2 max-w-full rounded-[4px] font-bold overflow-hidden mb-auto">
                      <span className="py-1 pr-2 truncate">Size: {item.selectedSize}</span>
                      <div className="h-4 border-l border-border" />
                      <span className="flex items-center gap-1.5 py-1 px-2 shrink-0">Color: <span className="w-2.5 h-2.5 rounded-full ring-1 ring-border/50" style={{ backgroundColor: item.selectedColor !== 'Unknown' ? item.selectedColor : '#000000' }} /></span>
                    </div>

                    <div className="pt-3 flex items-center justify-between mt-2">
                      {/* Quantity Toggler */}
                      <div className="flex items-center border-2 border-border/60 hover:border-black transition-colors rounded-full h-8 overflow-hidden bg-white">
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
