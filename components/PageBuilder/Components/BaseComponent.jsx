import React from "react";
import { Button, Popconfirm } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  ExportOutlined,
  CopyFilled,
  DragOutlined,
} from "@ant-design/icons";

const BaseComponent = ({
  component,
  updateComponent,
  deleteComponent,
  preview = false,
  onDuplicateElement,
  title,
  children,
  isEditing,
  setIsEditing,
  onEdit,
  onCancel,
  onSave,
  showChangeButton = true,
  showDuplicateButton = true,
  showDeleteButton = true,
}) => {
  const handleDelete = () => {
    deleteComponent();
  };

  if (preview) {
    return (
      <div className="preview-component p-6 bg-gray-50 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md">
        {children}
      </div>
    );
  }

  return (
    <div className="component-wrapper bg-white rounded-lg shadow-sm transition-all duration-200 hover:shadow-md border border-gray-100">
      {/* Header */}
      <div className="component-header p-4 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="drag-handle p-2 rounded-md bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors duration-200">
              <DragOutlined className="text-xl text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <>
                {showChangeButton && component?._mave && (
                  <Button
                    icon={<ExportOutlined />}
                    onClick={onEdit}
                    className="action-button bg-yellow-50 text-yellow-600 border-yellow-100 hover:bg-yellow-100 hover:text-yellow-700 hover:border-yellow-200 transition-colors duration-200"
                  >
                    Change
                  </Button>
                )}
                {showDuplicateButton && (
                  <Button
                    icon={<CopyFilled />}
                    onClick={onDuplicateElement}
                    className="mavebutton"
                  />
                )}
                {showDeleteButton && (
                  <Popconfirm
                    title="Are you sure you want to delete this component?"
                    onConfirm={handleDelete}
                    okText="Yes"
                    cancelText="No"
                    okButtonProps={{ className: "bg-red-500 hover:bg-red-600" }}
                  >
                    <Button
                      icon={<DeleteOutlined />}
                      className="action-button bg-red-50 text-red-600 border-red-100 hover:bg-red-100 hover:text-red-700 hover:border-red-200 transition-colors duration-200"
                    />
                  </Popconfirm>
                )}
              </>
            ) : (
              <>
                <Button
                  icon={<CheckOutlined />}
                  onClick={onSave}
                  className="mavebutton"
                >
                  Done
                </Button>
                <Button
                  icon={<CloseOutlined />}
                  onClick={onCancel}
                  className="mavecancelbutton"
                >
                  Discard
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="component-content p-6">{children}</div>
    </div>
  );
};

export default BaseComponent;
