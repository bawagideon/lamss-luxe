"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download, UserPlus } from "lucide-react";

// Mock Data
const customers = [
  { id: "CUS-001", name: "Sarah Jenkins", email: "sarah@example.com", joined: "2026-03-01", orders: 4, spent: "$645.00", status: "Active" },
  { id: "CUS-002", name: "Amara Okonkwo", email: "amara.ok@example.com", joined: "2026-03-15", orders: 1, spent: "$170.00", status: "Active" },
  { id: "CUS-003", name: "Chloe Davies", email: "chloe@example.com", joined: "2026-02-28", orders: 2, spent: "$230.00", status: "Inactive" },
  { id: "CUS-004", name: "Vanessa Wu", email: "vwu99@example.com", joined: "2026-03-10", orders: 1, spent: "$120.00", status: "Active" },
];

export default function AdminCustomersPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">Customers</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your Soft Life Queens Network.</p>
        </div>
        
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Button variant="outline" className="font-bold uppercase text-xs tracking-wider">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Button className="bg-black hover:bg-black/80 font-bold uppercase text-xs tracking-wider">
            <UserPlus className="w-4 h-4 mr-2" /> Add Client
          </Button>
        </div>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex space-x-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search customers by name or email..." className="pl-10 border-gray-200 bg-white focus-visible:ring-black h-9" />
          </div>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow className="border-gray-100 hover:bg-transparent bg-gray-50/50">
              <TableHead className="font-bold text-gray-500 uppercase text-xs">Customer</TableHead>
              <TableHead className="font-bold text-gray-500 uppercase text-xs">Joined</TableHead>
              <TableHead className="font-bold text-gray-500 uppercase text-xs text-right">Orders</TableHead>
              <TableHead className="font-bold text-gray-500 uppercase text-xs text-right">Total Spent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id} className="border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer">
                <TableCell>
                  <div className="font-medium text-black">{customer.name}</div>
                  <div className="text-xs text-gray-400">{customer.email}</div>
                </TableCell>
                <TableCell className="text-gray-500 text-sm">{customer.joined}</TableCell>
                <TableCell className="text-right font-medium">{customer.orders}</TableCell>
                <TableCell className="text-right font-medium text-black">{customer.spent}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
