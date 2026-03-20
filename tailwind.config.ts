import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: "#f4f1ea",
        ink: "#111827",
        accent: "#c96d3a",
        surface: "#fffdf8",
        line: "#ddd3c4",
      },
      boxShadow: {
        panel: "0 12px 30px rgba(17, 24, 39, 0.08)",
      },
      fontFamily: {
        sans: ["Pretendard", "Noto Sans KR", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
