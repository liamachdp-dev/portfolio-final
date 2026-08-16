import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        term: {
          bg: "#0b0d0b",
          green: "#4ade80",
          greenDim: "#2f6b45",
          cyan: "#38bdf8",
          amber: "#fbbf24",
          text: "#d7ffe0",
        },
        paper: "#faf9f6",
        ink: "#181b17",
        inkSoft: "#5b615a",
        line: "#e3e1da",
        accent: "#2f5d50",
        accentSoft: "#e7efe9",
      },
      fontFamily: {
        mono: ["'JetBrains Mono'", "monospace"],
        display: ["'Space Grotesk'", "sans-serif"],
        sans: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
