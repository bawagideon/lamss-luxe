import { createClient } from "@/lib/supabase/server";
import { InfoForm } from "./InfoForm";

export default async function MyInfoPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  return (
    <div className="w-full max-w-2xl space-y-12">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter">
          MY INFO
        </h1>
      </div>

      {/* Image 3 Aesthetic: "ABOUT YOU" */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <h2 className="text-xl font-black tracking-tight uppercase">ABOUT YOU</h2>
          <button className="text-sm font-bold underline underline-offset-4">Edit</button>
        </div>

        <div className="space-y-0 divide-y divide-gray-100">
          {/* Instagram */}
          <div className="flex items-center justify-between py-4 group cursor-pointer hover:bg-gray-50 transition-colors px-2 rounded-md">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs" />
              <span className="text-sm font-bold text-gray-700">Add Instagram +</span>
            </div>
            <span className="text-xl font-light text-gray-400 group-hover:text-black transition-colors">+</span>
          </div>

          {/* TikTok */}
          <div className="flex items-center justify-between py-4 group cursor-pointer hover:bg-gray-50 transition-colors px-2 rounded-md">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white font-bold text-xs" />
              <span className="text-sm font-bold text-gray-700">Add TikTok +</span>
            </div>
            <span className="text-xl font-light text-gray-400 group-hover:text-black transition-colors">+</span>
          </div>

          {/* Twitter */}
          <div className="flex items-center justify-between py-4 group cursor-pointer hover:bg-gray-50 transition-colors px-2 rounded-md">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-sky-400 flex items-center justify-center text-white font-bold text-xs" />
              <span className="text-sm font-bold text-gray-700">Add Twitter +</span>
            </div>
            <span className="text-xl font-light text-gray-400 group-hover:text-black transition-colors">+</span>
          </div>

          {/* Birthday */}
          <div className="flex items-center justify-between py-4 group cursor-pointer hover:bg-gray-50 transition-colors px-2 rounded-md">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold text-xs">🎂</div>
              <div>
                <span className="text-sm font-bold text-gray-700 block">Add Birthday +</span>
                <span className="text-xs text-gray-400 block mt-0.5">We'll send you a surprise on your birthday! 🎉</span>
              </div>
            </div>
            <span className="text-xl font-light text-gray-400 group-hover:text-black transition-colors">+</span>
          </div>

          {/* Gender */}
          <div className="flex items-center justify-between py-4 group cursor-pointer hover:bg-gray-50 transition-colors px-2 rounded-md">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 font-bold text-xs">👤</div>
              <span className="text-sm font-bold text-gray-700">Add Gender +</span>
            </div>
            <span className="text-xl font-light text-gray-400 group-hover:text-black transition-colors">+</span>
          </div>
        </div>
      </div>

      {/* Interactive Form Component: "CONTACT DETAILS" */}
      <div className="pt-8">
        <InfoForm initialData={profile || {}} />
      </div>

    </div>
  );
}
