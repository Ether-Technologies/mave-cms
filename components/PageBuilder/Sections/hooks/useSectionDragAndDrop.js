// components/PageBuilder/Sections/hooks/useSectionDragAndDrop.js

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { arrayMove } from "@dnd-kit/sortable";
import { setIsDirty, setPageData } from "../../../../store/slices/pageSlice";
import { getSectionId } from "../../utils/pageBuilderDndUtils";

export const useSectionDragAndDrop = ({ sections, onSectionsUpdate }) => {
  const dispatch = useDispatch();
  const pageData = useSelector((state) => state.page.pageData);

  const onDragEnd = useCallback(
    (event) => {
      const { active, over } = event;

      if (!over || active.id === over.id) {
        return;
      }

      const items = Array.from(sections || pageData?.body || []);

      const activeIndex = items.findIndex(
        (section, idx) =>
          String(getSectionId(section, idx)) === String(active.id)
      );

      const overIdStr = String(over.id);
      let overIndex = -1;

      if (overIdStr.startsWith("section-drop-")) {
        overIndex = parseInt(overIdStr.replace("section-drop-", ""), 10);
      } else {
        overIndex = items.findIndex(
          (section, idx) =>
            String(getSectionId(section, idx)) === overIdStr
        );
      }

      if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex) {
        return;
      }

      const finalItems = arrayMove(items, activeIndex, overIndex);

      if (onSectionsUpdate) {
        onSectionsUpdate(finalItems);
      } else {
        dispatch(
          setPageData({
            ...pageData,
            body: finalItems,
          })
        );
        dispatch(setIsDirty(true));
      }
    },
    [sections, onSectionsUpdate, pageData, dispatch]
  );

  return { onDragEnd };
};
