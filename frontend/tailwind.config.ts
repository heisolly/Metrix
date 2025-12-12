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
      // Color System for Gaming Platform
      colors: {
        // Brand Colors
        brand: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9", // Primary brand color
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
          950: "#082f49",
        },

        // Gaming-specific colors
        gaming: {
          primary: "#ef4444", // Vivid red for primary actions
          secondary: "#22c55e", // Emerald/green accent
          accent: "#f59e0b", // Amber for highlights
          success: "#16a34a",
          danger: "#ef4444",
          warning: "#f59e0b",
          info: "#3b82f6",
        },

        // Tournament Status Colors
        tournament: {
          draft: "#6b7280",
          upcoming: "#3b82f6",
          open: "#10b981",
          closed: "#f59e0b",
          active: "#8b5cf6",
          completed: "#6b7280",
          cancelled: "#ef4444",
        },

        // User Role Colors
        role: {
          player: "#3b82f6",
          spectator: "#8b5cf6",
          admin: "#ef4444",
        },

        // Account Tier Colors
        tier: {
          bronze: "#cd7f32",
          silver: "#c0c0c0",
          gold: "#ffd700",
          platinum: "#e5e4e2",
          diamond: "#b9f2ff",
        },

        // Dark theme colors
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

        // Light theme colors
        light: {
          bg: {
            primary: "#ffffff",
            secondary: "#f8fafc",
            tertiary: "#f1f5f9",
          },
          border: "#e2e8f0",
          text: {
            primary: "#0f172a",
            secondary: "#475569",
            muted: "#64748b",
          },
        },
      },

      // Typography
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Oxygen",
          "Ubuntu",
          "Cantarell",
          "Fira Sans",
          "Droid Sans",
          "Helvetica Neue",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "Fira Code",
          "Consolas",
          "Monaco",
          "Andale Mono",
          "Ubuntu Mono",
          "monospace",
        ],
        gaming: ["Orbitron", "sans-serif"], // Gaming-style font
      },

      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "0.75rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
        "7xl": ["4.5rem", { lineHeight: "1" }],
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["8rem", { lineHeight: "1" }],
      },

      // Spacing
      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "92": "23rem",
        "96": "24rem",
        "128": "32rem",
      },

      // Border radius
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },

      // Animations
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "fade-out": "fadeOut 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "slide-left": "slideLeft 0.3s ease-out",
        "slide-right": "slideRight 0.3s ease-out",
        "scale-up": "scaleUp 0.2s ease-out",
        "scale-down": "scaleDown 0.2s ease-out",
        "bounce-light": "bounceLight 1s infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 3s linear infinite",
        wiggle: "wiggle 1s ease-in-out infinite",
        glow: "glow 2s ease-in-out infinite alternate",
        gradient: "gradient 3s ease infinite",
        typing:
          "typing 3.5s steps(40, end), blink-caret 0.75s step-end infinite",
      },

      // Keyframes
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        slideUp: {
          "0%": { transform: "translateY(100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideLeft: {
          "0%": { transform: "translateX(100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        slideRight: {
          "0%": { transform: "translateX(-100%)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        scaleUp: {
          "0%": { transform: "scale(0.95)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        scaleDown: {
          "0%": { transform: "scale(1.05)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        bounceLight: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 6px rgba(239, 68, 68, 0.5)" },
          "100%": { boxShadow: "0 0 24px rgba(239, 68, 68, 0.8)" },
        },
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        typing: {
          "0%": { width: "0" },
          "100%": { width: "100%" },
        },
        "blink-caret": {
          "0%, 100%": { borderColor: "transparent" },
          "50%": { borderColor: "black" },
        },
      },

      // Box shadow
      boxShadow: {
        "inner-light": "inset 0 1px 0 0 rgba(255, 255, 255, 0.05)",
        "glow-sm": "0 0 10px rgba(99, 102, 241, 0.5)",
        "glow-md": "0 0 20px rgba(99, 102, 241, 0.5)",
        "glow-lg": "0 0 30px rgba(99, 102, 241, 0.5)",
        gaming: "0 0 15px rgba(139, 92, 246, 0.3)",
        tournament: "0 4px 20px rgba(59, 130, 246, 0.15)",
        "card-hover":
          "0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.05)",
      },

      // Background images
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gaming-gradient": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "tournament-gradient":
          "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
        "success-gradient": "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        "danger-gradient": "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
        "dark-gradient": "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      },

      // Backdrop blur
      backdropBlur: {
        "4xl": "72px",
      },

      // Z-index scale
      zIndex: {
        "60": "60",
        "70": "70",
        "80": "80",
        "90": "90",
        "100": "100",
      },

      // Screen sizes
      screens: {
        xs: "475px",
        "3xl": "1600px",
        "4xl": "1920px",
      },

      // Aspect ratios
      aspectRatio: {
        "4/3": "4 / 3",
        "3/2": "3 / 2",
        "2/3": "2 / 3",
        "9/16": "9 / 16",
      },

      // Grid template columns
      gridTemplateColumns: {
        "13": "repeat(13, minmax(0, 1fr))",
        "14": "repeat(14, minmax(0, 1fr))",
        "15": "repeat(15, minmax(0, 1fr))",
        "16": "repeat(16, minmax(0, 1fr))",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),

    // Custom utilities
    function ({ addUtilities, addComponents, theme }: any) {
      // Gaming-specific utilities
      addUtilities({
        ".text-glow": {
          textShadow: "0 0 10px rgba(239, 68, 68, 0.6)",
        },
        ".text-glow-lg": {
          textShadow: "0 0 20px rgba(239, 68, 68, 0.8)",
        },
        ".border-glow": {
          borderColor: theme("colors.gaming.primary"),
          boxShadow: "0 0 10px rgba(99, 102, 241, 0.3)",
        },
        ".card-glass": {
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        },
        ".card-glass-dark": {
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        },
        ".gradient-text": {
          background: "linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        },
        ".tournament-card": {
          background:
            "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
          border: "1px solid rgba(59, 130, 246, 0.2)",
        },
      });

      // Gaming components
      addComponents({
        ".btn-gaming": {
          background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
          color: "white",
          padding: "0.5rem 1rem",
          borderRadius: "0.375rem",
          fontWeight: "500",
          transition: "all 0.2s",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 4px 12px rgba(239, 68, 68, 0.4)",
          },
          "&:active": {
            transform: "translateY(0)",
          },
        },
        ".btn-tournament": {
          background: "linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)",
          color: "white",
          padding: "0.5rem 1rem",
          borderRadius: "0.375rem",
          fontWeight: "500",
          transition: "all 0.2s",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 4px 12px rgba(59, 130, 246, 0.4)",
          },
        },
        ".tournament-status": {
          padding: "0.25rem 0.75rem",
          borderRadius: "9999px",
          fontSize: "0.875rem",
          fontWeight: "500",
          textTransform: "uppercase",
          letterSpacing: "0.025em",
        },
        ".tier-badge": {
          padding: "0.25rem 0.5rem",
          borderRadius: "0.375rem",
          fontSize: "0.75rem",
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        },
        ".gaming-card": {
          backgroundColor: theme("colors.white"),
          borderRadius: "0.75rem",
          boxShadow:
            "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          padding: "1.5rem",
          transition: "all 0.2s",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow:
              "0 10px 25px rgba(0, 0, 0, 0.1), 0 4px 10px rgba(0, 0, 0, 0.05)",
          },
          ".dark &": {
            backgroundColor: theme("colors.gray.800"),
            borderColor: theme("colors.gray.700"),
          },
        },
      });
    },
  ],
};

export default config;
