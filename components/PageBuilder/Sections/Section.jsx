// components/PageBuilder/Sections/Section.jsx

import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { Button } from "antd";
import { CopyOutlined, DeleteOutlined } from "@ant-design/icons";
import ComponentList from "../Components/ComponentList";
import { useDispatch } from "react-redux";
import { updateSection } from "../../../store/slices/pageSlice";

const Section = ({ section, index, onDuplicate, onDelete }) => {
  const dispatch = useDispatch();

  const handleComponentsUpdate = (updatedComponents) => {
    const updatedSection = {
      ...section,
      data: updatedComponents,
    };
    dispatch(
      updateSection({ sectionIndex: index, newSection: updatedSection })
    );
  };

  return (
    <Draggable draggableId={section._id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className="section-container bg-white shadow-md rounded-lg p-4 mb-6"
        >
          <div
            {...provided.dragHandleProps}
            className="section-header flex items-center justify-between mb-4 pb-2 border-b"
          >
            <h3 className="text-lg font-semibold">
              {section.title || `Section ${index + 1}`}
            </h3>
            <div className="flex gap-2">
              <Button
                icon={<CopyOutlined />}
                onClick={() => onDuplicate(index)}
                title="Duplicate section"
              >
                Duplicate
              </Button>
              <Button
                icon={<DeleteOutlined />}
                danger
                onClick={() => onDelete(index)}
                title="Delete section"
              >
                Delete
              </Button>
            </div>
          </div>
          <ComponentList
            sectionId={section._id}
            components={section.data || []}
            sectionIndex={index}
            onUpdate={handleComponentsUpdate}
          />
        </div>
      )}
    </Draggable>
  );
};

export default Section;
