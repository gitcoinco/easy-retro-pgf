import { type Config } from "tailwindcss";

import colors from "tailwindcss/colors";
import theme from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          ...colors,  
          100: "#2fe4ab",//Check with Leonardo
          200: "#2fe4ab",
          300: "#2fe4ab",
          400: "#2fe4ab",
          500: "#2fe4ab",
          600: "#2fe4ab",
          700: "#2fe4ab",
        },
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
