// context/ThemeContext.js

import React, { createContext, useCallback, useState, useEffect } from "react";
import instance from "../../axios";
import { applyThemeFromSettings } from "../../utils/themeUtils";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
    themecolor: null,
    themeaccent: null,
  });
  const [themeRevision, setThemeRevision] = useState(0);

  const applyAndBump = useCallback((themecolor, themeaccent) => {
    applyThemeFromSettings(themecolor, themeaccent);
    setThemeRevision((n) => n + 1);
  }, []);

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const response = await instance.get("/settings/general");
        if (response.data?.config) {
          const { themecolor, themeaccent } = response.data.config;
          if (themecolor) {
            setTheme({ themecolor, themeaccent: themeaccent || themecolor });
            applyAndBump(themecolor, themeaccent);
            return;
          }
        }
      } catch (error) {
        console.error("Failed to fetch theme settings:", error);
      }
      applyAndBump(null, null);
    };

    fetchTheme();
  }, [applyAndBump]);

  const updateTheme = (themecolor, themeaccent) => {
    setTheme({ themecolor, themeaccent });
    applyAndBump(themecolor, themeaccent);
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, themeRevision }}>
      {children}
    </ThemeContext.Provider>
  );
};
