'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

const THEMES = [
  { id: 'classic', name: 'Classic', description: 'Bold golden-yellow, clean white', color: '#eab308' },
  { id: 'premium', name: 'Premium', description: 'Warm beige, serif headings', color: '#b8a590' },
] as const;

export function ThemeSelectorButton({ currentTheme }: { currentTheme: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTheme, setActiveTheme] = useState(currentTheme);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleThemeSelect = async (themeId: string) => {
    // Instant preview
    document.documentElement.setAttribute('data-theme', themeId);
    setActiveTheme(themeId);

    // Persist to database
    try {
      await fetch('/api/settings/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: themeId }),
      });
      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      console.error('Failed to save theme:', err);
      document.documentElement.setAttribute('data-theme', currentTheme);
      setActiveTheme(currentTheme);
    }

    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] no-print">
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full shadow-lg border-2 border-white/80 flex items-center justify-center transition-transform hover:scale-110 bg-surface-deep"
        title="Change site design"
        aria-label="Open theme selector"
      >
        <svg className="w-5 h-5 text-ondeep" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
        </svg>
      </button>

      {/* Theme panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[-1]"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-16 right-0 bg-card border border-line rounded-2xl shadow-2xl p-5 w-72">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold font-heading text-heading">Site Design</p>
              {isPending && <span className="text-xs text-muted">Saving...</span>}
            </div>
            <div className="space-y-2">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleThemeSelect(t.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                    activeTheme === t.id
                      ? 'ring-2 ring-primary-500 bg-primary-50'
                      : 'hover:bg-surface-alt border border-line'
                  }`}
                >
                  <span
                    className="w-8 h-8 rounded-full border-2 border-line-strong flex-shrink-0"
                    style={{ backgroundColor: t.color }}
                  />
                  <div>
                    <span className="text-sm font-semibold text-heading block">{t.name}</span>
                    <span className="text-xs text-muted">{t.description}</span>
                  </div>
                  {activeTheme === t.id && (
                    <svg className="w-4 h-4 text-primary-600 ml-auto flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
