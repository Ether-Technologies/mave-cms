import React, { useState, useEffect, useCallback } from "react";
import { message } from "antd";
import instance from "../../axios";
import { setPageTitle } from "../../global/constants/pageTitle";
import NavbarsPageHeader from "../../components/Navbars/NavbarsPageHeader";
import NavbarBuilder from "../../components/Navbars/NavbarBuilder";

const Navbars = () => {
  useEffect(() => {
    setPageTitle("Navbars");
  }, []);

  const [menus, setMenus] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [createNavbarOpen, setCreateNavbarOpen] = useState(false);

  const fetchMenus = useCallback(async () => {
    try {
      const response = await instance("/menus");
      if (response.data) setMenus(response.data);
    } catch {
      message.error("Menus couldn't be fetched");
    }
  }, []);

  const fetchMenuItems = useCallback(async () => {
    try {
      const response = await instance("/menuitems");
      if (response.data) setMenuItems(response.data);
    } catch {
      message.error("Menu items couldn't be fetched");
    }
  }, []);

  useEffect(() => {
    fetchMenus();
    fetchMenuItems();
  }, [fetchMenus, fetchMenuItems]);

  return (
    <div className="mavecontainer bg-gray-50 rounded-xl pb-8">
      <NavbarsPageHeader onCreateNavbar={() => setCreateNavbarOpen(true)} />
      <NavbarBuilder
        menus={menus}
        menuItems={menuItems}
        createNavbarOpen={createNavbarOpen}
        setCreateNavbarOpen={setCreateNavbarOpen}
      />
    </div>
  );
};

export default Navbars;
