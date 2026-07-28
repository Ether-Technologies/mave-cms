// components/ui/SideMenuItems.js

import { LoginOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { Menu, Spin, Empty, Tooltip } from "antd";
import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/router";
import AuthorizedSideMenuData from "../../src/data/authorisedsidemenus.json";
import UnAuthorizedSideMenuData from "../../src/data/unauthorisedsidemenu.json";
import NiloyLabs from "../../src/data/niloy.json";
import Godfather from "../../src/data/godfather.json";
import Ecommerce from "../../src/data/ecommerce.json";
import Image from "next/image";
import instance from "../../axios";
import { useMenuRefresh } from "../../src/context/MenuRefreshContext";

const { SubMenu, Item } = Menu;

// Constants
const CONSTANTS = {
  CLIENT_UUROTRAVELS: "uurotravels",
  NILOY_EMAIL: "atiqisrak@niloy.com",
  CREATOR_STUDIO_TITLE: "Creator Studio",
  CUSTOM_MODEL_ICON: "/icons/mave/custom-models.svg",
  CUSTOM_MODEL_PREFIX: "custom-",
  SECTION_PREFIX: "Section ",
  ERROR_MESSAGES: {
    FETCH_CUSTOM_MODELS: "Failed to fetch custom models",
    NO_MENU_DATA: "No menu data available",
    INVALID_MENU_ITEM: "Invalid menu item",
  },
  LOADING_MESSAGES: {
    CUSTOM_MODELS: "Loading custom models...",
    MENU_INITIALIZATION: "Initializing menu...",
  },
  SUCCESS_MESSAGES: {
    CUSTOM_MODELS_LOADED: "Custom models loaded successfully",
  },
};

// Error Boundary Component
const MenuErrorBoundary = ({ children, fallback }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleError = (error) => {
      console.error("Menu Error:", error);
      setError(error);
      setHasError(true);
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  if (hasError) {
    return fallback || (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <ExclamationCircleOutlined className="text-2xl text-gray-700 mb-2" />
        <p className="text-gray-600 mb-2">Something went wrong with the menu</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
        >
          Reload
        </button>
      </div>
    );
  }

  return children;
};

// Custom Hook for Menu Data Management
const useMenuData = (token, user, isUuroTravels) => {
  const [sideMenuData, setSideMenuData] = useState([]);
  const [godfatherData, setGodfatherData] = useState([]);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    try {
      setIsInitializing(true);

      if (token && user) {
        // Only set ecommerce data if client is uurotravels
        const baseMenu = [...AuthorizedSideMenuData];
        if (isUuroTravels) {
          baseMenu.push(...Ecommerce);
        }

        setSideMenuData(baseMenu);
        setGodfatherData(Godfather);
      } else {
        setSideMenuData(UnAuthorizedSideMenuData);
        setGodfatherData([]);
      }
    } catch (error) {
      console.error("Error initializing menu data:", error);
      setSideMenuData(UnAuthorizedSideMenuData);
      setGodfatherData([]);
    } finally {
      setIsInitializing(false);
    }
  }, [token, user, isUuroTravels]);

  return { sideMenuData, godfatherData, isInitializing };
};

// Custom Hook for Custom Models
const useCustomModels = (token, refreshMenu) => {
  const [customModels, setCustomModels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  const fetchCustomModels = useCallback(async () => {
    if (!token) return;

    // Cancel previous request if exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsLoading(true);
    setError(null);

    try {
      const response = await instance.get("/generated-models", {
        signal: abortControllerRef.current.signal,
      });

      if (response.status === 200) {
        setCustomModels(response.data);
      }
    } catch (error) {
      if (error.name === 'AbortError') return;

      console.error(CONSTANTS.ERROR_MESSAGES.FETCH_CUSTOM_MODELS, error);
      setError(error.message || CONSTANTS.ERROR_MESSAGES.FETCH_CUSTOM_MODELS);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchCustomModels();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchCustomModels, refreshMenu]);

  return { customModels, isLoading, error, refetch: fetchCustomModels };
};

const SideMenuItems = ({
  token,
  user,
  handleLogout,
  setIsModalOpen,
  collapsed,
  theme,
  setTheme,
}) => {
  const { refreshMenu } = useMenuRefresh();
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [openKeys, setOpenKeys] = useState([]);
  const router = useRouter();

  // Check if current client is uurotravels
  const isUuroTravels = useMemo(() => {
    return process.env.NEXT_PUBLIC_CLIENT === CONSTANTS.CLIENT_UUROTRAVELS;
  }, []);

  // Custom hooks for data management
  const { sideMenuData, godfatherData, isInitializing } = useMenuData(token, user, isUuroTravels);
  const { customModels, isLoading: isCustomModelsLoading, error: customModelsError, refetch: refetchCustomModels } = useCustomModels(token, refreshMenu);

  // Combine authorized menus with godfather data
  const allMenuData = useMemo(() => {
    return [...sideMenuData, ...godfatherData];
  }, [sideMenuData, godfatherData]);

  const finalMenuData = useMemo(() => {
    try {
      const menuData = JSON.parse(JSON.stringify(allMenuData));

      // Include Niloy Labs data only for specific user
      if (user?.email === CONSTANTS.NILOY_EMAIL) {
        const niloyLabsData = JSON.parse(JSON.stringify(NiloyLabs));
        menuData.push(...niloyLabsData);
      }

      // Add custom models to Creator Studio menu
      if (token && user && customModels.length > 0) {
        const creatorStudioMenu = menuData.find(
          (menu) => menu.title === CONSTANTS.CREATOR_STUDIO_TITLE
        );

        if (creatorStudioMenu) {
          const customModelItems = customModels.map((model) => ({
            id: `${CONSTANTS.CUSTOM_MODEL_PREFIX}${model.id}`,
            icon: CONSTANTS.CUSTOM_MODEL_ICON,
            link: `/custom-models/${model.id}`,
            title: model.model_name
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" "),
          }));

          creatorStudioMenu.submenu = [
            ...(creatorStudioMenu.submenu || []),
            ...customModelItems,
          ];
        }
      }

      return menuData;
    } catch (error) {
      console.error("Error processing menu data:", error);
      return allMenuData;
    }
  }, [allMenuData, customModels, token, user]);

  // Manage selected menu item based on current path
  useEffect(() => {
    if (!router.isReady || finalMenuData.length === 0) return;

    try {
      const currentPath = router.pathname;
      const selectedItem =
        finalMenuData.find((item) => item.link === currentPath) ||
        finalMenuData
          .flatMap((item) => item.submenu || [])
          .find((subItem) => subItem.link === currentPath) ||
        {};

      if (selectedItem.id !== undefined) {
        setSelectedMenuItem(selectedItem.id.toString());

        // Set openKeys based on selected item
        const parentItem = finalMenuData.find((item) =>
          item.submenu?.some(
            (sub) => sub.id.toString() === selectedItem.id.toString()
          )
        );

        if (parentItem) {
          setOpenKeys([parentItem.id.toString()]);
        } else {
          setOpenKeys([]);
        }
      } else {
        setSelectedMenuItem("");
        setOpenKeys([]);
      }
    } catch (error) {
      console.error("Error setting selected menu item:", error);
      setSelectedMenuItem("");
      setOpenKeys([]);
    }
  }, [router.pathname, finalMenuData, router.isReady]);

  const handleMenuClick = useCallback(({ key }) => {
    try {
      setSelectedMenuItem(key);
      const selectedItem =
        finalMenuData.find((menuItem) => menuItem.id.toString() === key) ||
        finalMenuData
          .flatMap((menuItem) => menuItem.submenu || [])
          .find((subItem) => subItem.id.toString() === key);

      if (selectedItem?.link) {
        router.push(selectedItem.link);
      }
    } catch (error) {
      console.error("Error handling menu click:", error);
    }
  }, [finalMenuData, router]);

  // Handle submenu open changes to allow only one open submenu
  const onOpenChange = useCallback((keys) => {
    try {
      if (keys.length > 1) {
        // Only keep the latest opened key
        setOpenKeys([keys[keys.length - 1]]);
      } else {
        setOpenKeys(keys);
      }
    } catch (error) {
      console.error("Error handling submenu open change:", error);
    }
  }, []);

  const handleLoginClick = useCallback(() => {
    try {
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error opening login modal:", error);
    }
  }, [setIsModalOpen]);

  const renderMenuItem = useCallback((item) => {
    if (!item?.id) return null;

    try {
      if (item?.submenu?.length > 0) {
        return (
          <SubMenu
            key={item.id.toString()}
            title={
              <div className="flex items-center gap-2 font-semibold">
                <div className="flex items-center justify-center w-6 h-6">
                  <Image
                    src={item.icon}
                    alt={`${item.title} icon`}
                    width={20}
                    height={20}
                    className="main-menu-icon"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
                {!collapsed && <span>{item.title}</span>}
              </div>
            }
            className="border-2 border-gray-200 mb-2"
          >
            {item.submenu.map((subItem) => (
              <Item key={subItem.id.toString()} className="">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-5 h-5">
                    <Image
                      src={subItem.icon}
                      alt={`${subItem.title} icon`}
                      width={16}
                      height={16}
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                  <span className="text-md font-semibold text-gray-500">
                    {subItem.title}
                  </span>
                </div>
              </Item>
            ))}
          </SubMenu>
        );
      }

      return (
        <Item
          key={item.id.toString()}
          className={`border-2 ${token ? "border-gray-800" : "border-gray-400"}`}
        >
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-6 h-6">
              <Image
                src={item.icon}
                alt={`${item.title} icon`}
                width={20}
                height={20}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            {!collapsed && <span>{item.title}</span>}
          </div>
        </Item>
      );
    } catch (error) {
      console.error("Error rendering menu item:", error, item);
      return null;
    }
  }, [collapsed, token]);

  // Show loading state during initialization
  if (isInitializing) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spin tip={CONSTANTS.LOADING_MESSAGES.MENU_INITIALIZATION} />
      </div>
    );
  }

  return (
    <MenuErrorBoundary>
      <Menu
        theme={theme === "dark" ? "dark" : "light"}
        mode="inline"
        selectedKeys={[selectedMenuItem]}
        openKeys={openKeys}
        onOpenChange={onOpenChange}
        onClick={handleMenuClick}
        className="w-full h-full"
      >
        {finalMenuData && finalMenuData.length > 0 ? (
          finalMenuData.map(renderMenuItem).filter(Boolean)
        ) : (
          <Empty
            description={CONSTANTS.ERROR_MESSAGES.NO_MENU_DATA}
            className="my-8"
          />
        )}

        {/* Login Menu Item for Unauthorized Users */}
        {!token && (
          <Tooltip title="Click to login" placement="right">
            <Item
              key="login"
              icon={<LoginOutlined />}
              onClick={handleLoginClick}
              className="border-2 border-gray-400 mt-4 hover:border-gray-600 transition-colors"
            >
              {!collapsed && <span>Login</span>}
            </Item>
          </Tooltip>
        )}
      </Menu>
    </MenuErrorBoundary>
  );
};

export default SideMenuItems;
