// src/context/MenuRefreshContext.js

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { refreshAllData } from "../../utils/refreshAllData";
import { ORGANIZATION_CHANGED_EVENT } from "./AuthContext";
import { clearAllApiCache } from "../../utils/apiUtils";

const MenuRefreshContext = createContext();

export const MenuRefreshProvider = ({ children }) => {
  const [refreshMenu, setRefreshMenu] = useState(false);
  const [globalRefresh, setGlobalRefresh] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const triggerMenuRefresh = () => {
    setRefreshMenu((prev) => !prev);
  };

  const triggerGlobalRefresh = useCallback(async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      await refreshAllData();
      setRefreshMenu((prev) => !prev);
      setGlobalRefresh((prev) => prev + 1);
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing]);

  useEffect(() => {
    const handleOrganizationChange = () => {
      clearAllApiCache();
      setRefreshMenu((prev) => !prev);
      setGlobalRefresh((prev) => prev + 1);
    };

    window.addEventListener(
      ORGANIZATION_CHANGED_EVENT,
      handleOrganizationChange
    );

    return () => {
      window.removeEventListener(
        ORGANIZATION_CHANGED_EVENT,
        handleOrganizationChange
      );
    };
  }, []);

  return (
    <MenuRefreshContext.Provider
      value={{
        refreshMenu,
        triggerMenuRefresh,
        globalRefresh,
        triggerGlobalRefresh,
        isRefreshing,
      }}
    >
      {children}
    </MenuRefreshContext.Provider>
  );
};

export const useMenuRefresh = () => useContext(MenuRefreshContext);

export const useGlobalRefresh = (callback) => {
  const context = useMenuRefresh();
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (context?.globalRefresh > 0) {
      callbackRef.current();
    }
  }, [context?.globalRefresh]);
};
