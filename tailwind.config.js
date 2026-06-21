/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FDFBF7',
        beige: '#F5EFEB',
        softOrange: '#FCD2A8',
        brown: '#8B5A2B',
        gold: '#F4B942',
        darkBrown: '#4A3728',
      },
      fontFamily: {
        sans: ['Nunito', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
