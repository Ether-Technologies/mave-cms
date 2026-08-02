// components/PageBuilder/Components/components/DraggableComponent.jsx

import React, { useMemo, useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "antd";
import { HolderOutlined, UpOutlined, DownOutlined, AppstoreOutlined } from "@ant-design/icons";
import ComponentRenderer from "../ComponentRenderer";
import { getComponentTypeLabel } from "../../utils/componentTypeLabels";

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
  const typeLabel = getComponentTypeLabel(component.type);
  const componentNumber = index + 1;

  const handleToggleCollapse = (e) => {
    e.stopPropagation();
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`component-wrapper rounded-lg border overflow-hidden ${
        isCollapsed ? "mb-2" : "mb-3"
      } ${
        isDragging
          ? "border-dashed border-emerald-200 bg-emerald-50/40 shadow-sm"
          : "border-emerald-100 bg-white shadow-sm"
      }`}
    >
      <div className="drag-handle flex items-center gap-2 px-3 py-2 bg-emerald-50 border-b border-emerald-100 select-none">
        <div
          {...listeners}
          {...attributes}
          className="flex items-center gap-2 flex-1 min-w-0 cursor-grab active:cursor-grabbing hover:bg-emerald-100/60 -mx-1 px-2 py-0.5 rounded touch-none"
        >
          <HolderOutlined className="text-emerald-300 shrink-0" />
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-600 text-xs font-bold uppercase tracking-wide shrink-0">
            <AppstoreOutlined className="text-[10px]" />
            Component {componentNumber}
          </span>
          <span className="text-xs font-medium text-emerald-500 shrink-0">
            {typeLabel}
          </span>
          {isCollapsed && summary && (
            <span className="text-xs text-emerald-400 truncate">— {summary}</span>
          )}
          {!isCollapsed && (
            <span className="text-xs text-emerald-300 ml-auto hidden sm:inline shrink-0">
              Drag to reorder
            </span>
          )}
        </div>
        <Button
          type="text"
          size="small"
          icon={isCollapsed ? <DownOutlined /> : <UpOutlined />}
          onClick={handleToggleCollapse}
          className="text-emerald-400 hover:text-emerald-700 hover:bg-emerald-100 shrink-0"
          title={isCollapsed ? "Expand component" : "Collapse component"}
        />
      </div>

      {!isCollapsed && (
        <div className={`p-4 bg-white ${isDragging ? "pointer-events-none" : ""}`}>
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
