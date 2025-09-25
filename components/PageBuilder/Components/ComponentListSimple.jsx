// components/PageBuilder/Components/ComponentListSimple.jsx

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
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
  onCrossSectionDragEnd,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [componentsState, setComponents] = useState(components);
  const [localIsEditing, setLocalIsEditing] = useState(false);
  const [addComponentPosition, setAddComponentPosition] = useState(null);

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
      addComponent(type, addComponentPosition);
      setIsModalVisible(false);
      setAddComponentPosition(null);
    },
    [addComponent, addComponentPosition]
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

  // Create sortable items array
  const sortableItems = componentsState.map(
    (component, index) => component._id || `component-${sectionIndex}-${index}`
  );

  return (
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
          onAddComponent={(position) => {
            setIsModalVisible(true);
            // Store the position where component should be added
            setAddComponentPosition(position);
          }}
          isEditing={isEditing}
        />
      </SortableContext>

      {/* Component Selector Modal */}
      <ComponentSelectorModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSelectComponent={handleAddComponent}
      />
    </div>
  );
};

export default ComponentListSimple;
