// components/slider/SliderForm/SortableOrderGrid.jsx

import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { HolderOutlined } from "@ant-design/icons";

const SortableGridItem = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div
        {...listeners}
        {...attributes}
        className="absolute top-1 left-1 z-10 cursor-grab active:cursor-grabbing rounded bg-white/90 p-1 text-gray-500 shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <HolderOutlined />
      </div>
      {children}
    </div>
  );
};

const SortableOrderGrid = ({
  items = [],
  getItemId = (item) => item.id,
  onReorder,
  renderItem,
  columns = 3,
  emptyMessage = "No items selected.",
}) => {
  const [activeId, setActiveId] = useState(null);

  const itemIds = items.map(getItemId);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const oldIndex = itemIds.indexOf(active.id);
    const newIndex = itemIds.indexOf(over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    onReorder(arrayMove(items, oldIndex, newIndex));
  };

  if (items.length === 0) {
    return <div className="mt-4 text-gray-500">{emptyMessage}</div>;
  }

  const activeItem = items.find((item) => getItemId(item) === activeId);

  return (
    <div className="mt-4">
      <p className="text-xs text-gray-400 mb-2 italic">
        Drag items to set slide order
      </p>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={itemIds} strategy={rectSortingStrategy}>
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }}
          >
            {items.map((item) => {
              const id = getItemId(item);
              return (
                <SortableGridItem key={id} id={id}>
                  {renderItem(item)}
                </SortableGridItem>
              );
            })}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeId && activeItem ? (
            <div className="opacity-90 shadow-lg rounded-md">
              {renderItem(activeItem, true)}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default SortableOrderGrid;
