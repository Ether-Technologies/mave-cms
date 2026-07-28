import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { message } from "antd";
import instance from "../../axios";
import { setPageTitle } from "../../global/constants/pageTitle";
import NavigationHeader from "../../components/Navigation/NavigationHeader";
import NavigationBuilder from "../../components/Navigation/NavigationBuilder";
import NavigationAllItemsTab from "../../components/Navigation/NavigationAllItemsTab";

const Menus = () => {
  const router = useRouter();
  const tabFromQuery = router.query.tab === "items" ? "items" : "builder";
  const menuFromQuery = router.query.menu;

  const [activeTab, setActiveTab] = useState("builder");
  const [menus, setMenus] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [createMenuOpen, setCreateMenuOpen] = useState(false);

  useEffect(() => {
    setPageTitle("Navigation");
  }, []);

  useEffect(() => {
    if (router.isReady) {
      if (router.query.mode === "navbars" || router.query.tab === "navbars") {
        router.replace("/navbars");
        return;
      }
      setActiveTab(tabFromQuery);
    }
  }, [router.isReady, tabFromQuery, router]);

  const fetchMenus = useCallback(async () => {
    try {
      setLoading(true);
      const response = await instance("/menus");
      if (response.data) {
        const sortedData = [...response.data].sort((a, b) => b.id - a.id);
        setMenus(sortedData);
      }
    } catch {
      message.error("Menus couldn't be fetched");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMenuItems = useCallback(async () => {
    try {
      const response = await instance("/menuitems");
      if (response.data) {
        setMenuItems(response.data);
      }
    } catch {
      message.error("Menu items couldn't be fetched");
    }
  }, []);

  const fetchPages = useCallback(async () => {
    try {
      const response = await instance("/pages");
      if (response.data) setPages(response.data);
    } catch {
      /* optional for builder add form */
    }
  }, []);

  useEffect(() => {
    fetchMenus();
    fetchMenuItems();
    fetchPages();
  }, [fetchMenus, fetchMenuItems, fetchPages]);

  const handleTabChange = (key) => {
    setActiveTab(key);
    if (key === "builder") {
      fetchMenus();
      fetchMenuItems();
    }
    const query = key === "builder" ? {} : { tab: key };
    router.replace({ pathname: "/menus", query }, undefined, { shallow: true });
  };

  return (
    <div className="mavecontainer bg-gray-50 rounded-xl pb-8">
      <NavigationHeader
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onCreateMenu={() => setCreateMenuOpen(true)}
      />
      {activeTab === "builder" && (
        <NavigationBuilder
          menus={menus}
          setMenus={setMenus}
          menuItems={menuItems}
          pages={pages}
          fetchMenus={fetchMenus}
          fetchMenuItems={fetchMenuItems}
          loading={loading}
          createMenuOpen={createMenuOpen}
          setCreateMenuOpen={setCreateMenuOpen}
          initialMenuId={menuFromQuery}
        />
      )}
      {activeTab === "items" && <NavigationAllItemsTab />}
    </div>
  );
};

export default Menus;
