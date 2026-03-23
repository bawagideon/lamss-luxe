import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AccountOverview() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  const name = profile?.first_name ? profile.first_name.toUpperCase() : "GUEST";

  // Fetch max 3 recent orders
  const { data: recentOrders } = await supabase
    .from("orders")
    .select("id, created_at, total_amount, status")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-12">
      {/* Primary Header */}
      <h1 className="text-4xl md:text-5xl lg:text-[56px] font-black uppercase tracking-tighter text-black">
        HI, {name}
      </h1>

      {/* Twin Column Arrays (Image 2 Aesthetic) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        
        {/* Wishlist Block */}
        <div className="space-y-4">
          <h2 className="text-xl font-black uppercase tracking-tight">WISHLIST</h2>
          
          <div className="flex gap-2">
            {/* Primary Image Stub */}
            <div className="flex-1 aspect-[3/4] bg-gray-200 rounded-md overflow-hidden relative">
              <div className="absolute inset-0 bg-gray-200" />
              {/* Optional: Hydrate actual item here in future */}
            </div>
            {/* Stacked Thumbnails Stub */}
            <div className="w-[30%] flex flex-col gap-2">
              <div className="flex-1 bg-gray-100 border border-gray-200 rounded-md" />
              <div className="flex-1 bg-gray-100 border border-gray-200 rounded-md" />
              <div className="flex-1 bg-gray-100 border border-gray-200 rounded-md" />
            </div>
          </div>
          
          <Link href="/account/wishlist" className="block w-full text-center py-3.5 border border-black rounded-full font-bold text-sm tracking-wide hover:bg-black hover:text-white transition-colors">
            View all
          </Link>
        </div>

        {/* Viewed Block */}
        <div className="space-y-4">
          <h2 className="text-xl font-black uppercase tracking-tight">VIEWED</h2>
          
          <div className="flex gap-2">
            {/* Primary Image Stub */}
            <div className="flex-1 aspect-[3/4] bg-gray-300 rounded-md overflow-hidden relative">
              <div className="absolute inset-0 bg-gray-300" />
            </div>
            {/* Stacked Thumbnails Stub */}
            <div className="w-[30%] flex flex-col gap-2">
              <div className="flex-1 bg-gray-100 border border-gray-200 rounded-md" />
              <div className="flex-1 bg-gray-100 border border-gray-200 rounded-md" />
              <div className="flex-1 bg-gray-100 border border-gray-200 rounded-md" />
            </div>
          </div>
          
          <Link href="/shop" className="block w-full text-center py-3.5 border border-black rounded-full font-bold text-sm tracking-wide hover:bg-black hover:text-white transition-colors">
            View all
          </Link>
        </div>

      </div>

      {/* Recent Orders Sneak Peak (Requested Component Integration) */}
      <div className="pt-8 border-t border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black uppercase tracking-tight">Recent Orders</h2>
          <Link href="/account/orders" className="text-sm font-bold underline underline-offset-4 text-gray-500 hover:text-black">
            See History
          </Link>
        </div>
        <div className="bg-white border rounded-xl overflow-hidden mt-6 shadow-sm">
          {!recentOrders || recentOrders.length === 0 ? (
            <div className="bg-gray-50 border-gray-200 p-8 text-center border-dashed border">
              <p className="text-sm font-medium text-gray-500">Track your order pipelines instantly directly from your Dashboard.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <div key={order.id} className="p-4 sm:p-6 flex flex-wrap gap-4 items-center justify-between hover:bg-gray-50 transition-colors">
                  <div>
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.1em]">Order #{order.id.slice(0, 8)}</p>
                    <p className="text-sm font-medium mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.1em]">Total</span>
                    <p className="text-sm font-bold mt-1">${order.total_amount.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {order.status || 'processing'}
                    </span>
                    <Link href="/account/orders" className="text-sm font-bold underline text-gray-400 hover:text-black">
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
