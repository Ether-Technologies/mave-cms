import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Button } from "antd";
import { DeleteOutlined, CopyOutlined } from "@ant-design/icons";
import ComponentRenderer from "./ComponentRenderer";

const Component = ({ component, index, onUpdate, onDelete }) => {
  return (
    <Draggable draggableId={component._id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="component bg-white shadow-sm rounded-md p-4 mb-3"
        >
          <div className="component-header flex justify-end mb-2 gap-2">
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
      )}
    </Draggable>
  );
};

export default Component;
