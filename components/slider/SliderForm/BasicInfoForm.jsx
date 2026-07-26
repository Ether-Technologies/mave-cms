import React, { useState } from "react";
import { Form, Input } from "antd";
import RichTextEditor from "../../RichTextEditor";

const SectionHeader = ({ label, accent }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
    <div style={{ width: 3, height: 16, borderRadius: 2, background: accent || "#fcb813" }} />
    <span style={{ fontWeight: 700, color: "#111827", fontSize: "0.85rem", letterSpacing: "-0.01em" }}>
      {label}
    </span>
  </div>
);

const LangTab = ({ active, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      padding: "5px 16px", borderRadius: 6, cursor: "pointer",
      border: "none", fontWeight: 700, fontSize: "0.78rem",
      background: active ? "#111827" : "transparent",
      color: active ? "#fcb813" : "#9ca3af",
      transition: "all 0.15s",
    }}
  >
    {label}
  </button>
);

const inputStyle = {
  borderRadius: 8, height: 40,
  border: "1px solid #e5e7eb",
  fontSize: "0.88rem",
};

const BasicInfoForm = ({ allTags, form }) => {
  const [langTab, setLangTab] = useState("en");

  return (
    <>
      {/* ── Titles section ── */}
      <div style={{
        background: "#f9fafb", borderRadius: 14,
        padding: "18px 20px", marginBottom: 16,
        border: "1px solid #f0f0f0",
      }}>
        <SectionHeader label="Slider Title" />

        {/* Language tab switcher */}
        <div style={{
          display: "inline-flex", alignItems: "center",
          background: "#f3f4f6", borderRadius: 8,
          padding: 3, marginBottom: 14, gap: 2,
        }}>
          <LangTab active={langTab === "en"} label="English" onClick={() => setLangTab("en")} />
          <LangTab active={langTab === "bn"} label="বাংলা"   onClick={() => setLangTab("bn")} />
        </div>

        {langTab === "en" && (
          <Form.Item
            name="title_en"
            rules={[{ required: true, message: "Please enter the title in English." }]}
            style={{ marginBottom: 0 }}
          >
            <Input placeholder="Enter slider title in English" style={inputStyle} />
          </Form.Item>
        )}
        {langTab === "bn" && (
          <Form.Item
            name="title_bn"
            rules={[{ required: true, message: "Please enter the title in Bangla." }]}
            style={{ marginBottom: 0 }}
          >
            <Input placeholder="বাংলায় স্লাইডার শিরোনাম লিখুন" style={inputStyle} />
          </Form.Item>
        )}
      </div>

      {/* ── Descriptions section ── */}
      <div style={{
        background: "#f9fafb", borderRadius: 14,
        padding: "18px 20px", marginBottom: 16,
        border: "1px solid #f0f0f0",
      }}>
        <SectionHeader label="Description" accent="#3b82f6" />

        <div style={{ marginBottom: 14 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6, marginBottom: 8,
          }}>
            <span style={{
              padding: "2px 8px", borderRadius: 4,
              background: "#dbeafe", color: "#1d4ed8",
              fontSize: "0.7rem", fontWeight: 700,
            }}>EN</span>
            <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>English description</span>
          </div>
          <Form.Item
            name="description_en"
            rules={[{ required: true, message: "Please enter the description in English." }]}
            style={{ marginBottom: 0 }}
          >
            <RichTextEditor
              editMode={true}
              defaultValue={form.getFieldValue("description_en") || ""}
            />
          </Form.Item>
        </div>

        <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 14 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 6, marginBottom: 8,
          }}>
            <span style={{
              padding: "2px 8px", borderRadius: 4,
              background: "#fef9c3", color: "#854d0e",
              fontSize: "0.7rem", fontWeight: 700,
            }}>BN</span>
            <span style={{ fontSize: "0.78rem", color: "#6b7280" }}>বাংলা বিবরণ</span>
          </div>
          <Form.Item
            name="description_bn"
            rules={[{ required: true, message: "Please enter the description in Bangla." }]}
            style={{ marginBottom: 0 }}
          >
            <RichTextEditor
              editMode={true}
              defaultValue={form.getFieldValue("description_bn") || ""}
            />
          </Form.Item>
        </div>
      </div>
    </>
  );
};

export default BasicInfoForm;
