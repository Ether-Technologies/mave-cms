// components/ui/SideMenuItems.js

import { LoginOutlined } from "@ant-design/icons";
import { Menu, Spin } from "antd";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/router";
import AuthorizedSideMenuData from "../../src/data/authorisedsidemenus.json";
import UnAuthorizedSideMenuData from "../../src/data/unauthorisedsidemenu.json";
import NiloyLabs from "../../src/data/niloy.json";
import Godfather from "../../src/data/godfather.json";
import Image from "next/image";
import instance from "../../axios";
import { useMenuRefresh } from "../../src/context/MenuRefreshContext";

const { SubMenu, Item } = Menu;

const SideMenuItems = ({
  token,
  user,
  handleLogout,
  setIsModalOpen, // Received prop
  collapsed,
  theme,
  setTheme,
}) => {
  const { refreshMenu } = useMenuRefresh(); // Consume context
  const [isLoading, setIsLoading] = useState(false);
  const [sideMenuData, setSideMenuData] = useState([]);
  const [godfatherData, setGodfatherData] = useState([]);
  const [customModels, setCustomModels] = useState([]);
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [openKeys, setOpenKeys] = useState([]);
  const router = useRouter();

  // Initialize sideMenuData based on authentication
  useEffect(() => {
    if (token && user) {
      // Deep clone to prevent mutating the original JSON
      const authorizedMenu = JSON.parse(JSON.stringify(AuthorizedSideMenuData));
      setSideMenuData(authorizedMenu);

      // Check for Godfather users
      // if (
      //   user?.email === "atiqisrak@niloy.com" ||
      //   user?.email === "Zeeshan.akhtar@webable.digital" ||
      //   user?.email === "su@mave.cms"
      // ) {
      //   setGodfatherData(Godfather);
      // } else {
      //   setGodfatherData([]);
      // }
      setGodfatherData(Godfather);
    } else {
      setSideMenuData(UnAuthorizedSideMenuData);
      setGodfatherData([]);
    }
  }, [token, user]);

  // Combine authorized menus with godfather data
  const allMenuData = useMemo(() => {
    return [...sideMenuData, ...godfatherData];
  }, [sideMenuData, godfatherData]);

  // Fetch custom models
  const fetchCustomModels = async () => {
    setIsLoading(true);
    try {
      const response = await instance.get("/generated-models");
      if (response.status === 200) {
        setCustomModels(response.data);
      } else {
        console.error("Failed to fetch custom models");
      }
    } catch (error) {
      console.error("Failed to fetch custom models", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchCustomModels();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, refreshMenu]); // Add refreshMenu as a dependency

  const finalMenuData = useMemo(() => {
    const menuData = JSON.parse(JSON.stringify(allMenuData));

    // Include Niloy Labs data
    const niloyLabsData = JSON.parse(JSON.stringify(NiloyLabs));

    user?.email === "atiqisrak@niloy.com" && menuData.push(...niloyLabsData);

    if (token && user && customModels.length > 0) {
      const creatorStudioMenu = menuData.find(
        (menu) => menu.title === "Creator Studio"
      );

      if (creatorStudioMenu) {
        const customModelItems = customModels.map((model) => ({
          id: `custom-${model.id}`,
          icon: "/icons/mave/custom-models.svg",
          link: `/custom-models/${model.id}`,
          title: model.model_name
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" "),
        }));

        creatorStudioMenu.submenu = [
          ...creatorStudioMenu.submenu,
          ...customModelItems,
        ];
      }
    }

    return menuData;
  }, [allMenuData, NiloyLabs, customModels, token, user]);

  // Manage selected menu item based on current path
  useEffect(() => {
    if (router.isReady && finalMenuData.length > 0) {
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
    }
  }, [router.pathname, finalMenuData]);

  const handleMenuClick = ({ key }) => {
    setSelectedMenuItem(key);
    const selectedItem =
      finalMenuData.find((menuItem) => menuItem.id.toString() === key) ||
      finalMenuData
        .flatMap((menuItem) => menuItem.submenu || [])
        .find((subItem) => subItem.id.toString() === key);

    if (selectedItem && selectedItem.link) {
      router.push(selectedItem.link);
    }
  };

  // Handle submenu open changes to allow only one open submenu
  const onOpenChange = (keys) => {
    if (keys.length > 1) {
      // Only keep the latest opened key
      setOpenKeys([keys[keys.length - 1]]);
    } else {
      setOpenKeys(keys);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spin tip="Loading custom models..." />
      </div>
    );
  }

  return (
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
        finalMenuData.map((item) =>
          item?.submenu?.length > 0 ? (
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
                      />
                    </div>
                    <span className="text-md font-semibold text-gray-500">
                      {subItem.title}
                    </span>
                  </div>
                </Item>
              ))}
            </SubMenu>
          ) : (
            <Item
              key={item.id.toString()}
              className={`border-2 ${
                token ? "border-yellow-400" : "border-gray-400"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-6 h-6">
                  <Image
                    src={item.icon}
                    alt={`${item.title} icon`}
                    width={20}
                    height={20}
                  />
                </div>
                {!collapsed && <span>{item.title}</span>}
              </div>
            </Item>
          )
        )
      ) : (
        <Item key="no-data">No data found</Item>
      )}

      {/* Login Menu Item for Unauthorized Users */}
      {!token && (
        <Item
          key="login"
          icon={<LoginOutlined />}
          onClick={() => setIsModalOpen(true)} // Use the setter to open the modal
          className="border-2 border-gray-400 mt-4"
        >
          {!collapsed && <span>Login</span>}
        </Item>
      )}
    </Menu>
  );
};

export default SideMenuItems;
