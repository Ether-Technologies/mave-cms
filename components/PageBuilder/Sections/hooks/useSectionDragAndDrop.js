// components/PageBuilder/Sections/hooks/useSectionDragAndDrop.js

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIsDirty, setPageData } from "../../../../store/slices/pageSlice";

export const useSectionDragAndDrop = ({
    sections,
    onSectionsUpdate,
}) => {
    const dispatch = useDispatch();
    const pageData = useSelector((state) => state.page.pageData);

    const onDragEnd = useCallback(
        (result) => {
            console.log("🔧 Section onDragEnd called:", result);

            if (!result.destination) {
                console.log("🔧 No destination, returning");
                return;
            }

            if (result.source.index === result.destination.index) {
                console.log("🔧 Same position, no change needed");
                return;
            }

            const items = Array.from(sections || pageData?.body || []);
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

            console.log("🔧 Section drag ended:", {
                source: result.source.index,
                destination: result.destination.index,
                finalItems: finalItems.length,
            });

            if (onSectionsUpdate) {
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