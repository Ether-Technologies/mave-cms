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

const AddMenuItemForm = ({
  pages = [],
  menuItems = [],
  onCancel,
  fetchMenuItems,
  onMenuItemCreated,
}) => {
  const [newMenuItemTitle, setNewMenuItemTitle] = useState("");
  const [newMenuItemTitleBn, setNewMenuItemTitleBn] = useState("");
  const [newMenuItemLink, setNewMenuItemLink] = useState("");
  const [linkType, setLinkType] = useState("independent");
  const [newParentId, setNewParentId] = useState(null);

  const generateSlug = (text) =>
    text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]+/g, "");

  // Build parent paths recursively
  const buildParentPath = (parentId) => {
    const slugs = [];
    let currentId = parentId;
    while (currentId) {
      const parent = menuItems.find((item) => item.id === currentId);
      if (!parent) break;
      slugs.unshift(generateSlug(parent.title));
      currentId = parent.parent_id;
    }
    return slugs;
  };

  const handleAddMenuItem = async () => {
    if (!newMenuItemTitle.trim()) {
      message.error("Please provide a valid Menu Item Title.");
      return;
    }
    // Decide how to build the link
    let fullLink = "/";
    if (linkType === "page") {
      const selectedPage = pages.find((p) => p.slug === newMenuItemLink);
      // Build path + query
      const slugs = buildParentPath(newParentId);
      slugs.push(generateSlug(newMenuItemTitle));
      const pageId = selectedPage ? selectedPage.id : "";
      const pageName = selectedPage
        ? generateSlug(selectedPage.page_name_en)
        : "";
      fullLink = `/${slugs.join("/")}${pageId ? `?pageId=${pageId}&pageName=${pageName}` : ""}`;
    } else {
      // Independent link
      const slugs = buildParentPath(newParentId);
      slugs.push(generateSlug(newMenuItemTitle));
      fullLink = `/${slugs.join("/")}`;
    }

    const payload = [
      {
        title: newMenuItemTitle || "N/A",
        title_bn: newMenuItemTitleBn || "N/A",
        parent_id: newParentId || null,
        link:
          linkType === "independent" && newMenuItemLink?.trim()
            ? newMenuItemLink.trim()
            : fullLink,
      },
    ];

    try {
      const res = await instance.post("/menuitems", payload);
      if (res.status === 201) {
        const created = Array.isArray(res.data)
          ? res.data
          : res.data
            ? [res.data]
            : [];
        message.success("Menu item added successfully");
        await fetchMenuItems?.();
        onMenuItemCreated?.(created);
        onCancel();
      } else {
        message.error("Error adding menu item");
      }
    } catch (error) {
      const apiMessage =
        error?.response?.data?.message ||
        (error?.response?.data?.errors &&
          Object.values(error.response.data.errors).flat().join(" "));
      message.error(apiMessage || "Error adding menu item");
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
            <Option value={undefined}>No Parent</Option>
            {(Array.isArray(menuItems) ? menuItems : []).map((m) => (
              <Option key={m.id} value={m.id}>
                {m.title}
              </Option>
            ))}
          </Select>
        </Col>

        <Col xs={24} md={12}>
          <div className="flex justify-between">
            <Typography.Title level={5}>Item Link</Typography.Title>
            <Radio.Group
              value={linkType}
              onChange={(e) => setLinkType(e.target.value)}
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
              {(Array.isArray(pages) ? pages : []).map((p) => (
                <Option key={p.id} value={p.slug}>
                  {p.page_name_en}
                </Option>
              ))}
            </Select>
          ) : (
            <Input
              placeholder="Menu Item Link (leave empty to auto-generate)"
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
