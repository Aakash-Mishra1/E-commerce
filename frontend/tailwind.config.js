/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-color)",
        navy: "var(--navy-color)",
        primary: "#6366f1",
        secondary: "#ec4899",
        accent: "#8b5cf6",
        dark: "#0f172a",
        light: "#f8fafc",
        surface: "#1e293b",
        success: "#10b981",
        warning: "#f59e0b",
        danger: "#ef4444",
        brandBlue: "#1A73E8",
        "shop-bg": "var(--bg-color)", 
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        soft: "0 4px 20px rgba(0,0,0,0.2)",
        glowBlue: "0 0 20px rgba(26,115,232,0.4)",
      },
      backdropBlur: {
        glass: "12px",
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
};
