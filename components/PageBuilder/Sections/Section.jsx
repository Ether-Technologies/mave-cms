// components/PageBuilder/Sections/Section.jsx

import React, { useState } from "react";
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

const Section = ({ section, index, onDuplicate, onDelete }) => {
  const dispatch = useDispatch();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(
    section.title || `Section ${index + 1}`
  );

  const handleComponentsUpdate = (updatedComponents) => {
    const updatedSection = {
      ...section,
      data: updatedComponents,
    };
    dispatch(
      updateSection({ sectionIndex: index, newSection: updatedSection })
    );
  };

  const handleDeleteClick = () => {
    setIsDeleteModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    setIsDeleteModalVisible(false);
    onDelete(index);
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
      updateSection({ sectionIndex: index, newSection: updatedSection })
    );
    setIsEditingTitle(false);
  };

  const handleTitleCancel = () => {
    setTempTitle(section.title || `Section ${index + 1}`);
    setIsEditingTitle(false);
  };

  return (
    <>
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
                  <h2 className="text-2xl font-semibold text-orange-500">
                    {section.title || `Section ${index + 1}`}
                  </h2>
                  <Button
                    icon={<EditOutlined />}
                    onClick={handleTitleEdit}
                    className="mavebutton"
                  />
                </div>
              )}
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
                  onClick={handleDeleteClick}
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

      <Modal
        title="Delete Section"
        open={isDeleteModalVisible}
        footer={[
          <Button
            className="mavecancelbutton"
            key="cancel"
            onClick={handleDeleteCancel}
          >
            Cancel
          </Button>,
          <Button danger key="delete" onClick={handleDeleteConfirm}>
            Delete
          </Button>,
        ]}
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
