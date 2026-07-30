// components/Menus/SortableMenuItemsPicker.js

import React, { useState, useMemo, useCallback } from "react";
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
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Input, Checkbox, Button, Empty, Tag } from "antd";
import {
  HolderOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const reorderWithMultiSelect = (items, selectedIds, activeId, overId) => {
  const selectedSet = new Set(selectedIds);
  const isMultiDrag = selectedSet.has(activeId) && selectedSet.size > 1;

  if (!isMultiDrag) {
    const oldIndex = items.indexOf(activeId);
    const newIndex = items.indexOf(overId);
    if (oldIndex === -1 || newIndex === -1) return items;
    return arrayMove(items, oldIndex, newIndex);
  }

  const movingBlock = items.filter((id) => selectedSet.has(id));
  const withoutMoving = items.filter((id) => !selectedSet.has(id));

  const activeIndex = items.indexOf(activeId);
  const overIndex = items.indexOf(overId);

  let insertIndex = withoutMoving.indexOf(overId);
  if (insertIndex === -1) {
    insertIndex = withoutMoving.filter(
      (id) => items.indexOf(id) < overIndex
    ).length;
  } else if (activeIndex > overIndex) {
    // dragging up — insert before target
  } else {
    insertIndex += 1;
  }

  return [
    ...withoutMoving.slice(0, insertIndex),
    ...movingBlock,
    ...withoutMoving.slice(insertIndex),
  ];
};

const SortableItem = ({
  id,
  item,
  isSelected,
  isDraggingGroup,
  onToggleSelect,
  onRemove,
}) => {
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
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all
        ${isSelected ? "border-brand bg-blue-50" : "border-gray-200 bg-white"}
        ${isDraggingGroup && isSelected && !isDragging ? "opacity-50" : ""}
        hover:border-blue-300
      `}
    >
      <div
        {...listeners}
        {...attributes}
        className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600"
      >
        <HolderOutlined />
      </div>
      <Checkbox
        checked={isSelected}
        onChange={() => onToggleSelect(id)}
        onClick={(e) => e.stopPropagation()}
      />
      <span className="flex-1 text-sm font-medium text-gray-800 truncate">
        {item?.title || `Item #${id}`}
      </span>
      {item?.title_bn && (
        <Tag className="text-xs m-0 hidden sm:inline">{item.title_bn}</Tag>
      )}
      <Button
        type="text"
        size="small"
        icon={<DeleteOutlined />}
        onClick={() => onRemove(id)}
        className="text-gray-400 hover:text-red-500"
      />
    </div>
  );
};

const DragOverlayItem = ({ item, count }) => (
  <div className="flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-brand bg-blue-50 shadow-lg">
    <HolderOutlined className="text-gray-400" />
    <span className="text-sm font-medium text-gray-800">
      {count > 1 ? `${count} items` : item?.title || "Item"}
    </span>
  </div>
);

const SortableMenuItemsPicker = ({
  menuItems = [],
  value = [],
  onChange,
  compact = false,
}) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeId, setActiveId] = useState(null);

  const itemMap = useMemo(() => {
    const map = {};
    menuItems.forEach((item) => {
      map[item.id] = item;
    });
    return map;
  }, [menuItems]);

  const availableItems = useMemo(() => {
    const selectedSet = new Set(value);
    return menuItems.filter(
      (item) =>
        !selectedSet.has(item.id) &&
        item.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [menuItems, value, searchTerm]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleToggleSelect = useCallback((id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedIds.length === value.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds([...value]);
    }
  }, [selectedIds.length, value]);

  const handleAddItem = useCallback(
    (id) => {
      onChange([...value, id]);
    },
    [value, onChange]
  );

  const handleAddSelected = useCallback(
    (ids) => {
      onChange([...value, ...ids.filter((id) => !value.includes(id))]);
    },
    [value, onChange]
  );

  const handleRemove = useCallback(
    (id) => {
      onChange(value.filter((i) => i !== id));
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    },
    [value, onChange]
  );

  const handleRemoveSelected = useCallback(() => {
    const selectedSet = new Set(selectedIds);
    onChange(value.filter((id) => !selectedSet.has(id)));
    setSelectedIds([]);
  }, [selectedIds, value, onChange]);

  const [availableSelected, setAvailableSelected] = useState([]);

  const handleToggleAvailableSelect = (id) => {
    setAvailableSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
    const id = event.active.id;
    if (!selectedIds.includes(id)) {
      setSelectedIds([id]);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || active.id === over.id) return;

    const newOrder = reorderWithMultiSelect(
      value,
      selectedIds,
      active.id,
      over.id
    );
    onChange(newOrder);
  };

  const activeItem = activeId ? itemMap[activeId] : null;
  const dragCount =
    selectedIds.includes(activeId) && selectedIds.length > 1
      ? selectedIds.length
      : 1;

  return (
    <div className={`${compact ? "" : "grid grid-cols-1 md:grid-cols-2 gap-4"}`}>
      {/* Available items panel */}
      <div className="border-2 border-gray-200 rounded-xl p-3 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">
            Available Items
          </span>
          {availableSelected.length > 0 && (
            <Button
              type="link"
              size="small"
              icon={<PlusOutlined />}
              onClick={() => {
                handleAddSelected(availableSelected);
                setAvailableSelected([]);
              }}
              className="text-brand p-0 h-auto"
            >
              Add {availableSelected.length}
            </Button>
          )}
        </div>
        <Input
          placeholder="Search items..."
          prefix={<SearchOutlined className="text-gray-400" />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-2"
          size="small"
          allowClear
        />
        <div className="max-h-48 overflow-y-auto space-y-1">
          {availableItems.length > 0 ? (
            availableItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white transition-colors cursor-pointer"
                onClick={() => handleAddItem(item.id)}
              >
                <Checkbox
                  checked={availableSelected.includes(item.id)}
                  onChange={() => handleToggleAvailableSelect(item.id)}
                  onClick={(e) => e.stopPropagation()}
                />
                <span className="flex-1 text-sm text-gray-700 truncate">
                  {item.title}
                </span>
                <PlusOutlined className="text-gray-400 text-xs" />
              </div>
            ))
          ) : (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="No items available"
              className="my-2"
            />
          )}
        </div>
      </div>

      {/* Selected / ordered items panel */}
      <div className="border-2 border-gray-200 rounded-xl p-3 bg-white">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">
              Menu Order
            </span>
            <Tag className="m-0 text-xs">{value.length} items</Tag>
          </div>
          <div className="flex items-center gap-2">
            {value.length > 0 && (
              <Checkbox
                checked={
                  selectedIds.length === value.length && value.length > 0
                }
                indeterminate={
                  selectedIds.length > 0 && selectedIds.length < value.length
                }
                onChange={handleSelectAll}
              >
                <span className="text-xs">All</span>
              </Checkbox>
            )}
            {selectedIds.length > 0 && (
              <Button
                type="link"
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={handleRemoveSelected}
                className="p-0 h-auto text-xs"
              >
                Remove ({selectedIds.length})
              </Button>
            )}
          </div>
        </div>

        {value.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={value}
              strategy={verticalListSortingStrategy}
            >
              <div className="max-h-64 overflow-y-auto space-y-1.5">
                {value.map((id) => (
                  <SortableItem
                    key={id}
                    id={id}
                    item={itemMap[id]}
                    isSelected={selectedIds.includes(id)}
                    isDraggingGroup={
                      activeId !== null &&
                      selectedIds.includes(activeId) &&
                      selectedIds.length > 1
                    }
                    onToggleSelect={handleToggleSelect}
                    onRemove={handleRemove}
                  />
                ))}
              </div>
            </SortableContext>
            <DragOverlay>
              {activeId ? (
                <DragOverlayItem item={activeItem} count={dragCount} />
              ) : null}
            </DragOverlay>
          </DndContext>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Add items from the left panel"
            className="my-4"
          />
        )}

        <p className="text-xs text-gray-400 mt-2 italic">
          Select multiple items, then drag to reposition them together
        </p>
      </div>
    </div>
  );
};

export default SortableMenuItemsPicker;
