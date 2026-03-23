"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LogOut, 
  Menu, 
  X,
  LayoutDashboard,
  PackageSearch,
  FileEdit,
  Bell,
  Star,
  Gift
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const sidebarLinks = [
  { name: "Dashboard", href: "/account", icon: LayoutDashboard },
  { name: "My orders", href: "/account/orders", icon: PackageSearch },
  { name: "My Info", href: "/account/info", icon: FileEdit },
  { name: "Notifications", href: "/account/notifications", icon: Bell },
  { name: "Notify Me List", href: "/account/wishlist", icon: Star },
  { name: "Gift Cards", href: "/account/gift-cards", icon: Gift },
];

export function AccountSidebar({ firstName = "Guest" }: { firstName?: string }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const supabase = createClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white h-full relative">
      <div className="pt-6 pb-4 px-6">
        <h2 className="text-xl font-bold tracking-tight">Hi, {firstName}</h2>
      </div>
      <div className="px-4 mb-2"><div className="border-b border-gray-100 w-full" /></div>
      <nav className="flex-1 space-y-2 py-2 px-2">
        {sidebarLinks.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-4 px-4 py-3 text-[13px] font-black tracking-wide rounded-md transition-all group",
                isActive 
                  ? "bg-gray-50 text-black border border-gray-100" 
                  : "text-gray-900 hover:bg-gray-50/80 hover:text-black"
              )}
            >
              <Icon 
                className={cn(
                  "w-5 h-5",
                  isActive ? "text-black" : "text-gray-900 group-hover:text-black"
                )} 
                strokeWidth={1.5}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-gray-100">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-4 px-4 py-3 text-[13px] w-full font-bold text-red-600 hover:bg-red-50 rounded-md transition-all group"
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform text-red-500" strokeWidth={1.5} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Hamburger Handle */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <span className="font-black tracking-widest uppercase">My Account</span>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="p-2 -mr-2 text-black hover:bg-gray-50 rounded-md transition"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Payload */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-white top-[60px]">
          <SidebarContent />
        </div>
      )}

      {/* Desktop Sidebar Boundary */}
      <aside className="hidden lg:block w-72 shrink-0 border-r border-gray-100 min-h-[600px] h-full sticky top-[80px]">
        <SidebarContent />
      </aside>
    </>
  );
}
