// components/PageBuilder/Components/ComponentListSimple.jsx

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import ComponentSelectorModal from "../Modals/ComponentSelectorModal";

// Custom hooks
import { useComponentOperations } from "./hooks/useComponentOperations";
import { useDragAndDrop } from "./hooks/useDragAndDrop";

// Components
import ComponentList from "./components/ComponentList";

const ComponentListSimple = ({
  components = [],
  sectionIndex,
  onComponentsUpdate,
  onComponentDelete,
  onComponentDuplicate,
  onEditingStateChange,
  isEditing = false,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [componentsState, setComponents] = useState(components);
  const [localIsEditing, setLocalIsEditing] = useState(false);
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    setComponents(components);
  }, [components]);

  // Handle editing state changes from components
  const handleComponentEditingStateChange = useCallback(
    (editing) => {
      setLocalIsEditing(editing);
      if (onEditingStateChange) {
        onEditingStateChange(editing);
      }
    },
    [onEditingStateChange]
  );

  // Use custom hooks for operations
  const {
    addComponent,
    handleComponentUpdate,
    handleComponentDelete,
    handleComponentDuplicate,
  } = useComponentOperations({
    componentsState,
    sectionIndex,
    onComponentsUpdate,
    onComponentDelete,
    onComponentDuplicate,
  });

  const { onDragEnd } = useDragAndDrop({
    componentsState,
    sectionIndex,
    onComponentsUpdate: handleComponentsUpdate,
  });

  const handleAddComponent = useCallback(
    (type) => {
      addComponent(type);
      setIsModalVisible(false);
    },
    [addComponent]
  );

  // Handle components update from drag and drop
  const handleComponentsUpdate = useCallback(
    (updatedComponents) => {
      setComponents(updatedComponents);
      if (onComponentsUpdate) {
        onComponentsUpdate(updatedComponents);
      }
    },
    [onComponentsUpdate]
  );

  const handleDragStart = useCallback((event) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragEnd = useCallback(
    (event) => {
      setActiveId(null);
      onDragEnd(event);
    },
    [onDragEnd]
  );

  // Get the active component for overlay
  const activeComponent = activeId
    ? componentsState.find((component, idx) => {
        const componentId = component._id || `component-${sectionIndex}-${idx}`;
        return activeId === componentId;
      })
    : null;

  // Create sortable items array
  const sortableItems = componentsState.map(
    (component, index) => component._id || `component-${sectionIndex}-${index}`
  );

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="component-list">
        <SortableContext
          items={sortableItems}
          strategy={verticalListSortingStrategy}
        >
          {/* Component List */}
          <ComponentList
            componentsState={componentsState}
            sectionIndex={sectionIndex}
            onComponentUpdate={handleComponentUpdate}
            onComponentDelete={handleComponentDelete}
            onComponentDuplicate={handleComponentDuplicate}
            onEditingStateChange={handleComponentEditingStateChange}
            isEditing={isEditing}
          />
        </SortableContext>

        {/* Add Component Button */}
        <Button
          type="dashed"
          icon={<PlusOutlined />}
          onClick={() => setIsModalVisible(true)}
          block
          className="mt-2"
        >
          Add Component
        </Button>
      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeComponent ? (
          <div className="component-wrapper mb-2 bg-white rounded-lg shadow-sm border border-gray-100 opacity-80">
            <div className="p-4">
              <div className="text-sm text-gray-500 font-medium">
                {activeComponent.type || "Component"}
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>

      {/* Component Selector Modal */}
      <ComponentSelectorModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSelectComponent={handleAddComponent}
      />
    </DndContext>
  );
};

export default ComponentListSimple;
