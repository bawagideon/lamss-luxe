"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { getProductsByIds } from "@/app/actions/products";

export default function WishlistPage() {
  const { wishlistIds, toggleWishlist, mounted } = useWishlist();
  const [wishedProducts, setWishedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mounted) return;
    
    if (wishlistIds.length === 0) {
      setWishedProducts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    getProductsByIds(wishlistIds).then((dbProducts) => {
      if (dbProducts) {
        setWishedProducts(dbProducts.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: `$${p.price}`,
          imageDefault: p.image_url,
          imageLifestyle: p.image_url // Fallback if missing second image
        })));
      }
      setLoading(false);
    });
  }, [wishlistIds, mounted]);

  if (!mounted) return null; // Hydration avoidance

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="mb-12 border-b border-border pb-8 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4 flex items-center justify-center gap-3">
            <Heart className="w-8 h-8 md:w-10 md:h-10 text-red-500 fill-current" />
            Your Wishlist
          </h1>
          <p className="text-muted-foreground text-lg">
            Save your favorite Lamssé Luxe pieces without the hassle of logging in. Your selections are securely saved on your device.
          </p>
        </div>

        {loading ? (
          <div className="w-full text-center py-24 text-muted-foreground font-medium animate-pulse">
            Loading your favorites...
          </div>
        ) : wishedProducts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center max-w-lg mx-auto bg-muted/30 rounded-2xl border border-border/50 p-12"
          >
            <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center shadow-sm mb-6 border border-border">
              <Heart className="w-8 h-8 text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-2xl font-black tracking-tight mb-3">Your wishlist is empty</h3>
            <p className="text-muted-foreground mb-8">
              Looks like you haven&apos;t added anything to your wishlist yet. Discover our latest collections and find your new obsessions.
            </p>
            <Link 
              href="/shop" 
              className="bg-foreground text-background py-4 px-8 font-bold uppercase tracking-widest text-sm hover:opacity-90 transition-opacity rounded-sm shadow-md inline-flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" /> Start Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {wishedProducts.map((product, index) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group cursor-pointer relative"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-muted mb-4 rounded-sm">
                  {/* Default Studio Image */}
                  <Image 
                    src={product.imageDefault} 
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-opacity duration-500 group-hover:opacity-0"
                  />
                  {/* Lifestyle Hover Image */}
                  <Image 
                    src={product.imageLifestyle} 
                    alt={`${product.name} Lifestyle`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 scale-105 group-hover:scale-100 transition-transform"
                  />
                  {/* Quick View Button linking to the PDP */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20">
                    <Link href={`/product/${product.id}`} className="block text-center w-full bg-background/95 backdrop-blur-sm text-foreground py-3 px-4 font-bold text-sm tracking-wide shadow-lg hover:bg-primary hover:text-primary-foreground transition-colors rounded-sm">
                      View Details &mdash; {product.price}
                    </Link>
                  </div>
                  {/* Guest Wishlist Heart Overlay */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(product.id);
                      setWishedProducts(prev => prev.filter(p => p.id !== product.id));
                    }}
                    className="absolute top-4 right-4 z-30 p-2.5 rounded-full backdrop-blur-md bg-background/70 hover:bg-background text-red-500 transition-all shadow-sm group/heart"
                    aria-label="Remove from Wishlist"
                  >
                    <Heart className="w-4 h-4 fill-red-500 transition-colors group-hover/heart:scale-110" />
                  </button>
                </div>
                
                <div className="flex justify-between items-start mt-4">
                  <div>
                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{product.name}</h3>
                  </div>
                  <span className="font-bold">{product.price}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
