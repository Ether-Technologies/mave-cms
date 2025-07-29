// components/PageBuilder/Sections/Section.jsx

import React, { useState, useCallback } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
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
import { updateSection, setIsDirty } from "../../../store/slices/pageSlice";

const Section = ({
  section,
  sectionIndex,
  onComponentUpdate,
  onComponentDelete,
  onComponentDuplicate,
  onEditingStateChange,
  index,
  onDuplicate,
  onDelete,
  onSectionDuplicate,
  onSectionDelete,
  isEditing = false,
}) => {
  const dispatch = useDispatch();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(
    section.title || `Section ${(sectionIndex || index) + 1}`
  );

  // Ensure section has a valid _id
  const draggableId =
    section._id || `section-${sectionIndex || index}-${Date.now()}`;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: draggableId,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

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
      console.log(
        "🔧 Section handleComponentsUpdate called with:",
        updatedComponents
      );
      const updatedSection = {
        ...section,
        data: updatedComponents,
      };

      console.log("🔧 Updated section:", updatedSection);

      // Update the section in the Redux store
      dispatch(
        updateSection({
          sectionIndex: sectionIndex || index,
          newSection: updatedSection,
        })
      );

      // Ensure dirty state is set
      dispatch(setIsDirty(true));
    },
    [section, sectionIndex, index, dispatch]
  );

  const handleDeleteClick = () => {
    setIsDeleteModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    setIsDeleteModalVisible(false);
    if (onDelete) {
      onDelete(sectionIndex || index);
    } else if (onSectionDelete) {
      onSectionDelete(sectionIndex || index);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
  };

  const handleDuplicateClick = () => {
    if (onDuplicate) {
      onDuplicate(sectionIndex || index);
    } else if (onSectionDuplicate) {
      onSectionDuplicate(sectionIndex || index);
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
    dispatch(
      updateSection({
        sectionIndex: sectionIndex || index,
        newSection: updatedSection,
      })
    );
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setTempTitle(section.title || `Section ${(sectionIndex || index) + 1}`);
    setIsEditingTitle(false);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="section-container bg-white shadow-md rounded-lg p-4 mb-6"
      >
        <div
          {...listeners}
          {...attributes}
          className="section-header flex items-center justify-between mb-4 pb-2 border-b cursor-move"
        >
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
                size="middle"
                className="mavebutton"
              />
            </div>
          )}
          <div className="flex items-center gap-2">
            {(onDuplicate || onSectionDuplicate) && (
              <Button
                icon={<CopyOutlined />}
                onClick={handleDuplicateClick}
                size="middle"
                className="mavebutton hover:bg-yellow-600"
                title="Duplicate Section"
              />
            )}
            {(onDelete || onSectionDelete) && (
              <Button
                icon={<DeleteOutlined />}
                onClick={handleDeleteClick}
                size="small"
                className="mavecancelbutton hover:bg-red-600"
                title="Delete Section"
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
          isEditing={isEditing}
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

export default Section;
