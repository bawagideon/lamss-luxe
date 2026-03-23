import { createClient } from "@/lib/supabase/server";

export default async function AccountOverview() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
      <h2 className="text-xl font-black uppercase mb-6 tracking-tight">Account Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
          <h3 className="text-[11px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Profile Details</h3>
          <div className="space-y-3 text-sm font-medium">
            <p className="flex justify-between border-b border-gray-200 pb-2"><span className="text-gray-500">Name</span> <span>{profile?.first_name} {profile?.last_name}</span></p>
            <p className="flex justify-between border-b border-gray-200 pb-2"><span className="text-gray-500">Email</span> <span>{profile?.email}</span></p>
            <p className="flex justify-between pb-1"><span className="text-gray-500">Phone</span> <span>{profile?.phone || "Not provided"}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
