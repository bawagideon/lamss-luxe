"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Share as ShareIcon } from "lucide-react";
import { ShareModal } from "./ShareModal";

interface ProductGalleryProps {
  images: string[];
  productId?: string;
  productName?: string;
}

export function ProductGallery({ images, productId = "", productName = "" }: ProductGalleryProps) {
  const [mainImage, setMainImage] = useState(images[0]);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Sync main image when the images array changes (e.g. color variant switch)
  useEffect(() => {
    if (images.length > 0) {
      setMainImage(images[0]);
      setActiveIndex(0);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      }
    }
  }, [images]);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const width = scrollContainerRef.current.clientWidth;
      const newIndex = Math.round(scrollLeft / width);
      if (newIndex !== activeIndex) {
        setActiveIndex(newIndex);
      }
    }
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="w-full lg:w-3/5 flex flex-col-reverse md:flex-row gap-4">
      {/* Desktop Thumbnails (Hidden on mobile) */}
      <div className="hidden md:flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto no-scrollbar md:w-24">
        {images.map((img, i) => (
          <button
            key={`${img}-${i}`}
            onClick={() => {
              setMainImage(img);
              setActiveIndex(i);
            }}
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

      {/* Main Display Image - Desktop & Mobile */}
      <div className="w-full md:flex-1 relative aspect-[3/4] bg-muted overflow-hidden rounded-sm group">
        
        {/* Desktop View (Framer Motion Crossfade) */}
        <div className="hidden md:block w-full h-full">
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

        {/* Mobile View (Swipeable Carousel) */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="md:hidden flex overflow-x-auto snap-x snap-mandatory absolute inset-0 w-full h-full no-scrollbar"
        >
          {images.map((img, i) => (
            <div key={i} className="flex-none w-full h-full snap-start relative">
              <Image
                src={img}
                alt={`Product view ${i + 1}`}
                fill
                priority={i === 0}
                className="object-cover"
                sizes="100vw"
              />
            </div>
          ))}
        </div>

        {/* Mobile Overlays: DEALS badge, Pagination Dots, Share Button */}
        <div className="md:hidden absolute bottom-0 left-0 right-0 p-4 pb-6 flex items-end justify-between pointer-events-none z-10 bg-gradient-to-t from-black/40 via-transparent to-transparent">
          {/* DEALS Tag */}
          <div className="bg-[#A6262B] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 shrink-0 pointer-events-auto shadow-xl">
            Deals
          </div>

          {/* Pagination Dots */}
          <div className="flex gap-1.5 items-center justify-center flex-1 mx-4 pb-0.5">
            {images.map((_, i) => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeIndex === i ? "w-4 bg-white" : "w-1.5 bg-white/50"
                }`} 
              />
            ))}
          </div>

          {/* Share Button */}
          <div className="pointer-events-auto shrink-0">
            <ShareModal productId={productId} productName={productName}>
              <button className="w-9 h-9 rounded-full bg-white/95 text-black flex items-center justify-center shadow-xl active:scale-90 transition-transform">
                <ShareIcon className="w-4 h-4" />
              </button>
            </ShareModal>
          </div>
        </div>
      </div>
    </div>
  );
}
