// components/Menus/AddMenuForm.js

import React, { useState, useCallback, useEffect } from "react";
import { Input, Button, message, Modal } from "antd";
import { PlusCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import instance from "../../axios";
import SortableMenuItemsPicker from "./SortableMenuItemsPicker";
import AddMenuItemForm from "../MenuItems/AddMenuItemForm";

const AddMenuForm = ({
  menuItems,
  pages: pagesProp,
  onCancel,
  fetchMenus,
  fetchMenuItems: fetchMenuItemsProp,
  onMenuCreated,
}) => {
  const [newMenuName, setNewMenuName] = useState("");
  const [newMenuItemsIds, setNewMenuItemsIds] = useState([]);
  const [localMenuItems, setLocalMenuItems] = useState(menuItems || []);
  const [pages, setPages] = useState(pagesProp || []);
  const [isAddMenuItemOpen, setIsAddMenuItemOpen] = useState(false);

  useEffect(() => {
    setLocalMenuItems(menuItems || []);
  }, [menuItems]);

  useEffect(() => {
    setPages(pagesProp || []);
  }, [pagesProp]);

  const fetchMenuItems = useCallback(async () => {
    if (fetchMenuItemsProp) {
      await fetchMenuItemsProp();
      return;
    }
    try {
      const response = await instance("/menuitems");
      if (Array.isArray(response.data)) {
        setLocalMenuItems(response.data);
      }
    } catch (error) {
      // picker will stay with current list
    }
  }, [fetchMenuItemsProp]);

  const fetchPages = useCallback(async () => {
    if (Array.isArray(pagesProp) && pagesProp.length > 0) {
      return;
    }
    try {
      const response = await instance("/pages");
      if (Array.isArray(response.data)) {
        setPages(response.data);
      }
    } catch (error) {
      // page picker will stay empty
    }
  }, [pagesProp]);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  const handleMenuItemCreated = (createdItems = []) => {
    if (createdItems.length) {
      setLocalMenuItems((prev) => {
        const existing = new Set(prev.map((item) => item.id));
        return [
          ...prev,
          ...createdItems.filter((item) => item?.id && !existing.has(item.id)),
        ];
      });
    }
    const ids = createdItems.map((item) => item.id).filter(Boolean);
    if (ids.length) {
      setNewMenuItemsIds((prev) => [
        ...prev,
        ...ids.filter((id) => !prev.includes(id)),
      ]);
    }
  };

  const handleAddMenu = async () => {
    if (!newMenuName.trim()) {
      message.warning("Please enter a menu name");
      return;
    }
    try {
      const newMenu = {
        name: newMenuName,
        menu_item_ids: newMenuItemsIds,
      };
      const response = await instance.post("/menus", newMenu);
      if (response.status === 201) {
        message.success("Menu created successfully");
        fetchMenus?.();
        onMenuCreated?.(response.data);
        onCancel();
      } else {
        message.error("Error creating menu");
      }
    } catch (error) {
      message.error("Error creating menu");
    }
  };

  return (
    <div>
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Menu Name
        </label>
        <Input
          placeholder="Enter Menu Name"
          value={newMenuName}
          onChange={(e) => setNewMenuName(e.target.value)}
          className="w-full h-10"
        />
      </div>

      <div className="mb-4">
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
          menuItems={localMenuItems}
          value={newMenuItemsIds}
          onChange={setNewMenuItemsIds}
        />
      </div>

      <div className="flex justify-end mt-4 gap-5">
        <Button
          icon={<PlusCircleOutlined />}
          onClick={handleAddMenu}
          className="mavebutton"
        >
          Create
        </Button>
        <Button
          icon={<CloseCircleOutlined />}
          onClick={onCancel}
          className="mavecancelbutton"
        >
          Cancel
        </Button>
      </div>

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
        zIndex={1300}
        getContainer={() => document.body}
      >
        {isAddMenuItemOpen && (
          <AddMenuItemForm
            pages={pages}
            menuItems={localMenuItems}
            onCancel={() => setIsAddMenuItemOpen(false)}
            fetchMenuItems={fetchMenuItems}
            onMenuItemCreated={handleMenuItemCreated}
          />
        )}
      </Modal>
    </div>
  );
};

export default AddMenuForm;
