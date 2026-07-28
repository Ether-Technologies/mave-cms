import React, { useMemo, useState } from "react";
import { Button, Empty, Input, Tag, Tooltip, message } from "antd";
import { HolderOutlined, PlusOutlined } from "@ant-design/icons";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { getOrderedMenuRootsFromIds, libraryMenuDragId } from "./navigationUtils";

function LibraryMenuRow({
  menu,
  menuItems,
  attachedMenuId,
  navbarSelected,
  onAttach,
}) {
  const attached = attachedMenuId === menu.id;
  const rootCount = (menu.menu_item_ids || []).length;

  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: libraryMenuDragId(menu.id),
    data: { type: "library-menu", menuId: menu.id },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.45 : 1,
  };

  const roots = getOrderedMenuRootsFromIds(menu.menu_item_ids || [], menuItems);
  const previewTitles = roots.slice(0, 3).map((r) => r.title);

  const handleAdd = () => {
    if (!navbarSelected) {
      message.warning("Select a navbar first");
      return;
    }
    onAttach(menu.id);
    message.success(`Attached menu “${menu.name}”`);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 p-2.5 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50/80 transition-colors ${
        navbarSelected ? "cursor-grab" : ""
      }`}
    >
      <button
        type="button"
        className="shrink-0 text-gray-400 hover:text-gray-600 touch-none cursor-grab active:cursor-grabbing disabled:opacity-40 disabled:cursor-not-allowed"
        disabled={!navbarSelected}
        {...attributes}
        {...listeners}
        aria-label={`Drag ${menu.name} onto navbar`}
      >
        <HolderOutlined />
      </button>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">{menu.name}</div>
        <div className="flex flex-wrap gap-1 mt-0.5 items-center">
          <span className="text-xs text-gray-400">{rootCount} top-level</span>
          {attached && (
            <Tag color="green" className="text-xs m-0">
              Attached
            </Tag>
          )}
          {previewTitles.length > 0 && (
            <span className="text-xs text-gray-400 truncate">
              {previewTitles.join(" · ")}
            </span>
          )}
        </div>
      </div>
      <Tooltip
        title={
          attached
            ? "Replace attached menu"
            : navbarSelected
              ? "Attach to navbar"
              : "Select a navbar first"
        }
      >
        <Button
          type="text"
          size="small"
          icon={<PlusOutlined />}
          disabled={!navbarSelected}
          onClick={handleAdd}
          onPointerDown={(e) => e.stopPropagation()}
        />
      </Tooltip>
    </div>
  );
}

const MenusLibraryPanel = ({
  menus,
  menuItems,
  attachedMenuId,
  navbarSelected,
  onAttachMenu,
}) => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    let list = [...menus].sort((a, b) =>
      (a.name || "").localeCompare(b.name || "")
    );
    if (term) {
      list = list.filter((m) => m.name?.toLowerCase().includes(term));
    }
    return list;
  }, [menus, search]);

  return (
    <div className="flex flex-col h-full min-h-0 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gray-50/80 space-y-3">
        <span className="font-semibold text-gray-800">Menu library</span>
        <Input
          allowClear
          placeholder="Search menus…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <p className="text-xs text-gray-500 m-0">
          Drag menus onto the navbar or use + to attach.
        </p>
      </div>
      <div className="flex-1 min-h-0 navigation-scroll p-2 space-y-1">
        {filtered.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No menus yet — create one under Navigation"
            className="py-8"
          />
        ) : (
          filtered.map((menu) => (
            <LibraryMenuRow
              key={menu.id}
              menu={menu}
              menuItems={menuItems}
              attachedMenuId={attachedMenuId}
              navbarSelected={navbarSelected}
              onAttach={onAttachMenu}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default MenusLibraryPanel;
