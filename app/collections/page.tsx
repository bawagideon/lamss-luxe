import { ShopGrid } from "@/components/ShopGrid";

export default function CollectionsPage() {
  return (
    <main className="flex min-h-screen flex-col w-full bg-white pt-32">
      <div className="container mx-auto px-6 text-center max-w-4xl">
        <p className="text-sm font-bold tracking-[0.3em] uppercase text-primary mb-4">Latest Drop</p>
        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">The Midnight Collection</h1>
        <p className="text-xl text-muted-foreground">
          Exclusive pieces curated for Lamssé Luxe VIPs.
        </p>
      </div>
      <ShopGrid />
    </main>
  );
}
