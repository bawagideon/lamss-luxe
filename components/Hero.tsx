"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative w-full h-screen min-h-[80vh] overflow-hidden">
      {/* Absolute Background Video */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/cut-down.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay for Text Readability */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Center Overlay Content Wrapper */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-white text-center px-4 max-w-5xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-4xl md:text-6xl lg:text-8xl font-black text-white tracking-tighter uppercase leading-[0.9] w-full"
        >
          Ready-to-Slay IT Girl <br/> 
          <span className="text-white">for the Poise Woman.</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mt-6 text-lg md:text-xl text-gray-200 font-medium max-w-2xl text-center"
        >
          Curated pieces designed to elevate your presence. Dress with intention. Show up with confidence.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button size="lg" className="bg-white text-black hover:bg-gray-100 px-10 py-7 text-base rounded-full font-black uppercase tracking-widest transition-transform hover:scale-105" asChild>
            <Link href="/shop">Shop The Drop</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
