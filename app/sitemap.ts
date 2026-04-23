import { MetadataRoute } from 'next';
import { getActiveProducts } from '@/app/actions/products';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.lamsseluxe.ca';

  // Fetch all products to include in sitemap
  let products: { id: string }[] = [];
  try {
    products = await getActiveProducts();
  } catch {
    console.error("Sitemap generation error: Fetching products failed.");
  }

  const productUrls = products.map((product) => ({
    url: `${baseUrl}/product/${product.id}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  const categories = ['dresses', 'two-piece', 'tops', 'accessories', 'shoes', 'bodyctrl'];
  const categoryUrls = categories.map((cat) => ({
    url: `${baseUrl}/shop/${cat}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  const staticUrls = [
    '',
    '/shop',
    '/collections',
    '/community'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.9,
  }));

  return [...staticUrls, ...categoryUrls, ...productUrls];
}
