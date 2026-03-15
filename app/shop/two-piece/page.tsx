import { ShopGrid } from "@/components/ShopGrid";

export default function TwoPiecePage() {
  return (
    <main className="flex min-h-screen flex-col w-full bg-white pt-32">
      <div className="container mx-auto px-6 text-center max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Two-Piece Sets</h1>
        <p className="text-xl text-muted-foreground">
          Coordinated perfection. Effortless styling for the modern woman.
        </p>
      </div>
      <ShopGrid />
    </main>
  );
}
