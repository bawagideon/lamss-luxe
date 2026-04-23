"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative w-full h-screen min-h-[750px] overflow-hidden bg-black">
      {/* Cinematic Background Video */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, ease: "easeOut" }}
        className="absolute inset-0 w-full h-full"
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover z-0 opacity-60"
        >
          <source src="/cut-down.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Layered Gradient for Depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90 z-10" />

      {/* Hero Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-white text-center px-6 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <span className="text-[10px] md:text-xs font-black tracking-[0.6em] uppercase text-primary">
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          className="text-6xl md:text-8xl lg:text-[11rem] font-black text-white tracking-tighter uppercase leading-[0.8] mb-10 italic"
        >
          READY TO <br />
          SLAY IT GIRL
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-2xl mb-12"
        >
          <p className="text-lg md:text-3xl font-black uppercase tracking-tight text-primary mb-4 italic drop-shadow-[0_0_30px_rgba(255,51,153,0.3)]">
            THE DESTINATION FOR CURATED STYLE. SECURE THE BEST BEFORE THEY DISAPPEAR.
          </p>
          <p className="text-xs md:text-sm font-bold uppercase tracking-[0.4em] text-zinc-400">
            EXCLUSIVE SPACE FOR LUXE FASHION. DESIGNED FOR THE POISE WOMAN.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center"
        >
          <Button
            size="lg"
            className="flex-1 bg-primary text-white hover:bg-white hover:text-black h-16 text-xs font-black uppercase tracking-[0.2em] rounded-sm transition-all shadow-2xl"
            asChild
          >
            <Link href="/shop">Secure Your Look</Link>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="flex-1 border-white/20 bg-white/5 hover:bg-white/20 text-white h-16 text-xs font-black uppercase tracking-[0.2em] rounded-sm backdrop-blur-md transition-all"
            asChild
          >
            <Link href="/collections">Explore All</Link>
          </Button>
        </motion.div>
      </div>

      {/* Subtle Bottom Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/60 to-transparent" />
      </motion.div>
    </section>
  );
}
