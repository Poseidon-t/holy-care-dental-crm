import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary accent palette (driven by CSS variables per theme)
        primary: {
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
          200: 'var(--color-primary-200)',
          300: 'var(--color-primary-300)',
          400: 'var(--color-primary-400)',
          500: 'var(--color-primary-500)',
          600: 'var(--color-primary-600)',
          700: 'var(--color-primary-700)',
          800: 'var(--color-primary-800)',
          900: 'var(--color-primary-900)',
        },
        // Semantic surface tokens
        surface: {
          DEFAULT: 'var(--color-surface)',
          alt: 'var(--color-surface-alt)',
          deep: 'var(--color-surface-deep)',
          deepest: 'var(--color-surface-deepest)',
        },
        card: 'var(--color-card)',
        // Semantic text tokens
        heading: 'var(--color-text-heading)',
        body: 'var(--color-text-body)',
        muted: 'var(--color-text-muted)',
        faint: 'var(--color-text-faint)',
        ondeep: 'var(--color-text-on-deep)',
        // Semantic border tokens
        line: {
          DEFAULT: 'var(--color-border)',
          subtle: 'var(--color-border-subtle)',
          strong: 'var(--color-border-strong)',
        },
      },
      fontFamily: {
        heading: 'var(--font-heading)',
        tamil: ['Noto Sans Tamil', 'sans-serif'],
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
