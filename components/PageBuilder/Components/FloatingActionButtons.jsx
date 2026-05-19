// components/PageBuilder/Components/FloatingActionButtons.jsx

import React, { useState } from "react";
import { Spin } from "antd";
import { SaveOutlined, EyeOutlined, CheckOutlined } from "@ant-design/icons";

const FloatingActionButtons = ({
  isEditing,
  isDirty,
  loading,
  lastSaved,
  onSave,
  onPreview,
}) => {
  const [justSaved, setJustSaved] = useState(false);

  if (!isEditing) return null;

  const handleSave = async () => {
    await onSave();
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  const savedTime = lastSaved
    ? new Date(lastSaved).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 200,
      display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10,
    }}>

      {/* Status card */}
      <div style={{
        background: "#111827",
        borderRadius: 10, padding: "8px 14px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        border: "1px solid #1f2937",
        minWidth: 160,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <div style={{
            width: 7, height: 7, borderRadius: "50%", flexShrink: 0,
            background: isDirty ? "#fb923c" : "#4ade80",
            boxShadow: isDirty
              ? "0 0 6px rgba(251,146,60,0.6)"
              : "0 0 6px rgba(74,222,128,0.6)",
          }} />
          <span style={{ fontSize: "0.75rem", color: isDirty ? "#fb923c" : "#4ade80", fontWeight: 700 }}>
            {isDirty ? "Unsaved changes" : "All saved"}
          </span>
        </div>
        {savedTime && (
          <div style={{ marginTop: 4, fontSize: "0.67rem", color: "#4b5563", paddingLeft: 14 }}>
            Last saved {savedTime}
          </div>
        )}
        <div style={{ marginTop: 3, fontSize: "0.67rem", color: "#374151", paddingLeft: 14 }}>
          Ctrl / ⌘ + S to save
        </div>
      </div>

      {/* Action row */}
      <div style={{ display: "flex", gap: 8 }}>

        {/* Preview button */}
        <button
          type="button"
          onClick={onPreview}
          title="Preview Page"
          style={{
            display: "flex", alignItems: "center", gap: 6,
            height: 40, padding: "0 16px", borderRadius: 10,
            border: "1px solid #374151", background: "#1f2937",
            color: "#d1d5db", cursor: "pointer",
            fontSize: "0.78rem", fontWeight: 700,
            boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
            transition: "all 0.15s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = "#fcb813";
            e.currentTarget.style.color = "#fcb813";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "#374151";
            e.currentTarget.style.color = "#d1d5db";
          }}
        >
          <EyeOutlined style={{ fontSize: "0.85rem" }} />
          Preview
        </button>

        {/* Save button */}
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          title="Save Page (Ctrl+S)"
          style={{
            display: "flex", alignItems: "center", gap: 6,
            height: 40, padding: "0 20px", borderRadius: 10,
            border: "none",
            background: justSaved
              ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
              : isDirty
                ? "linear-gradient(135deg, #fcb813 0%, #f97316 100%)"
                : "#1f2937",
            color: justSaved ? "#fff" : isDirty ? "#111827" : "#6b7280",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "0.82rem", fontWeight: 800,
            boxShadow: isDirty
              ? "0 4px 16px rgba(252,184,19,0.5)"
              : "0 4px 14px rgba(0,0,0,0.3)",
            transition: "all 0.2s",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? (
            <Spin size="small" style={{ filter: "brightness(0) invert(1)" }} />
          ) : justSaved ? (
            <CheckOutlined style={{ fontSize: "0.85rem" }} />
          ) : (
            <SaveOutlined style={{ fontSize: "0.85rem" }} />
          )}
          {justSaved ? "Saved!" : "Save"}
          {isDirty && !justSaved && (
            <span style={{
              width: 7, height: 7, borderRadius: "50%",
              background: "#111827", opacity: 0.4,
            }} />
          )}
        </button>
      </div>
    </div>
  );
};

export default FloatingActionButtons;
