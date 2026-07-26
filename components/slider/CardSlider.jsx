import React, { useState } from "react";
import { Popconfirm } from "antd";
import { DeleteOutlined, EditOutlined, CreditCardOutlined } from "@ant-design/icons";
import Image from "next/image";

/* CSS card-deck stack rendered purely in JSX */
const CardDeck = ({ cards = [], MEDIA_URL }) => {
  const placeholder = "/images/Image_Placeholder.png";
  const deckItems = cards.slice(0, 3);

  return (
    <div style={{ position: "relative", width: 140, height: 94, margin: "0 auto" }}>
      {/* Back cards (decorative) */}
      {[
        { rotate: "8deg",  top: 12, left: 18, opacity: 0.35 },
        { rotate: "-5deg", top: 7,  left: 10, opacity: 0.55 },
      ].map((s, i) => (
        <div key={i} style={{
          position: "absolute", width: 130, height: 82,
          borderRadius: 10, overflow: "hidden",
          background: "rgba(255,255,255,0.18)",
          border: "1px solid rgba(255,255,255,0.3)",
          top: s.top, left: s.left,
          transform: `rotate(${s.rotate})`,
          opacity: s.opacity,
        }} />
      ))}

      {/* Front card */}
      <div style={{
        position: "absolute", width: 130, height: 82,
        borderRadius: 10, overflow: "hidden", top: 0, left: 0,
        background: "rgba(255,255,255,0.95)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
      }}>
        {deckItems[0]?.media_files?.file_path ? (
          <Image
            src={`${MEDIA_URL}/${deckItems[0].media_files.file_path}`}
            alt={deckItems[0].title_en || "Card"}
            layout="fill" objectFit="cover"
          />
        ) : (
          <div style={{
            width: "100%", height: "100%",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 4,
            background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)",
          }}>
            <CreditCardOutlined style={{ fontSize: 24, color: "#7c3aed" }} />
            {deckItems[0]?.title_en && (
              <span style={{ fontSize: "0.6rem", color: "#7c3aed", fontWeight: 700, textAlign: "center", padding: "0 6px" }}>
                {deckItems[0].title_en}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const CardSlider = ({ slider, MEDIA_URL, handleEditClick, handleDeleteSlider, viewType }) => {
  const [hovered, setHovered] = useState(false);
  const hasCards = Array.isArray(slider.cards) && slider.cards.length > 0;
  const tags = slider.additional?.tags || [];
  const count = slider.cards?.length || 0;

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
        {/* Purple accent stripe */}
        <div style={{ width: 4, background: "linear-gradient(180deg, #7c3aed 0%, #4c1d95 100%)", flexShrink: 0 }} />

        {/* Icon block */}
        <div style={{
          width: 90, height: 64, flexShrink: 0,
          background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
        }}>
          <CreditCardOutlined style={{ color: "#a78bfa", fontSize: 20 }} />
          <span style={{ color: "#c4b5fd", fontSize: "0.6rem", fontWeight: 700 }}>{count} cards</span>
        </div>

        {/* Meta */}
        <div style={{ flex: 1, minWidth: 0, padding: "10px 12px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
            <CreditCardOutlined style={{ color: "#7c3aed", fontSize: "0.8rem" }} />
            <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#7c3aed", textTransform: "uppercase", letterSpacing: "0.06em" }}>Card Slider</span>
          </div>
          <span style={{ fontWeight: 700, color: "#111827", fontSize: "0.88rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {slider.title_en || "Untitled Slider"}
          </span>
          {tags.length > 0 && (
            <div style={{ display: "flex", gap: 3, marginTop: 4, flexWrap: "wrap" }}>
              {tags.slice(0, 3).map(t => (
                <span key={t} style={{ padding: "1px 6px", borderRadius: 3, background: "#f5f3ff", color: "#6d28d9", fontSize: "0.64rem", fontWeight: 600 }}>{t}</span>
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
              border: "1px solid #ddd6fe", background: "#f5f3ff",
              cursor: "pointer", fontSize: "0.78rem", color: "#6d28d9", fontWeight: 600,
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

  /* ── Grid view — card deck style ── */
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: 16, overflow: "hidden",
        transition: "all 0.25s",
        boxShadow: hovered
          ? "0 20px 40px rgba(30,27,75,0.35)"
          : "0 2px 10px rgba(30,27,75,0.15)",
        transform: hovered ? "translateY(-4px) scale(1.01)" : "none",
      }}
    >
      {/* Deck preview area — dark navy with dot pattern */}
      <div style={{
        position: "relative", height: 200, overflow: "hidden",
        background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #3730a3 100%)",
      }}>
        {/* Subtle dot pattern */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "radial-gradient(circle, rgba(167,139,250,0.15) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }} />

        {/* Decorative corner glow */}
        <div style={{
          position: "absolute", top: -30, right: -30,
          width: 120, height: 120, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(167,139,250,0.25) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", bottom: -20, left: -20,
          width: 80, height: 80, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(109,40,217,0.3) 0%, transparent 70%)",
        }} />

        {/* Card deck illustration */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 14,
        }}>
          {hasCards ? (
            <CardDeck cards={slider.cards} MEDIA_URL={MEDIA_URL} />
          ) : (
            <div style={{ opacity: 0.6 }}>
              <CardDeck cards={[]} MEDIA_URL={MEDIA_URL} />
            </div>
          )}

          {/* Count pill */}
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "rgba(167,139,250,0.2)",
            border: "1px solid rgba(167,139,250,0.4)",
            backdropFilter: "blur(4px)",
            padding: "4px 14px", borderRadius: 20,
          }}>
            <CreditCardOutlined style={{ color: "#c4b5fd", fontSize: "0.75rem" }} />
            <span style={{ color: "#e9d5ff", fontSize: "0.72rem", fontWeight: 700 }}>
              {count} card{count !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Top badges */}
        <div style={{
          position: "absolute", top: 12, left: 12,
          display: "flex", alignItems: "center", gap: 5,
          background: "rgba(109,40,217,0.85)",
          backdropFilter: "blur(6px)",
          padding: "4px 10px", borderRadius: 20,
        }}>
          <CreditCardOutlined style={{ color: "#e9d5ff", fontSize: "0.7rem" }} />
          <span style={{ color: "#e9d5ff", fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase" }}>Card</span>
        </div>

        {/* Hover action overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "rgba(30,27,75,0.6)",
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
              border: "2px solid rgba(255,255,255,0.6)", background: "rgba(239,68,68,0.85)",
              cursor: "pointer", fontSize: "0.85rem", color: "#fff", fontWeight: 800,
            }}>
              <DeleteOutlined />
            </button>
          </Popconfirm>
        </div>
      </div>

      {/* White footer — title + tags */}
      <div style={{ background: "#fff", padding: "12px 14px" }}>
        <div style={{ marginBottom: 6 }}>
          <h3 style={{
            margin: 0, fontWeight: 800, color: "#111827",
            fontSize: "0.95rem", overflow: "hidden",
            textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>
            {slider.title_en || "Untitled Slider"}
          </h3>
          {slider.title_bn && (
            <p style={{ margin: "2px 0 0", fontSize: "0.75rem", color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {slider.title_bn}
            </p>
          )}
        </div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", minHeight: 22 }}>
          {tags.length > 0 ? (
            <>
              {tags.slice(0, 4).map(t => (
                <span key={t} style={{
                  padding: "2px 8px", borderRadius: 4,
                  background: "#f5f3ff", color: "#6d28d9",
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
    </div>
  );
};

export default CardSlider;
