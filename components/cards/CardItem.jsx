import React, { useState } from "react";
import { Popconfirm } from "antd";
import { EyeOutlined, DeleteOutlined, PlayCircleOutlined } from "@ant-design/icons";
import Image from "next/image";

const TAG_COLORS = [
  "#fcb813","#8b5cf6","#06b6d4","#10b981",
  "#f43f5e","#3b82f6","#f97316","#84cc16",
];
const getTagColor = (i) => TAG_COLORS[i % TAG_COLORS.length];

function GhostBtn({ icon, label, onClick, red = false }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 5,
        height: 32, padding: "0 14px", borderRadius: 8,
        border: red
          ? `1.5px solid ${hov ? "#dc2626" : "rgba(255,255,255,0.4)"}`
          : "none",
        background: red
          ? (hov ? "#dc2626" : "rgba(255,255,255,0.1)")
          : (hov ? "#e3a611" : "#fcb813"),
        color: red ? "#fff" : "#111",
        fontWeight: 700, fontSize: "0.78rem",
        cursor: "pointer", backdropFilter: "blur(6px)",
        transition: "all 0.18s", letterSpacing: "0.01em",
      }}
    >
      {icon} {label}
    </button>
  );
}

function MediaBg({ card }) {
  const [playing, setPlaying] = useState(false);
  const file    = card?.media_files;
  const isVideo = file?.file_type?.startsWith("video/");
  const url     = file?.file_path
    ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/${file.file_path}`
    : null;

  if (!file || !url) {
    return (
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg, #1f2937 0%, #374151 100%)",
        fontSize: 40, opacity: 0.3,
      }}>🃏</div>
    );
  }

  if (isVideo) {
    return (
      <>
        <video
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          preload="metadata" muted={!playing} playsInline
          onClick={(e) => {
            e.stopPropagation();
            const v = e.currentTarget;
            v.paused ? (v.play(), setPlaying(true)) : (v.pause(), setPlaying(false));
          }}
          onEnded={() => setPlaying(false)}
        >
          <source src={`${url}#t=0.1`} type={file.file_type} />
        </video>
        {!playing && (
          <div style={{ position: "absolute", inset: 0, pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(255,255,255,0.2)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <PlayCircleOutlined style={{ fontSize: 22, color: "#fff" }} />
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <Image
      alt={card?.title_en || "Card"}
      src={url}
      layout="fill"
      objectFit="cover"
      onError={(e) => { e.target.src = "/images/Image_Placeholder.png"; }}
    />
  );
}

function GridCard({ card, onDeleteCard, onPreviewCard }) {
  const [hov, setHov] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const tags   = card?.additional?.tags || [];
  const active = card?.status === 1;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); setConfirmOpen(false); }}
      style={{
        position: "relative", borderRadius: 16,
        overflow: "hidden", height: 280,
        background: "#1f2937", cursor: "pointer",
        boxShadow: hov ? "0 20px 48px rgba(0,0,0,0.22)" : "0 2px 8px rgba(0,0,0,0.08)",
        transform: hov ? "translateY(-4px) scale(1.01)" : "translateY(0) scale(1)",
        transition: "all 0.28s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      {/* Image zoom container */}
      <div style={{
        position: "absolute", inset: 0,
        transform: hov ? "scale(1.06)" : "scale(1)",
        transition: "transform 0.4s cubic-bezier(0.4,0,0.2,1)",
      }}>
        <MediaBg card={card} />
      </div>

      {/* Gradient overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: hov
          ? "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.08) 100%)"
          : "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.28) 55%, transparent 100%)",
        transition: "background 0.3s",
      }} />

      {/* Status */}
      <div style={{
        position: "absolute", top: 12, left: 12,
        background: active ? "rgba(34,197,94,0.18)" : "rgba(255,255,255,0.1)",
        backdropFilter: "blur(8px)",
        border: `1px solid ${active ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.2)"}`,
        color: active ? "#4ade80" : "rgba(255,255,255,0.55)",
        fontSize: "0.6rem", fontWeight: 700,
        padding: "3px 9px", borderRadius: 99,
        letterSpacing: "0.06em", textTransform: "uppercase",
      }}>
        {active ? "● Active" : "○ Draft"}
      </div>

      {/* ID */}
      <div style={{
        position: "absolute", top: 14, right: 12,
        color: "rgba(255,255,255,0.3)", fontSize: "0.58rem",
        fontFamily: "monospace", fontWeight: 600,
      }}>
        #{card.id}
      </div>

      {/* Bottom content */}
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "0 14px 14px" }}>

        {/* Tags */}
        {tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
            {tags.slice(0, 3).map((tag, i) => (
              <span key={tag} style={{
                background: `${getTagColor(i)}28`,
                border: `1px solid ${getTagColor(i)}55`,
                color: getTagColor(i),
                fontSize: "0.58rem", fontWeight: 700,
                padding: "2px 8px", borderRadius: 99,
                backdropFilter: "blur(4px)",
                letterSpacing: "0.03em",
              }}>{tag}</span>
            ))}
            {tags.length > 3 && (
              <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.58rem", alignSelf: "center" }}>
                +{tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <p style={{
          margin: "0 0 3px", fontSize: "0.92rem", fontWeight: 700,
          color: "#fff", lineHeight: 1.35,
          overflow: "hidden", display: "-webkit-box",
          WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
          textShadow: "0 1px 4px rgba(0,0,0,0.6)",
        }}>
          {card?.title_en || "Untitled Card"}
        </p>

        {card?.page_name && (
          <p style={{ margin: "0 0 10px", fontSize: "0.67rem", color: "rgba(255,255,255,0.45)", fontWeight: 500 }}>
            {card.page_name}
          </p>
        )}

        {/* Actions slide up */}
        <div style={{
          display: "flex", gap: 8,
          transform: hov ? "translateY(0)" : "translateY(14px)",
          opacity: hov ? 1 : 0,
          transition: "all 0.24s cubic-bezier(0.4,0,0.2,1)",
          pointerEvents: hov ? "auto" : "none",
        }}>
          <GhostBtn icon={<EyeOutlined />} label="Preview" onClick={() => onPreviewCard(card)} />
          <Popconfirm
            title="Delete this card?"
            open={confirmOpen}
            onConfirm={() => { setConfirmOpen(false); onDeleteCard(card.id); }}
            onCancel={() => setConfirmOpen(false)}
            okText="Delete"
            okButtonProps={{ danger: true }}
          >
            <GhostBtn icon={<DeleteOutlined />} label="Delete" red onClick={() => setConfirmOpen(true)} />
          </Popconfirm>
        </div>
      </div>
    </div>
  );
}

function ListCard({ card, onDeleteCard, onPreviewCard }) {
  const [hov, setHov] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const tags   = card?.additional?.tags || [];
  const active = card?.status === 1;
  const url    = card?.media_files?.file_path
    ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/${card.media_files.file_path}`
    : null;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 14, padding: "10px 16px",
        background: hov ? "#fffbeb" : "#fff",
        border: `1px solid ${hov ? "#fde68a" : "#e5e7eb"}`,
        borderLeft: `3px solid ${active ? "#22c55e" : "#d1d5db"}`,
        borderRadius: 10, marginBottom: 8,
        transition: "all 0.15s",
        boxShadow: hov ? "0 2px 12px rgba(252,184,19,0.1)" : "none",
      }}
    >
      <div style={{ width: 68, height: 50, borderRadius: 8, overflow: "hidden", flexShrink: 0, background: "#1f2937", position: "relative" }}>
        {url
          ? <Image src={url} alt={card?.title_en || ""} layout="fill" objectFit="cover" onError={(e) => { e.target.src = "/images/Image_Placeholder.png"; }} />
          : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, opacity: 0.3 }}>🃏</div>
        }
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: "0.88rem", color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {card?.title_en || "Untitled Card"}
        </p>
        {card?.page_name && <p style={{ margin: "2px 0 0", fontSize: "0.7rem", color: "#9ca3af" }}>{card.page_name}</p>}
        {tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 5 }}>
            {tags.slice(0, 4).map((tag, i) => (
              <span key={tag} style={{
                background: `${getTagColor(i)}15`, color: getTagColor(i),
                border: `1px solid ${getTagColor(i)}35`,
                fontSize: "0.6rem", fontWeight: 700, padding: "1px 7px", borderRadius: 99,
              }}>{tag}</span>
            ))}
          </div>
        )}
      </div>

      <div style={{
        padding: "3px 10px", borderRadius: 99, flexShrink: 0,
        background: active ? "#dcfce7" : "#f3f4f6",
        color: active ? "#16a34a" : "#9ca3af",
        fontSize: "0.65rem", fontWeight: 700,
        border: `1px solid ${active ? "#bbf7d0" : "#e5e7eb"}`,
      }}>
        {active ? "Active" : "Draft"}
      </div>

      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
        <button
          onClick={() => onPreviewCard(card)}
          style={{ height: 32, padding: "0 12px", borderRadius: 8, border: "none", background: "#fcb813", color: "#111", fontWeight: 700, fontSize: "0.75rem", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, transition: "background 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.background = "#e3a611"}
          onMouseLeave={e => e.currentTarget.style.background = "#fcb813"}
        >
          <EyeOutlined /> Preview
        </button>
        <Popconfirm
          title="Delete this card?"
          open={confirmOpen}
          onConfirm={() => { setConfirmOpen(false); onDeleteCard(card.id); }}
          onCancel={() => setConfirmOpen(false)}
          okText="Delete" okButtonProps={{ danger: true }}
        >
          <button
            onClick={() => setConfirmOpen(true)}
            style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #fecaca", background: "#fff5f5", color: "#dc2626", cursor: "pointer", fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#dc2626"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fff5f5"; e.currentTarget.style.color = "#dc2626"; }}
          >
            <DeleteOutlined />
          </button>
        </Popconfirm>
      </div>
    </div>
  );
}

const CardItem = ({ card, viewType, onDeleteCard, onPreviewCard }) =>
  viewType === "grid"
    ? <GridCard card={card} onDeleteCard={onDeleteCard} onPreviewCard={onPreviewCard} />
    : <ListCard card={card} onDeleteCard={onDeleteCard} onPreviewCard={onPreviewCard} />;

export default CardItem;
