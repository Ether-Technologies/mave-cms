/**
 * JS helpers for MAVE design tokens.
 * Color defaults live in styles/mave-tokens.css — edit that file for global changes.
 */

/** CSS custom property names driven by brand overrides from CMS settings */
export const BRAND_CSS_VARS = [
  "--accent",
  "--accent-hover",
  "--accent-active",
  "--theme",
  "--theme-dark",
  "--themes",
  "--maveyellow",
];

export function getCssVar(name, fallback = "") {
  if (typeof document === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || fallback;
}

/** Fallback when document is not available (SSR) — mirrors styles/mave-tokens.css */
export const DEFAULT_TOKENS = {
  accent: "#18181b",
  accentHover: "#27272a",
  accentActive: "#09090b",
  surfaceBase: "#fafafa",
  surfaceRaised: "#ffffff",
  borderDefault: "#e4e4e7",
  borderMuted: "#f4f4f5",
  textPrimary: "#18181b",
  textSecondary: "#52525b",
  textMuted: "#71717a",
  accentSubtle: "#f4f4f5",
  borderStrong: "#d4d4d8",
  radius: "8",
  radiusLg: "12",
};

/** Read current tokens from the document (after mave-tokens.css + any overrides). */
export function readTokensFromDocument() {
  if (typeof document === "undefined") {
    return { ...DEFAULT_TOKENS };
  }
  return {
    accent: getCssVar("--accent", "#18181b"),
    accentHover: getCssVar("--accent-hover", "#27272a"),
    accentActive: getCssVar("--accent-active", "#09090b"),
    surfaceBase: getCssVar("--surface-base", "#fafafa"),
    surfaceRaised: getCssVar("--surface-raised", "#ffffff"),
    borderDefault: getCssVar("--border-default", "#e4e4e7"),
    borderMuted: getCssVar("--border-muted", "#f4f4f5"),
    textPrimary: getCssVar("--text-primary", "#18181b"),
    textSecondary: getCssVar("--text-secondary", "#52525b"),
    textMuted: getCssVar("--text-muted", "#71717a"),
    accentSubtle: getCssVar("--accent-subtle", "#f4f4f5"),
    borderStrong: getCssVar("--border-strong", "#d4d4d8"),
    radius: getCssVar("--border-radius", "8px"),
    radiusLg: getCssVar("--radius-lg", "12px"),
  };
}

/**
 * Override primary brand colors at runtime (CMS theme preset / API).
 * Surfaces and text stay on mave-tokens.css unless you extend this function.
 */
export function applyBrandColors(primaryColor, accentColor) {
  if (typeof document === "undefined" || !primaryColor) return;

  const root = document.documentElement;
  const hover = accentColor || primaryColor;

  root.style.setProperty("--accent", primaryColor);
  root.style.setProperty("--accent-hover", hover);
  root.style.setProperty("--accent-active", primaryColor);
  root.style.setProperty("--theme", primaryColor);
  root.style.setProperty("--theme-dark", hover);
  root.style.setProperty("--themes", primaryColor);
  root.style.setProperty("--maveyellow", primaryColor);
  root.style.setProperty("--black", primaryColor);
}

/** Reset brand overrides so mave-tokens.css defaults apply again. */
export function clearBrandColors() {
  if (typeof document === "undefined") return;
  BRAND_CSS_VARS.forEach((name) => {
    document.documentElement.style.removeProperty(name);
  });
  document.documentElement.style.removeProperty("--black");
}

/** Ant Design v5 theme object from current CSS variables */
export function buildAntdTheme(tokens = readTokensFromDocument()) {
  return {
    token: {
      colorPrimary: tokens.accent,
      colorPrimaryHover: tokens.accentHover,
      colorPrimaryActive: tokens.accentActive,
      colorBgLayout: tokens.surfaceBase,
      colorBgContainer: tokens.surfaceRaised,
      colorBgElevated: tokens.surfaceRaised,
      colorBorder: tokens.borderDefault,
      colorBorderSecondary: tokens.borderMuted,
      colorText: tokens.textPrimary,
      colorTextSecondary: tokens.textSecondary,
      colorTextTertiary: tokens.textMuted,
      colorLink: tokens.accent,
      colorLinkHover: tokens.accentHover,
      colorSuccess: tokens.textSecondary,
      colorWarning: tokens.textMuted,
      colorError: tokens.accent,
      colorInfo: tokens.textSecondary,
      borderRadius: parseInt(tokens.radius, 10) || 8,
      borderRadiusLG: parseInt(tokens.radiusLg, 10) || 12,
      fontFamily:
        "'Ubuntu', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      controlHeight: 40,
    },
    components: {
      Button: {
        primaryShadow: "none",
        defaultShadow: "none",
        fontWeight: 500,
      },
      Menu: {
        itemSelectedBg: tokens.accentSubtle,
        itemSelectedColor: tokens.textPrimary,
        itemHoverBg: tokens.surfaceBase,
        itemColor: tokens.textSecondary,
        subMenuItemBg: tokens.surfaceRaised,
      },
      Input: {
        activeBorderColor: tokens.accent,
        hoverBorderColor: tokens.borderStrong,
      },
      Table: {
        headerBg: tokens.surfaceBase,
        headerColor: tokens.textSecondary,
        rowHoverBg: tokens.surfaceBase,
      },
      Tag: {
        defaultBg: tokens.surfaceRaised,
        defaultColor: tokens.textSecondary,
      },
    },
  };
}
