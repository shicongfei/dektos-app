import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F7F3EC",
        "paper-deep": "#EFE8DC",
        ink: "#1C1A17",
        "ink-soft": "#5C564D",
        seal: "#A8322A",
        line: "#DDD4C4",
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
