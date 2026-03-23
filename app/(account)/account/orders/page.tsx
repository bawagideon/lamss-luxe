import { createClient } from "@/lib/supabase/server";

export default async function OrderHistory() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Query native order relations bound strictly to user.id
  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  return (
    <div className="bg-white rounded-2xl border border-border p-6 md:p-8 shadow-sm">
      <h2 className="text-xl font-black uppercase mb-6 tracking-tight">Order History</h2>
      
      {!orders || orders.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <p className="text-gray-500 font-medium text-sm">You haven&apos;t placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="border border-border rounded-xl p-5 md:p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-wrap gap-4 md:gap-8 items-center justify-between mb-4 pb-4 border-b border-border">
                <div>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.15em]">Order Number</p>
                  <p className="text-sm font-bold mt-1">#{order.id.slice(0, 8).toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.15em]">Date</p>
                  <p className="text-sm font-medium mt-1 text-gray-700">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.15em]">Total Amount</p>
                  <p className="text-sm font-black mt-1">${order.total_amount.toFixed(2)}</p>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {order.status || 'processing'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center text-sm font-medium text-gray-600">
                <p>Tracking the logistics pipeline. Further detailed manifests will render as the payload updates.</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
