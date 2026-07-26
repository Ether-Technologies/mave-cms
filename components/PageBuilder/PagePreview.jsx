// components/PageBuilder/PagePreview.jsx

import React, { useState, useEffect } from "react";
import { Spin, message, Modal } from "antd";
import {
  ArrowLeftOutlined, EditOutlined, EyeOutlined,
  LinkOutlined, CodeOutlined, WarningOutlined,
  ApiOutlined, CopyOutlined, CheckOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import instance from "../../axios";
import ComponentRenderer from "./Components/ComponentRenderer";

const TYPE_CFG = {
  Page:    { color: "#3b82f6", bg: "#dbeafe" },
  Subpage: { color: "#7c3aed", bg: "#ede9fe" },
  Footer:  { color: "#b45309", bg: "#fef3c7" },
};

/* ── Tab chip ── */
const Tab = ({ label, icon, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      display: "flex", alignItems: "center", gap: 5,
      height: 30, padding: "0 14px", borderRadius: 7,
      border: "none",
      background: active ? "#fcb813" : "transparent",
      color: active ? "#111827" : "#6b7280",
      cursor: "pointer", fontSize: "0.75rem", fontWeight: 700,
      transition: "all 0.15s",
    }}
  >
    {icon} {label}
  </button>
);

/* ── Copy button with flash ── */
const CopyBtn = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      type="button"
      onClick={handle}
      style={{
        display: "flex", alignItems: "center", gap: 5,
        height: 28, padding: "0 12px", borderRadius: 6,
        border: "1px solid #374151", background: "transparent",
        color: copied ? "#4ade80" : "#9ca3af",
        cursor: "pointer", fontSize: "0.7rem", fontWeight: 600,
        transition: "all 0.15s",
      }}
    >
      {copied ? <CheckOutlined /> : <CopyOutlined />}
      {copied ? "Copied!" : "Copy JSON"}
    </button>
  );
};

/* ── JSON viewer ── */
const JsonViewer = ({ data }) => {
  const json = JSON.stringify(data, null, 2);
  return (
    <div style={{ position: "relative" }}>
      {/* toolbar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 16px",
        background: "#1e293b", borderBottom: "1px solid #334155",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <ApiOutlined style={{ color: "#fcb813", fontSize: "0.85rem" }} />
          <span style={{ color: "#94a3b8", fontSize: "0.72rem", fontWeight: 600 }}>
            API Response
          </span>
          <span style={{
            padding: "1px 7px", borderRadius: 4,
            background: "#0f172a", color: "#4ade80",
            fontSize: "0.62rem", fontWeight: 700,
          }}>200 OK</span>
          <span style={{ fontSize: "0.65rem", color: "#475569" }}>
            /api/pages/{data?.id}
          </span>
        </div>
        <CopyBtn text={json} />
      </div>

      {/* JSON tree: top-level keys as collapsible sections */}
      <div style={{
        background: "#0f172a", fontFamily: "monospace",
        fontSize: "0.78rem", lineHeight: 1.7,
        overflowX: "auto",
      }}>
        <JsonTree data={data} />
      </div>
    </div>
  );
};

/* ── Recursive JSON tree with collapsible nodes ── */
const JsonTree = ({ data, depth = 0, keyName = null, isLast = true }) => {
  const [open, setOpen] = useState(depth < 2);
  const indent = depth * 20;

  if (data === null)     return <JsonLine depth={depth} keyName={keyName} value="null"      valueColor="#94a3b8" isLast={isLast} />;
  if (data === undefined)return <JsonLine depth={depth} keyName={keyName} value="undefined" valueColor="#94a3b8" isLast={isLast} />;
  if (typeof data === "boolean") return <JsonLine depth={depth} keyName={keyName} value={String(data)} valueColor="#f59e0b" isLast={isLast} />;
  if (typeof data === "number")  return <JsonLine depth={depth} keyName={keyName} value={String(data)} valueColor="#60a5fa" isLast={isLast} />;
  if (typeof data === "string")  return <JsonLine depth={depth} keyName={keyName} value={`"${data}"`}  valueColor="#4ade80" isLast={isLast} />;

  const isArr = Array.isArray(data);
  const entries = isArr ? data.map((v, i) => [i, v]) : Object.entries(data);
  const bracket = isArr ? ["[", "]"] : ["{", "}"];

  if (entries.length === 0) {
    return (
      <div style={{ paddingLeft: indent + 16, color: "#94a3b8" }}>
        {keyName !== null && <span style={{ color: "#93c5fd" }}>"{keyName}": </span>}
        <span>{bracket[0]}{bracket[1]}</span>
        {!isLast && <span style={{ color: "#94a3b8" }}>,</span>}
      </div>
    );
  }

  return (
    <div>
      <div
        onClick={() => setOpen(!open)}
        style={{
          paddingLeft: indent + 16, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 4,
          userSelect: "none",
        }}
        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
      >
        <span style={{
          fontSize: "0.6rem", color: "#475569",
          marginLeft: -12, marginRight: 4, display: "inline-block", width: 8,
        }}>{open ? "▾" : "▸"}</span>
        {keyName !== null && <span style={{ color: "#93c5fd" }}>"{keyName}": </span>}
        <span style={{ color: "#e2e8f0" }}>{bracket[0]}</span>
        {!open && (
          <span style={{ color: "#475569", fontSize: "0.7rem" }}>
            {isArr ? ` ${entries.length} items` : ` ${entries.length} keys`}
          </span>
        )}
        {!open && <span style={{ color: "#e2e8f0" }}>{bracket[1]}{!isLast ? "," : ""}</span>}
      </div>
      {open && (
        <>
          {entries.map(([k, v], i) => (
            <JsonTree
              key={k}
              data={v}
              depth={depth + 1}
              keyName={isArr ? null : k}
              isLast={i === entries.length - 1}
            />
          ))}
          <div style={{ paddingLeft: indent + 16, color: "#e2e8f0" }}>
            {bracket[1]}{!isLast ? "," : ""}
          </div>
        </>
      )}
    </div>
  );
};

const JsonLine = ({ depth, keyName, value, valueColor, isLast }) => (
  <div style={{ paddingLeft: depth * 20 + 16, color: valueColor }}>
    {keyName !== null && <span style={{ color: "#93c5fd" }}>"{keyName}": </span>}
    <span>{value}</span>
    {!isLast && <span style={{ color: "#94a3b8" }}>,</span>}
  </div>
);

/* ── Renders all sections/components like a real website ── */
const WebsiteContent = ({ pageData }) => {
  const sections = Object.values(pageData?.body?.data || {});

  if (sections.length === 0) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", minHeight: 320, gap: 14,
      }}>
        <div style={{
          width: 60, height: 60, borderRadius: 16,
          background: "linear-gradient(135deg, #fcb813 0%, #f97316 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 6px 20px rgba(252,184,19,0.35)",
        }}>
          <EyeOutlined style={{ fontSize: 26, color: "#fff" }} />
        </div>
        <p style={{ margin: 0, color: "#374151", fontWeight: 700, fontSize: "1rem" }}>
          No content yet
        </p>
        <p style={{ margin: 0, fontSize: "0.82rem", color: "#9ca3af" }}>
          Open the Page Builder to add sections and components
        </p>
      </div>
    );
  }

  return (
    <>
      {sections.map((section, sectionIndex) => {
        const components = Array.isArray(section.data) ? section.data : [];
        if (components.length === 0) return null;
        return (
          <div key={section._id || sectionIndex}>
            {components.map((component, compIndex) => (
              <div key={component?._id || compIndex}>
                <ComponentRenderer
                  component={component}
                  index={compIndex}
                  components={components}
                  sectionIndex={sectionIndex}
                  preview={true}
                />
              </div>
            ))}
          </div>
        );
      })}
    </>
  );
};

/* ══════════════════════════════════════════
   Main component
══════════════════════════════════════════ */
const PagePreview = ({ pageId, pageData: propPageData, open, setOpen }) => {
  const [pageData, setPageData] = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [tab,      setTab]      = useState("preview"); // "preview" | "api"
  const router = useRouter();

  const finalPageData = propPageData || pageData;
  const type = finalPageData?.type || "Page";
  const cfg  = TYPE_CFG[type] || TYPE_CFG.Page;
  const bodySections = Object.values(finalPageData?.body?.data || {});
  const totalComponents = bodySections.reduce(
    (acc, s) => acc + (Array.isArray(s.data) ? s.data.length : 0), 0
  );

  useEffect(() => {
    if (pageId && !propPageData) {
      setLoading(true);
      instance.get(`/pages/${pageId}`)
        .then((r) => setPageData(r.data))
        .catch(() => message.error("Failed to load page preview"))
        .finally(() => setLoading(false));
    } else if (propPageData) {
      setLoading(false);
    }
  }, [pageId, propPageData]);

  /* ════════════════════
     MODAL MODE
  ════════════════════ */
  if (open !== undefined) {
    return (
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width="92%"
        style={{ top: 12 }}
        styles={{ body: { padding: 0 } }}
        closable={false}
      >
        {/* Modal top bar */}
        <div style={{
          background: "#111827",
          borderRadius: "8px 8px 0 0",
        }}>
          {/* browser row */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 16px",
            borderBottom: "1px solid #1f2937",
          }}>
            <div style={{ display: "flex", gap: 5 }}>
              {["#ef4444","#f59e0b","#22c55e"].map((c,i) => (
                <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
              ))}
            </div>
            <div style={{
              flex: 1, height: 26, borderRadius: 6, background: "#1f2937",
              display: "flex", alignItems: "center", gap: 6, padding: "0 10px",
            }}>
              <LinkOutlined style={{ fontSize: "0.62rem", color: "#6b7280" }} />
              <span style={{ fontSize: "0.68rem", color: "#9ca3af", fontFamily: "monospace" }}>
                {finalPageData?.slug ? `/${finalPageData.slug}` : "preview"}
              </span>
              {finalPageData?.type && (
                <span style={{
                  marginLeft: 4, padding: "1px 6px", borderRadius: 4,
                  background: cfg.bg, color: cfg.color,
                  fontSize: "0.58rem", fontWeight: 800, textTransform: "uppercase",
                }}>{type}</span>
              )}
            </div>
            <span style={{ color: "#9ca3af", fontSize: "0.72rem", fontWeight: 600, maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {finalPageData?.page_name_en || "Preview"}
            </span>
            <button
              onClick={() => setOpen(false)}
              style={{
                width: 28, height: 28, borderRadius: 7,
                border: "1px solid #374151", background: "transparent",
                color: "#6b7280", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "0.8rem",
              }}
            >✕</button>
          </div>

          {/* Tab row */}
          <div style={{
            display: "flex", alignItems: "center", gap: 4,
            padding: "6px 16px",
          }}>
            <Tab
              label="Preview"
              icon={<EyeOutlined style={{ fontSize: "0.72rem" }} />}
              active={tab === "preview"}
              onClick={() => setTab("preview")}
            />
            <Tab
              label="API Response"
              icon={<ApiOutlined style={{ fontSize: "0.72rem" }} />}
              active={tab === "api"}
              onClick={() => setTab("api")}
            />
          </div>
        </div>

        {/* Modal content */}
        <div style={{ maxHeight: "80vh", overflowY: "auto", background: tab === "api" ? "#0f172a" : "#fff" }}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
              <Spin size="large" />
            </div>
          ) : tab === "preview" ? (
            <WebsiteContent pageData={finalPageData} />
          ) : (
            <JsonViewer data={finalPageData} />
          )}
        </div>
      </Modal>
    );
  }

  /* ════════════════════
     STANDALONE PAGE
  ════════════════════ */
  if (loading) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", minHeight: "100vh",
        background: "#f8fafc", gap: 20,
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: "linear-gradient(135deg, #fcb813 0%, #f97316 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 6px 20px rgba(252,184,19,0.4)",
        }}>
          <EyeOutlined style={{ fontSize: 26, color: "#fff" }} />
        </div>
        <Spin size="large" />
        <p style={{ margin: 0, color: "#9ca3af", fontSize: "0.82rem" }}>Loading preview…</p>
      </div>
    );
  }

  if (!finalPageData) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", minHeight: "100vh", background: "#f8fafc", gap: 16,
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <WarningOutlined style={{ fontSize: 24, color: "#fff" }} />
        </div>
        <p style={{ margin: 0, color: "#111827", fontWeight: 700 }}>Page not found</p>
        <button
          onClick={() => router.push("/pages")}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            height: 36, padding: "0 16px", borderRadius: 8,
            border: "1px solid #e5e7eb", background: "#fff",
            cursor: "pointer", fontSize: "0.82rem", color: "#374151",
          }}
        >
          <ArrowLeftOutlined /> Back to Pages
        </button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: tab === "api" ? "#0f172a" : "#fff" }}>

      {/* ── Sticky top bar ── */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        background: "rgba(17,24,39,0.97)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
      }}>
        {/* Browser bar row */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "0 20px", height: 48,
        }}>
          <button
            onClick={() => router.push("/pages")}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 30, height: 30, borderRadius: 7,
              border: "1px solid #374151", background: "transparent",
              color: "#9ca3af", cursor: "pointer", flexShrink: 0,
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#fcb813"; e.currentTarget.style.color = "#fcb813"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#374151"; e.currentTarget.style.color = "#9ca3af"; }}
          >
            <ArrowLeftOutlined style={{ fontSize: "0.78rem" }} />
          </button>

          <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
            {["#ef4444","#f59e0b","#22c55e"].map((c,i) => (
              <div key={i} style={{ width: 9, height: 9, borderRadius: "50%", background: c }} />
            ))}
          </div>

          <div style={{
            flex: 1, height: 26, borderRadius: 6,
            background: "#1f2937", border: "1px solid #374151",
            display: "flex", alignItems: "center", gap: 7, padding: "0 12px", minWidth: 0,
          }}>
            <LinkOutlined style={{ fontSize: "0.62rem", color: "#6b7280", flexShrink: 0 }} />
            <span style={{ fontSize: "0.68rem", color: "#9ca3af", fontFamily: "monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {process.env.NEXT_PUBLIC_SITE_URL || "preview"}{finalPageData.slug ? `/${finalPageData.slug}` : ""}
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <span style={{ color: "#d1d5db", fontSize: "0.75rem", fontWeight: 600, maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {finalPageData.page_name_en}
            </span>
            <span style={{
              padding: "1px 6px", borderRadius: 4,
              background: cfg.bg, color: cfg.color,
              fontSize: "0.58rem", fontWeight: 800, textTransform: "uppercase",
            }}>{type}</span>
            <span style={{
              padding: "1px 6px", borderRadius: 4,
              background: "rgba(252,184,19,0.12)", color: "#fcb813",
              fontSize: "0.6rem", fontWeight: 700,
            }}>
              {bodySections.length}s · {totalComponents}c
            </span>
          </div>

          <div style={{ width: 1, height: 18, background: "#374151" }} />

          <button
            onClick={() => router.push(`/page-builder/${pageId}`)}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              height: 28, padding: "0 11px", borderRadius: 6,
              border: "1px solid #374151", background: "transparent",
              color: "#9ca3af", cursor: "pointer", fontSize: "0.72rem", fontWeight: 600,
              transition: "all 0.15s", flexShrink: 0,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#6b7280"; e.currentTarget.style.color = "#f9fafb"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#374151"; e.currentTarget.style.color = "#9ca3af"; }}
          >
            <CodeOutlined style={{ fontSize: "0.7rem" }} /> Builder
          </button>

          <button
            onClick={() => router.push(`/page-builder/${pageId}?edit=true`)}
            style={{
              display: "flex", alignItems: "center", gap: 5,
              height: 28, padding: "0 13px", borderRadius: 6, border: "none",
              background: "linear-gradient(135deg, #fcb813 0%, #f97316 100%)",
              color: "#111827", cursor: "pointer", fontSize: "0.72rem", fontWeight: 800,
              boxShadow: "0 2px 8px rgba(252,184,19,0.35)", flexShrink: 0,
              transition: "opacity 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            <EditOutlined style={{ fontSize: "0.7rem" }} /> Edit
          </button>
        </div>

        {/* Tab row */}
        <div style={{
          display: "flex", alignItems: "center", gap: 2,
          padding: "4px 20px",
          borderTop: "1px solid #1f2937",
        }}>
          <Tab
            label="Preview"
            icon={<EyeOutlined style={{ fontSize: "0.7rem" }} />}
            active={tab === "preview"}
            onClick={() => setTab("preview")}
          />
          <Tab
            label="API Response"
            icon={<ApiOutlined style={{ fontSize: "0.7rem" }} />}
            active={tab === "api"}
            onClick={() => setTab("api")}
          />
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ paddingTop: 82 }}>
        {tab === "preview" ? (
          <WebsiteContent pageData={finalPageData} />
        ) : (
          <JsonViewer data={finalPageData} />
        )}
      </div>
    </div>
  );
};

export default PagePreview;
