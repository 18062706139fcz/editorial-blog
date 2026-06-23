import type { Config } from "tailwindcss";

const cjkSerif = [
  "Songti SC",
  "STSong",
  "Noto Serif CJK SC",
  "Source Han Serif SC",
  "Source Han Serif CN",
  "SimSun",
  "serif",
];

const cjkSans = [
  "PingFang SC",
  "Hiragino Sans GB",
  "Microsoft YaHei",
  "Noto Sans CJK SC",
  "Source Han Sans SC",
  "Source Han Sans CN",
  "WenQuanYi Micro Hei",
  "sans-serif",
];

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#FAF8F2",
        "paper-dim": "#F1ECE1",
        ink: "#1C1916",
        "ink-soft": "#6F665A",
        hairline: "#E4DDCE",
        accent: "#C8501E",
        "accent-soft": "#E8A07A",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", ...cjkSerif],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", ...cjkSans],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", ...cjkSans],
      },
      letterSpacing: {
        label: "0.22em",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "tier-in": {
          "0%": { opacity: "0", transform: "translateY(-18px) scaleX(0.9)" },
          "60%": { opacity: "1" },
          "100%": { opacity: "1", transform: "translateY(0) scaleX(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "ball-bounce": {
          "0%": { transform: "translateY(0) scaleX(1.15) scaleY(0.85)" },
          "12%": { transform: "translateY(-2px) scale(1)" },
          "50%": { transform: "translateY(-26px) scaleY(1.06)" },
          "88%": { transform: "translateY(-2px) scale(1)" },
          "100%": { transform: "translateY(0) scaleX(1.15) scaleY(0.85)" },
        },
        "ball-shadow": {
          "0%, 100%": { transform: "scaleX(1.1)", opacity: "0.35" },
          "50%": { transform: "scaleX(0.55)", opacity: "0.12" },
        },
        enter: {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "overlay-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        float: "float 5s ease-in-out infinite",
        marquee: "marquee 42s linear infinite",
        "ball-bounce": "ball-bounce 0.6s cubic-bezier(0.45, 0, 0.55, 1) infinite",
        "ball-shadow": "ball-shadow 0.6s cubic-bezier(0.45, 0, 0.55, 1) infinite",
        enter: "enter 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
        "overlay-in": "overlay-in 0.25s ease-out both",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
