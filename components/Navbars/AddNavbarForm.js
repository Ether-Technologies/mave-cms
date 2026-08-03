// components/Navbars/AddNavbarForm.js

import React, { useState, useEffect } from "react";
import { Row, Col, Input, Select, Button, message } from "antd";
import { PlusCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import instance from "../../axios";
import MediaSelectionModal from "../PageBuilder/Modals/MediaSelectionModal";
import SortableMenuItemsPicker from "../Menus/SortableMenuItemsPicker";
import Image from "next/image";

const AddNavbarForm = ({ menus, media, onCancel, fetchNavbars }) => {
  const [newNavbarTitleEn, setNewNavbarTitleEn] = useState("");
  const [newNavbarTitleBn, setNewNavbarTitleBn] = useState("");
  const [newLogoId, setNewLogoId] = useState(null);
  const [newMenuId, setNewMenuId] = useState(null);
  const [newMenuItemIds, setNewMenuItemIds] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [mediaModalVisible, setMediaModalVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await instance("/menuitems");
        if (response.data) {
          setMenuItems(response.data);
        }
      } catch (error) {
        // silently fail — picker will show empty
      }
    };
    fetchMenuItems();
  }, []);

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
        if (newMenuId && newMenuItemIds.length >= 0) {
          await instance.put(`/menus/${newMenuId}`, {
            menu_item_ids: newMenuItemIds,
          });
        }
        message.success("Navbar created successfully");
        fetchNavbars();
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
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Assigned Menu
          </label>
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Menu Items — select and drag to order
            </label>
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
          Create
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
    </div>
  );
};

export default AddNavbarForm;
