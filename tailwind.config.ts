import { type Config } from "tailwindcss";

import colors from "tailwindcss/colors";
import theme from "tailwindcss/defaultTheme";


const customColors = {
  primary: {
    400: "#2FE4AB",
    500: "#2FE4AB",
    600: "#2FE4AB",
    700: "#2FE4AB",
  },
  secondary: {
    100: "#2FE4AB",
    200: "#D7E6F9",
    600: "#2FE4AB",
    700: "#2FE4AB",
  },
  success: {
    100: "#2FE4AB",
    200: "#2FE4AB",
    600: "#2FE4AB",
    700: "#2FE4AB",
    800: "#2FE4AB",
  },
  error: {
    100: "#FDF6F2",
    200: "#FAEAE0",
    600: "#DD603C",
    700: "#DD603C",
  },
  highlight: {
    600: "#2FE4AB",
  },
};


export default {
  content: ["./src/**/*.tsx"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ...colors,
        primary: colors.green,
        gray: colors.stone,
      },
      fontFamily: {
        sans: ["var(--font-inter)", ...theme.fontFamily.sans],
        heading: ["var(--font-heading)", ...theme.fontFamily.sans],
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
} satisfies Config;
