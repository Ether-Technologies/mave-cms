// components/PageBuilder/Components/PageHeader.jsx

import React from "react";
import { Button } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  UndoOutlined,
  RedoOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

const PageHeader = ({
  isEditing,
  isDirty,
  canUndo,
  canRedo,
  onToggleEdit,
  onUndo,
  onRedo,
}) => {
  return (
    <div className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? "Page Builder" : "Page Preview"}
          </h1>
          {isDirty && isEditing && (
            <div className="flex items-center gap-2 text-brand">
              <ExclamationCircleOutlined />
              <span className="text-sm">Unsaved changes</span>
            </div>
          )}

          {!isEditing && (
            <div className="flex items-center gap-2 text-green-500">
              <span className="text-sm">
                Preview Mode - Auto-refresh enabled
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                icon={<UndoOutlined />}
                onClick={onUndo}
                disabled={!canUndo}
                className="mavebutton"
              >
                Undo
              </Button>
              <Button
                icon={<RedoOutlined />}
                onClick={onRedo}
                disabled={!canRedo}
                className="mavebutton"
              >
                Redo
              </Button>
              <Button
                icon={<EyeOutlined />}
                onClick={onToggleEdit}
                className="mavebutton"
              >
                Preview
              </Button>
            </>
          ) : (
            <Button
              icon={<EditOutlined />}
              onClick={onToggleEdit}
              className="mavebutton"
            >
              Edit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
