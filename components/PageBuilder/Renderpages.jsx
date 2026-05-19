import React from "react";
import { LayoutOutlined } from "@ant-design/icons";
import PageCard from "./PageCard";

const TYPE_LABEL = { pages: "pages", subpages: "subpages", footers: "footers" };

const RenderPages = ({
  webpages = [],
  handlePreviewPage,
  handleExpand,
  expandedPageId,
  handleDeletePage,
  handleEditPageInfo,
  handleDuplicatePage,
  pageType = "pages",
}) => {
  if (webpages.length === 0) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", padding: "60px 0", gap: 12,
      }}>
        <div style={{
          width: 60, height: 60, borderRadius: 16,
          background: "linear-gradient(135deg, #fcb813 0%, #f97316 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 14px rgba(252,184,19,0.35)",
        }}>
          <LayoutOutlined style={{ fontSize: 26, color: "#fff" }} />
        </div>
        <p style={{ margin: 0, color: "#6b7280", fontWeight: 600 }}>
          No {TYPE_LABEL[pageType]} found
        </p>
        <p style={{ margin: 0, fontSize: "0.8rem", color: "#9ca3af" }}>
          Create your first {TYPE_LABEL[pageType]?.slice(0, -1)} to get started
        </p>
      </div>
    );
  }

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(480px, 1fr))",
      gap: 4,
    }}>
      {webpages.map(page => (
        <PageCard
          key={page.id}
          page={page}
          handlePreviewPage={handlePreviewPage}
          handleExpand={handleExpand}
          expandedPageId={expandedPageId}
          handleDeletePage={handleDeletePage}
          handleEditPageInfo={handleEditPageInfo}
          handleDuplicatePage={handleDuplicatePage}
        />
      ))}
    </div>
  );
};

export default RenderPages;
