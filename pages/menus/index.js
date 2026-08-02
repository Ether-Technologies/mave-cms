// pages/Menus.js

import React, { useState, useEffect } from "react";
import { message, Modal } from "antd";
import instance from "../../axios";
import { setPageTitle } from "../../global/constants/pageTitle";
import Loader from "../../components/Loader";
import MenusHeader from "../../components/Menus/MenusHeader";
import AddMenuForm from "../../components/Menus/AddMenuForm";
import MenusList from "../../components/Menus/MenusList";

const Menus = () => {
  useEffect(() => {
    setPageTitle("Menus");
  }, []);

  const [menus, setMenus] = useState([]);
  const [initialMenus, setInitialMenus] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingMenuId, setEditingMenuId] = useState(null);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("asc");
  const [selectedMenuIds, setSelectedMenuIds] = useState([]);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const response = await instance("/menus");
      if (response.data) {
        const sortedData = response.data.sort((a, b) => b.id - a.id);
        setMenus(sortedData);
        setInitialMenus(sortedData);
      } else {
        message.error("Menus couldn't be fetched");
      }
    } catch (err) {
      message.error("Menus couldn't be fetched");
    }
    setLoading(false);
  };

  const fetchMenuItems = async () => {
    try {
      const response = await instance("/menuitems");
      if (response.data) {
        setMenuItems(response.data);
      } else {
        message.error("Menu items couldn't be fetched");
      }
    } catch (err) {
      message.error("Menu items couldn't be fetched");
    }
  };

  useEffect(() => {
    fetchMenus();
    fetchMenuItems();
  }, []);

  useEffect(() => {
    const results = initialMenus.filter((menu) =>
      menu.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setMenus(results);
  }, [searchTerm]);

  useEffect(() => {
    const sortedMenus = [...menus].sort((a, b) =>
      sortType === "asc" ? a.id - b.id : b.id - a.id
    );
    setMenus(sortedMenus);
  }, [sortType]);

  const handleAddMenu = () => {
    setIsAddMenuOpen(true);
  };

  const handleCancelAddMenu = () => {
    setIsAddMenuOpen(false);
  };

  const handleReset = () => {
    setSearchTerm("");
    setSortType("asc");
    setMenus(initialMenus);
  };

  const handleSelectAll = () => {
    if (selectedMenuIds.length === menus.length) {
      setSelectedMenuIds([]);
    } else {
      setSelectedMenuIds(menus?.map((item) => item.id));
    }
  };

  const onShowChange = (value) => {
    console.log(value);
  };

  return (
    <div className="mavecontainer bg-gray-50 rounded-xl">
      <MenusHeader
        onAddMenu={handleAddMenu}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sortType={sortType}
        setSortType={setSortType}
        handleReset={handleReset}
        handleSelectAll={handleSelectAll}
        allSelected={selectedMenuIds.length === menus.length}
        onShowChange={onShowChange}
        onRefresh={() => {
          fetchMenus();
          fetchMenuItems();
        }}
      />
      <Modal
        open={isAddMenuOpen}
        onCancel={handleCancelAddMenu}
        footer={null}
        title={
          <div className="flex items-center gap-2">
            <img src="/icons/mave/menus.svg" alt="Menus" className="w-6" />
            <span>Add Menu</span>
          </div>
        }
        width={900}
      >
        <AddMenuForm
          menuItems={menuItems}
          onCancel={handleCancelAddMenu}
          fetchMenus={fetchMenus}
        />
      </Modal>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      ) : (
        <MenusList
          menus={menus}
          menuItems={menuItems}
          setMenus={setMenus}
          editingMenuId={editingMenuId}
          setEditingMenuId={setEditingMenuId}
          selectedMenuIds={selectedMenuIds}
          setSelectedMenuIds={setSelectedMenuIds}
        />
      )}
    </div>
  );
};

export default Menus;
