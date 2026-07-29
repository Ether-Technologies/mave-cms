// components/PageBuilder/Sections/Section.jsx

import React, { useState, useCallback, useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Button, Modal, Input, Popconfirm } from "antd";
import {
  CopyOutlined,
  DeleteOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import ComponentListSimple from "../Components/ComponentListSimple";
import InsertionIndicator from "../Components/InsertionIndicator";
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
  onCrossSectionDragEnd,
  dragOverSection,
  activeId,
}) => {
  const dispatch = useDispatch();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(
    section.title || `Section ${(sectionIndex || index) + 1}`
  );

  // Update tempTitle when section title changes
  React.useEffect(() => {
    setTempTitle(section.title || `Section ${(sectionIndex || index) + 1}`);
  }, [section.title, sectionIndex, index]);

  // Ensure section has a valid _id - use stable ID generation
  const draggableId = useMemo(() => {
    return section._id || `section-${sectionIndex || index}`;
  }, [section._id, sectionIndex, index]);

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

  // Add droppable functionality for cross-section component drops
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: `section-drop-${sectionIndex || index}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Combine refs for both sortable and droppable
  const combinedRef = useCallback(
    (node) => {
      setNodeRef(node);
      setDroppableRef(node);
    },
    [setNodeRef, setDroppableRef]
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

  const handleDeleteClick = (e) => {
    // Prevent event from bubbling up to drag listeners
    e.stopPropagation();
  };

  const handleDeleteConfirm = () => {
    if (onDelete) {
      onDelete(sectionIndex || index);
    } else if (onSectionDelete) {
      onSectionDelete(sectionIndex || index);
    } else {
      console.error("❌ No delete handler available");
    }
  };

  const handleDuplicateClick = (e) => {
    // Prevent event from bubbling up to drag listeners
    e.stopPropagation();
    if (onDuplicate) {
      onDuplicate(sectionIndex || index);
    } else if (onSectionDuplicate) {
      onSectionDuplicate(sectionIndex || index);
    }
  };

  const handleTitleEdit = (e) => {
    // Prevent event from bubbling up to drag listeners
    e.preventDefault();
    e.stopPropagation();
    console.log("🔧 Section title edit clicked");
    setIsEditingTitle(true);
  };

  const handleTitleSave = () => {
    console.log("🔧 Section title save clicked", {
      tempTitle,
      sectionIndex,
      index,
    });
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
    console.log("🔧 Dispatching updateSection", {
      sectionIndex: sectionIndex || index,
      newSection: updatedSection,
    });
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
        ref={combinedRef}
        style={style}
        className={`section-container bg-white shadow-md rounded-lg p-4 mb-6 transition-all duration-200 ${
          isOver
            ? "ring-2 ring-brand ring-opacity-70 bg-blue-50 shadow-lg scale-[1.02]"
            : ""
        }`}
      >
        <div className="section-header flex items-center justify-between mb-4 pb-2 border-b">
          <div className="flex items-center gap-2 flex-1">
            {/* Drag Handle Icon - only this part should be draggable */}
            <div
              {...listeners}
              {...attributes}
              className="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-600 cursor-move"
              style={{ position: "relative", zIndex: 50 }}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 2zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 8zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 14zm6-8a2 2 0 1 1-.001-4.001A2 2 0 0 1 13 6zm0 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 8zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 14z" />
              </svg>
            </div>
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
                  style={{ position: "relative", zIndex: 10 }}
                />
              </div>
            )}
          </div>
          <div
            className="flex items-center gap-2"
            style={{ position: "relative", zIndex: 10 }}
          >
            {(onDuplicate || onSectionDuplicate) && (
              <Button
                icon={<CopyOutlined />}
                onClick={handleDuplicateClick}
                size="middle"
                className="mavebutton hover:bg-brand-dark"
                title="Duplicate Section"
                style={{ zIndex: 10, position: "relative" }}
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
                  onClick={handleDeleteClick}
                  size="small"
                  className="mavecancelbutton hover:bg-red-600"
                  title="Delete Section"
                  style={{ zIndex: 10, position: "relative" }}
                />
              </Popconfirm>
            )}
          </div>
        </div>

        {/* Insertion indicator at the top */}
        <InsertionIndicator
          isVisible={
            isEditing &&
            activeId &&
            !String(activeId).startsWith("section-") &&
            dragOverSection === (sectionIndex || index) &&
            section.data.length === 0
          }
          position="top"
        />

        <ComponentListSimple
          components={section.data}
          onComponentsUpdate={handleComponentsUpdate}
          onComponentDelete={onComponentDelete}
          onComponentDuplicate={onComponentDuplicate}
          onEditingStateChange={handleComponentEditingStateChange}
          sectionIndex={sectionIndex || index}
          isEditing={isEditing}
          onCrossSectionDragEnd={onCrossSectionDragEnd}
        />

        {/* Insertion indicator at the bottom */}
        <InsertionIndicator
          isVisible={
            isEditing &&
            activeId &&
            !String(activeId).startsWith("section-") &&
            dragOverSection === (sectionIndex || index) &&
            section.data.length > 0
          }
          position="bottom"
        />
      </div>
    </>
  );
};

export default Section;
