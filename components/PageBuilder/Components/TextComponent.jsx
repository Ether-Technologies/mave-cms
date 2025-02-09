import React, { useState } from "react";
import { Input, Button, Modal, Popconfirm, Typography } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
  ExportOutlined,
  CopyFilled,
} from "@ant-design/icons";

const TextComponent = ({
  component,
  updateComponent,
  deleteComponent,
  preview = false,
  onDuplicateElement,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(component.value || "");
  const { Title } = Typography;

  const handleSubmit = () => {
    if (tempValue.trim() === "") {
      Modal.error({
        title: "Validation Error",
        content: "Text cannot be empty.",
      });
      return;
    }
    updateComponent({ ...component, value: tempValue });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(component.value || "");
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteComponent();
  };

  // If in preview mode, render the text content only
  if (preview) {
    return (
      <div className="preview-text-component p-4 bg-gray-100 rounded-md text-center">
        <h1 className="text-3xl font-bold">{component.value}</h1>
      </div>
    );
  }

  return (
    <div className="border p-4 rounded-md bg-gray-50">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-semibold">Text Component</h3>
        <div>
          {isEditing ? (
            <>
              <Button
                icon={<CheckOutlined />}
                onClick={handleSubmit}
                className="mavebutton"
              >
                Done
              </Button>
              <Button
                icon={<CloseOutlined />}
                onClick={handleCancel}
                className="mavecancelbutton"
              >
                Discard
              </Button>
            </>
          ) : (
            <>
              {component.value && (
                <Button
                  icon={<ExportOutlined />}
                  onClick={() => setIsEditing(true)}
                  className="mavebutton"
                >
                  Change
                </Button>
              )}

              {/* Duplicate Component Button */}
              <Button
                icon={<CopyFilled />}
                className="mavebutton"
                onClick={onDuplicateElement}
                hidden
              >
                Duplicate
              </Button>

              <Popconfirm
                title="Are you sure you want to delete this component?"
                onConfirm={deleteComponent}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  icon={<DeleteOutlined />}
                  className="mavecancelbutton"
                />
              </Popconfirm>
            </>
          )}
        </div>
      </div>
      {isEditing ? (
        <Input
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          placeholder="Enter text..."
          onPressEnter={handleSubmit} // <-- Added this line
        />
      ) : component.value ? (
        // <p>{component.value}</p>
        <Title level={3}>{component.value}</Title>
      ) : (
        <Button
          icon={<PlusOutlined />}
          type="dashed"
          onClick={() => setIsEditing(true)}
          className="w-full border-theme font-bold"
        >
          Add Text
        </Button>
      )}
    </div>
  );
};

export default TextComponent;
