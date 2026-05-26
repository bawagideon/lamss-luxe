"use client";

import { useEffect, useState, useTransition } from "react";
import { getAdminAllOrders, updateOrderStatus, updateOrderTracking } from "@/app/actions/admin";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, MapPin, Phone, Mail, Package, ExternalLink, User, Heart } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface Address {
  name: string;
  line1: string;
  line2?: string | null;
  city: string;
  state?: string | null;
  postal_code: string;
  country: string;
  phone?: string | null;
}

interface Product {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  color_images?: Record<string, { main: string | null; front: string | null; side: string | null; back: string | null }>;
}

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price_at_purchase: number;
  price?: number;
  selected_size?: string | null;
  selected_color?: string | null;
  products?: Product | null;
}

interface Profile {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
  wishlist?: string[] | null;
  created_at?: string | null;
}

interface Order {
  id: string;
  customer_email: string;
  total_amount: number;
  subtotal?: number;
  shipping_cost?: number;
  status: string;
  order_status?: string | null;
  tracking_number?: string | null;
  tracking_carrier?: string | null;
  created_at: string;
  shipping_address?: Address | null;
  user_id?: string | null;
  order_items?: OrderItem[];
  profile?: Profile | null;
}

function OrderFulfillmentCard({
  orderId,
  initialStatus,
  initialTracking,
  initialCarrier,
  onSuccess
}: {
  orderId: string;
  initialStatus: string;
  initialTracking: string;
  initialCarrier: string;
  onSuccess: () => void;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [trackingNum, setTrackingNum] = useState(initialTracking);
  const [carrier, setCarrier] = useState(initialCarrier);
  const [isPending, startTransition] = useTransition();

  const handleUpdate = () => {
    startTransition(async () => {
      const res = await updateOrderTracking(orderId, status, trackingNum, carrier);
      if (res && res.success) {
        toast.success("Order Fulfillment Updated Successfully", {
          style: { borderRadius: '0px', background: '#000', color: '#fff' }
        });
        onSuccess();
      } else {
        toast.error(res?.error || "Failed to update fulfillment");
      }
    });
  };

  return (
    <div className="space-y-4 bg-zinc-900/40 p-4 border border-zinc-800">
      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Order Fulfillment</h4>
      
      <div className="grid grid-cols-1 gap-3">
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase tracking-wider text-zinc-500">Shipment Status</label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-10 text-xs font-bold uppercase tracking-wider border-zinc-800 bg-zinc-900 text-zinc-100 rounded-none focus:ring-zinc-700">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-zinc-800 bg-zinc-900 text-zinc-100">
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Shipped">Shipped</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase tracking-wider text-zinc-500">Courier Carrier</label>
          <Input 
            value={carrier} 
            onChange={(e) => setCarrier(e.target.value)} 
            placeholder="e.g. Canada Post, DHL"
            className="h-10 text-xs font-bold border-zinc-800 bg-zinc-900 text-zinc-100 rounded-none focus-visible:ring-zinc-700"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase tracking-wider text-zinc-500">Tracking Number</label>
          <Input 
            value={trackingNum} 
            onChange={(e) => setTrackingNum(e.target.value)} 
            placeholder="Courier Tracking Reference"
            className="h-10 text-xs font-bold border-zinc-800 bg-zinc-900 text-zinc-100 rounded-none focus-visible:ring-zinc-700"
          />
        </div>

        <Button 
          onClick={handleUpdate} 
          disabled={isPending}
          className="w-full bg-zinc-100 text-black hover:bg-zinc-200 rounded-none h-10 text-[10px] font-black uppercase tracking-widest transition-all mt-2"
        >
          {isPending ? "Updating Fulfillment..." : "Update Fulfillment & Save"}
        </Button>
      </div>
    </div>
  );
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    getAdminAllOrders().then(setOrders);
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    await updateOrderStatus(orderId, newStatus);
  };

  const copyToClipboard = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast.success("Address copied for fulfillment!", {
      icon: '📋',
      style: { borderRadius: '0px', background: '#000', color: '#fff' }
    });
  };

  const formatAddress = (addr: Address | null) => {
    if (!addr) return "";
    const cityStateZip = [
      [addr.city, addr.state].filter(Boolean).join(', '),
      addr.postal_code
    ].filter(Boolean).join(' ');

    const lines = [
      addr.name,
      addr.line1,
      addr.line2,
      cityStateZip,
      addr.country
    ].filter(Boolean);
    return lines.join('\n');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-zinc-100">Fulfillment Center</h1>
          <p className="text-zinc-500 text-sm mt-1 uppercase tracking-widest font-medium">Verify payments & dispatch shipping updates.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="rounded-none border-zinc-800 bg-zinc-900/60 text-zinc-300 px-4 py-2 text-[10px] font-black uppercase tracking-widest">
            {orders.length} Total Orders
          </Badge>
        </div>
      </div>

      <div className="bg-zinc-950 text-zinc-100 border border-zinc-800 shadow-sm rounded-none overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-transparent bg-zinc-900/40">
              <TableHead className="font-black text-zinc-400 uppercase text-[10px] tracking-widest border-zinc-800">Order ID</TableHead>
              <TableHead className="font-black text-zinc-400 uppercase text-[10px] tracking-widest border-zinc-800">Customer Name</TableHead>
              <TableHead className="font-black text-zinc-400 uppercase text-[10px] tracking-widest border-zinc-800">Destination</TableHead>
              <TableHead className="font-black text-zinc-400 uppercase text-[10px] tracking-widest border-zinc-800 text-right">Amount</TableHead>
              <TableHead className="font-black text-zinc-400 uppercase text-[10px] tracking-widest border-zinc-800 text-right">Status</TableHead>
              <TableHead className="font-black text-zinc-400 uppercase text-[10px] tracking-widest border-zinc-800 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 && (
              <TableRow>
                 <TableCell colSpan={6} className="text-center py-12 text-zinc-500 font-medium italic border-zinc-800">No active transactions found.</TableCell>
              </TableRow>
            )}
            {orders.map((o) => (
              <TableRow key={o.id} className="border-zinc-900 hover:bg-zinc-900/20 transition-colors">
                <TableCell className="font-bold text-zinc-100 border-zinc-800">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button 
                        className="hover:underline flex items-center gap-1 group text-zinc-300 translate-y-0 active:scale-95 transition-all text-sm font-bold"
                      >
                        #{o.id.slice(0, 8)} 
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto rounded-none border border-zinc-800 bg-zinc-950 text-zinc-100 outline-none p-0 overflow-hidden">
                      <div className="bg-zinc-900 text-zinc-100 p-6 border-b border-zinc-800">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic flex items-center gap-2">
                            <Package className="w-6 h-6 text-zinc-100" /> Order Detail
                          </DialogTitle>
                          <DialogDescription className="text-[10px] uppercase tracking-[0.3em] font-bold mt-2 text-zinc-400">Reference: {o.id}</DialogDescription>
                        </DialogHeader>
                      </div>
                      
                      <div className="p-6 space-y-8">
                        {/* Status Guard */}
                        <div className={cn(
                          "p-3 text-center font-black uppercase tracking-widest text-xs border rounded-none",
                          o.status === "paid" ? "bg-green-950/20 text-green-400 border-green-900/50" : 
                          o.status === "shipped" ? "bg-zinc-100 text-black border-zinc-200" : 
                          "bg-zinc-900 text-zinc-400 border-zinc-800"
                        )}>
                          Status: {o.status.toUpperCase()}
                        </div>

                        {/* Customer Info Card */}
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Customer Identity</h4>
                          <div className="grid grid-cols-1 gap-4">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
                                <Mail className="w-5 h-5 text-zinc-400" />
                              </div>
                              <div>
                                <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Email Address</p>
                                <p className="text-sm font-bold text-zinc-100">{o.customer_email}</p>
                              </div>
                            </div>
                            {o.shipping_address?.phone && o.shipping_address.phone !== 'N/A' && (
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
                                  <Phone className="w-5 h-5 text-zinc-400" />
                                </div>
                                <div>
                                  <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Contact Phone</p>
                                  <p className="text-sm font-bold text-zinc-100">{o.shipping_address.phone}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Customer CRM Profile (Registered vs Guest) */}
                        <div className="space-y-4 pt-4 border-t border-zinc-800">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Customer CRM Profile</h4>
                          {o.profile ? (
                            <div className="p-4 bg-zinc-900/40 border border-zinc-800 space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 rounded-full bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                                    <User className="w-4 h-4 text-zinc-400" />
                                  </div>
                                  <div>
                                    <p className="text-xs font-black uppercase tracking-tight text-zinc-100">
                                      {o.profile.first_name} {o.profile.last_name}
                                    </p>
                                    <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Registered Client</p>
                                  </div>
                                </div>
                                <Badge className="bg-zinc-100 text-black border border-zinc-200 rounded-none text-[8px] font-black tracking-widest uppercase">
                                  Member
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 gap-4 text-[10px] font-bold text-zinc-400 border-t border-zinc-800/60 pt-3">
                                <div className="space-y-1">
                                  <span className="uppercase text-[8px] text-zinc-500 tracking-wider block">Registered Since</span>
                                  <span className="text-zinc-200">
                                    {new Date(o.profile.created_at || '').toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric'
                                    })}
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  <span className="uppercase text-[8px] text-zinc-500 tracking-wider block">Active Wishlist</span>
                                  <span className="text-zinc-200 flex items-center gap-1">
                                    <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                                    {o.profile.wishlist?.length || 0} items saved
                                  </span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="p-4 bg-zinc-900/20 border border-dashed border-zinc-800/80 flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-zinc-950 border border-zinc-800/60 flex items-center justify-center">
                                <User className="w-4 h-4 text-zinc-600" />
                              </div>
                              <div>
                                <p className="text-xs font-black uppercase tracking-tight text-zinc-500">Anonymous Guest</p>
                                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">No registered profile matching this transaction</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Ordered Outfits List */}
                        <div className="space-y-4 pt-4 border-t border-zinc-800">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Ordered Outfits</h4>
                          <div className="space-y-3">
                            {o.order_items && o.order_items.length > 0 ? (
                              o.order_items.map((item) => {
                                // Resolve variant-specific main image if available
                                const variantImage = item.selected_color && item.products?.color_images?.[item.selected_color]?.main;
                                const itemImageUrl = variantImage || item.products?.image_url || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop";

                                return (
                                  <div key={item.id} className="flex gap-4 p-3 bg-zinc-900/40 border border-zinc-800">
                                    <div className="relative w-16 h-20 bg-zinc-950 border border-zinc-800 flex-shrink-0 overflow-hidden">
                                      <Image
                                        src={itemImageUrl}
                                        alt={item.products?.name || "Outfit Piece"}
                                        fill
                                        className="object-cover"
                                        sizes="64px"
                                      />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between py-1">
                                      <div>
                                        <h5 className="text-xs font-black uppercase tracking-tight text-zinc-100 line-clamp-1">
                                          {item.products?.name || "Luxury Piece"}
                                        </h5>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                          {item.selected_size && (
                                            <Badge variant="outline" className="rounded-none px-2 py-0.5 text-[9px] font-bold border-zinc-800 bg-zinc-950 text-zinc-300">
                                              SIZE: {item.selected_size}
                                            </Badge>
                                          )}
                                          {item.selected_color && (
                                            <Badge variant="outline" className="rounded-none px-2 py-0.5 text-[9px] font-bold border-zinc-800 bg-zinc-950 text-zinc-300">
                                              COLOR: {item.selected_color}
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex justify-between items-end text-[11px] font-bold text-zinc-400">
                                        <p>Quantity: {item.quantity}</p>
                                        <p className="text-zinc-100">${(item.price_at_purchase || item.price || 0).toFixed(2)} each</p>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <p className="text-xs text-zinc-500 italic">No line items captured for this order.</p>
                            )}
                          </div>
                        </div>

                        {/* Shipping Destination */}
                        <div className="space-y-4 pt-4 border-t border-zinc-800">
                          <div className="flex justify-between items-center">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Shipping Destination</h4>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              disabled={!o.shipping_address}
                              onClick={() => copyToClipboard(formatAddress(o.shipping_address || null))}
                              className="h-8 text-[10px] uppercase font-bold border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white rounded-none transition-all"
                            >
                              <Copy className="w-3 h-3 mr-2" /> Copy Address
                            </Button>
                          </div>
                          
                          <div className="bg-zinc-900/60 p-5 border border-zinc-800 relative group">
                            <MapPin className="absolute top-5 right-5 w-5 h-5 text-zinc-700" />
                            {o.shipping_address ? (
                              <div className="space-y-1 font-medium text-sm leading-relaxed text-zinc-300">
                                <p className="font-black uppercase text-xs mb-3 text-zinc-100 tracking-tight">{o.shipping_address.name}</p>
                                {o.shipping_address.line1 && <p>{o.shipping_address.line1}</p>}
                                {o.shipping_address.line2 && <p>{o.shipping_address.line2}</p>}
                                {(o.shipping_address.city || o.shipping_address.state || o.shipping_address.postal_code) && (
                                  <p>
                                    {[o.shipping_address.city, o.shipping_address.state].filter(Boolean).join(', ')}
                                    {o.shipping_address.postal_code ? ` ${o.shipping_address.postal_code}` : ''}
                                  </p>
                                )}
                                {o.shipping_address.country && <p className="font-bold uppercase text-[11px] mt-2 block text-zinc-100">{o.shipping_address.country}</p>}
                              </div>
                            ) : (
                              <p className="text-sm text-zinc-500 italic">No localized shipping details captured for this order.</p>
                            )}
                          </div>
                        </div>

                        {/* Order Fulfillment Section */}
                        <div className="pt-6 border-t border-zinc-800">
                          <OrderFulfillmentCard
                            orderId={o.id}
                            initialStatus={o.order_status || o.status || 'Processing'}
                            initialTracking={o.tracking_number || ''}
                            initialCarrier={o.tracking_carrier || 'Canada Post'}
                            onSuccess={() => {
                              getAdminAllOrders().then(setOrders);
                            }}
                          />
                        </div>

                        {/* Financial Summary Card */}
                        <div className="pt-6 border-t border-zinc-800 space-y-3">
                           <div className="flex justify-between items-center text-sm">
                              <p className="text-[10px] uppercase font-black text-zinc-500 tracking-widest">Subtotal</p>
                              <p className="font-bold text-zinc-100">${(o.subtotal || 0).toFixed(2)}</p>
                           </div>
                           <div className="flex justify-between items-center text-sm">
                              <p className="text-[10px] uppercase font-black text-zinc-500 tracking-widest">Shipping</p>
                              <p className="font-bold text-zinc-100">${(o.shipping_cost || 0).toFixed(2)}</p>
                           </div>
                           <div className="h-px bg-zinc-800 w-full" />
                           <div className="flex justify-between items-end">
                              <div>
                                 <p className="text-[10px] uppercase font-black text-zinc-500 tracking-widest mb-1">Grand Total</p>
                                 <p className="text-4xl font-black italic tracking-tighter text-zinc-100">${o.total_amount}</p>
                              </div>
                              <Badge className="bg-green-950/40 text-green-400 border-green-900/50 px-4 py-2 rounded-none uppercase text-[10px] tracking-widest font-black flex items-center gap-2 mb-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                Secured via Stripe
                              </Badge>
                           </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <TableCell className="border-zinc-800">
                  <div className="font-bold text-zinc-100 uppercase tracking-tight text-sm">{o.shipping_address?.name || 'Guest Customer'}</div>
                  <div className="text-[10px] text-zinc-500 font-medium">{o.customer_email || 'guest@anonymous.com'}</div>
                </TableCell>
                <TableCell className="text-zinc-400 text-[11px] font-medium uppercase tracking-wider border-zinc-800">
                  {o.shipping_address?.city ? `${o.shipping_address.city}, ${o.shipping_address.country}` : 'Processing...'}
                </TableCell>
                <TableCell className="text-right font-black text-lg italic tracking-tighter text-zinc-100 border-zinc-800">${o.total_amount}</TableCell>
                <TableCell className="text-right border-zinc-800">
                  <Badge variant="outline" className={cn(
                    "rounded-none uppercase text-[9px] font-black tracking-widest px-2.5 py-0.5 border",
                    o.status === "paid" ? "bg-zinc-100 text-black border-zinc-200" : 
                    o.status === "shipped" ? "bg-green-950/40 text-green-400 border-green-900/50" : 
                    "text-zinc-400 border-zinc-800"
                  )}>
                    {o.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right border-zinc-800">
                  <Select value={o.status} onValueChange={(val) => handleStatusChange(o.id, val)}>
                    <SelectTrigger className="w-[120px] ml-auto h-8 text-[10px] font-black uppercase tracking-widest border-zinc-800 bg-zinc-900 text-zinc-100 rounded-none focus:ring-zinc-700">
                      <SelectValue placeholder="Action" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none border-zinc-800 bg-zinc-900 text-zinc-100">
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Mark Paid</SelectItem>
                      <SelectItem value="shipped">Mark Shipped</SelectItem>
                      <SelectItem value="cancelled">Cancel</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
