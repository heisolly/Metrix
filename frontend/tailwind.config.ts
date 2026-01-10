import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/hooks/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
          950: "#082f49",
        },
        gaming: {
          primary: "#ef4444",
          secondary: "#22c55e",
          accent: "#f59e0b",
          success: "#16a34a",
          danger: "#ef4444",
          warning: "#f59e0b",
          info: "#3b82f6",
        },
        tournament: {
          upcoming: "#3b82f6",
          open: "#10b981",
          closed: "#f59e0b",
          active: "#8b5cf6",
          completed: "#6b7280",
          cancelled: "#ef4444",
        },
        dark: {
          bg: {
            primary: "#0f172a",
            secondary: "#1e293b",
            tertiary: "#334155",
          },
          border: "#475569",
          text: {
            primary: "#f8fafc",
            secondary: "#cbd5e1",
            muted: "#64748b",
          },
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        gaming: ["Orbitron", "sans-serif"],
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
  ],
};

export default config;
