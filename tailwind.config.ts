import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#fdf2f4",
          100: "#fce7eb",
          200: "#f9d0d9",
          300: "#f5a8b9",
          400: "#f07594",
          500: "#e54d75",
          600: "#d22d5b",
          700: "#b02049",
          800: "#931d40",
          900: "#7d1b3b",
        },
        secondary: {
          50: "#fdf8f1",
          100: "#f9ecdc",
          200: "#f4d5b8",
          300: "#e7c4a0",
          400: "#dba77c",
          500: "#d08b5b",
          600: "#bc6d3d",
          700: "#9d5834",
          800: "#824931",
          900: "#6c3e2c",
        },
        sand: {
          50: "#fbf9f2",
          100: "#f6f1e1",
          200: "#ede1c3",
          300: "#e1ca96",
          400: "#d4b06d",
          500: "#c79650",
          600: "#b47b41",
          700: "#956137",
          800: "#7a4f32",
          900: "#65422c",
        }
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require('@tailwindcss/forms'),
  ],
};

export default config; 