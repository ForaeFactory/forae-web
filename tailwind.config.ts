import type { Config } from "tailwindcss";

const token = (name: string) => `rgb(var(--color-${name}) / <alpha-value>)`;

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Values live as CSS variables in src/app/globals.css.
      colors: {
        surface: token("surface"),
        "surface-raised": token("surface-raised"),
        ink: token("ink"),
        muted: token("muted"),
        line: token("line"),
        accent: token("accent"),
        // Legacy aliases kept so existing classes resolve to the same tokens.
        background: token("surface"),
        foreground: token("ink"),
        "portfolio-bg": token("surface"),
        "portfolio-text": token("ink"),
      },
      // Type scale, largest to smallest:
      //   display (fluid-h1) > h1 (fluid-h2) > h2 (fluid-h3) > h3 (fluid-h4)
      //   > body-lg (fluid-body) > body (text-base) > eyebrow (.eyebrow, text-xs)
      fontSize: {
        "fluid-h1": "clamp(3rem, 6vw + 1rem, 8rem)",
        "fluid-h2": "clamp(2rem, 4vw + 1rem, 6rem)",
        "fluid-h3": "clamp(1.5rem, 3vw + 1rem, 4rem)",
        "fluid-h4": "clamp(1.25rem, 2.5vw + 1rem, 3.5rem)",
        "fluid-body": "clamp(1rem, 1.5vw + 0.5rem, 1.25rem)",
      },
      transitionTimingFunction: {
        house: "var(--ease-house)",
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
