"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import { ChevronRight, Heart } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/store/useCart";
import toast from "react-hot-toast";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";
import { ProductGallery } from "./ProductGallery";

export function ProductDisplay({ product }: { product: any }) {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "");

  // 1. Resolve active image set based on selected color (JSONB variant data)
  const activeVariant = product.color_images?.[selectedColor] || {};
  
  // 2. High-End Fallback Engine: Specific Variant -> Global Angle -> Main Cover
  // This guarantees the UI never crashes and always shows the most relevant image.
  const main = activeVariant.main || product.image_url || product.image_main;
  const front = activeVariant.front || product.image_front || main;
  const side = activeVariant.side || product.image_side || main;
  const back = activeVariant.back || product.image_back || main;

  // 3. Aggregate unique images into the gallery pipeline
  const imagesToRelyOn = Array.from(new Set([main, front, side, back].filter(Boolean))).length > 0 
    ? Array.from(new Set([main, front, side, back].filter(Boolean)))
    : ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop"];

  const { wishlistIds, toggleWishlist, mounted } = useWishlist();
  const isWished = mounted && wishlistIds.includes(product.id);
  const { addItem } = useCart();

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

        <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">{product.name}</h1>
        <p className="text-2xl font-bold mb-8">${product.price}</p>

        {/* Description removed from here, moved into Accordion below */}

        <div className="flex flex-col space-y-8 mt-auto">
          
          {/* Color Selector */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold uppercase tracking-wider text-sm flex items-center gap-2">
                Color
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
              className="w-16 shrink-0 flex items-center justify-center border border-border rounded-sm hover:border-foreground transition-colors group"
              aria-label="Toggle Wishlist"
            >
              <Heart className={`w-6 h-6 transition-colors ${isWished ? "text-red-500 fill-current" : "text-muted-foreground group-hover:text-foreground"}`} />
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
    </div>
  );
}
