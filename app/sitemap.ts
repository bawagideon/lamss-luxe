import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.lamsseluxe.ca';
  
  const routes = [
    '',
    '/shop',
    '/shop/dresses',
    '/shop/tops',
    '/shop/two-piece',
    '/collections',
    '/about',
    '/contact',
    '/community'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return [...routes];
}
