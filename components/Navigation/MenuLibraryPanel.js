import React, { useMemo, useState } from "react";
import { Button, Empty, Input, Tag, Tooltip, message } from "antd";
import { HolderOutlined, PlusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  canAddItemToMenu,
  canDragItemToMenu,
  getAddItemToMenuFeedback,
  libraryDragId,
} from "./navigationUtils";

function LibraryItemRow({ item, menuItemIds, onAdd }) {
  const inMenu = menuItemIds.includes(item.id);
  const canAdd = canAddItemToMenu(item, menuItemIds);
  const isChild = item.parent_id != null;
  const canDrag = canDragItemToMenu(item, menuItemIds);

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: libraryDragId(item.id),
    disabled: !canDrag,
    data: { type: "library", itemId: item.id },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.45 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 p-2.5 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50/80 transition-colors ${
        canDrag ? "cursor-grab" : ""
      }`}
    >
      {canDrag ? (
        <button
          type="button"
          className="shrink-0 text-gray-400 hover:text-gray-600 touch-none cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
          aria-label={`Drag ${item.title} into menu`}
        >
          <HolderOutlined />
        </button>
      ) : (
        <span className="w-[14px] shrink-0" aria-hidden />
      )}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">{item.title}</div>
        <div className="flex flex-wrap gap-1 mt-0.5">
          {isChild && <Tag className="text-xs m-0">Child</Tag>}
          {inMenu && (
            <Tag color="green" className="text-xs m-0">
              In menu
            </Tag>
          )}
          <span className="text-xs text-gray-400 truncate max-w-full">{item.link}</span>
        </div>
      </div>
      <Tooltip
        title={
          inMenu
            ? "Already added"
            : isChild
              ? "Children show under parent"
              : "Add to menu"
        }
      >
        <Button
          type="text"
          size="small"
          icon={<PlusOutlined />}
          disabled={!canAdd && !inMenu}
          onClick={onAdd}
          onPointerDown={(e) => e.stopPropagation()}
        />
      </Tooltip>
    </div>
  );
}

const MenuLibraryPanel = ({
  allMenuItems,
  menuItemIds,
  onAddToMenu,
  onCreateItem,
}) => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    let list = [...allMenuItems].sort((a, b) =>
      (a.title || "").localeCompare(b.title || "")
    );
    if (term) {
      list = list.filter(
        (item) =>
          item.title?.toLowerCase().includes(term) ||
          item.title_bn?.toLowerCase().includes(term)
      );
    }
    return list;
  }, [allMenuItems, search]);

  const handleAdd = (item) => {
    const feedback = getAddItemToMenuFeedback(item, menuItemIds);
    if (feedback) {
      message[feedback.type](feedback.text);
      return;
    }
    onAddToMenu(item.id);
    message.success(`Added “${item.title}”`);
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gray-50/80 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="font-semibold text-gray-800">Item library</span>
          <Button
            type="primary"
            size="small"
            icon={<PlusCircleOutlined />}
            onClick={onCreateItem}
            className="bg-black hover:!bg-gray-800"
          >
            New item
          </Button>
        </div>
        <Input
          allowClear
          placeholder="Search items…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <p className="text-xs text-gray-500 m-0">
          Drag items into the menu or use + to add.
        </p>
      </div>
      <div className="flex-1 min-h-0 navigation-scroll p-2 space-y-1">
        {filtered.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No menu items"
            className="py-8"
          />
        ) : (
          filtered.map((item) => (
              <LibraryItemRow
                key={item.id}
                item={item}
                menuItemIds={menuItemIds}
                onAdd={() => handleAdd(item)}
              />
            ))
        )}
      </div>
    </div>
  );
};

export default MenuLibraryPanel;
