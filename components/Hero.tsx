"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative w-full h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Left Split - Clothing */}
      <motion.div 
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full md:w-1/2 h-1/2 md:h-full bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </motion.div>

      {/* Right Split - Event/Community */}
      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full md:w-1/2 h-1/2 md:h-full bg-cover bg-center"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1516726817505-f5ed825624d8?q=80&w=1000&auto=format&fit=crop')" }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </motion.div>

      {/* Center Overlay Content */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center px-6 md:px-12 flex flex-col items-center pointer-events-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight max-w-4xl"
          >
            Ready-to-Slay Fashion <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-300">for Soft Life Queens.</span>
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
            className="mt-10 flex flex-col sm:flex-row gap-4"
          >
            <Button size="lg" className="bg-white text-black hover:bg-gray-100 px-8 py-6 text-base rounded-full font-bold uppercase tracking-wider transition-transform hover:scale-105">
              Shop The Drop
            </Button>
            <Button size="lg" className="bg-primary text-white hover:bg-primary/90 px-8 py-6 text-base rounded-full font-bold uppercase tracking-wider transition-transform hover:scale-105">
              Join The Network
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
