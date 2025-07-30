// components/PageBuilder/Components/components/ComponentList.jsx

import React from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import DraggableComponent from "./DraggableComponent";

const ComponentList = ({
  componentsState,
  sectionIndex,
  onComponentUpdate,
  onComponentDelete,
  onComponentDuplicate,
  onEditingStateChange,
  onAddComponent,
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
          <React.Fragment
            key={component._id || `component-${sectionIndex}-${index}`}
          >
            {/* Add Component Button at the top for first component */}
            {isEditing && index === 0 && (
              <div className="text-center py-2">
                <Button
                  icon={<PlusOutlined />}
                  onClick={() => onAddComponent && onAddComponent(index)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white border-2 border-yellow-500 
                  transition-all duration-200 px-2 py-1 text-sm group"
                  size="small"
                >
                  <span
                    className="max-w-0 overflow-hidden opacity-0 group-hover:max-w-xs group-hover:opacity-100 
                  group-hover:ml-1 transition-all duration-200 whitespace-nowrap"
                  >
                    Add Component
                  </span>
                </Button>
              </div>
            )}

            <DraggableComponent
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

            {/* Add Component Button between components */}
            {isEditing && index < componentsState.length - 1 && (
              <div className="text-center py-2">
                <Button
                  icon={<PlusOutlined />}
                  onClick={() => onAddComponent && onAddComponent(index + 1)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white border-2 border-yellow-500 
                  transition-all duration-200 px-2 py-1 text-sm group"
                  size="small"
                >
                  <span
                    className="max-w-0 overflow-hidden opacity-0 group-hover:max-w-xs group-hover:opacity-100 
                  group-hover:ml-1 transition-all duration-200 whitespace-nowrap"
                  >
                    Add Component
                  </span>
                </Button>
              </div>
            )}
          </React.Fragment>
        ))}

      {/* Add Component Button at the end of the section */}
      {isEditing && componentsState.length > 0 && (
        <div className="text-center py-2">
          <Button
            icon={<PlusOutlined />}
            onClick={() =>
              onAddComponent && onAddComponent(componentsState.length)
            }
            className="bg-yellow-500 hover:bg-yellow-600 text-white border-2 border-yellow-500 
              transition-all duration-200 px-2 py-1 text-sm group"
            size="small"
          >
            <span
              className="max-w-0 overflow-hidden opacity-0 group-hover:max-w-xs group-hover:opacity-100 
              group-hover:ml-1 transition-all duration-200 whitespace-nowrap"
            >
              Add Component
            </span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ComponentList;
