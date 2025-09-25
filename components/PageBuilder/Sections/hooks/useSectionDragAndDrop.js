// components/PageBuilder/Sections/hooks/useSectionDragAndDrop.js

import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsDirty, setPageData } from "../../../../store/slices/pageSlice";

export const useSectionDragAndDrop = ({
    sections,
    onSectionsUpdate,
}) => {
    const dispatch = useDispatch();
    const pageData = useSelector((state) => state.page.pageData);

    // Debug sections - removed empty useEffect to prevent unnecessary re-renders

    const onDragEnd = useCallback(
        (event) => {
            console.log("🔧 Section onDragEnd called:", event);

            const { active, over } = event;

            if (!over) {
                console.log("🔧 No destination, returning");
                return;
            }

            if (active.id === over.id) {
                console.log("🔧 Same position, no change needed");
                return;
            }

            const items = Array.from(sections || pageData?.body || []);

            // Find the indices
            const activeIndex = items.findIndex(
                (section, idx) => {
                    const sectionId = section._id ||
                        `section-${idx}`;
                    return active.id === sectionId;
                }
            );

            const overIndex = items.findIndex(
                (section, idx) => {
                    const sectionId = section._id ||
                        `section-${idx}`;
                    return over.id === sectionId;
                }
            );

            console.log("🔧 Section drag indices:", {
                activeId: active.id,
                overId: over.id,
                activeIndex,
                overIndex,
                itemsCount: items.length
            });

            if (activeIndex === -1 || overIndex === -1) {
                console.log("🔧 Could not find indices, returning");
                return;
            }

            if (activeIndex === overIndex) {
                console.log("🔧 Same position, no change needed");
                return;
            }

            const reorderedItem = items[activeIndex];

            // Create new array without mutating
            const newItems = [
                ...items.slice(0, activeIndex),
                ...items.slice(activeIndex + 1),
            ];

            // Insert at destination
            const finalItems = [
                ...newItems.slice(0, overIndex),
                reorderedItem,
                ...newItems.slice(overIndex),
            ];

            console.log("🔧 Section drag ended:", {
                source: activeIndex,
                destination: overIndex,
                finalItems: finalItems.length,
            });

            if (onSectionsUpdate) {
                console.log("🔧 Calling onSectionsUpdate with reordered sections");
                onSectionsUpdate(finalItems);
            } else {
                // Fallback to old system
                const updatedPageData = {
                    ...pageData,
                    body: finalItems,
                };

                dispatch(setPageData(updatedPageData));
                dispatch(setIsDirty(true));
            }
        },
        [sections, onSectionsUpdate, pageData, dispatch]
    );

    return { onDragEnd };
}; 