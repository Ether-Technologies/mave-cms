import React, { useState } from "react";
import {
  EyeOutlined, EditOutlined, CopyOutlined, DeleteOutlined,
  CodeOutlined, LinkOutlined, CaretDownOutlined, CaretRightOutlined,
} from "@ant-design/icons";
import { Popconfirm } from "antd";
import { useRouter } from "next/router";
import PageInfoDisplay from "./PageInfoDisplay";
import PageEditForm from "./PageEditForm";

const TYPE_CFG = {
  Page:    { color: "#3b82f6", bg: "#dbeafe", border: "#bfdbfe" },
  Subpage: { color: "#7c3aed", bg: "#ede9fe", border: "#ddd6fe" },
  Footer:  { color: "#b45309", bg: "#fef3c7", border: "#fde68a" },
  Blog:    { color: "#16a34a", bg: "#dcfce7", border: "#bbf7d0" },
  Event:   { color: "#dc2626", bg: "#fee2e2", border: "#fecaca" },
};

const ActionBtn = ({ icon, label, onClick, danger, style }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      display: "flex", alignItems: "center", gap: 5,
      height: 32, padding: label ? "0 12px" : "0 10px",
      borderRadius: 8, border: `1px solid ${danger ? "#fecaca" : "#e5e7eb"}`,
      background: danger ? "#fff5f5" : "#fff",
      cursor: "pointer", fontSize: "0.78rem",
      color: danger ? "#ef4444" : "#374151", fontWeight: 600,
      transition: "all 0.15s", ...style,
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = danger ? "#ef4444" : "#fcb813";
      e.currentTarget.style.color = danger ? "#ef4444" : "#111827";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = danger ? "#fecaca" : "#e5e7eb";
      e.currentTarget.style.color = danger ? "#ef4444" : "#374151";
    }}
  >
    {icon}{label}
  </button>
);

const PageCard = ({
  page,
  handleExpand,
  expandedPageId,
  handleDeletePage,
  handleEditPageInfo,
  handleDuplicatePage,
  handlePreviewPage,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const type = page?.type || "Page";
  const cfg  = TYPE_CFG[type] || TYPE_CFG.Page;
  const isExpanded = expandedPageId === page.id;

  const confirmEdit = (data) => { handleEditPageInfo(data); setIsEditing(false); };

  return (
    <div style={{
      background: "#fff", borderRadius: 14,
      border: "1px solid #e5e7eb",
      overflow: "hidden", marginBottom: 14,
      boxShadow: "0 1px 6px rgba(0,0,0,0.05)",
      transition: "box-shadow 0.2s",
    }}>
      {/* ── Card header ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "14px 16px",
        borderBottom: isExpanded ? "1px solid #f3f4f6" : "none",
      }}>
        {/* Left accent + type badge */}
        <div style={{
          width: 4, alignSelf: "stretch", borderRadius: 2,
          background: cfg.color, flexShrink: 0,
        }} />

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
            {/* Type badge */}
            <span style={{
              padding: "2px 8px", borderRadius: 5, fontSize: "0.65rem", fontWeight: 800,
              background: cfg.bg, color: cfg.color, letterSpacing: "0.05em",
              textTransform: "uppercase", flexShrink: 0,
            }}>
              {type}
            </span>

            {/* ID badge */}
            <span style={{
              padding: "2px 7px", borderRadius: 5, fontSize: "0.65rem", fontWeight: 700,
              background: "#f3f4f6", color: "#6b7280", flexShrink: 0,
            }}>
              #{page.id}
            </span>

            {/* Title */}
            <span style={{
              fontWeight: 700, color: "#111827", fontSize: "0.92rem",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {page.page_name_en || "Untitled Page"}
            </span>
          </div>

          {/* Slug */}
          {page.slug && (
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <LinkOutlined style={{ fontSize: "0.7rem", color: "#9ca3af" }} />
              <span style={{ fontSize: "0.72rem", color: "#9ca3af", fontFamily: "monospace" }}>
                /{page.slug}
              </span>
            </div>
          )}
        </div>

        {/* Right actions */}
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          {/* Open builder */}
          <button
            type="button"
            onClick={() => router.push(`/page-builder/${page.id}`)}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              height: 32, padding: "0 12px", borderRadius: 8,
              border: "none", background: "#111827",
              cursor: "pointer", fontSize: "0.78rem", color: "#fcb813", fontWeight: 700,
            }}
          >
            <CodeOutlined /> Builder
          </button>

          {/* Preview */}
          <button
            type="button"
            onClick={() => handlePreviewPage(page.id)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 32, height: 32, borderRadius: 8,
              border: "1px solid #e5e7eb", background: "#f9fafb",
              cursor: "pointer", color: "#374151",
            }}
          >
            <EyeOutlined style={{ fontSize: "0.85rem" }} />
          </button>

          {/* Expand toggle */}
          <button
            type="button"
            onClick={() => handleExpand(page.id)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 32, height: 32, borderRadius: 8,
              border: `1px solid ${isExpanded ? cfg.border : "#e5e7eb"}`,
              background: isExpanded ? cfg.bg : "#f9fafb",
              cursor: "pointer", color: isExpanded ? cfg.color : "#6b7280",
              transition: "all 0.15s",
            }}
          >
            {isExpanded
              ? <CaretDownOutlined style={{ fontSize: "0.85rem" }} />
              : <CaretRightOutlined style={{ fontSize: "0.85rem" }} />}
          </button>
        </div>
      </div>

      {/* ── Expanded content ── */}
      {isExpanded && (
        <div style={{ padding: "16px 20px" }}>
          {isEditing ? (
            <PageEditForm page={page} onSubmit={confirmEdit} onCancel={() => setIsEditing(false)} />
          ) : (
            <>
              <PageInfoDisplay page={page} />
              <div style={{
                display: "flex", gap: 8, marginTop: 16,
                paddingTop: 14, borderTop: "1px solid #f3f4f6",
                flexWrap: "wrap",
              }}>
                <ActionBtn icon={<EyeOutlined />}   label="Preview"   onClick={() => handlePreviewPage(page.id)} />
                <ActionBtn icon={<EditOutlined />}  label="Edit Info" onClick={() => setIsEditing(true)} />
                <ActionBtn icon={<CopyOutlined />}  label="Duplicate" onClick={() => handleDuplicatePage(page.id)} />
                <Popconfirm
                  title="Delete this page?"
                  onConfirm={() => handleDeletePage(page.id)}
                  okText="Delete" cancelText="Cancel"
                  okButtonProps={{ danger: true }}
                >
                  <ActionBtn icon={<DeleteOutlined />} danger />
                </Popconfirm>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PageCard;
