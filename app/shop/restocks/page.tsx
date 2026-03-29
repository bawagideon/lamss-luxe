import { ShopGrid } from "@/components/ShopGrid";
import { FilterSidebar } from "@/components/FilterSidebar";
import { getFilteredProducts } from "@/app/actions/products";
import { Metadata } from "next";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter, RefreshCw } from "lucide-react";

export const metadata: Metadata = {
  title: "Restocked Favorites | Lamssé Luxe",
  description: "Your most-loved pieces are back. Shop the latest restocks and secure your favorites before they're gone again.",
};

export default async function RestocksPage({ 
  searchParams 
}: { 
  searchParams: { [key: string]: string | string[] | undefined } 
}) {
  const filters = {
    category: typeof searchParams.category === 'string' ? searchParams.category.split(',') : undefined,
  };

  // Fetch products (could filter by a 'restock' tag in the future)
  const products = await getFilteredProducts(filters);

  return (
    <main className="flex min-h-screen flex-col w-full bg-background pt-32 md:pt-40">
      <div className="container mx-auto px-6 text-center max-w-4xl mb-12 md:mb-20">
        <div className="flex items-center justify-center gap-3 mb-4">
          <RefreshCw className="w-6 h-6 text-primary animate-spin-slow" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">They're Back</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight uppercase">Restocked Favorites</h1>
        <p className="text-lg md:text-xl text-muted-foreground uppercase tracking-widest font-medium">
          The pieces you couldn't get enough of are back in the vault.
        </p>
      </div>

      <div className="container mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-12 pb-24">
        <aside className="hidden lg:block w-72 shrink-0 border-r border-border pr-8">
          <div className="sticky top-32">
            <FilterSidebar />
          </div>
        </aside>

        <div className="lg:hidden flex items-center justify-between mb-10 bg-black/5 p-4 rounded-sm border border-black/10">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mr-4">
            Filter Restocks
          </p>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="font-black uppercase tracking-widest text-[10px] border-black hover:bg-black hover:text-white transition-all h-10 px-6">
                Refine <Filter className="w-3 h-3 ml-2" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85%] sm:w-[400px] overflow-y-auto border-r-0">
              <SheetHeader className="mb-8 border-b border-black/10 pb-4">
                <SheetTitle className="text-2xl font-black uppercase tracking-tighter italic">Refine By</SheetTitle>
              </SheetHeader>
              <FilterSidebar />
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-center mb-8">
            <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
              {products.length} Items Back in Stock
            </p>
          </div>
          
          <ShopGrid initialProducts={products.slice(0, 12)} />
        </div>
      </div>
    </main>
  );
}
