// components/PageBuilder/Components/ComponentList.jsx

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ComponentRenderer from "./ComponentRenderer";
import ComponentSelectorModal from "../Modals/ComponentSelectorModal";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsDirty,
  setPageData,
  moveComponent,
  duplicateComponent,
} from "../../../store/slices/pageSlice";
import { message } from "antd";

const ComponentList = ({
  components = [],
  sectionIndex,
  onComponentsUpdate,
  onComponentDelete,
  onComponentDuplicate,
  onEditingStateChange,
}) => {
  const dispatch = useDispatch();
  const pageData = useSelector((state) => state.page.pageData);
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

  const onDragEnd = useCallback(
    (result) => {
      if (!result.destination) return;

      const items = Array.from(componentsState);
      const reorderedItem = items[result.source.index];

      // Create new array without mutating
      const newItems = [
        ...items.slice(0, result.source.index),
        ...items.slice(result.source.index + 1),
      ];

      // Insert at destination
      const finalItems = [
        ...newItems.slice(0, result.destination.index),
        reorderedItem,
        ...newItems.slice(result.destination.index),
      ];

      setComponents(finalItems);

      if (onComponentsUpdate) {
        onComponentsUpdate(finalItems);
      } else {
        // Fallback to old system
        const updatedPageData = {
          ...pageData,
          body: pageData.body.map((section, idx) => {
            if (idx === sectionIndex) {
              return {
                ...section,
                data: finalItems,
              };
            }
            return section;
          }),
        };

        dispatch(setPageData(updatedPageData));
        dispatch(setIsDirty(true));
      }
    },
    [componentsState, onComponentsUpdate, pageData, sectionIndex, dispatch]
  );

  const addComponent = useCallback(
    (type) => {
      // Validate input
      if (!type) {
        console.error("❌ Invalid component type:", type);
        message.error("Invalid component type");
        return;
      }

      const newComponent = {
        _id: Date.now().toString(),
        type: type,
        value: "",
        settings: [],
        _mave: {
          fontSize: "medium",
          primaryColor: "#000000",
          secondaryColor: "#000000",
          textAlign: "left",
          fontWeight: "normal",
          isDualColor: false,
          altText: null,
        },
      };

      if (onComponentsUpdate) {
        // Use new callback system
        const updatedComponents = [...componentsState, newComponent];
        onComponentsUpdate(updatedComponents);
      } else {
        // Fallback to old system
        if (!pageData || !pageData.body) {
          console.error("❌ Cannot add component: pageData or body is null");
          message.error("Cannot add component - page data is not available");
          return;
        }

        if (sectionIndex < 0 || sectionIndex >= pageData.body.length) {
          console.error(
            "❌ Section index out of bounds:",
            sectionIndex,
            "body length:",
            pageData.body.length
          );
          message.error("Cannot add component - invalid section");
          return;
        }

        const updatedPageData = {
          ...pageData,
          body: pageData.body.map((section, idx) => {
            if (idx === sectionIndex) {
              return {
                ...section,
                data: [...(section.data || []), newComponent],
              };
            }
            return section;
          }),
        };

        dispatch(setPageData(updatedPageData));
        dispatch(setIsDirty(true));
      }

      setIsModalVisible(false);
    },
    [componentsState, onComponentsUpdate, pageData, sectionIndex, dispatch]
  );

  // Handle component updates
  const handleComponentUpdate = useCallback(
    (updatedComponent, componentIndex) => {
      const updatedComponents = [...componentsState];
      updatedComponents[componentIndex] = updatedComponent;

      if (onComponentsUpdate) {
        onComponentsUpdate(updatedComponents);
      } else {
        // Fallback to old system
        const updatedPageData = {
          ...pageData,
          body: pageData.body.map((section, idx) => {
            if (idx === sectionIndex) {
              return {
                ...section,
                data: updatedComponents,
              };
            }
            return section;
          }),
        };

        dispatch(setPageData(updatedPageData));
        dispatch(setIsDirty(true));
      }
    },
    [componentsState, onComponentsUpdate, pageData, sectionIndex, dispatch]
  );

  // Handle component deletion
  const handleComponentDelete = useCallback(
    (componentIndex) => {
      const updatedComponents = componentsState.filter(
        (_, index) => index !== componentIndex
      );

      if (onComponentsUpdate) {
        onComponentsUpdate(updatedComponents);
      } else if (onComponentDelete) {
        onComponentDelete(componentIndex);
      } else {
        // Fallback to old system
        const updatedPageData = {
          ...pageData,
          body: pageData.body.map((section, idx) => {
            if (idx === sectionIndex) {
              return {
                ...section,
                data: updatedComponents,
              };
            }
            return section;
          }),
        };

        dispatch(setPageData(updatedPageData));
        dispatch(setIsDirty(true));
      }
    },
    [
      componentsState,
      onComponentDelete,
      onComponentsUpdate,
      pageData,
      sectionIndex,
      dispatch,
    ]
  );

  // Handle component duplication
  const handleComponentDuplicate = useCallback(
    (componentIndex) => {
      const componentToDuplicate = componentsState[componentIndex];
      const duplicatedComponent = {
        ...componentToDuplicate,
        _id: `${componentToDuplicate._id}_${Date.now()}`,
      };

      // Create new array without mutating
      const updatedComponents = [
        ...componentsState.slice(0, componentIndex + 1),
        duplicatedComponent,
        ...componentsState.slice(componentIndex + 1),
      ];

      if (onComponentDuplicate) {
        onComponentDuplicate(componentIndex);
      } else if (onComponentsUpdate) {
        onComponentsUpdate(updatedComponents);
      } else {
        // Fallback to old system
        const updatedPageData = {
          ...pageData,
          body: pageData.body.map((section, idx) => {
            if (idx === sectionIndex) {
              return {
                ...section,
                data: updatedComponents,
              };
            }
            return section;
          }),
        };

        dispatch(setPageData(updatedPageData));
        dispatch(setIsDirty(true));
      }
    },
    [
      componentsState,
      onComponentDuplicate,
      onComponentsUpdate,
      pageData,
      sectionIndex,
      dispatch,
    ]
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="component-list">
        <Droppable droppableId={`droppable-${sectionIndex}`}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="components-container min-h-[100px] p-1 bg-gray-50 rounded-md"
            >
              {Array.isArray(componentsState) &&
                componentsState.map((component, index) => (
                  <Draggable
                    key={component._id}
                    draggableId={component._id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="component-wrapper mb-2"
                      >
                        <ComponentRenderer
                          component={{
                            ...component,
                            sectionIndex: sectionIndex,
                            index: index,
                          }}
                          onUpdate={(updatedComponent) =>
                            handleComponentUpdate(updatedComponent, index)
                          }
                          onDelete={() => handleComponentDelete(index)}
                          onDuplicate={() => handleComponentDuplicate(index)}
                          onEditingStateChange={
                            handleComponentEditingStateChange
                          }
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
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

      <ComponentSelectorModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSelectComponent={addComponent}
      />
    </DragDropContext>
  );
};

export default ComponentList;
