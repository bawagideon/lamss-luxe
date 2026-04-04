"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Search, Menu, Camera } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { CartSheet } from "@/components/CartSheet";
import { UserProfileDropdown } from "@/components/UserProfileDropdown";
import { useUIStore } from "@/store/useUIStore";
import { MobileSidebar } from "@/components/MobileSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { RegionSelector } from "@/components/RegionSelector";

export function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { toggleMobileMenu, setMobileMenuOpen } = useUIStore();
  const pathname = usePathname();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 70) {
        setIsScrolled(true);
      } else if (currentScrollY < 30) {
        setIsScrolled(false);
      }

      const diff = currentScrollY - lastScrollY;
      if (Math.abs(diff) > 8) {
        if (currentScrollY > lastScrollY && currentScrollY > 150) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        setLastScrollY(currentScrollY);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  if (pathname.startsWith("/admin")) return null;

  const navBgColor = isScrolled 
    ? "bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl ring-1 ring-black/5 dark:ring-white/10 shadow-2xl" 
    : "bg-white/95 dark:bg-background/95 backdrop-blur-md border-b border-border shadow-sm";

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ 
          y: isVisible ? 0 : "-100%",
        }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none"
      >
        <motion.div
          animate={{ 
            width: isScrolled ? "95%" : "100%",
            maxWidth: isScrolled ? "1400px" : "100%",
            marginTop: isScrolled ? "14px" : "0px",
            // Remove fixed height to allow Tier 2 in non-island mode or multi-tier
          }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className={`relative pointer-events-auto transition-all duration-500 overflow-visible`}
        >
          {/* Background Layer */}
          <motion.div 
             animate={{ 
               borderRadius: isScrolled ? "24px" : "0px",
             }}
             className={`absolute inset-0 z-0 overflow-hidden ${navBgColor}`}
          >
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] dark:opacity-[0.1]" />
          </motion.div>

          {/* Content Layer */}
          <div className="relative z-10 w-full flex flex-col">
            
            {/* DESKTOP VIEW (Visible on lg+) */}
            <div className="hidden lg:flex flex-col w-full">
               {/* TIER 1: Main Desktop Header (Image Layout 1) */}
               <div className="container mx-auto px-6 h-20 flex items-center justify-between gap-8">
                  
                  {/* Left: Logo & Core Nav */}
                  <div className="flex items-center gap-10">
                    <Link href="/" className="flex-shrink-0">
                      <div className="relative w-40 h-8">
                        <Image src="/Logo-light.png" alt="Logo" fill className="object-contain object-left dark:hidden" priority />
                        <Image src="/Logo-dark.png" alt="Logo" fill className="object-contain object-left hidden dark:block" priority />
                      </div>
                    </Link>
                    <div className="flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em] text-zinc-900 dark:text-white">
                      <Link href="/shop/new-in" className="hover:text-pink-500 transition-colors">New In</Link>
                      <Link href="/shop" className="hover:text-pink-500 transition-colors">Clothing</Link>
                      <Link href="/community" className="hover:text-pink-500 transition-colors">Community</Link>
                      <Link href="/about" className="hover:text-pink-500 transition-colors">About</Link>
                      <Link href="/contact" className="hover:text-pink-500 transition-colors">Contact</Link>
                    </div>
                  </div>

                  {/* Center: Search Bar (Image Style) */}
                  <div className="flex-1 max-w-md">
                    <div className="relative flex items-center bg-zinc-100/50 dark:bg-zinc-900/50 border border-transparent rounded-full h-11 px-4 focus-within:bg-white focus-within:border-zinc-200 transition-all group">
                      <Search className="w-4 h-4 text-zinc-400 mr-3" />
                      <input 
                        type="text" 
                        placeholder="Search within Lamssé Luxe..."
                        className="flex-1 bg-transparent border-none outline-none text-[12px] font-bold text-zinc-900 dark:text-zinc-100 placeholder-zinc-400"
                      />
                      <Camera className="w-4 h-4 text-zinc-300 ml-2 cursor-pointer hover:text-black" />
                    </div>
                  </div>

                  {/* Right: Actions (Image Alignment) */}
                  <div className="flex items-center gap-6">
                    <RegionSelector />
                    <ThemeToggle />
                    <Link href="/wishlist">
                      <Heart className="w-6 h-6 stroke-[1.5px] hover:text-pink-500 transition-colors" />
                    </Link>
                    
                    <button className="px-5 py-2.5 border-2 border-pink-100 text-pink-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-sm hover:bg-pink-50 transition-all">
                       Shop The Drop
                    </button>

                    <UserProfileDropdown />
                    <CartSheet />
                  </div>
               </div>

               {/* TIER 2: Desktop Categories Header (Image Layout 2) */}
               {!isScrolled && (
                 <div className="container mx-auto px-6 border-t border-border/50 h-14 flex items-center justify-between">
                    {/* Dept Pills */}
                    <div className="flex items-center gap-3">
                       {["Women", "Plus+Curve", "Beauty"].map(dept => (
                         <Link 
                           key={dept} 
                           href={`/shop?dept=${dept.toLowerCase()}`}
                           className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                              dept === "Women" 
                                ? "bg-pink-50 text-pink-500 border border-pink-100" 
                                : "bg-transparent text-zinc-500 hover:bg-zinc-50"
                           }`}
                        >
                           {dept}
                         </Link>
                       ))}
                    </div>

                    {/* Category Links */}
                    <div className="flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-zinc-600">
                       {["Dresses", "Matching Sets", "Tops", "Swim", "Outerwear", "Accessories", "Restocks"].map(cat => (
                         <Link 
                           key={cat} 
                           href={`/shop/${cat.toLowerCase().replace(" ", "-")}`}
                           className="hover:text-pink-500 transition-colors"
                         >
                           {cat}
                         </Link>
                       ))}
                    </div>
                 </div>
               )}
            </div>

            {/* MOBILE VIEW (Visible on <lg) */}
            <div className="flex lg:hidden flex-col">
              {/* TIER 1: Logo & Basic Icons */}
              <div className={`container mx-auto px-4 h-16 flex items-center justify-between transition-all duration-500 text-black dark:text-white`}>
                <Link href="/" className="flex-shrink-0 group">
                  <div className={`relative ${isScrolled ? "w-28 h-6" : "w-36 h-8"} transition-all duration-500`}>
                    <Image src="/Logo-light.png" alt="Logo" fill className="object-contain object-left dark:hidden" priority />
                    <Image src="/Logo-dark.png" alt="Logo" fill className="object-contain object-left hidden dark:block" priority />
                  </div>
                </Link>

                <div className="flex items-center gap-4">
                  <UserProfileDropdown />
                  <CartSheet />
                  <button onClick={toggleMobileMenu} className="p-1 hover:opacity-70">
                    <Menu className="w-7 h-7 stroke-[1.5px]" />
                  </button>
                </div>
              </div>

              {/* TIER 2: Mobile Horizontal Scroller */}
              <div className="w-full border-t border-border/40 bg-white dark:bg-black overflow-x-auto no-scrollbar py-3 px-4">
                <div className="flex items-center gap-8 min-w-max">
                  {["Women", "Luxe", "Beauty", "Dresses", "Sets", "Tops", "Swim"].map((item) => (
                    <Link 
                      key={item}
                      href={`/shop`}
                      className="text-[10px] font-black uppercase tracking-[0.15em] text-zinc-500"
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>

              {/* TIER 3: Mobile Search Input */}
              <div className="w-full px-4 py-2 border-t border-border/40 bg-zinc-50/50 dark:bg-background/50">
                <div className="relative flex items-center bg-white dark:bg-zinc-900 border border-border/60 rounded-full h-10 px-4 shadow-sm">
                  <Search className="w-4 h-4 text-zinc-400 mr-2" />
                  <input 
                    type="text" 
                    placeholder="Search Lamssé Luxe..."
                    className="flex-1 bg-transparent border-none outline-none text-[12px] font-bold text-zinc-900 dark:text-zinc-100"
                  />
                  <Camera className="w-4 h-4 text-zinc-300 ml-2" />
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </motion.nav>
      {/* Mobile Menu & Search Overlay */}
      <MobileSidebar />
    </>
  );
}
