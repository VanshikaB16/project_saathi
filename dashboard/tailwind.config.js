/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saathi: {
          navy: '#16324F',
          deepNavy: '#10263A',
          teal: '#168C8C',
          softMint: '#BDE8D5',
          paleMint: '#EAF6F1',
          offWhite: '#F7F8F4',
          textPrimary: '#183044',
          textSecondary: '#526779',
          textMuted: '#6D7F8C',
          border: '#D8E3E8',
          success: '#218653',
          amber: '#A96600',
          red: '#B42332',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans', 'Noto Sans Devanagari', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
