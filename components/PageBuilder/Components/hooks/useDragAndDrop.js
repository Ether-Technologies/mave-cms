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
        (result) => {
            console.log("🔧 onDragEnd called:", result);

            if (!result.destination) {
                console.log("🔧 No destination, returning");
                return;
            }

            if (result.source.index === result.destination.index) {
                console.log("🔧 Same position, no change needed");
                return;
            }

            const items = Array.from(componentsState);
            const reorderedItem = items[result.source.index];

            // Create new array without mutating
            const newItems = [
                ...items.slice(0, result.source.index),
                ...items.slice(result.source.index + 1),
            ];

            // Insert at destination
            const finalItems = [
                ...newItems.slice(0, result.destination.index),
                reorderedItem,
                ...newItems.slice(result.destination.index),
            ];

            console.log("🔧 Drag ended:", {
                source: result.source.index,
                destination: result.destination.index,
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