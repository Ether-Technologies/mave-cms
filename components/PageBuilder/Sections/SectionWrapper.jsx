// components/PageBuilder/Sections/SectionWrapper.jsx

import React, { useState, useCallback } from "react";
import { Button, Modal, Input, Popconfirm } from "antd";
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import ComponentListSimple from "../Components/ComponentListSimple";
import { useDispatch } from "react-redux";
import { updateSection } from "../../../store/slices/pageSlice";

const SectionWrapper = ({
  section,
  sectionIndex,
  onSectionUpdate,
  onComponentDelete,
  onComponentDuplicate,
  onEditingStateChange,
  index,
  onDuplicate,
  onDelete,
  onSectionDuplicate,
  onSectionDelete,
}) => {
  const dispatch = useDispatch();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(
    section.title ||
      `Section ${sectionIndex !== undefined ? sectionIndex + 1 : 1}`
  );

  // Handle editing state changes from components
  const handleComponentEditingStateChange = useCallback(
    (editing) => {
      if (onEditingStateChange) {
        onEditingStateChange(editing);
      }
    },
    [onEditingStateChange]
  );

  const handleComponentsUpdate = useCallback(
    (updatedComponents) => {
      const updatedSection = {
        ...section,
        data: updatedComponents,
      };

      if (onSectionUpdate) {
        // Use the new section update callback
        onSectionUpdate(sectionIndex, updatedSection);
      } else {
        // Fallback to old system
        dispatch(
          updateSection({
            sectionIndex: sectionIndex,
            newSection: updatedSection,
          })
        );
      }
    },
    [section, sectionIndex, onSectionUpdate, dispatch]
  );

  const handleDeleteConfirm = () => {
    if (onDelete) {
      onDelete(sectionIndex);
    } else if (onSectionDelete) {
      onSectionDelete(sectionIndex);
    }
  };

  const handleDuplicateClick = () => {
    if (onDuplicate) {
      onDuplicate(sectionIndex);
    } else if (onSectionDuplicate) {
      onSectionDuplicate(sectionIndex);
    }
  };

  const handleTitleEdit = () => {
    setIsEditingTitle(true);
  };

  const handleTitleSave = () => {
    if (tempTitle.trim() === "") {
      Modal.error({
        title: "Validation Error",
        content: "Section title cannot be empty.",
      });
      return;
    }
    const updatedSection = {
      ...section,
      title: tempTitle,
    };

    if (onSectionUpdate) {
      // Update the section title through the callback
      onSectionUpdate(sectionIndex, updatedSection);
    } else {
      dispatch(
        updateSection({
          sectionIndex: sectionIndex,
          newSection: updatedSection,
        })
      );
    }
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setTempTitle(
      section.title ||
        `Section ${sectionIndex !== undefined ? sectionIndex + 1 : 1}`
    );
    setIsEditingTitle(false);
  };

  return (
    <>
      <div className="section-container bg-white shadow-md rounded-lg p-4 mb-6">
        <div className="section-header flex items-center justify-between mb-4 pb-2 border-b">
          {isEditingTitle ? (
            <div className="flex items-center gap-2 flex-1">
              <Input
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
                onPressEnter={handleTitleSave}
                className="flex-1 max-w-[300px]"
              />
              <Button
                icon={<CheckOutlined />}
                onClick={handleTitleSave}
                className="mavebutton"
              />
              <Button
                icon={<CloseOutlined />}
                onClick={handleTitleCancel}
                className="mavecancelbutton"
              />
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-1">
              <h3 className="text-lg font-semibold text-gray-800">
                {section.title ||
                  `Section ${sectionIndex !== undefined ? sectionIndex + 1 : 1}`}
              </h3>
              <Button
                icon={<EditOutlined />}
                onClick={handleTitleEdit}
                size="small"
                className="mavebutton"
              />
            </div>
          )}
          <div className="flex items-center gap-2">
            {(onDuplicate || onSectionDuplicate) && (
              <Button
                icon={<CopyOutlined />}
                onClick={handleDuplicateClick}
                size="small"
                className="mavebutton hover:bg-yellow-600"
                title="Duplicate Section"
              />
            )}
            {(onDelete || onSectionDelete) && (
              <Popconfirm
                title="Delete Section"
                description="Are you sure you want to delete this section? This action cannot be undone."
                onConfirm={handleDeleteConfirm}
                okText="Delete"
                cancelText="Cancel"
                okButtonProps={{ danger: true }}
              >
                <Button
                  icon={<DeleteOutlined />}
                  size="small"
                  className="mavecancelbutton"
                  title="Delete Section"
                />
              </Popconfirm>
            )}
          </div>
        </div>

        <ComponentListSimple
          components={section.data}
          onComponentsUpdate={handleComponentsUpdate}
          onComponentDelete={onComponentDelete}
          onComponentDuplicate={onComponentDuplicate}
          onEditingStateChange={handleComponentEditingStateChange}
          sectionIndex={sectionIndex}
        />
      </div>
    </>
  );
};

export default SectionWrapper;
