import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'govuk-blue': '#1d70b8',
        'govuk-blue-dark': '#144e81',
        'govuk-green': '#00703c',
        'govuk-green-dark': '#005a30',
        'govuk-red': '#d4351c',
        'govuk-orange': '#f47738',
        'govuk-yellow': '#ffdd00',
        'govuk-black': '#0b0c0c',
        'govuk-mid-grey': '#b1b4b6',
        'govuk-light-grey': '#f3f2f1',
        'govuk-white': '#ffffff',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
