"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { User, Menu, X, Heart } from "lucide-react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SearchBar } from "@/components/SearchBar";
import { CartSheet } from "@/components/CartSheet";
import { UserProfileDropdown } from "@/components/UserProfileDropdown";
import { RegionSelector } from "@/components/RegionSelector";

export function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
// Removed scroll check for transparency

      if (currentScrollY > lastScrollY && currentScrollY > 150) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    // Trigger once on mount to get initial scroll position
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
          {/* TOP TIER: Logo, Main Categories (Level 1), Search, Icons */}
          <div className="container mx-auto px-4 lg:px-6 py-3 md:py-4 flex items-center justify-between gap-6">
            
            {/* Left Block: Logo & Primary Links */}
            <div className="flex items-center gap-6 lg:gap-10">
              {/* Logo (Aligned Left) */}
              <Link href="/" className="flex-shrink-0">
                <div className="relative w-48 h-12 md:w-56 md:h-14 lg:w-64 lg:h-16">
                  <Image src="/Logo-light.png" alt="Lamssé Luxe Logo" fill className="object-contain object-left dark:hidden" priority />
                  <Image src="/Logo-dark.png" alt="Lamssé Luxe Logo" fill className="object-contain object-left hidden dark:block" priority />
                </div>
              </Link>
              
              {/* Primary Links (Level 1) - Desktop Only: Brand & Intent */}
              <div className={`hidden xl:flex items-center space-x-10 text-sm font-black tracking-[0.2em] uppercase transition-colors duration-300 ${navTextColor}`}>
                <Link 
                  href="/collections" 
                  className={`pb-1 border-b-2 hover:opacity-80 transition-all ${pathname === '/collections' ? 'border-current' : 'border-transparent hover:border-current'}`}
                >
                  New In
                </Link>
                <Link 
                  href="/shop" 
                  className={`pb-1 border-b-2 hover:opacity-80 transition-all ${pathname === '/shop' ? 'border-current' : 'border-transparent hover:border-current'}`}
                >
                  Clothing
                </Link>
                <Link 
                  href="/community" 
                  className={`pb-1 border-b-2 hover:opacity-80 transition-all ${pathname === '/community' ? 'border-current' : 'border-transparent hover:border-current'}`}
                >
                  Community
                </Link>
              </div>
            </div>

            {/* Right Block: Dynamic Search Component & Utilitarian Icons */}
            <div className={`hidden lg:flex flex-1 items-center justify-end gap-x-6 transition-colors duration-300 ${navTextColor}`}>
              {/* Dynamic Database Search Component */}
              <SearchBar isTransparent={false} />

              {/* Utility Icons */}
              <div className="flex items-center space-x-5 flex-shrink-0">
                <RegionSelector isTransparent={false} />
                <ThemeToggle />
                <Link href="/wishlist" className="hover:opacity-80 transition-opacity" aria-label="Wishlist">
                  <Heart className="w-6 h-6" />
                </Link>
                <UserProfileDropdown />
                <CartSheet />
              </div>
            </div>

            {/* Mobile Hamburger / Touch Interface */}
            <div className={`lg:hidden flex items-center space-x-4 transition-colors duration-300 ${navTextColor}`}>
              <RegionSelector isTransparent={false} />
              <ThemeToggle />
              <CartSheet />
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="hover:opacity-80 transition-opacity ml-2"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

          </div>

          {/* BOTTOM TIER: Strictly Product Categories */}
          <div className="hidden lg:flex items-center justify-center w-full border-t border-border/60 bg-white/50 dark:bg-background/50 py-3 px-4">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-[10px] font-black tracking-[0.2em] uppercase transition-colors duration-300 text-primary dark:text-foreground">
              <Link href="/shop/dresses" className="hover:opacity-60 transition-opacity">Dresses</Link>
              <Link href="/shop/two-piece" className="hover:opacity-60 transition-opacity">Matching Sets</Link>
              <Link href="/shop/tops" className="hover:opacity-60 transition-opacity">Tops</Link>
              <Link href="/shop/swim" className="hover:opacity-60 transition-opacity">Swim</Link>
              <Link href="/shop/outerwear" className="hover:opacity-60 transition-opacity">Outerwear</Link>
              <Link href="/shop/accessories" className="hover:opacity-60 transition-opacity">Accessories</Link>
              <Link href="/shop?filter=restock" className="hover:opacity-60 transition-opacity text-primary/70 dark:text-foreground/70">Restocks</Link>
            </div>
          </div>

        </div>
      </motion.nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background pt-24 pb-12 px-8 lg:hidden overflow-y-auto"
          >
            <div className="flex flex-col space-y-8">
              {/* Categories Tier */}
              <div className="flex flex-col space-y-5">
                <p className="text-[10px] font-black tracking-widest uppercase text-muted-foreground mb-2">Shop Categories</p>
                <Link href="/shop/dresses" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black uppercase tracking-tight hover:text-primary transition-colors">Dresses</Link>
                <Link href="/shop/two-piece" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black uppercase tracking-tight hover:text-primary transition-colors">Matching Sets</Link>
                <Link href="/shop/tops" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black uppercase tracking-tight hover:text-primary transition-colors">Tops</Link>
                <Link href="/shop/swim" onClick={() => setIsMobileMenuOpen(false)} className="text-2xl font-black uppercase tracking-tight hover:text-primary transition-colors">Swim</Link>
              </div>

              {/* Visual Separator */}
              <div className="h-px bg-border/60 w-full my-4" />

              {/* Brand Tier */}
              <div className="flex flex-col space-y-5">
                <Link href="/collections" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold uppercase tracking-widest text-primary/80">New In</Link>
                <Link href="/community" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold uppercase tracking-widest text-primary/80">Community</Link>
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    document.dispatchEvent(new CustomEvent("open-auth-modal", { detail: { mode: "signIn" } }));
                  }}
                  className="flex items-center space-x-3 text-lg font-bold uppercase tracking-widest text-primary/80"
                >
                  <User className="w-5 h-5" />
                  <span>Account Flow</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
