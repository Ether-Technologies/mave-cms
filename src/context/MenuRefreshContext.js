// src/context/MenuRefreshContext.js

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useRef,
} from "react";
import { clearAllApiCache } from "../../utils/apiUtils";

const MenuRefreshContext = createContext();

export const MenuRefreshProvider = ({ children }) => {
  const [refreshMenu, setRefreshMenu] = useState(false);
  const [globalRefresh, setGlobalRefresh] = useState(0);

  const triggerMenuRefresh = () => {
    setRefreshMenu((prev) => !prev);
  };

  const triggerGlobalRefresh = () => {
    clearAllApiCache();
    setRefreshMenu((prev) => !prev);
    setGlobalRefresh((prev) => prev + 1);
  };

  return (
    <MenuRefreshContext.Provider
      value={{
        refreshMenu,
        triggerMenuRefresh,
        globalRefresh,
        triggerGlobalRefresh,
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
