// components/PageBuilder/Components/PageBuilderDragOverlay.jsx

import React from "react";
import { DragOverlay } from "@dnd-kit/core";
import { HolderOutlined } from "@ant-design/icons";

const formatComponentLabel = (component) => {
  if (!component) return "Component";

  const type = component.type || "Component";
  const raw =
    component.value ||
    component.title_en ||
    component.title ||
    component._mave?.altText ||
    "";

  if (typeof raw === "string" && raw.trim()) {
    const plain = raw.replace(/<[^>]*>/g, "").trim();
    if (plain) {
      return plain.length > 60 ? `${plain.slice(0, 60)}…` : plain;
    }
  }

  return type;
};

const PageBuilderDragOverlay = ({ activeComponent, activeSection }) => {
  const dropAnimation = {
    duration: 220,
    easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
  };

  if (!activeComponent && !activeSection) {
    return null;
  }

  return (
    <DragOverlay dropAnimation={dropAnimation}>
      {activeSection ? (
        <div className="bg-white rounded-lg shadow-2xl border-2 border-brand px-5 py-4 w-full max-w-3xl pointer-events-none">
          <div className="flex items-center gap-3">
            <HolderOutlined className="text-gray-400 text-lg" />
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-brand">
                Moving Section
              </div>
              <div className="text-base font-semibold text-gray-800">
                {activeSection.title ||
                  `Section ${(activeSection.sectionIndex ?? 0) + 1}`}
              </div>
              <div className="text-sm text-gray-500">
                {activeSection.data?.length || 0} component
                {(activeSection.data?.length || 0) === 1 ? "" : "s"}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-2xl border-2 border-brand w-full max-w-2xl pointer-events-none">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200 rounded-t-lg">
            <HolderOutlined className="text-gray-400" />
            <span className="text-xs font-semibold uppercase tracking-wide text-brand">
              {activeComponent.type || "Component"}
            </span>
          </div>
          <div className="px-4 py-3 text-sm text-gray-700">
            {formatComponentLabel(activeComponent)}
          </div>
        </div>
      )}
    </DragOverlay>
  );
};

export default PageBuilderDragOverlay;
