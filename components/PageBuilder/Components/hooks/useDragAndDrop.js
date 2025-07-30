// components/PageBuilder/Components/hooks/useDragAndDrop.js

import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsDirty, setPageData } from "../../../../store/slices/pageSlice";

export const useDragAndDrop = ({
    componentsState,
    sectionIndex,
    onComponentsUpdate,
}) => {
    const dispatch = useDispatch();
    const pageData = useSelector((state) => state.page.pageData);

    // Debug components
    useEffect(() => {
    }, [componentsState, sectionIndex]);

    const onDragEnd = useCallback(
        (event) => {
            console.log("🔧 Component onDragEnd called:", event);

            const { active, over } = event;

            if (!over) {
                console.log("🔧 No destination, returning");
                return;
            }

            if (active.id === over.id) {
                console.log("🔧 Same position, no change needed");
                return;
            }

            // Find the indices using stable ID generation
            const activeIndex = componentsState.findIndex(
                (component, idx) => {
                    const componentId = component._id ||
                        `component-${sectionIndex}-${idx}`;
                    return active.id === componentId;
                }
            );

            const overIndex = componentsState.findIndex(
                (component, idx) => {
                    const componentId = component._id ||
                        `component-${sectionIndex}-${idx}`;
                    return over.id === componentId;
                }
            );

            console.log("🔧 Component drag indices:", {
                activeId: active.id,
                overId: over.id,
                activeIndex,
                overIndex,
                sectionIndex,
                componentsCount: componentsState.length
            });

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

            console.log("🔧 Component drag ended:", {
                source: activeIndex,
                destination: overIndex,
                finalItems: finalItems.length,
            });

            // Always call onComponentsUpdate if provided
            if (onComponentsUpdate) {
                console.log("🔧 Calling onComponentsUpdate with reordered components");
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