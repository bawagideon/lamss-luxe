"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect } from "react";
import { getAdminAllOrders, updateOrderStatus } from "@/app/actions/admin";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    getAdminAllOrders().then(setOrders);
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    await updateOrderStatus(orderId, newStatus);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight">Fulfillment Center</h1>
        <p className="text-gray-500 text-sm mt-1">Review orders and dispatch shipping updates.</p>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-100 hover:bg-transparent bg-gray-50/50">
              <TableHead className="font-bold text-gray-500 uppercase text-xs">Order ID</TableHead>
              <TableHead className="font-bold text-gray-500 uppercase text-xs">Customer</TableHead>
              <TableHead className="font-bold text-gray-500 uppercase text-xs">Items</TableHead>
              <TableHead className="font-bold text-gray-500 uppercase text-xs text-right">Amount</TableHead>
              <TableHead className="font-bold text-gray-500 uppercase text-xs text-right">Status</TableHead>
              <TableHead className="font-bold text-gray-500 uppercase text-xs text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 && (
              <TableRow>
                 <TableCell colSpan={6} className="text-center py-6 text-gray-500 font-medium">No active transactions.</TableCell>
              </TableRow>
            )}
            {orders.map((o: any) => (
              <TableRow key={o.id} className="border-gray-50 hover:bg-gray-50/50 transition-colors">
                <TableCell className="font-bold text-black">{o.id.slice(0, 8)}</TableCell>
                <TableCell>
                  <div className="font-medium text-black">Guest Customer</div>
                  <div className="text-xs text-gray-400">{o.customer_email || 'guest@anonymous.com'}</div>
                </TableCell>
                <TableCell className="text-gray-600 text-sm">See Stripe ID</TableCell>
                <TableCell className="text-right font-medium">${o.total_amount}</TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline" className={
                    o.status === "paid" ? "bg-black text-white" : 
                    o.status === "shipped" ? "bg-green-100 text-green-800 border-green-200" : 
                    "text-gray-500"
                  }>
                    {o.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Select value={o.status} onValueChange={(val) => handleStatusChange(o.id, val)}>
                    <SelectTrigger className="w-[130px] ml-auto h-8 text-xs border-gray-200 focus:ring-black">
                      <SelectValue placeholder="Update Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paid">Mark as Paid</SelectItem>
                      <SelectItem value="shipped">Mark as Shipped</SelectItem>
                      <SelectItem value="cancelled">Cancel Order</SelectItem>
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
