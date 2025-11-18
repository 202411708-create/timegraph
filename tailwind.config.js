/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'muji-dark': '#3a3a3a',
        'muji-mid': '#6b6b6b',
        'muji-beige': '#e8e3db',
        'muji-bg': '#f5f3ef',
        'muji-focused': '#3a3a3a',
        'muji-distracted': '#a89f91',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
