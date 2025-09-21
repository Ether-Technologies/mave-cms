// components/PageBuilder/Components/ParagraphComponent.jsx

import React, { useState } from "react";
import { Button, Modal, Popconfirm, Space, Tooltip, Switch, Collapse } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
  ExportOutlined,
  CopyFilled,
  DragOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import RichTextEditor from "../../RichTextEditor";

const { Panel } = Collapse;

const ParagraphComponent = ({
  component,
  updateComponent,
  deleteComponent,
  preview = false,
  onDuplicateElement,
}) => {
  // Safety check for null component
  if (!component) {
    return null;
  }

  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [formData, setFormData] = useState({
    content: component?.value || "",
    altContent: component?._mave?.altContent || "",
    showAltContent: component?._mave?.showAltContent || false,
  });

  const handleSubmit = () => {
    if (formData.content.trim() === "") {
      Modal.error({
        title: "Validation Error",
        content: "Paragraph content cannot be empty.",
      });
      return;
    }

    const updatedComponent = {
      ...component,
      value: formData.content,
      _mave: {
        ...component._mave,
        altContent: formData.altContent,
        showAltContent: formData.showAltContent,
      },
    };

    updateComponent(updatedComponent);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      content: component?.value || "",
      altContent: component?._mave?.altContent || "",
      showAltContent: component?._mave?.showAltContent || false,
    });
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDelete = () => {
    deleteComponent();
  };

  if (preview) {
    return (
      <div className="preview-paragraph-component p-4 bg-gray-50 rounded-lg shadow-sm">
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: formData.content || "" }}
        />
        {formData.showAltContent && formData.altContent && (
          <div
            className="prose max-w-none italic text-gray-600 mt-2"
            dangerouslySetInnerHTML={{ __html: formData.altContent }}
          />
        )}
      </div>
    );
  }

  return (
    <div
      className={`border rounded-lg bg-white transition-all duration-200 ${
        isHovered ? "shadow-md" : "shadow-sm"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <DragOutlined className="text-xl text-gray-400 cursor-move hover:text-gray-600 transition-colors" />
            <h3 className="text-lg font-semibold text-gray-700">
              Paragraph Component
            </h3>
          </div>
          <Space>
            {isEditing ? (
              <>
                <Tooltip title="Save changes">
                  <Button
                    icon={<CheckOutlined />}
                    onClick={handleSubmit}
                    className="mavebutton"
                  >
                    Save
                  </Button>
                </Tooltip>
                <Tooltip title="Cancel editing">
                  <Button
                    icon={<CloseOutlined />}
                    onClick={handleCancel}
                    className="mavecancelbutton"
                  >
                    Cancel
                  </Button>
                </Tooltip>
              </>
            ) : (
              <>
                {(component?.value || component?._mave?.altContent) && (
                  <Tooltip title="Edit paragraph">
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => setIsEditing(true)}
                      className="mavebutton"
                    >
                      Edit
                    </Button>
                  </Tooltip>
                )}
                <Tooltip title="Duplicate component">
                  <Button
                    icon={<CopyFilled />}
                    onClick={onDuplicateElement}
                    className="text-gray-600 hover:text-gray-800"
                  />
                </Tooltip>
                <Popconfirm
                  title="Delete Paragraph"
                  description="Are you sure you want to delete this paragraph?"
                  onConfirm={handleDelete}
                  okText="Yes"
                  cancelText="No"
                  okButtonProps={{ danger: true }}
                >
                  <Tooltip title="Delete component">
                    <Button icon={<DeleteOutlined />} danger />
                  </Tooltip>
                </Popconfirm>
              </>
            )}
          </Space>
        </div>
        {isEditing ? (
          <div className="space-y-4">
            <Collapse defaultActiveKey={["1", "2"]} ghost>
              <Panel header="Main Content" key="1">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <RichTextEditor
                    defaultValue={formData.content}
                    onChange={(html) => handleChange("content", html)}
                    editMode={true}
                    maxLength={5000}
                  />
                </div>
              </Panel>
              <Panel header="Multi-Language Support" key="2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-700">
                      Enable Alternative Content
                    </label>
                    <Switch
                      checked={formData.showAltContent}
                      onChange={(checked) => handleChange("showAltContent", checked)}
                    />
                  </div>
                  {formData.showAltContent && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alternative Content
                      </label>
                      <RichTextEditor
                        defaultValue={formData.altContent}
                        onChange={(html) => handleChange("altContent", html)}
                        editMode={true}
                        maxLength={5000}
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        <GlobalOutlined className="mr-1" />
                        Add content in another language for multi-language support
                      </p>
                    </div>
                  )}
                </div>
              </Panel>
            </Collapse>
          </div>
        ) : component?.value ? (
          <div className="space-y-4">
            <div
              className="prose max-w-none p-4 bg-white rounded-lg"
              dangerouslySetInnerHTML={{ __html: component.value }}
            />
            {formData.showAltContent && formData.altContent && (
              <div
                className="prose max-w-none p-4 bg-gray-50 rounded-lg italic text-gray-600"
                dangerouslySetInnerHTML={{ __html: formData.altContent }}
              />
            )}
          </div>
        ) : (
          <Button
            icon={<PlusOutlined />}
            type="dashed"
            onClick={() => {
              setIsEditing(true);
              setFormData({
                content: "",
                altContent: "",
                showAltContent: false,
              });
            }}
            className="w-full h-32 border-2 border-dashed border-gray-300 hover:border-yellow-500 transition-colors"
          >
            <span className="text-lg font-medium text-gray-600">
              Add Paragraph
            </span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ParagraphComponent;
