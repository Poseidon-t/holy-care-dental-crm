import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getArticleBySlug, getAllArticles, getRelatedArticles } from '@/lib/articles';
import { ArticleNav } from '@/components/ArticleNav';

const SITE_URL = 'https://patient-rejoicing-production-8ead.up.railway.app';

export function generateStaticParams() {
  return getAllArticles().map((article) => ({
    slug: article.slug,
  }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const article = getArticleBySlug(params.slug);
  if (!article) return { title: 'Article Not Found' };

  return {
    title: article.title,
    description: article.metaDescription,
    keywords: article.tags,
    authors: [{ name: article.author }],
    openGraph: {
      title: article.title,
      description: article.metaDescription,
      type: 'article',
      publishedTime: article.publishDate,
      authors: [article.author],
      images: [
        {
          url: article.heroImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      locale: article.language === 'ta' ? 'ta_IN' : 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.metaDescription,
      images: [article.heroImage],
    },
    alternates: {
      canonical: `${SITE_URL}/knowledge/${article.slug}`,
    },
  };
}

export default function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();

  const related = getRelatedArticles(params.slug, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: article.title,
        description: article.metaDescription,
        image: `${SITE_URL}${article.heroImage}`,
        datePublished: article.publishDate,
        dateModified: article.publishDate,
        author: {
          '@type': 'Person',
          name: article.author,
          jobTitle: 'MDS - Orthodontics & Dentofacial Orthopedics',
          url: SITE_URL,
        },
        publisher: {
          '@type': 'Organization',
          name: 'Holy Care Dental & Orthodontic Clinic',
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/images/logo.jpg`,
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${SITE_URL}/knowledge/${article.slug}`,
        },
        inLanguage: article.language === 'ta' ? 'ta' : 'en',
        keywords: article.tags.join(', '),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: SITE_URL,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Knowledge',
            item: `${SITE_URL}/knowledge`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: article.title,
          },
        ],
      },
    ],
  };

  const isTamil = article.language === 'ta';

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleNav breadcrumb={article.title} />

      {/* Article Header */}
      <article lang={isTamil ? 'ta' : 'en'}>
        <header className="bg-surface">
          {/* Hero Image */}
          <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
            <Image
              src={article.heroImage}
              alt={article.title}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-transparent to-transparent" />
          </div>

          <div className="max-w-3xl mx-auto px-4 -mt-16 relative z-10">
            {/* Badges */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[11px] font-bold uppercase tracking-widest bg-primary-500 text-white px-3 py-1 rounded-full">
                {article.category}
              </span>
              <span
                className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                  isTamil
                    ? 'bg-orange-500 text-white'
                    : 'bg-blue-500 text-white'
                }`}
              >
                {isTamil ? 'தமிழ்' : 'English'}
              </span>
            </div>

            {/* Title */}
            <h1
              className={`text-3xl md:text-4xl lg:text-5xl font-bold text-heading leading-tight mb-4 ${
                isTamil ? 'font-tamil' : 'font-heading'
              }`}
            >
              {article.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted pb-8 border-b border-line">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <span className="font-medium text-heading">{article.author}</span>
              </div>
              <span className="w-1 h-1 rounded-full bg-faint" />
              <span>
                {new Date(article.publishDate).toLocaleDateString('en-IN', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span className="w-1 h-1 rounded-full bg-faint" />
              <span>{article.readingTime}</span>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <div className="bg-surface py-8 md:py-12">
          <div className="max-w-3xl mx-auto px-4">
            <div
              className={`article-content ${isTamil ? 'tamil' : ''}`}
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </div>

        {/* Tags */}
        <div className="bg-surface pb-8">
          <div className="max-w-3xl mx-auto px-4">
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-surface-alt text-muted px-3 py-1.5 rounded-full border border-line"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </article>

      {/* CTA */}
      <section className="bg-surface-alt py-10 md:py-14">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-card rounded-2xl border border-line p-8">
            <h2 className="text-xl font-bold font-heading text-heading mb-2">
              {isTamil ? 'கேள்விகள் உள்ளதா?' : 'Have Questions?'}
            </h2>
            <p className="text-muted mb-6">
              {isTamil
                ? 'எங்கள் AI உதவியாளரிடம் சாட் செய்யுங்கள் அல்லது Dr. Pinky Vijay உடன் ஆலோசனை பெறுங்கள்.'
                : 'Chat with our AI assistant or book a consultation with Dr. Pinky Vijay.'}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="tel:+917977257779"
                className="bg-[var(--color-btn-dark)] text-ondeep px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                {isTamil ? 'அழைக்கவும்' : 'Call'} 079772 57779
              </a>
              <Link
                href="/knowledge"
                className="text-primary-600 border-2 border-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
              >
                {isTamil ? 'அனைத்து கட்டுரைகள்' : 'All Articles'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="bg-surface py-10 md:py-14">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl font-bold font-heading text-heading mb-6 text-center">
              {isTamil ? 'தொடர்புடைய கட்டுரைகள்' : 'Related Articles'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/knowledge/${rel.slug}`}
                  className="group bg-card rounded-2xl border border-line overflow-hidden hover:shadow-lg transition-all"
                >
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={rel.heroImage}
                      alt={rel.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span
                      className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        rel.language === 'ta'
                          ? 'bg-orange-500 text-white'
                          : 'bg-blue-500 text-white'
                      }`}
                    >
                      {rel.language === 'ta' ? 'தமிழ்' : 'EN'}
                    </span>
                  </div>
                  <div className="p-4">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-primary-600">
                      {rel.category}
                    </span>
                    <h3
                      className={`text-sm font-bold text-heading mt-1 group-hover:text-primary-600 transition-colors line-clamp-2 ${
                        rel.language === 'ta' ? 'font-tamil' : 'font-heading'
                      }`}
                    >
                      {rel.title}
                    </h3>
                    <p className="text-xs text-faint mt-2">{rel.readingTime}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-[var(--color-surface-deep)] text-[var(--color-text-on-deep)] py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm opacity-70">
            &copy; {new Date().getFullYear()} Holy Care Dental & Orthodontic Clinic. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
