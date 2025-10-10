import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FEFDFB",  // Warm off-white
        foreground: "#1a1a1a",  // Near black for text
        gold: {
          50: "#FFFCF0",   // Lightest gold wash
          100: "#FFF8E1",  // Very light gold
          200: "#FFE9A0",  // Soft gold
          300: "#FFD54F",  // Medium gold
          400: "#FFC107",  // Vibrant gold
          500: "#F2CA27",  // True Gold - Primary accent
          600: "#EBA420",  // Rich Golden Orange
          700: "#D08C1D",  // Deep Amber
          800: "#b07618",  // Darker amber
          900: "#8a5d13",  // Darkest gold
        },
        light: {
          50: "#FEFDFB",   // Warm white
          100: "#FAF9F7",  // Light cream
          200: "#F5F3F0",  // Soft beige
          300: "#E8E6E3",  // Light gray
        },
        neutral: {
          100: "#f5f5f5",
          200: "#e5e5e5",
          300: "#d4d4d4",
          400: "#a3a3a3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#1a1a1a",
        },
      },
      fontFamily: {
        gruppo: ["var(--font-gruppo)", "sans-serif"],
        sans: ["var(--font-gruppo)", "sans-serif"],
        display: ["var(--font-gruppo)", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
};

export default config;
