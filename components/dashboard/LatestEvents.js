import {
  ContactsFilled,
  FileFilled,
  FileImageFilled,
  MessageFilled,
} from "@ant-design/icons";
import React from "react";

export const activityLog = [
  { categoryType: 1, category: "Page", time: "09:15", type: "New Page", user: "Emily Johnson", description: "New page 'Services' created." },
  { categoryType: 2, category: "Page", time: "10:30", type: "Page Updated", user: "Michael Smith", description: "'Contact Us' page updated with new methods." },
  { categoryType: 3, category: "Form", time: "11:45", type: "Form Submitted", user: "Jane Doe", description: "Contact form submitted — partnership inquiry." },
  { categoryType: 4, category: "Blog", time: "12:00", type: "Blog Published", user: "Alex Turner", description: "'Innovations in AI' published and live." },
  { categoryType: 1, category: "Page", time: "13:20", type: "Page Published", user: "Sophia Lee", description: "'About Us' is now live for visitors." },
  { categoryType: 3, category: "Form", time: "14:05", type: "Form Updated", user: "Daniel Kim", description: "'Newsletter' form updated with new fields." },
  { categoryType: 4, category: "Blog", time: "15:30", type: "Blog Updated", user: "Olivia Martinez", description: "'Sustainable Energy' updated with new data." },
  { categoryType: 2, category: "Page", time: "16:45", type: "Page Deleted", user: "Liam Brown", description: "'Old Projects' page deleted." },
  { categoryType: 1, category: "Page", time: "17:10", type: "New Page", user: "Ava Davis", description: "New 'Careers' page lists job openings." },
  { categoryType: 3, category: "Form", time: "08:50", type: "Form Submitted", user: "Noah Wilson", description: "Feedback form with navigation suggestions." },
  { categoryType: 4, category: "Blog", time: "09:30", type: "Blog Published", user: "Isabella Moore", description: "'The Future of Renewable Energy' is live." },
  { categoryType: 2, category: "Page", time: "10:15", type: "Page Updated", user: "Mason Taylor", description: "'FAQ' page updated with new Q&As." },
  { categoryType: 1, category: "Page", time: "11:00", type: "Page Published", user: "Mia Anderson", description: "'Testimonials' page is now live." },
  { categoryType: 3, category: "Form", time: "12:30", type: "Form Deleted", user: "Ethan Thomas", description: "'Event Registration' form removed." },
  { categoryType: 4, category: "Blog", time: "13:45", type: "Blog Published", user: "Charlotte Jackson", description: "'Marketing Strategies' post is live." },
];

const ICON_MAP = {
  1: { icon: <FileFilled />, color: "#fcb813", bg: "rgba(252,184,19,0.1)", border: "rgba(252,184,19,0.15)" },
  2: { icon: <FileImageFilled />, color: "#3b82f6", bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.15)" },
  3: { icon: <MessageFilled />, color: "#8b5cf6", bg: "rgba(139,92,246,0.1)", border: "rgba(139,92,246,0.15)" },
  4: { icon: <ContactsFilled />, color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.15)" },
};

const BADGE_COLORS = {
  Page: { color: "#3b82f6", bg: "rgba(59,130,246,0.1)", border: "rgba(59,130,246,0.15)" },
  Form: { color: "#8b5cf6", bg: "rgba(139,92,246,0.1)", border: "rgba(139,92,246,0.15)" },
  Blog: { color: "#f59e0b", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.15)" },
};

export default function LatestEvents() {
  const [showAll, setShowAll] = React.useState(false);
  const visibleLogs = showAll ? activityLog : activityLog.slice(0, 5);

  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e8e8e8",
        borderRadius: "12px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "1.25rem 1.5rem 0.75rem",
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <div>
          <h3 style={{ color: "#111827", fontSize: "0.95rem", fontWeight: 700, margin: 0 }}>
            Event Log
          </h3>
          <p style={{ color: "#9ca3af", fontSize: "0.75rem", margin: "2px 0 0" }}>
            Recent content changes
          </p>
        </div>
        <button
          onClick={() => setShowAll((prev) => !prev)}
          style={{
            background: "transparent",
            border: "1px solid #e8e8e8",
            borderRadius: "6px",
            padding: "4px 10px",
            color: "#fcb813",
            fontSize: "0.7rem",
            fontFamily: "monospace",
            cursor: "pointer",
          }}
        >
          {showAll ? "Show less ↑" : "View all →"}
        </button>
      </div>

      {/* Log list */}
      <div
        style={{
          overflowY: showAll ? "scroll" : "visible",
          flex: 1,
          maxHeight: showAll ? 420 : "none",
          scrollbarWidth: "thin",
          scrollbarColor: "#e8e8e8 #ffffff",
        }}
      >
        {visibleLogs.map((log, index) => {
          const iconData = ICON_MAP[log.categoryType];
          const badge = BADGE_COLORS[log.category];
          return (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.75rem",
                padding: "0.75rem 1.5rem",
                borderBottom: "1px solid #f3f4f6",
                transition: "background 0.15s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              {/* Icon */}
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "8px",
                  background: iconData?.bg,
                  border: `1px solid ${iconData?.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: iconData?.color,
                  fontSize: "0.85rem",
                  flexShrink: 0,
                }}
              >
                {iconData?.icon}
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2px" }}>
                  <span style={{ color: "#111827", fontSize: "0.8rem", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {log.type}
                  </span>
                  {badge && (
                    <span
                      style={{
                        fontSize: "0.65rem",
                        fontFamily: "monospace",
                        fontWeight: 700,
                        padding: "2px 7px",
                        borderRadius: "4px",
                        background: badge.bg,
                        border: `1px solid ${badge.border}`,
                        color: badge.color,
                        flexShrink: 0,
                      }}
                    >
                      {log.category}
                    </span>
                  )}
                </div>
                <p style={{ color: "#9ca3af", fontSize: "0.72rem", fontFamily: "monospace", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {log.user} · {log.time}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
