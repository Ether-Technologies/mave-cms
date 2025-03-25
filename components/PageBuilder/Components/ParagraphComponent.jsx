// components/PageBuilder/Components/ParagraphComponent.jsx

import React, { useState } from "react";
import { Button, Modal, Popconfirm } from "antd";
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
import RichTextEditor from "../../RichTextEditor"; // Adjust the path as necessary

const ParagraphComponent = ({
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
        content: "Paragraph cannot be empty.",
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

  // If in preview mode, render the paragraph content only
  if (preview) {
    return (
      <div className="preview-paragraph-component p-4 bg-gray-100 rounded-md">
        <div
          className="text-lg"
          dangerouslySetInnerHTML={{ __html: component.value }}
        />
      </div>
    );
  }

  return (
    <div className="border p-4 rounded-md bg-white">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <DragOutlined className="text-2xl border rounded-md p-1" />
          <h3 className="text-xl font-semibold">Paragraph Component</h3>
        </div>
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
              <Button
                icon={<CopyFilled />}
                onClick={onDuplicateElement}
                className="mavebutton"
              />
              <Popconfirm
                title="Are you sure you want to delete this component?"
                onConfirm={handleDelete}
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
        <RichTextEditor
          defaultValue={tempValue}
          onChange={(html) => setTempValue(html)}
          editMode={true}
        />
      ) : component?.value ? (
        <div dangerouslySetInnerHTML={{ __html: component.value }} />
      ) : (
        <Button
          icon={<PlusOutlined />}
          type="dashed"
          onClick={() => setIsEditing(true)}
          className="w-full border-theme font-bold"
        >
          Add Paragraph
        </Button>
      )}
    </div>
  );
};

export default ParagraphComponent;
