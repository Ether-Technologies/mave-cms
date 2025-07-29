// components/PageBuilder/Components/ComponentListSimple.jsx

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { DragDropContext } from "react-beautiful-dnd";
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
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [componentsState, setComponents] = useState(components);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setComponents(components);
  }, [components]);

  // Handle editing state changes from components
  const handleComponentEditingStateChange = useCallback(
    (editing) => {
      setIsEditing(editing);
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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="component-list">
        {/* Component List */}
        <ComponentList
          componentsState={componentsState}
          sectionIndex={sectionIndex}
          onComponentUpdate={handleComponentUpdate}
          onComponentDelete={handleComponentDelete}
          onComponentDuplicate={handleComponentDuplicate}
          onEditingStateChange={handleComponentEditingStateChange}
        />

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

      {/* Component Selector Modal */}
      <ComponentSelectorModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSelectComponent={handleAddComponent}
      />
    </DragDropContext>
  );
};

export default ComponentListSimple;
