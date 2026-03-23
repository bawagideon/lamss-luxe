"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative w-full h-screen flex flex-col justify-center items-center overflow-hidden">
      {/* Absolute Background Video */}
      <video 
        autoPlay 
        loop 
        muted 
        playsInline 
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/home-video.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay for Text Readability */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Center Overlay Content */}
      <div className="text-center px-6 md:px-12 flex flex-col items-center z-20 w-full max-w-5xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight w-full"
        >
          Ready-to-Slay IT Girl Fashion <br/> 
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
            <Link href="/collections">Shop The Drop</Link>
          </Button>
          <Button size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-10 py-7 text-base rounded-full font-black uppercase tracking-widest transition-transform hover:scale-105" asChild>
            <Link href="/community">Join The Network</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
