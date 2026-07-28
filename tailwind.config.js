// tailwind.config.js

module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
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
        accent: "var(--accent)",
        "accent-hover": "var(--accent-hover)",
        "accent-subtle": "var(--accent-subtle)",
        mave: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          inverse: "var(--text-inverse)",
          accent: "var(--accent)",
          "accent-hover": "var(--accent-hover)",
          border: "var(--border-default)",
          "border-strong": "var(--border-strong)",
        },
        surface: {
          base: "var(--surface-base)",
          raised: "var(--surface-raised)",
          sunken: "var(--surface-sunken)",
        },
        border: {
          DEFAULT: "var(--border-default)",
          strong: "var(--border-strong)",
          muted: "var(--border-muted)",
        },
        white: "var(--white)",
        black: "var(--black)",
        bggray: "var(--gray)",
        themelight: "var(--accent-muted)",
        themedark: "var(--accent-hover)",
        darkgray: "var(--gray-dark)",
        themetransparent: "var(--themes-transparent)",
      },
      borderRadius: {
        DEFAULT: "var(--border-radius)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-lg)",
      },
      boxShadow: {
        shell: "var(--shadow-sm)",
        card: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
      },
      spacing: {
        80: "20rem",
        260: "65rem",
        "5%": "5%",
      },
    },
  },
  plugins: [],
};
