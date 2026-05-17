import Link from "next/link";
import { useState } from "react";
import CountUp from "react-countup";
import {
  PictureOutlined, AppstoreOutlined, FileTextOutlined,
  ReadOutlined, TeamOutlined, ClockCircleOutlined,
} from "@ant-design/icons";

const CARD_CONFIG = [
  { title: "Media",            value: 12600, link: "/gallery",                icon: <PictureOutlined />,     trend: "+8%",  up: true,  sub: "Total assets"    },
  { title: "Components",       value: 287,   link: "#",                       icon: <AppstoreOutlined />,    trend: "+12%", up: true,  sub: "Registered"      },
  { title: "Pages",            value: 65,    link: "/pages",                  icon: <FileTextOutlined />,    trend: "+3%",  up: true,  sub: "Published + Draft"},
  { title: "Blogs",            value: 127,   link: "/blogs",                  icon: <ReadOutlined />,        trend: "+22%", up: true,  sub: "All posts"        },
  { title: "Users",            value: 60,    link: "/settings/users-settings",icon: <TeamOutlined />,        trend: "+5%",  up: true,  sub: "Active accounts"  },
  { title: "Pending Approval", value: 14,    link: "#",                       icon: <ClockCircleOutlined />, trend: "-2%",  up: false, sub: "Awaiting review"  },
];

export default function CounterCards() {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: "1rem" }}>
      {CARD_CONFIG.map((card, i) => (
        <Link href={card.link} key={i}>
          <div
            style={{
              background: "#fff",
              border: `1px solid ${hovered === i ? "#fcb813" : "#e5e7eb"}`,
              borderRadius: 12,
              padding: "1.25rem 1.4rem",
              cursor: "pointer",
              position: "relative",
              overflow: "hidden",
              boxShadow: hovered === i
                ? "0 4px 12px rgba(252,184,19,0.15)"
                : "0 1px 3px rgba(0,0,0,0.06)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Top accent line */}
            <div style={{
              position: "absolute", top: 0, left: 0, width: "100%", height: 3,
              background: hovered === i ? "#fcb813" : "transparent",
              transition: "background 0.2s",
            }} />

            {/* Icon + trend */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: "rgba(252,184,19,0.1)",
                border: "1px solid rgba(252,184,19,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#d97706", fontSize: "1.1rem",
              }}>
                {card.icon}
              </div>
              <span style={{
                fontSize: "0.72rem", fontWeight: 700,
                padding: "3px 9px", borderRadius: 6,
                background: card.up ? "#f0fdf4" : "#fef2f2",
                color: card.up ? "#16a34a" : "#dc2626",
                border: `1px solid ${card.up ? "#bbf7d0" : "#fecaca"}`,
              }}>
                {card.up ? "↑" : "↓"} {card.trend}
              </span>
            </div>

            {/* Number */}
            <CountUp end={card.value} separator="," style={{
              fontSize: "2rem", fontWeight: 800,
              color: "#111827", display: "block", lineHeight: 1, marginBottom: 4,
            }} />

            {/* Title */}
            <p style={{ color: "#374151", fontSize: "0.85rem", fontWeight: 600, margin: 0 }}>
              {card.title}
            </p>
            {/* Subtitle */}
            <p style={{ color: "#9ca3af", fontSize: "0.72rem", marginTop: 2, margin: "2px 0 0" }}>
              {card.sub}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
