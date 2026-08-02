// context/ThemeContext.js

import React, { createContext, useState, useEffect, useCallback } from "react";
import instance from "../../axios";
import { setThemeColors } from "../../utils/themeUtils";
import { useGlobalRefresh } from "./MenuRefreshContext";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
    themecolor: "#3498db", // Default theme color
    themeaccent: "#2980b9", // Default theme accent
  });

  const fetchTheme = useCallback(async () => {
    try {
      const response = await instance.get("/settings/general");

      if (response.data && response.data.config) {
        const { themecolor, themeaccent } = response.data.config;
        if (themecolor && themeaccent) {
          setTheme({ themecolor, themeaccent });
          setThemeColors(themecolor, themeaccent);
        }
      }
    } catch (error) {
      console.error("Failed to fetch theme settings:", error);
    }
  }, []);

  useEffect(() => {
    fetchTheme();
  }, [fetchTheme]);

  useGlobalRefresh(fetchTheme);

  const updateTheme = (themecolor, themeaccent) => {
    setTheme({ themecolor, themeaccent });
    setThemeColors(themecolor, themeaccent);
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
