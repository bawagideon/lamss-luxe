"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface ImmersiveVisualsProps {
  images: {
    front?: string | null;
    side?: string | null;
    back?: string | null;
    main?: string | null;
  };
  productName: string;
}

export function ImmersiveVisuals({ images, productName }: ImmersiveVisualsProps) {
  const visualSet = [
    { url: images.front, label: "The Silhouette" },
    { url: images.side, label: "Side Detail" },
    { url: images.back, label: "The Reveal" }
  ].filter(v => typeof v.url === 'string' && v.url !== '');

  if (visualSet.length === 0) return null;

  return (
    <section className="py-24 bg-zinc-50 dark:bg-zinc-900/20 overflow-hidden">
      <div className="container mx-auto px-8 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {visualSet.map((visual, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: idx * 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="group relative"
            >
              <div className="relative aspect-[3/5] overflow-hidden rounded-sm bg-zinc-200 dark:bg-zinc-800">
                <Image
                  src={visual.url!}
                  alt={`${productName} - ${visual.label}`}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500" />
              </div>
              
              <div className="mt-6 flex items-center gap-4">
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">0{idx + 1}</span>
                 <h4 className="text-sm font-black uppercase tracking-widest">{visual.label}</h4>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
