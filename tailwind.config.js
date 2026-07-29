// tailwind.config.js

module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    // Add other directories if needed
  ],
  theme: {
    extend: {
      screens: {
        xxl: "1700px",
      },
      colors: {
        theme: "var(--theme)",
        "theme-dark": "var(--theme-dark)",
        themelite: "var(--themelite)",
        themes: "var(--themes)",
        brand: {
          DEFAULT: "#3498db",
          dark: "#2980b9",
          light: "#ebf5fb",
        },
        white: "#ffffff",
        black: "#343434",
        bggray: "#E8E8E9",
        themelight: "#ebf5fb",
        themedark: "#ffa17c",
        darkgray: "#797B7E",
        themetransparent: "#f3ecf8",
      },
      spacing: {
        80: "20rem",
        260: "65rem",
      },
      borderRadius: {
        xl: "1rem",
      },
      spacing: {
        "5%": "5%",
      },
    },
  },
  plugins: [],
};
