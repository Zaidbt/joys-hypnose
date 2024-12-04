/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['var(--font-playfair)'],
        quicksand: ['var(--font-quicksand)'],
      },
      colors: {
        primary: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        rose: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        sand: {
          50: '#fdfbf7',
          100: '#fbf7ef',
          200: '#f5ead7',
          300: '#efe0c4',
          400: '#e9d6b1',
          500: '#e3cc9e',
          600: '#ccb68e',
          700: '#aa9877',
          800: '#887a5f',
          900: '#70644e',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#334155',
            fontFamily: 'var(--font-quicksand)',
            h1: {
              color: '#1e293b',
              fontFamily: 'var(--font-playfair)',
            },
            h2: {
              color: '#1e293b',
              fontFamily: 'var(--font-playfair)',
            },
            h3: {
              color: '#1e293b',
              fontFamily: 'var(--font-playfair)',
            },
            h4: {
              color: '#1e293b',
              fontFamily: 'var(--font-playfair)',
            },
            a: {
              color: '#ec4899',
              '&:hover': {
                color: '#db2777',
              },
            },
            blockquote: {
              borderLeftColor: '#ec4899',
              fontFamily: 'var(--font-playfair)',
              fontStyle: 'italic',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
} 