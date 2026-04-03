"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { X, Instagram, Facebook, Youtube, ChevronRight, Globe, History, Search, Mail, Twitter } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";

export function MobileSidebar() {
  const { isMobileMenuOpen, setMobileMenuOpen, setSearchOpen } = useUIStore();
  const [activeDept, setActiveDept] = useState("Women");

  const departments = ["Women", "Luxe Network", "Beauty"];

  const categories = [
    { name: "New In", href: "/collections", highlight: true },
    { name: "Clothing", href: "/shop", highlight: true },
    { name: "The Luxe Experience", href: "/community", highlight: true },
    { name: "Dresses", href: "/shop/dresses" },
    { name: "Matching Sets", href: "/shop/two-piece" },
    { name: "Tops", href: "/shop/tops" },
    { name: "Swim", href: "/shop/swim", special: "text-cyan-500" },
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
            {/* Header: Centered Logo & Icons (Image 1 Style) */}
            <div className="relative py-4 px-6 flex items-center border-b border-border/60">
              <div className="flex-1" /> {/* Spacer */}
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex-shrink-0">
                <div className="relative w-40 h-10">
                  <Image src="/Logo-light.png" alt="Logo" fill className="object-contain dark:hidden" />
                  <Image src="/Logo-dark.png" alt="Logo" fill className="object-contain hidden dark:block" />
                </div>
              </Link>
              <div className="flex-1 flex justify-end items-center gap-4">
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSearchOpen(true);
                  }}
                  className="p-1"
                >
                  <Search className="w-6 h-6 text-zinc-900 dark:text-white" />
                </button>
                <Link 
                  href="/account"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1"
                >
                  <History className="w-6 h-6 text-zinc-900 dark:text-white" />
                </Link>
                <button 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="w-10 h-10 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-full hover:bg-zinc-200"
                >
                  <X className="w-6 h-6 stroke-[1.5px]" />
                </button>
              </div>
            </div>

            {/* Department Horizontal Tabs (Exactly as Fashion Nova) */}
            <div className="flex border-b border-border overflow-x-auto no-scrollbar">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setActiveDept(dept)}
                  className={`flex-1 py-4 text-[13px] font-black uppercase tracking-[0.1em] transition-all whitespace-nowrap ${
                    activeDept === dept ? "border-b-[3px] border-black dark:border-white text-black dark:text-white" : "text-zinc-400 hover:text-zinc-600"
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>

            {/* Promo Area: SPRING20 Style Banner */}
            <div className="bg-black dark:bg-zinc-800 text-white py-3 px-4 flex items-center justify-center space-x-2">
              <p className="text-[10px] font-black uppercase tracking-widest">Get $20 Off $99+ Orders With Code:</p>
              <span className="bg-[#cc0000] px-2 py-0.5 text-[10px] font-black rounded-sm">SPRING20</span>
            </div>

            {/* Navigation Content (Image 1 Style) */}
            <div className="flex-1 overflow-y-auto pt-2 pb-20 no-scrollbar">
              {categories.map((cat) => (
                <Link 
                  key={cat.href}
                  href={cat.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex justify-between items-center py-4 px-6 text-[14px] font-bold uppercase tracking-wide border-b border-zinc-100 dark:border-zinc-800/50 group transition-colors`}
                >
                  <span className={`${'special' in cat && cat.special ? cat.special : "text-zinc-900 dark:text-zinc-100"}`}>{cat.name}</span>
                  <ChevronRight className="w-4 h-4 text-zinc-300 group-hover:text-black transition-colors stroke-[1.5px]" />
                </Link>
              ))}
            </div>

            {/* Sidebar Sticky Footer Redesign (Image 2 Aesthetic) */}
            <div className="flex flex-col bg-white dark:bg-black border-t border-border overflow-y-auto no-scrollbar max-h-[60%] shrink-0">
               {/* Region Selector Stub */}
               <div className="px-6 py-6 bg-zinc-50 dark:bg-zinc-900/50">
                  <p className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-400 mb-4">Location Settings</p>
                  <button className="w-full flex items-center justify-between p-4 bg-white dark:bg-zinc-900 border border-border shadow-sm rounded-sm">
                    <div className="flex items-center gap-4">
                      <Globe className="w-5 h-5 text-black dark:text-white" />
                      <span className="text-[12px] font-black tracking-tight uppercase">Region/Currency</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-bold text-zinc-600 whitespace-nowrap">Nigeria NGN ₦</span>
                      <ChevronRight className="w-4 h-4 text-zinc-300" />
                    </div>
                  </button>
               </div>

               {/* Social Icons row (Image 2 style) */}
               <div className="flex justify-center items-center gap-6 py-8">
                  <Link href="#"><Instagram className="w-6 h-6 text-zinc-900 dark:text-white" /></Link>
                  <Link href="#"><Mail className="w-6 h-6 text-zinc-900 dark:text-white" /></Link>
                  <Link href="#"><Youtube className="w-6 h-6 text-zinc-900 dark:text-white" /></Link>
                  <Link href="#"><Twitter className="w-6 h-6 text-zinc-900 dark:text-white" /></Link>
                  <Link href="#"><Facebook className="w-6 h-6 text-zinc-900 dark:text-white" /></Link>
               </div>

               {/* Newsletter centered */}
               <div className="px-10 pb-10 flex flex-col items-center">
                  <h3 className="text-[12px] font-black uppercase tracking-[0.2em] mb-4 text-center">Sign Up For Discounts + Updates</h3>
                  <div className="w-full max-w-sm flex items-center gap-2 p-1.5 bg-zinc-50 dark:bg-zinc-900 border border-border rounded-full hover:border-black transition-colors group">
                    <Input 
                      placeholder="Phone Number or Email" 
                      className="border-none bg-transparent h-10 text-xs font-bold uppercase tracking-tight focus-visible:ring-0"
                    />
                    <button className="w-10 h-10 flex items-center justify-center bg-zinc-200 dark:bg-zinc-800 rounded-full group-hover:bg-black group-hover:text-white transition-all">
                       <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-[9px] text-zinc-400 mt-6 text-center leading-relaxed font-medium">
                    By signing up, you agree to Lamssé Luxe&apos;s Terms of Service and Privacy Policy. All rights reserved.
                  </p>
               </div>

               {/* Fashion Nova Accordion Footer (HELP, COMPANY, LEGAL) */}
               <div className="px-6 pb-20">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="help" className="border-border">
                      <AccordionTrigger className="text-[13px] font-black uppercase tracking-widest hover:no-underline py-4">Help</AccordionTrigger>
                      <AccordionContent className="flex flex-col gap-3 pb-4">
                        <Link href="/shipping-returns" className="text-xs font-bold text-zinc-500 uppercase tracking-tight hover:text-black">Shipping & Returns</Link>
                        <Link href="/contact" className="text-xs font-bold text-zinc-500 uppercase tracking-tight hover:text-black">Contact Us</Link>
                        <Link href="/faq" className="text-xs font-bold text-zinc-500 uppercase tracking-tight hover:text-black">FAQs</Link>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="company" className="border-border">
                      <AccordionTrigger className="text-[13px] font-black uppercase tracking-widest hover:no-underline py-4">Company</AccordionTrigger>
                      <AccordionContent className="flex flex-col gap-3 pb-4">
                        <Link href="/about" className="text-xs font-bold text-zinc-500 uppercase tracking-tight hover:text-black">Founder Story</Link>
                        <Link href="/community" className="text-xs font-bold text-zinc-500 uppercase tracking-tight hover:text-black">The Luxe Network</Link>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="legal" className="border-border">
                      <AccordionTrigger className="text-[13px] font-black uppercase tracking-widest hover:no-underline py-4">Legal</AccordionTrigger>
                      <AccordionContent className="flex flex-col gap-3 pb-4">
                        <Link href="/privacy-policy" className="text-xs font-bold text-zinc-500 uppercase tracking-tight hover:text-black">Privacy Policy</Link>
                        <Link href="/terms-of-service" className="text-xs font-bold text-zinc-500 uppercase tracking-tight hover:text-black">Terms of Service</Link>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
               </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
