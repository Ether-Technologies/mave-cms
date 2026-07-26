import React, { useState } from "react";
import { PictureOutlined, HolderOutlined, CloseOutlined } from "@ant-design/icons";
import Image from "next/image";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL;
const placeholder = "/images/Image_Placeholder.png";

/* ── Single sortable media thumb ── */
const SortableMediaThumb = ({ media, onRemove }) => {
  const [hovered, setHovered] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: media.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
  };

  const src = media.file_path ? `${MEDIA_URL}/${media.file_path}` : placeholder;

  return (
    <div
      ref={setNodeRef}
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        borderRadius: 10, overflow: "hidden",
        border: `2px solid ${hovered ? "#fcb813" : "#e5e7eb"}`,
        background: "#f9fafb", transition: "border-color 0.15s",
      }}>
        {/* Drag handle */}
        <div
          {...attributes}
          {...listeners}
          style={{
            height: 20, background: hovered ? "#fffbeb" : "#f3f4f6",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "grab", transition: "background 0.15s",
            borderBottom: "1px solid #e5e7eb",
          }}
          title="Drag to reorder"
        >
          <HolderOutlined style={{ fontSize: "0.7rem", color: "#9ca3af" }} />
        </div>

        {/* Thumbnail */}
        <div style={{ position: "relative", height: 72 }}>
          <Image src={src} alt={media.file_name || "Media"} layout="fill" objectFit="cover" />

          {/* Remove overlay */}
          <div style={{
            position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)",
            display: "flex", alignItems: "center", justifyContent: "center",
            opacity: hovered ? 1 : 0, transition: "opacity 0.15s",
          }}>
            <button
              type="button"
              onClick={onRemove}
              style={{
                width: 26, height: 26, borderRadius: "50%",
                border: "2px solid #fff", background: "rgba(239,68,68,0.9)",
                cursor: "pointer", color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <CloseOutlined style={{ fontSize: "0.6rem" }} />
            </button>
          </div>
        </div>

        {/* Filename */}
        <div style={{
          padding: "5px 6px",
          fontSize: "0.63rem", fontWeight: 600,
          color: hovered ? "#b45309" : "#374151",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          textAlign: "center", transition: "color 0.15s",
        }}>
          {media.file_name || "Image"}
        </div>
      </div>
    </div>
  );
};

/* ── Drag overlay ghost ── */
const DragGhost = ({ media }) => {
  const src = media.file_path ? `${MEDIA_URL}/${media.file_path}` : placeholder;
  return (
    <div style={{
      borderRadius: 10, overflow: "hidden",
      border: "2px solid #fcb813",
      boxShadow: "0 12px 32px rgba(252,184,19,0.4)",
      background: "#fffbeb", width: 104,
      transform: "rotate(2deg) scale(1.05)",
    }}>
      <div style={{
        height: 20, background: "#fffbeb",
        display: "flex", alignItems: "center", justifyContent: "center",
        borderBottom: "1px solid #fde68a",
      }}>
        <HolderOutlined style={{ fontSize: "0.7rem", color: "#d97706" }} />
      </div>
      <div style={{ position: "relative", height: 72 }}>
        <Image src={src} alt="dragging" layout="fill" objectFit="cover" />
      </div>
      <div style={{
        padding: "5px 6px", fontSize: "0.63rem", fontWeight: 700,
        color: "#b45309", overflow: "hidden", textOverflow: "ellipsis",
        whiteSpace: "nowrap", textAlign: "center",
      }}>
        {media.file_name || "Image"}
      </div>
    </div>
  );
};

/* ── Main MediaSelector ── */
const MediaSelector = ({ selectedMedia, setSelectedMedia, setIsMediaModalVisible }) => {
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const handleDragStart = ({ active }) => setActiveId(active.id);

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    if (!over || active.id === over.id) return;
    const oldIndex = selectedMedia.findIndex(m => m.id === active.id);
    const newIndex = selectedMedia.findIndex(m => m.id === over.id);
    setSelectedMedia(arrayMove(selectedMedia, oldIndex, newIndex));
  };

  const activeMedia = activeId ? selectedMedia.find(m => m.id === activeId) : null;

  return (
    <div>
      {/* Select button */}
      <button
        type="button"
        onClick={() => setIsMediaModalVisible(true)}
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          height: 40, padding: "0 20px", borderRadius: 10,
          border: "2px dashed #d1d5db", background: "#f9fafb",
          cursor: "pointer", fontSize: "0.85rem", color: "#6b7280", fontWeight: 600,
          transition: "all 0.15s",
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = "#fcb813";
          e.currentTarget.style.color = "#111827";
          e.currentTarget.style.background = "#fffbeb";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = "#d1d5db";
          e.currentTarget.style.color = "#6b7280";
          e.currentTarget.style.background = "#f9fafb";
        }}
      >
        <PictureOutlined style={{ fontSize: 16 }} />
        {selectedMedia.length > 0 ? `${selectedMedia.length} selected — change` : "Select Media"}
      </button>

      {/* Count + hint */}
      {selectedMedia.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, marginBottom: 4 }}>
          <span style={{
            padding: "2px 10px", borderRadius: 20,
            background: "#fffbeb", color: "#b45309",
            fontSize: "0.7rem", fontWeight: 700,
            border: "1px solid #fde68a",
          }}>
            {selectedMedia.length} image{selectedMedia.length !== 1 ? "s" : ""} selected
          </span>
          <span style={{ fontSize: "0.7rem", color: "#9ca3af" }}>
            drag the handle to reorder
          </span>
        </div>
      )}

      {/* Sortable grid */}
      {selectedMedia.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={selectedMedia.map(m => m.id)}
            strategy={rectSortingStrategy}
          >
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
              gap: 10, marginTop: 8,
            }}>
              {selectedMedia.map(media => (
                <SortableMediaThumb
                  key={media.id}
                  media={media}
                  onRemove={() => setSelectedMedia(selectedMedia.filter(m => m.id !== media.id))}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay dropAnimation={{ duration: 180, easing: "ease" }}>
            {activeMedia ? <DragGhost media={activeMedia} /> : null}
          </DragOverlay>
        </DndContext>
      )}

      {selectedMedia.length === 0 && (
        <div style={{
          marginTop: 12, display: "flex", alignItems: "center", gap: 8,
          color: "#9ca3af", fontSize: "0.78rem",
        }}>
          <PictureOutlined />
          No media selected
        </div>
      )}
    </div>
  );
};

export default MediaSelector;
