// components/PageBuilder/Components/InsertionIndicator.jsx

import React from "react";

const InsertionIndicator = ({ isVisible, position = "bottom" }) => {
  if (!isVisible) return null;

  return (
    <div
      className={`insertion-indicator w-full transition-all duration-200 ${
        position === "top" ? "mb-2" : "mt-2"
      }`}
    >
      <div className="flex items-center justify-center">
        <div className="flex-1 h-0.5 bg-gray-200 rounded-full"></div>
        <div className="mx-2 px-2 py-1 bg-gray-200 text-white text-xs font-medium rounded-full">
          Drop here
        </div>
        <div className="flex-1 h-0.5 bg-gray-200 rounded-full"></div>
      </div>
    </div>
  );
};

export default InsertionIndicator;
