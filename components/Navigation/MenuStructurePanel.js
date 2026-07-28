import React from "react";
import {
  Button,
  Empty,
  Menu,
  Tag,
  Tooltip,
  message,
} from "antd";
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  DeleteOutlined,
  HolderOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useDndContext, useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { MENU_STRUCTURE_DROP_ID, MENU_PREVIEW_DROP_ID, parseLibraryDragId } from "./navigationUtils";

function MenuPreviewDropZone({ roots, menuItemIds }) {
  const { active } = useDndContext();
  const { setNodeRef, isOver } = useDroppable({ id: MENU_PREVIEW_DROP_ID });

  const isLibraryDrag = active != null && parseLibraryDragId(active.id) != null;
  const isMenuDrag = active != null && menuItemIds.includes(active.id);

  let overClass = "bg-gray-50";
  if (isOver) {
    if (isMenuDrag) overClass = "bg-red-50/80 ring-2 ring-inset ring-red-200";
    else if (isLibraryDrag) overClass = "bg-blue-50/80 ring-2 ring-inset ring-blue-200";
    else overClass = "bg-gray-100 ring-2 ring-inset ring-gray-200";
  }

  const previewItems = roots?.length ? (
    <Menu mode="horizontal" selectable={false} style={{ border: "none", flex: 1 }}>
      {roots.map((item) =>
        item.all_children?.length ? (
          <Menu.SubMenu key={item.id} title={item.title}>
            {item.all_children.map((child) => (
              <Menu.Item key={child.id}>{child.title}</Menu.Item>
            ))}
          </Menu.SubMenu>
        ) : (
          <Menu.Item key={item.id}>{item.title}</Menu.Item>
        )
      )}
    </Menu>
  ) : (
    <span className="text-xs text-gray-400 italic">
      Drop library items here to add · drag menu items here to remove
    </span>
  );

  return (
    <div
      ref={setNodeRef}
      className={`px-4 py-3 border-b border-gray-100 navigation-scroll-x shrink-0 transition-colors ${overClass}`}
    >
      <p className="text-xs font-medium text-gray-500 mb-2">Preview</p>
      <div className="flex items-center min-w-0 pb-1">{previewItems}</div>
    </div>
  );
}

function TreeBranch({ nodes, depth = 0 }) {
  if (!nodes?.length) return null;
  return (
    <ul className={`${depth > 0 ? "ml-4 mt-1 border-l border-gray-200 pl-3" : ""} space-y-1`}>
      {nodes.map((node) => (
        <li key={node.id}>
          <div className="flex items-center gap-2 py-1.5 text-sm">
            <span className="font-medium text-gray-800">{node.title}</span>
            {node.title_bn && (
              <span className="text-gray-400 text-xs">({node.title_bn})</span>
            )}
            <Tag className="text-xs m-0 max-w-[140px] truncate" title={node.link}>
              {node.link || "/"}
            </Tag>
          </div>
          {node.all_children?.length > 0 && (
            <TreeBranch nodes={node.all_children} depth={depth + 1} />
          )}
        </li>
      ))}
    </ul>
  );
}

function SortableRootRow({ item, index, total, onMoveUp, onMoveDown, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.85 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm"
    >
      <div className="flex items-start gap-2">
        <button
          type="button"
          className="mt-1 cursor-grab text-gray-400 hover:text-gray-600 touch-none"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
        >
          <HolderOutlined />
        </button>
        <div className="flex-1 min-w-0">
          <div className="font-medium text-gray-900">{item.title}</div>
          {item.all_children?.length > 0 && (
            <TreeBranch nodes={item.all_children} depth={1} />
          )}
        </div>
        <div className="flex flex-col gap-0.5 shrink-0">
          <Tooltip title="Move up">
            <Button
              type="text"
              size="small"
              disabled={index === 0}
              icon={<ArrowUpOutlined />}
              onClick={() => onMoveUp(index)}
            />
          </Tooltip>
          <Tooltip title="Move down">
            <Button
              type="text"
              size="small"
              disabled={index >= total - 1}
              icon={<ArrowDownOutlined />}
              onClick={() => onMoveDown(index)}
            />
          </Tooltip>
          <Tooltip title="Remove from menu">
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onRemove(item.id)}
            />
          </Tooltip>
        </div>
      </div>
    </div>
  );
}

const MenuStructurePanel = ({
  menu,
  roots,
  menuItemIds,
  onMenuItemIdsChange,
  onSave,
  saving,
  dirty,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: MENU_STRUCTURE_DROP_ID,
    disabled: !menu,
  });

  if (!menu) {
    return (
      <div className="flex flex-col h-full min-h-0 bg-white rounded-xl border border-gray-200 items-center justify-center p-8">
        <Empty description="Select or create a menu to start building" />
      </div>
    );
  }

  const move = (from, to) => {
    if (to < 0 || to >= menuItemIds.length) return;
    onMenuItemIdsChange(arrayMove(menuItemIds, from, to));
  };

  const removeRoot = (id) => {
    onMenuItemIdsChange(menuItemIds.filter((x) => x !== id));
  };

  const handleSave = async () => {
    try {
      await onSave();
      message.success("Menu saved");
    } catch {
      message.error("Could not save menu");
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-lg text-gray-900">{menu.name}</h3>
          <p className="text-xs text-gray-500">
            Drag from the library to add. Drag menu items to Preview to remove, or reorder below.
          </p>
        </div>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          loading={saving}
          disabled={!dirty}
          onClick={handleSave}
          className="bg-black hover:!bg-gray-800"
        >
          Save menu
        </Button>
      </div>

      <MenuPreviewDropZone roots={roots} menuItemIds={menuItemIds} />

      <div
        ref={setNodeRef}
        className={`flex-1 min-h-0 navigation-scroll p-4 transition-colors ${
          isOver ? "bg-blue-50/60 ring-2 ring-inset ring-blue-200 rounded-b-xl" : ""
        }`}
      >
        {roots.length === 0 ? (
          <Empty
            description="Drop items here or add from the library →"
            className="py-12"
          />
        ) : (
          <SortableContext
            items={menuItemIds}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {roots.map((item, index) => (
                <SortableRootRow
                  key={item.id}
                  item={item}
                  index={index}
                  total={roots.length}
                  onMoveUp={(i) => move(i, i - 1)}
                  onMoveDown={(i) => move(i, i + 1)}
                  onRemove={removeRoot}
                />
              ))}
            </div>
          </SortableContext>
        )}
      </div>
    </div>
  );
};

export default MenuStructurePanel;
