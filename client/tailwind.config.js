/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        algo: "#021F3A",
        darkgray: "#2B2B2B",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        lobster: ["Lobster", "cursive"],
      },
    },
    screens: {
      xs: "480px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1530px",
    },
  },
  plugins: [],
};
