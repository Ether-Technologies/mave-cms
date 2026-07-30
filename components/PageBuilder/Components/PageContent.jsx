// components/PageBuilder/Components/PageContent.jsx

import React, { useState, useCallback, useRef } from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  sortableKeyboardCoordinates,
  arrayMove,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { useDispatch } from "react-redux";
import { setPageData, setIsDirty } from "../../../store/slices/pageSlice";
import SectionList from "../Sections/SectionList";
import { useCrossSectionDragAndDrop } from "../hooks/useCrossSectionDragAndDrop";
import { useSectionDragAndDrop } from "../Sections/hooks/useSectionDragAndDrop";
import PageBuilderDragOverlay from "./PageBuilderDragOverlay";
import {
  buildDndLookup,
  isSectionDragId,
  resolveDropSectionIndex,
} from "../utils/pageBuilderDndUtils";

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
  const [activeSection, setActiveSection] = useState(null);
  const [dragOverSection, setDragOverSection] = useState(null);
  const [isDraggingSection, setIsDraggingSection] = useState(false);

  const dndLookupRef = useRef(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const resetDragState = useCallback(() => {
    setActiveId(null);
    setActiveComponent(null);
    setActiveSection(null);
    setDragOverSection(null);
    setIsDraggingSection(false);
    dndLookupRef.current = null;
  }, []);

  const handleDragStart = useCallback(
    (event) => {
      const { active } = event;
      const activeIdStr = String(active.id);
      setActiveId(active.id);

      const lookup = buildDndLookup(pageData?.body || []);
      dndLookupRef.current = lookup;

      if (lookup.sectionIdToIndex.has(activeIdStr)) {
        const sectionIndex = lookup.sectionIdToIndex.get(activeIdStr);
        const section = pageData.body[sectionIndex];
        setActiveSection({
          ...section,
          sectionIndex,
        });
        setIsDraggingSection(true);
        return;
      }

      const location = lookup.componentMap.get(activeIdStr);
      if (location) {
        setActiveComponent({
          ...location.component,
          sectionIndex: location.sectionIndex,
          type: location.component.type || "Component",
        });
      }
    },
    [pageData]
  );

  const handleDragOver = useCallback((event) => {
    const { over, active } = event;

    if (!over) {
      setDragOverSection(null);
      return;
    }

    const lookup = dndLookupRef.current;
    if (!lookup) {
      setDragOverSection(null);
      return;
    }

    if (lookup.sectionIdToIndex.has(String(active.id))) {
      setDragOverSection(null);
      return;
    }

    const overIdStr = String(over.id);
    let targetSection = -1;

    if (overIdStr.startsWith("section-drop-")) {
      targetSection = parseInt(overIdStr.replace("section-drop-", ""), 10);
    } else if (lookup.componentMap.has(overIdStr)) {
      targetSection = lookup.componentMap.get(overIdStr).sectionIndex;
    }

    setDragOverSection(targetSection >= 0 ? targetSection : null);
  }, []);

  const handleWithinSectionDrag = useCallback(
    (event, sectionIndex) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const section = pageData.body[sectionIndex];
      if (!section) return;

      const activeIndex = section.data.findIndex((comp, idx) => {
        const componentId = comp._id ?? `component-${sectionIndex}-${idx}`;
        return String(active.id) === String(componentId);
      });

      const overIndex = section.data.findIndex((comp, idx) => {
        const componentId = comp._id ?? `component-${sectionIndex}-${idx}`;
        return String(over.id) === String(componentId);
      });

      if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) {
        return;
      }

      const newComponents = arrayMove(section.data, activeIndex, overIndex);

      dispatch(
        setPageData({
          ...pageData,
          body: pageData.body.map((s, i) =>
            i === sectionIndex ? { ...s, data: newComponents } : s
          ),
        })
      );
      dispatch(setIsDirty(true));
    },
    [pageData, dispatch]
  );

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;

      if (isSectionDragId(active.id, pageData?.body || [])) {
        resetDragState();
        onSectionDragEnd(event);
        return;
      }

      if (!over || active.id === over.id) {
        resetDragState();
        return;
      }

      const lookup = buildDndLookup(pageData?.body || []);
      const sourceLocation = lookup.componentMap.get(String(active.id));

      if (!sourceLocation) {
        resetDragState();
        return;
      }

      const destinationSectionIndex = resolveDropSectionIndex(
        over.id,
        pageData?.body || []
      );

      if (
        destinationSectionIndex !== -1 &&
        sourceLocation.sectionIndex === destinationSectionIndex
      ) {
        handleWithinSectionDrag(event, sourceLocation.sectionIndex);
        resetDragState();
        return;
      }

      resetDragState();
      onCrossSectionDragEnd(event);
    },
    [
      pageData,
      onSectionDragEnd,
      onCrossSectionDragEnd,
      handleWithinSectionDrag,
      resetDragState,
    ]
  );

  const handleDragCancel = useCallback(() => {
    resetDragState();
  }, [resetDragState]);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
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
                dragOverSection={dragOverSection}
                activeId={activeId}
                isDraggingSection={isDraggingSection}
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

      <PageBuilderDragOverlay
        activeComponent={activeComponent}
        activeSection={activeSection}
      />
    </DndContext>
  );
};

export default PageContent;
