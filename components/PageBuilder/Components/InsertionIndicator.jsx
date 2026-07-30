// components/PageBuilder/Components/InsertionIndicator.jsx

import React from "react";

const InsertionIndicator = ({ isVisible, position = "bottom" }) => {
  if (!isVisible) return null;

  return (
    <div
      className={`insertion-indicator w-full ${
        position === "top" ? "mb-3" : "mt-3"
      }`}
      aria-hidden="true"
    >
      <div className="flex items-center justify-center gap-2">
        <div className="flex-1 h-1 bg-brand/30 rounded-full" />
        <div className="px-3 py-1.5 bg-brand text-white text-xs font-semibold rounded-full shadow-sm">
          Drop here
        </div>
        <div className="flex-1 h-1 bg-brand/30 rounded-full" />
      </div>
    </div>
  );
};

export default InsertionIndicator;
