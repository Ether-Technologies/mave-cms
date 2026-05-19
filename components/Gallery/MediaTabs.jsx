import React, { useState } from "react";
import MediaGrid from "./MediaGrid";
import Cloudinary from "./Cloudinary";
import {
  PictureOutlined, VideoCameraOutlined, FileTextOutlined,
  CloudOutlined, AppstoreOutlined,
} from "@ant-design/icons";

const TAB_CFG = [
  { key: "all",       label: "All",         icon: <AppstoreOutlined />,     accent: "#6b7280", bg: "#f3f4f6"  },
  { key: "images",    label: "Images",      icon: <PictureOutlined />,      accent: "#16a34a", bg: "#dcfce7"  },
  { key: "videos",    label: "Videos",      icon: <VideoCameraOutlined />,  accent: "#1d4ed8", bg: "#dbeafe"  },
  { key: "docs",      label: "Documents",   icon: <FileTextOutlined />,     accent: "#b45309", bg: "#fef3c7"  },
  { key: "cloud",     label: "Cloudinary",  icon: <CloudOutlined />,        accent: "#7c3aed", bg: "#ede9fe"  },
];

const TypeChip = ({ cfg, count, active, onClick }) => (
  <button
    onClick={onClick}
    style={{
      display: "flex", alignItems: "center", gap: 7,
      height: 36, padding: "0 14px", borderRadius: 20,
      border: active ? "none" : "1px solid #e5e7eb",
      background: active ? "#111827" : "#fff",
      color: active ? "#fcb813" : "#374151",
      cursor: "pointer", fontSize: "0.8rem", fontWeight: 600,
      transition: "all 0.15s",
      boxShadow: active ? "0 2px 8px rgba(17,24,39,0.2)" : "none",
    }}
  >
    <span style={{ color: active ? "#fcb813" : cfg.accent, display: "flex" }}>{cfg.icon}</span>
    {cfg.label}
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      minWidth: 20, height: 20, borderRadius: 10, padding: "0 5px",
      background: active ? "rgba(252,184,19,0.2)" : cfg.bg,
      color: active ? "#fcb813" : cfg.accent,
      fontSize: "0.68rem", fontWeight: 700,
    }}>{count}</span>
  </button>
);

const EmptyState = ({ label }) => (
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
      <PictureOutlined style={{ fontSize: 26, color: "#fff" }} />
    </div>
    <p style={{ margin: 0, color: "#6b7280", fontWeight: 600 }}>No {label} found</p>
    <p style={{ margin: 0, fontSize: "0.8rem", color: "#9ca3af" }}>Upload some media to get started</p>
  </div>
);

const MediaTabs = ({ images, videos, docs, handleEdit, handleDelete, handlePreview, viewType }) => {
  const [activeTab, setActiveTab] = useState("all");

  const officeDocs = docs.filter(d => d.file_type?.includes("word") || d.file_type?.includes("excel") || d.file_type?.includes("powerpoint"));
  const otherDocs  = docs.filter(d => !d.file_type?.includes("word") && !d.file_type?.includes("excel") && !d.file_type?.includes("powerpoint"));
  const allDocs    = [...officeDocs, ...otherDocs];
  const allItems   = [...images, ...videos, ...allDocs];

  const counts = {
    all:    allItems.length,
    images: images.length,
    videos: videos.length,
    docs:   allDocs.length,
    cloud:  null,
  };

  return (
    <div>
      {/* Type filter chips */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {TAB_CFG.map(cfg => (
          <TypeChip
            key={cfg.key}
            cfg={cfg}
            count={counts[cfg.key] ?? ""}
            active={activeTab === cfg.key}
            onClick={() => setActiveTab(cfg.key)}
          />
        ))}
      </div>

      {/* Content */}
      {activeTab === "cloud" ? (
        <Cloudinary />
      ) : activeTab === "all" ? (
        allItems.length > 0 ? (
          <MediaGrid
            mediaItems={allItems}
            mediaTypeMap={{ ...Object.fromEntries(images.map(m => [m.id, "image"])), ...Object.fromEntries(videos.map(m => [m.id, "video"])), ...Object.fromEntries(allDocs.map(m => [m.id, "document"])) }}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            handlePreview={handlePreview}
            viewType={viewType}
          />
        ) : <EmptyState label="media" />
      ) : activeTab === "images" ? (
        images.length > 0 ? (
          <MediaGrid mediaItems={images} mediaType="image" handleEdit={handleEdit} handleDelete={handleDelete} handlePreview={handlePreview} viewType={viewType} />
        ) : <EmptyState label="images" />
      ) : activeTab === "videos" ? (
        videos.length > 0 ? (
          <MediaGrid mediaItems={videos} mediaType="video" handleEdit={handleEdit} handleDelete={handleDelete} handlePreview={handlePreview} viewType={viewType} />
        ) : <EmptyState label="videos" />
      ) : activeTab === "docs" ? (
        allDocs.length > 0 ? (
          <MediaGrid mediaItems={allDocs} mediaType="document" handleEdit={handleEdit} handleDelete={handleDelete} handlePreview={handlePreview} viewType={viewType} />
        ) : <EmptyState label="documents" />
      ) : null}
    </div>
  );
};

export default MediaTabs;
