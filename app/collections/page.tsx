import { getNewArrivals } from "@/app/actions/products";
import { ShopGrid } from "@/components/ShopGrid";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function CollectionsPage() {
  const newDrops = await getNewArrivals();

  return (
    <main className="flex min-h-screen flex-col w-full bg-background pt-32">
      <div className="container mx-auto px-6 text-center max-w-4xl mb-12">
        <p className="text-sm font-bold tracking-[0.3em] uppercase text-primary mb-4">Latest Drop</p>
        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight uppercase">The New Collection</h1>
        <p className="text-xl text-muted-foreground">
          Exclusive pieces curated for Lamssé Elegant Queens.
        </p>
      </div>

      {newDrops.length === 0 ? (
        <div className="container mx-auto px-6 mb-24">
          <div className="flex flex-col items-center justify-center py-32 px-6 text-center space-y-8 bg-gray-50/50 dark:bg-zinc-950/30 rounded-[2rem] border border-dashed border-border/60">
            <div className="space-y-4 max-w-xl">
              <h2 className="text-3xl md:text-4xl font-black tracking-tight uppercase">Currently being curated</h2>
              <p className="text-muted-foreground text-lg font-medium leading-relaxed">
                Our latest collection is currently being curated. <br className="hidden md:block" />
                Check back soon for new drops that define the Soft Life.
              </p>
            </div>
            <Button asChild className="rounded-full bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 px-12 h-14 text-sm font-black uppercase tracking-widest transition-all hover:scale-105 shadow-xl">
              <Link href="/shop">Explore All Styles</Link>
            </Button>
          </div>
        </div>
      ) : (
        <ShopGrid initialProducts={newDrops} />
      )}
    </main>
  );
}
