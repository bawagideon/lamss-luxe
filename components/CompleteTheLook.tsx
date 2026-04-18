"use client";

import { useEffect, useState } from "react";
import { getProductsByIds } from "@/app/actions/products";
import Image from "next/image";
import Link from "next/link";
import { PriceDisplay } from "./PriceDisplay";
import { motion } from "framer-motion";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
}

export function CompleteTheLook({ relatedIds }: { relatedIds: string[] }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (relatedIds && relatedIds.length > 0) {
      getProductsByIds(relatedIds).then((data) => {
        setProducts(data as Product[]);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [relatedIds]);

  if (loading || products.length === 0) return null;

  return (
    <div className="mt-20 border-t border-border pt-16">
      <div className="flex flex-col mb-10">
        <h3 className="text-2xl font-black uppercase tracking-tighter">Complete The Look</h3>
        <p className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-bold mt-1">Pair it perfectly</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product, idx) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="group relative flex flex-col"
          >
            <Link href={`/product/${product.id}`} className="block relative aspect-[3/4] overflow-hidden bg-muted rounded-sm">
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              
              <div className="absolute bottom-3 left-3 right-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <button className="w-full bg-white/90 backdrop-blur-md text-black py-2.5 text-[10px] font-black uppercase tracking-widest shadow-xl">
                  Quick View
                </button>
              </div>
            </Link>
            
            <div className="mt-4 flex flex-col">
              <h4 className="text-[11px] font-black uppercase tracking-tight truncate">{product.name}</h4>
              <PriceDisplay priceCAD={product.price} className="text-sm font-bold mt-0.5" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
