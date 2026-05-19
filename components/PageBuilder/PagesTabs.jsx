import React, { useState } from "react";
import { LayoutOutlined, ApartmentOutlined, FootprintOutlined } from "@ant-design/icons";
import RenderPages from "./Renderpages";

const TAB_CFG = [
  { key: "pages",    label: "Pages",    icon: <LayoutOutlined />,    color: "#3b82f6", bg: "#dbeafe"  },
  { key: "subpages", label: "Subpages", icon: <ApartmentOutlined />, color: "#7c3aed", bg: "#ede9fe"  },
  { key: "footers",  label: "Footers",  icon: <LayoutOutlined />,    color: "#b45309", bg: "#fef3c7"  },
];

const TypeChip = ({ cfg, count, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: "flex", alignItems: "center", gap: 7,
      height: 36, padding: "0 16px", borderRadius: 20,
      border: active ? "none" : "1px solid #e5e7eb",
      background: active ? "#111827" : "#fff",
      color: active ? "#fcb813" : "#374151",
      cursor: "pointer", fontSize: "0.8rem", fontWeight: 600,
      transition: "all 0.15s",
      boxShadow: active ? "0 2px 8px rgba(17,24,39,0.2)" : "none",
    }}
  >
    <span style={{ color: active ? "#fcb813" : cfg.color, display: "flex" }}>{cfg.icon}</span>
    {cfg.label}
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      minWidth: 20, height: 20, borderRadius: 10, padding: "0 5px",
      background: active ? "rgba(252,184,19,0.2)" : cfg.bg,
      color: active ? "#fcb813" : cfg.color,
      fontSize: "0.68rem", fontWeight: 700,
    }}>{count}</span>
  </button>
);

const PagesTabs = ({
  typePages = [],
  typeSubpages = [],
  typeFooters = [],
  handleExpand,
  expandedPageId,
  handleDeletePage,
  handlePreviewPage,
  handleEditPageInfo,
  handleDuplicatePage,
}) => {
  const [active, setActive] = useState("pages");

  const counts = { pages: typePages.length, subpages: typeSubpages.length, footers: typeFooters.length };
  const dataMap = { pages: typePages, subpages: typeSubpages, footers: typeFooters };

  return (
    <div>
      {/* Chip filter */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {TAB_CFG.map(cfg => (
          <TypeChip
            key={cfg.key}
            cfg={cfg}
            count={counts[cfg.key]}
            active={active === cfg.key}
            onClick={() => setActive(cfg.key)}
          />
        ))}
      </div>

      {/* Content */}
      <RenderPages
        webpages={dataMap[active]}
        handlePreviewPage={handlePreviewPage}
        handleExpand={handleExpand}
        expandedPageId={expandedPageId}
        handleDeletePage={handleDeletePage}
        handleEditPageInfo={handleEditPageInfo}
        handleDuplicatePage={handleDuplicatePage}
        pageType={active}
      />
    </div>
  );
};

export default PagesTabs;
