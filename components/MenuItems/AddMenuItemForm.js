// components/MenuItems/AddMenuItemForm.js

import React, { useState } from "react";
import {
  Row,
  Col,
  Input,
  Select,
  Button,
  Radio,
  message,
  Typography,
} from "antd";
import { PlusCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import instance from "../../axios";

const { Option } = Select;

const AddMenuItemForm = ({ pages, menuItems, onCancel, fetchMenuItems }) => {
  const [newMenuItemTitle, setNewMenuItemTitle] = useState("");
  const [newMenuItemTitleBn, setNewMenuItemTitleBn] = useState("");
  const [newMenuItemLink, setNewMenuItemLink] = useState("");
  const [linkType, setLinkType] = useState("independent");
  const [newParentId, setNewParentId] = useState(null);

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "");
  };

  const generateFullLink = (page) => {
    const parentPaths = [];
    let currentParentId = newParentId;

    // Build the parent path slugs
    while (currentParentId) {
      const parentMenuItem = menuItems.find(
        (item) => item.id === currentParentId
      );
      if (parentMenuItem) {
        const slug = generateSlug(parentMenuItem.title);
        parentPaths.unshift(slug);
        currentParentId = parentMenuItem.parent_id;
      } else {
        break;
      }
    }

    // Get the current menu item's slug
    const currentMenuItemSlug = generateSlug(newMenuItemTitle);

    // Build the full path
    const fullPath = `/${[...parentPaths, currentMenuItemSlug].join("/")}`;

    // Build the query parameters
    const pageId = page ? page.id : "";
    const pageName = page ? generateSlug(page.page_name_en) : "";

    const queryParams = page ? `?pageId=${pageId}&pageName=${pageName}` : "";

    return fullPath + queryParams;
  };

  const handleAddMenuItem = async () => {
    try {
      let fullLink = newMenuItemLink ? newMenuItemLink : "/";

      if (linkType === "page") {
        const selectedPage = pages.find(
          (page) => page.slug === newMenuItemLink
        );
        fullLink = generateFullLink(selectedPage);
      } else if (linkType === "independent") {
        // For independent links, include parent paths if any
        const parentPaths = [];
        let currentParentId = newParentId;

        while (currentParentId) {
          const parentMenuItem = menuItems.find(
            (item) => item.id === currentParentId
          );
          if (parentMenuItem) {
            const slug = generateSlug(parentMenuItem.title);
            parentPaths.unshift(slug);
            currentParentId = parentMenuItem.parent_id;
          } else {
            break;
          }
        }

        const currentMenuItemSlug = generateSlug(newMenuItemTitle);
        fullLink = `/${[...parentPaths, currentMenuItemSlug].join("/")}`;
      }

      const newMenuItem = {
        title: newMenuItemTitle || "N/A",
        title_bn: newMenuItemTitleBn || "N/A",
        parent_id: newParentId || null,
        link: fullLink,
      };

      const response = await instance.post("/menuitems", [newMenuItem]);

      if (response.status === 201) {
        message.success("Menu item added successfully");
        fetchMenuItems();
        onCancel();
      } else {
        message.error("Error adding menu item");
      }
    } catch (error) {
      message.error("Error adding menu item");
    }
  };

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Typography.Title level={5}>Item Name</Typography.Title>
          <Input
            placeholder="Menu Item Title"
            value={newMenuItemTitle}
            onChange={(e) => setNewMenuItemTitle(e.target.value)}
          />
        </Col>
        <Col xs={24} md={12}>
          <Typography.Title level={5}>আইটেম নাম</Typography.Title>
          <Input
            placeholder="মেনু আইটেম শিরোনাম"
            value={newMenuItemTitleBn}
            onChange={(e) => setNewMenuItemTitleBn(e.target.value)}
          />
        </Col>
        <Col xs={24} md={12}>
          <Typography.Title level={5}>Parent Menu</Typography.Title>
          <Select
            showSearch
            placeholder="Select a Parent Menu"
            optionFilterProp="children"
            onChange={(value) => setNewParentId(value)}
            className="w-full mt-2"
            allowClear
          >
            <Option value={null}>No Parent</Option>
            {menuItems?.map((menuItem) => (
              <Option key={menuItem.id} value={menuItem.id}>
                {menuItem.title}
              </Option>
            ))}
          </Select>
        </Col>
        <Col xs={24} md={12}>
          <div className="flex justify-between">
            <Typography.Title level={5}>Item Link</Typography.Title>
            <Radio.Group
              onChange={(e) => setLinkType(e.target.value)}
              value={linkType}
            >
              <Radio value="independent">Independent</Radio>
              <Radio value="page">Page</Radio>
            </Radio.Group>
          </div>
          {linkType === "page" ? (
            <Select
              showSearch
              placeholder="Select a page"
              optionFilterProp="children"
              onChange={(value) => setNewMenuItemLink(value)}
              className="w-full mt-2"
            >
              {pages?.map((page) => (
                <Option key={page.id} value={page.slug}>
                  {page.page_name_en}
                </Option>
              ))}
            </Select>
          ) : (
            <Input
              placeholder="Menu Item Link"
              value={newMenuItemLink}
              onChange={(e) => setNewMenuItemLink(e.target.value)}
              className="mt-2"
            />
          )}
        </Col>
      </Row>
      <div className="flex justify-end mt-4 gap-5">
        <Button
          icon={<PlusCircleOutlined />}
          onClick={handleAddMenuItem}
          className="mavebutton"
        >
          Add
        </Button>
        <Button
          icon={<CloseCircleOutlined />}
          onClick={onCancel}
          className="mr-2 bg-gray-500 text-white"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default AddMenuItemForm;
