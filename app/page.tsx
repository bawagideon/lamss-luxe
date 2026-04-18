import { Hero } from "@/components/Hero";
import { ShopGrid } from "@/components/ShopGrid";
import { CommunityWaitlist } from "@/components/CommunityWaitlist";
import { CategoryShop } from "@/components/CategoryShop";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col w-full bg-background">
      <Hero />
      <CategoryShop />
      <ShopGrid />
      <CommunityWaitlist />
      <Footer />
    </main>
  );
}
