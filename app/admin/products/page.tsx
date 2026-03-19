"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import Image from "next/image";

// Mock Data
const products = [
  { id: "PRD-01", name: "The Soft Life Slip Dress", category: "Dresses", price: "$120.00", stock: 50, image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200&auto=format&fit=crop" },
  { id: "PRD-02", name: "Midnight Silk Two-Piece", category: "Two-Piece", price: "$145.00", stock: 12, image: "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?q=80&w=200&auto=format&fit=crop" },
  { id: "PRD-03", name: "Luxe Corset Top", category: "Tops", price: "$85.00", stock: 0, image: "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?q=80&w=200&auto=format&fit=crop" },
];

export default function AdminProductsPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">Inventory</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your exclusive drops and catalog.</p>
        </div>
        
        <Sheet>
          <SheetTrigger asChild>
            <Button className="bg-black hover:bg-black/80 font-bold tracking-wide uppercase rounded-lg shadow-sm">
              <Plus className="w-4 h-4 mr-2" /> Add Product
            </Button>
          </SheetTrigger>
          <SheetContent className="overflow-y-auto w-full sm:max-w-md">
            <SheetHeader className="mb-8">
              <SheetTitle className="text-2xl font-black uppercase tracking-tight">New Drop</SheetTitle>
              <SheetDescription>Configure a new product entry for the catalog.</SheetDescription>
            </SheetHeader>
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs uppercase font-bold text-gray-500">Product Name</Label>
                <Input id="name" placeholder="e.g. The Velvet Evening Gown" className="border-gray-200 focus-visible:ring-black" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc" className="text-xs uppercase font-bold text-gray-500">Description</Label>
                <textarea id="desc" rows={4} className="flex w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black" placeholder="A stunning piece for queens..."></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-xs uppercase font-bold text-gray-500">Price (CAD)</Label>
                  <Input id="price" type="number" placeholder="100.00" className="border-gray-200 focus-visible:ring-black" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock" className="text-xs uppercase font-bold text-gray-500">Initial Stock</Label>
                  <Input id="stock" type="number" placeholder="50" className="border-gray-200 focus-visible:ring-black" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase font-bold text-gray-500">Category</Label>
                <Select>
                  <SelectTrigger className="w-full border-gray-200 focus:ring-black">
                    <SelectValue placeholder="Select classification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dresses">Dresses</SelectItem>
                    <SelectItem value="two-piece">Two-Piece</SelectItem>
                    <SelectItem value="tops">Tops</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="button" className="w-full bg-black hover:bg-black/80 font-bold uppercase tracking-wide h-12">Submit Product</Button>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex space-x-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search inventory..." className="pl-10 border-gray-200 bg-white focus-visible:ring-black h-9" />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-gray-100 hover:bg-transparent">
              <TableHead className="font-bold text-gray-500 uppercase text-xs w-[80px]">Image</TableHead>
              <TableHead className="font-bold text-gray-500 uppercase text-xs">Name</TableHead>
              <TableHead className="font-bold text-gray-500 uppercase text-xs">Category</TableHead>
              <TableHead className="font-bold text-gray-500 uppercase text-xs text-right">Price</TableHead>
              <TableHead className="font-bold text-gray-500 uppercase text-xs text-right">Stock</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id} className="border-gray-50 group hover:bg-gray-50/50 transition-colors cursor-pointer">
                <TableCell>
                  <div className="w-12 h-14 relative bg-gray-100 rounded-md overflow-hidden border border-gray-100">
                    <Image src={p.image} alt={p.name} fill sizes="48px" className="object-cover" />
                  </div>
                </TableCell>
                <TableCell className="font-medium text-black">{p.name}</TableCell>
                <TableCell className="text-gray-500">{p.category}</TableCell>
                <TableCell className="text-right font-medium">{p.price}</TableCell>
                <TableCell className="text-right">
                  <span className={p.stock > 0 ? "text-gray-600" : "text-red-500 font-bold"}>
                    {p.stock > 0 ? p.stock : "Out of Stock"}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
