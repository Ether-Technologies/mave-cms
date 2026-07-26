import React, { useState, useEffect } from "react";
import {
  Form, Input, Select, Radio, Switch, Drawer, message,
} from "antd";
import {
  PlusOutlined, TranslationOutlined, SettingOutlined,
  PictureOutlined, CheckCircleOutlined, MinusCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import MediaSelectionModal from "../PageBuilder/Modals/MediaSelectionModal";
import RichTextEditor from "../RichTextEditor";
import instance from "../../axios";
import Image from "next/image";

const { Option } = Select;
const PLACEHOLDER = "/images/Image_Placeholder.png";
const TAG_COLORS = ["#fcb813","#8b5cf6","#06b6d4","#10b981","#f43f5e","#3b82f6","#f97316","#84cc16"];
const getTagColor = (i) => TAG_COLORS[i % TAG_COLORS.length];

/* ─────────────── helpers ─────────────── */

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

/* single selected media preview */
const MediaPreview = ({ item, onClear, onChange }) => {
  const url = item?.file_path
    ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/${item.file_path}`
    : PLACEHOLDER;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: 10, background: "#f9fafb",
      border: "1px solid #e5e7eb", borderRadius: 10, marginBottom: 10,
    }}>
      <div style={{
        position: "relative", width: 80, height: 60,
        borderRadius: 8, overflow: "hidden", flexShrink: 0,
        border: "2px solid #fcb813",
      }}>
        <Image src={url} alt="media" layout="fill" objectFit="cover"
          onError={(e) => { e.target.src = PLACEHOLDER; }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: "0 0 2px", fontWeight: 600, fontSize: "0.8rem", color: "#111827",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {item?.file_name || "Selected image"}
        </p>
        <p style={{ margin: 0, fontSize: "0.7rem", color: "#9ca3af" }}>{item?.file_type || ""}</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 }}>
        <button type="button" onClick={onChange}
          style={{
            height: 26, padding: "0 10px", borderRadius: 6,
            border: "1px solid #e5e7eb", background: "#fff",
            color: "#374151", cursor: "pointer", fontSize: "0.72rem", fontWeight: 600,
          }}>Change</button>
        <button type="button" onClick={onClear}
          style={{
            height: 26, padding: "0 10px", borderRadius: 6,
            border: "1px solid #fecaca", background: "#fff5f5",
            color: "#dc2626", cursor: "pointer", fontSize: "0.72rem", fontWeight: 600,
          }}>Remove</button>
      </div>
    </div>
  );
};

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

const LangTab = ({ langTab, setLangTab }) => (
  <div style={{
    display: "flex", borderRadius: 10, overflow: "hidden",
    border: "1px solid #e5e7eb", marginBottom: 20,
  }}>
    {[{ key: "en", label: "English", flag: "🇬🇧" }, { key: "bn", label: "বাংলা", flag: "🇧🇩" }].map(({ key, label, flag }) => (
      <button key={key} type="button" onClick={() => setLangTab(key)}
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
);

const newItem = () => ({
  id: Date.now() + Math.random(),
  title_en: "", title_bn: "", description_en: "", description_bn: "",
});

/* ═══════════════════════════════════════════════════
   CardDrawer — single modal for create + preview + edit
   • selectedCard = null  → create mode
   • selectedCard = {...} → preview mode, then edit on click
═══════════════════════════════════════════════════ */
const CardDrawer = ({ open, onClose, selectedCard, pages, media, uniqueTags, onSuccess }) => {
  const isCreate = !selectedCard;

  const [form]          = Form.useForm();
  /* "preview" | "edit" | "create" */
  const [mode, setMode] = useState(isCreate ? "create" : "preview");
  const [submitting, setSubmitting]     = useState(false);
  const [langTab, setLangTab]           = useState("en");
  const [contentItems, setContentItems] = useState([newItem()]);
  const descRefs = React.useRef({}); // tracks description values without causing re-renders
  const [selectedMedia, setSelectedMedia] = useState(null); // single object
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [linkType, setLinkType]         = useState("independent");
  const [showAdvanced, setShowAdvanced] = useState(false);

  /* ─── Reset when drawer opens/closes ─── */
  useEffect(() => {
    if (!open) {
      setMode(isCreate ? "create" : "preview");
      setLangTab("en");
      setShowAdvanced(false);
      if (isCreate) {
        form.resetFields();
        setContentItems([newItem()]);
        setSelectedMedia(null);
        setLinkType("independent");
      }
      return;
    }
    if (isCreate) {
      setMode("create");
      const fresh = newItem();
      descRefs.current = {};
      setContentItems([fresh]);
      setSelectedMedia(null);
      form.setFieldsValue({ link_type: "independent", status: true });
    }
  }, [open]);

  /* ─── Populate from selectedCard ─── */
  useEffect(() => {
    if (!selectedCard || !open) return;
    setMode("preview");

    descRefs.current = {};
    const existing = selectedCard.additional?.content_items;
    if (existing?.length > 0) {
      const items = existing.map(it => ({ ...it, id: it.id || Date.now() + Math.random() }));
      items.forEach(it => {
        descRefs.current[`${it.id}-en`] = it.description_en || "";
        descRefs.current[`${it.id}-bn`] = it.description_bn || "";
      });
      setContentItems(items);
    } else {
      const item = {
        id: Date.now(),
        title_en:       selectedCard.title_en       || "",
        title_bn:       selectedCard.title_bn       || "",
        description_en: selectedCard.description_en || "",
        description_bn: selectedCard.description_bn || "",
      };
      descRefs.current[`${item.id}-en`] = item.description_en;
      descRefs.current[`${item.id}-bn`] = item.description_bn;
      setContentItems([item]);
    }

    // API: media_ids is a single integer; media_files is a hasOne object
    setSelectedMedia(selectedCard.media_files || null);

    let lt = "independent"; let link_page_id;
    if (selectedCard.link_url) {
      try {
        if (selectedCard.link_url.startsWith(process.env.NEXT_PUBLIC_MEDIA_URL)) {
          lt = "media";
        } else {
          const u = new URL(selectedCard.link_url, window.location.origin);
          const pid = u.searchParams.get("page_id");
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
  }, [selectedCard, open]);

  /* ─── content item helpers ─── */
  const updateItem  = (id, field, val) =>
    setContentItems(prev => prev.map(it => it.id === id ? { ...it, [field]: val } : it));
  const addItem    = () => setContentItems(prev => [...prev, newItem()]);
  const removeItem = (id) => {
    setContentItems(prev => prev.filter(it => it.id !== id));
    // clean up refs for removed item
    Object.keys(descRefs.current).forEach(k => {
      if (k.startsWith(String(id))) delete descRefs.current[k];
    });
  };

  /* ─── media helpers ─── */
  const handleMediaSelect = (item) => {
    // single selection: item is a single object (not array)
    setSelectedMedia(Array.isArray(item) ? item[0] : item);
    setMediaModalOpen(false);
  };
  const clearMedia = () => setSelectedMedia(null);

  /* ─── link helpers ─── */
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

  /* ─── submit ─── */
  const handleSubmit = async (values) => {
    // merge ref-tracked descriptions into contentItems
    const itemsWithDesc = contentItems.map(it => ({
      ...it,
      description_en: descRefs.current[`${it.id}-en`] ?? it.description_en,
      description_bn: descRefs.current[`${it.id}-bn`] ?? it.description_bn,
    }));
    const first = itemsWithDesc[0];

    if (!first?.title_en?.trim()) {
      message.error("English title is required.");
      setLangTab("en");
      return;
    }
    if (!selectedMedia) {
      message.error("Please select an image.");
      return;
    }
    setSubmitting(true);
    try {
      const finalLink = buildLink(values);
      const payload = {
        title_en:       first.title_en,
        title_bn:       first.title_bn,
        description_en: first.description_en || "",
        description_bn: first.description_bn || "",
        media_ids:      selectedMedia.id,
        page_name:      values.page_name || "",
        link_url:       finalLink || "",
        status:         values.status ? 1 : 0,
        additional: {
          tags:          values.tags || [],
          content_items: itemsWithDesc,
        },
      };

      if (mode === "create") {
        await instance.post("/cards", payload);
        message.success("Card created successfully.");
      } else {
        await instance.put(`/cards/${selectedCard.id}`, payload);
        message.success("Card updated successfully.");
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      message.error(mode === "create" ? "Failed to create card." : "Failed to update card.");
    } finally {
      setSubmitting(false);
    }
  };

  // derive preview vars here (not inside a sub-component)
  const previewTags  = selectedCard?.additional?.tags || [];
  const previewActive = selectedCard?.status === 1;
  const previewMf    = selectedCard?.media_files;
  const previewMUrl  = previewMf?.file_path ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/${previewMf.file_path}` : null;
  const previewItems = selectedCard?.additional?.content_items || [{
    title_en: selectedCard?.title_en, title_bn: selectedCard?.title_bn,
    description_en: selectedCard?.description_en, description_bn: selectedCard?.description_bn,
  }];

  /* ─── footer ─── */
  const footer = mode === "preview" ? (
    <div style={{ display: "flex", justifyContent: "flex-end", padding: "12px 0 4px" }}>
      <button
        onClick={() => { setMode("edit"); setLangTab("en"); }}
        style={{
          height: 38, padding: "0 24px", borderRadius: 9, border: "none",
          background: "#111827", color: "#fcb813", fontWeight: 700,
          cursor: "pointer", fontSize: "0.85rem",
          display: "flex", alignItems: "center", gap: 7,
        }}
      ><EditOutlined /> Edit Card</button>
    </div>
  ) : (
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, padding: "12px 0 4px" }}>
      <button
        onClick={() => mode === "edit" ? setMode("preview") : onClose()}
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
        {submitting
          ? (mode === "create" ? "Creating..." : "Saving...")
          : <><CheckCircleOutlined /> {mode === "create" ? "Create Card" : "Save Changes"}</>}
      </button>
    </div>
  );

  const titleLabel = mode === "preview" ? "Card Preview" : mode === "edit" ? "Edit Card" : "Create Card";

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
            <span style={{ fontWeight: 700, fontSize: "1rem" }}>{titleLabel}</span>
          </div>
        }
        open={open}
        onClose={onClose}
        width={560}
        destroyOnClose={false}
        footer={footer}
      >
        {/* ══ PREVIEW ══ */}
        {mode === "preview" && selectedCard && (
          <div>
            <div style={{ position:"relative", width:"100%", height:220, borderRadius:14, overflow:"hidden", background:"#1f2937", marginBottom:20 }}>
              {previewMUrl ? (
                previewMf.file_type?.startsWith("video/") ? (
                  <video style={{ width:"100%", height:"100%", objectFit:"cover" }} controls muted playsInline>
                    <source src={previewMUrl} type={previewMf.file_type} />
                  </video>
                ) : (
                  <Image src={previewMUrl} alt={selectedCard.title_en||"Card"} layout="fill" objectFit="cover"
                    onError={(e)=>{e.target.src=PLACEHOLDER;}} />
                )
              ) : (
                <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",fontSize:48,opacity:0.2}}>🃏</div>
              )}
              <div style={{ position:"absolute", top:12, left:12, background: previewActive?"rgba(34,197,94,0.18)":"rgba(0,0,0,0.4)", backdropFilter:"blur(8px)", border:`1px solid ${previewActive?"rgba(34,197,94,0.5)":"rgba(255,255,255,0.2)"}`, color:previewActive?"#4ade80":"rgba(255,255,255,0.7)", fontSize:"0.65rem", fontWeight:700, padding:"3px 10px", borderRadius:99, letterSpacing:"0.06em" }}>
                {previewActive?"● Active":"○ Draft"}
              </div>
              <div style={{position:"absolute",top:14,right:12,color:"rgba(255,255,255,0.35)",fontSize:"0.6rem",fontFamily:"monospace"}}>#{selectedCard.id}</div>
            </div>

            {previewTags.length > 0 && (
              <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>
                {previewTags.map((tag,i)=>(
                  <span key={tag} style={{background:`${getTagColor(i)}18`,border:`1px solid ${getTagColor(i)}44`,color:getTagColor(i),fontSize:"0.68rem",fontWeight:700,padding:"3px 10px",borderRadius:99}}>{tag}</span>
                ))}
              </div>
            )}

            <div style={{display:"flex",borderRadius:8,overflow:"hidden",border:"1px solid #e5e7eb",marginBottom:16,width:"fit-content"}}>
              {[{key:"en",label:"EN",flag:"🇬🇧"},{key:"bn",label:"বাংলা",flag:"🇧🇩"}].map(({key,label,flag})=>(
                <button key={key} type="button" onClick={()=>setLangTab(key)}
                  style={{height:32,padding:"0 14px",border:"none",background:langTab===key?"#111827":"#f9fafb",color:langTab===key?"#fcb813":"#6b7280",fontWeight:langTab===key?700:500,fontSize:"0.78rem",cursor:"pointer",borderRight:key==="en"?"1px solid #e5e7eb":"none"}}
                >{flag} {label}</button>
              ))}
            </div>

            {previewItems.map((it,idx)=>(
              <div key={idx} style={{border:"1px solid #f3f4f6",borderRadius:10,padding:"14px 16px",marginBottom:10,background:"#fafafa"}}>
                {previewItems.length>1&&<span style={{fontSize:"0.68rem",fontWeight:700,color:"#9ca3af",letterSpacing:"0.05em",display:"block",marginBottom:8}}>ITEM {idx+1}</span>}
                <h3 style={{margin:"0 0 8px",fontSize:"1rem",fontWeight:800,color:"#111827",lineHeight:1.4}}>
                  {langTab==="en"?(it.title_en||"—"):(it.title_bn||"—")}
                </h3>
                {(langTab==="en"?it.description_en:it.description_bn)&&(
                  <div style={{fontSize:"0.82rem",color:"#6b7280",lineHeight:1.65}}
                    dangerouslySetInnerHTML={{__html:langTab==="en"?it.description_en:it.description_bn}} />
                )}
              </div>
            ))}

            <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:16}}>
              {selectedCard.page_name&&<div style={{fontSize:"0.8rem",color:"#6b7280"}}><span style={{color:"#9ca3af"}}>Page: </span><span style={{fontWeight:600,color:"#374151"}}>{selectedCard.page_name}</span></div>}
              {selectedCard.link_url&&<div style={{fontSize:"0.8rem",color:"#6b7280"}}><span style={{color:"#9ca3af"}}>Link: </span><span style={{fontWeight:500,color:"#3b82f6",wordBreak:"break-all"}}>{selectedCard.link_url}</span></div>}
            </div>
          </div>
        )}

        {/* ══ FORM (create / edit) ══ */}
        {mode !== "preview" && (
          <Form form={form} layout="vertical" onFinish={handleSubmit} style={{paddingBottom:24}}>
            <LangTab langTab={langTab} setLangTab={setLangTab} />

            <Section icon={<TranslationOutlined />} title="Content">
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {contentItems.map((item,idx)=>(
                  <div key={item.id} style={{border:"1px solid #e5e7eb",borderRadius:10,overflow:"hidden"}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 14px",background:"#f9fafb",borderBottom:"1px solid #f3f4f6"}}>
                      <span style={{fontSize:"0.75rem",fontWeight:700,color:"#9ca3af",letterSpacing:"0.05em"}}>ITEM {idx+1}</span>
                      {contentItems.length>1&&(
                        <button type="button" onClick={()=>removeItem(item.id)}
                          style={{display:"flex",alignItems:"center",gap:4,height:24,padding:"0 10px",borderRadius:6,border:"1px solid #fecaca",background:"#fff5f5",color:"#dc2626",cursor:"pointer",fontSize:"0.72rem",fontWeight:600}}
                          onMouseEnter={e=>{e.currentTarget.style.background="#dc2626";e.currentTarget.style.color="#fff";}}
                          onMouseLeave={e=>{e.currentTarget.style.background="#fff5f5";e.currentTarget.style.color="#dc2626";}}
                        ><MinusCircleOutlined style={{fontSize:10}}/> Remove</button>
                      )}
                    </div>

                    {/* EN fields */}
                    <div style={{display:langTab==="en"?"block":"none",padding:"14px 14px 4px"}}>
                      <div style={{marginBottom:12}}>
                        <label style={{display:"block",fontWeight:600,fontSize:"0.8rem",marginBottom:6,color:"#374151"}}>
                          Title {idx===0&&<span style={{color:"#dc2626"}}>*</span>}
                        </label>
                        <Input value={item.title_en} onChange={e=>updateItem(item.id,"title_en",e.target.value)}
                          placeholder="Enter title in English" style={{borderRadius:8,height:38}} />
                      </div>
                      <div style={{marginBottom:12}}>
                        <label style={{display:"block",fontWeight:600,fontSize:"0.8rem",marginBottom:6,color:"#374151"}}>Description</label>
                        <RichTextEditor key={`${item.id}-en`} placeholder="Enter description in English" editMode
                          defaultValue={item.description_en}
                          onChange={val=>{descRefs.current[`${item.id}-en`]=val;}} />
                      </div>
                    </div>

                    {/* BN fields */}
                    <div style={{display:langTab==="bn"?"block":"none",padding:"14px 14px 4px"}}>
                      <div style={{marginBottom:12}}>
                        <label style={{display:"block",fontWeight:600,fontSize:"0.8rem",marginBottom:6,color:"#374151"}}>শিরোনাম (Title)</label>
                        <Input value={item.title_bn} onChange={e=>updateItem(item.id,"title_bn",e.target.value)}
                          placeholder="বাংলায় শিরোনাম লিখুন" style={{borderRadius:8,height:38}} />
                      </div>
                      <div style={{marginBottom:12}}>
                        <label style={{display:"block",fontWeight:600,fontSize:"0.8rem",marginBottom:6,color:"#374151"}}>বিবরণ (Description)</label>
                        <RichTextEditor key={`${item.id}-bn`} placeholder="বাংলায় বিবরণ লিখুন" editMode
                          defaultValue={item.description_bn}
                          onChange={val=>{descRefs.current[`${item.id}-bn`]=val;}} />
                      </div>
                    </div>
                  </div>
                ))}
                <AddFieldBtn label="Add another item" onClick={addItem} />
              </div>
            </Section>

            <Section icon={<PictureOutlined />} title="Image">
              {selectedMedia ? (
                <MediaPreview item={selectedMedia} onClear={clearMedia} onChange={()=>setMediaModalOpen(true)} />
              ) : (
                <>
                  <button type="button" onClick={()=>setMediaModalOpen(true)}
                    style={{width:"100%",height:44,borderRadius:10,border:"1.5px dashed #d1d5db",background:"#f9fafb",color:"#6b7280",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,fontWeight:600,fontSize:"0.83rem",transition:"all 0.15s"}}
                    onMouseEnter={e=>{e.currentTarget.style.borderColor="#fcb813";e.currentTarget.style.color="#d97706";e.currentTarget.style.background="#fffbeb";}}
                    onMouseLeave={e=>{e.currentTarget.style.borderColor="#d1d5db";e.currentTarget.style.color="#6b7280";e.currentTarget.style.background="#f9fafb";}}
                  ><PlusOutlined /> Select image</button>
                  <p style={{margin:"6px 0 0",fontSize:"0.72rem",color:"#9ca3af"}}>One image per card</p>
                </>
              )}
            </Section>

            <div style={{border:"1px solid #e5e7eb",borderRadius:10,overflow:"hidden",marginBottom:4}}>
              <button type="button" onClick={()=>setShowAdvanced(v=>!v)}
                style={{width:"100%",height:42,border:"none",background:showAdvanced?"#111827":"#f9fafb",color:showAdvanced?"#fcb813":"#6b7280",display:"flex",alignItems:"center",gap:8,padding:"0 16px",cursor:"pointer",fontWeight:600,fontSize:"0.83rem"}}
              >
                <SettingOutlined /> Advanced Settings
                <span style={{marginLeft:"auto",fontSize:"0.7rem"}}>{showAdvanced?"▲":"▼"}</span>
              </button>
              {showAdvanced&&(
                <div style={{padding:"16px 16px 4px"}}>
                  <Form.Item label={<span style={{fontWeight:600,fontSize:"0.82rem"}}>Page Association</span>} name="page_name" style={{marginBottom:14}}>
                    <Select placeholder="Select page" allowClear showSearch>
                      {pages?.filter(p=>p.page_name_en).map(p=><Option key={p.id} value={p.page_name_en}>{p.page_name_en}</Option>)}
                    </Select>
                  </Form.Item>
                  <Form.Item label={<span style={{fontWeight:600,fontSize:"0.82rem"}}>Link Type</span>} name="link_type" style={{marginBottom:10}}>
                    <Radio.Group onChange={handleLinkTypeChange} style={{display:"flex",flexWrap:"wrap",gap:8}}>
                      {["page","independent","media","internal"].map(v=>(
                        <Radio key={v} value={v} style={{fontSize:"0.8rem"}}>
                          {v==="page"?"Page":v==="independent"?"External URL":v==="media"?"Media File":"Internal Path"}
                        </Radio>
                      ))}
                    </Radio.Group>
                  </Form.Item>
                  {linkType==="page"&&<Form.Item name="link_page_id" label={<span style={{fontSize:"0.82rem"}}>Link to page</span>} style={{marginBottom:14}}><Select placeholder="Select a page" allowClear showSearch>{pages?.map(p=><Option key={p.id} value={p.id}>{p.page_name_en}</Option>)}</Select></Form.Item>}
                  {linkType==="independent"&&<Form.Item name="link_url" label={<span style={{fontSize:"0.82rem"}}>URL</span>} style={{marginBottom:14}}><Input placeholder="https://example.com or /about" style={{borderRadius:8}}/></Form.Item>}
                  {linkType==="media"&&<Form.Item name="media_link_path" label={<span style={{fontSize:"0.82rem"}}>Media path</span>} style={{marginBottom:14}}><Input addonBefore={process.env.NEXT_PUBLIC_MEDIA_URL} placeholder="media/file.pdf" style={{borderRadius:8}}/></Form.Item>}
                  {linkType==="internal"&&<Form.Item name="internal_link_path" label={<span style={{fontSize:"0.82rem"}}>Internal path</span>} style={{marginBottom:14}}><Input addonBefore={process.env.NEXT_PUBLIC_APP_URL} placeholder="/about-us" style={{borderRadius:8}}/></Form.Item>}
                  <Form.Item label={<span style={{fontWeight:600,fontSize:"0.82rem"}}>Tags</span>} name="tags" style={{marginBottom:14}}>
                    <Select mode="tags" placeholder="Add or select tags" showSearch style={{width:"100%"}}>
                      {uniqueTags?.map(t=><Option key={t} value={t}>{t}</Option>)}
                    </Select>
                  </Form.Item>
                  <Form.Item label={<span style={{fontWeight:600,fontSize:"0.82rem"}}>Status</span>} name="status" valuePropName="checked" style={{marginBottom:14}}>
                    <Switch checkedChildren="Active" unCheckedChildren="Draft" style={{background:"#22c55e"}}/>
                  </Form.Item>
                </div>
              )}
            </div>
          </Form>
        )}
      </Drawer>

      <MediaSelectionModal
        isVisible={mediaModalOpen}
        onClose={() => setMediaModalOpen(false)}
        onSelectMedia={handleMediaSelect}
        selectionMode="single"
        initialSelectedMedia={selectedMedia ? [selectedMedia] : []}
      />
    </>
  );
};

export default CardDrawer;
