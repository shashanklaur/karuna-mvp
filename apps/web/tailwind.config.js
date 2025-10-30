/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          100: "#e6f6ef",
          200: "#c7ebd7",
          500: "#32b47a",
          600: "#289468",
          700: "#217655"
        }
      }
    }
  },
  plugins: []
};
