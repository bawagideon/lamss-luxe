"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getActiveProducts } from "@/app/actions/products";
import { Heart } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";

import { useCart } from "@/store/useCart";
import { toast } from "react-hot-toast";

interface ShopProduct {
  id: string;
  name: string;
  price: string;
  rawPrice: number;
  imageDefault: string;
  imageLifestyle: string;
  sizes: string[];
}

export function ShopGrid({ initialProducts }: { initialProducts?: { id: string; name: string; price: number; image_url: string; sizes?: string[] }[] }) {
  const [liveProducts, setLiveProducts] = useState<ShopProduct[]>([]);
  const { wishlistIds, toggleWishlist, mounted } = useWishlist();
  const { addItem } = useCart();

  useEffect(() => {
    if (initialProducts) {
      setLiveProducts(initialProducts.map((p) => ({
        id: p.id,
        name: p.name,
        price: `$${p.price}`,
        rawPrice: p.price,
        imageDefault: p.image_url,
        imageLifestyle: p.image_url,
        sizes: p.sizes || ['XS', 'S', 'M', 'L', 'XL']
      })));
      return;
    }

    getActiveProducts().then((dbProducts) => {
      if (dbProducts && dbProducts.length > 0) {
        setLiveProducts(dbProducts.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: `$${p.price}`,
          rawPrice: p.price,
          imageDefault: p.image_url,
          imageLifestyle: p.image_url,
          sizes: p.sizes || ['XS', 'S', 'M', 'L', 'XL']
        })));
      }
    });
  }, [initialProducts]);

  const handleQuickAdd = (product: ShopProduct, size: string) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      rawPrice: product.rawPrice,
      image: product.imageDefault,
      selectedSize: size,
      selectedColor: "Default", // Default color for quick-add
      maxStock: 99
    });
    toast.success(`Added ${product.name} (Size: ${size}) to your bag!`);
  };

  return (
    <section className="py-24 bg-background" id="shop">
      <div className="container mx-auto px-8 sm:px-10 lg:px-16">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Shop The Look</h2>
            <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
              Curated elegance for the modern woman.<br/>
              Effortless by day. Unforgettable by night.
            </p>
          </div>
        </div>

        {liveProducts.length === 0 ? (
          <div className="w-full text-center py-24 text-gray-500 font-medium">
             No active catalog items available yet in the database.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {liveProducts.map((product, index) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                className="group relative"
              >
                {/* Product Image Area */}
                <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100 rounded-sm shadow-sm">
                  {/* Image Link Overlay (Click anywhere on image for PDP) */}
                  <Link href={`/product/${product.id}`} className="absolute inset-0 z-10">
                    <span className="sr-only">View {product.name}</span>
                  </Link>

                  {/* Main Product Images */}
                  <Image 
                    src={product.imageDefault} 
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-opacity duration-700 group-hover:opacity-0"
                  />
                  <Image 
                    src={product.imageLifestyle} 
                    alt={`${product.name} Lifestyle`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 scale-105 group-hover:scale-100 transition-transform"
                  />

                  {/* QUICK ADD OVERLAY (Fashion Nova Style) */}
                  <div className="absolute bottom-0 left-0 right-0 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-center opacity-70">Quick Add to Bag</p>
                    <div className="grid grid-cols-4 gap-2">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleQuickAdd(product, size);
                          }}
                          className="h-10 text-[11px] font-bold border border-border hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all rounded-sm flex items-center justify-center"
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Wishlist Overlay */}
                  {mounted && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-white/80 dark:bg-black/80 hover:bg-white dark:hover:bg-black text-muted-foreground hover:text-red-500 transition-all shadow-sm"
                    >
                      <Heart className={`w-4 h-4 ${wishlistIds.includes(product.id) ? "fill-red-500 text-red-500" : ""}`} />
                    </button>
                  )}
                </div>
                
                {/* Product Info (Click anywhere for PDP) */}
                <Link href={`/product/${product.id}`} className="block mt-5 space-y-1">
                  <h3 className="text-sm font-bold tracking-tight group-hover:underline underline-offset-4">{product.name}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-black">{product.price}</span>
                    <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-widest">3 Colors Available</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
