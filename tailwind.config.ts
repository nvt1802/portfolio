import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        malibu: "#5BADFF",
        denim: "#1373D1",
        "regent-gray": "#8491A0",
        white: "#FFFFFF",
        "mine-shaft": "#2A2A2A",
        "cod-gray": "#161513",
        salmon: "#FF8660",
        "orange-roughy": "#D5491D",
        "electric-violet": "#9A33FF",
        secondary: "#C5C5C5",
      },
    },
  },
} satisfies Config;
