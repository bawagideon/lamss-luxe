import { getProductById } from "@/app/actions/products";
import { ProductDisplay } from "@/components/ProductDisplay";
import { notFound } from "next/navigation";

export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  return (
    <main className="flex min-h-screen flex-col w-full bg-background pt-24 pb-16">
      <ProductDisplay product={product} />
    </main>
  );
}
