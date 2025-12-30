/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        brittanny: ['Brittanny', 'sans-serif' ],
        spartan: ['League Spartan', 'sans-serif']
      }
    },
  },
  plugins: [],
}
