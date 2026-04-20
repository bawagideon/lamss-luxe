"use client";

import { useEffect, useState } from "react";
import { getAdminAllOrders, updateOrderStatus } from "@/app/actions/admin";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, MapPin, Phone, Mail, Package, ExternalLink } from "lucide-react";
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

interface Order {
  id: string;
  customer_email: string;
  total_amount: number;
  subtotal?: number;
  shipping_cost?: number;
  status: string;
  created_at: string;
  shipping_address?: Address | null;
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
    const lines = [
      addr.name,
      addr.line1,
      addr.line2,
      `${addr.city}, ${addr.state || ''} ${addr.postal_code || ''}`,
      addr.country
    ].filter(Boolean);
    return lines.join('\n');
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">Fulfillment Center</h1>
          <p className="text-gray-500 text-sm mt-1 uppercase tracking-widest font-medium">Verify payments & dispatch shipping updates.</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="rounded-none border-black/10 bg-black/5 px-4 py-2 text-[10px] font-black uppercase tracking-widest">
            {orders.length} Total Orders
          </Badge>
        </div>
      </div>

      <div className="bg-card text-card-foreground border border-border shadow-sm rounded-none overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-100 hover:bg-transparent bg-gray-50/50">
              <TableHead className="font-bold text-gray-500 uppercase text-xs">Order ID</TableHead>
              <TableHead className="font-bold text-gray-500 uppercase text-xs">Customer Name</TableHead>
              <TableHead className="font-bold text-gray-500 uppercase text-xs">Destination</TableHead>
              <TableHead className="font-bold text-gray-500 uppercase text-xs text-right">Amount</TableHead>
              <TableHead className="font-bold text-gray-500 uppercase text-xs text-right">Status</TableHead>
              <TableHead className="font-bold text-gray-500 uppercase text-xs text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 && (
              <TableRow>
                 <TableCell colSpan={6} className="text-center py-12 text-gray-400 font-medium italic">No active transactions found.</TableCell>
              </TableRow>
            )}
            {orders.map((o) => (
              <TableRow key={o.id} className="border-gray-50 hover:bg-gray-50/50 transition-colors">
                <TableCell className="font-bold text-black">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button 
                        className="hover:underline flex items-center gap-1 group text-black translate-y-0 active:scale-95 transition-all text-sm"
                      >
                        #{o.id.slice(0, 8)} 
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] rounded-none border-black border-2 outline-none p-0 overflow-hidden">
                      <div className="bg-black text-white p-6">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-black uppercase tracking-tighter italic flex items-center gap-2">
                            <Package className="w-6 h-6" /> Order Detail
                          </DialogTitle>
                        </DialogHeader>
                        <p className="text-[10px] uppercase tracking-[0.3em] font-bold mt-2 opacity-70">Reference: {o.id}</p>
                      </div>
                      
                      <div className="p-6 space-y-8">
                        {/* Status Guard */}
                        <div className={cn(
                          "p-3 text-center font-black uppercase tracking-widest text-xs border",
                          o.status === "paid" ? "bg-green-50 text-green-700 border-green-200" : 
                          o.status === "shipped" ? "bg-black text-white border-black" : 
                          "bg-gray-50 text-gray-500 border-gray-200"
                        )}>
                          Status: {o.status.toUpperCase()}
                        </div>

                        {/* Customer Info Card */}
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Customer Identity</h4>
                          <div className="grid grid-cols-1 gap-4">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                <Mail className="w-5 h-5 text-gray-500" />
                              </div>
                              <div>
                                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Email Address</p>
                                <p className="text-sm font-bold">{o.customer_email}</p>
                              </div>
                            </div>
                            {o.shipping_address?.phone && o.shipping_address.phone !== 'N/A' && (
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                  <Phone className="w-5 h-5 text-gray-500" />
                                </div>
                                <div>
                                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Contact Phone</p>
                                  <p className="text-sm font-bold">{o.shipping_address.phone}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Shipping Destination */}
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                          <div className="flex justify-between items-center">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Shipping Destination</h4>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              disabled={!o.shipping_address}
                              onClick={() => copyToClipboard(formatAddress(o.shipping_address || null))}
                              className="h-8 text-[10px] uppercase font-bold border-black hover:bg-black hover:text-white rounded-none transition-all"
                            >
                              <Copy className="w-3 h-3 mr-2" /> Copy Address
                            </Button>
                          </div>
                          
                          <div className="bg-gray-50 p-5 border border-gray-200 relative group">
                            <MapPin className="absolute top-5 right-5 w-5 h-5 text-gray-300" />
                            {o.shipping_address ? (
                              <div className="space-y-1 font-medium text-sm leading-relaxed text-gray-800">
                                <p className="font-black uppercase text-xs mb-3 text-black tracking-tight">{o.shipping_address.name}</p>
                                <p>{o.shipping_address.line1}</p>
                                {o.shipping_address.line2 && <p>{o.shipping_address.line2}</p>}
                                <p>{o.shipping_address.city}, {o.shipping_address.state} {o.shipping_address.postal_code}</p>
                                <p className="font-bold uppercase text-[11px] mt-2 block">{o.shipping_address.country}</p>
                              </div>
                            ) : (
                              <p className="text-sm text-gray-400 italic">No localized shipping details captured for this order.</p>
                            )}
                          </div>
                        </div>

                        {/* Financial Summary Card */}
                        <div className="pt-6 border-t border-gray-100 space-y-3">
                           <div className="flex justify-between items-center text-sm">
                              <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Subtotal</p>
                              <p className="font-bold">${(o.subtotal || 0).toFixed(2)}</p>
                           </div>
                           <div className="flex justify-between items-center text-sm">
                              <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest">Shipping</p>
                              <p className="font-bold">${(o.shipping_cost || 0).toFixed(2)}</p>
                           </div>
                           <div className="h-px bg-gray-100 w-full" />
                           <div className="flex justify-between items-end">
                              <div>
                                 <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Grand Total</p>
                                 <p className="text-4xl font-black italic tracking-tighter">${o.total_amount}</p>
                              </div>
                              <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2 rounded-none uppercase text-[10px] tracking-widest font-black flex items-center gap-2 mb-1">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                Secured via Stripe
                              </Badge>
                           </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <TableCell>
                  <div className="font-bold text-black uppercase tracking-tight text-sm">{o.shipping_address?.name || 'Guest Customer'}</div>
                  <div className="text-[10px] text-gray-400 font-medium">{o.customer_email || 'guest@anonymous.com'}</div>
                </TableCell>
                <TableCell className="text-gray-500 text-[11px] font-medium uppercase tracking-wider">
                  {o.shipping_address?.city ? `${o.shipping_address.city}, ${o.shipping_address.country}` : 'Processing...'}
                </TableCell>
                <TableCell className="text-right font-black text-lg italic tracking-tighter">${o.total_amount}</TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline" className={cn(
                    "rounded-none uppercase text-[9px] font-black tracking-widest px-2.5 py-0.5",
                    o.status === "paid" ? "bg-black text-white border-black" : 
                    o.status === "shipped" ? "bg-green-100 text-green-800 border-green-200" : 
                    "text-gray-400 border-gray-200"
                  )}>
                    {o.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Select value={o.status} onValueChange={(val) => handleStatusChange(o.id, val)}>
                    <SelectTrigger className="w-[120px] ml-auto h-8 text-[10px] font-black uppercase tracking-widest border-border bg-white rounded-none focus:ring-black">
                      <SelectValue placeholder="Action" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none border-black">
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
