// components/PageBuilder/Components/AccordionComponent.jsx

import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Typography,
  message,
  Collapse,
  Space,
  Tooltip,
  Input,
  Switch,
  Form,
  Drawer,
  Select,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SettingOutlined,
  CopyFilled,
  CopyOutlined,
} from "@ant-design/icons";
import AccordionSelectionModal from "../Modals/AccordionSelectionModal/AccordionSelectionModal";
import RichTextEditor from "../../RichTextEditor";

const { Panel } = Collapse;
const { Title, Text } = Typography;
const { Option } = Select;

const getColorValue = (colorObj) => {
  if (!colorObj) return "#ffffff";
  if (typeof colorObj === "string") return colorObj;
  if (colorObj.metaColor) {
    const { r, g, b, a } = colorObj.metaColor;
    // Convert RGB to hex
    const toHex = (n) => {
      const hex = Math.round(n).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
  return "#ffffff";
};

const AccordionComponent = ({
  component,
  updateComponent,
  deleteComponent,
  preview = false,
  onDuplicateElement,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [accordionData, setAccordionData] = useState(
    Array.isArray(component._mave) ? component._mave : []
  );
  const [activeKeys, setActiveKeys] = useState([]);
  const [showAltContent, setShowAltContent] = useState(
    component._mave?.showAltContent || false
  );
  const [isEditDrawerVisible, setIsEditDrawerVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isAddDrawerVisible, setIsAddDrawerVisible] = useState(false);
  const [currentContentType, setCurrentContentType] = useState("text");
  const [currentAddContentType, setCurrentAddContentType] = useState("text");
  const [form] = Form.useForm();
  const [addForm] = Form.useForm();

  useEffect(() => {
    setAccordionData(Array.isArray(component._mave) ? component._mave : []);
  }, [component._mave]);

  const handleSelectAccordion = (newAccordionData) => {
    const accordionItems = Array.isArray(newAccordionData)
      ? newAccordionData
      : [];
    updateComponent({
      ...component,
      _mave: accordionItems,
      id: component._id,
    });
    setAccordionData(accordionItems);
    setIsModalVisible(false);
    message.success("Accordion updated successfully");
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "Delete Accordion Component",
      content:
        "Are you sure you want to delete this accordion component? This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: deleteComponent,
    });
  };

  const handleContentChange = (content, index) => {
    const newData = accordionData.map((item, i) => {
      if (i === index) {
        return { ...item, content };
      }
      return item;
    });
    updateComponent({
      ...component,
      _mave: newData,
      id: component._id,
    });
    setAccordionData(newData);
  };

  const handleEditItem = (item, index) => {
    setEditingItem({ ...item, index });
    setCurrentContentType(item.contentType || "text");
    form.setFieldsValue({
      title: item.title,
      altTitle: item.altTitle || "",
      content: item.content,
      altContent: item.altContent || "",
      contentType: item.contentType || "text",
      tags: item.tags || [],
    });
    setIsEditDrawerVisible(true);
  };

  const handleSaveItem = () => {
    form.validateFields().then((values) => {
      const newData = accordionData.map((item, i) => {
        if (i === editingItem.index) {
          return {
            ...item,
            title: values.title,
            altTitle: values.altTitle,
            content: values.content || "",
            altContent: values.altContent || "",
            contentType: values.contentType || item.contentType,
            tags: values.tags || item.tags || [],
          };
        }
        return item;
      });
      updateComponent({
        ...component,
        _mave: newData,
        id: component._id,
      });
      setAccordionData(newData);
      setIsEditDrawerVisible(false);
      setEditingItem(null);
      message.success("Accordion item updated successfully");
    });
  };

  const handleCancelEdit = () => {
    setIsEditDrawerVisible(false);
    setEditingItem(null);
    form.resetFields();
  };

  const handleDuplicateItem = (item, index) => {
    const duplicatedItem = {
      ...item,
      title: `${item.title} (Copy)`,
    };
    const newData = [
      ...accordionData.slice(0, index + 1),
      duplicatedItem,
      ...accordionData.slice(index + 1),
    ];
    updateComponent({
      ...component,
      _mave: newData,
      id: component._id,
    });
    setAccordionData(newData);
    message.success("Accordion item duplicated successfully");
  };

  const handleDeleteItem = (index) => {
    Modal.confirm({
      title: "Delete Accordion Item",
      content: "Are you sure you want to delete this accordion item?",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => {
        const newData = accordionData.filter((_, i) => i !== index);
        updateComponent({
          ...component,
          _mave: newData,
          id: component._id,
        });
        setAccordionData(newData);
        message.success("Accordion item deleted successfully");
      },
    });
  };

  const handleAddNewItem = () => {
    addForm.resetFields();
    setCurrentAddContentType("text");
    setIsAddDrawerVisible(true);
  };

  const handleSaveNewItem = () => {
    addForm.validateFields().then((values) => {
      const newItem = {
        title: values.title,
        altTitle: values.altTitle || "",
        content: values.content || "",
        altContent: values.altContent || "",
        contentType: values.contentType || "text",
        tags: values.tags || [],
        style: {
          headerBg: { metaColor: { r: 249, g: 250, b: 251, a: 1 } },
          headerTextColor: { metaColor: { r: 17, g: 24, b: 39, a: 1 } },
          contentBg: { metaColor: { r: 255, g: 255, b: 255, a: 1 } },
          contentTextColor: { metaColor: { r: 55, g: 65, b: 81, a: 1 } },
          borderColor: { metaColor: { r: 229, g: 231, b: 235, a: 1 } },
          borderRadius: "8px",
        },
      };
      const newData = [...accordionData, newItem];
      updateComponent({
        ...component,
        _mave: newData,
        id: component._id,
      });
      setAccordionData(newData);
      setIsAddDrawerVisible(false);
      addForm.resetFields();
      message.success("Accordion item added successfully");
    });
  };

  const handleCancelAdd = () => {
    setIsAddDrawerVisible(false);
    addForm.resetFields();
  };

  const renderPanels = (data) => {
    if (!Array.isArray(data)) return null;
    return data.map((item, index) => {
      const headerBg = getColorValue(item.style?.headerBg);
      const headerTextColor = getColorValue(item.style?.headerTextColor);
      const contentBg = getColorValue(item.style?.contentBg);
      const contentTextColor = getColorValue(item.style?.contentTextColor);
      const borderColor = getColorValue(item.style?.borderColor);
      const borderRadius = item.style?.borderRadius || "8px";

      const displayTitle =
        showAltContent && item.altTitle ? item.altTitle : item.title;
      const displayContent =
        showAltContent && item.altContent ? item.altContent : item.content;

      return (
        <Panel
          header={
            <div className="flex items-center justify-between w-full">
              <div
                className="flex-1"
                style={{
                  backgroundColor: headerBg,
                  color: headerTextColor,
                  padding: "12px 16px",
                  borderRadius: borderRadius,
                  border: `1px solid ${borderColor}`,
                }}
              >
                <Text strong className="text-lg">
                  {displayTitle}
                </Text>
              </div>
              {!preview && (
                <div className="ml-2 flex gap-1">
                  <Tooltip title="Edit Item">
                    <Button
                      type="text"
                      icon={<SettingOutlined />}
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditItem(item, index);
                      }}
                      style={{ color: headerTextColor }}
                    />
                  </Tooltip>
                  <Tooltip title="Duplicate Item">
                    <Button
                      type="text"
                      icon={<CopyOutlined />}
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicateItem(item, index);
                      }}
                      style={{ color: headerTextColor }}
                    />
                  </Tooltip>
                  <Tooltip title="Delete Item">
                    <Button
                      type="text"
                      icon={<DeleteOutlined />}
                      size="small"
                      danger
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteItem(index);
                      }}
                    />
                  </Tooltip>
                </div>
              )}
            </div>
          }
          key={index}
          forceRender
          className="mb-2"
          style={{
            backgroundColor: contentBg,
            color: contentTextColor,
            borderRadius: borderRadius,
            border: `1px solid ${borderColor}`,
          }}
        >
          <div className="pl-4">
            {item.contentType === "text" ? (
              <div className="accordion-content">
                <RichTextEditor
                  defaultValue={displayContent}
                  onChange={(content) => handleContentChange(content, index)}
                  editMode={!preview}
                />
              </div>
            ) : item.contentType === "tags" ? (
              <div className="flex flex-wrap gap-2 py-2">
                {(item.tags || []).map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
                {(!item.tags || item.tags.length === 0) && (
                  <span className="text-gray-400 italic">No tags added</span>
                )}
              </div>
            ) : item.contentType === "accordion" ? (
              <AccordionComponent
                component={{ _mave: item.nestedAccordion }}
                updateComponent={(updatedNested) => {
                  const newData = [...accordionData];
                  newData[index].nestedAccordion = updatedNested._mave;
                  updateComponent({ ...component, _mave: newData });
                }}
                deleteComponent={() => {
                  const newData = [
                    ...accordionData.slice(0, index),
                    ...accordionData.slice(index + 1),
                  ];
                  updateComponent({ ...component, _mave: newData });
                }}
                preview={preview}
              />
            ) : null}
          </div>
        </Panel>
      );
    });
  };

  if (preview) {
    return (
      <div className="preview-accordion-component p-6 bg-white rounded-lg shadow-sm">
        <Collapse
          accordion
          activeKey={activeKeys}
          onChange={(key) => setActiveKeys([key])}
          className="accordion-collapse"
          expandIconPosition="right"
          bordered={false}
        >
          {renderPanels(accordionData)}
        </Collapse>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 p-6 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Header with Component Title and Action Buttons */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={4} className="mb-1">
            Accordion Component
          </Title>
          <Text type="secondary" className="text-sm">
            {accordionData.length}{" "}
            {accordionData.length === 1 ? "item" : "items"}
          </Text>
        </div>
        <Space>
          <Tooltip title="Add New Item">
            <Button
              icon={<PlusOutlined />}
              onClick={handleAddNewItem}
              className="mavebutton"
              disabled={preview}
            >
              Add Item
            </Button>
          </Tooltip>
          <Tooltip title="Edit All Items">
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => setIsModalVisible(true)}
              className="flex items-center mavebutton"
              disabled={preview}
            >
              Edit
            </Button>
          </Tooltip>
          <Tooltip title="Duplicate Component">
            <Button
              icon={<CopyFilled />}
              onClick={onDuplicateElement}
              className="mavebutton"
              disabled={preview}
            />
          </Tooltip>
          <Tooltip title="Delete Component">
            <Button
              icon={<DeleteOutlined />}
              onClick={handleDelete}
              danger
              disabled={preview}
            />
          </Tooltip>
        </Space>
      </div>

      {/* Accordion Display */}
      <Collapse
        accordion
        activeKey={activeKeys}
        onChange={(key) => setActiveKeys([key])}
        className="accordion-collapse"
        expandIconPosition="right"
        bordered={false}
      >
        {renderPanels(accordionData)}
      </Collapse>

      {/* Empty State */}
      {accordionData.length === 0 && (
        <div className="text-center py-8">
          <PlusOutlined className="text-4xl text-gray-300 mb-4" />
          <Text type="secondary" className="block">
            No accordion items added yet
          </Text>
          <Button
            // type="primary"
            onClick={() => setIsModalVisible(true)}
            className="mt-4 mavebutton"
          >
            Add Items
          </Button>
        </div>
      )}

      {/* Multi-Language Configuration */}
      {!preview && accordionData.length > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
            <span>🌐</span>
            Multi-Language Settings
          </h4>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium mb-1">Display Alternative Content</p>
              <p className="text-sm text-gray-600">
                Show alternative titles and content for accordion items (if
                available)
              </p>
            </div>
            <Switch
              checked={showAltContent}
              onChange={(checked) => {
                setShowAltContent(checked);
                updateComponent({
                  ...component,
                  _mave: accordionData,
                  showAltContent: checked,
                });
              }}
            />
          </div>
        </div>
      )}

      {/* Accordion Selection Modal */}
      {!preview && (
        <AccordionSelectionModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSelectAccordion={handleSelectAccordion}
          initialData={accordionData}
        />
      )}

      {/* Edit Item Drawer */}
      {!preview && (
        <Drawer
          title="Edit Accordion Item"
          placement="right"
          width={600}
          onClose={handleCancelEdit}
          open={isEditDrawerVisible}
          extra={
            <Space>
              <Button onClick={handleCancelEdit}>Cancel</Button>
              <Button
                type="primary"
                onClick={handleSaveItem}
                className="mavebutton"
              >
                Save
              </Button>
            </Space>
          }
        >
          <Form form={form} layout="vertical">
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: "Please enter the title" }]}
            >
              <Input placeholder="Enter title" />
            </Form.Item>

            <Form.Item name="altTitle" label="Alternative Title">
              <Input placeholder="Enter alternative title (optional)" />
            </Form.Item>

            <Form.Item
              name="contentType"
              label="Content Type"
              initialValue={editingItem?.contentType || "text"}
            >
              <Select onChange={(value) => setCurrentContentType(value)}>
                <Option value="text">Text</Option>
                <Option value="tags">Tags</Option>
                <Option value="accordion">Nested Accordion</Option>
              </Select>
            </Form.Item>

            {currentContentType === "tags" ? (
              <Form.Item name="tags" label="Tags">
                <Select
                  mode="tags"
                  placeholder="Enter tags (press Enter to add)"
                  allowClear
                  size="large"
                  showSearch
                  style={{ width: "100%" }}
                />
              </Form.Item>
            ) : (
              <>
                <Form.Item
                  name="content"
                  label="Content"
                  rules={[
                    { required: true, message: "Please enter the content" },
                  ]}
                >
                  <RichTextEditor
                    defaultValue={editingItem?.content || ""}
                    onChange={(content) =>
                      form.setFieldValue("content", content)
                    }
                    editMode={true}
                  />
                </Form.Item>

                <Form.Item name="altContent" label="Alternative Content">
                  <RichTextEditor
                    defaultValue={editingItem?.altContent || ""}
                    onChange={(content) =>
                      form.setFieldValue("altContent", content)
                    }
                    editMode={true}
                  />
                </Form.Item>
              </>
            )}
          </Form>
        </Drawer>
      )}

      {/* Add New Item Drawer */}
      {!preview && (
        <Drawer
          title="Add New Accordion Item"
          placement="right"
          width={600}
          onClose={handleCancelAdd}
          open={isAddDrawerVisible}
          extra={
            <Space>
              <Button onClick={handleCancelAdd}>Cancel</Button>
              <Button
                type="primary"
                onClick={handleSaveNewItem}
                className="mavebutton"
              >
                Add Item
              </Button>
            </Space>
          }
        >
          <Form form={addForm} layout="vertical">
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: "Please enter the title" }]}
            >
              <Input placeholder="Enter title" />
            </Form.Item>

            <Form.Item name="altTitle" label="Alternative Title">
              <Input placeholder="Enter alternative title (optional)" />
            </Form.Item>

            <Form.Item
              name="contentType"
              label="Content Type"
              initialValue="text"
            >
              <Select onChange={(value) => setCurrentAddContentType(value)}>
                <Option value="text">Text</Option>
                <Option value="tags">Tags</Option>
                <Option value="accordion">Nested Accordion</Option>
              </Select>
            </Form.Item>

            {currentAddContentType === "tags" ? (
              <Form.Item name="tags" label="Tags">
                <Select
                  mode="tags"
                  placeholder="Enter tags (press Enter to add)"
                  allowClear
                  size="large"
                  showSearch
                  style={{ width: "100%" }}
                />
              </Form.Item>
            ) : (
              <>
                <Form.Item
                  name="content"
                  label="Content"
                  rules={[
                    { required: true, message: "Please enter the content" },
                  ]}
                >
                  <RichTextEditor
                    defaultValue=""
                    onChange={(content) =>
                      addForm.setFieldValue("content", content)
                    }
                    editMode={true}
                  />
                </Form.Item>

                <Form.Item name="altContent" label="Alternative Content">
                  <RichTextEditor
                    defaultValue=""
                    onChange={(content) =>
                      addForm.setFieldValue("altContent", content)
                    }
                    editMode={true}
                  />
                </Form.Item>
              </>
            )}
          </Form>
        </Drawer>
      )}
    </div>
  );
};

export default AccordionComponent;
