// components/PageBuilder/Sections/Section.jsx

import React, { useState, useCallback } from "react";
import { Draggable } from "react-beautiful-dnd";
import { Button, Modal, Input } from "antd";
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import ComponentList from "../Components/ComponentList";
import { useDispatch } from "react-redux";
import { updateSection } from "../../../store/slices/pageSlice";

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
      const updatedSection = {
        ...section,
        data: updatedComponents,
      };

      if (onComponentUpdate) {
        // Use the new callback system
        updatedComponents.forEach((component, componentIndex) => {
          onComponentUpdate(component, componentIndex);
        });
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
    [section, sectionIndex, index, onComponentUpdate, dispatch]
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
      <Draggable draggableId={section._id} index={sectionIndex || index}>
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

            <ComponentList
              components={section.data}
              onComponentsUpdate={handleComponentsUpdate}
              onComponentDelete={onComponentDelete}
              onComponentDuplicate={onComponentDuplicate}
              onEditingStateChange={handleComponentEditingStateChange}
              sectionIndex={sectionIndex || index}
            />
          </div>
        )}
      </Draggable>

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
