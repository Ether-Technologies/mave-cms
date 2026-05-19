import React, { useState } from "react";
import { Popconfirm } from "antd";
import {
  DeleteOutlined, EyeOutlined, FileTextOutlined,
  FilePdfOutlined, FileWordOutlined, FileExcelOutlined,
  VideoCameraOutlined, PictureOutlined,
} from "@ant-design/icons";
import Image from "next/image";

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL;

const TypeBadge = ({ type, fileType }) => {
  const cfg = {
    image:    { bg: "#dcfce7", color: "#15803d", label: "IMG" },
    video:    { bg: "#dbeafe", color: "#1d4ed8", label: "VID" },
    document: { bg: "#fef3c7", color: "#b45309", label: fileType?.includes("pdf") ? "PDF" : "DOC" },
  }[type] || { bg: "#f3f4f6", color: "#6b7280", label: "FILE" };

  return (
    <span style={{
      padding: "2px 7px", borderRadius: 5, fontSize: "0.6rem", fontWeight: 800,
      background: cfg.bg, color: cfg.color, letterSpacing: "0.06em",
    }}>
      {cfg.label}
    </span>
  );
};

const DocIcon = ({ fileType }) => {
  const style = { fontSize: 40 };
  if (fileType?.includes("pdf"))        return <FilePdfOutlined   style={{ ...style, color: "#ef4444" }} />;
  if (fileType?.includes("word"))       return <FileWordOutlined   style={{ ...style, color: "#2563eb" }} />;
  if (fileType?.includes("excel"))      return <FileExcelOutlined  style={{ ...style, color: "#16a34a" }} />;
  return <FileTextOutlined style={{ ...style, color: "#f59e0b" }} />;
};

const supportedImages = ["image/png","image/jpg","image/jpeg","image/svg+xml","image/webp","image/gif"];

/* ── Grid card ── */
const GridCard = ({ media, mediaType, handleDelete, handlePreview }) => {
  const [hovered, setHovered] = useState(false);
  const src = `${MEDIA_URL}/${media.file_path}`;
  const isSupported = supportedImages.includes(media.file_type);
  const tags = media.tags || [];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 14, overflow: "hidden",
        background: "#fff", border: "1px solid #e5e7eb",
        transition: "all 0.25s",
        boxShadow: hovered ? "0 12px 32px rgba(0,0,0,0.14)" : "0 1px 6px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-3px)" : "none",
      }}
    >
      {/* Media area */}
      <div style={{ position: "relative", height: 180, overflow: "hidden", background: "#f3f4f6" }}>

        {/* Media content */}
        {mediaType === "image" && isSupported ? (
          <Image
            src={src} alt={media.file_name} layout="fill" objectFit="cover"
            style={{ transition: "transform 0.4s", transform: hovered ? "scale(1.06)" : "scale(1)" }}
          />
        ) : mediaType === "video" ? (
          <>
            <Image
              src={media.thumbnail_url || "/images/Image_Placeholder.png"}
              alt={media.file_name} layout="fill" objectFit="cover"
              style={{ opacity: 0.7 }}
            />
            <div style={{
              position: "absolute", inset: 0,
              background: "rgba(0,0,0,0.35)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: "50%",
                background: "rgba(255,255,255,0.9)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 4px 14px rgba(0,0,0,0.3)",
              }}>
                <VideoCameraOutlined style={{ fontSize: 20, color: "#111827" }} />
              </div>
            </div>
          </>
        ) : mediaType === "document" ? (
          <div style={{
            width: "100%", height: "100%",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 8,
            background: "linear-gradient(135deg, #fafafa 0%, #f3f4f6 100%)",
          }}>
            <DocIcon fileType={media.file_type} />
            <span style={{ fontSize: "0.72rem", color: "#6b7280", fontWeight: 500, maxWidth: 120, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {media.file_name}
            </span>
          </div>
        ) : (
          <Image src="/images/Image_Placeholder.png" alt="placeholder" layout="fill" objectFit="cover" />
        )}

        {/* Type badge — top left */}
        <div style={{ position: "absolute", top: 10, left: 10 }}>
          <TypeBadge type={mediaType} fileType={media.file_type} />
        </div>

        {/* Hover overlay — slides up */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.25s",
          display: "flex", flexDirection: "column",
          justifyContent: "flex-end", padding: "12px 12px 10px",
        }}>
          <p style={{
            margin: "0 0 8px", color: "#fff", fontWeight: 700,
            fontSize: "0.82rem", overflow: "hidden",
            textOverflow: "ellipsis", whiteSpace: "nowrap",
            textShadow: "0 1px 3px rgba(0,0,0,0.5)",
          }}>
            {media.title || media.file_name}
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => handlePreview(media)}
              style={{
                flex: 1, height: 32, borderRadius: 8,
                border: "none", background: "#fcb813", color: "#111827",
                cursor: "pointer", fontWeight: 700, fontSize: "0.78rem",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
              }}
            >
              <EyeOutlined /> Preview
            </button>
            <Popconfirm
              title="Delete this media?"
              onConfirm={() => handleDelete(media.id)}
              okText="Delete" cancelText="Cancel"
              okButtonProps={{ danger: true }}
            >
              <button style={{
                width: 32, height: 32, borderRadius: 8,
                border: "2px solid rgba(255,255,255,0.5)",
                background: "rgba(239,68,68,0.85)", color: "#fff",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <DeleteOutlined style={{ fontSize: "0.8rem" }} />
              </button>
            </Popconfirm>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: "10px 12px" }}>
        <p style={{
          margin: 0, fontWeight: 700, color: "#111827", fontSize: "0.82rem",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {media.title || media.file_name}
        </p>
        <p style={{
          margin: "2px 0 6px", color: "#9ca3af", fontSize: "0.7rem",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
        }}>
          {media.file_name}
        </p>
        {tags.length > 0 && (
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {tags.slice(0, 3).map(t => (
              <span key={t} style={{
                padding: "1px 7px", borderRadius: 4,
                background: "#fef9c3", color: "#854d0e",
                fontSize: "0.65rem", fontWeight: 600,
              }}>{t}</span>
            ))}
            {tags.length > 3 && (
              <span style={{ padding: "1px 7px", borderRadius: 4, background: "#f3f4f6", color: "#6b7280", fontSize: "0.65rem" }}>
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

/* ── List row ── */
const ListCard = ({ media, mediaType, handleDelete, handlePreview }) => {
  const [hovered, setHovered] = useState(false);
  const src = `${MEDIA_URL}/${media.file_path}`;
  const isSupported = supportedImages.includes(media.file_type);
  const tags = media.tags || [];

  const typeAccent = { image: "#22c55e", video: "#3b82f6", document: "#f59e0b" }[mediaType] || "#6b7280";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex", gap: 0, alignItems: "stretch",
        background: "#fff", borderRadius: 12, overflow: "hidden",
        border: "1px solid #e5e7eb", transition: "all 0.2s",
        boxShadow: hovered ? "0 4px 16px rgba(0,0,0,0.09)" : "0 1px 4px rgba(0,0,0,0.04)",
      }}
    >
      {/* Accent stripe */}
      <div style={{ width: 4, background: typeAccent, flexShrink: 0 }} />

      {/* Thumbnail */}
      <div style={{ width: 80, height: 60, flexShrink: 0, position: "relative", background: "#f3f4f6" }}>
        {mediaType === "image" && isSupported ? (
          <Image src={src} alt={media.file_name} layout="fill" objectFit="cover" />
        ) : mediaType === "video" ? (
          <div style={{ width: "100%", height: "100%", background: "#1f2937", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <VideoCameraOutlined style={{ color: "#60a5fa", fontSize: 20 }} />
          </div>
        ) : (
          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <DocIcon fileType={media.file_type} />
          </div>
        )}
      </div>

      {/* Meta */}
      <div style={{ flex: 1, minWidth: 0, padding: "10px 12px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
          <span style={{ fontWeight: 700, color: "#111827", fontSize: "0.88rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {media.title || media.file_name}
          </span>
          <TypeBadge type={mediaType} fileType={media.file_type} />
        </div>
        <span style={{ fontSize: "0.7rem", color: "#9ca3af", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {media.file_name}
        </span>
        {tags.length > 0 && (
          <div style={{ display: "flex", gap: 3, marginTop: 4, flexWrap: "wrap" }}>
            {tags.slice(0, 4).map(t => (
              <span key={t} style={{ padding: "1px 6px", borderRadius: 3, background: "#fef9c3", color: "#854d0e", fontSize: "0.64rem", fontWeight: 600 }}>{t}</span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 14px", flexShrink: 0 }}>
        <button
          onClick={() => handlePreview(media)}
          style={{
            display: "flex", alignItems: "center", gap: 4,
            height: 32, padding: "0 12px", borderRadius: 8,
            border: "1px solid #e5e7eb", background: "#f9fafb",
            cursor: "pointer", fontSize: "0.78rem", color: "#374151", fontWeight: 600,
          }}
        >
          <EyeOutlined /> Preview
        </button>
        <Popconfirm
          title="Delete this media?"
          onConfirm={() => handleDelete(media.id)}
          okText="Delete" cancelText="Cancel"
          okButtonProps={{ danger: true }}
        >
          <button style={{
            display: "flex", alignItems: "center", gap: 4,
            height: 32, padding: "0 10px", borderRadius: 8,
            border: "1px solid #fecaca", background: "#fff5f5",
            cursor: "pointer", fontSize: "0.78rem", color: "#ef4444", fontWeight: 600,
          }}>
            <DeleteOutlined />
          </button>
        </Popconfirm>
      </div>
    </div>
  );
};

const MediaCard = ({ media, mediaType, handleDelete, handlePreview, viewType }) => {
  if (viewType === "list") {
    return <ListCard media={media} mediaType={mediaType} handleDelete={handleDelete} handlePreview={handlePreview} />;
  }
  return <GridCard media={media} mediaType={mediaType} handleDelete={handleDelete} handlePreview={handlePreview} />;
};

export default MediaCard;
