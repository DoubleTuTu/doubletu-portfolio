import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        bangers: ['var(--font-bangers)', 'Bangers', 'cursive'],
        zcool: ['var(--font-zcool)', 'ZCOOL KuaiLe', 'cursive'],
        noto: ['var(--font-noto-sans)', 'Noto Sans SC', 'sans-serif'],
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
export default config;
