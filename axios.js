// axios.js
import axios from "axios";
import { message } from "antd";

// Rate limiting configuration
const RATE_LIMIT_DELAY = 2000; // 2 seconds base delay
const MAX_RETRIES = 3;

// Track request timestamps for rate limiting
const requestTimestamps = new Map();

export const TENANT_SLUG_KEY = "mave_tenant_slug";
export const TENANT_LOGIN_ENABLED_KEY = "mave_tenant_login_enabled";

export const isLocalHostname = (hostname) =>
  hostname === "localhost" ||
  hostname === "127.0.0.1" ||
  /^\d+\.\d+\.\d+\.\d+$/.test(hostname);

/** Local dev: when false, API uses NEXT_PUBLIC_API_BASE_URL (no /slug/ segment). */
export const isTenantLoginEnabled = () => {
  if (typeof window === "undefined") {
    return true;
  }
  const stored = localStorage.getItem(TENANT_LOGIN_ENABLED_KEY);
  if (stored === "false") return false;
  if (stored === "true") return true;
  return !!(
    localStorage.getItem(TENANT_SLUG_KEY) ||
    process.env.NEXT_PUBLIC_TENANT_SLUG
  );
};

export const setTenantLoginEnabled = (enabled) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(TENANT_LOGIN_ENABLED_KEY, enabled ? "true" : "false");
};

export const getLocalTenantSlug = () => {
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_TENANT_SLUG || "";
  }
  if (!isTenantLoginEnabled()) {
    return "";
  }
  return (
    localStorage.getItem(TENANT_SLUG_KEY) ||
    process.env.NEXT_PUBLIC_TENANT_SLUG ||
    ""
  );
};

export const setLocalTenantSlug = (slug) => {
  if (typeof window === "undefined") return;
  const value = (slug || "").trim();
  if (value) {
    localStorage.setItem(TENANT_SLUG_KEY, value);
  } else {
    localStorage.removeItem(TENANT_SLUG_KEY);
  }
};

const getTenantApiBaseUrl = () => {
  const apiHost = process.env.NEXT_PUBLIC_API_HOST;
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (typeof window === "undefined") {
    const slug = process.env.NEXT_PUBLIC_TENANT_SLUG;
    if (slug && apiHost) return `${apiHost}/${slug}/api`;
    return baseUrl;
  }

  const hostname = window.location.hostname;

  if (!isLocalHostname(hostname)) {
    const slug = hostname.split(".")[0];
    return `${apiHost}/${slug}/api`;
  }

  const slug = getLocalTenantSlug();
  if (slug && apiHost) {
    return `${apiHost}/${slug}/api`;
  }

  return baseUrl;
};

export { getTenantApiBaseUrl };

const instance = axios.create({
  baseURL: getTenantApiBaseUrl(),
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

instance.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem("token");

    // If token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Handle custom base URL if needed
    if (config.flyURL) {
      config.baseURL = config.flyURL;
      delete config.flyURL;
    } else {
      config.baseURL = getTenantApiBaseUrl();
    }

    // Rate limiting for API calls
    const url = config.url;
    const now = Date.now();

    // Check if we've made a request to this URL recently
    if (requestTimestamps.has(url)) {
      const lastRequest = requestTimestamps.get(url);
      const timeSinceLastRequest = now - lastRequest;

      // If less than 1 second has passed, add a delay
      if (timeSinceLastRequest < 1000) {
        return new Promise((resolve) => {
          setTimeout(() => {
            requestTimestamps.set(url, Date.now());
            resolve(config);
          }, 1000 - timeSinceLastRequest);
        });
      }
    }

    requestTimestamps.set(url, now);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle unauthorized responses and rate limiting
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;

    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login")
      ) {
        message.error("Session expired. Please log in again.");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }
    }

    // Handle rate limiting (429) with exponential backoff
    if (response && response.status === 429) {
      config.__retryCount = config.__retryCount || 0;

      if (config.__retryCount < MAX_RETRIES) {
        config.__retryCount += 1;

        // Exponential backoff with jitter
        const delay = Math.pow(2, config.__retryCount) * RATE_LIMIT_DELAY + Math.random() * 1000;

        console.log(`Rate limited, retrying in ${delay}ms (attempt ${config.__retryCount}/${MAX_RETRIES})`);

        await new Promise((resolve) => setTimeout(resolve, delay));
        return instance(config);
      }
    }

    return Promise.reject(error);
  }
);

// Add logout function
instance.logout = (redirectUrl = "/login") => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  if (typeof window !== "undefined") {
    window.location.href = redirectUrl;
  }
};

export default instance;
