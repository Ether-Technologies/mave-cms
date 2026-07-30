// components/PageBuilder/Components/components/DraggableComponent.jsx

import React, { useMemo, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "antd";
import { HolderOutlined, UpOutlined, DownOutlined } from "@ant-design/icons";
import ComponentRenderer from "../ComponentRenderer";

const getComponentSummary = (component) => {
  const raw =
    component.value ||
    component.title_en ||
    component.title ||
    component._mave?.altText ||
    "";

  if (typeof raw === "string" && raw.trim()) {
    const plain = raw.replace(/<[^>]*>/g, "").trim();
    if (plain) {
      return plain.length > 48 ? `${plain.slice(0, 48)}…` : plain;
    }
  }

  return null;
};

const DraggableComponent = ({
  component,
  index,
  sectionIndex,
  onUpdate,
  onDelete,
  onDuplicate,
  onEditingStateChange,
  isEditing = false,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const draggableId = useMemo(() => {
    return component._id || `component-${sectionIndex}-${index}`;
  }, [component._id, sectionIndex, index]);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: draggableId,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.25 : 1,
  };

  const summary = getComponentSummary(component);

  const handleToggleCollapse = (e) => {
    e.stopPropagation();
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`component-wrapper bg-white rounded-lg shadow-sm border-2 ${
        isCollapsed ? "mb-1" : "mb-2"
      } ${
        isDragging
          ? "border-dashed border-brand/50 bg-blue-50/30"
          : "border-gray-200"
      }`}
    >
      <div className="drag-handle flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-100 select-none">
        <div
          {...listeners}
          {...attributes}
          className="flex items-center gap-2 flex-1 min-w-0 cursor-grab active:cursor-grabbing hover:bg-gray-100 -mx-1 px-1 py-0.5 rounded touch-none"
        >
          <HolderOutlined className="text-gray-400 shrink-0" />
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wide shrink-0">
            {component.type || "Component"}
          </span>
          {isCollapsed && summary && (
            <span className="text-xs text-gray-400 truncate">{summary}</span>
          )}
          {!isCollapsed && (
            <span className="text-xs text-gray-400 ml-auto hidden sm:inline shrink-0">
              Drag to reorder
            </span>
          )}
        </div>
        <Button
          type="text"
          size="small"
          icon={isCollapsed ? <DownOutlined /> : <UpOutlined />}
          onClick={handleToggleCollapse}
          className="text-gray-500 hover:text-brand shrink-0"
          title={isCollapsed ? "Expand field" : "Collapse field"}
        />
      </div>

      {!isCollapsed && (
        <div className={`p-4 ${isDragging ? "pointer-events-none" : ""}`}>
          <ComponentRenderer
            component={{
              ...component,
              sectionIndex: sectionIndex,
              index: index,
            }}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onDuplicate={onDuplicate}
            onEditingStateChange={onEditingStateChange}
            isEditing={isEditing}
          />
        </div>
      )}
    </div>
  );
};

export default DraggableComponent;
