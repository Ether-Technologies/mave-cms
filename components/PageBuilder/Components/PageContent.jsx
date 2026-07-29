// components/PageBuilder/Components/PageContent.jsx

import React, { useState, useCallback } from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { DndContext, DragOverlay, closestCorners } from "@dnd-kit/core";
import { useDispatch } from "react-redux";
import { setPageData, setIsDirty } from "../../../store/slices/pageSlice";
import SectionList from "../Sections/SectionList";
import { useCrossSectionDragAndDrop } from "../hooks/useCrossSectionDragAndDrop";
import { useSectionDragAndDrop } from "../Sections/hooks/useSectionDragAndDrop";
import CrossSectionDragOverlay from "./CrossSectionDragOverlay";

const PageContent = ({
  pageData,
  isEditing,
  onSectionsUpdate,
  onSectionDuplicate,
  onSectionDelete,
  onEditingStateChange,
  onAddSection,
  onAddSectionAtPosition,
}) => {
  const dispatch = useDispatch();
  const { onDragEnd: onCrossSectionDragEnd } = useCrossSectionDragAndDrop();
  const { onDragEnd: onSectionDragEnd } = useSectionDragAndDrop({
    sections: pageData?.body,
    onSectionsUpdate,
  });
  const [activeId, setActiveId] = useState(null);
  const [activeComponent, setActiveComponent] = useState(null);
  const [dragOverSection, setDragOverSection] = useState(null);

  const handleDragStart = useCallback(
    (event) => {
      const { active } = event;
      setActiveId(active.id);

      // Find the active component for better drag overlay
      if (active.id && !String(active.id).startsWith("section-")) {
        // Find the component being dragged
        for (let i = 0; i < pageData.body.length; i++) {
          const section = pageData.body[i];
          const component = section.data.find((comp) => {
            const componentId =
              comp._id ?? `component-${i}-${section.data.indexOf(comp)}`;
            return String(active.id) === String(componentId);
          });
          if (component) {
            setActiveComponent({
              ...component,
              sectionIndex: i,
              type: component.type || "Component",
            });
            break;
          }
        }
      }
    },
    [pageData]
  );

  const handleDragOver = useCallback(
    (event) => {
      const { over } = event;
      if (over) {
        const overId = over.id;

        if (String(overId).startsWith("section-drop-")) {
          const sectionIndex = parseInt(
            String(overId).replace("section-drop-", ""),
            10
          );
          setDragOverSection(sectionIndex);
        } else if (String(overId).startsWith("component-")) {
          // Find which section this component belongs to
          for (let i = 0; i < pageData.body.length; i++) {
            const section = pageData.body[i];
            const component = section.data.find((comp) => {
              const componentId =
                comp._id ?? `component-${i}-${section.data.indexOf(comp)}`;
              return String(overId) === String(componentId);
            });
            if (component) {
              setDragOverSection(i);
              break;
            }
          }
        }
      } else {
        setDragOverSection(null);
      }
    },
    [pageData]
  );

  const handleWithinSectionDrag = useCallback(
    (event, sectionIndex) => {
      const { active, over } = event;
      const activeId = active.id;
      const overId = over?.id;

      if (!overId || activeId === overId) {
        return;
      }

      const section = pageData.body[sectionIndex];
      if (!section) return;

      // Find component indices within the section
      const activeIndex = section.data.findIndex((comp, idx) => {
        const componentId = comp._id ?? `component-${sectionIndex}-${idx}`;
        return String(activeId) === String(componentId);
      });

      const overIndex = section.data.findIndex((comp, idx) => {
        const componentId = comp._id ?? `component-${sectionIndex}-${idx}`;
        return String(overId) === String(componentId);
      });

      if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) {
        return;
      }

      // Reorder components within the section
      const newComponents = [...section.data];
      const [reorderedItem] = newComponents.splice(activeIndex, 1);
      newComponents.splice(overIndex, 0, reorderedItem);

      // Update the section - create a deep copy of the body array
      const updatedPageData = {
        ...pageData,
        body: [...pageData.body],
      };
      updatedPageData.body[sectionIndex] = {
        ...section,
        data: newComponents,
      };

      // Dispatch the update
      dispatch(setPageData(updatedPageData));
      dispatch(setIsDirty(true));
    },
    [pageData, dispatch]
  );

  const handleDragEnd = useCallback(
    (event) => {
      setActiveId(null);
      setActiveComponent(null);
      setDragOverSection(null);

      const { active, over } = event;
      const activeId = active.id;
      const overId = over?.id;

      // Check if this is a section drag
      if (String(activeId).startsWith("section-")) {
        onSectionDragEnd(event);
        return;
      }

      // Check if this is a within-section component drag
      if (activeId && overId && !String(activeId).startsWith("section-")) {
        // Find source section
        let sourceSectionIndex = -1;
        for (let i = 0; i < pageData.body.length; i++) {
          const section = pageData.body[i];
          const component = section.data.find((comp) => {
            const componentId =
              comp._id ?? `component-${i}-${section.data.indexOf(comp)}`;
            return String(activeId) === String(componentId);
          });
          if (component) {
            sourceSectionIndex = i;
            break;
          }
        }

        // Find destination section
        let destinationSectionIndex = -1;
        if (String(overId).startsWith("section-drop-")) {
          destinationSectionIndex = parseInt(
            String(overId).replace("section-drop-", ""),
            10
          );
        } else {
          for (let i = 0; i < pageData.body.length; i++) {
            const section = pageData.body[i];
            const component = section.data.find((comp) => {
              const componentId =
                comp._id ?? `component-${i}-${section.data.indexOf(comp)}`;
              return String(overId) === String(componentId);
            });
            if (component) {
              destinationSectionIndex = i;
              break;
            }
          }
        }

        // If same section, it's a within-section drag - delegate to section handler
        if (
          sourceSectionIndex === destinationSectionIndex &&
          sourceSectionIndex !== -1
        ) {
          // This is a within-section drag, we need to handle it differently
          // Let's create a custom within-section handler
          handleWithinSectionDrag(event, sourceSectionIndex);
          return;
        }
      }

      // Otherwise, it's a cross-section drag
      onCrossSectionDragEnd(event);
    },
    [onCrossSectionDragEnd, onSectionDragEnd, pageData, handleWithinSectionDrag]
  );

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      collisionDetection={closestCorners}
    >
      <div className="bg-gray-50 min-h-screen">
        <div className="p-6">
          {pageData?.body?.length > 0 ? (
            <>
              <SectionList
                sections={pageData.body}
                setSections={onSectionsUpdate}
                onSectionDuplicate={onSectionDuplicate}
                onSectionDelete={onSectionDelete}
                onEditingStateChange={onEditingStateChange}
                onAddSectionAtPosition={onAddSectionAtPosition}
                isEditing={isEditing}
                onCrossSectionDragEnd={onCrossSectionDragEnd}
                dragOverSection={dragOverSection}
                activeId={activeId}
              />
              {isEditing && (
                <div className="text-center py-8">
                  <Button
                    icon={<PlusOutlined />}
                    onClick={onAddSection}
                    className="bg-brand hover:bg-brand-dark text-white border-2 border-brand px-6 py-2 font-semibold"
                    size="large"
                  >
                    Add Section
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No sections found in this page.</p>
              <p className="text-sm text-gray-400 mt-2">
                Add sections to start building your page.
              </p>
              {isEditing && (
                <div className="mt-4">
                  <Button
                    icon={<PlusOutlined />}
                    onClick={onAddSection}
                    className="bg-brand hover:bg-brand-dark text-white border-2 border-brand px-6 py-2 font-semibold"
                    size="large"
                  >
                    Add Section
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Drag Overlay */}
      <CrossSectionDragOverlay
        activeId={activeId}
        activeComponent={activeComponent}
      />
    </DndContext>
  );
};

export default PageContent;
