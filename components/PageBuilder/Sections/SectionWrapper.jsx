// components/PageBuilder/Sections/SectionWrapper.jsx

import React, { useState, useCallback } from "react";
import { Button, Modal, Input } from "antd";
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
}) => {
  const dispatch = useDispatch();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(
    section.title || `Section ${(sectionIndex || index) + 1}`
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
      console.log("🔧 handleComponentsUpdate called:", {
        sectionIndex,
        index,
        componentsCount: updatedComponents.length,
        sectionId: section._id,
      });

      const updatedSection = {
        ...section,
        data: updatedComponents,
      };

      if (onSectionUpdate) {
        // Use the new section update callback
        const finalSectionIndex =
          sectionIndex !== undefined ? sectionIndex : index;
        console.log("🔧 Calling onSectionUpdate with:", finalSectionIndex);
        onSectionUpdate(finalSectionIndex, updatedSection);
      } else {
        // Fallback to old system
        dispatch(
          updateSection({
            sectionIndex: sectionIndex || index,
            newSection: updatedSection,
          })
        );
      }
    },
    [section, sectionIndex, index, onSectionUpdate, dispatch]
  );

  const handleDeleteClick = () => {
    setIsDeleteModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    setIsDeleteModalVisible(false);
    if (onDelete) {
      onDelete(sectionIndex || index);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
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
      const finalSectionIndex =
        sectionIndex !== undefined ? sectionIndex : index;
      onSectionUpdate(finalSectionIndex, updatedSection);
    } else {
      dispatch(
        updateSection({
          sectionIndex: sectionIndex || index,
          newSection: updatedSection,
        })
      );
    }
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setTempTitle(section.title || `Section ${(sectionIndex || index) + 1}`);
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
                {section.title || `Section ${(sectionIndex || index) + 1}`}
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
            {onDuplicate && (
              <Button
                icon={<CopyOutlined />}
                onClick={() => onDuplicate(sectionIndex || index)}
                size="small"
                className="mavebutton"
              />
            )}
            {onDelete && (
              <Button
                icon={<DeleteOutlined />}
                onClick={handleDeleteClick}
                size="small"
                className="mavecancelbutton"
              />
            )}
          </div>
        </div>

        <ComponentListSimple
          components={section.data}
          onComponentsUpdate={handleComponentsUpdate}
          onComponentDelete={onComponentDelete}
          onComponentDuplicate={onComponentDuplicate}
          onEditingStateChange={handleComponentEditingStateChange}
          sectionIndex={sectionIndex || index}
        />
      </div>

      <Modal
        title="Delete Section"
        open={isDeleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>
          Are you sure you want to delete this section? This action cannot be
          undone.
        </p>
      </Modal>
    </>
  );
};

export default SectionWrapper;
