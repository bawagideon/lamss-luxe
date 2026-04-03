"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { UserCircle, User, Gauge, Package, Edit, Bell, Star, Gift } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function UserProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
    });
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });
    return () => authListener.subscription.unsubscribe();
  }, [supabase.auth]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 250); // Small delay allows mouse to move into dropdown
  };

  const openAuth = (mode: "signIn" | "signUp") => {
    setIsOpen(false);
    // Dispatch custom event to AuthModal
    document.dispatchEvent(new CustomEvent("open-auth-modal", { detail: { mode } }));
  };

  const links = [
    { label: "Dashboard", href: "/account", icon: Gauge },
    { label: "My orders", href: "/account/orders", icon: Package },
    { label: "My Info", href: "/account/info", icon: Edit },
    { label: "Notifications", href: "/account/notifications", icon: Bell },
    { label: "Notify Me List", href: "/account/wishlist", icon: Star },
    { label: "Gift Cards", href: "/account/gift-cards", icon: Gift },
  ];

  return (
    <div 
      className="relative flex items-center h-full"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href="/account" className="hover:opacity-80 transition-opacity flex items-center h-full py-2" aria-label="Account">
        <UserCircle className="w-6 h-6 stroke-[1.5px]" />
      </Link>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute top-full right-0 mt-2 w-[320px] bg-white rounded-xl shadow-[0_15px_50px_rgba(0,0,0,0.12)] border border-gray-100 overflow-hidden z-50 pointer-events-auto"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Top Section: Auth Buttons or Profile info */}
            {user ? (
              <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Signed in as</p>
                <p className="font-bold text-[15px] truncate text-black">{user.email}</p>
                <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    window.location.reload();
                  }}
                  className="mt-4 w-full h-11 rounded-full border border-gray-200 font-bold text-[14px] hover:bg-white hover:border-gray-300 transition-colors text-black shadow-sm"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => openAuth("signIn")}
                    className="flex-1 h-11 rounded-full border border-black font-bold text-[14px] hover:bg-gray-50 transition-colors text-black"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => openAuth("signUp")}
                    className="flex-1 h-11 rounded-full bg-black text-white font-bold text-[14px] hover:bg-black/90 transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            )}

            {/* Links Section */}
            <div className="p-3">
              {links.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-4 px-4 py-3.5 hover:bg-gray-50 rounded-lg transition-colors group"
                  >
                    <Icon className="w-[18px] h-[18px] text-gray-500 group-hover:text-black transition-colors" />
                    <span className="text-[14px] font-bold text-gray-700 group-hover:text-black transition-colors">
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
