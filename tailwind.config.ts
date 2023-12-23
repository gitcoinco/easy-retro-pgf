import { type Config } from "tailwindcss";

import colors from "tailwindcss/colors";
import theme from "tailwindcss/defaultTheme";

const customColors = {
  primary: {
    400: "#648fe4",
    500: "#698dff",
    600: "#346ddb",
    700: "#395794",
  },
  secondary: {
    100: "#EDF4FC",
    200: "#D7E6F9",
    600: "#2173DF",
    700: "#1C65C4",
  },
  success: {
    100: "#EEF6EE",
    200: "#DEEDDE",
    600: "#5BA85A",
    700: "#3F753E",
    800: "#3F753E",
  },
  error: {
    100: "#FDF6F2",
    200: "#FAEAE0",
    600: "#DD6B20",
    700: "#C45F1C",
  },
  highlight: {
    600: "#F3CF00",
  },
};

export default {
  content: ["./src/**/*.tsx"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ...colors,
        ...customColors,
        gray: colors.stone,
      },
      fontFamily: {
        sans: ["var(--font-inter)", ...theme.fontFamily.sans],
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
} satisfies Config;
