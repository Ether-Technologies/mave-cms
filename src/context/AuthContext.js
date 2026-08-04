// src/context/AuthContext.js

import { createContext, useContext, useEffect, useReducer } from "react";
import { useRouter } from "next/router";
import instance from "../../axios"; // Axios instance for API calls
import { message } from "antd";

const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
  organization: null,
  loading: true,
};

function authReducer(state, action) {
  switch (action.type) {
    case "INITIALIZE":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        organization: action.payload.organization,
        loading: false,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        organization: action.payload.organization,
        loading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        organization: null,
        loading: false,
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
}
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();

  useEffect(() => {
    // Add a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (state.loading) {
        console.warn("Auth loading timeout - forcing loading to false");
        dispatch({ type: "SET_LOADING", payload: false });
      }
    }, 3000); // Reduced to 3 second timeout

    // Initialize authentication state from localStorage
    try {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      const storedOrganization = localStorage.getItem("organization");

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          const parsedOrganization = storedOrganization
            ? JSON.parse(storedOrganization)
            : parsedUser.organization || null;
          dispatch({
            type: "INITIALIZE",
            payload: {
              token: storedToken,
              user: parsedUser,
              organization: parsedOrganization,
            },
          });
        } catch (parseError) {
          console.error("Error parsing stored user:", parseError);
          // Clear invalid data
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem("organization");
          dispatch({ type: "SET_LOADING", payload: false });
        }
      } else {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      dispatch({ type: "SET_LOADING", payload: false });
    }

    return () => clearTimeout(timeoutId);
  }, []);

  // Force loading to false after a short delay to prevent stuck loading
  useEffect(() => {
    const forceLoadingFalse = setTimeout(() => {
      if (state.loading) {
        console.warn("Force setting auth loading to false");
        dispatch({ type: "SET_LOADING", payload: false });
      }
    }, 1000); // 1 second delay

    return () => clearTimeout(forceLoadingFalse);
  }, []);

  const login = async (email, password, callback) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await instance.post("admin/login", { email, password });
      const { token, user, organization } = response.data;

      // Store token and user in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      if (organization) {
        localStorage.setItem("organization", JSON.stringify(organization));
      }

      // Dispatch login success
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { token, user, organization },
      });

      message.success("Login successful!");

      // Redirect after state updates
      router.push(callback || "/");
    } catch (error) {
      const isNetworkError = !error?.response;
      const apiMessage = isNetworkError
        ? "Network error: cannot reach the API. Make sure the backend is running at http://127.0.0.1:8000"
        : error?.response?.data?.message ||
          error?.message ||
          "Login failed. Please try again.";
      message.error(apiMessage);
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const logout = () => {
    // Remove token and user from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("organization");

    // Dispatch logout
    dispatch({ type: "LOGOUT" });

    message.success("Logged out successfully!");
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        token: state.token,
        organization: state.organization,
        loading: state.loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
