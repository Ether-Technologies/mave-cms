// utils/apiUtils.js

import axios from "axios";

export const axiosWithRetry = axios.create();

// Rate limiting configuration
const RATE_LIMIT_DELAY = 2000; // 2 seconds base delay
const MAX_RETRIES = 3;

// Track request timestamps for rate limiting
const requestTimestamps = new Map();

axiosWithRetry.interceptors.request.use(
  (config) => {
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

axiosWithRetry.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    if (!config || !response) {
      return Promise.reject(error);
    }

    // Retry only on certain status codes (e.g., 429, 500, 502, 503, 504)
    if ([429, 500, 502, 503, 504].includes(response.status)) {
      config.__retryCount = config.__retryCount || 0;

      if (config.__retryCount >= MAX_RETRIES) {
        return Promise.reject(error);
      }

      config.__retryCount += 1;

      // Exponential backoff with jitter
      const delay = Math.pow(2, config.__retryCount) * RATE_LIMIT_DELAY + Math.random() * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));

      return axiosWithRetry(config);
    }

    return Promise.reject(error);
  }
);

// Debounced API call utility
const debounceTimers = new Map();

export const debouncedApiCall = (key, apiCall, delay = 2000) => {
  return new Promise((resolve, reject) => {
    // Clear existing timer for this key
    if (debounceTimers.has(key)) {
      clearTimeout(debounceTimers.get(key));
    }

    // Set new timer
    const timer = setTimeout(async () => {
      try {
        const result = await apiCall();
        resolve(result);
      } catch (error) {
        reject(error);
      } finally {
        debounceTimers.delete(key);
      }
    }, delay);

    debounceTimers.set(key, timer);
  });
};

// Cache for API responses to reduce redundant calls
const apiCache = new Map();
const CACHE_DURATION = 30000; // 30 seconds

export const clearAllApiCache = () => {
  apiCache.clear();
};

export const cachedApiCall = async (
  key,
  apiCall,
  duration = CACHE_DURATION,
  { force = false } = {}
) => {
  if (force) {
    apiCache.delete(key);
  }

  const now = Date.now();
  const cached = apiCache.get(key);

  if (cached && now - cached.timestamp < duration) {
    return cached.data;
  }

  try {
    const data = await apiCall();
    apiCache.set(key, {
      data,
      timestamp: now,
    });
    return data;
  } catch (error) {
    // If there's cached data, return it even if expired
    if (cached) {
      console.warn(`API call failed for ${key}, using cached data`);
      return cached.data;
    }
    throw error;
  }
};

export default axiosWithRetry;
