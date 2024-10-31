import { type Config } from "tailwindcss";

import colors from "tailwindcss/colors";
import theme from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        primary: {
          ...colors,  
          100: "#D5FAEE",
          500: "#47e9bb",
          600: "#2fe4ab",
          700: "#1D5249",
          800: "#0B1F1B",
        },
        secondary: {
          ...colors,  
          100: "#e1e9eb",
          500: "#243d42",
          600: "#182d32",      
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
