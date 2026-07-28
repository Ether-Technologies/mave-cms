// components/PageBuilder/Components/FloatingActionButtons.jsx

import React from "react";
import { Button } from "antd";
import { SaveOutlined, EyeOutlined } from "@ant-design/icons";

const FloatingActionButtons = ({
  isEditing,
  isDirty,
  loading,
  lastSaved,
  onSave,
  onPreview,
}) => {
  if (!isEditing) return null;

  return (
    <div className="fixed bottom-6 right-2 z-50 flex flex-col items-end gap-3">
      {/* Status Indicator */}
      <div className="bg-white rounded-lg shadow-lg p-3 mb-2 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isDirty ? "bg-gray-800" : "bg-gray-200"
            }`}
          ></div>
          <span>{isDirty ? "Unsaved changes" : "All changes saved"}</span>
        </div>
        {lastSaved && (
          <div className="text-gray-400 mt-1">
            Last saved: {new Date(lastSaved).toLocaleTimeString()}
          </div>
        )}
        <div className="text-gray-400 mt-1">Ctrl/⌘+S to save</div>
      </div>

      {/* Save Button */}
      <div className="relative">
        <Button
          type="primary"
          icon={<SaveOutlined />}
          size="large"
          onClick={onSave}
          loading={loading}
          className={`shadow-lg hover:shadow-xl transition-all duration-300 ${
            isDirty
              ? "bg-gray-200 hover:bg-gray-200 border-gray-300 hover:border-gray-300"
              : "bg-gray-200 hover:bg-gray-200 border-gray-300 hover:border-gray-300"
          }`}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          title={
            isDirty
              ? "Save Page (Ctrl+S) - Unsaved changes"
              : "Save Page (Ctrl+S)"
          }
        />
        {isDirty && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        )}
      </div>

      {/* Preview Button */}
      <Button
        type="primary"
        icon={<EyeOutlined />}
        size="large"
        onClick={onPreview}
        className="shadow-lg hover:shadow-xl transition-all duration-300 bg-gray-200 hover:bg-gray-200 border-gray-300 hover:border-gray-300"
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        title="Preview Page"
      />
    </div>
  );
};

export default FloatingActionButtons;
