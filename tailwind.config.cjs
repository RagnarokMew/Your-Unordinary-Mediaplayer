/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* Light Theme Colour Palette */
        'primary': '',
        'secondary': '',
        'accent1': '',
        'accent2': '',
  
        /* Dark Theme Colour Pallete*/
        'primary-dark': '#1c0414',
        'secondary-dark': '#14959c',
        'accent1-dark': '',
        'accent2-dark': '',
      },
    },
  },
  plugins: [],
}
