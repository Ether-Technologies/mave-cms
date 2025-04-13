// axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
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
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle unauthorized responses
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear localStorage on unauthorized
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Only redirect if we're not already on the login page
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.includes("/login")
      ) {
        window.location.href = "/login";
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
