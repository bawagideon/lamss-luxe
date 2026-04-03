"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Search, UserCircle, ShoppingBag, Menu, Camera } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SearchBar } from "@/components/SearchBar";
import { CartSheet } from "@/components/CartSheet";
import { UserProfileDropdown } from "@/components/UserProfileDropdown";
import { RegionSelector } from "@/components/RegionSelector";
import { useUIStore } from "@/store/useUIStore";
import { GridSwitcher } from "@/components/GridSwitcher";
import { MobileSidebar } from "@/components/MobileSidebar";
import { Badge } from "@/components/ui/badge";

export function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { toggleMobileMenu, setMobileMenuOpen } = useUIStore();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Stability Buffer for Island Mode
      if (currentScrollY > 70) {
        setIsScrolled(true);
      } else if (currentScrollY < 30) {
        setIsScrolled(false);
      }

      // Stability Buffer for Visibility (Hide on scroll down)
      // Prevent jitter from micro-scrolls or rubber banding
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
  const navTextColor = "text-primary dark:text-foreground";

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
            maxWidth: isScrolled ? "1200px" : "100%",
            marginTop: isScrolled ? "14px" : "0px",
            height: isScrolled ? "64px" : "100%", // Fixed height in island mode for stability
          }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className={`relative pointer-events-auto transition-all duration-500`}
        >
          {/* Background Layer (Handles clipping & glassmorphism) */}
          <motion.div 
             animate={{ 
               borderRadius: isScrolled ? "99px" : "0px",
             }}
             className={`absolute inset-0 z-0 overflow-hidden ${navBgColor}`}
          >
             <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] dark:opacity-[0.1]" />
          </motion.div>

          {/* Content Layer (Allows overflow for dropdowns) */}
          <div className="relative z-10 w-full h-full flex flex-col">
            {/* TIER 1: Logo & Icons (Mobile Layout as shared image 2) */}
            <div className={`container mx-auto px-4 lg:px-6 flex items-center justify-between transition-all duration-500 text-black dark:text-white ${isScrolled ? "h-14 md:h-16" : "h-16 md:h-20"}`}>
              
              {/* Logo (Centered or Left based on device) */}
              <Link href="/" className="flex-shrink-0 group">
                <div className={`relative ${isScrolled ? "w-32 h-6" : "w-40 h-8 md:w-48 md:h-10"} transition-all duration-500`}>
                  <Image src="/Logo-light.png" alt="Logo" fill className="object-contain object-left dark:hidden" priority />
                  <Image src="/Logo-dark.png" alt="Logo" fill className="object-contain object-left hidden dark:block" priority />
                </div>
              </Link>

              {/* Action Icons (Desktop: Wide, Mobile: Condensed Row) */}
              <div className="flex items-center gap-3 md:gap-5">
                {/* Desktop Primary Nav (Only on wide screens when not scrolled) */}
                <div className="hidden lg:flex items-center gap-6 mr-6 text-[11px] font-black uppercase tracking-widest">
                  <Link href="/collections" className="hover:text-primary transition-colors">New In</Link>
                  <Link href="/shop" className="hover:text-primary transition-colors">Clothing</Link>
                  <Link href="/community" className="hover:text-primary transition-colors">Community</Link>
                </div>

                {/* Shared Action Icons */}
                <div className="flex items-center gap-4 md:gap-6">
                  {/* User Profile */}
                  <div className="relative">
                    <UserProfileDropdown />
                  </div>

                  {/* Wishlist */}
                  <Link href="/wishlist" className="hover:opacity-80 transition-opacity">
                    <Heart className="w-6 h-6 stroke-[1.5px]" />
                  </Link>

                  {/* Cart with Badge */}
                  <div className="relative">
                    <CartSheet />
                  </div>

                  {/* Mobile Sidebar Toggle (The Hamburger) */}
                  <button onClick={toggleMobileMenu} className="lg:hidden p-1 hover:opacity-70 transition-opacity">
                    <Menu className="w-7 h-7 stroke-[1.5px]" />
                  </button>
                </div>
              </div>
            </div>

            {/* TIER 2: Department Tabs (Horizontal Scroll) */}
            <div className="w-full border-t border-border/40 bg-white dark:bg-black overflow-x-auto no-scrollbar scroll-smooth">
              <div className="flex items-center justify-start lg:justify-center min-w-max px-6 py-3 gap-x-8 md:gap-x-12">
                {[
                  "Women", "Plus+Curve", "Beauty",
                  "Dresses", "Matching Sets", "Tops", "Swim", "Accessories"
                ].map((item) => {
                  const isDept = ["Women", "Plus+Curve", "Beauty"].includes(item);
                  const href = isDept 
                    ? `/shop?dept=${item.toLowerCase()}` 
                    : `/shop/${item === 'Matching Sets' ? 'two-piece' : item.toLowerCase().replace(" ", "-")}`;
                  
                  const isActive = pathname === href || (isDept && searchParams.get('dept') === item.toLowerCase());
                  
                  return (
                    <Link 
                      key={item}
                      href={href}
                      className={`text-[11px] font-black uppercase tracking-[0.1em] transition-all border-b-2 pb-1 whitespace-nowrap active:scale-95 ${
                        isActive 
                          ? "text-primary border-primary" 
                          : "text-zinc-500 hover:text-primary border-transparent"
                      }`}
                    >
                      {item}
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* TIER 3: Persistent Search (Mobile & Desktop) */}
            <div className="w-full px-4 py-2 border-t border-border/40 bg-zinc-50/50 dark:bg-background/50">
              <div className="container mx-auto max-w-4xl relative">
                <div className="relative flex items-center bg-white dark:bg-zinc-900 border border-border/60 rounded-full h-11 px-4 shadow-sm group hover:border-black transition-colors">
                  <Search className="w-5 h-5 text-zinc-400 mr-3" />
                  <input 
                    type="text" 
                    placeholder={`Search within ${searchParams.get('dept') || "Women's"} Clothing...`}
                    className="flex-1 bg-transparent border-none outline-none text-[13px] font-bold text-zinc-900 dark:text-zinc-100 placeholder-zinc-400"
                    onFocus={() => {
                        // We can potentially trigger the full SearchBar overlay here
                    }}
                  />
                  <div className="flex items-center gap-3 pl-2 border-l border-border/40 ml-2">
                    <Camera className="w-5 h-5 text-zinc-400 cursor-pointer hover:text-black" />
                  </div>
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
