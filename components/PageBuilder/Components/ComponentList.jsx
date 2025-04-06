// components/PageBuilder/Components/ComponentList.jsx

import React, { useState, useEffect } from "react";
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
} from "../../../store/slices/pageSlice";
import { message } from "antd";

const ComponentList = ({ sectionId, components = [], sectionIndex }) => {
  const dispatch = useDispatch();
  const pageData = useSelector((state) => state.page.pageData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [componentsState, setComponents] = useState(components);

  useEffect(() => {
    setComponents(components);
  }, [components]);

  const handleDuplicate = (componentIndex) => {
    const component = componentsState[componentIndex];
    if (!component) return;

    try {
      const duplicatedComponent = {
        ...component,
        _id: Date.now().toString(),
      };
      const newComponents = [...componentsState];
      newComponents.splice(componentIndex + 1, 0, duplicatedComponent);
      setComponents(newComponents);

      // Update the page data
      const updatedPageData = {
        ...pageData,
        body: pageData.body.map((section, idx) => {
          if (idx === sectionIndex) {
            return {
              ...section,
              data: newComponents,
            };
          }
          return section;
        }),
      };

      dispatch(setPageData(updatedPageData));
      dispatch(setIsDirty(true));
      message.success("Component duplicated successfully");
    } catch (error) {
      console.error("Error duplicating component:", error);
      message.error("Failed to duplicate component");
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(componentsState);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setComponents(items);

    // Update the page data
    const updatedPageData = {
      ...pageData,
      body: pageData.body.map((section, idx) => {
        if (idx === sectionIndex) {
          return {
            ...section,
            data: items,
          };
        }
        return section;
      }),
    };

    dispatch(setPageData(updatedPageData));
    dispatch(setIsDirty(true));
  };

  const addComponent = (type) => {
    const newComponent = {
      _id: Date.now().toString(),
      type,
      value: type === "text" ? "Enter your text here..." : "",
      settings: {},
    };

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
    setIsModalVisible(false);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="component-list">
        <Droppable droppableId={`droppable-${sectionIndex}`}>
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="components-container min-h-[100px] p-4 bg-gray-50 rounded-md"
            >
              {Array.isArray(componentsState) &&
                componentsState.map((component, index) => (
                  <Draggable
                    key={component._id}
                    draggableId={component._id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          ...provided.draggableProps.style,
                          position: "relative",
                          zIndex: snapshot.isDragging ? 1000 : 1,
                          cursor: "grabbing",
                          transform: snapshot.isDragging
                            ? `translate(0px, 0px) !important`
                            : "none",
                          pointerEvents: "auto",
                          touchAction: "none",
                        }}
                        className={`mb-4 ${
                          snapshot.isDragging ? "shadow-lg" : ""
                        }`}
                      >
                        <div
                          style={{
                            position: "relative",
                            width: "100%",
                            height: "100%",
                          }}
                        >
                          <ComponentRenderer
                            component={component}
                            index={index}
                            sectionIndex={sectionIndex}
                            onDuplicateElement={() => handleDuplicate(index)}
                          />
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <div className="add-component-controls mt-4">
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={() => setIsModalVisible(true)}
            block
          >
            Add Component
          </Button>
        </div>
        <ComponentSelectorModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSelectComponent={addComponent}
        />
      </div>
    </DragDropContext>
  );
};

export default ComponentList;
