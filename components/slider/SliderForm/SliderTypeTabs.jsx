import React from "react";
import { PictureOutlined, CreditCardOutlined } from "@ant-design/icons";

const SliderTypeTabs = ({ type, handleTypeChange }) => (
  <div style={{ display: "flex", gap: 12 }}>
    {[
      {
        key: "image",
        label: "Image Slider",
        icon: <PictureOutlined />,
        accent: "#3b82f6",
        bg: "#eff6ff",
        border: "#bfdbfe",
        activeBg: "#1d4ed8",
      },
      {
        key: "card",
        label: "Card Slider",
        icon: <CreditCardOutlined />,
        accent: "#7c3aed",
        bg: "#f5f3ff",
        border: "#ddd6fe",
        activeBg: "#5b21b6",
      },
    ].map(({ key, label, icon, accent, bg, border, activeBg }) => {
      const active = type === key;
      return (
        <button
          key={key}
          type="button"
          onClick={() => handleTypeChange(key)}
          style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", gap: 8,
            padding: "16px 12px", borderRadius: 12, cursor: "pointer",
            border: active ? `2px solid ${accent}` : `2px solid ${border}`,
            background: active ? activeBg : bg,
            transition: "all 0.2s",
            boxShadow: active ? `0 4px 14px ${accent}40` : "none",
          }}
        >
          <span style={{
            fontSize: 22,
            color: active ? "#fff" : accent,
          }}>
            {icon}
          </span>
          <span style={{
            fontSize: "0.82rem", fontWeight: 700,
            color: active ? "#fff" : accent,
          }}>
            {label}
          </span>
          {active && (
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "#fcb813",
            }} />
          )}
        </button>
      );
    })}
  </div>
);

export default SliderTypeTabs;
