// components/Menus/AddMenuForm.js

import React, { useState } from "react";
import { Input, Button, message } from "antd";
import { PlusCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import instance from "../../axios";
import SortableMenuItemsPicker from "./SortableMenuItemsPicker";

const AddMenuForm = ({ menuItems, onCancel, fetchMenus }) => {
  const [newMenuName, setNewMenuName] = useState("");
  const [newMenuItemsIds, setNewMenuItemsIds] = useState([]);

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
        fetchMenus();
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
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Menu Items — select and drag to order
        </label>
        <SortableMenuItemsPicker
          menuItems={menuItems}
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
    </div>
  );
};

export default AddMenuForm;
