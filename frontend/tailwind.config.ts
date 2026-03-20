import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e8eef5',
          100: '#c5d5e9',
          200: '#9eb9d9',
          300: '#769dc9',
          400: '#5888bd',
          500: '#3a72b1',
          600: '#2d5f9a',
          700: '#1e3a5f',
          800: '#162c47',
          900: '#0d1e30',
        },
        status: {
          ok: '#27ae60',
          alerte: '#e74c3c',
          partiel: '#f39c12',
        },
        urgence: {
          normal: '#27ae60',
          urgent: '#f39c12',
          critique: '#e74c3c',
        },
      },
    },
  },
  plugins: [],
};

export default config;
