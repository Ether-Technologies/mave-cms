// utils/refreshAllData.js

import instance from "../axios";
import { cachedApiCall, clearAllApiCache } from "./apiUtils";

const API_ENDPOINTS = [
  { key: "pages", url: "/pages" },
  { key: "media", url: "/media" },
  { key: "menus", url: "/menus" },
  { key: "menuitems", url: "/menuitems" },
  { key: "navbars", url: "/navbars" },
  { key: "sliders", url: "/sliders" },
  { key: "cards", url: "/cards" },
  { key: "forms", url: "/forms" },
  { key: "form_builder", url: "/form_builder" },
  { key: "footers", url: "/footers" },
  { key: "settings", url: "/settings" },
  { key: "settings-general", url: "/settings/general" },
  { key: "roles", url: "/roles" },
  { key: "permissions", url: "/permissions" },
  { key: "generated-models", url: "/generated-models" },
];

export const refreshAllData = async () => {
  clearAllApiCache();

  const force = { force: true };
  const results = await Promise.allSettled(
    API_ENDPOINTS.map(({ key, url }) =>
      cachedApiCall(key, () => instance.get(url), undefined, force)
    )
  );

  const failed = results.filter((result) => result.status === "rejected");
  if (failed.length > 0) {
    console.warn(
      `Global refresh: ${failed.length}/${API_ENDPOINTS.length} endpoints failed`
    );
  }

  return {
    total: API_ENDPOINTS.length,
    succeeded: results.filter((result) => result.status === "fulfilled").length,
    failed: failed.length,
  };
};

export default refreshAllData;
