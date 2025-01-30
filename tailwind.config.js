/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        "dark-1": "#181a20",
        "dark-2": "#262a36",
        "dark-3": "#36383f",
        primary: "#17ce92",
      },
    },
  },
  plugins: [],
};
