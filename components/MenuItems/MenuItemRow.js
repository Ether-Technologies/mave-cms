// components/MenuItems/MenuItemRow.js

import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Input,
  Select,
  Button,
  Radio,
  Popconfirm,
  message,
  Checkbox,
  Tooltip,
} from "antd";
import {
  SyncOutlined,
  EditOutlined,
  DeleteOutlined,
  CloseCircleOutlined,
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
    <Row className="border-b py-2 items-center">
      <Col xs={2} md={1}>
        <Checkbox checked={isSelected} onChange={handleCheckboxChange} />
      </Col>
      <Col xs={8} md={4}>
        {isEditing ? (
          <Input
            value={editedTitleEn}
            onChange={(e) => setEditedTitleEn(e.target.value)}
            className="w-11/12"
            placeholder="Item Name"
          />
        ) : (
          <p>{menuItem.title}</p>
        )}
      </Col>
      <Col xs={8} md={4}>
        {isEditing ? (
          <Input
            value={editedTitleBn}
            onChange={(e) => setEditedTitleBn(e.target.value)}
            className="w-11/12"
            placeholder="আইটেম নাম"
          />
        ) : (
          <p>{menuItem.title_bn || "N/A"}</p>
        )}
      </Col>
      <Col xs={8} md={4}>
        {isEditing && allMenuItems ? (
          <Select
            showSearch
            placeholder="Select a Parent Menu"
            optionFilterProp="children"
            onChange={(value) => setEditedParentId(value)}
            className="w-11/12"
            allowClear
            // value={editedParentId || undefined}
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
          <p>{getParentTitle(menuItem.parent_id)}</p>
        )}
      </Col>
      <Col xs={8} md={4}>
        {isEditing ? (
          <>
            <Radio.Group
              onChange={(e) => setLinkType(e.target.value)}
              value={linkType}
            >
              <Radio value="independent">Independent</Radio>
              <Radio value="page">Page</Radio>
            </Radio.Group>
            {linkType === "page" ? (
              <Select
                showSearch
                placeholder="Select a page"
                optionFilterProp="children"
                onChange={(value) => setEditedLink(value)}
                className="w-11/12 mt-2"
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
                className="mt-2 w-11/12"
                placeholder="Enter custom link"
              />
            )}
          </>
        ) : (
          <Tooltip title={menuItem.link}>
            <p className="text-theme underline">
              {menuItem.link.length > 30
                ? menuItem.link.slice(0, 30) + "..."
                : menuItem.link}
            </p>
          </Tooltip>
        )}
      </Col>
      <Col xs={24} md={6} className="flex gap-2 mt-2 md:mt-0">
        {isEditing ? (
          <>
            <Button
              icon={<SyncOutlined />}
              onClick={handleUpdate}
              className="mavebutton"
            >
              Update
            </Button>
            <Button
              icon={<CloseCircleOutlined />}
              onClick={() => setEditingItemId(null)}
              danger
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button
              icon={<EditOutlined />}
              onClick={() => setEditingItemId(menuItem.id)}
              className="mavebutton"
            >
              Edit
            </Button>
            <Popconfirm
              title="Are you sure you want to delete this menu item?"
              onConfirm={handleDelete}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button danger icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Popconfirm>
          </>
        )}
      </Col>
    </Row>
  );
};

export default MenuItemRow;
