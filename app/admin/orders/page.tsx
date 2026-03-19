"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock Data
const mockOrders = [
  { id: "ORD-9021", customer: "Sarah Jenkins", email: "sarah@example.com", items: "1x Soft Life Slip Dress", amount: "$120.00", date: "2026-03-19", status: "Paid" },
  { id: "ORD-9022", customer: "Amara Okonkwo", email: "amara.ok@example.com", items: "2x Luxe Corset Top", amount: "$170.00", date: "2026-03-18", status: "Shipped" },
  { id: "ORD-9023", customer: "Chloe Davies", email: "chloe@example.com", items: "1x Midnight Silk Two-Piece", amount: "$145.00", date: "2026-03-18", status: "Pending" },
  { id: "ORD-9024", customer: "Vanessa Wu", email: "vwu99@example.com", items: "1x Soft Life Slip Dress", amount: "$120.00", date: "2026-03-17", status: "Paid" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(mockOrders);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    // In production, this would fire an async Server Action to update Supabase row
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
            {orders.map((o) => (
              <TableRow key={o.id} className="border-gray-50 hover:bg-gray-50/50 transition-colors">
                <TableCell className="font-bold text-black">{o.id}</TableCell>
                <TableCell>
                  <div className="font-medium text-black">{o.customer}</div>
                  <div className="text-xs text-gray-400">{o.email}</div>
                </TableCell>
                <TableCell className="text-gray-600 text-sm">{o.items}</TableCell>
                <TableCell className="text-right font-medium">{o.amount}</TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline" className={
                    o.status === "Paid" ? "bg-black text-white" : 
                    o.status === "Shipped" ? "bg-green-100 text-green-800 border-green-200" : 
                    "text-gray-500"
                  }>
                    {o.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Select value={o.status} onValueChange={(val) => handleStatusChange(o.id, val)}>
                    <SelectTrigger className="w-[130px] ml-auto h-8 text-xs border-gray-200 focus:ring-black">
                      <SelectValue placeholder="Update Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Paid">Mark as Paid</SelectItem>
                      <SelectItem value="Shipped">Mark as Shipped</SelectItem>
                      <SelectItem value="Cancelled">Cancel Order</SelectItem>
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
