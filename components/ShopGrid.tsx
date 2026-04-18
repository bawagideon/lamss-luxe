"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getActiveProducts } from "@/app/actions/products";
import { Heart, ShoppingBag, Plus } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";
import { useUIStore } from "@/store/useUIStore";
import { useCart } from "@/store/useCart";
import { toast } from "react-hot-toast";
import { PriceDisplay } from "@/components/PriceDisplay";

interface RawProduct {
  id: string;
  name: string;
  price: number;
  image_url: string;
  sizes?: string[];
  colors?: string[];
  color_codes?: string[];
  marketing_message?: string;
}

interface ShopProduct {
  id: string;
  name: string;
  price: string;
  rawPrice: number;
  imageDefault: string;
  imageLifestyle: string;
  sizes: string[];
  colors: string[];
  marketingMessage?: string;
}

export function ShopGrid({ initialProducts }: { initialProducts?: RawProduct[] }) {
  const [liveProducts, setLiveProducts] = useState<ShopProduct[]>([]);
  const { wishlistIds, toggleWishlist, mounted } = useWishlist();
  const { addItem } = useCart();
  const { gridColumns } = useUIStore();

  useEffect(() => {
    const mapProduct = (p: RawProduct) => ({
      id: p.id,
      name: p.name,
      price: `$${p.price.toFixed(2)}`,
      rawPrice: p.price,
      imageDefault: p.image_url,
      imageLifestyle: p.image_url,
      sizes: p.sizes && p.sizes.length > 0 ? p.sizes : ['XS', 'S', 'M', 'L', 'XL'],
      // Prioritize color_codes for the visual swatches per user request
      colors: p.color_codes && p.color_codes.length > 0 ? p.color_codes : (p.colors && p.colors.length > 0 ? p.colors : []),
      marketingMessage: p.marketing_message
    });

    if (initialProducts) {
      setLiveProducts(initialProducts.map(mapProduct));
      return;
    }

    getActiveProducts().then((dbProducts) => {
      if (dbProducts && dbProducts.length > 0) {
        setLiveProducts((dbProducts as unknown as RawProduct[]).map(mapProduct));
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
      selectedColor: product.colors[0] || "#000000",
      maxStock: 99
    });
    toast.success(`Snatched ${product.name} (${size})!`, {
      style: {
        background: '#000',
        color: '#fff',
        borderRadius: '0px',
        fontSize: '10px',
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: '0.15em'
      }
    });
  };

  // Dynamic Grid Classes
  const getGridColsClass = () => {
    // Dynamic mobile columns (2, 3, 4) based on state, fixed for desktop
    const mobileCols = gridColumns === 3 ? "grid-cols-3" : gridColumns === 4 ? "grid-cols-4" : "grid-cols-2";
    return `${mobileCols} lg:grid-cols-4 2xl:grid-cols-6`;
  };

  return (
    <section className="pb-16 pt-0 bg-background min-h-screen" id="shop">
      <div className="w-full px-1 md:px-2">
        <div className="flex flex-col md:flex-row justify-between items-end mb-4 px-4 pt-4">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase">Latest Drops</h2>
            <p className="text-black dark:text-white text-[11px] md:text-sm font-bold uppercase tracking-[0.3em] opacity-80 border-l-4 border-primary pl-4 py-1">
              Curated for the bold.
            </p>
          </div>
        </div>

        {liveProducts.length === 0 ? (
          <div className="w-full text-center py-24 text-gray-400 font-black tracking-widest uppercase text-[10px]">
             Vaulting New Arrivals...
          </div>
        ) : (
          <motion.div 
            layout
            className={`grid ${getGridColsClass()} gap-x-1 gap-y-12 transition-all duration-700 ease-[0.23,1,0.32,1]`}
          >
            <AnimatePresence mode="popLayout">
              {liveProducts.map((product, index) => (
                <motion.div 
                  layout
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.02 }}
                  className="group relative flex flex-col"
                >
                  {/* Visual Stage (Massive & Taller) */}
                  <div className="relative aspect-[3/5] md:aspect-[0.65] overflow-hidden bg-slate-50 dark:bg-zinc-900/40 shadow-sm border border-border/10">
                    <Link href={`/product/${product.id}`} className="absolute inset-0 z-10">
                      <span className="sr-only">View Details</span>
                    </Link>

                    {/* Smooth Image Switcher */}
                    <Image 
                      src={product.imageDefault} 
                      alt={product.name}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover transition-opacity duration-700 group-hover:opacity-0"
                      priority={index < 8}
                    />
                    <Image 
                      src={product.imageLifestyle} 
                      alt={`${product.name} Hover`}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100 scale-105 group-hover:scale-100"
                    />

                    {/* DESKTOP QUICK ADD (Fashion Nova Overlay) */}
                    <div className="absolute bottom-0 left-0 right-0 z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out bg-white dark:bg-zinc-950 p-4 hidden md:block border-t border-border shadow-2xl">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-center text-black dark:text-zinc-50">Add to Bag</p>
                      <div className="grid grid-cols-5 gap-1">
                        {product.sizes.slice(0, 5).map((size) => (
                          <button
                            key={size}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleQuickAdd(product, size);
                            }}
                            className="h-8 text-[9px] font-black border border-border/80 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all rounded-[1px] flex items-center justify-center uppercase tracking-tighter shadow-sm"
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* MOBILE QUICK ADD (Fashion Nova FAB Style) */}
                    <div className="md:hidden absolute bottom-3 right-3 z-20">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          handleQuickAdd(product, product.sizes[0] || 'M');
                        }}
                        className="w-9 h-9 bg-white/95 dark:bg-black/95 rounded-full flex items-center justify-center shadow-lg border border-border/20 active:scale-90 transition-transform"
                      >
                        <ShoppingBag className="w-4 h-4 text-black dark:text-white" />
                        <div className="absolute -top-1 -right-1">
                           <div className="bg-primary text-[8px] font-black text-white w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-black">
                             <Plus className="w-2.5 h-2.5" />
                           </div>
                        </div>
                      </button>
                    </div>

                    {/* High Precision Wishlist Button */}
                    {mounted && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleWishlist(product.id);
                        }}
                        className="absolute top-3 right-3 z-30 p-2.5 rounded-full bg-white/60 dark:bg-black/40 backdrop-blur-md shadow-sm transition-all hover:scale-110 active:scale-95 group/heart"
                      >
                        <Heart className={`w-3.5 h-3.5 transition-colors ${wishlistIds.includes(product.id) ? "fill-red-500 text-red-500" : "text-zinc-600 dark:text-zinc-400 group-hover/heart:text-zinc-800"}`} />
                      </button>
                    )}
                  </div>
                  
                  {/* Detailed Information Layer */}
                  <div className="mt-4 flex flex-col space-y-1 px-1">
                    <Link href={`/product/${product.id}`} className="group/link block">
                      <div className="flex justify-between items-start mb-0.5">
                        <h3 className="text-[13px] md:text-[15px] font-black tracking-tight uppercase line-clamp-1 text-black dark:text-white group-hover/link:underline underline-offset-8">{product.name}</h3>
                        <PriceDisplay 
                          priceCAD={product.rawPrice} 
                          className="text-[15px] md:text-[17px] font-black tracking-tighter text-black dark:text-zinc-50" 
                        />
                      </div>
                      
                      {/* Dynamic Product Sub-Message (Marketing Layer) */}
                      {product.marketingMessage && (
                        <p className="text-[10px] md:text-[11px] font-black text-red-600 dark:text-red-500 uppercase tracking-tight italic">
                          {product.marketingMessage}
                        </p>
                      )}

                      {/* Swatch & Status Interaction */}
                      <div className="relative h-6 w-full flex items-center justify-between mt-2 overflow-hidden group/swatches">
                         {/* Swatch Presence */}
                          <div className="flex gap-1.5 items-center">
                            {(product.colors.length > 0 ? product.colors : ['#000000']).slice(0, 3).map((color, cIdx) => (
                              <div 
                                key={cIdx}
                                className="w-3.5 h-3.5 rounded-full ring-[1px] ring-offset-1 ring-border/50 border border-black/5"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                            {product.colors.length > 3 && (
                              <span className="text-[9px] font-bold text-muted-foreground">+{product.colors.length - 3}</span>
                            )}
                          </div>

                         {/* Status Reveal (Animated on desktop) */}
                         <span className="text-[10px] font-black text-black dark:text-zinc-50 uppercase tracking-[0.2em] hidden md:block transition-all duration-300 group-hover/swatches:translate-x-0 translate-x-4 opacity-0 group-hover/swatches:opacity-100">
                           View Look
                         </span>
                      </div>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
