// axios.js
import axios from "axios";

// Rate limiting configuration
const RATE_LIMIT_DELAY = 2000; // 2 seconds base delay
const MAX_RETRIES = 3;

// Track request timestamps for rate limiting
const requestTimestamps = new Map();

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000/api",
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
    const organization = localStorage.getItem("organization");

    // If token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (organization) {
      try {
        const parsedOrganization = JSON.parse(organization);
        if (parsedOrganization?.id) {
          config.headers["X-Organization-Id"] = parsedOrganization.id;
        }
      } catch (error) {
        console.error("Error parsing stored organization:", error);
      }
    }

    // Handle custom base URL if needed
    if (config.flyURL) {
      config.baseURL = config.flyURL;
      delete config.flyURL;
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
      // Clear localStorage on unauthorized
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("organization");

      // Only redirect if we're not already on the login page
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login")
      ) {
        window.location.href = "/login";
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
  localStorage.removeItem("organization");
  if (typeof window !== "undefined") {
    window.location.href = redirectUrl;
  }
};

export default instance;
