import React, { useState, useEffect } from "react";
import { Form, Input, message, Modal, Select } from "antd";
import {
  CloseOutlined, CopyOutlined, EditOutlined,
  SaveOutlined, FileTextOutlined, FilePdfOutlined,
  FileWordOutlined, FileExcelOutlined, CalendarOutlined,
  HddOutlined, LinkOutlined, CheckOutlined,
} from "@ant-design/icons";
import instance from "../../axios";
import Image from "next/image";

const { Option } = Select;
const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL;

const TypeBadge = ({ fileType }) => {
  const isImage = fileType?.startsWith("image/");
  const isVideo = fileType?.startsWith("video/");
  const isPDF   = fileType?.includes("pdf");
  const isWord  = fileType?.includes("word");
  const isExcel = fileType?.includes("excel");

  const cfg = isImage ? { label: "IMAGE",  bg: "#dcfce7", color: "#15803d" }
            : isVideo ? { label: "VIDEO",  bg: "#dbeafe", color: "#1d4ed8" }
            : isPDF   ? { label: "PDF",    bg: "#fee2e2", color: "#b91c1c" }
            : isWord  ? { label: "WORD",   bg: "#dbeafe", color: "#1d4ed8" }
            : isExcel ? { label: "EXCEL",  bg: "#dcfce7", color: "#15803d" }
            :           { label: "FILE",   bg: "#f3f4f6", color: "#6b7280" };

  return (
    <span style={{
      padding: "3px 9px", borderRadius: 6, fontSize: "0.65rem", fontWeight: 800,
      background: cfg.bg, color: cfg.color, letterSpacing: "0.07em",
    }}>{cfg.label}</span>
  );
};

const MetaRow = ({ icon, label, value }) => (
  <div style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0", borderBottom: "1px solid #f3f4f6" }}>
    <span style={{ color: "#9ca3af", fontSize: "0.85rem", marginTop: 1, flexShrink: 0 }}>{icon}</span>
    <div style={{ minWidth: 0 }}>
      <div style={{ fontSize: "0.68rem", color: "#9ca3af", fontWeight: 600, marginBottom: 1, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
      <div style={{ fontSize: "0.82rem", color: "#111827", fontWeight: 500, wordBreak: "break-all" }}>{value}</div>
    </div>
  </div>
);

const ActionBtn = ({ onClick, icon, children, style }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      display: "flex", alignItems: "center", gap: 6,
      height: 36, padding: "0 14px", borderRadius: 9,
      border: "1px solid #e5e7eb", background: "#fff",
      cursor: "pointer", fontSize: "0.78rem", color: "#374151", fontWeight: 600,
      transition: "all 0.15s", ...style,
    }}
    onMouseEnter={e => { e.currentTarget.style.borderColor = "#fcb813"; e.currentTarget.style.color = "#111827"; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = (style?.borderColor || "#e5e7eb"); e.currentTarget.style.color = (style?.color || "#374151"); }}
  >
    {icon}{children}
  </button>
);

const PreviewModal = ({ visible, onClose, media, mediaType, handleEdit, availableTags }) => {
  const [editMode, setEditMode] = useState(false);
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copied, setCopied] = useState("");

  useEffect(() => {
    if (!visible) { setEditMode(false); setCopied(""); }
  }, [visible]);

  useEffect(() => {
    if (editMode) {
      form.setFieldsValue({
        title: media.title || "",
        tags: Array.isArray(media.tags) ? media.tags : [],
      });
    }
  }, [editMode, media, form]);

  const copy = (text, key) => {
    navigator.clipboard.writeText(text);
    message.success(key === "path" ? "Path copied!" : "Link copied!");
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  };

  const handleFormSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const updated = { ...media, title: values.title, tags: Array.isArray(values.tags) ? values.tags : [], updated_at: new Date().toISOString() };
      const res = await instance.put(`/media/${media.id}`, updated);
      if (res.status === 200) {
        message.success("Media updated.");
        handleEdit(updated);
        setEditMode(false);
        onClose();
      } else { message.error("Failed to update."); }
    } catch { message.error("Update failed."); }
    finally { setIsSubmitting(false); }
  };

  const fileSizeFmt = media.file_size
    ? media.file_size > 1024 * 1024
      ? `${(media.file_size / (1024 * 1024)).toFixed(2)} MB`
      : `${(media.file_size / 1024).toFixed(1)} KB`
    : "N/A";

  const shortName = (media.title || media.file_name || "").length > 38
    ? (media.title || media.file_name).slice(0, 38) + "…"
    : (media.title || media.file_name);

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={920}
      centered
      closeIcon={null}
      title={null}
      styles={{ body: { padding: 0, borderRadius: 16, overflow: "hidden" } }}
      style={{ borderRadius: 16 }}
    >
      <div style={{ display: "flex", minHeight: 520, borderRadius: 16, overflow: "hidden" }}>

        {/* ── Left: dark media preview ── */}
        <div style={{
          flex: "0 0 56%", background: "#0f172a",
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative", overflow: "hidden",
        }}>
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: 14, right: 14, zIndex: 10,
              width: 32, height: 32, borderRadius: "50%",
              border: "none", background: "rgba(255,255,255,0.15)",
              color: "#fff", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              backdropFilter: "blur(4px)", transition: "background 0.15s",
            }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.28)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
          >
            <CloseOutlined style={{ fontSize: "0.8rem" }} />
          </button>

          {/* Media */}
          {mediaType === "image" && (
            <div style={{ position: "relative", width: "100%", height: "100%", minHeight: 520 }}>
              <Image
                src={`${MEDIA_URL}/${media.file_path}`}
                alt={media.file_name}
                layout="fill"
                objectFit="contain"
                style={{ padding: 20 }}
              />
            </div>
          )}
          {mediaType === "video" && (
            <video width="100%" controls style={{ maxHeight: 480, borderRadius: 8 }}>
              <source src={`${MEDIA_URL}/${media.file_path}`} type={media.file_type} />
            </video>
          )}
          {mediaType === "document" && (
            <div style={{ width: "100%", height: 520, padding: 12 }}>
              <iframe
                src={`${MEDIA_URL}/${media.file_path}`}
                width="100%" height="100%"
                style={{ border: "none", borderRadius: 8 }}
              />
            </div>
          )}

          {/* Bottom fade with type badge */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
            padding: "28px 16px 14px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.72rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "70%" }}>
              {media.file_name}
            </span>
            <TypeBadge fileType={media.file_type} />
          </div>
        </div>

        {/* ── Right: metadata / edit panel ── */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          padding: "24px 22px", background: "#fff",
          overflow: "auto",
        }}>
          {editMode ? (
            /* ── Edit Form ── */
            <>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                <div style={{ width: 3, height: 18, borderRadius: 2, background: "#fcb813" }} />
                <span style={{ fontWeight: 800, color: "#111827", fontSize: "0.95rem" }}>Edit Media</span>
              </div>

              <Form layout="vertical" form={form} onFinish={handleFormSubmit} style={{ flex: 1 }}>
                <Form.Item
                  label={<span style={{ fontWeight: 600, fontSize: "0.8rem", color: "#374151" }}>Title</span>}
                  name="title"
                  rules={[{ required: true, message: "Please enter a title." }]}
                >
                  <Input style={{ borderRadius: 8, height: 38 }} />
                </Form.Item>
                <Form.Item
                  label={<span style={{ fontWeight: 600, fontSize: "0.8rem", color: "#374151" }}>Tags</span>}
                  name="tags"
                >
                  <Select mode="tags" placeholder="Add tags..." style={{ width: "100%" }} tokenSeparators={[","]} >
                    {(availableTags || []).map(t => <Option key={t} value={t}>{t}</Option>)}
                  </Select>
                </Form.Item>

                <div style={{ display: "flex", gap: 8, marginTop: "auto", paddingTop: 16 }}>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    style={{
                      flex: 1, height: 38, borderRadius: 9, border: "none",
                      background: "#111827", color: "#fcb813",
                      fontWeight: 800, fontSize: "0.85rem", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    }}
                  >
                    <SaveOutlined /> {isSubmitting ? "Saving…" : "Save"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    style={{
                      height: 38, padding: "0 16px", borderRadius: 9,
                      border: "1px solid #e5e7eb", background: "#fff",
                      fontWeight: 600, fontSize: "0.85rem", cursor: "pointer", color: "#374151",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </Form>
            </>
          ) : (
            /* ── View mode ── */
            <>
              {/* Title */}
              <div style={{ marginBottom: 16 }}>
                <h3 style={{
                  margin: "0 0 4px", fontWeight: 800, color: "#111827",
                  fontSize: "1rem", lineHeight: 1.3, wordBreak: "break-word",
                }}>
                  {shortName}
                </h3>
                <span style={{ fontSize: "0.72rem", color: "#9ca3af" }}>
                  {new Date(media.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                </span>
              </div>

              <div style={{ borderTop: "1px solid #f3f4f6", flex: 1 }}>
                <MetaRow icon={<HddOutlined />}      label="File size" value={fileSizeFmt} />
                <MetaRow icon={<FileTextOutlined />} label="Type"      value={media.file_type} />
                <MetaRow icon={<CalendarOutlined />} label="Uploaded"  value={new Date(media.created_at).toLocaleString()} />

                {/* Tags */}
                <div style={{ padding: "10px 0" }}>
                  <div style={{ fontSize: "0.68rem", color: "#9ca3af", fontWeight: 600, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>Tags</div>
                  {media.tags?.length > 0 ? (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {media.tags.map(t => (
                        <span key={t} style={{
                          padding: "3px 9px", borderRadius: 5,
                          background: "#fef9c3", color: "#854d0e",
                          fontSize: "0.72rem", fontWeight: 600,
                        }}>{t}</span>
                      ))}
                    </div>
                  ) : (
                    <span style={{ fontSize: "0.78rem", color: "#d1d5db" }}>No tags</span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, paddingTop: 16, borderTop: "1px solid #f3f4f6", marginTop: "auto" }}>
                <button
                  type="button"
                  onClick={() => setEditMode(true)}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    height: 36, padding: "0 16px", borderRadius: 9,
                    border: "none", background: "#111827", color: "#fcb813",
                    cursor: "pointer", fontSize: "0.8rem", fontWeight: 700,
                  }}
                >
                  <EditOutlined /> Edit
                </button>

                <button
                  type="button"
                  onClick={() => copy(`/${media.file_path}`, "path")}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    height: 36, padding: "0 14px", borderRadius: 9,
                    border: "1px solid #e5e7eb", background: copied === "path" ? "#f0fdf4" : "#fff",
                    cursor: "pointer", fontSize: "0.78rem",
                    color: copied === "path" ? "#16a34a" : "#374151", fontWeight: 600,
                    transition: "all 0.15s",
                  }}
                >
                  {copied === "path" ? <CheckOutlined /> : <CopyOutlined />}
                  Copy Path
                </button>

                <button
                  type="button"
                  onClick={() => copy(`${MEDIA_URL}/${media.file_path}`, "link")}
                  style={{
                    display: "flex", alignItems: "center", gap: 6,
                    height: 36, padding: "0 14px", borderRadius: 9,
                    border: "1px solid #e5e7eb", background: copied === "link" ? "#eff6ff" : "#fff",
                    cursor: "pointer", fontSize: "0.78rem",
                    color: copied === "link" ? "#1d4ed8" : "#374151", fontWeight: 600,
                    transition: "all 0.15s",
                  }}
                >
                  {copied === "link" ? <CheckOutlined /> : <LinkOutlined />}
                  Copy Link
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default PreviewModal;
