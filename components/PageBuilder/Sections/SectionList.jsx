// components/PageBuilder/Sections/SectionList.jsx

import React, { useCallback } from "react";
import { Button, Typography, Empty } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Section from "./Section";
import { useDispatch, useSelector } from "react-redux";
import { setPageData, setIsDirty } from "../../../store/slices/pageSlice";

const { Title } = Typography;

const SectionList = ({
  section,
  sectionIndex,
  onEditingStateChange,
  sections,
  setSections,
}) => {
  const dispatch = useDispatch();
  const pageData = useSelector((state) => state.page.pageData);

  // Handle editing state changes
  const handleEditingStateChange = useCallback(
    (editing) => {
      if (onEditingStateChange) {
        onEditingStateChange(editing);
      }
    },
    [onEditingStateChange]
  );

  // Handle component updates
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

  // Handle component deletion
  const handleComponentDelete = useCallback(
    (componentIndex) => {
      if (pageData && sectionIndex !== undefined) {
        const updatedPageData = { ...pageData };
        const updatedSection = { ...updatedPageData.body[sectionIndex] };
        updatedSection.data.splice(componentIndex, 1);
        updatedPageData.body[sectionIndex] = updatedSection;

        dispatch(setPageData(updatedPageData));
        dispatch(setIsDirty(true));
      }
    },
    [pageData, sectionIndex, dispatch]
  );

  // Handle component duplication
  const handleComponentDuplicate = useCallback(
    (componentIndex) => {
      if (pageData && sectionIndex !== undefined) {
        const updatedPageData = { ...pageData };
        const updatedSection = { ...updatedPageData.body[sectionIndex] };
        const componentToDuplicate = updatedSection.data[componentIndex];
        const duplicatedComponent = {
          ...componentToDuplicate,
          _id: `${componentToDuplicate._id}_${Date.now()}`,
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
    // Single section mode
    return (
      <Section
        section={section}
        sectionIndex={sectionIndex}
        onComponentUpdate={handleComponentUpdate}
        onComponentDelete={handleComponentDelete}
        onComponentDuplicate={handleComponentDuplicate}
        onEditingStateChange={handleEditingStateChange}
      />
    );
  }

  if (sections) {
    // Multiple sections mode
    return (
      <div className="space-y-4">
        {sections.map((section, index) => (
          <Section
            key={index}
            section={section}
            sectionIndex={index}
            onComponentUpdate={handleComponentUpdate}
            onComponentDelete={handleComponentDelete}
            onComponentDuplicate={handleComponentDuplicate}
            onEditingStateChange={handleEditingStateChange}
          />
        ))}
      </div>
    );
  }

  // Default mode - show available sections or empty state
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
            onClick={() => {
              // Handle adding new section
            }}
          >
            Add New Section
          </Button>
        </div>
      ) : (
        <Empty
          description="No sections available"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <Button
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              // Handle adding new section
            }}
          >
            Add First Section
          </Button>
        </Empty>
      )}
    </div>
  );
};

export default SectionList;
