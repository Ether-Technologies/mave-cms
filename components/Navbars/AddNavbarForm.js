// components/Navbars/AddNavbarForm.js

import React, { useState, useEffect, useCallback } from "react";
import { Row, Col, Input, Select, Button, message, Modal } from "antd";
import { PlusCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import instance from "../../axios";
import MediaSelectionModal from "../PageBuilder/Modals/MediaSelectionModal";
import SortableMenuItemsPicker from "../Menus/SortableMenuItemsPicker";
import AddMenuForm from "../Menus/AddMenuForm";
import AddMenuItemForm from "../MenuItems/AddMenuItemForm";
import Image from "next/image";

const AddNavbarForm = ({ menus, fetchMenus, media, onCancel, fetchNavbars, onNavbarCreated }) => {
  const [newNavbarTitleEn, setNewNavbarTitleEn] = useState("");
  const [newNavbarTitleBn, setNewNavbarTitleBn] = useState("");
  const [newLogoId, setNewLogoId] = useState(null);
  const [newMenuId, setNewMenuId] = useState(null);
  const [newMenuItemIds, setNewMenuItemIds] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [pages, setPages] = useState([]);
  const [mediaModalVisible, setMediaModalVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const [isAddMenuItemOpen, setIsAddMenuItemOpen] = useState(false);
  const [selectedMenuName, setSelectedMenuName] = useState("");

  const findMenuById = useCallback(
    (menuId, menusList = menus) =>
      menusList.find((menu) => String(menu.id) === String(menuId)),
    [menus]
  );

  const resolveMenuForUpdate = useCallback(
    async (menuId) => {
      let menu = findMenuById(menuId);
      if (menu?.name) {
        return menu;
      }

      const response = await instance("/menus");
      const freshMenus = Array.isArray(response.data) ? response.data : [];
      menu = freshMenus.find((item) => String(item.id) === String(menuId));
      return menu;
    },
    [findMenuById]
  );

  const fetchMenuItems = useCallback(async () => {
    try {
      const response = await instance("/menuitems");
      if (response.data) {
        setMenuItems(response.data);
      }
    } catch (error) {
      // silently fail — picker will show empty
    }
  }, []);

  const fetchPages = useCallback(async () => {
    try {
      const response = await instance("/pages");
      if (response.data) {
        setPages(response.data);
      }
    } catch (error) {
      // silently fail
    }
  }, []);

  useEffect(() => {
    fetchMenuItems();
    fetchPages();
  }, [fetchMenuItems, fetchPages]);

  useEffect(() => {
    if (!newMenuId) {
      setNewMenuItemIds([]);
      return;
    }
    const selectedMenu = findMenuById(newMenuId);
    if (selectedMenu?.menu_items?.length) {
      setNewMenuItemIds(selectedMenu.menu_items.map((item) => item.id));
    } else if (selectedMenu?.menu_item_ids) {
      setNewMenuItemIds(selectedMenu.menu_item_ids);
    } else {
      setNewMenuItemIds([]);
    }
    if (selectedMenu?.name) {
      setSelectedMenuName(selectedMenu.name);
    }
  }, [newMenuId, menus, findMenuById]);

  const resetForm = () => {
    setNewNavbarTitleEn("");
    setNewNavbarTitleBn("");
    setNewLogoId(null);
    setNewMenuId(null);
    setNewMenuItemIds([]);
    setSelectedMenuName("");
    setSelectedMedia(null);
    setMediaModalVisible(false);
    setIsAddMenuOpen(false);
    setIsAddMenuItemOpen(false);
  };

  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  const handleAddNavbar = async () => {
    if (!newNavbarTitleEn || !newLogoId || !newMenuId) {
      message.error("Please fill in all required fields");
      return;
    }
    try {
      const menu = await resolveMenuForUpdate(newMenuId);
      const menuName = menu?.name || selectedMenuName;
      if (!menuName) {
        message.error("Selected menu could not be found. Please re-select the menu.");
        return;
      }

      const newNavbar = {
        title_en: newNavbarTitleEn,
        title_bn: newNavbarTitleBn,
        logo_id: newLogoId,
        menu_id: newMenuId,
      };
      const response = await instance.post("/navbars", newNavbar);
      if (response.status === 201) {
        await instance.put(`/menus/${newMenuId}`, {
          name: menuName,
          menu_item_ids: newMenuItemIds,
        });
        message.success("Navbar created successfully");
        fetchNavbars?.();
        fetchMenus?.();
        onNavbarCreated?.(response.data);
        resetForm();
        onCancel();
      } else {
        message.error("Error creating navbar");
      }
    } catch (error) {
      message.error("Error creating navbar");
    }
  };

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Input
            placeholder="Navbar Title (English)"
            value={newNavbarTitleEn}
            onChange={(e) => setNewNavbarTitleEn(e.target.value)}
          />
        </Col>
        <Col xs={24} md={12}>
          <Input
            placeholder="Navbar Title (Alternate)"
            value={newNavbarTitleBn}
            onChange={(e) => setNewNavbarTitleBn(e.target.value)}
          />
        </Col>
        <Col xs={24} md={12}>
          <Button
            onClick={() => setMediaModalVisible(true)}
            className="h-10 px-4 bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 text-gray-700 border-2 border-gray-200 hover:border-blue-300 font-semibold shadow-sm hover:shadow-md transition-all rounded-lg"
          >
            {newLogoId ? "Change Logo" : "Select Logo"}
          </Button>
          {newLogoId && selectedMedia ? (
            <div className="mt-2">
              <Image
                src={
                  selectedMedia.file_path
                    ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/${selectedMedia.file_path}`
                    : "/images/Image_placeholder.png"
                }
                alt={selectedMedia.file_name || "Navbar Logo"}
                width={100}
                height={100}
                className="rounded-lg object-cover"
              />
            </div>
          ) : null}
        </Col>
      </Row>

      <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-gray-700">
              Assigned Menu
            </label>
            <Button
              icon={<PlusCircleOutlined />}
              onClick={() => setIsAddMenuOpen(true)}
              className="h-9 px-4 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white border-0 font-semibold shadow-md hover:shadow-lg transition-all rounded-lg text-xs"
            >
              Create Menu
            </Button>
          </div>
          <Select
            showSearch
            placeholder="Select a Menu"
            optionFilterProp="children"
            onChange={(value) => {
              setNewMenuId(value ?? null);
              const menu = findMenuById(value);
              setSelectedMenuName(menu?.name || "");
            }}
            className="w-full max-w-md [&_.ant-select-selector]:h-10 [&_.ant-select-selector]:border-2 [&_.ant-select-selector]:border-gray-200 [&_.ant-select-selector]:rounded-lg hover:[&_.ant-select-selector]:border-blue-300"
            allowClear
            value={newMenuId}
          >
            {menus?.map((menu) => (
              <Select.Option key={menu.id} value={menu.id}>
                {menu.name}
              </Select.Option>
            ))}
          </Select>
        </div>

        {newMenuId && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold text-gray-700">
                Menu Items — select and drag to order
              </label>
              <Button
                icon={<PlusCircleOutlined />}
                onClick={() => setIsAddMenuItemOpen(true)}
                className="h-9 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 font-semibold shadow-md hover:shadow-lg transition-all rounded-lg text-xs"
              >
                Create Item
              </Button>
            </div>
            <SortableMenuItemsPicker
              menuItems={menuItems}
              value={newMenuItemIds}
              onChange={setNewMenuItemIds}
            />
          </div>
        )}
      </div>

      <div className="flex justify-end mt-4 gap-4">
        <Button
          icon={<CloseCircleOutlined />}
          onClick={handleCancel}
          className="h-11 px-6 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white border-0 font-semibold shadow-md hover:shadow-lg transition-all rounded-xl"
        >
          Cancel
        </Button>
        <Button
          icon={<PlusCircleOutlined />}
          onClick={handleAddNavbar}
          className="h-11 px-6 bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-blue-600 text-white border-0 font-semibold shadow-md hover:shadow-xl transition-all rounded-xl"
        >
          Create Navbar
        </Button>
      </div>

      <MediaSelectionModal
        isVisible={mediaModalVisible}
        onClose={() => setMediaModalVisible(false)}
        selectionMode="single"
        onSelectMedia={(selected) => {
          if (selected) {
            setNewLogoId(selected.id);
            setSelectedMedia(selected);
          }
          setMediaModalVisible(false);
        }}
      />

      <Modal
        open={isAddMenuOpen}
        onCancel={() => setIsAddMenuOpen(false)}
        destroyOnClose
        footer={null}
        title={
          <div className="flex items-center gap-2">
            <img src="/icons/mave/menus.svg" alt="Menus" className="w-6" />
            <span>Add Menu</span>
          </div>
        }
        width={900}
        zIndex={1100}
      >
        {isAddMenuOpen && (
          <AddMenuForm
            menuItems={menuItems}
            onCancel={() => setIsAddMenuOpen(false)}
            fetchMenus={fetchMenus}
          />
        )}
      </Modal>

      <Modal
        open={isAddMenuItemOpen}
        onCancel={() => setIsAddMenuItemOpen(false)}
        destroyOnClose
        footer={null}
        title={
          <div className="flex items-center gap-2">
            <img src="/icons/mave/menuitems.svg" alt="Menu Items" className="w-6" />
            <span>Add Menu Item</span>
          </div>
        }
        width={900}
        zIndex={1100}
      >
        {isAddMenuItemOpen && (
          <AddMenuItemForm
            pages={pages}
            menuItems={menuItems}
            onCancel={() => setIsAddMenuItemOpen(false)}
            fetchMenuItems={fetchMenuItems}
          />
        )}
      </Modal>
    </div>
  );
};

export default AddNavbarForm;
