// components/PageBuilder/Sections/SectionList.jsx

import React from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Section from "./Section";
import { useDispatch, useSelector } from "react-redux";
import { setPageData, setIsDirty } from "../../../store/slices/pageSlice";

const SectionList = () => {
  const dispatch = useDispatch();
  const pageData = useSelector((state) => state.page.pageData);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const sections = Array.from(pageData.body);
    const [reorderedSection] = sections.splice(result.source.index, 1);
    sections.splice(result.destination.index, 0, reorderedSection);

    dispatch(setPageData({ ...pageData, body: sections }));
  };

  const addSection = () => {
    const newSection = {
      _id: Date.now().toString(),
      title: `Section ${pageData.body.length + 1}`,
      data: [],
    };

    const updatedSections = [...pageData.body, newSection];
    dispatch(setPageData({ ...pageData, body: updatedSections }));
  };

  const duplicateSection = (index) => {
    const sectionToDuplicate = pageData.body[index];
    const duplicatedSection = {
      ...JSON.parse(JSON.stringify(sectionToDuplicate)),
      _id: Date.now().toString(),
      title: `${sectionToDuplicate.title} (Copy)`,
    };

    const updatedSections = [...pageData.body];
    updatedSections.splice(index + 1, 0, duplicatedSection);
    dispatch(setPageData({ ...pageData, body: updatedSections }));
  };

  const deleteSection = (index) => {
    const updatedSections = pageData.body.filter((_, i) => i !== index);
    dispatch(setPageData({ ...pageData, body: updatedSections }));
  };

  return (
    <div className="section-list">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections" type="SECTION">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="sections-container"
            >
              {pageData?.body?.map((section, index) => (
                <Section
                  key={section._id}
                  section={section}
                  index={index}
                  onDuplicate={duplicateSection}
                  onDelete={deleteSection}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Button
        type="dashed"
        icon={<PlusOutlined />}
        onClick={addSection}
        block
        className="mt-4"
      >
        Add Section
      </Button>
    </div>
  );
};

export default SectionList;
