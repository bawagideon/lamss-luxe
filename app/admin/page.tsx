"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, ShoppingBag, Package, Users } from "lucide-react";

// Mock Data
const recentOrders = [
  { id: "ORD-9021", customer: "Sarah Jenkins", date: "2026-03-19", amount: "$145.00", status: "Paid" },
  { id: "ORD-9022", customer: "Amara Okonkwo", date: "2026-03-18", amount: "$320.00", status: "Shipped" },
  { id: "ORD-9023", customer: "Chloe Davies", date: "2026-03-18", amount: "$85.00", status: "Pending" },
  { id: "ORD-9024", customer: "Vanessa Wu", date: "2026-03-17", amount: "$120.00", status: "Shipped" },
  { id: "ORD-9025", customer: "Elena Rostova", date: "2026-03-15", amount: "$290.00", status: "Paid" },
];

export default function AdminOverviewPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight">System Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Real-time metrics and recent operations.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-xl border-gray-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase text-gray-500">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-black" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tight">$45,231.89</div>
            <p className="text-xs text-green-600 mt-1 font-medium">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-gray-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase text-gray-500">Orders This Month</CardTitle>
            <ShoppingBag className="h-4 w-4 text-black" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tight">+350</div>
            <p className="text-xs text-green-600 mt-1 font-medium">+15.2% from last month</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-gray-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase text-gray-500">Active Products</CardTitle>
            <Package className="h-4 w-4 text-black" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tight">12</div>
            <p className="text-xs text-gray-400 mt-1 font-medium">3 low in stock</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-gray-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase text-gray-500">Waitlist Signups</CardTitle>
            <Users className="h-4 w-4 text-black" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tight">2,405</div>
            <p className="text-xs text-green-600 mt-1 font-medium">+180 this week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        <Card className="rounded-xl border-gray-100 shadow-sm col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-black uppercase tracking-tight">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-100">
                  <TableHead className="font-bold text-gray-500 uppercase text-xs">Order ID</TableHead>
                  <TableHead className="font-bold text-gray-500 uppercase text-xs">Customer</TableHead>
                  <TableHead className="font-bold text-gray-500 uppercase text-xs">Date</TableHead>
                  <TableHead className="font-bold text-gray-500 uppercase text-xs text-right">Amount</TableHead>
                  <TableHead className="font-bold text-gray-500 uppercase text-xs text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map((order) => (
                  <TableRow key={order.id} className="border-gray-50 group hover:bg-gray-50/50 transition-colors">
                    <TableCell className="font-medium text-black">{order.id}</TableCell>
                    <TableCell className="text-gray-600">{order.customer}</TableCell>
                    <TableCell className="text-gray-500">{order.date}</TableCell>
                    <TableCell className="text-right font-medium">{order.amount}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={order.status === "Paid" ? "default" : order.status === "Shipped" ? "secondary" : "outline"}
                        className={
                          order.status === "Paid" ? "bg-black text-white" : 
                          order.status === "Shipped" ? "bg-green-100 text-green-800" : 
                          "text-gray-500 border-gray-200"
                        }
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
