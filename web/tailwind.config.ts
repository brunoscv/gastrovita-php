import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Valores extraídos do CSS real gerado pelo Divi no site original (migration/css/*.css),
        // não estimados — ver migration/css e migration/html para a fonte de cada um.
        brand: {
          dark: "#115278",
          DEFAULT: "#52A6C7",
          light: "#52A6C7",
          pale: "#EAF4F8",
          footer: "#52A6C7",
          "footer-bottom": "#0c4870",
        },
        gold: {
          DEFAULT: "#D1B770",
          dark: "#d1ab42",
        },
        // Paleta real do Argon Dashboard 2 MUI (Creative Tim), extraída de
        // src/assets/theme/base/colors.js do template — usada só no /admin.
        argon: {
          primary: "#5e72e4",
          "primary-state": "#825ee4",
          secondary: "#8392ab",
          info: "#11cdef",
          success: "#2dce89",
          warning: "#fb6340",
          error: "#f5365c",
          dark: "#344767",
          light: "#e9ecef",
          bg: "#f8f9fa",
          text: "#67748e",
          grey: {
            100: "#f8f9fa",
            200: "#e9ecef",
            300: "#dee2e6",
            400: "#ced4da",
            500: "#adb5bd",
            600: "#6c757d",
            700: "#495057",
            800: "#343a40",
            900: "#212529",
          },
        },
      },
      fontFamily: {
        heading: ["var(--font-mulish)", "sans-serif"],
        body: ["var(--font-maven)", "sans-serif"],
        accent: ["var(--font-poppins)", "sans-serif"],
        argon: ["var(--font-open-sans)", "sans-serif"],
      },
      borderRadius: {
        pill: "300px",
        "argon-xs": "2px",
        "argon-sm": "4px",
        "argon-md": "8px",
        "argon-lg": "12px",
        "argon-xl": "16px",
        "argon-xxl": "24px",
      },
      boxShadow: {
        header: "0px 5px 5px -6px rgba(0,0,0,0.3)",
        button: "0px 12px 18px -6px rgba(10,0,2,0.18)",
        // Sombras reais do Argon (src/assets/theme/base/boxShadows.js)
        "argon-sm": "0 5px 10px 0 rgba(0,0,0,0.12)",
        "argon-md": "0 4px 6px -1px rgba(20,20,20,0.12), 0 2px 4px -1px rgba(20,20,20,0.07)",
        "argon-lg": "0 8px 26px -4px rgba(20,20,20,0.15), 0 8px 9px -5px rgba(20,20,20,0.06)",
        "argon-xxl": "0 20px 27px 0 rgba(0,0,0,0.05)",
      },
    },
  },
  plugins: [],
};
export default config;
