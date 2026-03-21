"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getActiveProducts } from "@/app/actions/products";
import { Heart } from "lucide-react";
import { useWishlist } from "@/hooks/useWishlist";

export function ShopGrid() {
  const [liveProducts, setLiveProducts] = useState<any[]>([]);
  const { wishlistIds, toggleWishlist, mounted } = useWishlist();

  useEffect(() => {
    getActiveProducts().then((dbProducts) => {
      if (dbProducts && dbProducts.length > 0) {
        setLiveProducts(dbProducts.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: `$${p.price}`,
          rawPrice: p.price, // keep raw for calculations if needed
          imageDefault: p.image_url,
          imageLifestyle: p.image_url // duplicate if missing second image
        })));
      }
    });
  }, []);

  return (
    <section className="py-24 bg-background" id="shop">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Shop The Look</h2>
            <p className="text-muted-foreground text-lg max-w-xl">
              Curated elegance for the modern woman. Wear it during the day, slay it through the night.
            </p>
          </div>
          <Link href="/collections" className="mt-6 md:mt-0 text-primary font-bold hover:underline transition-all">
            View All Collections &rarr;
          </Link>
        </div>

        {liveProducts.length === 0 ? (
          <div className="w-full text-center py-24 text-gray-500 font-medium">
             No active catalog items available yet in the database.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {liveProducts.map((product, index) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-4 rounded-sm">
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
                  {mounted && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(product.id);
                      }}
                      className="absolute top-4 right-4 z-30 p-2.5 rounded-full backdrop-blur-md bg-background/70 hover:bg-background text-muted-foreground hover:text-red-500 transition-all shadow-sm group/heart"
                      aria-label="Toggle Wishlist"
                    >
                      <Heart className={`w-4 h-4 transition-colors ${wishlistIds.includes(product.id) ? "fill-red-500 text-red-500" : "group-hover/heart:text-red-500"}`} />
                    </button>
                  )}
                </div>
                
                <div className="flex justify-between items-start mt-4">
                  <div>
                    <h3 className="text-lg font-bold group-hover:text-primary transition-colors">{product.name}</h3>
                    <p className="text-muted-foreground text-sm mt-1">Available in 3 colors</p>
                  </div>
                  <span className="font-bold">{product.price}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
