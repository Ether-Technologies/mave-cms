// components/PageBuilder/Components/PageHeader.jsx

import React from "react";
import { useRouter } from "next/router";
import {
  ArrowLeftOutlined, UndoOutlined, RedoOutlined,
  EyeOutlined, EditOutlined, CodeOutlined,
  ExclamationCircleOutlined, CheckCircleOutlined, LinkOutlined,
} from "@ant-design/icons";

const TYPE_CFG = {
  Page:    { color: "#3b82f6", bg: "#dbeafe" },
  Subpage: { color: "#7c3aed", bg: "#ede9fe" },
  Footer:  { color: "#b45309", bg: "#fef3c7" },
};

const IconBtn = ({ icon, onClick, disabled, title, active }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    style={{
      display: "flex", alignItems: "center", justifyContent: "center",
      width: 32, height: 32, borderRadius: 8,
      border: `1px solid ${active ? "#fcb813" : "#374151"}`,
      background: active ? "rgba(252,184,19,0.12)" : "transparent",
      color: disabled ? "#4b5563" : (active ? "#fcb813" : "#9ca3af"),
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.4 : 1,
      transition: "all 0.15s",
    }}
    onMouseEnter={e => {
      if (!disabled) {
        e.currentTarget.style.borderColor = "#fcb813";
        e.currentTarget.style.color = "#fcb813";
      }
    }}
    onMouseLeave={e => {
      if (!disabled) {
        e.currentTarget.style.borderColor = active ? "#fcb813" : "#374151";
        e.currentTarget.style.color = active ? "#fcb813" : "#9ca3af";
      }
    }}
  >
    {icon}
  </button>
);

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
  const router = useRouter();
  const type = pageData?.type || "Page";
  const cfg  = TYPE_CFG[type] || TYPE_CFG.Page;

  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "#111827",
      boxShadow: "0 2px 16px rgba(0,0,0,0.3)",
    }}>
      {/* Main bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "0 20px", height: 56,
      }}>

        {/* Back */}
        <IconBtn
          icon={<ArrowLeftOutlined style={{ fontSize: "0.82rem" }} />}
          onClick={() => router.push("/pages")}
          title="Back to Pages"
        />

        {/* Builder icon */}
        <div style={{
          width: 32, height: 32, borderRadius: 9, flexShrink: 0,
          background: "linear-gradient(135deg, #fcb813 0%, #f97316 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 3px 10px rgba(252,184,19,0.4)",
        }}>
          <CodeOutlined style={{ fontSize: 15, color: "#fff" }} />
        </div>

        {/* Page identity */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
            <span style={{ color: "#f9fafb", fontWeight: 800, fontSize: "0.95rem" }}>
              Page Builder
            </span>

            {pageData?.page_name_en && (
              <>
                <span style={{ color: "#4b5563", fontSize: "0.82rem" }}>/</span>
                <span style={{
                  color: "#d1d5db", fontWeight: 600, fontSize: "0.85rem",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  maxWidth: 200,
                }}>
                  {pageData.page_name_en}
                </span>
              </>
            )}

            {pageData?.type && (
              <span style={{
                padding: "2px 8px", borderRadius: 5,
                background: cfg.bg, color: cfg.color,
                fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase",
                flexShrink: 0,
              }}>
                {type}
              </span>
            )}

            {/* Dirty / saved indicator */}
            {isDirty && isEditing ? (
              <span style={{
                display: "flex", alignItems: "center", gap: 4,
                padding: "2px 8px", borderRadius: 5,
                background: "rgba(251,146,60,0.15)", color: "#fb923c",
                fontSize: "0.6rem", fontWeight: 700, flexShrink: 0,
              }}>
                <ExclamationCircleOutlined style={{ fontSize: "0.65rem" }} />
                Unsaved
              </span>
            ) : !isDirty && isEditing && pageData ? (
              <span style={{
                display: "flex", alignItems: "center", gap: 4,
                padding: "2px 8px", borderRadius: 5,
                background: "rgba(34,197,94,0.12)", color: "#4ade80",
                fontSize: "0.6rem", fontWeight: 700, flexShrink: 0,
              }}>
                <CheckCircleOutlined style={{ fontSize: "0.65rem" }} />
                Saved
              </span>
            ) : null}
          </div>

          {pageData?.slug && (
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
              <LinkOutlined style={{ fontSize: "0.62rem", color: "#4b5563" }} />
              <span style={{ fontSize: "0.65rem", color: "#4b5563", fontFamily: "monospace" }}>
                /{pageData.slug}
              </span>
            </div>
          )}
        </div>

        {/* Right controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>

          {/* Undo / Redo — edit mode only */}
          {isEditing && (
            <>
              <IconBtn
                icon={<UndoOutlined style={{ fontSize: "0.82rem" }} />}
                onClick={onUndo}
                disabled={!canUndo}
                title="Undo (Ctrl+Z)"
              />
              <IconBtn
                icon={<RedoOutlined style={{ fontSize: "0.82rem" }} />}
                onClick={onRedo}
                disabled={!canRedo}
                title="Redo (Ctrl+Y)"
              />
              <div style={{ width: 1, height: 20, background: "#374151", margin: "0 2px" }} />
            </>
          )}

          {/* Edit / Preview toggle */}
          <div style={{
            display: "flex", borderRadius: 10, overflow: "hidden",
            border: "1px solid #374151",
          }}>
            <button
              type="button"
              onClick={() => !isEditing && onToggleEdit()}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                height: 32, padding: "0 14px",
                background: isEditing ? "#fcb813" : "transparent",
                border: "none", cursor: isEditing ? "default" : "pointer",
                color: isEditing ? "#111827" : "#6b7280",
                fontSize: "0.78rem", fontWeight: 700,
                transition: "all 0.15s",
              }}
            >
              <EditOutlined style={{ fontSize: "0.78rem" }} />
              Edit
            </button>
            <div style={{ width: 1, background: "#374151" }} />
            <button
              type="button"
              onClick={() => isEditing && onToggleEdit()}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                height: 32, padding: "0 14px",
                background: !isEditing ? "#fcb813" : "transparent",
                border: "none", cursor: !isEditing ? "default" : "pointer",
                color: !isEditing ? "#111827" : "#6b7280",
                fontSize: "0.78rem", fontWeight: 700,
                transition: "all 0.15s",
              }}
            >
              <EyeOutlined style={{ fontSize: "0.78rem" }} />
              Preview
            </button>
          </div>

          {/* Keyboard hint */}
          {isEditing && (
            <span style={{
              fontSize: "0.65rem", color: "#4b5563",
              fontFamily: "monospace", letterSpacing: "0.05em",
            }}>
              ⌘S
            </span>
          )}
        </div>
      </div>

      {/* Sub-bar: preview mode banner */}
      {!isEditing && (
        <div style={{
          borderTop: "1px solid #1f2937",
          padding: "5px 20px",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80" }} />
          <span style={{ fontSize: "0.7rem", color: "#6b7280" }}>
            Preview Mode — live-refresh enabled · click Edit to make changes
          </span>
        </div>
      )}
    </div>
  );
};

export default PageHeader;
