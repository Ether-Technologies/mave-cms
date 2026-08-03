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

const AddNavbarForm = ({ menus, fetchMenus, media, onCancel, fetchNavbars }) => {
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
    const selectedMenu = menus.find((m) => m.id === newMenuId);
    if (selectedMenu?.menu_items?.length) {
      setNewMenuItemIds(selectedMenu.menu_items.map((item) => item.id));
    } else if (selectedMenu?.menu_item_ids) {
      setNewMenuItemIds(selectedMenu.menu_item_ids);
    } else {
      setNewMenuItemIds([]);
    }
  }, [newMenuId, menus]);

  const resetForm = () => {
    setNewNavbarTitleEn("");
    setNewNavbarTitleBn("");
    setNewLogoId(null);
    setNewMenuId(null);
    setNewMenuItemIds([]);
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
      const newNavbar = {
        title_en: newNavbarTitleEn,
        title_bn: newNavbarTitleBn,
        logo_id: newLogoId,
        menu_id: newMenuId,
      };
      const response = await instance.post("/navbars", newNavbar);
      if (response.status === 201) {
        if (newMenuId) {
          const selectedMenu = menus.find((m) => m.id === newMenuId);
          await instance.put(`/menus/${newMenuId}`, {
            name: selectedMenu?.name,
            menu_item_ids: newMenuItemIds,
          });
        }
        message.success("Navbar created successfully");
        fetchNavbars();
        fetchMenus?.();
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
          <Button onClick={() => setMediaModalVisible(true)}>
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
              className="h-8 text-xs"
            >
              Create Menu
            </Button>
          </div>
          <Select
            showSearch
            placeholder="Select a Menu"
            optionFilterProp="children"
            onChange={(value) => setNewMenuId(value)}
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
                className="h-8 text-xs"
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
          className="bg-gray-500 border-2 border-gray-600 py-5 font-bold text-lg text-white"
        >
          Cancel
        </Button>
        <Button
          icon={<PlusCircleOutlined />}
          onClick={handleAddNavbar}
          className="mavebutton"
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
