/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'navy-dark': '#0a0a0f',
        'navy': '#111118',
        'surface': '#0e0e16',
        'ring': '#1a1a28',
        'xf': { primary: '#e63946', dim: '#e6394633' },
        'bm': { primary: '#f4a824', dim: '#f4a82422' },
        'howl': { primary: '#6366f1', dim: '#6366f122' },
        'ds': { primary: '#8b5cf6' },
      },
    },
  },
  plugins: [],
};
