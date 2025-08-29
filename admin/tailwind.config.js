/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        audiowide: ["'Audiowide'", "cursive"],
        electrolize: ["'Electrolize'", "sans-serif"],
      },
      colors: {
        primary: "#344d6e",
      },
    },
  },
  plugins: [],
};

