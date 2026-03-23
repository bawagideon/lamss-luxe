"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Heart, ShoppingBag } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { getProductsByIds } from "@/app/actions/products";

// Using the exact Wishlist logic constructed during Phase 9
export default function AccountWishlistPage() {
  const { wishlistIds, toggleWishlist, mounted } = useWishlist();
  const [wishedProducts, setWishedProducts] = useState<{ id: string, name: string, price: string, imageDefault: string, imageLifestyle: string }[]>([]);
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
        setWishedProducts(dbProducts.map((p: { id: string, name: string, price: number, image_main?: string, image_url?: string, image_front?: string }) => ({
          id: p.id,
          name: p.name,
          price: `$${p.price}`,
          imageDefault: p.image_main || p.image_url || "",
          imageLifestyle: p.image_front || p.image_url || "" // Fallback if missing second image
        })));
      }
      setLoading(false);
    });
  }, [wishlistIds, mounted]);

  if (!mounted) return null;

  return (
    <div className="w-full max-w-5xl space-y-12">
      <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-8">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">
          NOTIFY ME LIST
        </h1>
      </div>

      {loading ? (
        <div className="w-full text-center py-24 text-gray-400 font-medium animate-pulse">
          Loading your favorites...
        </div>
      ) : wishedProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center max-w-lg mx-auto bg-gray-50 rounded-2xl border border-gray-100 p-12">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-6 border border-gray-200">
            <Heart className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="text-2xl font-black tracking-tight mb-3">Your list is empty</h3>
          <p className="text-gray-500 mb-8 max-w-md">
            Looks like you haven&apos;t added anything to your Notify Me list yet. Discover our latest collections.
          </p>
          <Link 
            href="/shop" 
            className="bg-black text-white py-4 px-8 font-bold uppercase tracking-widest text-sm hover:opacity-90 transition-opacity rounded-full shadow-md inline-flex items-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" /> Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishedProducts.map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="group cursor-pointer relative"
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4 rounded-md">
                <Image 
                  src={product.imageDefault} 
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-opacity duration-500 group-hover:opacity-0"
                />
                <Image 
                  src={product.imageLifestyle} 
                  alt={`${product.name} Lifestyle`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 scale-105 group-hover:scale-100 transition-transform"
                />
                
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20">
                  <Link href={`/product/${product.id}`} className="block text-center w-full bg-white/95 backdrop-blur-sm text-black py-3 px-4 font-bold text-xs tracking-wide shadow-lg hover:bg-black hover:text-white transition-colors rounded-sm">
                    View Details
                  </Link>
                </div>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWishlist(product.id);
                    setWishedProducts(prev => prev.filter(p => p.id !== product.id));
                  }}
                  className="absolute top-3 right-3 z-30 p-2 rounded-full backdrop-blur-md bg-white/70 hover:bg-white text-red-500 transition-all shadow-sm group/heart"
                  aria-label="Remove from Wishlist"
                >
                  <Heart className="w-4 h-4 fill-red-500 transition-colors group-hover/heart:scale-110" />
                </button>
              </div>
              
              <div className="flex justify-between items-start mt-3">
                <h3 className="text-sm font-bold group-hover:text-gray-600 transition-colors">{product.name}</h3>
                <span className="font-bold text-sm">{product.price}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
