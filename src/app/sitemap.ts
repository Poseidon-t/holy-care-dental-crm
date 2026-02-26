import { MetadataRoute } from 'next';
import { getAllArticles } from '@/lib/articles';

const SITE_URL = 'https://www.holycareortho.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();

  const articleRoutes = articles.map((article) => ({
    url: `${SITE_URL}/knowledge/${article.slug}`,
    lastModified: new Date(article.publishDate),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/knowledge`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...articleRoutes,
  ];
}
