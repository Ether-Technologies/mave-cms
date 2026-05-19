import React, { useState, useEffect } from "react";
import {
  Form, Input, Select, Radio, Switch, Drawer, message,
} from "antd";
import {
  PlusOutlined, TranslationOutlined, SettingOutlined,
  PictureOutlined, CheckCircleOutlined, MinusCircleOutlined,
  EditOutlined, LinkOutlined, TagOutlined,
} from "@ant-design/icons";
import MediaSelectionModal from "../PageBuilder/Modals/MediaSelectionModal";
import RichTextEditor from "../RichTextEditor";
import instance from "../../axios";
import Image from "next/image";

const { Option } = Select;
const PLACEHOLDER = "/images/Image_Placeholder.png";

const TAG_COLORS = ["#fcb813","#8b5cf6","#06b6d4","#10b981","#f43f5e","#3b82f6","#f97316","#84cc16"];
const getTagColor = (i) => TAG_COLORS[i % TAG_COLORS.length];

/* ── Section heading ── */
const Section = ({ icon, title, children }) => (
  <div style={{ marginBottom: 24 }}>
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      marginBottom: 14, paddingBottom: 10,
      borderBottom: "1px solid #f3f4f6",
    }}>
      <span style={{ color: "#fcb813", fontSize: 15 }}>{icon}</span>
      <span style={{ fontWeight: 700, fontSize: "0.88rem", color: "#111827" }}>{title}</span>
    </div>
    {children}
  </div>
);

/* ── Media thumb (edit mode) ── */
const MediaThumb = ({ item, onRemove }) => {
  const url = item?.file_path
    ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/${item.file_path}`
    : PLACEHOLDER;
  return (
    <div style={{
      position: "relative", width: 90, height: 70,
      borderRadius: 8, overflow: "hidden",
      border: "2px solid #fcb813", flexShrink: 0,
    }}>
      <Image src={url} alt="media" layout="fill" objectFit="cover"
        onError={(e) => { e.target.src = PLACEHOLDER; }} />
      <button
        onClick={() => onRemove(item.id)}
        style={{
          position: "absolute", top: 3, right: 3,
          width: 18, height: 18, borderRadius: "50%",
          background: "#dc2626", border: "none",
          color: "#fff", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 9, fontWeight: 700,
        }}
      >✕</button>
    </div>
  );
};

/* ── Add-field button ── */
const AddFieldBtn = ({ label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      display: "flex", alignItems: "center", gap: 6,
      height: 32, padding: "0 14px", borderRadius: 8,
      border: "1.5px dashed #d1d5db", background: "#f9fafb",
      color: "#6b7280", cursor: "pointer",
      fontSize: "0.78rem", fontWeight: 600,
      transition: "all 0.15s", marginTop: 8,
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = "#fcb813";
      e.currentTarget.style.color = "#d97706";
      e.currentTarget.style.background = "#fffbeb";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = "#d1d5db";
      e.currentTarget.style.color = "#6b7280";
      e.currentTarget.style.background = "#f9fafb";
    }}
  >
    <PlusOutlined style={{ fontSize: 11 }} /> {label}
  </button>
);

const newItem = () => ({ id: Date.now() + Math.random(), title_en: "", title_bn: "", description_en: "", description_bn: "" });

/* ════════════════════════════════════════════ */
const CardsPreviewModal = ({
  visible,
  onCancel,
  selectedCard,
  pages,
  media,
  uniqueTags,
  fetchCards,
}) => {
  const [form]          = Form.useForm();
  const [isEditing, setIsEditing]       = useState(false);
  const [submitting, setSubmitting]     = useState(false);
  const [langTab, setLangTab]           = useState("en");
  const [contentItems, setContentItems] = useState([newItem()]);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [linkType, setLinkType]         = useState("independent");
  const [showAdvanced, setShowAdvanced] = useState(false);

  /* ── Populate state when card changes ── */
  useEffect(() => {
    if (!selectedCard) return;

    // Content items
    const existing = selectedCard.additional?.content_items;
    if (existing?.length > 0) {
      setContentItems(existing.map(it => ({ ...it, id: it.id || Date.now() + Math.random() })));
    } else {
      setContentItems([{
        id: Date.now(),
        title_en:       selectedCard.title_en       || "",
        title_bn:       selectedCard.title_bn       || "",
        description_en: selectedCard.description_en || "",
        description_bn: selectedCard.description_bn || "",
      }]);
    }

    // Media
    const ids = Array.isArray(selectedCard.media_ids)
      ? selectedCard.media_ids
      : (selectedCard.media_ids ? [selectedCard.media_ids] : []);
    const found = media.filter(m => ids.includes(m.id));
    setSelectedMedia(found.length > 0 ? found : (selectedCard.media_files ? [selectedCard.media_files] : []));

    // Link type
    let lt = "independent";
    let link_page_id;
    if (selectedCard.link_url) {
      try {
        if (selectedCard.link_url.startsWith(process.env.NEXT_PUBLIC_MEDIA_URL)) {
          lt = "media";
        } else {
          const url = new URL(selectedCard.link_url, window.location.origin);
          const pid = url.searchParams.get("page_id");
          if (pid) { lt = "page"; link_page_id = parseInt(pid, 10); }
        }
      } catch {}
    }
    setLinkType(lt);

    form.setFieldsValue({
      page_name:       selectedCard.page_name,
      link_type:       lt,
      link_page_id:    link_page_id,
      link_url:        lt === "independent" ? selectedCard.link_url : undefined,
      media_link_path: lt === "media"
        ? selectedCard.link_url?.replace(process.env.NEXT_PUBLIC_MEDIA_URL, "")
        : undefined,
      status: selectedCard.status === 1,
      tags:   selectedCard.additional?.tags || [],
    });
  }, [selectedCard, media]);

  /* ── Reset edit state when drawer closes ── */
  useEffect(() => {
    if (!visible) { setIsEditing(false); setLangTab("en"); setShowAdvanced(false); }
  }, [visible]);

  /* ── Content item helpers ── */
  const updateItem  = (id, field, val) =>
    setContentItems(prev => prev.map(it => it.id === id ? { ...it, [field]: val } : it));
  const addItem    = () => setContentItems(prev => [...prev, newItem()]);
  const removeItem = (id) => setContentItems(prev => prev.filter(it => it.id !== id));

  const handleEnTitleChange = (id, val) => {
    updateItem(id, "title_en", val);
    const item = contentItems.find(it => it.id === id);
    if (item && !item.title_bn) updateItem(id, "title_bn", val);
  };

  /* ── Media helpers ── */
  const handleMediaSelect = (items) => {
    const list = Array.isArray(items) ? items : [items];
    setSelectedMedia(prev => {
      const ids = new Set(prev.map(m => m.id));
      return [...prev, ...list.filter(m => !ids.has(m.id))];
    });
    setMediaModalOpen(false);
  };
  const removeMedia = (id) => setSelectedMedia(prev => prev.filter(m => m.id !== id));

  /* ── Link type ── */
  const handleLinkTypeChange = (e) => {
    setLinkType(e.target.value);
    form.setFieldsValue({ link_url: undefined, link_page_id: undefined, media_link_path: undefined, internal_link_path: undefined });
  };

  const buildLink = (values) => {
    if (values.link_type === "page" && values.link_page_id) {
      const p = pages.find(p => p.id === values.link_page_id);
      if (!p) throw new Error("Selected page not found.");
      return `/${p.slug}?page_id=${p.id}&pageName=${p.page_name_en}`;
    }
    if (values.link_type === "media" && values.media_link_path)
      return `${process.env.NEXT_PUBLIC_MEDIA_URL}${values.media_link_path}`;
    if (values.link_type === "internal" && values.internal_link_path)
      return `${process.env.NEXT_PUBLIC_APP_URL}${values.internal_link_path}`;
    return values.link_url;
  };

  /* ── Save ── */
  const handleSave = async (values) => {
    const first = contentItems[0];
    if (!first?.title_en?.trim()) {
      message.error("English title is required.");
      setLangTab("en");
      return;
    }
    setSubmitting(true);
    try {
      const finalLink = buildLink(values);
      const payload = {
        title_en:       first.title_en,
        title_bn:       first.title_bn || first.title_en,
        description_en: first.description_en || "",
        description_bn: first.description_bn || first.description_en || "",
        media_ids:      selectedMedia.map(m => m.id),
        page_name:      values.page_name || "",
        link_url:       finalLink || "",
        status:         values.status ? 1 : 0,
        additional: {
          tags:          values.tags || [],
          content_items: contentItems,
        },
      };
      await instance.put(`/cards/${selectedCard.id}`, payload);
      message.success("Card updated successfully.");
      setIsEditing(false);
      onCancel();
      fetchCards();
    } catch (err) {
      console.error(err);
      message.error("Failed to update card.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ══════════════════════════════════════
     PREVIEW MODE
  ══════════════════════════════════════ */
  const PreviewContent = () => {
    if (!selectedCard) return null;
    const tags   = selectedCard.additional?.tags || [];
    const active = selectedCard.status === 1;
    const mediaFile = selectedCard.media_files;
    const mediaUrl  = mediaFile?.file_path
      ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/${mediaFile.file_path}`
      : null;

    return (
      <div>
        {/* Hero image */}
        <div style={{
          position: "relative", width: "100%", height: 220,
          borderRadius: 14, overflow: "hidden",
          background: "#1f2937", marginBottom: 20,
        }}>
          {mediaUrl ? (
            mediaFile.file_type?.startsWith("video/") ? (
              <video
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                controls muted playsInline
              >
                <source src={mediaUrl} type={mediaFile.file_type} />
              </video>
            ) : (
              <Image src={mediaUrl} alt={selectedCard.title_en || "Card"} layout="fill" objectFit="cover"
                onError={(e) => { e.target.src = PLACEHOLDER; }} />
            )
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 48, opacity: 0.2 }}>🃏</div>
          )}
          {/* Status overlay */}
          <div style={{
            position: "absolute", top: 12, left: 12,
            background: active ? "rgba(34,197,94,0.18)" : "rgba(0,0,0,0.4)",
            backdropFilter: "blur(8px)",
            border: `1px solid ${active ? "rgba(34,197,94,0.5)" : "rgba(255,255,255,0.2)"}`,
            color: active ? "#4ade80" : "rgba(255,255,255,0.7)",
            fontSize: "0.65rem", fontWeight: 700,
            padding: "3px 10px", borderRadius: 99, letterSpacing: "0.06em",
          }}>
            {active ? "● Active" : "○ Draft"}
          </div>
          <div style={{
            position: "absolute", top: 14, right: 12,
            color: "rgba(255,255,255,0.35)", fontSize: "0.6rem", fontFamily: "monospace",
          }}>#{selectedCard.id}</div>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
            {tags.map((tag, i) => (
              <span key={tag} style={{
                background: `${getTagColor(i)}18`,
                border: `1px solid ${getTagColor(i)}44`,
                color: getTagColor(i),
                fontSize: "0.68rem", fontWeight: 700,
                padding: "3px 10px", borderRadius: 99,
              }}>{tag}</span>
            ))}
          </div>
        )}

        {/* Language toggle for preview */}
        <div style={{
          display: "flex", borderRadius: 8, overflow: "hidden",
          border: "1px solid #e5e7eb", marginBottom: 16, width: "fit-content",
        }}>
          {[{ key: "en", label: "EN", flag: "🇬🇧" }, { key: "bn", label: "বাংলা", flag: "🇧🇩" }].map(({ key, label, flag }) => (
            <button key={key} type="button" onClick={() => setLangTab(key)}
              style={{
                height: 32, padding: "0 14px", border: "none",
                background: langTab === key ? "#111827" : "#f9fafb",
                color: langTab === key ? "#fcb813" : "#6b7280",
                fontWeight: langTab === key ? 700 : 500,
                fontSize: "0.78rem", cursor: "pointer",
                borderRight: key === "en" ? "1px solid #e5e7eb" : "none",
              }}
            >{flag} {label}</button>
          ))}
        </div>

        {/* Content items preview */}
        {(selectedCard.additional?.content_items || [{
          title_en: selectedCard.title_en,
          title_bn: selectedCard.title_bn,
          description_en: selectedCard.description_en,
          description_bn: selectedCard.description_bn,
        }]).map((item, idx) => (
          <div key={idx} style={{
            border: "1px solid #f3f4f6", borderRadius: 10,
            padding: "14px 16px", marginBottom: 10,
            background: "#fafafa",
          }}>
            {(selectedCard.additional?.content_items?.length > 1) && (
              <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.05em", display: "block", marginBottom: 8 }}>
                ITEM {idx + 1}
              </span>
            )}
            <h3 style={{ margin: "0 0 8px", fontSize: "1rem", fontWeight: 800, color: "#111827", lineHeight: 1.4 }}>
              {langTab === "en" ? (item.title_en || "—") : (item.title_bn || item.title_en || "—")}
            </h3>
            {(langTab === "en" ? item.description_en : item.description_bn) && (
              <div
                style={{ fontSize: "0.82rem", color: "#6b7280", lineHeight: 1.65 }}
                dangerouslySetInnerHTML={{
                  __html: langTab === "en" ? item.description_en : (item.description_bn || item.description_en),
                }}
              />
            )}
          </div>
        ))}

        {/* Meta */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
          {selectedCard.page_name && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.8rem", color: "#6b7280" }}>
              <span style={{ color: "#9ca3af" }}>Page:</span>
              <span style={{ fontWeight: 600, color: "#374151" }}>{selectedCard.page_name}</span>
            </div>
          )}
          {selectedCard.link_url && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.8rem", color: "#6b7280" }}>
              <span style={{ color: "#9ca3af" }}>Link:</span>
              <span style={{ fontWeight: 500, color: "#3b82f6", wordBreak: "break-all" }}>{selectedCard.link_url}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  /* ══════════════════════════════════════
     EDIT FORM — same layout as CreateCardForm
  ══════════════════════════════════════ */
  const EditContent = () => (
    <Form form={form} layout="vertical" onFinish={handleSave} style={{ paddingBottom: 24 }}>

      {/* Language tab selector */}
      <div style={{
        display: "flex", borderRadius: 10, overflow: "hidden",
        border: "1px solid #e5e7eb", marginBottom: 20,
      }}>
        {[{ key: "en", label: "English", flag: "🇬🇧" }, { key: "bn", label: "বাংলা", flag: "🇧🇩" }].map(({ key, label, flag }) => (
          <button
            key={key} type="button" onClick={() => setLangTab(key)}
            style={{
              flex: 1, height: 42, border: "none",
              background: langTab === key ? "#111827" : "#f9fafb",
              color: langTab === key ? "#fcb813" : "#6b7280",
              fontWeight: langTab === key ? 700 : 500,
              fontSize: "0.83rem", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              gap: 7, transition: "all 0.15s",
              borderRight: key === "en" ? "1px solid #e5e7eb" : "none",
            }}
          ><span>{flag}</span> {label}</button>
        ))}
      </div>

      {/* Content items */}
      <Section icon={<TranslationOutlined />} title="Content">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {contentItems.map((item, idx) => (
            <div key={item.id} style={{ border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden" }}>
              {/* Item header */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "8px 14px", background: "#f9fafb", borderBottom: "1px solid #f3f4f6",
              }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.05em" }}>
                  ITEM {idx + 1}
                </span>
                {contentItems.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 4,
                      height: 24, padding: "0 10px", borderRadius: 6,
                      border: "1px solid #fecaca", background: "#fff5f5",
                      color: "#dc2626", cursor: "pointer",
                      fontSize: "0.72rem", fontWeight: 600,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#dc2626"; e.currentTarget.style.color = "#fff"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#fff5f5"; e.currentTarget.style.color = "#dc2626"; }}
                  >
                    <MinusCircleOutlined style={{ fontSize: 10 }} /> Remove
                  </button>
                )}
              </div>

              {/* EN fields */}
              <div style={{ display: langTab === "en" ? "block" : "none", padding: "14px 14px 4px" }}>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: "block", fontWeight: 600, fontSize: "0.8rem", marginBottom: 6, color: "#374151" }}>
                    Title {idx === 0 && <span style={{ color: "#dc2626" }}>*</span>}
                  </label>
                  <Input
                    value={item.title_en}
                    onChange={e => handleEnTitleChange(item.id, e.target.value)}
                    placeholder="Enter title in English"
                    style={{ borderRadius: 8, height: 38 }}
                  />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: "block", fontWeight: 600, fontSize: "0.8rem", marginBottom: 6, color: "#374151" }}>
                    Description
                  </label>
                  <RichTextEditor
                    placeholder="Enter description in English"
                    editMode
                    value={item.description_en}
                    onChange={(val) => updateItem(item.id, "description_en", val)}
                  />
                </div>
              </div>

              {/* BN fields */}
              <div style={{ display: langTab === "bn" ? "block" : "none", padding: "14px 14px 4px" }}>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: "block", fontWeight: 600, fontSize: "0.8rem", marginBottom: 6, color: "#374151" }}>
                    শিরোনাম (Title)
                  </label>
                  <Input
                    value={item.title_bn}
                    onChange={e => updateItem(item.id, "title_bn", e.target.value)}
                    placeholder="বাংলায় শিরোনাম লিখুন"
                    style={{ borderRadius: 8, height: 38 }}
                  />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: "block", fontWeight: 600, fontSize: "0.8rem", marginBottom: 6, color: "#374151" }}>
                    বিবরণ (Description)
                  </label>
                  <RichTextEditor
                    placeholder="বাংলায় বিবরণ লিখুন"
                    editMode
                    value={item.description_bn}
                    onChange={(val) => updateItem(item.id, "description_bn", val)}
                  />
                </div>
              </div>
            </div>
          ))}
          <AddFieldBtn label="Add another item" onClick={addItem} />
        </div>
      </Section>

      {/* Media */}
      <Section icon={<PictureOutlined />} title="Images">
        {selectedMedia.length > 0 && (
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 12,
            padding: 12, background: "#f9fafb",
            border: "1px dashed #e5e7eb", borderRadius: 10,
          }}>
            {selectedMedia.map(item => (
              <MediaThumb key={item.id} item={item} onRemove={removeMedia} />
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={() => setMediaModalOpen(true)}
          style={{
            width: "100%", height: 44, borderRadius: 10,
            border: "1.5px dashed #d1d5db", background: "#f9fafb",
            color: "#6b7280", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 8, fontWeight: 600, fontSize: "0.83rem", transition: "all 0.15s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = "#fcb813";
            e.currentTarget.style.color = "#d97706";
            e.currentTarget.style.background = "#fffbeb";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = "#d1d5db";
            e.currentTarget.style.color = "#6b7280";
            e.currentTarget.style.background = "#f9fafb";
          }}
        >
          <PlusOutlined />
          {selectedMedia.length > 0 ? `Add more images (${selectedMedia.length} selected)` : "Select images"}
        </button>
      </Section>

      {/* Advanced */}
      <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden", marginBottom: 4 }}>
        <button
          type="button"
          onClick={() => setShowAdvanced(v => !v)}
          style={{
            width: "100%", height: 42, border: "none",
            background: showAdvanced ? "#111827" : "#f9fafb",
            color: showAdvanced ? "#fcb813" : "#6b7280",
            display: "flex", alignItems: "center", gap: 8,
            padding: "0 16px", cursor: "pointer",
            fontWeight: 600, fontSize: "0.83rem",
          }}
        >
          <SettingOutlined />
          Advanced Settings
          <span style={{ marginLeft: "auto", fontSize: "0.7rem" }}>{showAdvanced ? "▲" : "▼"}</span>
        </button>

        {showAdvanced && (
          <div style={{ padding: "16px 16px 4px" }}>
            <Form.Item label={<span style={{ fontWeight: 600, fontSize: "0.82rem" }}>Page Association</span>} name="page_name" style={{ marginBottom: 14 }}>
              <Select placeholder="Select page" allowClear showSearch>
                {pages?.filter(p => p.page_name_en).map(p => (
                  <Option key={p.id} value={p.page_name_en}>{p.page_name_en}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label={<span style={{ fontWeight: 600, fontSize: "0.82rem" }}>Link Type</span>} name="link_type" style={{ marginBottom: 10 }}>
              <Radio.Group onChange={handleLinkTypeChange} style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["page","independent","media","internal"].map(v => (
                  <Radio key={v} value={v} style={{ fontSize: "0.8rem" }}>
                    {v === "page" ? "Page" : v === "independent" ? "External URL" : v === "media" ? "Media File" : "Internal Path"}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>

            {linkType === "page" && (
              <Form.Item name="link_page_id" label={<span style={{ fontSize: "0.82rem" }}>Link to page</span>} style={{ marginBottom: 14 }}>
                <Select placeholder="Select a page" allowClear showSearch>
                  {pages?.map(p => <Option key={p.id} value={p.id}>{p.page_name_en}</Option>)}
                </Select>
              </Form.Item>
            )}
            {linkType === "independent" && (
              <Form.Item name="link_url" label={<span style={{ fontSize: "0.82rem" }}>URL</span>} style={{ marginBottom: 14 }}>
                <Input placeholder="https://example.com or /about" style={{ borderRadius: 8 }} />
              </Form.Item>
            )}
            {linkType === "media" && (
              <Form.Item name="media_link_path" label={<span style={{ fontSize: "0.82rem" }}>Media path</span>} style={{ marginBottom: 14 }}>
                <Input addonBefore={process.env.NEXT_PUBLIC_MEDIA_URL} placeholder="media/file.pdf" style={{ borderRadius: 8 }} />
              </Form.Item>
            )}
            {linkType === "internal" && (
              <Form.Item name="internal_link_path" label={<span style={{ fontSize: "0.82rem" }}>Internal path</span>} style={{ marginBottom: 14 }}>
                <Input addonBefore={process.env.NEXT_PUBLIC_APP_URL} placeholder="/about-us" style={{ borderRadius: 8 }} />
              </Form.Item>
            )}

            <Form.Item label={<span style={{ fontWeight: 600, fontSize: "0.82rem" }}>Tags</span>} name="tags" style={{ marginBottom: 14 }}>
              <Select mode="tags" placeholder="Add or select tags" showSearch style={{ width: "100%" }}>
                {uniqueTags?.map(t => <Option key={t} value={t}>{t}</Option>)}
              </Select>
            </Form.Item>

            <Form.Item label={<span style={{ fontWeight: 600, fontSize: "0.82rem" }}>Status</span>} name="status" valuePropName="checked" style={{ marginBottom: 14 }}>
              <Switch checkedChildren="Active" unCheckedChildren="Draft" style={{ background: "#22c55e" }} />
            </Form.Item>
          </div>
        )}
      </div>
    </Form>
  );

  /* ── Footer buttons ── */
  const footerPreview = (
    <div style={{ display: "flex", justifyContent: "flex-end", padding: "12px 0 4px" }}>
      <button
        onClick={() => { setIsEditing(true); setLangTab("en"); }}
        style={{
          height: 38, padding: "0 24px", borderRadius: 9, border: "none",
          background: "#111827", color: "#fcb813", fontWeight: 700,
          cursor: "pointer", fontSize: "0.85rem",
          display: "flex", alignItems: "center", gap: 7,
        }}
      >
        <EditOutlined /> Edit Card
      </button>
    </div>
  );

  const footerEdit = (
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: "12px 0 4px" }}>
      <button
        onClick={() => { setIsEditing(false); setLangTab("en"); }}
        style={{
          height: 38, padding: "0 20px", borderRadius: 9,
          border: "1px solid #e5e7eb", background: "#fff",
          color: "#6b7280", fontWeight: 600, cursor: "pointer", fontSize: "0.85rem",
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = "#d1d5db"}
        onMouseLeave={e => e.currentTarget.style.borderColor = "#e5e7eb"}
      >
        Cancel
      </button>
      <button
        onClick={() => form.submit()}
        disabled={submitting}
        style={{
          height: 38, padding: "0 24px", borderRadius: 9, border: "none",
          background: submitting ? "#9ca3af" : "#111827",
          color: "#fcb813", fontWeight: 700,
          cursor: submitting ? "not-allowed" : "pointer",
          fontSize: "0.85rem",
          display: "flex", alignItems: "center", gap: 7,
        }}
      >
        {submitting ? "Saving..." : <><CheckCircleOutlined /> Save Changes</>}
      </button>
    </div>
  );

  return (
    <>
      <Drawer
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "linear-gradient(135deg,#fcb813,#f97316)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 15,
            }}>🎴</div>
            <span style={{ fontWeight: 700, fontSize: "1rem" }}>
              {isEditing ? "Edit Card" : "Card Preview"}
            </span>
          </div>
        }
        open={visible}
        onClose={onCancel}
        width={560}
        footer={isEditing ? footerEdit : footerPreview}
      >
        {selectedCard && (isEditing ? <EditContent /> : <PreviewContent />)}
      </Drawer>

      <MediaSelectionModal
        isVisible={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        onSelectMedia={handleMediaSelect}
        selectionMode="multiple"
        initialSelectedMedia={selectedMedia}
      />
    </>
  );
};

export default CardsPreviewModal;
