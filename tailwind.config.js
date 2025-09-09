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
        white: "#ffffff",
        black: "#343434",
        bggray: "#E8E8E9",
        themelight: "#fef08a",
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
