"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, User, Menu, X, Heart } from "lucide-react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SearchBar } from "@/components/SearchBar";
import { CartSheet } from "@/components/CartSheet";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    // Trigger once on mount to get initial scroll position
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname.startsWith("/admin")) return null;

  const isHome = pathname === "/";
  const isTransparent = isHome && !isScrolled;
  const navTextColor = isTransparent ? "text-white" : "text-primary dark:text-foreground";
  const navBgColor = isTransparent ? "bg-transparent" : "bg-white/95 dark:bg-background/95 backdrop-blur-md border-b border-border shadow-sm";

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${navBgColor}`}
      >
        <div className="w-full">
          {/* TOP TIER: Logo, Main Categories (Level 1), Search, Icons */}
          <div className="container mx-auto px-4 lg:px-6 py-3 md:py-4 flex items-center justify-between gap-6">
            
            {/* Left Block: Logo & Primary Links */}
            <div className="flex items-center gap-6 lg:gap-10">
              {/* Logo (Aligned Left, Expanded Dimensions) */}
              <Link href="/" className="flex-shrink-0">
                <div className="relative w-44 h-12 md:w-56 md:h-14 lg:w-64 lg:h-16">
                  {isTransparent ? (
                    <Image src="/Logo.jpeg" alt="Lamssé Luxe Logo" fill className="object-contain object-left" priority />
                  ) : (
                    <>
                      <Image src="/Logo-light.jpeg" alt="Lamssé Luxe Logo" fill className="object-contain object-left dark:hidden block" priority />
                      <Image src="/Logo.jpeg" alt="Lamssé Luxe Logo" fill className="object-contain object-left hidden dark:block" priority />
                    </>
                  )}
                </div>
              </Link>
              
              {/* Primary Links (Level 1) - Desktop Only */}
              <div className={`hidden xl:flex items-center space-x-8 text-sm font-black tracking-widest uppercase transition-colors duration-300 ${navTextColor}`}>
                <Link 
                  href="/shop" 
                  className={`pb-1 border-b-2 hover:opacity-80 transition-all ${pathname.startsWith('/shop') ? 'border-current' : 'border-transparent hover:border-current'}`}
                >
                  Shop
                </Link>
                <Link 
                  href="/collections" 
                  className={`pb-1 border-b-2 hover:opacity-80 transition-all ${pathname.startsWith('/collections') ? 'border-current' : 'border-transparent hover:border-current'}`}
                >
                  Collections
                </Link>
              </div>
            </div>

            {/* Right Block: Dynamic Search Component & Utilitarian Icons */}
            <div className={`hidden lg:flex flex-1 items-center justify-end gap-x-6 transition-colors duration-300 ${navTextColor}`}>
              {/* Dynamic Database Search Component */}
              <SearchBar isTransparent={isTransparent} />

              {/* Utility Icons */}
              <div className="flex items-center space-x-5 flex-shrink-0">
                <ThemeToggle />
                <Link href="/wishlist" className="hover:opacity-80 transition-opacity" aria-label="Wishlist">
                  <Heart className="w-6 h-6" />
                </Link>
                <Link href="/admin" className="hover:opacity-80 transition-opacity" aria-label="Account">
                  <User className="w-6 h-6" />
                </Link>
                <CartSheet />
              </div>
            </div>

            {/* Mobile Hamburger / Touch Interface */}
            <div className={`lg:hidden flex items-center space-x-4 transition-colors duration-300 ${navTextColor}`}>
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

          {/* BOTTOM TIER: Subcategories - strict route mapping (No 404s/Dropdowns) */}
          <div className={`hidden lg:flex items-center justify-center w-full border-t ${isTransparent ? 'border-white/20' : 'border-border/60'} py-3`}>
            <div className={`flex items-center space-x-8 text-[11px] font-black tracking-[0.15em] uppercase transition-colors duration-300 ${navTextColor}`}>
              <Link href="/shop" className="hover:opacity-80 transition-opacity">Shop All</Link>
              <Link href="/shop/tops" className="hover:opacity-80 transition-opacity">Tops</Link>
              <Link href="/shop/two-piece" className="hover:opacity-80 transition-opacity">Two-Piece</Link>
              <Link href="/shop/dresses" className="hover:opacity-80 transition-opacity">Dresses</Link>
              <Link href="/collections" className="hover:opacity-80 transition-opacity">The Collections</Link>
              <Link href="/about" className="hover:opacity-80 transition-opacity">About Us</Link>
              <Link href="/contact" className="hover:opacity-80 transition-opacity">Contact</Link>
            </div>
          </div>

        </div>
      </motion.nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background pt-24 px-6 lg:hidden"
          >
            <div className="flex flex-col space-y-6 text-xl font-bold uppercase text-primary">
              <Link href="/shop/tops" className="border-b border-border pb-4 shrink-0 hover:opacity-80 transition-opacity">Shop Tops</Link>
              <Link href="/shop/two-piece" className="border-b border-border pb-4 shrink-0 hover:opacity-80 transition-opacity">Shop Two-Piece</Link>
              <Link href="/shop/dresses" className="border-b border-border pb-4 shrink-0 hover:opacity-80 transition-opacity">Shop Dresses</Link>
              <Link href="/collections" className="border-b border-border pb-4 shrink-0 hover:opacity-80 transition-opacity">Collections</Link>
              <Link href="/community" className="border-b border-border pb-4 shrink-0 hover:opacity-80 transition-opacity">Soft Life Queens</Link>
              <Link href="#" className="pt-4 flex items-center space-x-2 shrink-0 hover:opacity-80 transition-opacity">
                <User className="w-5 h-5" />
                <span>Account</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
