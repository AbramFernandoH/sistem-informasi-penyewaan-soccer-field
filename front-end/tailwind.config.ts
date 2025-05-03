import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F5F5F5',
        },
        secondary: {
          DEFAULT: '#3c333d',
        },
        footer: '#212121'
      },
    },
  },
  plugins: [],
} satisfies Config;
