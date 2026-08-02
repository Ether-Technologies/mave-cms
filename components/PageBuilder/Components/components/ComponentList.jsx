// components/PageBuilder/Components/components/ComponentList.jsx

import React from "react";
import { Button } from "antd";
import { PlusOutlined, AppstoreAddOutlined } from "@ant-design/icons";
import DraggableComponent from "./DraggableComponent";

const AddComponentDivider = ({ onClick, label = "Add Component" }) => (
  <div className="flex items-center gap-3 py-3 my-1">
    <div className="flex-1 border-t border-dashed border-emerald-100" />
    <Button
      icon={<PlusOutlined />}
      onClick={onClick}
      className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 font-medium shadow-sm"
      size="small"
    >
      {label}
    </Button>
    <div className="flex-1 border-t border-dashed border-emerald-100" />
  </div>
);

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
    <div className="components-container min-h-[80px] p-3 bg-emerald-50/30 border border-dashed border-emerald-100 rounded-lg">
      {isEditing && isEmpty && (
        <div className="text-center py-6 px-4">
          <AppstoreAddOutlined className="text-3xl text-emerald-300 mb-3" />
          <p className="text-sm font-medium text-gray-700 mb-1">
            No components yet
          </p>
          <p className="text-xs text-gray-500 mb-4">
            Components are the content blocks inside a section (text, images, buttons, etc.)
          </p>
          <Button
            icon={<PlusOutlined />}
            onClick={() => onAddComponent && onAddComponent(0)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white border-0 font-semibold shadow-sm"
            size="large"
          >
            Add First Component
          </Button>
        </div>
      )}

      {Array.isArray(componentsState) &&
        componentsState.map((component, index) => (
          <React.Fragment
            key={component._id || `component-${sectionIndex}-${index}`}
          >
            {isEditing && index === 0 && (
              <AddComponentDivider
                onClick={() => onAddComponent && onAddComponent(index)}
              />
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

            {isEditing && index < componentsState.length - 1 && (
              <AddComponentDivider
                onClick={() => onAddComponent && onAddComponent(index + 1)}
              />
            )}
          </React.Fragment>
        ))}

      {isEditing && !isEmpty && (
        <AddComponentDivider
          onClick={() =>
            onAddComponent && onAddComponent(componentsState.length)
          }
          label="Add Component Below"
        />
      )}

      {!isEditing && isEmpty && (
        <div className="text-center py-6 text-gray-400 text-sm">
          No components in this section
        </div>
      )}
    </div>
  );
};

export default ComponentList;
