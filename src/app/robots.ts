import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/api/', '/login', '/register/', '/report/'],
      },
    ],
    sitemap: 'https://patient-rejoicing-production-8ead.up.railway.app/sitemap.xml',
  };
}
