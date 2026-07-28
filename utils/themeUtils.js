// utils/themeUtils.js — backward-compatible API for theme / CMS settings

import {
  applyBrandColors,
  clearBrandColors,
  readTokensFromDocument,
  buildAntdTheme,
  getCssVar,
} from "../config/maveDesignTokens";

export {
  applyBrandColors,
  clearBrandColors,
  readTokensFromDocument,
  buildAntdTheme,
  getCssVar,
};

/** @deprecated Use applyBrandColors — kept for existing imports */
export const setThemeColors = (primary, accent) => {
  if (primary) {
    applyBrandColors(primary, accent);
  } else {
    clearBrandColors();
  }
};

export function applyThemeFromSettings(themecolor, themeaccent) {
  if (themecolor) {
    applyBrandColors(themecolor, themeaccent || themecolor);
  } else {
    clearBrandColors();
  }
}
