"use client";

import { useState, useEffect } from "react";
import { ChevronRight, Heart } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/store/useCart";
import { useViewedStore } from "@/store/useViewedStore";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import toast from "react-hot-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";
import { ProductGallery } from "./ProductGallery";
import { PriceDisplay } from "./PriceDisplay";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { CompleteTheLook } from "./CompleteTheLook";
import { ProductReviews } from "./ProductReviews";

interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  image_url: string;
  image_main?: string | null;
  image_front?: string | null;
  image_side?: string | null;
  image_back?: string | null;
  colors?: string[];
  color_codes?: string[];
  stock_status?: string;
  stock: number;
  sizes?: string[];
  material?: string;
  occasion?: string;
  size_and_fit?: string;
  fabric_and_care?: string;
  color_images?: Record<string, { main: string | null; front: string | null; side: string | null; back: string | null }>;
  is_new?: boolean;
  promo_banner?: string | null;
  color_badges?: Record<string, string>;
  related_product_ids?: string[];
  is_set_available?: boolean;
}

export function ProductDisplay({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "");

  // Auto-selection engine for single-option products
  useEffect(() => {
    const availableSizes = product.sizes && product.sizes.length > 0 ? product.sizes : ["XS", "S", "M", "L", "XL"];
    const availableColors = product.colors && product.colors.length > 0 ? product.colors : ["Midnight Black", "Taupe"];

    if (availableSizes.length === 1) setSelectedSize(availableSizes[0]);
    if (availableColors.length === 1) setSelectedColor(availableColors[0]);
  }, [product.sizes, product.colors]);

  // 1. Resolve active image set based on selected color (JSONB variant data)
  const activeVariant = product.color_images?.[selectedColor] || { main: null, front: null, side: null, back: null };
  
  // 2. High-End Fallback Engine: Specific Variant -> Global Angle -> Main Cover
  // This guarantees the UI never crashes and always shows the most relevant image.
  const main = activeVariant.main || product.image_url || product.image_main;
  const front = activeVariant.front || product.image_front || main;
  const side = activeVariant.side || product.image_side || main;
  const back = activeVariant.back || product.image_back || main;

  // 3. Aggregate unique images into the gallery pipeline
  const rawImages = [main, front, side, back].filter((img): img is string => typeof img === 'string' && img !== '');
  const imagesToRelyOn = rawImages.length > 0 
    ? Array.from(new Set(rawImages))
    : ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop"];

  const { wishlistIds, toggleWishlist, mounted, user } = useWishlist();
  const isWished = mounted && wishlistIds.includes(product.id);
  const { addItem } = useCart();
  const { recordView } = useViewedStore();
  const supabase = createClient();

  // Sticky CTA Logic
  const [showSticky, setShowSticky] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.onChange((latest) => {
      // Show sticky bar after scrolling past the main buy button (roughly 800px)
      if (latest > 800 && !showSticky) setShowSticky(true);
      if (latest <= 800 && showSticky) setShowSticky(false);
    });
  }, [scrollY, showSticky]);

  // Record view on mount
  useEffect(() => {
    if (mounted && product.id) {
      recordView(product.id, supabase, user?.id);
    }
  }, [mounted, product.id, user?.id, recordView, supabase]);

  const handleAddToBag = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: `$${product.price}`,
      rawPrice: product.price,
      image: imagesToRelyOn[0],
      selectedSize,
      selectedColor,
      quantity: 1,
      maxStock: product.stock
    });
    toast.success("Added to your bag!");
  };

  const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : ["XS", "S", "M", "L", "XL"];
  const colors = product.colors && product.colors.length > 0 ? product.colors : ["Midnight Black", "Taupe"];
  const colorCodes = product.color_codes && product.color_codes.length === colors.length 
    ? product.color_codes 
    : colors.map(() => "#000000");

  return (
    <div className="container mx-auto px-8 sm:px-10 lg:px-16 flex flex-col lg:flex-row gap-12 lg:gap-24">
      
      {/* Left Column: Image Gallery */}
      <ProductGallery images={imagesToRelyOn} />

      {/* Right Column: Details & Add to Cart */}
      <div className="w-full lg:w-2/5 flex flex-col pt-4 lg:pt-10">
        <nav className="flex items-center text-sm text-muted-foreground mb-6 uppercase tracking-wider font-bold">
          <a href="/shop" className="hover:text-foreground transition-colors">Shop</a>
          <ChevronRight className="w-4 h-4 mx-2" />
          <a href={`/shop/${product.category}`} className="hover:text-foreground transition-colors">{product.category}</a>
        </nav>

        {product.promo_banner && (
          <div className="mb-6 p-3 bg-zinc-50 border border-zinc-100 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-900">{product.promo_banner}</p>
          </div>
        )}

        <div className="flex items-center gap-4 mb-4">
           <h1 className="text-3xl md:text-5xl font-black tracking-tight">{product.name}</h1>
           {product.is_new && (
             <Badge className="bg-black text-white rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border-none h-fit">New</Badge>
           )}
        </div>
        
        <PriceDisplay 
          priceCAD={product.price} 
          className="text-2xl font-bold mb-8" 
        />

        {/* Description removed from here, moved into Accordion below */}

        <div className="flex flex-col space-y-8 mt-auto">
          
          {/* Color Selector */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                Color
                {product.color_badges?.[selectedColor] && (
                  <Badge variant="secondary" className="text-[8px] bg-zinc-100 text-zinc-500 rounded-sm font-black px-1.5 py-0 uppercase border-none">
                    {product.color_badges[selectedColor]}
                  </Badge>
                )}
              </span>
              <span className="text-muted-foreground text-sm font-medium">{selectedColor || "Select a color"}</span>
            </div>
            <div className="flex flex-wrap gap-4">
              {colors.map((c: string, idx: number) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedColor(c)}
                  className={`relative w-12 h-12 rounded-full border-2 shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary ${
                    selectedColor === c 
                      ? "border-foreground scale-110 shadow-md ring-2 ring-offset-2 ring-foreground" 
                      : "border-border/50 hover:scale-105 hover:border-muted-foreground"
                  }`}
                  style={{ backgroundColor: colorCodes[idx] }}
                  title={c}
                  aria-label={`Select color ${c}`}
                >
                  <span className="sr-only">{c}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold uppercase tracking-wider text-sm">Size</span>
              <button type="button" className="text-muted-foreground text-sm hover:text-foreground underline underline-offset-4">Size Guide</button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {sizes.map((s: string) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedSize(s)}
                  className={`py-3 border rounded-sm font-bold text-sm transition-colors ${
                    selectedSize === s 
                      ? "border-primary bg-primary text-primary-foreground" 
                      : "border-border bg-background hover:border-primary text-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Legacy Specs Removed, replaced by Accordion below */}

          <div className="flex gap-4 mt-8">
            <button 
              type="button" 
              onClick={handleAddToBag}
              disabled={!selectedSize || !selectedColor || product.stock <= 0}
              className="flex-1 bg-foreground text-background py-5 px-6 font-black text-lg tracking-widest uppercase hover:opacity-90 transition-opacity rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {product.stock <= 0 ? "Out of Stock" : "Add to Bag"}
            </button>
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className={`w-16 shrink-0 flex items-center justify-center border rounded-sm transition-all group ${isWished ? 'bg-black border-black' : 'border-border hover:border-foreground'}`}
              aria-label="Toggle Wishlist"
            >
              <Heart className={`w-6 h-6 transition-colors ${isWished ? "text-white fill-current" : "text-muted-foreground group-hover:text-foreground"}`} />
            </button>
          </div>

          <Accordion type="single" collapsible className="w-full mt-10">
            {product.description && (
              <AccordionItem value="description" className="border-t border-border">
                <AccordionTrigger className="text-sm tracking-widest uppercase py-6 hover:no-underline">Description</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-[15px] leading-relaxed pb-8">
                  {product.description.split('\n').filter((l: string) => l.trim()).length > 1 ? (
                    <ul className="list-disc pl-5 space-y-2">
                       {product.description.split('\n').filter((l: string) => l.trim()).map((line: string, i: number) => (
                         <li key={i}>{line.trim()}</li>
                       ))}
                    </ul>
                  ) : (
                    <p>{product.description}</p>
                  )}
                </AccordionContent>
              </AccordionItem>
            )}

            {product.size_and_fit && (
              <AccordionItem value="size-fit">
                <AccordionTrigger className="text-sm tracking-widest uppercase py-6 hover:no-underline">Size & Fit</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-[15px] leading-relaxed pb-8">
                  {product.size_and_fit.split('\n').filter((l: string) => l.trim()).length > 1 ? (
                    <ul className="list-disc pl-5 space-y-2">
                       {product.size_and_fit.split('\n').filter((l: string) => l.trim()).map((line: string, i: number) => (
                         <li key={i}>{line.trim()}</li>
                       ))}
                    </ul>
                  ) : (
                    <p>{product.size_and_fit}</p>
                  )}
                </AccordionContent>
              </AccordionItem>
            )}

            {(product.material || product.fabric_and_care) && (
              <AccordionItem value="fabric">
                <AccordionTrigger className="text-sm tracking-widest uppercase py-6 hover:no-underline">About The Fabric</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-[15px] leading-relaxed pb-8">
                  <div className="space-y-4">
                    {product.material && (
                      <div>
                        <span className="block font-bold text-foreground text-xs uppercase tracking-tighter mb-1">Material Composition</span>
                        <p>{product.material}</p>
                      </div>
                    )}
                    {product.fabric_and_care && (
                      <div>
                        <span className="block font-bold text-foreground text-xs uppercase tracking-tighter mb-1">Care Instructions</span>
                        <p>{product.fabric_and_care}</p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            <AccordionItem value="shipping" className="border-b border-border">
              <AccordionTrigger className="text-sm tracking-widest uppercase py-6 hover:no-underline">Shipping & Returns</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-[15px] leading-relaxed pb-8">
                <p className="mb-4">Standard shipping takes 3-5 business days. Express shipping options available at checkout.</p>
                <p className="mb-6">Returns accepted within 14 days of delivery. Items must be in original condition with tags attached.</p>
                <Link href="/shipping-returns" className="text-foreground font-bold underline underline-offset-4 hover:opacity-70 transition-opacity">View Full Policy</Link>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          
          <div className="border-t border-border pt-6 mt-8">
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
              {product.stock > 0 ? "In Stock - Ready to Ship" : "Currently Unavailable"}
            </div>
            <p className="text-sm text-muted-foreground">Free international shipping on orders over $150.</p>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar (Conversion Funnel) */}
      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-black/90 backdrop-blur-xl border-t border-border shadow-2xl px-6 py-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="hidden sm:block w-12 h-16 relative bg-muted rounded overflow-hidden">
                <Image src={main || imagesToRelyOn[0]} alt={product.name} fill className="object-cover" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-[13px] font-black uppercase tracking-tight truncate max-w-[150px]">{product.name}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                   <PriceDisplay priceCAD={product.price} className="text-sm font-bold" />
                   <span className="text-[10px] text-muted-foreground uppercase">{selectedColor} / {selectedSize || 'Select Size'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleAddToBag}
                disabled={!selectedSize || !selectedColor || product.stock <= 0}
                className="bg-black text-white px-8 py-3.5 font-black text-xs uppercase tracking-[0.2em] hover:bg-zinc-800 transition-colors disabled:opacity-50"
              >
                Snap It Up
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`p-3 border rounded-sm transition-all ${isWished ? 'bg-black border-black text-white' : 'border-border'}`}
              >
                <Heart className={`w-4 h-4 ${isWished ? 'fill-current' : ''}`} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CompleteTheLook relatedIds={product.related_product_ids || []} />
      
      <ProductReviews 
        productId={product.id} 
        userId={user?.id} 
        userName={user?.user_metadata?.full_name || user?.email?.split('@')[0]} 
      />
    </div>
  );
}
