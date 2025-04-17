/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      fontSize: {
        base: "12px",
      },
      colors: {
        primary: "#1A2E05",
        "primary-foreground": "#E3E3E3",
        surface: "#FFFFFF",
        foreground: "#252525",
        "foreground-secondary": "#78716C",
        accent: "#E5E7EB",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
