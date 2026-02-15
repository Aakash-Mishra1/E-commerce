/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-color)",
        navy: "var(--navy-color)",
        primary: "#6366f1", // Indigo 500 - Main Brand Color
        secondary: "#ec4899", // Pink 500 - Action/Accent
        accent: "#8b5cf6", // Violet 500
        dark: "#0f172a", // Slate 900
        light: "#f8fafc", // Slate 50
        surface: "#1e293b", // Slate 800 - Card Backgrounds
        success: "#10b981", // Emerald 500
        warning: "#f59e0b", // Amber 500
        danger: "#ef4444", // Red 500
        brandBlue: "#1A73E8", // Added missing brandBlue color
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
      }
    },
  },
  plugins: [],
};
