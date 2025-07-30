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
  const isEmpty = !componentsState || componentsState.length === 0;

  return (
    <div
      className="components-container min-h-[100px] p-1 bg-gray-50 rounded-md"
      style={{
        minHeight: "100px",
      }}
    >
      {/* Empty state with prominent Add Component button */}
      {isEditing && isEmpty && (
        <div className="text-center py-8">
          <div className="mb-4">
            <p className="text-gray-500 mb-4">This section is empty</p>
            <Button
              icon={<PlusOutlined />}
              onClick={() => onAddComponent && onAddComponent(0)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white border-2 border-yellow-500 
                transition-all duration-200 px-6 py-3 text-base font-semibold"
              size="large"
            >
              Add Your First Component
            </Button>
          </div>
        </div>
      )}

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

      {/* Add Component Button at the end of the section - always show when editing and not empty */}
      {isEditing && !isEmpty && (
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

      {/* Empty state message when no components and not editing */}
      {!isEditing && isEmpty && (
        <div className="text-center py-8 text-gray-500">
          <p>No components in this section</p>
        </div>
      )}
    </div>
  );
};

export default ComponentList;
