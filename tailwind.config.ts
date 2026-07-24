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
        sans: ["var(--font-sans)"],
      },
      colors: {
        ink: {
          DEFAULT: "var(--color-text)",
          muted: "var(--color-text-muted)",
        },
        hairline: "var(--color-border)",
        home: "var(--color-bg-home)",
        warm: "var(--color-bg-warm)",
        paper: "var(--color-bg-light)",
        night: "var(--color-bg-dark)",
      },
    },
  },
  plugins: [],
};
export default config;
