import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff7f4',
          100: '#ffede6',
          200: '#ffdace',
          300: '#ffbfa8',
          400: '#ff9f80',
          500: '#f07d5e',
          600: '#e06b4c',
          700: '#c85a3f',
          800: '#a64a35',
          900: '#8a3f2d',
        },
      },
      fontFamily: {
        tamil: ['Noto Sans Tamil', 'sans-serif'],
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
