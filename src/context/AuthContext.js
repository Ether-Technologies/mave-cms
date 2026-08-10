// src/context/AuthContext.js

import { createContext, useContext, useEffect, useReducer, useCallback } from "react";
import { useRouter } from "next/router";
import instance from "../../axios"; // Axios instance for API calls
import { message } from "antd";
import { clearAllApiCache } from "../../utils/apiUtils";

export const ORGANIZATION_CHANGED_EVENT = "mave:organization-changed";

const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
  organization: null,
  organizations: [],
  organizationsLoading: false,
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
    case "SET_ORGANIZATION":
      return {
        ...state,
        organization: action.payload,
      };
    case "SET_ORGANIZATIONS":
      return {
        ...state,
        organizations: action.payload,
        organizationsLoading: false,
      };
    case "SET_ORGANIZATIONS_LOADING":
      return {
        ...state,
        organizationsLoading: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        organization: null,
        organizations: [],
        organizationsLoading: false,
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

function resolveSuperAdminOrganization(organizations, currentOrganization) {
  if (!organizations.length) {
    return currentOrganization;
  }

  const tenantOrganizations = organizations.filter(
    (org) => org.slug !== "mave-platform"
  );
  const validCurrent = currentOrganization
    ? organizations.find((org) => org.id === currentOrganization.id)
    : null;

  if (
    validCurrent &&
    validCurrent.slug !== "mave-platform"
  ) {
    return validCurrent;
  }

  return tenantOrganizations[0] || organizations[0] || currentOrganization;
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const router = useRouter();

  const applyOrganization = useCallback((organization, { notify = false } = {}) => {
    if (!organization) {
      return;
    }

    localStorage.setItem("organization", JSON.stringify(organization));
    dispatch({ type: "SET_ORGANIZATION", payload: organization });
    clearAllApiCache();
    window.dispatchEvent(
      new CustomEvent(ORGANIZATION_CHANGED_EVENT, { detail: organization })
    );

    if (notify) {
      message.success(`Switched to ${organization.name}`);
    }
  }, []);

  const setSelectedOrganization = useCallback(
    (organization) => {
      applyOrganization(organization, { notify: true });
    },
    [applyOrganization]
  );

  const loadOrganizationsForSuperAdmin = useCallback(
    async (user, currentOrganization) => {
      if (!user?.is_super_admin) {
        return currentOrganization;
      }

      dispatch({ type: "SET_ORGANIZATIONS_LOADING", payload: true });

      try {
        const response = await instance.get("/organizations");
        const organizations = response.data || [];
        dispatch({ type: "SET_ORGANIZATIONS", payload: organizations });

        const resolvedOrganization = resolveSuperAdminOrganization(
          organizations,
          currentOrganization
        );

        if (
          resolvedOrganization &&
          resolvedOrganization.id !== currentOrganization?.id
        ) {
          applyOrganization(resolvedOrganization);
        }

        return resolvedOrganization;
      } catch (error) {
        console.error("Failed to load organizations:", error);
        dispatch({ type: "SET_ORGANIZATIONS_LOADING", payload: false });
        message.error("Failed to load organizations");
        return currentOrganization;
      }
    },
    [applyOrganization]
  );

  useEffect(() => {
    // Add a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (state.loading) {
        console.warn("Auth loading timeout - forcing loading to false");
        dispatch({ type: "SET_LOADING", payload: false });
      }
    }, 3000); // Reduced to 3 second timeout

    // Initialize authentication state from localStorage
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");
        const storedOrganization = localStorage.getItem("organization");

        if (storedToken && storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            let parsedOrganization = storedOrganization
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

            parsedOrganization = await loadOrganizationsForSuperAdmin(
              parsedUser,
              parsedOrganization
            );
          } catch (parseError) {
            console.error("Error parsing stored user:", parseError);
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
    };

    initializeAuth();

    return () => clearTimeout(timeoutId);
  }, [loadOrganizationsForSuperAdmin]);

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

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      let activeOrganization = organization || null;
      if (activeOrganization) {
        localStorage.setItem("organization", JSON.stringify(activeOrganization));
      }

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { token, user, organization: activeOrganization },
      });

      activeOrganization = await loadOrganizationsForSuperAdmin(
        user,
        activeOrganization
      );

      dispatch({ type: "SET_LOADING", payload: false });

      message.success("Login successful!");
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
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("organization");

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
        organizations: state.organizations,
        organizationsLoading: state.organizationsLoading,
        loading: state.loading,
        login,
        logout,
        setSelectedOrganization,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
