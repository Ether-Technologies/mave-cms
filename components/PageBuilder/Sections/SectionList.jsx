// components/PageBuilder/Sections/SectionList.jsx

import React, { useCallback } from "react";
import { Button, Typography, Empty } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Section from "./Section";
import { useDispatch, useSelector } from "react-redux";
import { setPageData, setIsDirty } from "../../../store/slices/pageSlice";

const { Title } = Typography;

const AddSectionDivider = ({ onClick, label = "Add Section" }) => (
  <div className="flex items-center gap-4 py-4">
    <div className="flex-1 border-t border-dashed border-brand-light" />
    <Button
      icon={<PlusOutlined />}
      onClick={onClick}
      className="bg-brand hover:bg-brand-dark text-white border-0 font-semibold shadow-sm px-5"
      size="middle"
    >
      {label}
    </Button>
    <div className="flex-1 border-t border-dashed border-brand-light" />
  </div>
);

const SectionList = ({
  section,
  sectionIndex,
  onEditingStateChange,
  sections,
  setSections,
  onSectionDuplicate,
  onSectionDelete,
  onAddSectionAtPosition,
  isEditing = false,
  dragOverSection,
  activeId,
  isDraggingSection = false,
}) => {
  const dispatch = useDispatch();
  const pageData = useSelector((state) => state.page.pageData);

  const handleEditingStateChange = useCallback(
    (editing) => {
      if (onEditingStateChange) {
        onEditingStateChange(editing);
      }
    },
    [onEditingStateChange]
  );

  const handleComponentUpdate = useCallback(
    (updatedComponent, componentIndex) => {
      if (pageData && sectionIndex !== undefined) {
        const updatedPageData = { ...pageData };
        const updatedSection = { ...updatedPageData.body[sectionIndex] };
        updatedSection.data[componentIndex] = updatedComponent;
        updatedPageData.body[sectionIndex] = updatedSection;

        dispatch(setPageData(updatedPageData));
        dispatch(setIsDirty(true));
      }
    },
    [pageData, sectionIndex, dispatch]
  );

  const handleComponentDelete = useCallback(
    (componentIndex) => {
      if (pageData && sectionIndex !== undefined) {
        const updatedPageData = { ...pageData };
        const updatedSection = { ...updatedPageData.body[sectionIndex] };
        updatedSection.data.splice(componentIndex, 1);
        updatedPageData.body[sectionIndex] = updatedSection;

        dispatch(setPageData(updatedPageData));
        dispatch(setIsDirty(true));
      } else {
        console.error(
          "❌ Cannot delete component - invalid sectionIndex:",
          sectionIndex
        );
      }
    },
    [pageData, sectionIndex, dispatch]
  );

  const handleComponentDuplicate = useCallback(
    (componentIndex) => {
      if (pageData && sectionIndex !== undefined) {
        const updatedPageData = { ...pageData };
        const updatedSection = { ...updatedPageData.body[sectionIndex] };
        const componentToDuplicate = updatedSection.data[componentIndex];
        const duplicatedComponent = {
          ...componentToDuplicate,
          _id: `${componentToDuplicate._id}_duplicate_${Math.random().toString(36).substr(2, 9)}`,
        };
        updatedSection.data.splice(componentIndex + 1, 0, duplicatedComponent);
        updatedPageData.body[sectionIndex] = updatedSection;

        dispatch(setPageData(updatedPageData));
        dispatch(setIsDirty(true));
      }
    },
    [pageData, sectionIndex, dispatch]
  );

  if (section) {
    return (
      <Section
        section={section}
        sectionIndex={sectionIndex}
        index={sectionIndex}
        onComponentUpdate={handleComponentUpdate}
        onComponentDelete={handleComponentDelete}
        onComponentDuplicate={handleComponentDuplicate}
        onEditingStateChange={handleEditingStateChange}
        onSectionDuplicate={onSectionDuplicate}
        onSectionDelete={onSectionDelete}
        isEditing={isEditing}
        dragOverSection={dragOverSection}
        activeId={activeId}
        isDraggingSection={isDraggingSection}
      />
    );
  }

  if (sections) {
    const sortableItems = sections.map(
      (section, index) => section._id || `section-${index}`
    );

    return (
      <SortableContext
        items={sortableItems}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {sections.map((section, index) => {
            const currentSectionIndex = index;
            return (
              <React.Fragment
                key={section._id || `section-${currentSectionIndex}`}
              >
                {isEditing && index === 0 && (
                  <AddSectionDivider onClick={() => onAddSectionAtPosition(0)} />
                )}

                <Section
                  section={section}
                  sectionIndex={currentSectionIndex}
                  index={currentSectionIndex}
                  onComponentUpdate={handleComponentUpdate}
                  onComponentDelete={handleComponentDelete}
                  onComponentDuplicate={handleComponentDuplicate}
                  onEditingStateChange={handleEditingStateChange}
                  onSectionDuplicate={onSectionDuplicate}
                  onSectionDelete={onSectionDelete}
                  isEditing={isEditing}
                  dragOverSection={dragOverSection}
                  activeId={activeId}
                  isDraggingSection={isDraggingSection}
                />

                {isEditing && index < sections.length - 1 && (
                  <AddSectionDivider
                    onClick={() => onAddSectionAtPosition(index + 1)}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </SortableContext>
    );
  }

  return (
    <div className="p-4">
      <Title level={4} className="mb-4">
        Available Sections
      </Title>

      {pageData?.body && pageData.body.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pageData.body.map((section, index) => (
            <div key={index} className="border rounded-lg p-4 bg-white">
              <h3 className="font-semibold mb-2">
                {section.title || `Section ${index + 1}`}
              </h3>
              <p className="text-sm text-gray-600">
                {section.data?.length || 0} components
              </p>
            </div>
          ))}
          <Button
            icon={<PlusOutlined />}
            className="h-32 border-2 border-dashed border-gray-300 hover:border-theme transition-colors"
            onClick={() => {}}
          >
            Add New Section
          </Button>
        </div>
      ) : (
        <Empty
          description="No sections available"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button icon={<PlusOutlined />} type="primary" onClick={() => {}}>
            Add First Section
          </Button>
        </Empty>
      )}
    </div>
  );
};

export default SectionList;
