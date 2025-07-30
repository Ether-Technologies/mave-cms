// components/PageBuilder/Components/components/ComponentList.jsx

import React from "react";
import DraggableComponent from "./DraggableComponent";

const ComponentList = ({
  componentsState,
  sectionIndex,
  onComponentUpdate,
  onComponentDelete,
  onComponentDuplicate,
  onEditingStateChange,
  isEditing = false,
}) => {
  return (
    <div
      className="components-container min-h-[100px] p-1 bg-gray-50 rounded-md"
      style={{
        minHeight: "100px",
      }}
    >
      {Array.isArray(componentsState) &&
        componentsState.map((component, index) => (
          <DraggableComponent
            key={component._id || `component-${sectionIndex}-${index}`}
            component={component}
            index={index}
            sectionIndex={sectionIndex}
            onUpdate={(updatedComponent) =>
              onComponentUpdate(updatedComponent, index)
            }
            onDelete={() => onComponentDelete(index)}
            onDuplicate={() => onComponentDuplicate(index)}
            onEditingStateChange={onEditingStateChange}
            isEditing={isEditing}
          />
        ))}
    </div>
  );
};

export default ComponentList;
