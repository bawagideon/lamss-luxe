"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Truck, Users, Settings, Menu, X, LogOut, Camera, MessageSquare } from "lucide-react";
import { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { getPendingReviewsCount } from "@/app/actions/reviews";

const sidebarNavItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Products", href: "/admin/products", icon: ShoppingBag },
  { title: "Orders", href: "/admin/orders", icon: Truck },
  { title: "Customers", href: "/admin/customers", icon: Users },
  { title: "Reviews", href: "/admin/reviews", icon: MessageSquare, showBadge: true },
  { title: "Community", href: "/admin/community", icon: Camera },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      const count = await getPendingReviewsCount();
      setPendingCount(count);
    };
    fetchCount();
    // Refresh every 2 minutes or on mount
    const timer = setInterval(fetchCount, 120000);
    return () => clearInterval(timer);
  }, []);

  // If we are on the login page, don't show the sidebar navigation layout
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-background flex-col md:flex-row">
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between bg-card text-card-foreground p-4 border-b border-border">
        <span className="font-bold tracking-widest uppercase">Lamssé Admin</span>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={cn(
          "bg-card text-card-foreground w-full md:w-64 flex-col justify-between transition-transform duration-300 z-50 fixed md:sticky top-0 h-screen overflow-y-auto border-r border-border",
          mobileMenuOpen ? "flex" : "hidden md:flex"
        )}
      >
        <div>
          <div className="p-6 md:p-8 border-b border-border">
            <Link href="/admin" className="font-black text-xl tracking-widest uppercase hover:text-primary transition-colors">
              Lamssé Luxe
            </Link>
          </div>
          <nav className="p-4 space-y-1">
            {sidebarNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all group",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className={cn("w-5 h-5", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                  <span className="flex-1">{item.title}</span>
                  {item.showBadge && pendingCount > 0 && (
                    <span className={cn(
                        "ml-auto w-5 h-5 flex items-center justify-center text-[10px] font-black rounded-full",
                        isActive ? "bg-white text-primary" : "bg-primary text-primary-foreground"
                    )}>
                        {pendingCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-border">
          <button 
            onClick={() => {
              document.cookie = 'admin_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
              window.location.href = '/shop';
            }}
            className="flex w-full items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full p-6 md:p-10 pb-20 relative">
        <Toaster position="top-right" />
        <div className="max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
