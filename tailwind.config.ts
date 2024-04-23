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
          light: "rgb(76 92 146)",
          DEFAULT: "#703CD0",
          dark: "rgb(181 196 255)",
        },
        onPrimary: {
          light: "rgb(255 255 255)",
          DEFAULT: "#FFFFFF",
          dark: "rgb(28 45 97)",
        },
        primaryContainer: {
          light: "rgb(220 225 255)",
          DEFAULT: "#EADDFF",
          dark: "rgb(52 68 121)",
        },
        onPrimaryContainer: {
          light: "rgb(2 23 75)",
          DEFAULT: "#25005A",
          dark: "rgb(220 225 255)",
        },
        primaryFixed: {
          light: "rgb(220 225 255)",
          DEFAULT: "#EADDFF",
          dark: "rgb(220 225 255)",
        },
        onPrimaryFixed: {
          light: "rgb(2 23 75)",
          DEFAULT: "#25005A",
          dark: "rgb(2 23 75)",
        },
        primaryFixedDim: {
          light: "rgb(181 196 255)",
          DEFAULT: "#D2BCFF",
          dark: "rgb(181 196 255)",
        },
        onPrimaryFixedVariant: {
          light: "rgb(52 68 121)",
          DEFAULT: "#581AB7",
          dark: "rgb(52 68 121)",
        },
        secondary: {
          light: "rgb(140 78 41)",
          DEFAULT: "#005EB2",
          dark: "rgb(255 182 142)",
        },
        onSecondary: {
          light: "rgb(255 255 255)",
          DEFAULT: "#FFFFFF",
          dark: "rgb(83 34 1)",
        },
        secondaryContainer: {
          light: "rgb(255 219 202)",
          DEFAULT: "#D5E3FF",
          dark: "rgb(111 55 20)",
        },
        onSecondaryContainer: {
          light: "rgb(51 18 0)",
          DEFAULT: "#001B3C",
          dark: "rgb(255 219 202)",
        },
        secondaryFixed: {
          light: "rgb(255 219 202)",
          DEFAULT: "#D5E3FF",
          dark: "rgb(255 219 202)",
        },
        onSecondaryFixed: {
          light: "rgb(51 18 0)",
          DEFAULT: "#001B3C",
          dark: "rgb(51 18 0)",
        },
        secondaryFixedDim: {
          light: "rgb(255 182 142)",
          DEFAULT: "#A7C8FF",
          dark: "rgb(255 182 142)",
        },
        onSecondaryFixedVariant: {
          light: "rgb(111 55 20)",
          DEFAULT: "#004788",
          dark: "rgb(111 55 20)",
        },
        tertiary: {
          light: "rgb(110 94 14)",
          DEFAULT: "#7E525E",
          dark: "rgb(220 198 110)",
        },
        onTertiary: {
          light: "rgb(255 255 255)",
          DEFAULT: "#FFFFFF",
          dark: "rgb(58 48 0)",
        },
        tertiaryContainer: {
          light: "rgb(249 226 135)",
          DEFAULT: "#FFD9E1",
          dark: "rgb(84 70 0)",
        },
        onTertiaryContainer: {
          light: "rgb(34 27 0)",
          DEFAULT: "#31101C",
          dark: "rgb(249 226 135)",
        },
        tertiaryFixed: {
          light: "rgb(249 226 135)",
          DEFAULT: "#FFD9E1",
          dark: "rgb(249 226 135)",
        },
        onTertiaryFixed: {
          light: "rgb(34 27 0)",
          DEFAULT: "#31101C",
          dark: "rgb(34 27 0)",
        },
        tertiaryFixedDim: {
          light: "rgb(220 198 110)",
          DEFAULT: "#F0B8C6",
          dark: "rgb(220 198 110)",
        },
        onTertiaryFixedVariant: {
          light: "rgb(84 70 0)",
          DEFAULT: "#643B47",
          dark: "rgb(84 70 0)",
        },
        error: {
          light: "rgb(144 74 75)",
          DEFAULT: "#BA1437",
          dark: "rgb(255 179 178)",
        },
        onError: {
          light: "rgb(255 255 255)",
          DEFAULT: "#FFFFFF",
          dark: "rgb(86 29 32)",
        },
        errorContainer: {
          light: "rgb(255 218 217)",
          DEFAULT: "#FFDADA",
          dark: "rgb(115 51 53)",
        },
        onErrorContainer: {
          light: "rgb(59 8 13)",
          DEFAULT: "#40000B",
          dark: "rgb(255 218 217)",
        },
        outline: {
          light: "rgb(118 118 128)",
          DEFAULT: "#7A757F",
          dark: "rgb(143 144 154)",
        },
        background: {
          light: "rgb(250 248 255)",
          DEFAULT: "#FFFBFF",
          dark: "rgb(18 19 24)",
        },
        onBackground: {
          light: "rgb(26 27 33)",
          DEFAULT: "#1D1B1E",
          dark: "rgb(227 225 233)",
        },
        surface: {
          light: "rgb(250 248 255)",
          DEFAULT: "#FDF8FD",
          dark: "rgb(18 19 24)",
        },
        onSurface: {
          light: "rgb(26 27 33)",
          DEFAULT: "#1D1B1E",
          dark: "rgb(227 225 233)",
        },
        surfaceVariant: {
          light: "rgb(226 225 236)",
          DEFAULT: "#E7E0EB",
          dark: "rgb(69 70 79)",
        },
        onSurfaceVariant: {
          light: "rgb(69 70 79)",
          DEFAULT: "#49454E",
          dark: "rgb(198 198 208)",
        },
        inverseSurface: {
          light: "rgb(47 48 54)",
          DEFAULT: "#323033",
          dark: "rgb(227 225 233)",
        },
        inverseOnSurface: {
          light: "rgb(241 240 247)",
          DEFAULT: "#F5EFF4",
          dark: "rgb(47 48 54)",
        },
        inversePrimary: {
          light: "rgb(181 196 255)",
          DEFAULT: "#D2BCFF",
          dark: "rgb(76 92 146)",
        },
        shadow: {
          light: "rgb(0 0 0)",
          DEFAULT: "#000000",
          dark: "rgb(0 0 0)",
        },
        surfaceTint: {
          light: "rgb(76 92 146)",
          DEFAULT: "#703CD0",
          dark: "rgb(181 196 255)",
        },
        outlineVariant: {
          light: "rgb(198 198 208)",
          DEFAULT: "#CBC4CF",
          dark: "rgb(69 70 79)",
        },
        scrim: {
          light: "rgb(0 0 0)",
          DEFAULT: "#000000",
          dark: "rgb(0 0 0)",
        },
        surfaceContainerHighest: {
          light: "rgb(227 225 233)",
          DEFAULT: "#E6E1E6",
          dark: "rgb(52 52 58)",
        },
        surfaceContainerHigh: {
          light: "rgb(233 231 239)",
          DEFAULT: "#ECE6EB",
          dark: "rgb(41 42 47)",
        },
        surfaceContainer: {
          light: "rgb(238 237 244)",
          DEFAULT: "#F2ECF1",
          dark: "rgb(30 31 37)",
        },
        surfaceContainerLow: {
          light: "rgb(244 243 250)",
          DEFAULT: "#F8F2F7",
          dark: "rgb(26 27 33)",
        },
        surfaceContainerLowest: {
          light: "rgb(255 255 255)",
          DEFAULT: "#FFFFFF",
          dark: "rgb(13 14 19)",
        },
        surfaceBright: {
          light: "rgb(250 248 255)",
          DEFAULT: "#FDF8FD",
          dark: "rgb(56 57 63)",
        },
        surfaceDim: {
          light: "rgb(218 217 224)",
          DEFAULT: "#DED8DD",
          dark: "rgb(18 19 24)",
        },
        ...colors,
        gray: colors.stone,
      },
      fontFamily: {
        sans: ["var(--font-kumbhSans)", ...theme.fontFamily.sans],
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("@tailwindcss/forms")],
} satisfies Config;
