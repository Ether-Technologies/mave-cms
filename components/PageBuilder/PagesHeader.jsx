import React from "react";
import { Input, Select, Button, Tooltip, message } from "antd";
import {
  PlusOutlined, SearchOutlined, CopyOutlined,
  SortAscendingOutlined, SortDescendingOutlined,
  LayoutOutlined, FileAddOutlined,
} from "@ant-design/icons";

const { Option } = Select;

const Stat = ({ label, value, color }) => (
  <div style={{
    display: "flex", alignItems: "center", gap: 6,
    background: "#f9fafb", border: "1px solid #e5e7eb",
    borderRadius: 8, padding: "4px 12px",
  }}>
    <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0 }} />
    <span style={{ fontSize: "0.72rem", color: "#6b7280" }}>{label}</span>
    <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#111827" }}>{value}</span>
  </div>
);

const PagesHeader = ({
  onSearch, onCreate, onFooterCreate,
  sortType, setSortType,
  onShowChange, itemsPerPage = 10,
  stats = {},
}) => {
  return (
    <div style={{ marginBottom: 24 }}>
      {/* ── Top bar ── */}
      <div style={{
        display: "flex", alignItems: "flex-start",
        justifyContent: "space-between", marginTop: 14,
        flexWrap: "wrap", gap: 12, marginBottom: 12,
      }}>
        {/* Left */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: "linear-gradient(135deg, #fcb813 0%, #f97316 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 12px rgba(252,184,19,0.4)", flexShrink: 0,
            }}>
              <LayoutOutlined style={{ fontSize: 20, color: "#fff" }} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 800, color: "#111827", letterSpacing: "-0.02em" }}>
                Pages
              </h2>
              <p style={{ margin: 0, fontSize: "0.72rem", color: "#9ca3af" }}>
                Manage pages, subpages and footers
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Stat label="Total"    value={stats.total    ?? 0} color="#6b7280" />
            <Stat label="Pages"    value={stats.pages    ?? 0} color="#3b82f6" />
            <Stat label="Subpages" value={stats.subpages ?? 0} color="#8b5cf6" />
            <Stat label="Footers"  value={stats.footers  ?? 0} color="#f59e0b" />
          </div>
        </div>

        {/* Right: actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <Tooltip title="Copy Pages API endpoint">
            <Button
              icon={<CopyOutlined />}
              onClick={() => {
                navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_API_BASE_URL}/pages`);
                message.success("API endpoint copied");
              }}
              style={{ height: 38, borderRadius: 10, border: "1px solid #e5e7eb", color: "#6b7280" }}
            />
          </Tooltip>
          <Button
            icon={<FileAddOutlined />}
            onClick={onFooterCreate}
            style={{
              height: 38, borderRadius: 10, fontWeight: 700,
              border: "1px solid #fde68a", background: "#fffbeb", color: "#b45309",
              paddingInline: 16, fontSize: "0.85rem",
            }}
          >
            Add Footer
          </Button>
          <Button
            icon={<PlusOutlined />}
            onClick={onCreate}
            style={{
              height: 38, borderRadius: 10, fontWeight: 700,
              background: "#111827", borderColor: "#111827", color: "#fcb813",
              paddingInline: 20, fontSize: "0.85rem",
              boxShadow: "0 2px 8px rgba(17,24,39,0.25)",
            }}
          >
            Create Page
          </Button>
        </div>
      </div>

      {/* ── Toolbar ── */}
      <div style={{
        display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8,
        background: "#fff", border: "1px solid #e5e7eb",
        borderRadius: 12, padding: "10px 14px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}>
        <Input
          placeholder="Search pages..."
          prefix={<SearchOutlined style={{ color: "#9ca3af" }} />}
          allowClear
          onChange={(e) => onSearch(e.target.value)}
          style={{ width: 220, borderRadius: 8, height: 34 }}
        />

        <div style={{ width: 1, height: 22, background: "#e5e7eb" }} />

        <button
          onClick={() => setSortType(sortType === "desc" ? "asc" : "desc")}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            height: 34, padding: "0 12px", borderRadius: 8,
            border: "1px solid #e5e7eb", background: "#fff",
            cursor: "pointer", fontSize: "0.78rem", color: "#374151", fontWeight: 500,
            transition: "all 0.15s",
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "#fcb813"}
          onMouseLeave={e => e.currentTarget.style.borderColor = "#e5e7eb"}
        >
          {sortType === "desc"
            ? <><SortDescendingOutlined /> Newest first</>
            : <><SortAscendingOutlined /> Oldest first</>}
        </button>

        <div style={{ flex: 1 }} />

        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: "0.75rem", color: "#9ca3af" }}>Show</span>
          <Select value={itemsPerPage} onChange={onShowChange} style={{ width: 72 }}>
            <Option value={10}>10</Option>
            <Option value={20}>20</Option>
            <Option value={50}>50</Option>
            <Option value={100}>100</Option>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default PagesHeader;
