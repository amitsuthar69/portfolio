import colors from "tailwindcss/colors";
import { fontFamily } from "tailwindcss/defaultTheme";
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        primary: ["Inter", fontFamily.sans]
      },
      colors: {
        primary: colors.blue,
        ternary: colors.teal,
        theme: colors.neutral
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};
