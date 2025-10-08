// components/PageBuilder/Modals/AccordionSelectionModal/AccordionSelectionModal.jsx

import React, { useState, useEffect } from "react";
import {
  Drawer,
  Form,
  Input,
  Button,
  Space,
  Select,
  ColorPicker,
  Collapse,
} from "antd";
import {
  PlusOutlined,
  MinusOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import RichTextEditor from "../../../RichTextEditor";

const { Option } = Select;
const { Panel } = Collapse;

const AccordionSelectionModal = ({
  isVisible,
  onClose,
  onSelectAccordion,
  initialData = [],
}) => {
  const [form] = Form.useForm();
  const [accordionItems, setAccordionItems] = useState(initialData);
  const [showStyleConfig, setShowStyleConfig] = useState({});
  const [contentTypes, setContentTypes] = useState({});

  useEffect(() => {
    setAccordionItems(initialData);
    // Initialize showStyleConfig for each item
    const initialStyleConfig = {};
    const initialContentTypes = {};
    initialData.forEach((item, index) => {
      initialStyleConfig[index] = false;
      initialContentTypes[index] = item.contentType || "text";
    });
    setShowStyleConfig(initialStyleConfig);
    setContentTypes(initialContentTypes);
  }, [initialData]);

  const handleAddItem = () => {
    const newItem = {
      title: "",
      altTitle: "",
      content: "",
      altContent: "",
      contentType: "text",
      tags: [],
      style: {
        headerBg: "#ffffff",
        headerTextColor: "#000000",
        contentBg: "#ffffff",
        contentTextColor: "#000000",
        borderColor: "#e5e7eb",
        borderRadius: "8px",
      },
    };
    setAccordionItems([...accordionItems, newItem]);
    setShowStyleConfig({ ...showStyleConfig, [accordionItems.length]: false });
    setContentTypes({ ...contentTypes, [accordionItems.length]: "text" });
  };

  const handleRemoveItem = (index) => {
    const newItems = [...accordionItems];
    newItems.splice(index, 1);
    setAccordionItems(newItems);
    const newStyleConfig = { ...showStyleConfig };
    delete newStyleConfig[index];
    setShowStyleConfig(newStyleConfig);
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const updatedItems = accordionItems.map((item, index) => ({
        ...item,
        title: values[`title_${index}`],
        altTitle: values[`altTitle_${index}`] || "",
        content: item.content, // Keep the current content from RichTextEditor
        altContent: item.altContent || "", // Keep the current altContent from RichTextEditor
        contentType: values[`contentType_${index}`],
        tags: item.tags || [], // Keep the current tags
        style: {
          headerBg: values[`headerBg_${index}`] || "#ffffff",
          headerTextColor: values[`headerTextColor_${index}`] || "#000000",
          contentBg: values[`contentBg_${index}`] || "#ffffff",
          contentTextColor: values[`contentTextColor_${index}`] || "#000000",
          borderColor: values[`borderColor_${index}`] || "#e5e7eb",
          borderRadius: values[`borderRadius_${index}`] || "8px",
        },
      }));
      onSelectAccordion(updatedItems);
    });
  };

  const handleContentChange = (content, index) => {
    const newItems = accordionItems.map((item, i) => {
      if (i === index) {
        return { ...item, content };
      }
      return item;
    });
    setAccordionItems(newItems);
  };

  const handleAltContentChange = (content, index) => {
    const newItems = accordionItems.map((item, i) => {
      if (i === index) {
        return { ...item, altContent: content };
      }
      return item;
    });
    setAccordionItems(newItems);
  };

  const handleTagsChange = (tags, index) => {
    const newItems = accordionItems.map((item, i) => {
      if (i === index) {
        return { ...item, tags };
      }
      return item;
    });
    setAccordionItems(newItems);
  };

  const handleContentTypeChange = (value, index) => {
    setContentTypes({ ...contentTypes, [index]: value });
  };

  const toggleStyleConfig = (index) => {
    setShowStyleConfig({
      ...showStyleConfig,
      [index]: !showStyleConfig[index],
    });
  };

  return (
    <Drawer
      title="Configure Accordion"
      placement="right"
      width={800}
      onClose={onClose}
      open={isVisible}
      extra={
        <Space>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={handleSubmit}>
            Save
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical">
        {accordionItems.map((item, index) => (
          <div
            key={index}
            className="mb-6 p-4 border border-gray-200 rounded-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Item {index + 1}</h3>
              <Space>
                <Button
                  type="text"
                  icon={<SettingOutlined />}
                  onClick={() => toggleStyleConfig(index)}
                >
                  Advanced
                </Button>
                <Button
                  icon={<MinusOutlined />}
                  onClick={() => handleRemoveItem(index)}
                  danger
                  type="text"
                />
              </Space>
            </div>

            <Form.Item
              label="Title"
              name={`title_${index}`}
              initialValue={item.title}
              rules={[{ required: true, message: "Please enter a title" }]}
            >
              <Input placeholder="Enter title" />
            </Form.Item>

            <Form.Item
              label="Alternative Title"
              name={`altTitle_${index}`}
              initialValue={item.altTitle || ""}
            >
              <Input placeholder="Enter alternative title (optional)" />
            </Form.Item>

            <Form.Item
              label="Content Type"
              name={`contentType_${index}`}
              initialValue={item.contentType}
            >
              <Select
                onChange={(value) => handleContentTypeChange(value, index)}
              >
                <Option value="text">Text</Option>
                <Option value="tags">Tags</Option>
                <Option value="accordion">Nested Accordion</Option>
              </Select>
            </Form.Item>

            {contentTypes[index] === "tags" ? (
              <Form.Item label="Tags">
                <Select
                  mode="tags"
                  value={item.tags || []}
                  onChange={(value) => handleTagsChange(value, index)}
                  placeholder="Enter tags (press Enter to add)"
                  allowClear
                  size="large"
                  showSearch
                  style={{ width: "100%" }}
                >
                  {(item.tags || []).map((tag) => (
                    <Option key={tag} value={tag}>
                      {tag}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            ) : (
              <>
                <Form.Item label="Content">
                  <RichTextEditor
                    defaultValue={item.content}
                    onChange={(content) => handleContentChange(content, index)}
                    editMode={true}
                  />
                </Form.Item>

                <Form.Item label="Alternative Content">
                  <RichTextEditor
                    defaultValue={item.altContent || ""}
                    onChange={(content) =>
                      handleAltContentChange(content, index)
                    }
                    editMode={true}
                  />
                </Form.Item>
              </>
            )}

            {showStyleConfig[index] && (
              <div className="mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <Form.Item
                    label="Header Background"
                    name={`headerBg_${index}`}
                    initialValue={item.style?.headerBg}
                  >
                    <ColorPicker />
                  </Form.Item>

                  <Form.Item
                    label="Header Text Color"
                    name={`headerTextColor_${index}`}
                    initialValue={item.style?.headerTextColor}
                  >
                    <ColorPicker />
                  </Form.Item>

                  <Form.Item
                    label="Content Background"
                    name={`contentBg_${index}`}
                    initialValue={item.style?.contentBg}
                  >
                    <ColorPicker />
                  </Form.Item>

                  <Form.Item
                    label="Content Text Color"
                    name={`contentTextColor_${index}`}
                    initialValue={item.style?.contentTextColor}
                  >
                    <ColorPicker />
                  </Form.Item>

                  <Form.Item
                    label="Border Color"
                    name={`borderColor_${index}`}
                    initialValue={item.style?.borderColor}
                  >
                    <ColorPicker />
                  </Form.Item>

                  <Form.Item
                    label="Border Radius"
                    name={`borderRadius_${index}`}
                    initialValue={item.style?.borderRadius}
                  >
                    <Select>
                      <Option value="0px">None</Option>
                      <Option value="4px">Small</Option>
                      <Option value="8px">Medium</Option>
                      <Option value="12px">Large</Option>
                      <Option value="16px">Extra Large</Option>
                    </Select>
                  </Form.Item>
                </div>
              </div>
            )}
          </div>
        ))}

        <Button
          type="dashed"
          onClick={handleAddItem}
          block
          icon={<PlusOutlined />}
          className="mt-4"
        >
          Add Item
        </Button>
      </Form>
    </Drawer>
  );
};

export default AccordionSelectionModal;
