import { ShopGrid } from "@/components/ShopGrid";
import { getProductsByCategory } from "@/app/actions/products";

export default async function OuterwearPage() {
  const products = await getProductsByCategory('outerwear');

  return (
    <main className="flex min-h-screen flex-col w-full bg-background pt-40">
      <div className="container mx-auto px-6 text-center max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight uppercase">Outerwear</h1>
        <p className="text-xl text-muted-foreground font-medium">
          Statement coats and premium layers. Elevate your silhouette.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 px-6 text-center">
          <h2 className="text-2xl font-bold mb-4 uppercase tracking-widest text-gray-400">Newly Curation In Progress</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Our latest outerwear collection is currently being prepared. Check back shortly for our new drops.
          </p>
        </div>
      ) : (
        <ShopGrid initialProducts={products} />
      )}
    </main>
  );
}
