import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── InvBank base — tuned to Apex reference (cool neutrals, desaturated) ──
        background: "#F1F2F4",  // Cool soft gray (hero body bg in the reference)
        foreground: "#1a1a1a",
        gold: {
          // Retained for legacy dashboard pages still using gold. Not used on landing.
          50: "#FFFCF0",
          100: "#FFF8E1",
          200: "#FFE9A0",
          300: "#FFD54F",
          400: "#FFC107",
          500: "#F2CA27",
          600: "#EBA420",
          700: "#D08C1D",
          800: "#b07618",
          900: "#8a5d13",
        },
        // ── InvBank navy ── desaturated steel-blue. Matches the Apex hero overlay,
        // sign-in button, footnote accents. Less jewel-tone, more corporate-utility.
        navy: {
          50:  "#F3F5F8",
          100: "#DEE4EC",
          200: "#BCC6D6",
          300: "#94A2B9",
          400: "#6B7D99",
          500: "#4A5E7C",
          600: "#354A68",
          700: "#2C3E5A",   // Primary — headline accent, nav CTA, path pills
          800: "#213048",
          900: "#17223A",
          950: "#0D1626",
        },
        brand: {
          DEFAULT: "#2C3E5A",
          light:   "#354A68",
          dark:    "#17223A",
          accent:  "#EBA420",
        },
        // Neutral stone greys (FDIC bar, section dividers, card borders)
        stone: {
          50:  "#F7F7F6",
          100: "#EEEDEA",
          200: "#E0DFDB",
          300: "#CFCEC9",
          400: "#A8A7A2",
          500: "#82817D",
          600: "#5F5E5A",
        },
        light: {
          50:  "#FAFBFC",  // Near-white (cards)
          100: "#F1F2F4",  // Body bg (matches reference)
          200: "#E6E8EC",  // Subtle section bg
          300: "#D4D7DD",  // Hairline borders / dividers
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
        dark: {
          700: "#2a2a2a",
          800: "#1f1f1f",
          900: "#0a0a0a",
        },
      },
      fontFamily: {
        gruppo: ["var(--font-gruppo)", "sans-serif"],
        'work-sans': ["var(--font-work-sans)", "sans-serif"],
        sans: ["var(--font-work-sans)", "sans-serif"],
        display: ["var(--font-work-sans)", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'slide-in-from-top': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        wiggle: 'wiggle 0.5s ease-in-out',
        'slide-in-from-top': 'slide-in-from-top 0.2s ease-out',
        'fade-in': 'fade-in 0.15s ease-in',
        'scale-in': 'scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'shimmer': 'shimmer 2s infinite',
      },
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
      transitionDuration: {
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
    },
  },
  plugins: [],
};

export default config;
