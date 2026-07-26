// components/PageBuilder/Components/PageLoadingStates.jsx

import React from "react";
import { Spin } from "antd";
import { CodeOutlined, ReloadOutlined, WarningOutlined } from "@ant-design/icons";

const PageLoadingStates = ({ loading, error, pageData, onRetry }) => {
  if (loading || (!pageData && !error)) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", minHeight: "100vh",
        background: "#f1f5f9", gap: 20,
      }}>
        <div style={{
          width: 60, height: 60, borderRadius: 18,
          background: "linear-gradient(135deg, #fcb813 0%, #f97316 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 8px 24px rgba(252,184,19,0.4)",
        }}>
          <CodeOutlined style={{ fontSize: 28, color: "#fff" }} />
        </div>
        <Spin size="large" />
        <div style={{ textAlign: "center" }}>
          <p style={{ margin: 0, color: "#374151", fontWeight: 700, fontSize: "0.95rem" }}>
            Loading Page Builder
          </p>
          <p style={{ margin: "4px 0 0", color: "#9ca3af", fontSize: "0.78rem" }}>
            Fetching page data…
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", minHeight: "100vh",
        background: "#f1f5f9", gap: 16,
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 6px 20px rgba(239,68,68,0.4)",
        }}>
          <WarningOutlined style={{ fontSize: 26, color: "#fff" }} />
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{ margin: 0, color: "#111827", fontWeight: 700, fontSize: "0.95rem" }}>
            Failed to load page
          </p>
          <p style={{ margin: "4px 0 0", color: "#9ca3af", fontSize: "0.78rem", maxWidth: 280 }}>
            {error}
          </p>
        </div>
        <button
          type="button"
          onClick={onRetry}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            height: 38, padding: "0 20px", borderRadius: 10,
            border: "none",
            background: "linear-gradient(135deg, #fcb813 0%, #f97316 100%)",
            color: "#111827", cursor: "pointer",
            fontSize: "0.82rem", fontWeight: 800,
            boxShadow: "0 4px 14px rgba(252,184,19,0.4)",
          }}
        >
          <ReloadOutlined /> Retry
        </button>
      </div>
    );
  }

  return null;
};

export default PageLoadingStates;
