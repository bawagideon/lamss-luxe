import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AccountSidebar } from "@/components/AccountSidebar";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/");
  }

  // Fetch Name for Sidebar Prop
  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-screen bg-background pt-[80px] lg:pt-[100px]">
      <div className="container mx-auto px-0 lg:px-6">
        <div className="flex flex-col lg:flex-row min-h-[calc(100dvh-100px)]">
          
          <AccountSidebar firstName={profile?.first_name || "Guest"} />

          <main className="flex-1 lg:pl-8 p-4 lg:p-8">
            {children}
          </main>

        </div>
      </div>
    </div>
  );
}
