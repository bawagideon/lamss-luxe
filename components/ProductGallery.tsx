"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface ProductGalleryProps {
  images: string[];
}

export function ProductGallery({ images }: ProductGalleryProps) {
  const [mainImage, setMainImage] = useState(images[0]);

  // Sync main image when the images array changes (e.g. color variant switch)
  useEffect(() => {
    if (images.length > 0) {
      setMainImage(images[0]);
    }
  }, [images]);

  if (!images || images.length === 0) return null;

  return (
    <div className="w-full lg:w-3/5 flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto no-scrollbar md:w-24">
        {images.map((img, i) => (
          <button
            key={`${img}-${i}`}
            onClick={() => setMainImage(img)}
            className={`relative aspect-[3/4] w-20 md:w-full shrink-0 overflow-hidden rounded-sm border-2 transition-all ${
              mainImage === img ? "border-black" : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <Image
              src={img}
              alt={`Thumbnail ${i + 1}`}
              fill
              className="object-cover"
              sizes="100px"
            />
          </button>
        ))}
      </div>

      {/* Main Display Image */}
      <div className="flex-1 relative aspect-[3/4] bg-muted overflow-hidden rounded-sm group">
        <AnimatePresence mode="wait">
          <motion.div
            key={mainImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full h-full"
          >
            <Image
              src={mainImage}
              alt="Main Product view"
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
