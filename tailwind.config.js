/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        primary: {
          400: "#36393f",
          500: "#2f3136",
          600: "#202225",
          700: "#202225"
        }
      },
      fontFamily: {
        Catamaran: ['Catamaran', 'sans-serif']
      }
    },
  },
  plugins: [],
}
