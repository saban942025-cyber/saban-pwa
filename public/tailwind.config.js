/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        saban: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          500: '#14b8a6', // Teal Theme
          600: '#0d9488',
          800: '#115e59',
          900: '#134e4a',
        }
      },
      fontFamily: {
        sans: ['Heebo', 'sans-serif'],
      }
    },
  },
  plugins: [],
}