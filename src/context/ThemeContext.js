// context/ThemeContext.js

import React, { createContext, useState, useEffect } from "react";
import instance from "../../axios";
import { setThemeColors } from "../../utils/themeUtils";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState({
    themecolor: "#3498db", // Default theme color
    themeaccent: "#2980b9", // Default theme accent
  });

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const response = await instance.get("/settings/general"); // Adjust the endpoint as needed

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
    };

    fetchTheme();
  }, []);

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
