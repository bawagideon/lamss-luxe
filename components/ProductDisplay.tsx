"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight, Heart } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { useCart } from "@/store/useCart";
import toast from "react-hot-toast";

export function ProductDisplay({ product }: { product: any }) {
  // Aggregate images into a clean array, filtering out nulls
  const allImages = [
    product.image_url,
    product.image_front,
    product.image_side,
    product.image_back
  ].filter(Boolean);

  const imagesToRelyOn = allImages.length > 0 
    ? allImages 
    : ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop"];

  const [mainImage, setMainImage] = useState(imagesToRelyOn[0]);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const { wishlistIds, toggleWishlist, mounted } = useWishlist();
  const isWished = mounted && wishlistIds.includes(product.id);
  const { addItem } = useCart();

  const handleAddToBag = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: `$${product.price}`,
      rawPrice: product.price,
      image: mainImage,
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
    <div className="container mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-12 lg:gap-24">
      
      {/* Left Column: Image Gallery */}
      <div className="w-full lg:w-3/5 flex flex-col-reverse md:flex-row gap-4">
        {/* Thumbnails (Vertical on desktop, horizontal on mobile) */}
        <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-x-visible md:w-24 shrink-0">
          {imagesToRelyOn.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setMainImage(img)}
              className={`relative aspect-[3/4] w-20 md:w-full overflow-hidden rounded-md border-2 transition-all duration-200 shrink-0 ${
                mainImage === img ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image 
                src={img}
                alt={`${product.name} angle ${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>

        {/* Main Image */}
        <motion.div 
          key={mainImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative aspect-[3/4] w-full flex-grow bg-secondary rounded-lg overflow-hidden"
        >
          <Image 
            src={mainImage}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover"
          />
        </motion.div>
      </div>

      {/* Right Column: Details & Add to Cart */}
      <div className="w-full lg:w-2/5 flex flex-col pt-4 lg:pt-10">
        <nav className="flex items-center text-sm text-muted-foreground mb-6 uppercase tracking-wider font-bold">
          <a href="/shop" className="hover:text-foreground transition-colors">Shop</a>
          <ChevronRight className="w-4 h-4 mx-2" />
          <a href={`/shop/${product.category}`} className="hover:text-foreground transition-colors">{product.category}</a>
        </nav>

        <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">{product.name}</h1>
        <p className="text-2xl font-bold mb-8">${product.price}</p>

        {product.description && (
          <p className="text-muted-foreground leading-relaxed mb-10 text-lg">
            {product.description}
          </p>
        )}

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

          {/* Product Specifications */}
          <div className="flex flex-col gap-4 py-6 border-y border-border">
            {product.material && (
              <div className="flex flex-col">
                <span className="text-xs uppercase font-extrabold text-muted-foreground tracking-widest mb-1">Material & Care</span>
                <span className="text-base font-semibold text-foreground">{product.material}</span>
              </div>
            )}
            {product.occasion && (
              <div className="flex flex-col">
                <span className="text-xs uppercase font-extrabold text-muted-foreground tracking-widest mb-1">Occasion / Fit</span>
                <span className="text-base font-semibold text-foreground">{product.occasion}</span>
              </div>
            )}
          </div>

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
