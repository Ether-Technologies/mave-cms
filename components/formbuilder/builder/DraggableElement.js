// components/formbuilder/builder/DraggableElement.js
import React from "react";
import { useDrag } from "react-dnd";

const DraggableElement = ({ element }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "element",
    item: { element },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className={`bg-white border border-gray-200 shadow-sm rounded-md flex flex-col items-center gap-1 sm:gap-2 p-2 sm:p-4 cursor-move transition hover:shadow-md ${isDragging ? "opacity-50" : "opacity-100"
        }`}
    >
      <div className="text-theme text-lg sm:text-2xl">{element.icon}</div>
      <div className="font-semibold text-gray-700 text-xs sm:text-sm text-center leading-tight">{element.label}</div>
    </div>
  );
};

export default DraggableElement;
