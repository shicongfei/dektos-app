import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F3ECE0",
        "paper-deep": "#E9E0D0",
        ink: "#1F2430",
        "ink-soft": "#5B6070",
        line: "#C8B896",
        seal: "#B73D29",
        // 主题色：随所在的书切换（见 app/globals.css）
        accent: "rgb(var(--accent) / <alpha-value>)",
        note: "rgb(var(--note) / <alpha-value>)",
        "block-emph": "rgb(var(--block-emph) / <alpha-value>)",
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', "Songti SC", "SimSun", "serif"],
        sans: ['"Noto Sans SC"', "PingFang SC", "Microsoft YaHei", "sans-serif"],
      },
      maxWidth: { app: "30rem" },
    },
  },
  plugins: [],
};

export default config;
