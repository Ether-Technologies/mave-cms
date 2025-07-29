// components/PageBuilder/Components/hooks/useDragAndDrop.js

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsDirty, setPageData } from "../../../../store/slices/pageSlice";

export const useDragAndDrop = ({
    componentsState,
    sectionIndex,
    onComponentsUpdate,
}) => {
    const dispatch = useDispatch();
    const pageData = useSelector((state) => state.page.pageData);

    const onDragEnd = useCallback(
        (event) => {
            console.log("🔧 onDragEnd called:", event);

            const { active, over } = event;

            if (!over) {
                console.log("🔧 No destination, returning");
                return;
            }

            if (active.id === over.id) {
                console.log("🔧 Same position, no change needed");
                return;
            }

            // Find the indices
            const activeIndex = componentsState.findIndex(
                (component) => {
                    const componentId = component._id ||
                        `component-${sectionIndex}-${componentsState.indexOf(component)}-${Date.now()}`;
                    return active.id === componentId;
                }
            );

            const overIndex = componentsState.findIndex(
                (component) => {
                    const componentId = component._id ||
                        `component-${sectionIndex}-${componentsState.indexOf(component)}-${Date.now()}`;
                    return over.id === componentId;
                }
            );

            if (activeIndex === -1 || overIndex === -1) {
                console.log("🔧 Could not find indices, returning");
                return;
            }

            if (activeIndex === overIndex) {
                console.log("🔧 Same position, no change needed");
                return;
            }

            const items = Array.from(componentsState);
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

            console.log("🔧 Drag ended:", {
                source: activeIndex,
                destination: overIndex,
                finalItems: finalItems.length,
            });

            // Always call onComponentsUpdate if provided
            if (onComponentsUpdate) {
                onComponentsUpdate(finalItems);
            } else {
                // Fallback to old system
                const updatedPageData = {
                    ...pageData,
                    body: pageData.body.map((section, idx) => {
                        if (idx === sectionIndex) {
                            return {
                                ...section,
                                data: finalItems,
                            };
                        }
                        return section;
                    }),
                };

                dispatch(setPageData(updatedPageData));
                dispatch(setIsDirty(true));
            }
        },
        [componentsState, onComponentsUpdate, pageData, sectionIndex, dispatch]
    );

    return { onDragEnd };
}; 