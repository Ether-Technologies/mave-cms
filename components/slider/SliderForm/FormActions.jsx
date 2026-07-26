import React from "react";
import { Form } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

const FormActions = ({ editingItemId, onCancelEdit }) => (
  <Form.Item style={{ marginBottom: 0, marginTop: 8 }}>
    <div style={{ display: "flex", gap: 10 }}>
      <button
        type="submit"
        style={{
          display: "flex", alignItems: "center", gap: 7,
          height: 42, padding: "0 28px", borderRadius: 10,
          border: "none", cursor: "pointer",
          background: "#111827", color: "#fcb813",
          fontWeight: 800, fontSize: "0.9rem",
          boxShadow: "0 2px 10px rgba(17,24,39,0.3)",
          transition: "opacity 0.15s",
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = "0.88"}
        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
      >
        <CheckOutlined />
        {editingItemId ? "Update Slider" : "Create Slider"}
      </button>

      <button
        type="button"
        onClick={onCancelEdit}
        style={{
          display: "flex", alignItems: "center", gap: 7,
          height: 42, padding: "0 20px", borderRadius: 10,
          border: "1px solid #e5e7eb", background: "#fff",
          cursor: "pointer", color: "#374151",
          fontWeight: 600, fontSize: "0.9rem",
          transition: "all 0.15s",
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = "#fecaca"; e.currentTarget.style.color = "#ef4444"; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#374151"; }}
      >
        <CloseOutlined style={{ fontSize: "0.75rem" }} />
        {editingItemId ? "Discard" : "Cancel"}
      </button>
    </div>
  </Form.Item>
);

export default FormActions;
