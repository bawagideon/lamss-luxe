"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { X, ChevronRight } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ThemeToggle";

export function MobileSidebar() {
  const { isMobileMenuOpen, setMobileMenuOpen } = useUIStore();
  
  const categories = [
    { name: "New In", href: "/shop/new-in" },
    { name: "Clothing", href: "/shop" },
    { name: "Community", href: "/community" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  const shopLinks = [
    { label: "Tops", href: "/shop/tops" },
    { label: "Two-Piece", href: "/shop/two-piece" },
    { label: "Dresses", href: "/shop/dresses" },
    { label: "New Arrivals", href: "/shop/new-in" }
  ];

  const companyLinks = [
    { label: "About & Founder Story", href: "/about" },
    { label: "Luxe Network Experience", href: "/community" },
    { label: "Contact", href: "/contact" },
    { label: "Shipping & Returns", href: "/shipping-returns" }
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 w-full bg-background z-[70] lg:hidden flex flex-col"
          >
            {/* Header: Exact replica of Navbar Mobile Tier 1 for seamlessness */}
            <div className="h-16 grid grid-cols-3 items-center px-4 transition-all duration-500 relative bg-background border-b border-border/40 shrink-0">
                {/* Left: Logo (Position locked to far left) */}
                <div className="flex justify-start">
                  <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex-shrink-0 group">
                    <div className="relative w-28 h-6">
                      <Image src="/Logo-light.png" alt="Logo" fill className="object-contain object-left dark:hidden" priority />
                      <Image src="/Logo-dark.png" alt="Logo" fill className="object-contain object-left hidden dark:block" priority />
                    </div>
                  </Link>
                </div>

                {/* Center: Empty (Stagnant position, no clutter) */}
                <div className="flex justify-center" />

                {/* Right: Actions (Theme Toggle Only as requested) */}
                <div className="flex justify-end items-center gap-3">
                  <ThemeToggle />
                  <button 
                    onClick={() => setMobileMenuOpen(false)} 
                    className="w-10 h-10 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200"
                  >
                    <X className="w-5 h-5 stroke-[1.5px]" />
                  </button>
                </div>
            </div>

            {/* Main Content Area (Single Scroll Flow for Routes + Footer) */}
            <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
              
              {/* Navigation Routes - Restored Luxe Simplicity */}
              <div className="flex flex-col py-6">
                {categories.map((cat) => (
                  <Link 
                    key={cat.href}
                    href={cat.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex justify-between items-center py-6 px-10 text-[16px] font-black uppercase tracking-[0.2em] border-b border-zinc-100 dark:border-zinc-800/50 group transition-all"
                  >
                    <span className="text-zinc-900 dark:text-zinc-100 group-hover:text-[#FF2B8B] transition-colors">{cat.name}</span>
                    <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-[#FF2B8B] transition-all transform group-hover:translate-x-1 stroke-[2px]" />
                  </Link>
                ))}
              </div>

              {/* Sidebar Footer Sections (1:1 Design Parity with Reference Image) */}
              <div className="flex flex-col bg-[#1A1A1A] border-t border-white/5 mt-12 py-16 px-6">
                 
                 {/* Join The Circle (Specific Magenta Design) */}
                 <div className="flex flex-col items-center mb-16">
                    <h3 className="text-[12px] font-black uppercase tracking-[0.3em] mb-10 text-center text-white">Join The Circle</h3>
                    <div className="w-full flex flex-col gap-4">
                       <p className="text-zinc-500 text-[11px] font-medium text-center mb-4 leading-relaxed max-w-[260px]">
                         Get style inspiration, event updates, and exclusive drops.
                       </p>
                       <Input 
                          placeholder="Email Address" 
                          className="bg-[#0F0F0F] border-none h-14 text-[11px] font-black uppercase tracking-widest text-white rounded-lg placeholder:text-zinc-700" 
                       />
                       <button className="w-full h-14 bg-[#FF2B8B] text-[11px] font-black uppercase tracking-[0.25em] text-white rounded-lg hover:opacity-90 transition-opacity">
                          Subscribe
                       </button>
                    </div>
                 </div>

                 {/* Navigation Accordions (Exact Reference Links) */}
                 <div className="w-full mb-16">
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="shop" className="border-white/5">
                        <AccordionTrigger className="text-[11px] font-black uppercase tracking-[0.3em] py-6 text-white hover:no-underline">Shop</AccordionTrigger>
                        <AccordionContent className="flex flex-col gap-6 pb-6 border-b border-white/5">
                           {shopLinks.map(link => (
                             <Link key={link.label} href={link.href} onClick={() => setMobileMenuOpen(false)} className="text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-white transition-colors">
                               {link.label}
                             </Link>
                           ))}
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="company" className="border-white/5">
                        <AccordionTrigger className="text-[11px] font-black uppercase tracking-[0.3em] py-6 text-white hover:no-underline">Company</AccordionTrigger>
                        <AccordionContent className="flex flex-col gap-6 pb-6 border-b border-white/5">
                           {companyLinks.map(link => (
                             <Link key={link.label} href={link.href} onClick={() => setMobileMenuOpen(false)} className="text-[10px] font-black text-zinc-500 uppercase tracking-widest hover:text-white transition-colors">
                               {link.label}
                             </Link>
                           ))}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                 </div>

                 {/* Legal & Social Bar */}
                 <div className="flex flex-col items-center gap-8 pt-10 border-t border-white/5">
                    <div className="flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-zinc-500">
                      <Link href="/privacy-policy" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors">Privacy</Link>
                      <Link href="/terms-of-service" onClick={() => setMobileMenuOpen(false)} className="hover:text-white transition-colors">Terms</Link>
                      <a href="https://instagram.com/lamsseluxe.ca" target="_blank" rel="noopener noreferrer" className="hover:text-[#FF2B8B] transition-colors">Instagram</a>
                    </div>
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em] text-center opacity-50">© 2026 LAMSSÉ LUXE</p>
                 </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
