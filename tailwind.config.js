/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
    './node_modules/flowbite/**/*.{js,jsx,ts,tsx}',
    "./public/**/*.html",
  ],
  theme: {
    extend: {
      
    }
  },
  plugins: [
    require("flowbite/plugin"),
  ],
}
