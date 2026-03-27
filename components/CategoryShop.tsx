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
    { name: "Dresses", slug: "dresses", label: "NOVA DRESSES", image: "/placeholder.jpg" },
    { name: "Matching Sets", slug: "two-piece", label: "NOVA SETS", image: "/placeholder.jpg" },
    { name: "Tops", slug: "tops", label: "NOVA TOPS", image: "/placeholder.jpg" },
    { name: "Swim", slug: "swim", label: "NOVA SWIM", image: "/placeholder.jpg" },
    { name: "Outerwear", slug: "outerwear", label: "NOVA LUXE", image: "/placeholder.jpg" },
    { name: "Accessories", slug: "accessories", label: "NOVA ACCS", image: "/placeholder.jpg" },
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

  return (
    <section className="py-20 bg-[#F9F7F2] relative overflow-hidden">
      {/* Vintage Grain Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-multiply bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
      
      <div className="container mx-auto px-4 md:px-10 lg:px-16 relative z-10">
        <div className="flex flex-col mb-12">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-4 text-[#1a1a1a]">Shop By Category</h2>
          <div className="h-1 w-24 bg-black" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link 
                href={`/shop/${cat.slug}`}
                className="group relative block aspect-[4/5] overflow-hidden rounded-[2px] shadow-xl border border-black/5"
              >
                {/* Vintage Card Base */}
                <div className="absolute inset-0 bg-[#E8E2D6] z-0 transition-transform duration-700 group-hover:scale-105" />
                
                {/* Dynamic Image with Grainy Overlay */}
                <div className="absolute inset-0 z-10 overflow-hidden mix-blend-multiply opacity-90 group-hover:opacity-100 transition-opacity">
                   <Image 
                     src={cat.image} 
                     alt={cat.name} 
                     fill 
                     className="object-cover grayscale-[20%] sepia-[10%] group-hover:grayscale-0 group-hover:sepia-0 transition-all duration-700" 
                   />
                </div>

                {/* The "NOVA" Branding Overlay (Styled as shared image) */}
                <div className="absolute inset-x-0 bottom-0 p-8 z-30 transform transition-transform duration-500 group-hover:-translate-y-2">
                   <div className="flex items-baseline gap-2">
                      <span className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter drop-shadow-2xl">
                        NOVA
                      </span>
                      <span className="text-2xl md:text-4xl font-light text-white/90 uppercase tracking-[0.05em] drop-shadow-lg italic">
                        {cat.slug === 'two-piece' ? 'SETS' : cat.name.split(' ')[0]}
                      </span>
                   </div>
                   <div className="mt-4 flex items-center gap-3">
                      <div className="h-[2px] w-8 bg-white/60" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/80">Explore Collection</span>
                   </div>
                </div>

                {/* Hover Glow / Grain Intensity */}
                <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
