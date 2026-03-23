import { ShopGrid } from "@/components/ShopGrid";

export default function TopsPage() {
  return (
    <main className="flex min-h-screen flex-col w-full bg-background pt-40">
      <div className="container mx-auto px-6 text-center max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Tops & Corsets</h1>
        <p className="text-xl text-muted-foreground">
          Elevated basics and premium corsets for turning heads day or night.
        </p>
      </div>
      <ShopGrid />
    </main>
  );
}
