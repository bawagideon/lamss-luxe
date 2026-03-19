"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ShoppingBag, Truck, Users, Settings, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const sidebarNavItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Products", href: "/admin/products", icon: ShoppingBag },
  { title: "Orders", href: "/admin/orders", icon: Truck },
  { title: "Customers", href: "/admin/customers", icon: Users },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If we are on the login page, don't show the sidebar navigation layout
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 flex-col md:flex-row">
      {/* Mobile Topbar */}
      <div className="md:hidden flex items-center justify-between bg-black p-4 text-white">
        <span className="font-bold tracking-widest uppercase">Lamssé Admin</span>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={cn(
          "bg-black text-white w-full md:w-64 flex-col justify-between transition-transform duration-300 z-50 fixed md:sticky top-0 h-screen overflow-y-auto",
          mobileMenuOpen ? "flex" : "hidden md:flex"
        )}
      >
        <div>
          <div className="p-6 md:p-8 border-b border-gray-800">
            <Link href="/admin" className="font-black text-xl tracking-widest uppercase hover:text-gray-300 transition-colors">
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
                      ? "bg-white text-black"
                      : "text-gray-400 hover:bg-gray-900 hover:text-white"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className={cn("w-5 h-5", isActive ? "text-black" : "text-gray-400 group-hover:text-white")} />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-800">
          <button className="flex w-full items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-900 hover:text-white transition-all">
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full p-6 md:p-10 pb-20">
        <div className="max-w-6xl mx-auto w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
