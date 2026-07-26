import React, { useState } from "react";
import { Select } from "antd";
import { CreditCardOutlined, CloseOutlined, HolderOutlined } from "@ant-design/icons";
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

const { Option } = Select;

/* ── Single sortable card thumb ── */
const SortableCardThumb = ({ cardId, card, MEDIA_URL, placeholder, onRemove }) => {
  const [hovered, setHovered] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: cardId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
    zIndex: isDragging ? 999 : "auto",
  };

  const imgSrc = card?.media_files?.file_path
    ? `${MEDIA_URL}/${card.media_files.file_path}`
    : placeholder;

  return (
    <div
      ref={setNodeRef}
      style={style}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        borderRadius: 10, overflow: "hidden",
        border: `2px solid ${hovered ? "#7c3aed" : "#e5e7eb"}`,
        background: "#f9fafb", transition: "border-color 0.15s",
        cursor: "default",
      }}>
        {/* Drag handle bar */}
        <div
          {...attributes}
          {...listeners}
          style={{
            height: 20, background: hovered ? "#ede9fe" : "#f3f4f6",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "grab", transition: "background 0.15s",
            borderBottom: "1px solid #e5e7eb",
          }}
          title="Drag to reorder"
        >
          <HolderOutlined style={{ fontSize: "0.7rem", color: "#9ca3af" }} />
        </div>

        {/* Thumbnail */}
        <div style={{ position: "relative", height: 70 }}>
          <Image src={imgSrc} alt={card?.title_en || "Card"} layout="fill" objectFit="cover" />

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
                fontWeight: 700,
              }}
            >
              <CloseOutlined style={{ fontSize: "0.6rem" }} />
            </button>
          </div>
        </div>

        {/* Title */}
        <div style={{
          padding: "5px 6px",
          fontSize: "0.63rem", fontWeight: 600,
          color: hovered ? "#6d28d9" : "#374151",
          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          textAlign: "center", transition: "color 0.15s",
        }}>
          {card?.title_en || "Untitled"}
        </div>
      </div>
    </div>
  );
};

/* ── Drag overlay (ghost while dragging) ── */
const DragCard = ({ card, MEDIA_URL, placeholder }) => {
  const imgSrc = card?.media_files?.file_path
    ? `${MEDIA_URL}/${card.media_files.file_path}`
    : placeholder;
  return (
    <div style={{
      borderRadius: 10, overflow: "hidden",
      border: "2px solid #7c3aed",
      boxShadow: "0 12px 32px rgba(109,40,217,0.35)",
      background: "#f5f3ff", width: 104,
      transform: "rotate(2deg) scale(1.04)",
    }}>
      <div style={{
        height: 20, background: "#ede9fe",
        display: "flex", alignItems: "center", justifyContent: "center",
        borderBottom: "1px solid #ddd6fe",
      }}>
        <HolderOutlined style={{ fontSize: "0.7rem", color: "#7c3aed" }} />
      </div>
      <div style={{ position: "relative", height: 70 }}>
        <Image src={imgSrc} alt={card?.title_en || "Card"} layout="fill" objectFit="cover" />
      </div>
      <div style={{
        padding: "5px 6px", fontSize: "0.63rem", fontWeight: 700,
        color: "#6d28d9", overflow: "hidden", textOverflow: "ellipsis",
        whiteSpace: "nowrap", textAlign: "center",
      }}>
        {card?.title_en || "Untitled"}
      </div>
    </div>
  );
};

/* ── Main CardSelector ── */
const CardSelector = ({ selectedCards, setSelectedCards, cards }) => {
  const MEDIA_URL = process.env.NEXT_PUBLIC_MEDIA_URL;
  const placeholder = "/images/Image_Placeholder.png";
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const handleDragStart = ({ active }) => setActiveId(active.id);

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null);
    if (!over || active.id === over.id) return;
    const oldIndex = selectedCards.indexOf(active.id);
    const newIndex = selectedCards.indexOf(over.id);
    setSelectedCards(arrayMove(selectedCards, oldIndex, newIndex));
  };

  const activeCard = activeId ? cards.find(c => c.id === activeId) : null;

  return (
    <div>
      {/* Multi-select dropdown */}
      <Select
        showSearch
        mode="multiple"
        placeholder="Search and select cards..."
        value={selectedCards}
        onChange={setSelectedCards}
        style={{ width: "100%" }}
        optionFilterProp="children"
        filterOption={(input, option) =>
          option.children.toLowerCase().includes(input.toLowerCase())
        }
        tagRender={() => null}
      >
        {cards.length > 0 ? (
          cards.map(card => (
            <Option key={card.id} value={card.id}>
              {card.title_en || "Untitled Card"}
            </Option>
          ))
        ) : (
          <Option disabled>No cards available</Option>
        )}
      </Select>

      {/* Count + hint */}
      {selectedCards.length > 0 && (
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          marginTop: 12, marginBottom: 4,
        }}>
          <span style={{
            padding: "2px 10px", borderRadius: 20,
            background: "#ede9fe", color: "#6d28d9",
            fontSize: "0.7rem", fontWeight: 700,
          }}>
            {selectedCards.length} card{selectedCards.length !== 1 ? "s" : ""} selected
          </span>
          <span style={{ fontSize: "0.7rem", color: "#9ca3af" }}>
            drag the handle to reorder
          </span>
        </div>
      )}

      {/* Sortable grid */}
      {selectedCards.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={selectedCards} strategy={rectSortingStrategy}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
              gap: 10, marginTop: 8,
            }}>
              {selectedCards.map(cardId => {
                const card = cards.find(c => c.id === cardId);
                return (
                  <SortableCardThumb
                    key={cardId}
                    cardId={cardId}
                    card={card}
                    MEDIA_URL={MEDIA_URL}
                    placeholder={placeholder}
                    onRemove={() => setSelectedCards(selectedCards.filter(id => id !== cardId))}
                  />
                );
              })}
            </div>
          </SortableContext>

          <DragOverlay dropAnimation={{ duration: 180, easing: "ease" }}>
            {activeCard ? (
              <DragCard card={activeCard} MEDIA_URL={MEDIA_URL} placeholder={placeholder} />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {selectedCards.length === 0 && (
        <div style={{
          marginTop: 12, display: "flex", alignItems: "center", gap: 8,
          color: "#9ca3af", fontSize: "0.78rem",
        }}>
          <CreditCardOutlined />
          No cards selected
        </div>
      )}
    </div>
  );
};

export default CardSelector;
