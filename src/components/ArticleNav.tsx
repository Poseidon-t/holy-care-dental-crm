import Link from 'next/link';
import Image from 'next/image';

export function ArticleNav({ breadcrumb }: { breadcrumb?: string }) {
  return (
    <nav aria-label="Breadcrumb" className="bg-[var(--color-nav-bg)] backdrop-blur-md sticky top-0 z-50 border-b border-line">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Image src="/images/logo.png" alt="ClinicFlow" width={32} height={32} className="w-8 h-8" />
              <span className="font-bold font-heading text-heading text-base hidden sm:inline">ClinicFlow</span>
            </Link>
            {breadcrumb && (
              <>
                <svg className="w-4 h-4 text-faint" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M9 18l6-6-6-6" />
                </svg>
                <Link href="/knowledge" className="text-sm text-muted hover:text-heading transition-colors">
                  Knowledge
                </Link>
                {breadcrumb !== 'Knowledge' && (
                  <>
                    <svg className="w-4 h-4 text-faint hidden sm:block" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                    <span className="text-sm text-heading font-medium truncate max-w-[200px] hidden sm:block">{breadcrumb}</span>
                  </>
                )}
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/knowledge"
              className="text-sm text-muted hover:text-heading transition-colors hidden md:inline"
            >
              All Articles
            </Link>
            <Link
              href="/"
              className="text-sm font-medium bg-[var(--color-btn-dark)] text-ondeep px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Home
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
