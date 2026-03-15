import { ShopGrid } from "@/components/ShopGrid";

export default function DressesPage() {
  return (
    <main className="flex min-h-screen flex-col w-full bg-white pt-32">
      <div className="container mx-auto px-6 text-center max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Dresses</h1>
        <p className="text-xl text-muted-foreground">
          From slip dresses to elegant maxis. Make your entrance.
        </p>
      </div>
      <ShopGrid />
    </main>
  );
}
