import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Enterprise industrial palette
        canvas: {
          DEFAULT: "#0b0f17",
          raised: "#0f1521",
          sunken: "#070a11",
        },
        surface: {
          DEFAULT: "#111827",
          hover: "#172033",
          active: "#1c2740",
          border: "#1f2a3d",
        },
        ink: {
          high: "#e5e9f2",
          mid: "#9aa3b7",
          low: "#5c6478",
          dim: "#3b4257",
        },
        accent: {
          DEFAULT: "#3b82f6",
          soft: "#1e3a8a",
          ring: "#60a5fa",
        },
        signal: {
          ok: "#22c55e",
          warn: "#f59e0b",
          crit: "#ef4444",
          info: "#06b6d4",
          neutral: "#64748b",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Inter", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
      },
      boxShadow: {
        "panel": "0 1px 0 0 rgba(255,255,255,0.02) inset, 0 0 0 1px rgba(255,255,255,0.04)",
        "ring-accent": "0 0 0 1px rgba(96,165,250,0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
