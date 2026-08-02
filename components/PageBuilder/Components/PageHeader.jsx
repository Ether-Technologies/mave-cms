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
  pageData,
  isEditing,
  isDirty,
  canUndo,
  canRedo,
  onToggleEdit,
  onUndo,
  onRedo,
}) => {
  const pageName = pageData?.page_name_en || "Untitled Page";

  return (
    <div className="bg-white shadow-sm border-b px-6 py-4">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div className="flex flex-col gap-2 min-w-0">
          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900 truncate">
              {pageName}
            </h1>
            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full">
              {isEditing ? "Editing" : "Preview"}
            </span>
            {isDirty && isEditing && (
              <div className="flex items-center gap-2 text-brand">
                <ExclamationCircleOutlined />
                <span className="text-sm">Unsaved changes</span>
              </div>
            )}
            {!isEditing && (
              <div className="flex items-center gap-2 text-green-600">
                <span className="text-sm">Preview mode</span>
              </div>
            )}
          </div>
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
