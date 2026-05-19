// components/PageBuilder/PagePreview.jsx

import React, { useState, useEffect } from "react";
import { Spin, message, Modal, Tag } from "antd";
import {
  ArrowLeftOutlined, EditOutlined, EyeOutlined,
  LinkOutlined, LayoutOutlined, ReloadOutlined,
  CodeOutlined, FullscreenOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/router";
import instance from "../../axios";
import ComponentRenderer from "./Components/ComponentRenderer";

const TYPE_CFG = {
  Page:    { color: "#3b82f6", bg: "#dbeafe" },
  Subpage: { color: "#7c3aed", bg: "#ede9fe" },
  Footer:  { color: "#b45309", bg: "#fef3c7" },
};

/* ── Browser chrome dots ── */
const BrowserDots = () => (
  <div style={{
    display: "flex", alignItems: "center", gap: 6, padding: "10px 16px",
    background: "#f3f4f6", borderBottom: "1px solid #e5e7eb",
    borderRadius: "12px 12px 0 0",
  }}>
    {["#ef4444", "#f59e0b", "#22c55e"].map((c, i) => (
      <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
    ))}
    <div style={{
      flex: 1, marginLeft: 8, height: 22, borderRadius: 6,
      background: "#e5e7eb", display: "flex", alignItems: "center",
      padding: "0 10px",
    }}>
      <span style={{ fontSize: "0.68rem", color: "#9ca3af", fontFamily: "monospace" }}>
        preview mode
      </span>
    </div>
  </div>
);

/* ── Section header ── */
const SectionHeader = ({ title, index, font }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 10,
    marginBottom: 16, paddingBottom: 10,
    borderBottom: "1px solid #f3f4f6",
  }}>
    <div style={{
      width: 24, height: 24, borderRadius: 6, flexShrink: 0,
      background: "linear-gradient(135deg, #fcb813 0%, #f97316 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "0.65rem", fontWeight: 800, color: "#fff",
    }}>
      {index + 1}
    </div>
    <span style={{ fontWeight: 700, color: "#111827", fontSize: "0.95rem", fontFamily: font || undefined }}>
      {title}
    </span>
  </div>
);

/* ── Empty content state ── */
const EmptyContent = () => (
  <div style={{
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", padding: "80px 0", gap: 14,
  }}>
    <div style={{
      width: 64, height: 64, borderRadius: 18,
      background: "linear-gradient(135deg, #fcb813 0%, #f97316 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 6px 20px rgba(252,184,19,0.35)",
    }}>
      <LayoutOutlined style={{ fontSize: 28, color: "#fff" }} />
    </div>
    <p style={{ margin: 0, color: "#374151", fontWeight: 700, fontSize: "1rem" }}>
      No content yet
    </p>
    <p style={{ margin: 0, fontSize: "0.82rem", color: "#9ca3af" }}>
      Open the Page Builder to add sections and components
    </p>
  </div>
);

/* ── Page content renderer (shared by standalone + modal) ── */
const PageContent = ({ pageData }) => {
  // body.data is { section_1: { title, components: { comp_1: {...} } }, ... }
  const sections = Object.values(pageData?.body?.data || {});
  if (sections.length === 0) return <EmptyContent />;

  return (
    <>
      {sections.map((section, sectionIndex) => {
        const components = Object.values(section.components || {});
        const title = section.title || section.sectionTitle;
        return (
          <div
            key={section._id || sectionIndex}
            style={{
              marginBottom: 32, padding: "20px 24px",
              background: "#fff", borderRadius: 12,
              border: "1px solid #f3f4f6",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            {title && (
              <SectionHeader title={title} index={sectionIndex} font={section.font} />
            )}
            {components.length > 0 ? (
              components.map((component, compIndex) => (
                <div
                  key={component?._id || compIndex}
                  style={{ marginBottom: compIndex < components.length - 1 ? 16 : 0 }}
                >
                  <ComponentRenderer
                    component={component}
                    index={compIndex}
                    components={components}
                    sectionIndex={sectionIndex}
                    preview={true}
                  />
                </div>
              ))
            ) : (
              <p style={{ margin: 0, color: "#9ca3af", fontSize: "0.82rem", fontStyle: "italic" }}>
                No components in this section.
              </p>
            )}
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
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const finalPageData = propPageData || pageData;
  const type = finalPageData?.type || "Page";
  const cfg  = TYPE_CFG[type] || TYPE_CFG.Page;
  // body.data is { section_1: {...}, section_2: {...}, ... }
  const bodySections = Object.values(finalPageData?.body?.data || {});

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        setLoading(true);
        const response = await instance.get(`/pages/${pageId}`);
        setPageData(response.data);
      } catch (error) {
        console.error("Error fetching page data:", error);
        message.error("Failed to load page preview");
      } finally {
        setLoading(false);
      }
    };

    if (pageId && !propPageData) {
      fetchPageData();
    } else if (propPageData) {
      setLoading(false);
    }
  }, [pageId, propPageData]);

  /* ── MODAL MODE ── */
  if (open !== undefined) {
    return (
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width="90%"
        style={{ top: 16 }}
        styles={{ body: { padding: 0 } }}
        closable={false}
      >
        {/* Modal header */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "14px 20px",
          background: "#111827", borderRadius: "8px 8px 0 0",
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: "linear-gradient(135deg, #fcb813 0%, #f97316 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            flexShrink: 0,
          }}>
            <EyeOutlined style={{ fontSize: 15, color: "#fff" }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "#f9fafb", fontWeight: 700, fontSize: "0.95rem" }}>
                {finalPageData?.page_name_en || "Page Preview"}
              </span>
              {finalPageData?.type && (
                <span style={{
                  padding: "1px 7px", borderRadius: 4,
                  background: cfg.bg, color: cfg.color,
                  fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase",
                }}>
                  {finalPageData.type}
                </span>
              )}
            </div>
            {finalPageData?.slug && (
              <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                <LinkOutlined style={{ fontSize: "0.65rem", color: "#9ca3af" }} />
                <span style={{ fontSize: "0.68rem", color: "#9ca3af", fontFamily: "monospace" }}>
                  /{finalPageData.slug}
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setOpen(false)}
            style={{
              width: 30, height: 30, borderRadius: 8, border: "1px solid #374151",
              background: "transparent", color: "#9ca3af", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.85rem", fontWeight: 700,
            }}
          >
            ✕
          </button>
        </div>

        {/* Modal body */}
        <div style={{ maxHeight: "80vh", overflowY: "auto", padding: 20, background: "#f9fafb" }}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "80px 0" }}>
              <Spin size="large" />
            </div>
          ) : !finalPageData ? (
            <EmptyContent />
          ) : (
            <PageContent pageData={finalPageData} />
          )}
        </div>
      </Modal>
    );
  }

  /* ── STANDALONE PAGE MODE ── */
  if (loading) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", minHeight: "100vh", gap: 16,
        background: "#f9fafb",
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: "linear-gradient(135deg, #fcb813 0%, #f97316 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 6px 20px rgba(252,184,19,0.35)",
        }}>
          <EyeOutlined style={{ fontSize: 24, color: "#fff" }} />
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
        justifyContent: "center", minHeight: "100vh", gap: 12, background: "#f9fafb",
      }}>
        <p style={{ color: "#374151", fontWeight: 700, fontSize: "1rem" }}>Page not found</p>
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
    <div style={{ minHeight: "100vh", background: "#f1f5f9" }}>

      {/* ── Sticky top bar ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 100,
        background: "#111827",
        boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
      }}>
        <div style={{
          maxWidth: 1200, margin: "0 auto",
          display: "flex", alignItems: "center", gap: 12,
          padding: "0 24px", height: 58,
        }}>
          {/* Back */}
          <button
            onClick={() => router.push("/pages")}
            style={{
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 34, height: 34, borderRadius: 9,
              border: "1px solid #374151", background: "transparent",
              color: "#9ca3af", cursor: "pointer", flexShrink: 0,
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#fcb813"; e.currentTarget.style.color = "#fcb813"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#374151"; e.currentTarget.style.color = "#9ca3af"; }}
          >
            <ArrowLeftOutlined style={{ fontSize: "0.85rem" }} />
          </button>

          {/* Icon */}
          <div style={{
            width: 34, height: 34, borderRadius: 9, flexShrink: 0,
            background: "linear-gradient(135deg, #fcb813 0%, #f97316 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 3px 10px rgba(252,184,19,0.4)",
          }}>
            <EyeOutlined style={{ fontSize: 16, color: "#fff" }} />
          </div>

          {/* Title block */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
                color: "#f9fafb", fontWeight: 800, fontSize: "0.95rem",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {finalPageData.page_name_en || "Untitled Page"}
              </span>
              <span style={{
                padding: "2px 8px", borderRadius: 5,
                background: cfg.bg, color: cfg.color,
                fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase",
                flexShrink: 0,
              }}>
                {type}
              </span>
              <span style={{
                padding: "2px 8px", borderRadius: 5,
                background: "rgba(252,184,19,0.15)", color: "#fcb813",
                fontSize: "0.6rem", fontWeight: 700, flexShrink: 0,
              }}>
                Preview Mode
              </span>
            </div>
            {finalPageData.slug && (
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                <LinkOutlined style={{ fontSize: "0.65rem", color: "#6b7280" }} />
                <span style={{ fontSize: "0.68rem", color: "#6b7280", fontFamily: "monospace" }}>
                  /{finalPageData.slug}
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <button
              onClick={() => router.push(`/page-builder/${pageId}`)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                height: 34, padding: "0 14px", borderRadius: 8,
                border: "1px solid #374151", background: "transparent",
                color: "#d1d5db", cursor: "pointer", fontSize: "0.78rem", fontWeight: 600,
                transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#6b7280"; e.currentTarget.style.color = "#f9fafb"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#374151"; e.currentTarget.style.color = "#d1d5db"; }}
            >
              <CodeOutlined /> Builder
            </button>
            <button
              onClick={() => router.push(`/page-builder/${pageId}?edit=true`)}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                height: 34, padding: "0 16px", borderRadius: 8,
                border: "none",
                background: "linear-gradient(135deg, #fcb813 0%, #f97316 100%)",
                color: "#111827", cursor: "pointer", fontSize: "0.78rem", fontWeight: 800,
                boxShadow: "0 2px 8px rgba(252,184,19,0.4)",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              <EditOutlined /> Edit Page
            </button>
          </div>
        </div>

        {/* Section count sub-bar */}
        <div style={{
          borderTop: "1px solid #1f2937",
          padding: "6px 24px",
          maxWidth: 1200, margin: "0 auto",
          display: "flex", alignItems: "center", gap: 16,
        }}>
          <span style={{ fontSize: "0.7rem", color: "#6b7280" }}>
            {bodySections.length} section{bodySections.length !== 1 ? "s" : ""}
            {" · "}
            {bodySections.reduce((acc, s) => acc + Object.values(s.components || {}).length, 0)} component{bodySections.reduce((acc, s) => acc + Object.values(s.components || {}).length, 0) !== 1 ? "s" : ""}
          </span>
          {finalPageData.page_name_bn && (
            <span style={{ fontSize: "0.7rem", color: "#6b7280" }}>
              · {finalPageData.page_name_bn}
            </span>
          )}
        </div>
      </div>

      {/* ── Content area ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 24px 48px" }}>

        {/* Browser frame wrapper */}
        <div style={{
          borderRadius: 14,
          border: "1px solid #e2e8f0",
          overflow: "hidden",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        }}>
          <BrowserDots />

          {/* Page content */}
          <div style={{ background: "#fff", padding: "24px 28px", minHeight: 400 }}>
            <PageContent pageData={finalPageData} />
          </div>
        </div>

        {/* Footer info */}
        <div style={{
          marginTop: 20,
          display: "flex", alignItems: "center", justifyContent: "center",
          gap: 16,
        }}>
          <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
            Page ID: #{pageId}
          </span>
          <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#cbd5e1" }} />
          <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
            Type: {type}
          </span>
          {finalPageData.slug && (
            <>
              <span style={{ width: 3, height: 3, borderRadius: "50%", background: "#cbd5e1" }} />
              <span style={{ fontSize: "0.72rem", color: "#94a3b8", fontFamily: "monospace" }}>
                /{finalPageData.slug}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PagePreview;
