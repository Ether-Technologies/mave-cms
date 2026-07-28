import React, { useMemo } from "react";
import {
  Button,
  Empty,
  Input,
  Menu,
  message,
} from "antd";
import {
  FileImageOutlined,
  SaveOutlined,
  EditOutlined,
  HolderOutlined,
} from "@ant-design/icons";
import { useDndContext, useDroppable, useDraggable } from "@dnd-kit/core";
import Image from "next/image";
import {
  NAVBAR_MENU_DROP_ID,
  NAVBAR_MENU_STRUCTURE_DROP_ID,
  NAVBAR_ATTACHED_MENU_DRAG_ID,
  getOrderedMenuRootsFromIds,
  parseLibraryMenuDragId,
} from "./navigationUtils";

function NavbarPreviewDropZone({ logoUrl, roots, hasMenu, attachedMenuName }) {
  const { active } = useDndContext();
  const { setNodeRef, isOver } = useDroppable({ id: NAVBAR_MENU_DROP_ID });

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    isDragging,
  } = useDraggable({
    id: NAVBAR_ATTACHED_MENU_DRAG_ID,
    disabled: !hasMenu,
    data: { type: "navbar-attached-menu" },
  });

  const isMenuLibraryDrag =
    active != null && parseLibraryMenuDragId(active.id) != null;
  const isAttachedMenuDrag = active?.id === NAVBAR_ATTACHED_MENU_DRAG_ID;

  let overClass = "bg-gray-50";
  if (isOver && isAttachedMenuDrag) {
    overClass = "bg-red-50/80 ring-2 ring-inset ring-red-200";
  } else if (isOver && isMenuLibraryDrag) {
    overClass = "bg-blue-50/80 ring-2 ring-inset ring-blue-200";
  } else if (isOver) {
    overClass = "bg-gray-100 ring-2 ring-inset ring-gray-200";
  }

  const previewItems = hasMenu && roots?.length ? (
    <Menu
      mode="horizontal"
      selectable={false}
      style={{ border: "none", flex: 1, pointerEvents: "none" }}
    >
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
    <span className="text-xs text-gray-400 italic pointer-events-none">
      Drop a menu from the library to attach
    </span>
  );

  return (
    <div
      ref={setNodeRef}
      className={`relative px-4 py-3 border-b border-gray-100 navigation-scroll-x shrink-0 transition-colors min-h-[88px] ${overClass}`}
    >
      <p className="text-xs font-medium text-gray-500 mb-2 pointer-events-none">
        Preview
        {hasMenu && (
          <span className="font-normal text-gray-400 ml-1">
            · drag handle to remove menu
          </span>
        )}
      </p>
      <div className="flex items-center gap-4 min-w-0 pb-1">
        {hasMenu && (
          <button
            type="button"
            ref={setDragRef}
            className={`shrink-0 text-gray-400 hover:text-gray-600 touch-none cursor-grab active:cursor-grabbing p-1 rounded border border-transparent hover:border-gray-200 ${
              isDragging ? "opacity-40" : ""
            }`}
            {...attributes}
            {...listeners}
            aria-label="Drag to remove menu from navbar"
          >
            <HolderOutlined />
          </button>
        )}
        <Image
          src={logoUrl}
          alt="Logo"
          width={48}
          height={40}
          className="rounded object-contain shrink-0 pointer-events-none"
        />
        <div className="flex items-center min-w-0 flex-1 pointer-events-none">
          {previewItems}
        </div>
        {hasMenu && attachedMenuName && (
          <span className="text-xs text-gray-500 shrink-0 pointer-events-none hidden sm:inline">
            {attachedMenuName}
          </span>
        )}
      </div>
    </div>
  );
}

const NavbarStructurePanel = ({
  navbar,
  draftTitleEn,
  draftTitleBn,
  onDraftTitleEnChange,
  onDraftTitleBnChange,
  draftMenuId,
  draftLogoId,
  logoPreviewUrl,
  menus,
  menuItems,
  onPickLogo,
  onSave,
  saving,
  dirty,
  onEditMenu,
}) => {
  const attachedMenu = useMemo(
    () => menus.find((m) => m.id === draftMenuId) || null,
    [menus, draftMenuId]
  );

  const roots = useMemo(() => {
    if (!attachedMenu) return [];
    return getOrderedMenuRootsFromIds(
      attachedMenu.menu_item_ids || [],
      menuItems
    );
  }, [attachedMenu, menuItems]);

  if (!navbar) {
    return (
      <div className="flex flex-col h-full min-h-0 bg-white rounded-xl border border-gray-200 items-center justify-center p-8">
        <Empty description="Select or create a navbar to start building" />
      </div>
    );
  }

  const handleSave = async () => {
    if (!draftMenuId) {
      message.warning("Attach a menu — drag one from the library");
      return;
    }
    if (!draftLogoId) {
      message.warning("Select a logo for this navbar");
      return;
    }
    try {
      await onSave();
      message.success("Navbar saved");
    } catch {
      message.error("Could not save navbar");
    }
  };

  const logoUrl =
    logoPreviewUrl ||
    (navbar.logo?.file_path
      ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/${navbar.logo.file_path}`
      : "/images/Image_Placeholder.png");

  return (
    <div className="flex flex-col h-full min-h-0 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold text-lg text-gray-900">
            {draftTitleEn || navbar.title_en}
          </h3>
          <p className="text-xs text-gray-500">
            Drag from the library to attach (+), or drop on preview / below.
            Drag the preview handle here to remove the menu.
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
          Save navbar
        </Button>
      </div>

      <div className="p-4 border-b border-gray-100 space-y-3 shrink-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            placeholder="Title (English)"
            value={draftTitleEn}
            onChange={(e) => onDraftTitleEnChange(e.target.value)}
          />
          <Input
            placeholder="Title (alternate)"
            value={draftTitleBn}
            onChange={(e) => onDraftTitleBnChange(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Image
            src={logoUrl}
            alt="Logo"
            width={56}
            height={48}
            className="rounded border border-gray-200 object-contain"
          />
          <Button icon={<FileImageOutlined />} onClick={onPickLogo}>
            {draftLogoId ? "Change logo" : "Select logo"}
          </Button>
          {attachedMenu ? (
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => onEditMenu(attachedMenu.id)}
            >
              Edit “{attachedMenu.name}” items
            </Button>
          ) : null}
        </div>
        {attachedMenu && (
          <p className="text-sm text-gray-600 m-0">
            Attached menu:{" "}
            <span className="font-medium">{attachedMenu.name}</span> (
            {(attachedMenu.menu_item_ids || []).length} top-level items)
          </p>
        )}
      </div>

      <NavbarPreviewDropZone
        logoUrl={logoUrl}
        roots={roots}
        hasMenu={!!draftMenuId}
        attachedMenuName={attachedMenu?.name}
      />

      <NavbarMenuStructureDropZone
        draftMenuId={draftMenuId}
        roots={roots}
        attachedMenu={attachedMenu}
      />
    </div>
  );
};

function NavbarMenuStructureDropZone({ draftMenuId, roots, attachedMenu }) {
  const { active } = useDndContext();
  const { setNodeRef, isOver } = useDroppable({
    id: NAVBAR_MENU_STRUCTURE_DROP_ID,
  });

  const isMenuLibraryDrag =
    active != null && parseLibraryMenuDragId(active.id) != null;
  const isAttachedMenuDrag = active?.id === NAVBAR_ATTACHED_MENU_DRAG_ID;

  let zoneClass = "";
  if (isOver && isAttachedMenuDrag) {
    zoneClass = "bg-red-50/60 ring-2 ring-inset ring-red-200";
  } else if (isOver && isMenuLibraryDrag) {
    zoneClass = "bg-blue-50/60 ring-2 ring-inset ring-blue-200";
  }

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-h-0 navigation-scroll p-4 transition-colors ${zoneClass}`}
    >
      {!draftMenuId ? (
        <Empty
          description="Drop a menu here or add from the library →"
          className="py-12"
        />
      ) : roots.length === 0 ? (
        <Empty
          description={`“${attachedMenu?.name}” has no items yet — edit under Navigation`}
          className="py-12"
        />
      ) : (
        <ul className="space-y-2 text-sm text-gray-700">
          {roots.map((item) => (
            <li key={item.id} className="font-medium">
              {item.title}
              {item.all_children?.length > 0 && (
                <ul className="ml-4 mt-1 text-gray-500 font-normal">
                  {item.all_children.map((c) => (
                    <li key={c.id}>{c.title}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default NavbarStructurePanel;
