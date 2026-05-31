export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        bg:      "#f9f9f9",
        surface: "#ffffff",
        panel:   "#f4f4f4",
        line:    "#e8e8e8",
        subtle:  "#d4d4d4",
        muted:   "#b0b0b0",
        dim:     "#888888",
        soft:    "#555555",
        text:    "#1a1a1a",
      },
    },
  },
  plugins: [],
};
