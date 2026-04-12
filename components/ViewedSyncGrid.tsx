"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useViewedStore } from "@/store/useViewedStore";
import { getProductsByIds } from "@/app/actions/products";
import { Loader2, Eye } from "lucide-react";

export function ViewedGrid() {
  const { viewedIds } = useViewedStore();
  const [products, setProducts] = useState<{ id: string; name: string; price: number; images: string[] }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function hydrateProducts() {
      if (!viewedIds || viewedIds.length === 0) {
        setProducts([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const data = await getProductsByIds(viewedIds);
        // Maintain the order from viewedIds (most recent first)
        const ordered = viewedIds.map(id => data.find(p => p.id === id)).filter(Boolean) as { id: string; name: string; price: number; images: string[] }[];
        setProducts(ordered);
      } catch (err) {
        console.error("Failed to hydrate viewed products:", err);
      } finally {
        setIsLoading(false);
      }
    }

    hydrateProducts();
  }, [viewedIds]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-gray-50/50 rounded-xl border border-dashed border-gray-200 min-h-[300px]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-300 mb-4" />
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Loading your history...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-gray-50/50 rounded-xl border border-dashed border-gray-200 min-h-[300px] text-center">
        <div className="bg-white p-3 rounded-full shadow-sm mb-4">
            <Eye className="w-6 h-6 text-gray-200" />
        </div>
        <p className="text-sm font-bold uppercase tracking-tight text-gray-500 mb-2">History is empty</p>
        <p className="text-[11px] text-gray-400 max-w-[200px] leading-relaxed">
          The pieces you view will be automatically remembered here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex gap-2 h-[300px] md:h-[400px]">
        {/* Main Featured Item */}
        <Link 
          href={`/product/${products[0].id}`}
          className="flex-[1.5] bg-slate-50 rounded-lg overflow-hidden relative group"
        >
          <Image 
            src={products[0].images?.[0] || "/placeholder.jpg"} 
            alt={products[0].name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>

        {/* Stacked Side Items */}
        <div className="flex-1 flex flex-col gap-2 overflow-hidden">
          {products.slice(1, 4).map((product) => (
            <Link 
              key={product.id}
              href={`/product/${product.id}`}
              className="flex-1 bg-slate-50 rounded-lg overflow-hidden relative group border border-border/50"
            >
              <Image 
                src={product.images?.[0] || "/placeholder.jpg"} 
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
            </Link>
          ))}
          {/* Fill empty slots with placeholder if fewer than 4 items */}
          {Array.from({ length: Math.max(0, 3 - (products.length - 1)) }).map((_, i) => (
            <div key={`empty-${i}`} className="flex-1 bg-gray-50/50 rounded-lg border border-dashed border-gray-200" />
          ))}
        </div>
      </div>
    </div>
  );
}
