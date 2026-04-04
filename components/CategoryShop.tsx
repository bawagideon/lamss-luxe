"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getActiveProducts } from "@/app/actions/products";

interface CategoryItem {
  name: string;
  slug: string;
  image: string;
  label: string;
}

export function CategoryShop() {
  const [categories, setCategories] = useState<CategoryItem[]>([
    { name: "Dresses", slug: "dresses", label: "OUR DRESSES", image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80" },
    { name: "Matching Sets", slug: "two-piece", label: "OUR SETS", image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?auto=format&fit=crop&q=80" },
    { name: "Tops", slug: "tops", label: "OUR TOPS", image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80" },
    { name: "Bottoms", slug: "bottoms", label: "OUR BOTTOMS", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80" },
    { name: "Accessories", slug: "accessories", label: "OUR ACCS", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80" },
    { name: "Shoes", slug: "shoes", label: "OUR SHOES", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80" },
    { name: "BodyCTRL", slug: "body-ctrl", label: "OUR BODY", image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80" },
  ]);

  useEffect(() => {
    getActiveProducts().then((products) => {
      if (!products || products.length === 0) return;

      setCategories((prev) =>
        prev.map((cat) => {
          const match = products.find((p) =>
            p.category?.toLowerCase() === cat.slug.toLowerCase() ||
            p.category?.toLowerCase() === cat.name.toLowerCase()
          );
          return {
            ...cat,
            image: match?.image_url || products[0].image_url
          };
        })
      );
    });
  }, []);

  // Split categories for bento grid logic
  const main = categories.slice(0, 3); // Dresses, Matching Sets, Tops
  const footer = categories.slice(3); // Bottoms, Accessories, Shoes, BodyCTRL

  return (
    <section className="py-12 md:py-20 bg-white dark:bg-zinc-950 transition-colors duration-500" id="categories">
      <div className="container mx-auto px-4 md:px-10">
        <div className="flex flex-col mb-10">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-2 text-zinc-900 dark:text-white">Shop By Category</h2>
          <div className="h-1.5 w-20 bg-black dark:bg-white" />
        </div>

        {/* BRIGHT BENTO GRID (Exactly as shared image) */}
        <div className="flex flex-col gap-1 md:gap-2">
          {/* TOP SECTION: 1 Large + 2 Stacked */}
          <div className="grid grid-cols-2 gap-1 md:gap-2">
             {/* Large Left: Dresses (row-span-2) */}
             {main[0] && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="row-span-2"
                >
                  <CategoryCard item={main[0]} isLarge />
                </motion.div>
             )}

             {/* Stacked Right: Matching Sets & Tops */}
             <div className="grid grid-rows-2 gap-1 md:gap-2">
                {main.slice(1).map((cat, idx) => (
                   <motion.div
                      key={cat.slug}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.2 + idx * 0.1 }}
                   >
                     <CategoryCard item={cat} />
                   </motion.div>
                ))}
             </div>
          </div>

          {/* BOTTOM ROW: 4 Columns Matrix (Consistent with image) */}
          <div className="grid grid-cols-4 gap-1 md:gap-2">
             {footer.map((cat, idx) => (
                <motion.div
                  key={cat.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + idx * 0.1 }}
                >
                  <CategoryCard item={cat} />
                </motion.div>
             ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Sub-component for individual category cards
function CategoryCard({ item, isLarge = false }: { item: CategoryItem; isLarge?: boolean }) {
  return (
    <Link
      href={`/shop/${item.slug}`}
      className={`group relative block overflow-hidden bg-zinc-100 ${isLarge ? 'h-full aspect-[4/7] md:aspect-auto' : 'aspect-[4/3] md:aspect-[16/10]'}`}
    >
      <Image
        src={item.image}
        alt={item.name}
        fill
        className="object-cover transition-transform duration-1000 group-hover:scale-105"
      />
      
      {/* Centered-Bottom Branded Text Overlay (Image Style) */}
      <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col items-center justify-end h-1/2 bg-gradient-to-t from-black/50 to-transparent">
         <span className="text-[14px] md:text-2xl font-black text-white uppercase tracking-tight drop-shadow-lg text-center transform transition-transform duration-500 group-hover:-translate-y-1">
           {item.name}
         </span>
      </div>
    </Link>
  );
}
