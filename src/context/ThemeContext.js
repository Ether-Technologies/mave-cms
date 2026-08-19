// context/ThemeContext.js

import React, { createContext, useState, useCallback, useEffect } from "react";
import { setThemeColors } from "../../utils/themeUtils";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
    themecolor: "#3498db",
    themeaccent: "#2980b9",
  });

  useEffect(() => {
    setThemeColors(theme.themecolor, theme.themeaccent);
  }, [theme.themecolor, theme.themeaccent]);

  const updateTheme = useCallback((themecolor, themeaccent) => {
    setTheme({ themecolor, themeaccent });
    setThemeColors(themecolor, themeaccent);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
