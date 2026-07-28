// components/PageBuilder/Components/CrossSectionDragOverlay.jsx

import React from "react";
import { DragOverlay } from "@dnd-kit/core";
import ComponentRenderer from "./ComponentRenderer";

const CrossSectionDragOverlay = ({ activeId, activeComponent }) => {
  if (!activeId || !activeComponent) {
    return null;
  }

  return (
    <DragOverlay>
      <div className="component-wrapper mb-2 bg-white rounded-lg shadow-lg border-2 border-gray-300 opacity-90 transform rotate-2 scale-105 transition-all duration-200">
        <div className="p-4">
          <div className="text-xs text-gray-700 font-medium mb-2 uppercase tracking-wide">
            Moving {activeComponent.type || "Component"}
          </div>
          <div className="text-sm text-gray-700">
            {activeComponent.value ? (
              <div
                dangerouslySetInnerHTML={{
                  __html:
                    activeComponent.value
                      .replace(/<[^>]*>/g, "")
                      .substring(0, 50) + "...",
                }}
              />
            ) : (
              <div className="text-gray-500 italic">
                {activeComponent.type || "Component"} from Section{" "}
                {activeComponent.sectionIndex + 1}
              </div>
            )}
          </div>
        </div>
      </div>
    </DragOverlay>
  );
};

export default CrossSectionDragOverlay;
