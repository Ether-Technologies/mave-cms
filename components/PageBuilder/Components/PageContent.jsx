// components/PageBuilder/Components/PageContent.jsx

import React, { useState, useCallback } from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { DndContext, DragOverlay, closestCorners } from "@dnd-kit/core";
import SectionList from "../Sections/SectionList";
import { useCrossSectionDragAndDrop } from "../hooks/useCrossSectionDragAndDrop";
import { useSectionDragAndDrop } from "../Sections/hooks/useSectionDragAndDrop";

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
  const { onDragEnd: onCrossSectionDragEnd } = useCrossSectionDragAndDrop();
  const { onDragEnd: onSectionDragEnd } = useSectionDragAndDrop({
    sections: pageData?.body,
    onSectionsUpdate,
  });
  const [activeId, setActiveId] = useState(null);

  const handleDragStart = useCallback((event) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragEnd = useCallback(
    (event) => {
      setActiveId(null);

      const { active } = event;
      const activeId = active.id;

      // Check if this is a section drag or component drag
      if (activeId.startsWith("section-")) {
        onSectionDragEnd(event);
      } else {
        onCrossSectionDragEnd(event);
      }
    },
    [onCrossSectionDragEnd, onSectionDragEnd]
  );

  return (
    <DndContext
      onDragStart={handleDragStart}
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
              />
              {isEditing && (
                <div className="text-center py-8">
                  <Button
                    icon={<PlusOutlined />}
                    onClick={onAddSection}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white border-2 border-yellow-500 px-6 py-2 font-semibold"
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
                    className="bg-yellow-500 hover:bg-yellow-600 text-white border-2 border-yellow-500 px-6 py-2 font-semibold"
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

      {/* Drag Overlay */}
      <DragOverlay>
        {activeId ? (
          <div className="component-wrapper mb-2 bg-white rounded-lg shadow-sm border border-gray-100 opacity-80">
            <div className="p-4">
              <div className="text-sm text-gray-500 font-medium">Component</div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default PageContent;
