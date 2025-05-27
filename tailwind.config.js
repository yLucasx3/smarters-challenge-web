/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts,css}"],
  theme: {
    extend: {
      colors: {
        "black-rgba": "rgba(0, 0, 0, 0.5)",
        "white-rgba": "rgba(255, 255, 255, 0.5)",
      },
    },
  },
  plugins: [],
};
