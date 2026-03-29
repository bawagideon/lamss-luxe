"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
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
      
      // Morphing State Trigger
      if (currentScrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBgColor} ${isScrolled ? "py-1 shadow-md" : "py-0"}`}
      >
        <div className="w-full">
          {/* TOP TIER: Logo, Primary Links, Search, Icons */}
          <div className={`container mx-auto px-4 lg:px-6 transition-all duration-500 flex items-center justify-between gap-6 text-black dark:text-white ${isScrolled ? "h-14 md:h-16" : "h-20 md:h-24"}`}>
            
            {/* Left Block: 3D Stacked Logo Card & Primary Nav */}
            <div className="flex items-center gap-6 lg:gap-12">
              <Link href="/" className="flex-shrink-0 group">
                <motion.div 
                  animate={{ scale: isScrolled ? 0.85 : 1 }}
                  className="relative w-14 h-14 md:w-20 md:h-20 bg-white dark:bg-zinc-900 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-border/50 border-b-[6px] border-b-zinc-200 dark:border-b-zinc-800 flex items-center justify-center p-2.5 transition-all duration-500 overflow-hidden"
                >
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] dark:opacity-[0.1]" />
                  <div className="relative w-full h-full transform transition-transform duration-500 group-hover:scale-110">
                    <Image src="/Logo-light.png" alt="Logo" fill className="object-contain dark:hidden" priority />
                    <Image src="/Logo-dark.png" alt="Logo" fill className="object-contain hidden dark:block" priority />
                  </div>
                </motion.div>
              </Link>

              {/* Primary Strategic Links (Hidden on Scrolled for "Cuter" bar) */}
              <AnimatePresence>
                {!isScrolled && (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="hidden lg:flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.2em]"
                  >
                    {[
                      { name: "New In", href: "/collections" },
                      { name: "Clothing", href: "/shop" },
                      { name: "Community", href: "/community" },
                      { name: "About", href: "/about" },
                      { name: "Contact", href: "/contact" }
                    ].map((link) => {
                      const isActive = pathname === link.href;
                      return (
                        <Link 
                          key={link.name}
                          href={link.href} 
                          className={`transition-all pb-1 border-b-2 ${
                            isActive 
                              ? "text-primary border-primary dark:text-primary" 
                              : "border-transparent hover:text-primary hover:border-primary/30"
                          }`}
                        >
                          {link.name}
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Block: Search, Icons & Mobile Switcher */}
            <div className="flex items-center gap-4 flex-1 justify-end">
              <AnimatePresence>
                {!isScrolled && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="hidden xl:flex flex-1 max-w-md mx-4"
                  >
                    <SearchBar isTransparent={false} />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className={`flex items-center gap-3 md:gap-5 transition-colors duration-300 ${navTextColor}`}>
                {/* Desktop Only Actions */}
                <div className="hidden lg:flex items-center space-x-4">
                  <RegionSelector isTransparent={false} />
                  <ThemeToggle />
                  <Link href="/wishlist" className="hover:opacity-80 transition-opacity">
                    <Heart className={`w-6 h-6 ${isScrolled ? "scale-90" : ""}`} />
                  </Link>
                  <UserProfileDropdown />
                </div>

                {/* Mobile/Tablet Only Actions: Grid Switcher & Hamburger */}
                <div className="flex items-center gap-2 lg:hidden">
                  <GridSwitcher />
                  
                  <button onClick={toggleMobileMenu} className="p-1 px-2 hover:opacity-70 transition-opacity">
                    <div className="flex flex-col gap-[5px]">
                      <div className={`w-7 h-[1.5px] bg-current transition-all ${isScrolled ? "w-5" : "w-7"}`} />
                      <div className="w-7 h-[1.5px] bg-current" />
                      <div className={`w-7 h-[1.5px] bg-current transition-all ${isScrolled ? "w-5" : "w-7"}`} />
                    </div>
                  </button>
                </div>

                <CartSheet />
              </div>
            </div>
          </div>

          {/* UNIFIED NAVIGATION TIER: Horizontal Scroll (Always for mobile, hidden on scrolled) */}
          <AnimatePresence>
            {!isScrolled && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="w-full border-t border-border/40 bg-zinc-50/50 dark:bg-background/50 overflow-x-auto no-scrollbar scroll-smooth"
              >
                <div className="flex items-center justify-start lg:justify-center min-w-max px-6 py-4 gap-x-8 md:gap-x-12">
                  {[
                    "Women", "Plus+Curve", "Beauty",
                    "Dresses", "Matching Sets", "Tops", "Swim", "Outerwear", "Accessories", "Restocks"
                  ].map((item) => {
                    const isDept = ["Women", "Plus+Curve", "Beauty"].includes(item);
                    const href = isDept 
                      ? `/shop?dept=${item.toLowerCase()}` 
                      : `/shop/${item === 'Matching Sets' ? 'two-piece' : item.toLowerCase().replace(" ", "-")}`;
                    
                    const currentDept = searchParams.get('dept');
                    const isActive = isDept 
                      ? currentDept === item.toLowerCase()
                      : pathname === href;
                    
                    return (
                      <Link 
                        key={item}
                        href={href}
                        className={`text-[10px] md:text-[11px] font-black uppercase tracking-[0.2em] transition-all border-b-2 pb-1 whitespace-nowrap active:scale-95 ${
                          isActive 
                            ? "text-primary border-primary dark:text-primary" 
                            : isDept 
                              ? "text-primary/70 bg-primary/5 px-3 py-1 rounded-full border-none hover:bg-primary/10" 
                              : "text-zinc-600 dark:text-zinc-400 hover:text-primary border-transparent"
                        }`}
                      >
                        {item}
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* MOBILE SEARCH TIER: Only at home top */}
          {!isScrolled && (
            <div className="lg:hidden px-4 pb-3 border-t border-border/20 pt-2">
               <SearchBar isTransparent={false} />
            </div>
          )}
        </div>
      </motion.nav>

      {/* Mobile Menu & Search Overlay */}
      <MobileSidebar />
    </>
  );
}
