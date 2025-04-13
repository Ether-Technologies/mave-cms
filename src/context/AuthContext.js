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
    // Initialize authentication state from localStorage
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      dispatch({
        type: "INITIALIZE",
        payload: {
          token: storedToken,
          user: JSON.parse(storedUser),
        },
      });
    } else {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const login = async (email, password, callback) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const response = await instance.post("admin/login", { email, password });
      const { token, user } = response.data;

      // Store token and user in localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Dispatch login success
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { token, user },
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
