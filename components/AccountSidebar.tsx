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
  
  import { useEffect } from "react";
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);
  const supabase = createClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-background h-full relative">
      <div className="pt-6 pb-4 px-6">
        <h2 className="text-xl font-bold tracking-tight">Hi, {firstName}</h2>
      </div>
      <div className="px-4 mb-2"><div className="border-b border-border w-full" /></div>
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
                  ? "bg-accent text-accent-foreground border border-border" 
                  : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              <Icon 
                className={cn(
                  "w-5 h-5",
                  isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                )} 
                strokeWidth={1.5}
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 mt-auto border-t border-border">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-4 px-4 py-3 text-[13px] w-full font-bold text-red-600 hover:bg-red-500/10 rounded-md transition-all group"
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
      <div className="lg:hidden flex items-center justify-between p-4 bg-background border-b border-border">
        <span className="font-black tracking-widest uppercase text-foreground">My Account</span>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="p-2 -mr-2 text-foreground hover:bg-muted rounded-md transition"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Payload */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background top-[60px]">
          <SidebarContent />
        </div>
      )}

      {/* Desktop Sidebar Boundary */}
      <aside className="hidden lg:block w-72 shrink-0 border-r border-border min-h-[600px] h-full sticky top-[80px]">
        <SidebarContent />
      </aside>
    </>
  );
}
