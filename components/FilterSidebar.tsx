"use client";

import { useFilters } from "@/hooks/useFilters";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const CATEGORIES = ["Dresses", "Two-Piece", "Tops", "Bottoms", "Shoes", "BodyCTRL"];
const SIZES = ["XXS", "XS", "S", "M", "L", "XL", "XXL"];
const COLORS = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#FFFFFF" },
  { name: "Red", hex: "#DC143C" },
  { name: "Blue", hex: "#4682B4" },
  { name: "Green", hex: "#2E8B57" },
  { name: "Pink", hex: "#FFB6C1" },
  { name: "Brown", hex: "#8B4513" },
  { name: "Grey", hex: "#808080" },
  { name: "Nude", hex: "#F5F5DC" },
  { name: "Gold", hex: "#D4AF37" },
  { name: "Silver", hex: "#C0C0C0" }
];
const OCCASIONS = ["Vacation", "Streetwear", "Brunch", "Date Night", "Everyday", "Evening"];
const MATERIALS = ["Satin", "Mesh", "Crepe", "Denim", "Silk", "Polyester"];

export function FilterSidebar({ className }: { className?: string }) {
  const { updateFilter, clearFilters, isFilterActive } = useFilters();
  const [searchTerm, setSearchTerm] = useState("");

  const filterList = (list: string[]) => list.filter(item => item.toLowerCase().includes(searchTerm.toLowerCase()));
  const filterColors = (list: typeof COLORS) => list.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const filteredCategories = filterList(CATEGORIES);
  const filteredSizes = filterList(SIZES);
  const filteredOccasions = filterList(OCCASIONS);
  const filteredMaterials = filterList(MATERIALS);
  const filteredColors = filterColors(COLORS);

  return (
    <div className={cn("w-full space-y-6", className)}>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-black uppercase tracking-tight">Refine By</h2>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={clearFilters}
          className="text-xs uppercase font-bold text-muted-foreground hover:text-foreground"
        >
          Clear All <X className="w-3 h-3 ml-1" />
        </Button>
      </div>

      <div className="relative group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground transition-colors group-focus-within:text-black" />
        <Input 
          placeholder="Search filters..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 h-10 text-[11px] font-bold uppercase tracking-widest border-zinc-100 bg-zinc-50 focus-visible:ring-black placeholder:text-zinc-400" 
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="w-3 h-3 text-muted-foreground hover:text-black" />
          </button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={["category", "size", "color"]}>
        {/* Category Filter */}
        <AccordionItem value="category">
          <AccordionTrigger className="text-sm uppercase font-black hover:no-underline">Category</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-1">
              {filteredCategories.map((cat) => (
                <div key={cat} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`cat-${cat}`} 
                    checked={isFilterActive("category", cat.toLowerCase())}
                    onCheckedChange={() => updateFilter("category", cat.toLowerCase())}
                  />
                  <label htmlFor={`cat-${cat}`} className="text-sm font-medium leading-none cursor-pointer">
                    {cat}
                  </label>
                </div>
              ))}
              {filteredCategories.length === 0 && (
                <p className="text-[10px] text-muted-foreground uppercase py-2">No categories found</p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Size Filter */}
        <AccordionItem value="size">
          <AccordionTrigger className="text-sm uppercase font-black hover:no-underline">Size</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-4 gap-2 pt-1">
              {filteredSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => updateFilter("size", size)}
                  className={cn(
                    "h-9 border text-[10px] font-black uppercase transition-all",
                    isFilterActive("size", size) 
                      ? "bg-black text-white border-black" 
                      : "bg-white text-black border-border hover:border-black"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
            {filteredSizes.length === 0 && (
                <p className="text-[10px] text-muted-foreground uppercase py-2">No sizes match</p>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Color Filter */}
        <AccordionItem value="color">
          <AccordionTrigger className="text-sm uppercase font-black hover:no-underline">Color</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-5 gap-3 pt-2">
              {filteredColors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => updateFilter("color", color.name)}
                  title={color.name}
                  className={cn(
                    "w-8 h-8 rounded-full border shadow-sm transition-transform hover:scale-110",
                    isFilterActive("color", color.name) 
                      ? "ring-2 ring-black ring-offset-2" 
                      : "border-border"
                  )}
                  style={{ backgroundColor: color.hex }}
                >
                  <span className="sr-only">{color.name}</span>
                </button>
              ))}
            </div>
            {filteredColors.length === 0 && (
                <p className="text-[10px] text-muted-foreground uppercase py-2">No colors match</p>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Occasion Filter */}
        <AccordionItem value="occasion">
          <AccordionTrigger className="text-sm uppercase font-black hover:no-underline">Occasion</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-1">
              {filteredOccasions.map((occ) => (
                <div key={occ} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`occ-${occ}`} 
                    checked={isFilterActive("occasion", occ.toLowerCase())}
                    onCheckedChange={() => updateFilter("occasion", occ.toLowerCase())}
                  />
                  <label htmlFor={`occ-${occ}`} className="text-sm font-medium leading-none cursor-pointer">
                    {occ}
                  </label>
                </div>
              ))}
              {filteredOccasions.length === 0 && (
                <p className="text-[10px] text-muted-foreground uppercase py-2">No matches</p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Material Filter */}
        <AccordionItem value="material">
          <AccordionTrigger className="text-sm uppercase font-black hover:no-underline">Fabric / Material</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-1">
              {filteredMaterials.map((mat) => (
                <div key={mat} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`mat-${mat}`} 
                    checked={isFilterActive("material", mat.toLowerCase())}
                    onCheckedChange={() => updateFilter("material", mat.toLowerCase())}
                  />
                  <label htmlFor={`mat-${mat}`} className="text-sm font-medium leading-none cursor-pointer">
                    {mat}
                  </label>
                </div>
              ))}
              {filteredMaterials.length === 0 && (
                <p className="text-[10px] text-muted-foreground uppercase py-2">No matches</p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
