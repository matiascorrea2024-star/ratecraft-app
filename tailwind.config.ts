import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        canvas: "#F9F9FB",
        paper: "#FFFFFF",
        subtle: "#F1F2F6",
        hairline: "#E2E4EC",
        ink: {
          DEFAULT: "#11131A",
          secondary: "#4C5060",
          muted: "#6A6E7E",
        },
        cobalt: {
          DEFAULT: "#1D4ED8",
          hover: "#1E40AF",
          tint: "#EFF4FF",
        },
      },
    },
  },
  plugins: [],
};

export default config;
