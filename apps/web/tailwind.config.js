/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        karuna: {
          bg: "#FAF8F5",   // creamy background
          teal: "#3ABAB4", // primary accent
          sage: "#B5CDA3", // secondary
          coral: "#E57373" // gentle error
        }
      },
      boxShadow: {
        soft: "0 6px 24px rgba(0,0,0,0.06)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
      }
    }
  },
  plugins: []
};
