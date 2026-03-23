import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { User, Package, Settings, Bell, Heart, CreditCard } from "lucide-react";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  // Strict Protection Boundary
  if (error || !user) {
    redirect("/");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name")
    .eq("id", user.id)
    .single();

  const navItems = [
    { name: "Dashboard", href: "/account", icon: User },
    { name: "My orders", href: "/account/orders", icon: Package },
    { name: "My Info", href: "/account/info", icon: Settings },
    { name: "Notifications", href: "/account/notifications", icon: Bell },
    { name: "Notify Me List", href: "/account/notify-list", icon: Heart },
    { name: "Gift Cards", href: "/account/gift-cards", icon: CreditCard },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 pb-16">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Left Navigation Sidebar (Image 4 Aesthetic) */}
          <aside className="w-full lg:w-64 shrink-0">
            <h1 className="text-2xl font-black uppercase tracking-tight mb-8">
              Hello, {profile?.first_name || "Guest"}
            </h1>
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-4 px-4 py-3 text-sm font-bold text-gray-600 hover:text-black hover:bg-white rounded-xl transition-all"
                  >
                    <Icon className="w-5 h-5" strokeWidth={2} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            {/* Native Sync Wishlist Trigger Script Payload (SSR Executed) */}
            <SyncWishlistNode userId={user.id} />
          </aside>

          {/* Dynamic Render Payload */}
          <main className="flex-1">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}

// Client-side injection strictly for parsing localStorage arrays and firing mutations into the Supabase pipeline
import { SyncWishlistNode } from "./SyncWishlistNode";
