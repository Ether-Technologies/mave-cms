// components/PageBuilder/Components/ParagraphComponent.jsx

import React, { useState } from "react";
import { Button, Modal, Popconfirm, Space, Tooltip } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
  ExportOutlined,
  CopyFilled,
  DragOutlined,
} from "@ant-design/icons";
import RichTextEditor from "../../RichTextEditor";

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
  const [tempValue, setTempValue] = useState(component?.value || "");
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = () => {
    if (tempValue.trim() === "") {
      Modal.error({
        title: "Validation Error",
        content: "Paragraph cannot be empty.",
      });
      return;
    }
    updateComponent({ ...component, value: tempValue });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(component?.value || "");
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteComponent();
  };

  if (preview) {
    return (
      <div className="preview-paragraph-component p-4 bg-gray-50 rounded-lg shadow-sm">
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: component?.value || "" }}
        />
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
                {component?.value && (
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
          <RichTextEditor
            defaultValue={tempValue}
            onChange={(html) => setTempValue(html)}
            editMode={true}
            maxLength={5000}
          />
        ) : component?.value ? (
          <div
            className="prose max-w-none p-4 bg-white rounded-lg"
            dangerouslySetInnerHTML={{ __html: component.value }}
          />
        ) : (
          <Button
            icon={<PlusOutlined />}
            type="dashed"
            onClick={() => {
              setIsEditing(true);
              setTempValue("");
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
