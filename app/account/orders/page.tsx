import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default async function OrdersPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*, products(*))")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12">
      
      {/* 
        Image 5 Reference: TRACK MY ORDER 
        Implementing the static visual representation of the zip code tracker 
      */}
      <div className="space-y-6">
        <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">
          TRACK MY ORDER
        </h1>
        
        <div className="bg-white p-6 md:p-8 border border-gray-100 rounded-xl shadow-sm">
          <h2 className="text-sm font-bold tracking-tight mb-4">Order Number</h2>
          <form className="space-y-4 max-w-xl flex flex-col">
            <input 
              disabled
              type="text" 
              placeholder="Enter your order number" 
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md text-sm placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors"
            />
            <input 
              disabled
              type="text" 
              placeholder="Enter the zip code you shipped the order to" 
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-md text-sm placeholder:text-gray-400 focus:outline-none focus:border-black transition-colors"
            />
            <button 
              disabled
              type="button"
              className="w-full py-3.5 bg-gray-100 text-gray-400 font-bold tracking-wide rounded-full text-sm cursor-not-allowed mt-4"
            >
              Continue
            </button>
          </form>
        </div>
      </div>

      {/* Actual Order History Table */}
      <div className="space-y-6 pt-4 border-t border-gray-100">
        <h2 className="text-2xl font-black uppercase tracking-tighter">
          ORDER HISTORY
        </h2>
        
        {!orders || orders.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-gray-500 font-medium text-sm">You haven&apos;t placed any orders yet.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div 
                key={order.id} 
                className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Order Header */}
                <div className="bg-gray-50 p-4 sm:p-6 border-b border-gray-100 flex flex-wrap gap-4 items-center justify-between">
                  <div>
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.1em]">Order Placed</span>
                    <p className="text-sm font-bold mt-1">{new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.1em]">Total</span>
                    <p className="text-sm font-bold mt-1">${order.total_amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.1em]">Order #</span>
                    <p className="text-sm font-bold mt-1">{order.id.slice(0,8)}...{order.id.slice(-4)}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-3">
                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {order.status || 'processing'}
                    </span>
                    <Button variant="outline" size="sm" className="hidden sm:flex text-xs font-bold uppercase tracking-wider h-8">
                      View Details
                    </Button>
                  </div>
                </div>

                {/* Items Preview */}
                <div className="p-4 sm:p-6">
                 {order.order_items && order.order_items.length > 0 ? (
                   <div className="flex gap-4 overflow-x-auto pb-2">
                     {order.order_items.map((item: { id: string, quantity: number, products: { image_main: string } }) => (
                       <div key={item.id} className="min-w-[80px] w-[80px]">
                         <div className="aspect-[3/4] bg-gray-100 rounded-md overflow-hidden relative">
                           {item.products?.image_main && (
                             <Image 
                               src={item.products.image_main} 
                               alt="Product"
                               fill 
                               className="absolute inset-0 w-full h-full object-cover" 
                             />
                           )}
                           <div className="absolute top-1 right-1 bg-white/90 text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                             {item.quantity}
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">No Items Detail</p>
                 )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
