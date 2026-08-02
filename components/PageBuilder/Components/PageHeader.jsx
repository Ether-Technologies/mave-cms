// components/PageBuilder/Components/PageHeader.jsx

import React from "react";
import { Button, Tooltip, message } from "antd";
import {
  EyeOutlined,
  EditOutlined,
  UndoOutlined,
  RedoOutlined,
  ExclamationCircleOutlined,
  CopyOutlined,
  LinkOutlined,
  GlobalOutlined,
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
  const pageNameAlt = pageData?.page_name_bn;
  const slug = pageData?.slug;
  const pageUrl = slug ? `/${slug}` : null;

  const handleCopyUrl = () => {
    if (!pageUrl) return;
    const fullUrl = `${window.location.origin}${pageUrl}`;
    navigator.clipboard.writeText(fullUrl);
    message.success("Page URL copied to clipboard");
  };

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

          {(pageNameAlt || pageUrl || pageData?.type) && (
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600">
              {pageNameAlt && (
                <span className="flex items-center gap-1.5">
                  <GlobalOutlined className="text-gray-400" />
                  <span className="font-medium text-gray-500">Alt:</span>
                  {pageNameAlt}
                </span>
              )}
              {pageUrl && (
                <span className="flex items-center gap-1.5 min-w-0">
                  <LinkOutlined className="text-brand flex-shrink-0" />
                  <code className="text-brand bg-blue-50 px-2 py-0.5 rounded truncate max-w-xs sm:max-w-md">
                    {pageUrl}
                  </code>
                  <Tooltip title="Copy page URL">
                    <button
                      type="button"
                      onClick={handleCopyUrl}
                      className="p-1 rounded hover:bg-gray-100 text-gray-500 hover:text-brand transition-colors"
                      aria-label="Copy page URL"
                    >
                      <CopyOutlined />
                    </button>
                  </Tooltip>
                </span>
              )}
              {pageData?.type && (
                <span>
                  <span className="font-medium text-gray-500">Type:</span>{" "}
                  {pageData.type}
                </span>
              )}
              {pageData?.id && (
                <span>
                  <span className="font-medium text-gray-500">ID:</span>{" "}
                  {pageData.id}
                </span>
              )}
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
