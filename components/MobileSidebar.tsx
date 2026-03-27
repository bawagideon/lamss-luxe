"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { X, Instagram, Facebook, Youtube, ChevronRight, Globe, History, Sparkles } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { useState } from "react";

export function MobileSidebar() {
  const { isMobileMenuOpen, setMobileMenuOpen } = useUIStore();
  const [activeDept, setActiveDept] = useState("Women");

  const departments = ["Women", "Plus+Curve", "Men", "Sport", "Kids", "Beauty"];

  const categories = [
    { name: "New In", href: "/collections" },
    { name: "Clothing", href: "/shop" },
    { name: "Dresses", href: "/shop/dresses" },
    { name: "Matching Sets", href: "/shop/two-piece" },
    { name: "Tops", href: "/shop/tops" },
    { name: "Swim", href: "/shop/swim" },
    { name: "Outerwear", href: "/shop/outerwear" },
    { name: "Accessories", href: "/shop/accessories" },
    { name: "Novadeals", href: "/shop?filter=sale" },
  ];

  return (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          />

          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
            className="fixed top-0 left-0 bottom-0 w-full max-w-[380px] bg-background z-[70] lg:hidden flex flex-col shadow-2xl"
          >
            {/* Header: Logo & Controls */}
            <div className="p-4 flex items-center justify-between border-b border-border/40">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex-shrink-0">
                <div className="relative w-36 h-8">
                  <Image src="/Logo-light.png" alt="Logo" fill className="object-contain object-left dark:hidden" />
                  <Image src="/Logo-dark.png" alt="Logo" fill className="object-contain object-left hidden dark:block" />
                </div>
              </Link>
              <div className="flex items-center gap-4">
                <Sparkles className="w-6 h-6 text-zinc-400" />
                <History className="w-6 h-6 text-zinc-400" />
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-8 h-8 stroke-[1px]" />
                </button>
              </div>
            </div>

            {/* Department Horizontal Tabs (Exactly as Fashion Nova) */}
            <div className="flex border-b border-border/40 overflow-x-auto no-scrollbar bg-zinc-50 dark:bg-zinc-900/10">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setActiveDept(dept)}
                  className={`px-5 py-3 text-[10px] font-black uppercase tracking-[0.15em] border-b-2 transition-all whitespace-nowrap ${
                    activeDept === dept ? "border-black dark:border-white text-black dark:text-white" : "border-transparent text-zinc-400 hover:text-zinc-600"
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>

            {/* Navigation Content */}
            <div className="flex-1 overflow-y-auto pt-4 px-4 space-y-0.5 pb-20">
              {categories.map((cat) => (
                <Link 
                  key={cat.href}
                  href={cat.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex justify-between items-center py-4 px-2 text-[14px] font-black uppercase tracking-tight hover:bg-zinc-50 dark:hover:bg-zinc-900/50 rounded-sm group"
                >
                  <span className={`${cat.name === 'Swim' ? 'text-cyan-500' : 'text-primary'}`}>{cat.name}</span>
                  <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500 transition-colors" />
                </Link>
              ))}
              
              <div className="h-[1px] bg-border/40 my-6" />
              
              <Link href="/collections" className="block py-4 px-2 text-[14px] font-black uppercase tracking-tight text-primary">Festival</Link>
              <Link href="/collections" className="block py-4 px-2 text-[14px] font-black uppercase tracking-tight text-primary">Jumpsuits & Rompers</Link>
            </div>

            {/* Sidebar Footer Area (Fashion Nova Style) */}
            <div className="p-6 bg-zinc-50/80 dark:bg-zinc-950/80 border-t border-border/40 space-y-8 backdrop-blur-md">
              
              <div className="space-y-4">
                 <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Location Settings</p>
                 <button className="w-full flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-border/40 rounded-sm">
                   <div className="flex items-center gap-3">
                     <Globe className="w-5 h-5" />
                     <span className="text-[13px] font-black tracking-tight uppercase">Region/Currency</span>
                   </div>
                   <div className="flex items-center gap-2 text-zinc-400">
                     <span className="text-[11px] font-bold">Nigeria NGN ₦</span>
                     <ChevronRight className="w-4 h-4" />
                   </div>
                 </button>
              </div>

              {/* Newsletter & Discount */}
              <div className="space-y-4">
                 <p className="text-[11px] font-black uppercase tracking-[0.2em] text-center text-primary">Sign Up For Discounts + Updates</p>
                 <div className="flex bg-white dark:bg-zinc-900 border border-border/40 p-1.5 rounded-full overflow-hidden">
                    <input 
                      placeholder="Email Address" 
                      className="flex-1 bg-transparent px-4 text-xs font-bold outline-none uppercase tracking-tight"
                    />
                    <button className="bg-zinc-100 dark:bg-zinc-800 p-2.5 rounded-full">
                       <ChevronRight className="w-5 h-5 text-zinc-400" />
                    </button>
                 </div>
              </div>

              {/* Icons & Disclaimer */}
              <div className="flex justify-center space-x-6 text-zinc-400">
                {[Instagram, Facebook, Youtube, Globe, Globe].map((Icon, i) => (
                  <Link key={i} href="#" className="hover:text-primary transition-colors"><Icon className="w-5 h-5 shadow-sm" /></Link>
                ))}
              </div>

              <div className="text-[10px] text-zinc-400 text-center leading-relaxed font-medium">
                By signing up, you agree to our Terms of Service & Privacy Policy.<br/>
                &copy; {new Date().getFullYear()} LAMSSÉ LUXE. All Rights Reserved.
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
