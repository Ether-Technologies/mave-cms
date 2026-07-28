// components/MenuItems/MenuItemRow.js

import React, { useState, useEffect } from "react";
import {
  Input,
  Select,
  Button,
  Radio,
  Popconfirm,
  message,
  Checkbox,
  Tooltip,
  Tag,
  Badge,
} from "antd";
import {
  SyncOutlined,
  EditOutlined,
  DeleteOutlined,
  CloseCircleOutlined,
  MenuOutlined,
  LinkOutlined,
  CheckCircleOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import instance from "../../axios";

const { Option } = Select;

const MenuItemRow = ({
  menuItem,
  menuItems,
  allMenuItems,
  pages,
  setMenuItems,
  editingItemId,
  setEditingItemId,
  selectedItemIds,
  setSelectedItemIds,
  index,
}) => {
  const [editedTitleEn, setEditedTitleEn] = useState(menuItem.title);
  const [editedTitleBn, setEditedTitleBn] = useState(menuItem.title_bn);
  const [editedLink, setEditedLink] = useState(menuItem.link);
  const [linkType, setLinkType] = useState(
    menuItem.link && menuItem.link.startsWith("/") ? "page" : "independent"
  );
  const [editedParentId, setEditedParentId] = useState(menuItem.parent_id);

  useEffect(() => {
    if (editingItemId === menuItem.id) {
      setEditedTitleEn(menuItem.title);
      setEditedTitleBn(menuItem.title_bn);
      setEditedLink(menuItem.link);
      setLinkType(
        menuItem.link && menuItem.link.startsWith("/") ? "page" : "independent"
      );
      setEditedParentId(menuItem.parent_id);
    }
  }, [editingItemId, menuItem]);

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "");
  };

  const generateFullLink = (page) => {
    const parentPaths = [];
    let currentParentId = editedParentId;

    // Build the parent path slugs
    while (currentParentId) {
      const parentMenuItem = allMenuItems?.find(
        (item) => item.id === parseInt(currentParentId)
      );
      if (parentMenuItem) {
        const slug = generateSlug(parentMenuItem.title);
        parentPaths.unshift(slug);
        currentParentId = parseInt(parentMenuItem.parent_id);
      } else {
        break;
      }
    }

    // Get the current menu item's slug
    const currentMenuItemSlug = generateSlug(editedTitleEn);

    // Build the full path
    const fullPath = `/${[...parentPaths, currentMenuItemSlug].join("/")}`;

    // Build the query parameters
    const pageId = page ? page.id : "";
    const pageName = page ? generateSlug(page.page_name_en) : "";

    const queryParams = page ? `?pageId=${pageId}&pageName=${pageName}` : "";

    return fullPath + queryParams;
  };

  const handleUpdate = async () => {
    try {
      let fullLink = editedLink;

      if (linkType === "page") {
        const selectedPage = pages.find((page) => page.slug === editedLink);
        fullLink = generateFullLink(selectedPage);
      }

      const updatedMenuItem = {
        ...menuItem,
        title: editedTitleEn || menuItem.title,
        title_bn: editedTitleBn || menuItem.title_bn,
        parent_id: editedParentId || null,
        link: fullLink || menuItem.link,
      };

      const response = await instance.put(
        `/menuitems/${menuItem.id}`,
        updatedMenuItem
      );
      if (response.status === 200) {
        message.success("Menu item updated successfully");
        setMenuItems((prevMenuItems) =>
          prevMenuItems.map((item) =>
            item.id === menuItem.id ? response.data : item
          )
        );
        setEditingItemId(null);
      } else {
        message.error("Error updating menu item");
      }
    } catch (error) {
      message.error("Error updating menu item");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await instance.delete(`/menuitems/${menuItem.id}`);
      if (response.status === 200) {
        message.success("Menu item deleted successfully");
        setMenuItems((prevMenuItems) =>
          prevMenuItems.filter((item) => item.id !== menuItem.id)
        );
      } else {
        message.error("Error deleting menu item");
      }
    } catch (error) {
      message.error("Error deleting menu item");
    }
  };

  const isEditing = editingItemId === menuItem.id;

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    setSelectedItemIds((prevSelectedItemIds) => {
      if (checked) {
        return [...prevSelectedItemIds, menuItem.id];
      } else {
        return prevSelectedItemIds.filter((id) => id !== menuItem.id);
      }
    });
  };

  const isSelected = selectedItemIds.includes(menuItem.id);

  const getParentTitle = (parentId) => {
    // parentId is string. Convert it to number
    parentId = parseInt(parentId);
    const parentMenuItem = allMenuItems.find((item) => item.id === parentId);
    return parentMenuItem ? parentMenuItem.title : "No Parent";
  };

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

          {/* Item Name (English) */}
          <div className="col-span-2">
            {isEditing ? (
              <Input
                value={editedTitleEn}
                onChange={(e) => setEditedTitleEn(e.target.value)}
                className="w-full h-10 border-2 border-gray-200 rounded-lg hover:border-gray-400 focus:border-black transition-all"
                placeholder="Item Name"
                prefix={<MenuOutlined className="text-gray-400" />}
              />
            ) : (
              <div className="flex items-center gap-2">
                <MenuOutlined className="text-black" />
                <span className="font-semibold text-gray-800 truncate">
                  {menuItem.title}
                </span>
              </div>
            )}
          </div>

          {/* Item Name (Bengali) */}
          <div className="col-span-2">
            {isEditing ? (
              <Input
                value={editedTitleBn}
                onChange={(e) => setEditedTitleBn(e.target.value)}
                className="w-full h-10 border-2 border-gray-200 rounded-lg hover:border-gray-400 focus:border-black transition-all"
                placeholder="আইটেম নাম"
                prefix={<GlobalOutlined className="text-gray-400" />}
              />
            ) : (
              <div className="flex items-center gap-2">
                <GlobalOutlined className="text-gray-800" />
                <span className="font-medium text-gray-700 truncate">
                  {menuItem.title_bn || <span className="text-gray-400 italic">N/A</span>}
                </span>
              </div>
            )}
          </div>

          {/* Parent Menu */}
          <div className="col-span-2">
            {isEditing && allMenuItems ? (
              <Select
                showSearch
                placeholder="Select a Parent Menu"
                optionFilterProp="children"
                onChange={(value) => setEditedParentId(value)}
                className="w-full [&_.ant-select-selector]:h-10 [&_.ant-select-selector]:border-2 [&_.ant-select-selector]:border-gray-200 [&_.ant-select-selector]:rounded-lg hover:[&_.ant-select-selector]:border-gray-300"
                allowClear
                value={getParentTitle(editedParentId)}
              >
                <Option value={null}>No Parent</Option>
                {allMenuItems
                  .filter((item) => item.id !== menuItem.id)
                  .map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.title}
                    </Option>
                  ))}
              </Select>
            ) : (
              <Tag className="mave-tag-pill font-medium px-3 py-1">
                {getParentTitle(menuItem.parent_id)}
              </Tag>
            )}
          </div>

          {/* Item Link */}
          <div className="col-span-2">
            {isEditing ? (
              <div className="space-y-2">
                <Radio.Group
                  onChange={(e) => setLinkType(e.target.value)}
                  value={linkType}
                  className="flex gap-2"
                >
                  <Radio value="independent" className="text-xs">Independent</Radio>
                  <Radio value="page" className="text-xs">Page</Radio>
                </Radio.Group>
                {linkType === "page" ? (
                  <Select
                    showSearch
                    placeholder="Select a page"
                    optionFilterProp="children"
                    onChange={(value) => setEditedLink(value)}
                    className="w-full [&_.ant-select-selector]:h-10 [&_.ant-select-selector]:border-2 [&_.ant-select-selector]:border-gray-200 [&_.ant-select-selector]:rounded-lg hover:[&_.ant-select-selector]:border-gray-300"
                    value={editedLink || undefined}
                  >
                    {pages.map((page) => (
                      <Option key={page.id} value={page.slug}>
                        {page.page_name_en}
                      </Option>
                    ))}
                  </Select>
                ) : (
                  <Input
                    value={editedLink}
                    onChange={(e) => setEditedLink(e.target.value)}
                    className="w-full h-10 border-2 border-gray-200 rounded-lg hover:border-gray-400 focus:border-black transition-all"
                    placeholder="Enter custom link"
                    prefix={<LinkOutlined className="text-gray-400" />}
                  />
                )}
              </div>
            ) : (
              <Tooltip title={menuItem.link}>
                <div className="flex items-center gap-2">
                  <LinkOutlined className="text-gray-800 text-xs" />
                  <a
                    href={menuItem.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-800 hover:text-gray-800 underline text-sm truncate font-medium"
                  >
                    {menuItem.link.length > 25
                      ? menuItem.link.slice(0, 25) + "..."
                      : menuItem.link}
                  </a>
                </div>
              </Tooltip>
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
                    onClick={() => setEditingItemId(null)}
                    className="h-10 px-4 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white border-0 font-semibold shadow-md hover:shadow-lg transition-all rounded-lg"
                  >
                    Cancel
                  </Button>
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip title="Edit menu item">
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => setEditingItemId(menuItem.id)}
                    className="h-10 px-4 bg-black hover:bg-gray-800 text-white border-0 font-semibold shadow-md hover:shadow-lg transition-all rounded-lg"
                  >
                    Edit
                  </Button>
                </Tooltip>
                <Popconfirm
                  title="Delete Menu Item"
                  description="Are you sure you want to delete this menu item?"
                  onConfirm={handleDelete}
                  okText="Yes, Delete"
                  cancelText="Cancel"
                  okButtonProps={{
                    danger: true,
                    className: "bg-gray-200 hover:bg-gray-200 border-gray-400",
                  }}
                >
                  <Tooltip title="Delete menu item">
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

export default MenuItemRow;
