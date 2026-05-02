"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { CartSheet } from "@/components/CartSheet";
import { UserProfileDropdown } from "@/components/UserProfileDropdown";
import { useUIStore } from "@/store/useUIStore";
import { MobileSidebar } from "@/components/MobileSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { RegionSelector } from "@/components/RegionSelector";
import { SearchBar } from "@/components/SearchBar";
import { GridSwitcher } from "@/components/GridSwitcher";

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
                  <Link href="/" className="flex-shrink-0 group">
                    <div className="relative w-80 h-16 transition-transform duration-500 group-hover:scale-105">
                      <Image src="/Logo-light.png" alt="Logo" fill sizes="(max-width: 1024px) 176px, 320px" className="object-contain object-left dark:hidden" priority />
                      <Image src="/Logo-dark.png" alt="Logo" fill sizes="(max-width: 1024px) 176px, 320px" className="object-contain object-left hidden dark:block" priority />
                    </div>
                  </Link>
                  <div className="flex items-center gap-10 text-[11px] font-black uppercase tracking-[0.15em] text-zinc-900 dark:text-white">
                    {[
                      { name: "New In", href: "/shop/new-in" },
                      { name: "Clothing", href: "/shop" },
                      { name: "Luxe Network", href: "/community" },
                      { name: "About", href: "/about" },
                      { name: "Contact", href: "/contact" }
                    ].map(link => (
                      <Link key={link.name} href={link.href} className="hover:text-[#FF2B8B] transition-colors whitespace-nowrap">
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Center: Search Bar (Integrated component with dropsheet) */}
                <div className="flex-1 max-w-md">
                  <SearchBar isTransparent={false} />
                </div>

                {/* Right: Actions (Image Alignment) */}
                <div className="flex items-center gap-6">
                  <RegionSelector />
                  <ThemeToggle />
                  <Link href="/wishlist" className="relative group">
                    <Heart className="w-6 h-6 stroke-[1.5px] group-hover:text-black transition-colors" />
                  </Link>


                  <UserProfileDropdown />
                  <CartSheet />
                </div>
              </div>

              {/* TIER 2: Desktop Categories Header (REMOVED) */}
            </div>

            {/* MOBILE VIEW (Visible on <lg) */}
            <div className="flex lg:hidden flex-col">
              {/* TIER 1: Logo, Grid Switcher & Basic Icons */}
              <div className={`container mx-auto px-2 h-16 flex justify-between items-center gap-1 transition-all duration-500 text-black dark:text-white relative z-30`}>
                {/* Left: Logo */}
                <div className="flex-shrink-0">
                  <Link href="/" className="group flex items-center">
                    <div className={`relative ${isScrolled ? "w-28 h-7" : "w-32 h-8"} sm:${isScrolled ? "w-40 h-10" : "w-48 h-12"} transition-all duration-500`}>
                      <Image src="/Logo-light.png" alt="Logo" fill sizes="(max-width: 768px) 160px, 208px" className="object-contain object-left dark:hidden" priority />
                      <Image src="/Logo-dark.png" alt="Logo" fill sizes="(max-width: 768px) 160px, 208px" className="object-contain object-left hidden dark:block" priority />
                    </div>
                  </Link>
                </div>

                {/* Center: Grid Switcher */}
                <div className="flex-shrink-0 flex justify-center w-[75px] sm:w-[90px]">
                  <div className="scale-[0.65] sm:scale-90 origin-center whitespace-nowrap">
                    {pathname.includes('/shop') ? <GridSwitcher /> : <div className="w-full" />}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex justify-end items-center gap-0.5 sm:gap-2 flex-shrink-0">
                  <Link href="/wishlist" className="p-1">
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.5px] hover:text-pink-500 transition-colors" />
                  </Link>
                  <div className="scale-90 sm:scale-100"><UserProfileDropdown /></div>
                  <div className="scale-90 sm:scale-100"><CartSheet /></div>
                  <button onClick={toggleMobileMenu} className="p-1 hover:opacity-70">
                    <Menu className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.5px]" />
                  </button>
                </div>
              </div>

              {/* TIER 2: Mobile Horizontal Scroller - Unified Core Nav (REMOVED) */}

              {/* TIER 3: Mobile Search Input */}
              <div className="w-full px-4 py-2 border-t border-border/40 bg-zinc-50/50 dark:bg-background/50 relative z-10">
                <SearchBar isTransparent={false} />
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
