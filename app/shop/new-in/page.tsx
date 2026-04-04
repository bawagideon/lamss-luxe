import { ShopGrid } from "@/components/ShopGrid";
import { getNewArrivals } from "@/app/actions/products";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "New In | Latest Fashion Drops | Lamssé Luxe",
  description: "Stay ahead of the curve with our latest arrivals. Freshly curated drops for the Soft Life Queen.",
};

export default async function NewInPage() {
  const products = await getNewArrivals();

  return (
    <main className="flex min-h-screen flex-col w-full bg-background pt-32 md:pt-44">
      <div className="container mx-auto px-6 text-center max-w-4xl mb-12 md:mb-20">
        <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter uppercase italic">NEW IN</h1>
        <p className="text-lg md:text-xl text-muted-foreground uppercase tracking-[0.3em] font-bold">
          The latest drops ! Freshly curated fashion for the Queen.
        </p>
      </div>

      <div className="container mx-auto px-6 lg:px-12 pb-24">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 px-6 text-center border-2 border-dashed border-zinc-100 rounded-3xl">
            <h2 className="text-2xl font-black mb-4 uppercase tracking-widest text-zinc-300">
              New Curation In Progress
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto font-medium">
              Our latest collection is currently being dropped into the vault. Check back in a few for fresh arrivals.
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-10 border-b border-zinc-100 pb-6">
              <p className="text-xs font-black uppercase tracking-widest text-zinc-500">
                {products.length} Latest Arrivals Found
              </p>
            </div>
            <ShopGrid initialProducts={products} />
          </div>
        )}
      </div>
    </main>
  );
}
