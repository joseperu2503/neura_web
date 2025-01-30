/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        "dark-1": "#181a20",
        "dark-2": "#262a36",
        "dark-3": "#36383f",
        "dark-4": "#20222a",
        "dark-5": "#373c43",
        "dark-6": "#9b9c9f",
        "dark-7": "#272a34",
        "dark-8": "#34383f",

        primary: "#11a575",
        "primary-2": "#0f8861",
      },
    },
  },
  plugins: [],
};
