// src/context/AuthContext.js

import { createContext, useContext, useEffect, useReducer } from "react";
import { useRouter } from "next/router";
import instance from "../../axios"; // Axios instance for API calls
import { message } from "antd";

const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
  loading: true,
};

function authReducer(state, action) {
  switch (action.type) {
    case "INITIALIZE":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
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

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          dispatch({
            type: "INITIALIZE",
            payload: {
              token: storedToken,
              user: parsedUser,
            },
          });
        } catch (parseError) {
          console.error("Error parsing stored user:", parseError);
          // Clear invalid data
          localStorage.removeItem("token");
          localStorage.removeItem("user");
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
      const { token, access_token, user } = response.data;
      const authToken = token || access_token;

      if (!authToken) {
        message.error("Login failed: no token received.");
        dispatch({ type: "SET_LOADING", payload: false });
        return;
      }

      // If role_mave is missing, fetch it from /roles
      if (!user.role_mave && user.role_id) {
        try {
          const rolesRes = await instance.get("/roles", {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          const matchedRole = rolesRes.data?.find(
            (r) => String(r.id) === String(user.role_id)
          );
          if (matchedRole) user.role_mave = matchedRole;
        } catch (_) {}
      }

      // Store token and user in localStorage
      localStorage.setItem("token", authToken);
      localStorage.setItem("user", JSON.stringify(user));

      // Dispatch login success
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { token: authToken, user },
      });

      message.success("Login successful!");

      // Redirect after state updates
      router.push(callback || "/");
    } catch (error) {
      message.error("Invalid credentials. Please try again.");
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const logout = () => {
    // Remove token and user from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

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
