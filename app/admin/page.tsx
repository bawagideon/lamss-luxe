"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, ShoppingBag, Package, Users, Percent, Gift, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { getAdminMetrics, getAdminRecentOrders, getAdminPromoMetrics } from "@/app/actions/admin";

interface Order {
  id: string;
  customer_email: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export default function AdminOverviewPage() {
  const [metrics, setMetrics] = useState({ totalRevenue: "0.00", ordersCount: 0, activeProducts: 0, waitlistCount: 0 });
  const [orders, setOrders] = useState<Order[]>([]);
  const [promoMetrics, setPromoMetrics] = useState({ discountedOrders: 0, totalSavings: 0, revenueImpact: 0 });

  useEffect(() => {
    getAdminMetrics().then(setMetrics);
    getAdminRecentOrders().then(setOrders);
    getAdminPromoMetrics().then(setPromoMetrics);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight">System Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Real-time metrics and recent operations.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="rounded-xl border-gray-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tight">${metrics.totalRevenue}</div>
            <p className="text-xs text-green-600 mt-1 font-medium">Real-time DB pull</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-gray-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase text-muted-foreground">Orders Lifecycle</CardTitle>
            <ShoppingBag className="h-4 w-4 text-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tight">{metrics.ordersCount}</div>
            <p className="text-xs text-green-600 mt-1 font-medium">Active Database Row Count</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-gray-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase text-muted-foreground">Active Products</CardTitle>
            <Package className="h-4 w-4 text-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tight">{metrics.activeProducts}</div>
            <p className="text-xs text-green-600 mt-1 font-medium">Synced from Stock Value</p>
          </CardContent>
        </Card>
        <Card className="rounded-xl border-gray-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase text-muted-foreground">Known Customers</CardTitle>
            <Users className="h-4 w-4 text-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black tracking-tight">{metrics.waitlistCount}</div>
            <p className="text-xs text-green-600 mt-1 font-medium">Database Extractions</p>
          </CardContent>
        </Card>
      </div>

      {/* LAUNCH PROMOTION TRACKING SECTION */}
      <div className="bg-black text-white p-8 rounded-3xl relative overflow-hidden">
         <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
            <Percent className="w-40 h-40" />
         </div>
         <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
               <div className="w-10 h-10 bg-[#FF2B8B] rounded-full flex items-center justify-center">
                  <Gift className="w-5 h-5" />
               </div>
               <h2 className="text-xl font-black uppercase tracking-tighter">Launch Promotion (30% OFF)</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Discounted Orders</p>
                  <p className="text-3xl font-black">{promoMetrics.discountedOrders}</p>
                  <p className="text-[10px] font-bold text-zinc-600 uppercase mt-2">Active during first week</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Savings Distributed</p>
                  <p className="text-3xl font-black text-[#FF2B8B]">${promoMetrics.totalSavings.toFixed(2)}</p>
                  <p className="text-[10px] font-bold text-zinc-600 uppercase mt-2">Cumulative shopper savings</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Promo Revenue</p>
                  <p className="text-3xl font-black">${promoMetrics.revenueImpact.toFixed(2)}</p>
                  <div className="flex items-center gap-1.5 text-green-500 mt-2">
                     <TrendingUp className="w-3 h-3" />
                     <span className="text-[10px] font-black uppercase tracking-widest">Early traction surge</span>
                  </div>
               </div>
            </div>
         </div>
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
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-gray-500 font-medium">
                    No active transactions found on database.
                    </TableCell>
                  </TableRow>
                ) : orders.map((order: Order) => (
                  <TableRow key={order.id} className="border-border group hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium text-foreground">
                      {order.id.slice(0, 8).toUpperCase()}...
                    </TableCell>
                    <TableCell className="text-gray-600">{order.customer_email || 'Guest User'}</TableCell>
                    <TableCell className="text-gray-500">{new Date(order.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right font-medium">${order.total_amount}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline"
                        className={
                          order.status === "paid" ? "bg-primary text-primary-foreground" : 
                          order.status === "shipped" ? "bg-green-100/20 text-green-500 border-green-500/30" : 
                          "text-gray-500 border-gray-200"
                        }
                      >
                        {order.status.toUpperCase()}
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
