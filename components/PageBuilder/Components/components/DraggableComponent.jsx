// components/PageBuilder/Components/components/DraggableComponent.jsx

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
  // Ensure component has a valid _id
  const draggableId =
    component._id || `component-${sectionIndex}-${index}-${Date.now()}`;

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
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="component-wrapper mb-2 bg-white rounded-lg shadow-sm border border-gray-100"
    >
      {/* Drag Handle */}
      <div
        {...listeners}
        {...attributes}
        className="drag-handle p-2 bg-gray-50 border-b border-gray-100 cursor-move hover:bg-gray-100 transition-colors duration-200"
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 flex items-center justify-center">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M7 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 2zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 8zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 14zm6-8a2 2 0 1 1-.001-4.001A2 2 0 0 1 13 6zm0 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 8zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 14z" />
            </svg>
          </div>
          <span className="text-sm text-gray-500 font-medium">
            Drag to reorder
          </span>
        </div>
      </div>

      {/* Component Content */}
      <div className="p-4">
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
