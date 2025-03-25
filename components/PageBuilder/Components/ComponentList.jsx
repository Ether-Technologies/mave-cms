// components/PageBuilder/Components/ComponentList.jsx

import React, { useState, useEffect } from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Droppable } from "react-beautiful-dnd";
import ComponentRenderer from "./ComponentRenderer";
import ComponentSelectorModal from "../Modals/ComponentSelectorModal";
import Component from "./Component";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsDirty,
  setPageData,
  moveComponent,
} from "../../../store/slices/pageSlice";

const ComponentList = ({ sectionId, components = [], sectionIndex }) => {
  const dispatch = useDispatch();
  const pageData = useSelector((state) => state.page.pageData);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const handleDuplicate = (event) => {
      const { componentIndex } = event.detail;
      const component = components[componentIndex];
      const duplicatedComponent = {
        ...JSON.parse(JSON.stringify(component)),
        _id: Date.now().toString(),
      };

      const updatedPageData = {
        ...pageData,
        body: pageData.body.map((section, idx) => {
          if (idx === sectionIndex) {
            const newData = [...section.data];
            newData.splice(componentIndex + 1, 0, duplicatedComponent);
            return {
              ...section,
              data: newData,
            };
          }
          return section;
        }),
      };

      dispatch(setPageData(updatedPageData));
      dispatch(setIsDirty(true));
    };

    window.addEventListener("duplicateComponent", handleDuplicate);
    return () =>
      window.removeEventListener("duplicateComponent", handleDuplicate);
  }, [components, dispatch, pageData, sectionIndex]);

  const addComponent = (type) => {
    const newComponent = {
      _id: Date.now().toString(),
      type,
      content: type === "text" ? "Enter your text here..." : "",
      settings: type === "image" ? { src: "", alt: "" } : {},
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
    <div className="component-list">
      <Droppable droppableId={sectionIndex.toString()}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="components-container min-h-[100px] p-4 bg-gray-50 rounded-md"
          >
            {Array.isArray(components) &&
              components.map((component, index) => (
                <ComponentRenderer
                  key={component._id}
                  component={component}
                  index={index}
                  sectionIndex={sectionIndex}
                />
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
  );
};

export default ComponentList;
