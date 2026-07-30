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
    <div className="fixed top-[78%] -translate-y-1/2 right-2 z-50 flex flex-col items-end gap-3">
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
              ? "bg-brand hover:bg-brand-dark border-brand hover:border-brand-dark"
              : "bg-green-500 hover:bg-green-600 border-green-500 hover:border-green-600"
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
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-brand rounded-full flex items-center justify-center">
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
        className="shadow-lg hover:shadow-xl transition-all duration-300 bg-brand hover:bg-brand-dark border-brand hover:border-brand-dark"
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

      {/* Status Indicator */}
      <div className="bg-white rounded-lg shadow-lg p-3 mt-2 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isDirty ? "bg-orange-500" : "bg-green-500"
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
    </div>
  );
};

export default FloatingActionButtons;
