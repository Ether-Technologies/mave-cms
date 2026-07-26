import React, { useState, useEffect, useCallback } from "react";
import { message, Popconfirm, Tooltip } from "antd";
import {
  EditOutlined, DeleteOutlined, CopyOutlined, SaveOutlined,
  CloseOutlined, ReloadOutlined, SlidersOutlined, PlusOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import SliderRenderer from "./SliderRenderer";
import { useSliderRefresh } from "./SliderRefresh";
import SliderConfig from "./SliderConfig";
import SliderSelectionModal from "../../Modals/SliderSelectionModal";

/* ── generic small action button ── */
const Btn = ({ icon, label, onClick, danger, disabled, title, primary }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    style={{
      display: "flex", alignItems: "center", gap: 5,
      height: 30, padding: label ? "0 12px" : "0 9px",
      borderRadius: 7,
      border: primary ? "none" : `1px solid ${danger ? "#fecaca" : "#e5e7eb"}`,
      background: primary ? "#111827" : danger ? "#fff5f5" : "#fff",
      color: primary ? "#fcb813" : danger ? "#ef4444" : "#374151",
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
      fontSize: "0.75rem", fontWeight: 700,
      transition: "all 0.15s",
    }}
    onMouseEnter={e => {
      if (disabled || primary) return;
      e.currentTarget.style.borderColor = danger ? "#ef4444" : "#fcb813";
      e.currentTarget.style.color = danger ? "#ef4444" : "#111827";
    }}
    onMouseLeave={e => {
      if (disabled || primary) return;
      e.currentTarget.style.borderColor = danger ? "#fecaca" : "#e5e7eb";
      e.currentTarget.style.color = danger ? "#ef4444" : "#374151";
    }}
  >
    {icon}{label && <span>{label}</span>}
  </button>
);


/* ══════════════════════════════════════
   Main SliderComponent
══════════════════════════════════════ */
const SliderComponent = ({
  component,
  updateComponent,
  deleteComponent,
  preview = false,
  isEditing = false,
  onDuplicateElement,
}) => {
  const [isModalVisible,    setIsModalVisible]    = useState(false);
  const [sliderData,        setSliderData]        = useState(component._mave);
  const [selectedSliderData,setSelectedSliderData]= useState(null);
  const [sliderConfig,      setSliderConfig]      = useState({
    autoplay: component._mave?.config?.autoplay ?? true,
    dots:     component._mave?.config?.dots     ?? false,
    effect:   component._mave?.config?.effect   ?? "scroll",
    speed:    component._mave?.config?.speed    ?? 500,
    height:   component._mave?.config?.height   ?? 400,
  });

  const { isRefreshing, pollingError, lastSynced, hasUpdate, handleManualRefresh } =
    useSliderRefresh(sliderData, component, updateComponent, preview, isEditing);

  useEffect(() => {
    setSliderData(component._mave);
    if (component._mave?.config) {
      setSliderConfig((prev) => ({ ...prev, ...component._mave.config }));
    }
  }, [component._mave]);

  const handleSelectSlider = useCallback((selected) => {
    setSelectedSliderData(selected);
    setIsModalVisible(false);
  }, []);

  const handleSave = useCallback(() => {
    const target = selectedSliderData || sliderData;
    if (!target) { message.error("No slider selected."); return; }

    if (selectedSliderData) {
      if (selectedSliderData.type === "card" && !selectedSliderData.cards?.length) {
        message.error("Selected card slider has no cards."); return;
      }
      if (selectedSliderData.type === "image" && !selectedSliderData.medias?.length) {
        message.error("Selected image slider has no images."); return;
      }
    }

    updateComponent({
      ...component,
      _mave: { ...target, config: sliderConfig },
      id: target.id,
    });
    setSliderData(target);
    setSelectedSliderData(null);
    message.success("Slider saved.");
  }, [selectedSliderData, sliderData, sliderConfig, component, updateComponent]);

  const handleCancel = useCallback(() => {
    setSelectedSliderData(null);
    message.info("Changes discarded.");
  }, []);

  /* ── preview mode ── */
  if (preview) {
    return <SliderRenderer sliderData={sliderData} config={sliderData?.config} />;
  }

  const isSwapping = !!selectedSliderData;

  // last synced relative label
  const syncLabel = lastSynced
    ? `Synced ${Math.round((Date.now() - lastSynced) / 1000)}s ago`
    : null;

  return (
    <div style={{
      background: "#fff", borderRadius: 12,
      border: `1px solid ${hasUpdate ? "#86efac" : "#e5e7eb"}`,
      overflow: "hidden",
      boxShadow: hasUpdate
        ? "0 0 0 3px rgba(134,239,172,0.3)"
        : "0 1px 4px rgba(0,0,0,0.05)",
      transition: "all 0.3s",
    }}>

      {/* ── Header ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "10px 14px",
        background: "#f9fafb",
        borderBottom: "1px solid #e5e7eb",
        flexWrap: "wrap",
      }}>
        {/* Icon */}
        <div style={{
          width: 28, height: 28, borderRadius: 7, flexShrink: 0,
          background: "linear-gradient(135deg, #fcb813 0%, #f97316 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <SlidersOutlined style={{ fontSize: 13, color: "#fff" }} />
        </div>

        <span style={{ fontWeight: 700, color: "#111827", fontSize: "0.85rem" }}>
          Slider
        </span>

        {sliderData && (
          <span style={{
            padding: "1px 7px", borderRadius: 4,
            background: sliderData.type === "image" ? "#dbeafe" : "#ede9fe",
            color: sliderData.type === "image" ? "#3b82f6" : "#7c3aed",
            fontSize: "0.6rem", fontWeight: 800, textTransform: "uppercase",
          }}>
            {sliderData.type}
          </span>
        )}

        {/* Live sync indicator */}
        {sliderData && (
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{
              width: 7, height: 7, borderRadius: "50%",
              background: hasUpdate ? "#22c55e" : isRefreshing ? "#f59e0b" : "#94a3b8",
              boxShadow: hasUpdate ? "0 0 0 3px rgba(34,197,94,0.25)" : "none",
              transition: "all 0.3s",
            }} />
            <span style={{ fontSize: "0.62rem", color: "#9ca3af" }}>
              {hasUpdate ? "Updated!" : isRefreshing ? "Syncing…" : syncLabel || "Live sync"}
            </span>
          </div>
        )}

        <div style={{ flex: 1 }} />

        {/* Refresh */}
        {sliderData && (
          <Btn
            icon={<ReloadOutlined spin={isRefreshing} style={{ fontSize: "0.75rem" }} />}
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            title="Sync now"
          />
        )}

        {/* Context actions */}
        {!isSwapping ? (
          <>
            <Btn
              icon={<EditOutlined style={{ fontSize: "0.75rem" }} />}
              label={sliderData ? "Change" : "Select"}
              onClick={() => setIsModalVisible(true)}
            />
            {sliderData && (
              <>
                <Btn
                  icon={<CopyOutlined style={{ fontSize: "0.75rem" }} />}
                  onClick={onDuplicateElement}
                  title="Duplicate component"
                />
                <Popconfirm
                  title="Delete this slider component?"
                  onConfirm={deleteComponent}
                  okText="Delete" cancelText="Cancel"
                  okButtonProps={{ danger: true }}
                >
                  <Btn
                    icon={<DeleteOutlined style={{ fontSize: "0.75rem" }} />}
                    danger title="Delete"
                  />
                </Popconfirm>
                <Btn
                  icon={<SaveOutlined style={{ fontSize: "0.75rem" }} />}
                  label="Save"
                  onClick={handleSave}
                  primary
                />
              </>
            )}
          </>
        ) : (
          <>
            <Btn
              icon={<CheckOutlined style={{ fontSize: "0.75rem" }} />}
              label="Confirm"
              onClick={handleSave}
              primary
            />
            <Btn
              icon={<CloseOutlined style={{ fontSize: "0.75rem" }} />}
              label="Cancel"
              onClick={handleCancel}
              danger
            />
          </>
        )}
      </div>

      {/* ── Error ── */}
      {pollingError && (
        <div style={{ padding: "5px 14px", background: "#fff5f5", borderBottom: "1px solid #fecaca" }}>
          <span style={{ fontSize: "0.7rem", color: "#ef4444" }}>{pollingError}</span>
        </div>
      )}

      {/* ── Auto-updated banner ── */}
      {hasUpdate && (
        <div style={{
          padding: "6px 14px", background: "#f0fdf4",
          borderBottom: "1px solid #86efac",
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <CheckOutlined style={{ fontSize: "0.72rem", color: "#22c55e" }} />
          <span style={{ fontSize: "0.72rem", color: "#15803d", fontWeight: 600 }}>
            Slider updated from Sliders page — save to keep changes
          </span>
        </div>
      )}

      {/* ── No slider empty state ── */}
      {!sliderData && (
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          padding: "36px 24px", gap: 12,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: "linear-gradient(135deg, #fcb813 0%, #f97316 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 14px rgba(252,184,19,0.35)",
          }}>
            <SlidersOutlined style={{ fontSize: 22, color: "#fff" }} />
          </div>
          <p style={{ margin: 0, color: "#374151", fontWeight: 700 }}>No slider selected</p>
          <button
            type="button"
            onClick={() => setIsModalVisible(true)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              height: 34, padding: "0 16px", borderRadius: 8, border: "none",
              background: "linear-gradient(135deg, #fcb813 0%, #f97316 100%)",
              color: "#111827", cursor: "pointer",
              fontSize: "0.8rem", fontWeight: 800,
            }}
          >
            <PlusOutlined /> Select Slider
          </button>
        </div>
      )}

      {/* ── Slider body ── */}
      {sliderData && (
        <div>
          <SliderRenderer sliderData={sliderData} config={sliderConfig} />
        </div>
      )}

      <SliderSelectionModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSelectSlider={handleSelectSlider}
      />
    </div>
  );
};

export default SliderComponent;
