"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const images = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=600&auto=format&fit=crop"
];

export function Gallery() {
  return (
    <section className="py-24 bg-white" id="gallery">
      <div className="container mx-auto px-6 overflow-hidden">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4">Queens In The Wild</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Tag @LamssLuxe or #SoftLifeQueens to be featured in our community gallery.
          </p>
        </div>

        {/* Masonry Layout Simulation using multiple columns */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
          <div className="flex flex-col gap-2 md:gap-4">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} viewport={{ once: true }} className="relative w-full aspect-[3/4] overflow-hidden rounded-md group">
              <Image sizes="(max-width: 1024px) 50vw, 33vw" src={images[0]} alt="Gallery 1" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} viewport={{ once: true }} className="relative w-full aspect-square overflow-hidden rounded-md group">
              <Image sizes="(max-width: 1024px) 50vw, 33vw" src={images[1]} alt="Gallery 2" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
            </motion.div>
          </div>
          <div className="flex flex-col gap-2 md:gap-4 lg:mt-8">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} viewport={{ once: true }} className="relative w-full aspect-square overflow-hidden rounded-md group">
              <Image sizes="(max-width: 1024px) 50vw, 33vw" src={images[2]} alt="Gallery 3" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} viewport={{ once: true }} className="relative w-full aspect-[3/4] overflow-hidden rounded-md group">
              <Image sizes="(max-width: 1024px) 50vw, 33vw" src={images[3]} alt="Gallery 4" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
            </motion.div>
          </div>
          <div className="flex flex-col gap-2 md:gap-4 sm:hidden lg:flex">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }} viewport={{ once: true }} className="relative w-full aspect-[4/5] overflow-hidden rounded-md group">
              <Image sizes="(max-width: 1024px) 50vw, 33vw" src={images[4]} alt="Gallery 5" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }} viewport={{ once: true }} className="relative w-full aspect-square overflow-hidden rounded-md group">
              <Image sizes="(max-width: 1024px) 50vw, 33vw" src={images[5]} alt="Gallery 6" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
