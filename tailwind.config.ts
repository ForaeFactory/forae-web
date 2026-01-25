import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        foreground: "#FAFAFA",
        "portfolio-bg": "#050505",
        "portfolio-text": "#FAFAFA",
        accent: "#C6A848",
      },
      fontSize: {
        "fluid-h1": "clamp(3rem, 6vw + 1rem, 8rem)",
        "fluid-h2": "clamp(2rem, 4vw + 1rem, 6rem)",
        "fluid-h3": "clamp(1.5rem, 3vw + 1rem, 4rem)",
        "fluid-h4": "clamp(1.25rem, 2.5vw + 1rem, 3.5rem)",
        "fluid-body": "clamp(1rem, 1.5vw + 0.5rem, 1.25rem)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        sans: ["var(--font-google-sans)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
