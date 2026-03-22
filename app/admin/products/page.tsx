"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
import { getAdminProducts, addProduct, deleteProduct } from "@/app/actions/admin";
import toast from "react-hot-toast";

export default function AdminProductsPage() {
  const [liveProducts, setLiveProducts] = useState<any[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getAdminProducts().then(setLiveProducts);
  }, []);

  const handleAddSubmit = (formData: FormData) => {
    startTransition(async () => {
      const res = await addProduct(formData);
      if (res?.error) toast.error(res.error);
      else {
        toast.success("Product Drop Successfully Added!");
        getAdminProducts().then(setLiveProducts);
      }
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Permanently delete ${name}? This action is immediate and irrevocable.`)) {
      startTransition(async () => {
        const res = await deleteProduct(id);
        if (res?.error) toast.error(res.error);
        else {
          toast.success("Product Annihilated.");
          setLiveProducts(prev => prev.filter(p => p.id !== id));
        }
      });
    }
  };

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
            <form action={handleAddSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs uppercase font-bold text-gray-500">Product Name</Label>
                <Input id="name" name="name" required placeholder="e.g. The Velvet Evening Gown" className="border-gray-200 focus-visible:ring-black" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc" className="text-xs uppercase font-bold text-gray-500">Description</Label>
                <textarea id="desc" name="description" rows={3} className="flex w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black" placeholder="A stunning piece for queens..."></textarea>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="material" className="text-xs uppercase font-bold text-gray-500">Materials Used</Label>
                  <textarea id="material" name="material" rows={2} className="flex w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black" placeholder="e.g. 100% Silk"></textarea>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="occasion" className="text-xs uppercase font-bold text-gray-500">When to Wear (Occasion)</Label>
                  <textarea id="occasion" name="occasion" rows={2} className="flex w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black" placeholder="e.g. Late night dinners, yacht parties"></textarea>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-xs uppercase font-bold text-gray-500">Price (CAD)</Label>
                  <Input id="price" name="price" required type="number" step="0.01" placeholder="100.00" className="border-gray-200 focus-visible:ring-black" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock" className="text-xs uppercase font-bold text-gray-500">Initial Stock</Label>
                  <Input id="stock" name="stock" required type="number" placeholder="50" className="border-gray-200 focus-visible:ring-black" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sizes" className="text-xs uppercase font-bold text-gray-500">Sizes (Comma-Separated)</Label>
                  <Input id="sizes" name="sizes" placeholder="XS, S, M, L, XL" className="border-gray-200 focus-visible:ring-black" />
                </div>
              </div>
              <div className="space-y-2 border-t border-gray-100 pt-4">
                <Label className="text-xs uppercase font-bold text-gray-500">Colors (Name & Exact Hex Picker)</Label>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <Input name="color_names" placeholder={`Color ${i + 1} Name (e.g. Midnight)`} className="border-gray-200 focus-visible:ring-black flex-1" />
                    <div className="h-10 w-12 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                      <input type="color" name="color_codes" className="w-[150%] h-[150%] -ml-1 -mt-1 cursor-pointer" defaultValue={["#000000", "#DC143C", "#F5F5DC", "#4682B4"][i]} />
                    </div>
                  </div>
                ))}
                <p className="text-[10px] text-gray-400">Leave name blank to skip. Hex codes power the visual swatches.</p>
              </div>
                <div className="space-y-4 border-t border-gray-100 pt-4">
                <h4 className="text-sm font-bold uppercase tracking-tight">Multi-Angle Image Uploads</h4>
                <div className="space-y-2">
                  <Label htmlFor="image_main" className="text-xs text-gray-500">Main Image (Default/Cover)</Label>
                  <Input id="image_main" name="image_main" type="file" accept="image/*" className="border-gray-200 focus-visible:ring-black cursor-pointer file:text-sm file:font-semibold file:bg-black file:text-white file:rounded-md file:px-3 file:border-none file:mr-4 file:-ml-1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image_front" className="text-xs text-gray-500">Front Angle</Label>
                  <Input id="image_front" name="image_front" type="file" accept="image/*" className="border-gray-200 focus-visible:ring-black cursor-pointer file:text-sm file:font-semibold file:bg-muted file:text-foreground file:rounded-md file:px-3 file:border-none file:mr-4 file:-ml-1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image_side" className="text-xs text-gray-500">Side Angle</Label>
                  <Input id="image_side" name="image_side" type="file" accept="image/*" className="border-gray-200 focus-visible:ring-black cursor-pointer file:text-sm file:font-semibold file:bg-muted file:text-foreground file:rounded-md file:px-3 file:border-none file:mr-4 file:-ml-1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image_back" className="text-xs text-gray-500">Back Angle</Label>
                  <Input id="image_back" name="image_back" type="file" accept="image/*" className="border-gray-200 focus-visible:ring-black cursor-pointer file:text-sm file:font-semibold file:bg-muted file:text-foreground file:rounded-md file:px-3 file:border-none file:mr-4 file:-ml-1" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase font-bold text-gray-500">Category</Label>
                <Select name="category">
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
              <Button type="submit" className="w-full bg-black hover:bg-black/80 font-bold uppercase tracking-wide h-12">Submit Product</Button>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      <div className="bg-card text-card-foreground border border-border shadow-sm rounded-xl overflow-hidden mt-8">
        <div className="p-4 border-b border-border bg-muted/50 flex space-x-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search inventory..." className="pl-10 border-border bg-background focus-visible:ring-primary h-9" />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-bold text-muted-foreground uppercase text-xs w-[80px]">Image</TableHead>
              <TableHead className="font-bold text-muted-foreground uppercase text-xs">Name</TableHead>
              <TableHead className="font-bold text-muted-foreground uppercase text-xs">Category</TableHead>
              <TableHead className="font-bold text-muted-foreground uppercase text-xs text-right">Price</TableHead>
              <TableHead className="font-bold text-muted-foreground uppercase text-xs text-center">Stock</TableHead>
              <TableHead className="font-bold text-muted-foreground uppercase text-xs text-center w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {liveProducts.map((p: any) => (
              <TableRow key={p.id} className="border-border group hover:bg-muted/50 transition-colors cursor-pointer">
                <TableCell>
                  <div className="w-12 h-14 relative bg-muted rounded-md overflow-hidden border border-border">
                    <Image src={p.image_url || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200"} alt={p.name} fill sizes="48px" className="object-cover" />
                  </div>
                </TableCell>
                <TableCell className="font-medium text-foreground">{p.name}</TableCell>
                <TableCell className="text-muted-foreground capitalize">{p.category || 'N/A'}</TableCell>
                <TableCell className="text-right font-medium">${p.price}</TableCell>
                <TableCell className="text-center">
                  <span className={p.stock > 0 ? "text-muted-foreground" : "text-destructive font-bold"}>
                    {p.stock > 0 ? p.stock : "Out of Stock"}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <button 
                    disabled={isPending}
                    onClick={(e) => { e.stopPropagation(); handleDelete(p.id, p.name); }} 
                    className="text-red-500 opacity-60 hover:opacity-100 transition-opacity p-2 rounded hover:bg-red-50"
                    title="Delete Product"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
