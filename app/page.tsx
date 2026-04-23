import { Hero } from "@/components/Hero";
import { ShopGrid } from "@/components/ShopGrid";
import { CategoryShop } from "@/components/CategoryShop";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col w-full bg-background">
      <Hero />
      <CategoryShop />
      <ShopGrid />
    </main>
  );
}
