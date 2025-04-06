import React, { useState } from "react";
import { Input, Modal, Typography, Button } from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import BaseComponent from "./BaseComponent";

const { Title } = Typography;

const TextComponent = ({
  component,
  updateComponent,
  deleteComponent,
  preview = false,
  onDuplicateElement,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(component.value || "");

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

  const renderContent = () => {
    if (isEditing) {
      return (
        <div className="space-y-4">
          <Input.TextArea
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            placeholder="Enter text..."
            autoSize={{ minRows: 3, maxRows: 6 }}
            className="w-full px-4 py-2 text-lg border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      );
    }

    if (component.value) {
      return (
        <div className="prose max-w-none relative group">
          <Title level={3} className="text-2xl font-bold text-gray-800">
            {component.value}
          </Title>
          <Button
            icon={<EditOutlined />}
            onClick={() => setIsEditing(true)}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            Edit
          </Button>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
        <Button
          icon={<PlusOutlined />}
          onClick={() => setIsEditing(true)}
          className="bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100 hover:text-blue-700 hover:border-blue-200 transition-colors duration-200"
        >
          Add Text
        </Button>
        <p className="mt-2 text-sm text-gray-500">No text content added</p>
      </div>
    );
  };

  // Preview mode rendering
  if (preview) {
    return (
      <div className="preview-text-component p-6 bg-gray-50 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md text-center">
        <h1 className="text-3xl font-bold text-gray-800">{component.value}</h1>
      </div>
    );
  }

  return (
    <BaseComponent
      component={component}
      updateComponent={updateComponent}
      deleteComponent={deleteComponent}
      preview={preview}
      onDuplicateElement={onDuplicateElement}
      title="Text Component"
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      onEdit={() => setIsEditing(true)}
      onCancel={handleCancel}
      onSave={handleSubmit}
      showChangeButton={!!component.value}
    >
      {renderContent()}
    </BaseComponent>
  );
};

export default TextComponent;
