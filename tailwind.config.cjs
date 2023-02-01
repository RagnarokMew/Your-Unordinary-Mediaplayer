/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}','./src/Components/*.svelte'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'blue':{
          450: '#2989ff',
        },

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
