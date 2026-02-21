import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf8f4',
          100: '#faeee3',
          200: '#f3d9c4',
          300: '#eabc9a',
          400: '#de9a6c',
          500: '#d4804c',
          600: '#c06835',
          700: '#a0522d',
          800: '#834327',
          900: '#6d3823',
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
