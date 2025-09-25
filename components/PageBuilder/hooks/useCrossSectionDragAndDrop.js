// components/PageBuilder/hooks/useCrossSectionDragAndDrop.js

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsDirty, setPageData } from "../../../store/slices/pageSlice";

export const useCrossSectionDragAndDrop = () => {
    const dispatch = useDispatch();
    const pageData = useSelector((state) => state.page.pageData);

    const onDragEnd = useCallback(
        (event) => {
            const { active, over } = event;

            if (!over) {
                return;
            }

            if (active.id === over.id) {
                return;
            }

            // Parse active and over IDs to determine source and destination
            const activeId = active.id;
            const overId = over.id;

            // If it's a section (your section ids are created as `section-...`), let section handler manage it
            if (String(activeId).startsWith('section-')) {
                return;
            }
            // Otherwise treat it as a component drag, regardless of id format

            // Find source and destination section indices by searching through all sections
            let sourceSectionIndex = -1;
            let destinationSectionIndex = -1;
            let sourceComponent = null;
            let destinationComponent = null;

            // Find source component and its section
            for (let i = 0; i < pageData.body.length; i++) {
                const section = pageData.body[i];
                const componentIdx = section.data.findIndex((comp, idx) => {
                    const componentId = comp._id ?? `component-${i}-${idx}`;
                    return String(activeId) === String(componentId);
                });
                if (componentIdx !== -1) {
                    sourceSectionIndex = i;
                    sourceComponent = section.data[componentIdx];
                    break;
                }
            }

            // Find destination section
            if (String(overId).startsWith('section-drop-')) {
                destinationSectionIndex = parseInt(String(overId).replace('section-drop-', ''), 10);

            } else {
                // Find destination component and its section
                for (let i = 0; i < pageData.body.length; i++) {
                    const section = pageData.body[i];
                    const destIdx = section.data.findIndex((comp, idx) => {
                        const componentId = comp._id ?? `component-${i}-${idx}`;
                        return String(overId) === String(componentId);
                    });
                    if (destIdx !== -1) {
                        destinationSectionIndex = i;
                        destinationComponent = section.data[destIdx];
                        break;
                    }
                }
            }

            if (sourceSectionIndex === -1) {
                return;
            }

            if (destinationSectionIndex === -1) {
                return;
            }

            // If same section, let the regular drag handler deal with it
            if (sourceSectionIndex === destinationSectionIndex) {
                return;
            }

            // Get source and destination sections
            const sourceSection = pageData.body[sourceSectionIndex];
            const destinationSection = pageData.body[destinationSectionIndex];

            if (!sourceSection || !destinationSection) {
                return;
            }

            // Find the component index in source section
            const sourceComponentIndex = sourceSection.data.findIndex(
                (component) => component._id === sourceComponent._id
            );

            // Find the insertion point in destination section
            let destinationComponentIndex = destinationSection.data.length; // Default to end

            if (!String(overId).startsWith('section-drop-') && destinationComponent) {
                // If dropping on a component, find its index and insert after it
                destinationComponentIndex = destinationSection.data.findIndex(
                    (component) => component._id === destinationComponent._id
                );

                if (destinationComponentIndex === -1) {
                    destinationComponentIndex = destinationSection.data.length; // Fallback to end
                } else {
                    // Insert after the hovered component for more natural feel
                    destinationComponentIndex = destinationComponentIndex + 1;
                }
            }

            if (sourceComponentIndex === -1) {
                return;
            }

            // Get the component to move
            const componentToMove = sourceComponent;

            // Create updated sections
            const updatedPageData = { ...pageData };
            const updatedSections = [...updatedPageData.body];

            // Remove component from source section
            const updatedSourceSection = {
                ...sourceSection,
                data: sourceSection.data.filter((_, idx) => idx !== sourceComponentIndex)
            };

            // Add component to destination section
            const updatedDestinationSection = {
                ...destinationSection,
                data: [
                    ...destinationSection.data.slice(0, destinationComponentIndex),
                    {
                        ...componentToMove,
                        // Keep existing _id if it exists, don't regenerate
                        _id: componentToMove._id || `component-${destinationSectionIndex}-${destinationComponentIndex}`
                    },
                    ...destinationSection.data.slice(destinationComponentIndex)
                ]
            };

            // Update the sections in the page data
            updatedSections[sourceSectionIndex] = updatedSourceSection;
            updatedSections[destinationSectionIndex] = updatedDestinationSection;

            updatedPageData.body = updatedSections;

            dispatch(setPageData(updatedPageData));
            dispatch(setIsDirty(true));
        },
        [pageData, dispatch]
    );

    return { onDragEnd };
};
