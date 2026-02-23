import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getAllArticles } from '@/lib/articles';
import { ArticleNav } from '@/components/ArticleNav';

export const metadata: Metadata = {
  title: 'Dental Health Knowledge',
  description:
    'Expert dental health articles by Dr. Pinky Vijay. Learn about root canal treatment, dental implants, teeth whitening, cavity prevention, and more. Available in English and Tamil.',
  openGraph: {
    title: 'Dental Health Knowledge | Holy Care Dental',
    description:
      'Expert dental health articles and guides. Learn about treatments, prevention, and oral care tips.',
    type: 'website',
  },
};

const SITE_URL = 'https://patient-rejoicing-production-8ead.up.railway.app';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Dental Health Knowledge',
  description: 'Expert dental health articles by Dr. Pinky Vijay',
  url: `${SITE_URL}/knowledge`,
  isPartOf: { '@id': `${SITE_URL}/#website` },
  publisher: { '@id': `${SITE_URL}/#organization` },
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
            Expert articles on dental care, treatments, and oral health — by Dr. Pinky Vijay.
            Available in English and Tamil.
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
            Chat with our AI assistant or book a consultation with Dr. Pinky Vijay.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="tel:+917977257779"
              className="bg-[var(--color-btn-dark)] text-ondeep px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.58 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              Call 079772 57779
            </a>
            <Link
              href="/"
              className="text-primary-600 border-2 border-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
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
            &copy; {new Date().getFullYear()} Holy Care Dental & Orthodontic Clinic. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
