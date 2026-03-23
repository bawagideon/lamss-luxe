import { ShopGrid } from "@/components/ShopGrid";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Collections",
  description: "Explore the latest premium fashion drops from Lamssé Luxe. Elevate your wardrobe with our latest tops, dresses, and two-piece sets.",
};

export default function ShopPage() {
  return (
    <main className="flex min-h-screen flex-col w-full bg-background pt-40">
      <div className="container mx-auto px-6 text-center max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">All Collections</h1>
        <p className="text-xl text-muted-foreground">
          Ready-to-slay fashion for the unapologetic Soft Life Queen.
        </p>
      </div>
      <ShopGrid />
    </main>
  );
}
