import React, { useState } from "react";
import { Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined, PictureOutlined, PlayCircleOutlined } from "@ant-design/icons";
import Image from "next/image";

const ImageSlider = ({ slider, MEDIA_URL, handleEditClick, handleDeleteSlider, viewType }) => {
  const [hovered, setHovered] = useState(false);
  const imagePlaceholder = "/images/Image_Placeholder.png";
  const hasMedia = Array.isArray(slider.medias) && slider.medias.length > 0;
  const firstMedia = hasMedia ? slider.medias[0] : null;
  const thumbnailSrc = firstMedia?.file_path
    ? `${MEDIA_URL}/${firstMedia.file_path}`
    : imagePlaceholder;
  const tags = slider.additional?.tags || [];
  const count = slider.medias?.length || 0;

  /* ── List view ── */
  if (viewType === "list") {
    return (
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: "flex", gap: 0, alignItems: "stretch",
          background: "#fff", borderRadius: 14, overflow: "hidden",
          border: "1px solid #e5e7eb", transition: "all 0.2s",
          boxShadow: hovered ? "0 6px 20px rgba(0,0,0,0.1)" : "0 1px 4px rgba(0,0,0,0.05)",
        }}
      >
        {/* Blue accent stripe */}
        <div style={{ width: 4, background: "linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)", flexShrink: 0 }} />

        {/* Thumbnail */}
        <div style={{ width: 90, height: 64, position: "relative", flexShrink: 0, background: "#f3f4f6" }}>
          <Image src={thumbnailSrc} alt={slider.title_en || "Slider"} layout="fill" objectFit="cover" />
          {count > 1 && (
            <div style={{
              position: "absolute", bottom: 4, right: 4,
              background: "rgba(0,0,0,0.65)", color: "#fff",
              fontSize: "0.6rem", fontWeight: 700,
              padding: "1px 5px", borderRadius: 10,
            }}>
              {count}
            </div>
          )}
        </div>

        {/* Meta */}
        <div style={{ flex: 1, minWidth: 0, padding: "10px 12px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
            <PictureOutlined style={{ color: "#3b82f6", fontSize: "0.8rem" }} />
            <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.06em" }}>Image Slider</span>
          </div>
          <span style={{ fontWeight: 700, color: "#111827", fontSize: "0.88rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {slider.title_en || "Untitled Slider"}
          </span>
          {tags.length > 0 && (
            <div style={{ display: "flex", gap: 3, marginTop: 4, flexWrap: "wrap" }}>
              {tags.slice(0, 3).map(t => (
                <span key={t} style={{ padding: "1px 6px", borderRadius: 3, background: "#eff6ff", color: "#1d4ed8", fontSize: "0.64rem", fontWeight: 600 }}>{t}</span>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 14px", flexShrink: 0 }}>
          <button
            onClick={() => handleEditClick(slider.id)}
            style={{
              display: "flex", alignItems: "center", gap: 4,
              height: 32, padding: "0 12px", borderRadius: 8,
              border: "1px solid #dbeafe", background: "#eff6ff",
              cursor: "pointer", fontSize: "0.78rem", color: "#1d4ed8", fontWeight: 600,
            }}
          >
            <EditOutlined /> Edit
          </button>
          <Popconfirm
            title="Delete this slider?"
            onConfirm={() => handleDeleteSlider(slider.id)}
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
  }

  /* ── Grid view — cinematic magazine style ── */
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 16, overflow: "hidden",
        transition: "all 0.25s",
        boxShadow: hovered
          ? "0 20px 40px rgba(0,0,0,0.18)"
          : "0 2px 10px rgba(0,0,0,0.08)",
        transform: hovered ? "translateY(-4px) scale(1.01)" : "none",
        background: "#000",
      }}
    >
      {/* Full-bleed image area */}
      <div style={{ position: "relative", height: 230, overflow: "hidden" }}>
        {/* Image */}
        <Image
          src={thumbnailSrc}
          alt={slider.title_en || "Slider"}
          layout="fill"
          objectFit="cover"
          style={{ transition: "transform 0.4s", transform: hovered ? "scale(1.06)" : "scale(1)" }}
        />

        {/* Permanent bottom-up gradient — cinematic */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)",
        }} />

        {/* Top-left: type badge */}
        <div style={{
          position: "absolute", top: 12, left: 12,
          display: "flex", alignItems: "center", gap: 5,
          background: "rgba(59,130,246,0.9)",
          backdropFilter: "blur(6px)",
          padding: "4px 10px", borderRadius: 20,
        }}>
          <PictureOutlined style={{ color: "#fff", fontSize: "0.7rem" }} />
          <span style={{ color: "#fff", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase" }}>Image</span>
        </div>

        {/* Top-right: slide count like a film counter */}
        {count > 0 && (
          <div style={{
            position: "absolute", top: 12, right: 12,
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(6px)",
            padding: "4px 10px", borderRadius: 20,
            display: "flex", alignItems: "center", gap: 5,
          }}>
            <span style={{ color: "#fff", fontSize: "0.68rem", fontWeight: 700 }}>
              {count} {count === 1 ? "slide" : "slides"}
            </span>
          </div>
        )}

        {/* Bottom: title inside image */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px 16px" }}>
          <h3 style={{
            margin: 0, color: "#fff", fontWeight: 800,
            fontSize: "1rem", lineHeight: 1.3,
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            textShadow: "0 1px 4px rgba(0,0,0,0.5)",
          }}>
            {slider.title_en || "Untitled Slider"}
          </h3>
          {slider.title_bn && (
            <p style={{
              margin: "2px 0 0", color: "rgba(255,255,255,0.65)",
              fontSize: "0.75rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {slider.title_bn}
            </p>
          )}
        </div>

        {/* Hover action overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "rgba(37,99,235,0.15)",
          backdropFilter: hovered ? "blur(1px)" : "none",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          opacity: hovered ? 1 : 0, transition: "all 0.2s",
        }}>
          <button
            onClick={() => handleEditClick(slider.id)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              height: 38, padding: "0 18px", borderRadius: 10,
              border: "none", background: "#fcb813",
              cursor: "pointer", fontSize: "0.85rem", color: "#111827", fontWeight: 800,
              boxShadow: "0 4px 12px rgba(252,184,19,0.5)",
            }}
          >
            <EditOutlined /> Edit
          </button>
          <Popconfirm
            title="Delete this slider?"
            onConfirm={() => handleDeleteSlider(slider.id)}
            okText="Delete" cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <button style={{
              display: "flex", alignItems: "center", gap: 6,
              height: 38, padding: "0 14px", borderRadius: 10,
              border: "2px solid rgba(255,255,255,0.8)", background: "rgba(239,68,68,0.85)",
              cursor: "pointer", fontSize: "0.85rem", color: "#fff", fontWeight: 800,
            }}>
              <DeleteOutlined />
            </button>
          </Popconfirm>
        </div>
      </div>

      {/* Tags strip — white footer */}
      <div style={{
        background: "#fff", padding: "10px 14px",
        borderTop: "1px solid rgba(0,0,0,0.06)",
        minHeight: 38, display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap",
      }}>
        {tags.length > 0 ? (
          <>
            {tags.slice(0, 4).map(t => (
              <span key={t} style={{
                padding: "2px 8px", borderRadius: 4,
                background: "#eff6ff", color: "#1d4ed8",
                fontSize: "0.68rem", fontWeight: 600,
              }}>{t}</span>
            ))}
            {tags.length > 4 && (
              <span style={{ padding: "2px 8px", borderRadius: 4, background: "#f3f4f6", color: "#6b7280", fontSize: "0.68rem" }}>
                +{tags.length - 4}
              </span>
            )}
          </>
        ) : (
          <span style={{ fontSize: "0.72rem", color: "#d1d5db" }}>No tags</span>
        )}
      </div>
    </div>
  );
};

export default ImageSlider;
