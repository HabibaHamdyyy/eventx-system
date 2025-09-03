/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        sidebar: "#111315",
        textPrimary: "#000000",
        textSecondary: "#666666",
        white: "#FFFFFF",
        muted: "#A3A3A3",

        primary: "#4285F4", // Blue
        success: "#32D74B", // Green
        warning: "#F7931E", // Orange
        purple: "#8E44AD",  // Purple
        yellow: "#F1C40F",  // Yellow
        dashboardBg: "#F9F9F9",
      },
      fontFamily: {
        sans: ["Poppins", "Inter", "sans-serif"],
      },
      borderRadius: {
        xl: "1rem",   // 16px
        "2xl": "1.25rem", // 20px
      },
      boxShadow: {
        card: "0 4px 12px rgba(0,0,0,0.1)",
      },
    },
  },
  plugins: [],
};
