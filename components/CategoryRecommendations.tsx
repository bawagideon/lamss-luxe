"use client";

import { useEffect, useState } from "react";
import { getProductsByCategory } from "@/app/actions/products";
import { ShopGrid } from "./ShopGrid";

interface CategoryRecommendationsProps {
  category: string;
  currentProductId: string;
}

export function CategoryRecommendations({ category, currentProductId }: CategoryRecommendationsProps) {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    if (category) {
      getProductsByCategory(category).then((data) => {
        // Filter out current product
        setProducts(data.filter((p) => p.id !== currentProductId).slice(0, 4));
      });
    }
  }, [category, currentProductId]);

  if (products.length === 0) return null;

  return (
    <section className="py-24 border-t border-border/50">
      <div className="container mx-auto px-8 sm:px-10 lg:px-16">
        <div className="flex flex-col mb-12">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-2">Shop More {category}</h2>
          <div className="h-1.5 w-20 bg-black dark:bg-white" />
          <p className="mt-4 text-muted-foreground font-medium uppercase tracking-[0.2em] text-xs">
            Handpicked alternatives from our {category} collection.
          </p>
        </div>
        
        {/* We can use ShopGrid but let's pass the products as initialProducts */}
        <ShopGrid initialProducts={products} />
        
        <div className="mt-12 flex justify-center">
           <a 
            href={`/shop/${category}`}
            className="px-12 py-5 border border-black dark:border-white font-black uppercase tracking-widest text-[11px] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
           >
             View All {category}
           </a>
        </div>
      </div>
    </section>
  );
}
