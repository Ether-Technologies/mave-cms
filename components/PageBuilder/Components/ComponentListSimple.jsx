// components/PageBuilder/Components/ComponentListSimple.jsx

import React, { useState, useCallback, useMemo } from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import ComponentSelectorModal from "../Modals/ComponentSelectorModal";
import { useComponentOperations } from "./hooks/useComponentOperations";
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
  const [addComponentPosition, setAddComponentPosition] = useState(null);

  const handleComponentEditingStateChange = useCallback(
    (editing) => {
      if (onEditingStateChange) {
        onEditingStateChange(editing);
      }
    },
    [onEditingStateChange]
  );

  const {
    addComponent,
    handleComponentUpdate,
    handleComponentDelete,
    handleComponentDuplicate,
  } = useComponentOperations({
    componentsState: components,
    sectionIndex,
    onComponentsUpdate,
    onComponentDelete,
    onComponentDuplicate,
  });

  const handleAddComponent = useCallback(
    (type) => {
      addComponent(type, addComponentPosition);
      setIsModalVisible(false);
      setAddComponentPosition(null);
    },
    [addComponent, addComponentPosition]
  );

  const sortableItems = useMemo(
    () =>
      components.map(
        (component, index) =>
          component._id || `component-${sectionIndex}-${index}`
      ),
    [components, sectionIndex]
  );

  return (
    <div className="component-list">
      <SortableContext
        items={sortableItems}
        strategy={verticalListSortingStrategy}
      >
        <ComponentList
          componentsState={components}
          sectionIndex={sectionIndex}
          onComponentUpdate={handleComponentUpdate}
          onComponentDelete={handleComponentDelete}
          onComponentDuplicate={handleComponentDuplicate}
          onEditingStateChange={handleComponentEditingStateChange}
          onAddComponent={(position) => {
            setIsModalVisible(true);
            setAddComponentPosition(position);
          }}
          isEditing={isEditing}
        />
      </SortableContext>

      <ComponentSelectorModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSelectComponent={handleAddComponent}
      />
    </div>
  );
};

export default ComponentListSimple;
