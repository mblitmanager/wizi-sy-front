/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'bureautique': '#3D9BE9',
        'langues': '#A55E6E',
        'internet': '#FFC533',
        'creation': '#9392BE',
      },
      fontFamily: {
        'astria': ['Astria Pro', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
        'roboto': ['Roboto', 'sans-serif'],
        'nunito': ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
