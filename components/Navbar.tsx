"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SearchBar } from "@/components/SearchBar";
import { CartSheet } from "@/components/CartSheet";
import { UserProfileDropdown } from "@/components/UserProfileDropdown";
import { RegionSelector } from "@/components/RegionSelector";
import { useUIStore } from "@/store/useUIStore";
import { GridSwitcher } from "@/components/GridSwitcher";
import { MobileSidebar } from "@/components/MobileSidebar";

export function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { toggleMobileMenu, setMobileMenuOpen } = useUIStore();
  const pathname = usePathname();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, setMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 150) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  if (pathname.startsWith("/admin")) return null;

  const navBgColor = "bg-white/95 dark:bg-background/95 backdrop-blur-md border-b border-border shadow-sm";
  const navTextColor = "text-primary dark:text-foreground";

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: isVisible ? 0 : "-100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${navBgColor}`}
      >
        <div className="w-full">
          {/* TOP TIER: Logo, Search (Desktop), Icons, Hamburger */}
          <div className="container mx-auto px-4 lg:px-6 py-3 md:py-4 flex items-center justify-between gap-6">
            
            {/* Left Block: 3D Stacked Logo Card */}
            <div className="flex items-center gap-6">
              <Link href="/" className="flex-shrink-0 group">
                <motion.div 
                  whileHover={{ scale: 1.08, y: -4 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative w-16 h-16 md:w-24 md:h-24 bg-white dark:bg-zinc-900 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-border/50 border-b-[6px] border-b-zinc-200 dark:border-b-zinc-800 flex items-center justify-center p-2.5 transition-all duration-500 overflow-hidden"
                >
                  {/* Subtle Grain Overlay on Card */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] dark:opacity-[0.1]" />
                  
                  <div className="relative w-full h-full transform transition-transform duration-500 group-hover:scale-110">
                    <Image src="/Logo-light.png" alt="Logo" fill className="object-contain dark:hidden" priority />
                    <Image src="/Logo-dark.png" alt="Logo" fill className="object-contain hidden dark:block" priority />
                  </div>

                  {/* Hover "Expand" Glow */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              </Link>
            </div>

            {/* Middle Block: PC Links or Search (Internal) */}
            <div className="hidden xl:flex flex-1 max-w-xl mx-8">
              <SearchBar isTransparent={false} />
            </div>

            {/* Right Block: Icons & Switcher */}
            <div className={`flex items-center gap-3 md:gap-6 transition-colors duration-300 ${navTextColor}`}>
              {/* Desktop Only Actions */}
              <div className="hidden lg:flex items-center space-x-5">
                <RegionSelector isTransparent={false} />
                <ThemeToggle />
                <Link href="/wishlist" className="hover:opacity-80 transition-opacity" aria-label="Wishlist">
                  <Heart className="w-6 h-6" />
                </Link>
                <UserProfileDropdown />
              </div>

              {/* Universal Actions */}
              <GridSwitcher />
              <CartSheet />
              
              {/* Specialized Hamburger (Fashion Nova Style) */}
              <button
                onClick={toggleMobileMenu}
                className="p-1 px-2 hover:opacity-70 transition-opacity"
                aria-label="Toggle Menu"
              >
                <div className="flex flex-col gap-[5px]">
                  <div className="w-7 h-[1.5px] bg-current" />
                  <div className="w-7 h-[1.5px] bg-current" />
                  <div className="w-7 h-[1.5px] bg-current" />
                </div>
              </button>
            </div>
          </div>

          {/* DEPARTMENT TIER (Fashion Nova Style) */}
          <div className="flex items-center justify-center border-t border-border/40 overflow-x-auto no-scrollbar scroll-smooth bg-zinc-50/50 dark:bg-transparent">
            <div className="flex items-center gap-8 md:gap-12 px-6 py-2.5">
              {["Women", "Plus+Curve", "Men", "Sport", "Kids", "Beauty"].map((dept) => (
                <Link 
                  key={dept}
                  href={`/shop?dept=${dept.toLowerCase()}`}
                  className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] hover:text-primary transition-all border-b-2 border-transparent hover:border-primary pb-0.5 whitespace-nowrap active:scale-95 text-zinc-600 dark:text-zinc-400"
                >
                  {dept}
                </Link>
              ))}
            </div>
          </div>

          {/* MOBILE SEARCH TIER (Visible Only on Mobile) */}
          <div className="lg:hidden px-4 pb-3 border-t border-border/20 pt-2">
             <SearchBar isTransparent={false} />
          </div>

          {/* PRODUCT CATEGORIES (Desktop Only Sub-Nav) */}
          <div className="hidden lg:flex items-center justify-center w-full border-t border-border/40 bg-white/30 dark:bg-background/30 py-2.5 px-4 backdrop-blur-sm">
            <div className="flex flex-wrap items-center justify-center gap-x-10 text-[10px] font-black tracking-[0.2em] uppercase transition-colors duration-300 text-muted-foreground">
              {["Dresses", "Matching Sets", "Tops", "Swim", "Outerwear", "Accessories", "Restocks"].map((cat) => (
                <Link key={cat} href={`/shop/${cat.toLowerCase().replace(" ", "-")}`} className="hover:text-primary transition-colors whitespace-nowrap">
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu & Search Overlay */}
      <MobileSidebar />
    </>
  );
}
