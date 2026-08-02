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
  UpOutlined,
  DownOutlined,
  LayoutOutlined,
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
  dragOverSection,
  activeId,
  isDraggingSection = false,
}) => {
  const dispatch = useDispatch();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
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
    opacity: isDragging ? 0.35 : 1,
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

  const handleToggleCollapse = (e) => {
    e.stopPropagation();
    setIsCollapsed((prev) => !prev);
  };

  const componentCount = section.data?.length || 0;
  const sectionNumber = (sectionIndex || index) + 1;
  const sectionTitle =
    section.title || `Section ${sectionNumber}`;

  return (
    <>
      <div
        ref={combinedRef}
        style={style}
        className={`section-container rounded-xl border border-brand-light bg-gradient-to-br from-brand-light/50 to-white shadow-sm overflow-hidden ${
          isCollapsed ? "mb-3" : "mb-6"
        } ${
          isOver && !isDraggingSection
            ? "ring-2 ring-brand-light ring-offset-2 bg-brand-light/60"
            : ""
        } ${isDragging ? "shadow-md opacity-90" : ""}`}
      >
        <div
          className={`section-header flex items-center justify-between px-4 py-3 bg-brand-light border-b border-brand-light ${
            isCollapsed ? "" : ""
          }`}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Button
              type="text"
              size="small"
              icon={isCollapsed ? <DownOutlined /> : <UpOutlined />}
              onClick={handleToggleCollapse}
              className="text-brand hover:text-brand-dark hover:bg-brand-light shrink-0"
              title={isCollapsed ? "Expand section" : "Collapse section"}
            />
            <div
              {...listeners}
              {...attributes}
              className="flex items-center justify-center w-8 h-8 rounded-md text-brand/60 hover:text-brand-dark hover:bg-brand-light cursor-grab active:cursor-grabbing touch-none shrink-0"
              style={{ position: "relative", zIndex: 50 }}
              title="Drag to reorder section"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 2zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 8zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 14zm6-8a2 2 0 1 1-.001-4.001A2 2 0 0 1 13 6zm0 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 8zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 14z" />
              </svg>
            </div>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-brand-light text-brand-dark text-xs font-bold uppercase tracking-wider shrink-0">
              <LayoutOutlined />
              Section {sectionNumber}
            </span>

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
                  className="text-brand border-brand-light hover:bg-brand-light"
                />
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <h3 className="text-base font-semibold text-gray-800 truncate">
                  {sectionTitle}
                </h3>
                <span className="text-xs text-brand shrink-0">
                  {componentCount} component{componentCount === 1 ? "" : "s"}
                </span>
                <Button
                  icon={<EditOutlined />}
                  onClick={handleTitleEdit}
                  size="small"
                  className="text-brand hover:text-brand-dark hover:bg-brand-light border-0 shrink-0"
                  style={{ position: "relative", zIndex: 10 }}
                />
              </div>
            )}
          </div>
          <div
            className="flex items-center gap-2 shrink-0"
            style={{ position: "relative", zIndex: 10 }}
          >
            {(onDuplicate || onSectionDuplicate) && (
              <Button
                icon={<CopyOutlined />}
                onClick={handleDuplicateClick}
                size="small"
                className="text-brand hover:text-brand-dark hover:bg-brand-light border-0"
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
                  className="text-red-400 hover:text-red-600 hover:bg-red-50 border-0"
                  title="Delete Section"
                  style={{ zIndex: 10, position: "relative" }}
                />
              </Popconfirm>
            )}
          </div>
        </div>

        {!isCollapsed && (
          <div className="p-4">
            <div className="mb-3 flex items-center gap-2 text-xs font-medium text-brand uppercase tracking-wide">
              <span className="w-2 h-2 rounded-full bg-brand" />
              Components inside this section
            </div>
        <InsertionIndicator
          isVisible={
            isEditing &&
            activeId &&
            !isDraggingSection &&
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
        />

        <InsertionIndicator
          isVisible={
            isEditing &&
            activeId &&
            !isDraggingSection &&
            dragOverSection === (sectionIndex || index) &&
            section.data.length > 0
          }
          position="bottom"
        />
          </div>
        )}
      </div>
    </>
  );
};

export default Section;
