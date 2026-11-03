import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#0759C7",
          "primary-hover": "#0648a3",
          navy: "#102C55",
          "navy-light": "#1B3B6F",
          orange: "#F58220",
          "orange-hover": "#e07114",
          light: "#F4F8FD",
          subtle: "#EBF2FB",
          border: "#E2E8F0",
        },
        success: {
          DEFAULT: "#16A34A",
          light: "#DCFCE7",
          dark: "#15803D",
        },
        warning: {
          DEFAULT: "#F59E0B",
          light: "#FEF3C7",
        },
        danger: {
          DEFAULT: "#DC2626",
          light: "#FEE2E2",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 10px rgba(7, 89, 199, 0.05), 0 1px 3px rgba(0, 0, 0, 0.03)",
        card: "0 4px 20px -2px rgba(16, 44, 85, 0.06)",
        dropdown: "0 10px 25px -5px rgba(16, 44, 85, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
