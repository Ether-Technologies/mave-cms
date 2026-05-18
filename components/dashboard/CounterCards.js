import Link from "next/link";
import { useState } from "react";
import CountUp from "react-countup";
import { Skeleton } from "antd";
import {
  PictureOutlined, AppstoreOutlined, FileTextOutlined,
  ReadOutlined, TeamOutlined, ClockCircleOutlined,
} from "@ant-design/icons";

const getCount = (val) => {
  if (!val) return 0;
  if (Array.isArray(val)) return val.length;
  if (typeof val === "object") {
    if (typeof val.total === "number") return val.total;
    if (typeof val.count === "number") return val.count;
    if (Array.isArray(val.data)) return val.data.length;
    // paginated object with numeric keys
    const keys = Object.keys(val).filter(k => !isNaN(k));
    if (keys.length > 0) return keys.length;
  }
  return 0;
};

export default function CounterCards({ data = {}, loading }) {
  const [hovered, setHovered] = useState(null);

  const mediaCount    = getCount(data.media);
  const pagesCount    = getCount(data.pages);
  const blogsCount    = getCount(data.blogs);
  const usersCount    = getCount(data.users);

  const componentsCount =
    getCount(data.menus) +
    getCount(data.navbars) +
    getCount(data.sliders) +
    getCount(data.cards) +
    getCount(data.forms) +
    getCount(data.footers);

  const CARDS = [
    { title: "Media",            value: mediaCount,      link: "/gallery",                 icon: <PictureOutlined />,     sub: "Total assets",     up: true  },
    { title: "Components",       value: componentsCount, link: "#",                        icon: <AppstoreOutlined />,    sub: "Registered",       up: true  },
    { title: "Pages",            value: pagesCount,      link: "/pages",                   icon: <FileTextOutlined />,    sub: "Published + Draft", up: true  },
    { title: "Blogs",            value: blogsCount,      link: "/blogs",                   icon: <ReadOutlined />,        sub: "All posts",        up: true  },
    { title: "Users",            value: usersCount,      link: "/settings/users-settings", icon: <TeamOutlined />,        sub: "Active accounts",  up: true  },
    { title: "Pending Approval", value: 0,               link: "#",                        icon: <ClockCircleOutlined />, sub: "Awaiting review",  up: false },
  ];

  if (loading) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: "1rem" }}>
        {Array(6).fill(0).map((_, i) => (
          <div key={i} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "1.25rem 1.4rem" }}>
            <Skeleton active paragraph={{ rows: 2 }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: "1rem" }}>
      {CARDS.map((card, i) => (
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

            {/* Icon */}
            <div style={{ marginBottom: "1rem" }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: "rgba(252,184,19,0.1)",
                border: "1px solid rgba(252,184,19,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#d97706", fontSize: "1.1rem",
              }}>
                {card.icon}
              </div>
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
            <p style={{ color: "#9ca3af", fontSize: "0.72rem", margin: "2px 0 0" }}>
              {card.sub}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
