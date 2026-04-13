/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        solar: {
          gold: '#f8b400',
          deep: '#222831',
          slate: '#393e46',
          emerald: '#0cc282',
          soft: '#fbfbfc',
          border: '#f1f1f1'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        accent: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 20px 40px rgba(0, 0, 0, 0.08)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
      }
    },
  },
  plugins: [],
}
