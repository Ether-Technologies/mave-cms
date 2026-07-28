import React, { useEffect, useMemo, useState } from "react";
import { ConfigProvider } from "antd";
import {
  buildAntdTheme,
  readTokensFromDocument,
  DEFAULT_TOKENS,
} from "../config/maveDesignTokens";

/**
 * Syncs Ant Design with CSS variables from styles/mave-tokens.css (+ brand overrides).
 */
export default function MaveConfigProvider({ children, themeRevision = 0 }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const antdTheme = useMemo(() => {
    if (!mounted) {
      return buildAntdTheme(DEFAULT_TOKENS);
    }
    return buildAntdTheme(readTokensFromDocument());
  }, [mounted, themeRevision]);

  return <ConfigProvider theme={antdTheme}>{children}</ConfigProvider>;
}
