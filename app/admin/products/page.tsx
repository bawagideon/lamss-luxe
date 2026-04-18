"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
import { getAdminProducts, addProduct, deleteProduct, editProduct, uploadSingleImage } from "@/app/actions/admin";
import toast from "react-hot-toast";
import imageCompression from "browser-image-compression";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";


interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  category_id?: string;
  category?: string;
  image_url: string;
  colors?: string[];
  color_codes?: string[];
  stock_status?: string;
  stock?: number;
  sizes?: string[];
  material?: string;
  occasion?: string;
  size_and_fit?: string;
  fabric_and_care?: string;
  marketing_message?: string;
  is_new?: boolean;
  promo_banner?: string | null;
  color_badges?: Record<string, string>;
  related_product_ids?: string[];
  is_set_available?: boolean;
}

export default function AdminProductsPage() {
  const [liveProducts, setLiveProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeColors, setActiveColors] = useState<string[]>(['', '', '', '']);
  const [colorBadges, setColorBadges] = useState<Record<string, string>>({});
  const [relatedProductIds, setRelatedProductIds] = useState<string[]>([]);
  const [isNewDrop, setIsNewDrop] = useState(false);
  const [isSetAvailable, setIsSetAvailable] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [compressedFiles, setCompressedFiles] = useState<Record<string, File>>({});

  useEffect(() => {
    getAdminProducts().then(setLiveProducts);
  }, []);

  useEffect(() => {
    if (selectedProduct) {
      setActiveColors(selectedProduct.colors || ['', '', '', '']);
      setColorBadges(selectedProduct.color_badges || {});
      setRelatedProductIds(selectedProduct.related_product_ids || []);
      setIsNewDrop(!!selectedProduct.is_new);
      setIsSetAvailable(!!selectedProduct.is_set_available);
    } else {
      setActiveColors(['', '', '', '']);
      setColorBadges({});
      setRelatedProductIds([]);
      setIsNewDrop(false);
      setIsSetAvailable(false);
    }
    setCompressedFiles({});
  }, [selectedProduct]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size < 1024 * 500) { // If less than 500KB, skip compression to save CPU
       setCompressedFiles(prev => ({ ...prev, [fieldName]: file }));
       return;
    }

    const options = {
      maxSizeMB: 0.8,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    };

    const loader = toast.loading(`Optimizing ${file.name}...`);
    try {
      const compressedFile = await imageCompression(file, options);
      setCompressedFiles(prev => ({ ...prev, [fieldName]: compressedFile }));
      toast.success(`${file.name} optimized!`, { id: loader });
    } catch (error) {
      console.error("Compression Error:", error);
      toast.error("Compression failed, using original.", { id: loader });
      setCompressedFiles(prev => ({ ...prev, [fieldName]: file }));
    }
  };

  const handleAddSubmit = async (formData: FormData) => {
    const loader = toast.loading(selectedProduct ? "Updating product..." : "Creating product...");
    
    try {
      // 1. Client-Side Asset Dispatch (Bypassing Vercel's 4.5MB Server Limit)
      // We upload each compressed file individually and replace the FormData entry with the URL string.
      const uploadPromises = Object.entries(compressedFiles).map(async ([fieldName, file]) => {
        // Create a dedicated FormData for this single image upload proxy
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        
        const res = await uploadSingleImage(uploadFormData);
        
        if (res.error || !res.url) {
          throw new Error(`Upload failed for ${fieldName}: ${res.error || 'Unknown Error'}`);
        }

        return { fieldName, publicUrl: res.url };
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      
      // Inject URLs into formData, stripping out any binary blobs
      uploadedFiles.forEach(({ fieldName, publicUrl }) => {
        formData.set(fieldName, publicUrl);
      });

      // Inject programmatic state fields
      formData.append('related_product_ids', relatedProductIds.join(','));
      formData.append('color_badges_json', JSON.stringify(colorBadges));

      // Clear binary entries from formData that weren't in compressedFiles but might still be there from the browser native form
      // (Next.js action will still try to parse them if we don't)
      const keysToDelete: string[] = [];
      formData.forEach((value, key) => {
        if (value instanceof File && value.size > 0) {
           // This means a file was selected but not compressed yet or optimized? 
           // In our case, all selected files go to compressedFiles via handleFileChange.
           // However, browser native form submission might include the original File objects.
           // We MUST remove all binary data to ensure payload is tiny.
           keysToDelete.push(key);
        }
      });
      keysToDelete.forEach(k => formData.delete(k));

      startTransition(async () => {
        try {
          let res;
          if (selectedProduct) {
            formData.append("id", selectedProduct.id);
            res = await editProduct(formData);
          } else {
            res = await addProduct(formData);
          }
          
          if ('error' in res) {
            toast.error(res.error as string, { id: loader });
          } else {
            toast.success(selectedProduct ? "Product Updated Successfully!" : "Product Drop Successfully Added!", { id: loader });
            getAdminProducts().then(setLiveProducts);
            setIsSheetOpen(false);
            setSelectedProduct(null);
            setCompressedFiles({});
          }
        } catch (err) {
          console.error("Server Action Error:", err);
          toast.error("An unexpected error occurred during save", { id: loader });
        }
      });
    } catch (err) {
      console.error("Upload Loop Error:", err);
      toast.error(err instanceof Error ? err.message : "Image upload failed", { id: loader });
    }
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
        
        <Sheet open={isSheetOpen} onOpenChange={(open) => { setIsSheetOpen(open); if (!open) setSelectedProduct(null); }}>
          <SheetTrigger asChild>
            <Button onClick={() => setSelectedProduct(null)} className="bg-black hover:bg-black/80 font-bold tracking-wide uppercase rounded-lg shadow-sm">
              <Plus className="w-4 h-4 mr-2" /> Add Product
            </Button>
          </SheetTrigger>
          <SheetContent className="overflow-y-auto w-full sm:max-w-md">
            <SheetHeader className="mb-8">
              <SheetTitle className="text-2xl font-black uppercase tracking-tight">{selectedProduct ? "Edit Drop" : "New Drop"}</SheetTitle>
              <SheetDescription>Configure a product entry for the catalog.</SheetDescription>
            </SheetHeader>
            <form key={selectedProduct?.id || 'new'} action={handleAddSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs uppercase font-bold text-gray-500">Product Name</Label>
                <Input id="name" name="name" defaultValue={selectedProduct?.name || ''} required placeholder="e.g. The Velvet Evening Gown" className="border-gray-200 focus-visible:ring-black" />
              </div>

              <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                <div className="space-y-0.5">
                  <Label className="text-sm font-black uppercase tracking-tight">New Drop Status</Label>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Mark as &quot;NEW&quot; in storefront</p>
                </div>
                <Switch 
                  checked={isNewDrop}
                  onCheckedChange={(val) => setIsNewDrop(val)}
                />
                <input type="hidden" name="is_new" value={isNewDrop ? 'true' : 'false'} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="promo_banner" className="text-xs uppercase font-bold text-blue-500">Promo Banner Text (Top of Product Info)</Label>
                <Input id="promo_banner" name="promo_banner" defaultValue={selectedProduct?.promo_banner || ''} placeholder="e.g. FREE SHIPPING ON ORDERS OVER $75" className="border-blue-100 focus-visible:ring-blue-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc" className="text-xs uppercase font-bold text-gray-500">Description</Label>
                <textarea id="desc" name="description" defaultValue={selectedProduct?.description || ''} rows={2} className="flex w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black" placeholder="A stunning piece for queens..."></textarea>
              </div>
              <div className="space-y-2">
                <Label htmlFor="marketing_message" className="text-xs uppercase font-bold text-red-500">Marketing Message (E.g. UP TO 90% OFF)</Label>
                <Input id="marketing_message" name="marketing_message" defaultValue={selectedProduct?.marketing_message || ''} placeholder="FLASH SALE! 50% OFF" className="border-red-100 focus-visible:ring-red-500" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="material" className="text-xs uppercase font-bold text-gray-500">Materials Used</Label>
                  <textarea id="material" name="material" defaultValue={selectedProduct?.material || ''} rows={2} className="flex w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black" placeholder="e.g. 100% Silk"></textarea>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="occasion" className="text-xs uppercase font-bold text-gray-500">When to Wear (Occasion)</Label>
                  <textarea id="occasion" name="occasion" defaultValue={selectedProduct?.occasion || ''} rows={2} className="flex w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black" placeholder="e.g. Late night dinners, yacht parties"></textarea>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="size_fit" className="text-xs uppercase font-bold text-gray-500">Size & Fit</Label>
                  <textarea id="size_fit" name="size_and_fit" defaultValue={selectedProduct?.size_and_fit || ''} rows={2} className="flex w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black" placeholder="e.g. Model is 5'9 and wears size S"></textarea>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fabric_care" className="text-xs uppercase font-bold text-gray-500">Fabric & Care</Label>
                  <textarea id="fabric_care" name="fabric_and_care" defaultValue={selectedProduct?.fabric_and_care || ''} rows={2} className="flex w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-black" placeholder="e.g. 100% Polyester. Dry clean only."></textarea>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-xs uppercase font-bold text-gray-500">Price (CAD)</Label>
                  <Input id="price" name="price" defaultValue={selectedProduct?.price || ''} required type="number" step="0.01" placeholder="100.00" className="border-gray-200 focus-visible:ring-black" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock" className="text-xs uppercase font-bold text-gray-500">Initial Stock</Label>
                  <Input id="stock" name="stock" defaultValue={selectedProduct?.stock || ''} required type="number" placeholder="50" className="border-gray-200 focus-visible:ring-black" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sizes" className="text-xs uppercase font-bold text-gray-500">Sizes (Comma-Separated)</Label>
                  <Input id="sizes" name="sizes" defaultValue={selectedProduct?.sizes?.join(', ') || ''} placeholder="XS, S, M, L, XL" className="border-gray-200 focus-visible:ring-black" />
                </div>
                <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-lg border border-zinc-100 mt-6">
                  <div className="space-y-0.5">
                    <Label className="text-[10px] font-black uppercase tracking-tight">Outfit Set Available</Label>
                    <p className="text-[8px] text-muted-foreground uppercase">Enable &quot;Buy the Set&quot; toggle</p>
                  </div>
                  <Switch 
                    checked={isSetAvailable}
                    onCheckedChange={(val) => setIsSetAvailable(val)}
                  />
                  <input type="hidden" name="is_set_available" value={isSetAvailable ? 'true' : 'false'} />
                </div>
              </div>
              <div className="space-y-2 border-t border-gray-100 pt-4">
                <Label className="text-xs uppercase font-bold text-gray-500">Colors (Name & Exact Hex Picker)</Label>
                {activeColors.map((color, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <Input 
                      name="color_names" 
                      value={color} 
                      onChange={(e) => {
                        const val = e.target.value;
                        const newColors = [...activeColors];
                        newColors[i] = val;
                        setActiveColors(newColors);
                      }}
                      placeholder={`Color ${i + 1} Name`} 
                      className="border-gray-200 focus-visible:ring-black flex-1" 
                    />
                    <Input 
                      placeholder="Sub-Badge (e.g. Selling Fast)" 
                      value={colorBadges[color] || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setColorBadges(prev => ({ ...prev, [color]: val }));
                      }}
                      className="border-gray-100 text-[10px] w-28 h-10"
                    />
                    <div className="h-10 w-12 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                      <input type="color" name="color_codes" className="w-[150%] h-[150%] -ml-1 -mt-1 cursor-pointer" defaultValue={selectedProduct?.color_codes?.[i] || ["#000000", "#DC143C", "#F5F5DC", "#4682B4"][i]} />
                    </div>
                  </div>
                ))}
                <p className="text-[10px] text-gray-400">Leave name blank to skip. Hex codes power the visual swatches.</p>
              </div>

              {activeColors.some(c => c.trim() !== '') && (
                <div className="space-y-6 border-t border-gray-100 pt-6">
                  <h4 className="text-sm font-black uppercase tracking-tight text-primary">Variant Specific Imagery</h4>
                  <p className="text-[10px] text-muted-foreground -mt-4 italic">Upload specific model shots for each color variant below.</p>
                  
                  {activeColors.filter(c => c.trim() !== '').map((color) => (
                    <div key={color} className="p-4 bg-muted/30 rounded-lg space-y-4 border border-border/50">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="text-xs font-black uppercase tracking-widest">{color} Variant</span>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3">
                        <div className="space-y-1">
                          <Label className="text-[10px] uppercase text-gray-400 font-bold">Main Variant View</Label>
                          <Input 
                            name={`variant_image_${color}_main`} 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleFileChange(e, `variant_image_${color}_main`)}
                            className="h-8 text-[11px] file:text-[10px] file:px-2" 
                          />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase text-gray-400 font-bold">Front</Label>
                            <Input 
                              name={`variant_image_${color}_front`} 
                              type="file" 
                              accept="image/*" 
                              onChange={(e) => handleFileChange(e, `variant_image_${color}_front`)}
                              className="h-8 text-[11px] file:text-[10px] file:px-2" 
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase text-gray-400 font-bold">Side</Label>
                            <Input 
                              name={`variant_image_${color}_side`} 
                              type="file" 
                              accept="image/*" 
                              onChange={(e) => handleFileChange(e, `variant_image_${color}_side`)}
                              className="h-8 text-[11px] file:text-[10px] file:px-2" 
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] uppercase text-gray-400 font-bold">Back</Label>
                            <Input 
                              name={`variant_image_${color}_back`} 
                              type="file" 
                              accept="image/*" 
                              onChange={(e) => handleFileChange(e, `variant_image_${color}_back`)}
                              className="h-8 text-[11px] file:text-[10px] file:px-2" 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-4 border-t border-gray-100 pt-4">
                <h4 className="text-sm font-bold uppercase tracking-tight">Global Fallback Images</h4>
                <p className="text-[10px] text-muted-foreground italic -mt-2">Used if variant images are missing.</p>
                <div className="space-y-2">
                  <Label htmlFor="image_main" className="text-xs text-gray-500">Main Image (Default/Cover)</Label>
                  <Input 
                    id="image_main" 
                    name="image_main" 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleFileChange(e, 'image_main')}
                    className="border-gray-200 focus-visible:ring-black cursor-pointer file:text-sm file:font-semibold file:bg-black file:text-white file:rounded-md file:px-3 file:border-none file:mr-4 file:-ml-1" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image_front" className="text-xs text-gray-500">Front Angle</Label>
                  <Input 
                    id="image_front" 
                    name="image_front" 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleFileChange(e, 'image_front')}
                    className="border-gray-200 focus-visible:ring-black cursor-pointer file:text-sm file:font-semibold file:bg-muted file:text-foreground file:rounded-md file:px-3 file:border-none file:mr-4 file:-ml-1" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image_side" className="text-xs text-gray-500">Side Angle</Label>
                  <Input 
                    id="image_side" 
                    name="image_side" 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleFileChange(e, 'image_side')}
                    className="border-gray-200 focus-visible:ring-black cursor-pointer file:text-sm file:font-semibold file:bg-muted file:text-foreground file:rounded-md file:px-3 file:border-none file:mr-4 file:-ml-1" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image_back" className="text-xs text-gray-500">Back Angle</Label>
                  <Input 
                    id="image_back" 
                    name="image_back" 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => handleFileChange(e, 'image_back')}
                    className="border-gray-200 focus-visible:ring-black cursor-pointer file:text-sm file:font-semibold file:bg-muted file:text-foreground file:rounded-md file:px-3 file:border-none file:mr-4 file:-ml-1" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase font-bold text-gray-500">Category</Label>
                <Select name="category" defaultValue={selectedProduct?.category || "dresses"}>
                  <SelectTrigger className="w-full border-gray-200 focus:ring-black">
                    <SelectValue placeholder="Select classification" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dresses">Dresses</SelectItem>
                    <SelectItem value="two-piece">Two-Piece</SelectItem>
                    <SelectItem value="tops">Tops</SelectItem>
                    <SelectItem value="swim">Swim</SelectItem>
                    <SelectItem value="outerwear">Outerwear</SelectItem>
                    <SelectItem value="accessories">Accessories</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4 border-t border-gray-100 pt-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black uppercase tracking-tight">Complete The Look</h4>
                  <Badge variant="outline" className="text-[9px] uppercase">{relatedProductIds.length} Linked</Badge>
                </div>
                <p className="text-[10px] text-muted-foreground -mt-2 italic">Select complementary products to upsell in the storefront carousel.</p>
                <div className="max-h-48 overflow-y-auto border border-border rounded-lg p-3 space-y-2 bg-zinc-50/50">
                  {liveProducts.filter(p => p.id !== selectedProduct?.id).map(p => (
                    <div key={p.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`rel-${p.id}`} 
                        checked={relatedProductIds.includes(p.id)}
                        onCheckedChange={(checked) => {
                          if (checked) setRelatedProductIds(prev => [...prev, p.id]);
                          else setRelatedProductIds(prev => prev.filter(id => id !== p.id));
                        }}
                      />
                      <Label htmlFor={`rel-${p.id}`} className="text-[11px] font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer">
                        {p.name} <span className="text-[9px] text-muted-foreground ml-1">(${p.price})</span>
                      </Label>
                    </div>
                  ))}
                  {liveProducts.length <= 1 && (
                    <p className="text-center py-4 text-[10px] text-muted-foreground uppercase">No other products found to link.</p>
                  )}
                </div>
              </div>

              <Button type="submit" disabled={isPending} className="w-full bg-black hover:bg-black/80 font-bold uppercase tracking-wide h-12">
                {selectedProduct ? "Save Changes" : "Submit Product"}
              </Button>
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
            {liveProducts.map((p: Product) => (
              <TableRow 
                key={p.id} 
                className="border-border group hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => { setSelectedProduct(p); setIsSheetOpen(true); }}
              >
                <TableCell>
                  <div className="w-12 h-14 relative bg-muted rounded-md overflow-hidden border border-border">
                    <Image src={p.image_url || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=200"} alt={p.name} fill sizes="48px" className="object-cover" />
                  </div>
                </TableCell>
                <TableCell className="font-medium text-foreground">{p.name}</TableCell>
                <TableCell className="text-muted-foreground capitalize">{p.category || 'N/A'}</TableCell>
                <TableCell className="text-right font-medium">${p.price}</TableCell>
                <TableCell className="text-center">
                  <span className={(p.stock ?? 0) > 0 ? "text-muted-foreground" : "text-destructive font-bold"}>
                    {(p.stock ?? 0) > 0 ? p.stock : "Out of Stock"}
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
