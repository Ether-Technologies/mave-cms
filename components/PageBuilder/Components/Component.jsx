import React, { useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "antd";
import { DeleteOutlined, CopyOutlined } from "@ant-design/icons";
import ComponentRenderer from "./ComponentRenderer";

const Component = ({ component, index, onUpdate, onDelete }) => {
  // Use stable ID generation
  const draggableId = useMemo(() => {
    return component._id || `component-${index}`;
  }, [component._id, index]);

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
      className="component bg-white shadow-sm rounded-md p-4 mb-3"
    >
      <div
        {...listeners}
        {...attributes}
        className="component-header flex justify-end mb-2 gap-2 cursor-move"
      >
        <Button
          icon={<CopyOutlined />}
          size="small"
          onClick={() => {
            // The actual duplication is handled by the parent through Redux
            const duplicateEvent = new CustomEvent("duplicateComponent", {
              detail: { componentIndex: index },
            });
            window.dispatchEvent(duplicateEvent);
          }}
          title="Duplicate component"
        />
        <Button
          icon={<DeleteOutlined />}
          size="small"
          danger
          onClick={onDelete}
          title="Delete component"
        />
      </div>
      <ComponentRenderer
        component={component}
        onChange={(updatedComponent) => onUpdate(updatedComponent)}
      />
    </div>
  );
};

export default Component;
