"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, User, Menu, X, ChevronDown } from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"
        }`}
      >
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
          {/* Left Navigation */}
          <div className="hidden lg:flex items-center space-x-8 text-sm font-bold tracking-wide uppercase text-primary">
            <div className="group relative">
              <button className="flex items-center space-x-1 hover:opacity-80 transition-opacity">
                <span>Shop</span>
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>
              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="bg-white shadow-xl rounded-lg py-2 w-48 flex flex-col">
                  <Link href="/shop/tops" className="px-4 py-2 hover:bg-pink-50 transition-colors">Tops</Link>
                  <Link href="/shop/two-piece" className="px-4 py-2 hover:bg-pink-50 transition-colors">Two-Piece</Link>
                  <Link href="/shop/dresses" className="px-4 py-2 hover:bg-pink-50 transition-colors">Dresses</Link>
                </div>
              </div>
            </div>
            <Link href="/collections" className="hover:opacity-80 transition-opacity">Collections</Link>
          </div>

          {/* Center Logo */}
          <Link href="/" className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
            <div className="relative w-32 h-12 md:w-40 md:h-16">
              <Image 
                src="/Logo.jpeg" 
                alt="Lamssé Luxe Logo" 
                fill 
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Right Navigation */}
          <div className="hidden lg:flex items-center space-x-6 text-sm font-bold tracking-wide uppercase text-primary">
            <Link href="/community" className="hover:opacity-80 transition-opacity">Soft Life Queens</Link>
            <div className="flex items-center space-x-4 ml-4 border-l border-pink-100 pl-4">
              <button className="hover:opacity-80 transition-opacity" aria-label="Account">
                <User className="w-5 h-5" />
              </button>
              <button className="hover:opacity-80 transition-opacity relative" aria-label="Cart">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">0</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center space-x-4 text-primary">
            <button className="hover:opacity-80 transition-opacity relative" aria-label="Cart">
              <ShoppingBag className="w-6 h-6" />
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="hover:opacity-80 transition-opacity"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
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
            className="fixed inset-0 z-40 bg-white pt-24 px-6 lg:hidden"
          >
            <div className="flex flex-col space-y-6 text-xl font-bold uppercase text-primary">
              <Link href="/shop/tops" className="border-b border-pink-100 pb-4 shrink-0 hover:opacity-80 transition-opacity">Shop Tops</Link>
              <Link href="/shop/two-piece" className="border-b border-pink-100 pb-4 shrink-0 hover:opacity-80 transition-opacity">Shop Two-Piece</Link>
              <Link href="/shop/dresses" className="border-b border-pink-100 pb-4 shrink-0 hover:opacity-80 transition-opacity">Shop Dresses</Link>
              <Link href="/collections" className="border-b border-pink-100 pb-4 shrink-0 hover:opacity-80 transition-opacity">Collections</Link>
              <Link href="/community" className="border-b border-pink-100 pb-4 shrink-0 hover:opacity-80 transition-opacity">Soft Life Queens</Link>
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
