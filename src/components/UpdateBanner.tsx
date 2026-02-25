'use client';

import { useState, useEffect, useRef } from 'react';

const POLL_INTERVAL = 60_000; // 60 seconds

export function UpdateBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const initialBuildId = useRef<string | null>(null);

  useEffect(() => {
    const checkVersion = async () => {
      try {
        const res = await fetch('/api/version', { cache: 'no-store' });
        if (!res.ok) return;
        const { buildId } = await res.json();

        if (initialBuildId.current === null) {
          // First fetch — store the current build ID
          initialBuildId.current = buildId;
        } else if (buildId !== initialBuildId.current) {
          // Build ID changed — new deployment detected
          setShowBanner(true);
        }
      } catch {
        // Network error — silently ignore
      }
    };

    checkVersion();
    const interval = setInterval(checkVersion, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-6 left-6 z-[9998] animate-fade-in-up">
      <div className="bg-card border border-line rounded-2xl shadow-2xl px-5 py-4 flex items-center gap-4 max-w-sm">
        <div className="flex-1">
          <p className="text-sm font-semibold text-heading">New version available</p>
          <p className="text-xs text-muted mt-0.5">Refresh to see the latest updates.</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-surface-deep text-ondeep text-xs font-semibold px-4 py-2 rounded-full hover:opacity-90 transition-opacity flex-shrink-0"
        >
          Refresh
        </button>
        <button
          onClick={() => setShowBanner(false)}
          className="text-muted hover:text-heading transition-colors flex-shrink-0"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
