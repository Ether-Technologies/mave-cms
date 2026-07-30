// components/PageBuilder/Components/components/DraggableComponent.jsx

import React, { useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { HolderOutlined } from "@ant-design/icons";
import ComponentRenderer from "../ComponentRenderer";

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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`component-wrapper mb-2 bg-white rounded-lg shadow-sm border-2 ${
        isDragging
          ? "border-dashed border-brand/50 bg-blue-50/30"
          : "border-gray-200"
      }`}
    >
      <div
        {...listeners}
        {...attributes}
        className="drag-handle flex items-center gap-2 px-3 py-2 bg-gray-50 border-b border-gray-100 cursor-grab active:cursor-grabbing hover:bg-gray-100 touch-none select-none"
      >
        <HolderOutlined className="text-gray-400" />
        <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
          {component.type || "Component"}
        </span>
        <span className="text-xs text-gray-400 ml-auto hidden sm:inline">
          Drag to reorder
        </span>
      </div>

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
    </div>
  );
};

export default DraggableComponent;
