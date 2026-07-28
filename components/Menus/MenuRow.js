// components/Menus/MenuRow.js

import React, { useState } from "react";
import {
  Input,
  Select,
  Button,
  Popconfirm,
  message,
  Checkbox,
  Tag,
  Tooltip,
  Badge,
} from "antd";
import {
  SyncOutlined,
  EditOutlined,
  DeleteOutlined,
  CloseCircleOutlined,
  MenuOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import instance from "../../axios";

const MenuRow = ({
  menu,
  menuItems,
  setMenus,
  editingMenuId,
  setEditingMenuId,
  selectedMenuIds,
  setSelectedMenuIds,
  index,
}) => {
  const [editedMenuName, setEditedMenuName] = useState(menu.name);
  const [editedMenuItemsIds, setEditedMenuItemsIds] = useState(
    menu.menu_items?.map((item) => item.id) || []
  );
  const [showAllItems, setShowAllItems] = useState(false);

  const handleUpdate = async () => {
    try {
      const updatedMenu = {
        name: editedMenuName,
        menu_item_ids: editedMenuItemsIds,
      };
      const response = await instance.put(`/menus/${menu.id}`, updatedMenu);
      if (response.status === 200) {
        message.success("Menu updated successfully");
        setMenus((prevMenus) =>
          prevMenus?.map((item) =>
            item.id === menu.id ? { ...item, ...updatedMenu } : item
          )
        );
        setEditingMenuId(null);
      } else {
        message.error("Error updating menu");
      }
    } catch (error) {
      message.error("Error updating menu");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await instance.delete(`/menus/${menu.id}`);
      if (response.status === 200) {
        message.success("Menu deleted successfully");
        setMenus((prevMenus) =>
          prevMenus.filter((item) => item.id !== menu.id)
        );
      } else {
        message.error("Error deleting menu");
      }
    } catch (error) {
      message.error("Error deleting menu");
    }
  };

  const isEditing = editingMenuId === menu.id;

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    if (checked) {
      setSelectedMenuIds([...selectedMenuIds, menu.id]);
    } else {
      setSelectedMenuIds(selectedMenuIds.filter((id) => id !== menu.id));
    }
  };

  const isSelected = selectedMenuIds.includes(menu.id);
  const menuItemsCount = menu.menu_items?.length || 0;
  const displayedItems = showAllItems
    ? menu.menu_items
    : menu.menu_items?.slice(0, 3);

  return (
    <div
      className={`
        bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md border-2 
        transition-all duration-300 hover:shadow-xl
        ${isSelected ? 'border-gray-300 ring-2 ring-gray-300' : 'border-gray-200 hover:border-gray-300'}
        ${isEditing ? 'ring-2 ring-gray-400 border-gray-300' : ''}
      `}
    >
      <div className="p-4">
        <div className="grid grid-cols-12 gap-4 items-center">
          {/* Checkbox */}
          <div className="col-span-1 flex items-center justify-center">
            <Checkbox
              checked={isSelected}
              onChange={handleCheckboxChange}
              className="transform scale-110"
            />
          </div>

          {/* Menu Name */}
          <div className="col-span-4">
            {isEditing ? (
              <Input
                value={editedMenuName}
                onChange={(e) => setEditedMenuName(e.target.value)}
                className="w-full h-10 border-2 border-gray-200 rounded-lg hover:border-gray-400 focus:border-black transition-all"
                placeholder="Menu name"
                prefix={<MenuOutlined className="text-gray-400" />}
              />
            ) : (
              <div className="flex items-center gap-2">
                <MenuOutlined className="text-black" />
                <span className="font-semibold text-gray-800 truncate">
                  {menu.name}
                </span>
              </div>
            )}
          </div>

          {/* Menu Items */}
          <div className="col-span-4">
            {isEditing ? (
              <Select
                allowClear
                showSearch
                mode="multiple"
                placeholder="Select menu items"
                value={editedMenuItemsIds}
                onChange={(values) => setEditedMenuItemsIds(values)}
                className="w-full [&_.ant-select-selector]:min-h-[40px] [&_.ant-select-selector]:border-2 [&_.ant-select-selector]:border-gray-200 [&_.ant-select-selector]:rounded-lg hover:[&_.ant-select-selector]:border-gray-300"
                optionFilterProp="children"
                maxTagCount="responsive"
              >
                {menuItems?.map((menuItem) => (
                  <Select.Option key={menuItem.id} value={menuItem.id}>
                    {menuItem.title}
                  </Select.Option>
                ))}
              </Select>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Badge
                    count={menuItemsCount}
                    className="mave-item-count-badge"
                    showZero
                  />
                  <span className="text-xs text-gray-500 font-medium">
                    {menuItemsCount === 1 ? 'item' : 'items'}
                  </span>
                </div>
                {menuItemsCount > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {displayedItems?.map((menuItem) => (
                      <Tag
                        key={menuItem.id}
                        className="mave-tag-pill text-xs px-2.5 py-0.5"
                      >
                        {menuItem.title}
                      </Tag>
                    ))}
                    {menuItemsCount > 3 && !showAllItems && (
                      <Button
                        type="link"
                        size="small"
                        onClick={() => setShowAllItems(true)}
                        className="text-gray-700 hover:text-gray-700 font-medium text-xs px-2"
                      >
                        +{menuItemsCount - 3} more
                      </Button>
                    )}
                    {showAllItems && menuItemsCount > 3 && (
                      <Button
                        type="link"
                        size="small"
                        onClick={() => setShowAllItems(false)}
                        className="text-gray-700 hover:text-gray-700 font-medium text-xs px-2"
                      >
                        Show less
                      </Button>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-gray-400 italic">No items</span>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="col-span-3 flex gap-2 justify-end">
            {isEditing ? (
              <>
                <Tooltip title="Save changes">
                  <Button
                    icon={<CheckCircleOutlined />}
                    onClick={handleUpdate}
                    className="h-10 px-4 bg-gradient-to-r from-gray-600 to-emerald-500 hover:from-gray-600 hover:to-emerald-600 text-white border-0 font-semibold shadow-md hover:shadow-lg transition-all rounded-lg"
                  >
                    Update
                  </Button>
                </Tooltip>
                <Tooltip title="Cancel editing">
                  <Button
                    icon={<CloseCircleOutlined />}
                    onClick={() => setEditingMenuId(null)}
                    className="h-10 px-4 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white border-0 font-semibold shadow-md hover:shadow-lg transition-all rounded-lg"
                  >
                    Cancel
                  </Button>
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip title="Edit menu">
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => setEditingMenuId(menu.id)}
                    className="h-10 px-4 bg-black hover:bg-gray-800 text-white border-0 font-semibold shadow-md hover:shadow-lg transition-all rounded-lg"
                  >
                    Edit
                  </Button>
                </Tooltip>
                <Popconfirm
                  title="Delete Menu"
                  description="Are you sure you want to delete this menu?"
                  onConfirm={handleDelete}
                  okText="Yes, Delete"
                  cancelText="Cancel"
                  okButtonProps={{
                    danger: true,
                    className: "bg-gray-200 hover:bg-gray-200 border-gray-400"
                  }}
                >
                  <Tooltip title="Delete menu">
                    <Button
                      icon={<DeleteOutlined />}
                      className="h-10 px-4 mave-delete-button"
                    >
                      Delete
                    </Button>
                  </Tooltip>
                </Popconfirm>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuRow;
