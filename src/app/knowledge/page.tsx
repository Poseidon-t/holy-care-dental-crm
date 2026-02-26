import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAllArticles } from '@/lib/articles';
import { ArticleNav } from '@/components/ArticleNav';

export const metadata: Metadata = {
  title: 'Health Knowledge',
  description:
    'Expert health articles and guides. Learn about treatments, prevention, and health care tips.',
  openGraph: {
    title: 'Health Knowledge | ClinicFlow',
    description:
      'Expert health articles and guides. Learn about treatments, prevention, and care tips.',
    type: 'website',
  },
};

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://www.holycareortho.com';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Health Knowledge',
  description: 'Expert health articles and guides',
  url: `${SITE_URL}/knowledge`,
  isPartOf: { '@id': `${SITE_URL}/#website` },
};

export default function KnowledgePage() {
  const articles = getAllArticles();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleNav breadcrumb="Knowledge" />

      {/* Hero */}
      <section className="bg-surface py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-bold font-heading text-heading mb-4">
            Dental Health Knowledge
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Expert articles on health care, treatments, and wellness.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="bg-surface-alt py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link
                key={article.slug}
                href={`/knowledge/${article.slug}`}
                className="group bg-card rounded-2xl border border-line overflow-hidden hover:shadow-lg hover:border-primary-300 transition-all"
              >
                {/* Hero Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={article.heroImage}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  {/* Language Badge */}
                  <span
                    className={`absolute top-3 right-3 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      article.language === 'ta'
                        ? 'bg-orange-500 text-white'
                        : 'bg-blue-500 text-white'
                    }`}
                  >
                    {article.language === 'ta' ? 'தமிழ்' : 'EN'}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Category */}
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-primary-600">
                    {article.category}
                  </span>

                  {/* Title */}
                  <h2
                    className={`text-lg font-bold text-heading mt-1.5 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2 ${
                      article.language === 'ta' ? 'font-tamil' : 'font-heading'
                    }`}
                  >
                    {article.title}
                  </h2>

                  {/* Description */}
                  <p className="text-sm text-muted line-clamp-2 mb-4">
                    {article.metaDescription}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between text-xs text-faint">
                    <div className="flex items-center gap-3">
                      <span>{article.readingTime}</span>
                      <span className="w-1 h-1 rounded-full bg-faint" />
                      <span>
                        {new Date(article.publishDate).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <span className="text-primary-600 font-medium group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                      Read
                      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-surface py-12 md:py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold font-heading text-heading mb-3">
            Have dental questions?
          </h2>
          <p className="text-muted mb-6">
            Chat with our AI assistant or contact your clinic for a consultation.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="bg-[var(--color-btn-dark)] text-ondeep px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--color-surface-deep)] text-[var(--color-text-on-deep)] py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm opacity-70">
            &copy; {new Date().getFullYear()} ClinicFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
