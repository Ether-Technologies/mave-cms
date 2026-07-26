// components/PageBuilder/Components/PageContent.jsx

import React from "react";
import { PlusOutlined, CodeOutlined } from "@ant-design/icons";
import SectionList from "../Sections/SectionList";

const EmptyBuilder = ({ onAddSection }) => (
  <div style={{
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", padding: "80px 24px", gap: 16,
  }}>
    <div style={{
      width: 64, height: 64, borderRadius: 18,
      background: "linear-gradient(135deg, #fcb813 0%, #f97316 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 8px 24px rgba(252,184,19,0.35)",
    }}>
      <CodeOutlined style={{ fontSize: 28, color: "#fff" }} />
    </div>
    <div style={{ textAlign: "center" }}>
      <p style={{ margin: 0, color: "#111827", fontWeight: 700, fontSize: "1rem" }}>
        No sections yet
      </p>
      <p style={{ margin: "4px 0 0", color: "#9ca3af", fontSize: "0.82rem" }}>
        Add your first section to start building this page
      </p>
    </div>
    <button
      type="button"
      onClick={onAddSection}
      style={{
        display: "flex", alignItems: "center", gap: 8,
        height: 40, padding: "0 24px", borderRadius: 10,
        border: "none",
        background: "linear-gradient(135deg, #fcb813 0%, #f97316 100%)",
        color: "#111827", cursor: "pointer",
        fontSize: "0.85rem", fontWeight: 800,
        boxShadow: "0 4px 14px rgba(252,184,19,0.4)",
        transition: "opacity 0.15s",
      }}
      onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
      onMouseLeave={e => e.currentTarget.style.opacity = "1"}
    >
      <PlusOutlined /> Add First Section
    </button>
  </div>
);

const AddSectionBar = ({ onAddSection }) => (
  <div style={{ padding: "16px 24px 32px" }}>
    <button
      type="button"
      onClick={onAddSection}
      style={{
        width: "100%", height: 48, borderRadius: 12,
        border: "2px dashed #d1d5db", background: "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 8, cursor: "pointer", color: "#9ca3af",
        fontSize: "0.82rem", fontWeight: 600,
        transition: "all 0.15s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = "#fcb813";
        e.currentTarget.style.color = "#f97316";
        e.currentTarget.style.background = "rgba(252,184,19,0.04)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = "#d1d5db";
        e.currentTarget.style.color = "#9ca3af";
        e.currentTarget.style.background = "transparent";
      }}
    >
      <PlusOutlined /> Add Section
    </button>
  </div>
);

const PageContent = ({
  pageData,
  isEditing,
  onSectionsUpdate,
  onSectionDuplicate,
  onSectionDelete,
  onEditingStateChange,
  onAddSection,
  onAddSectionAtPosition,
}) => {
  const sections = Object.values(pageData?.body?.data || {});

  return (
    <div style={{ background: "#f1f5f9", minHeight: "calc(100vh - 56px)" }}>
      <div style={{ padding: sections.length > 0 ? "20px 20px 0" : 0 }}>
        {sections.length > 0 ? (
          <>
            <SectionList
              sections={sections}
              setSections={onSectionsUpdate}
              onSectionDuplicate={onSectionDuplicate}
              onSectionDelete={onSectionDelete}
              onEditingStateChange={onEditingStateChange}
              onAddSectionAtPosition={onAddSectionAtPosition}
              isEditing={isEditing}
            />
            {isEditing && <AddSectionBar onAddSection={onAddSection} />}
          </>
        ) : (
          isEditing
            ? <EmptyBuilder onAddSection={onAddSection} />
            : (
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: "80px 0",
              }}>
                <p style={{ color: "#9ca3af", fontSize: "0.85rem" }}>
                  No sections on this page yet.
                </p>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default PageContent;
