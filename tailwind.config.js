/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // O 'media' si prefieres la preferencia del sistema
  theme: {
    extend: {
      // Tus extensiones de tema aquí
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'), // Asegúrate de que esta línea esté presente
    // Otros plugins que puedas tener
  ],
}