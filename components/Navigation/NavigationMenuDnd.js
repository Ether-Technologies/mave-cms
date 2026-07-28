import React, { useCallback, useState } from "react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  pointerWithin,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { message } from "antd";
import { HolderOutlined } from "@ant-design/icons";
import {
  MENU_STRUCTURE_DROP_ID,
  MENU_PREVIEW_DROP_ID,
  NAVBAR_MENU_DROP_ID,
  NAVBAR_MENU_STRUCTURE_DROP_ID,
  NAVBAR_ATTACHED_MENU_DRAG_ID,
  getAddItemToMenuFeedback,
  parseLibraryDragId,
  parseLibraryMenuDragId,
} from "./navigationUtils";

const NavigationMenuDnd = ({
  builderMode = "menus",
  menuItemIds,
  onMenuItemIdsChange,
  allMenuItems,
  menuSelected,
  navbarSelected,
  onDraftMenuIdChange,
  allMenus,
  children,
}) => {
  const [activeDrag, setActiveDrag] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = useCallback((event) => {
    const { active } = event;
    if (active.id === NAVBAR_ATTACHED_MENU_DRAG_ID) {
      setActiveDrag({ kind: "navbar-attached-menu" });
      return;
    }
    const libraryMenuId = parseLibraryMenuDragId(active.id);
    if (libraryMenuId != null) {
      const menu = allMenus?.find((m) => m.id === libraryMenuId);
      if (menu) setActiveDrag({ kind: "library-menu", menu });
      return;
    }
    const libraryItemId = parseLibraryDragId(active.id);
    if (libraryItemId != null) {
      const item = allMenuItems.find((m) => m.id === libraryItemId);
      if (item) setActiveDrag({ kind: "library", item });
      return;
    }
    if (menuItemIds.includes(active.id)) {
      const item = allMenuItems.find((m) => m.id === active.id);
      if (item) setActiveDrag({ kind: "menu", item });
    }
  }, [allMenuItems, allMenus, menuItemIds]);

  const handleDragEnd = useCallback(
    (event) => {
      setActiveDrag(null);
      const { active, over } = event;
      if (!over) return;

      if (active.id === NAVBAR_ATTACHED_MENU_DRAG_ID) {
        if (builderMode !== "navbars" || !navbarSelected) return;
        const overId = over.id;
        if (
          overId === NAVBAR_MENU_DROP_ID ||
          overId === NAVBAR_MENU_STRUCTURE_DROP_ID
        ) {
          onDraftMenuIdChange?.(null);
          message.success("Menu removed from navbar");
        }
        return;
      }

      const libraryMenuId = parseLibraryMenuDragId(active.id);
      if (libraryMenuId != null) {
        if (builderMode !== "navbars") return;
        if (!navbarSelected) {
          message.warning("Select a navbar first");
          return;
        }
        if (
          over.id !== NAVBAR_MENU_DROP_ID &&
          over.id !== NAVBAR_MENU_STRUCTURE_DROP_ID
        ) {
          return;
        }
        const menu = allMenus?.find((m) => m.id === libraryMenuId);
        if (!menu) return;
        onDraftMenuIdChange?.(libraryMenuId);
        message.success(`Attached menu “${menu.name}”`);
        return;
      }

      if (builderMode !== "menus") return;

      const libraryItemId = parseLibraryDragId(active.id);
      if (libraryItemId != null) {
        if (!menuSelected) {
          message.warning("Select a menu first");
          return;
        }
        const item = allMenuItems.find((m) => m.id === libraryItemId);
        const feedback = getAddItemToMenuFeedback(item, menuItemIds);
        if (feedback) {
          message[feedback.type](feedback.text);
          return;
        }
        const overId = over.id;
        const isMenuTarget =
          overId === MENU_STRUCTURE_DROP_ID ||
          overId === MENU_PREVIEW_DROP_ID ||
          menuItemIds.includes(overId);
        if (!isMenuTarget) return;

        let insertIndex = menuItemIds.length;
        if (menuItemIds.includes(overId)) {
          insertIndex = menuItemIds.indexOf(overId);
        }

        if (menuItemIds.includes(libraryItemId)) return;

        const next = [...menuItemIds];
        next.splice(insertIndex, 0, libraryItemId);
        onMenuItemIdsChange(next);
        message.success(`Added “${item.title}”`);
        return;
      }

      if (menuItemIds.includes(active.id)) {
        const overId = over.id;
        if (overId === MENU_PREVIEW_DROP_ID) {
          const item = allMenuItems.find((m) => m.id === active.id);
          onMenuItemIdsChange(menuItemIds.filter((id) => id !== active.id));
          if (item) message.success(`Removed “${item.title}” from menu`);
          return;
        }
        if (active.id === over.id) return;
        const oldIndex = menuItemIds.indexOf(active.id);
        const newIndex = menuItemIds.indexOf(over.id);
        if (oldIndex === -1 || newIndex === -1) return;
        onMenuItemIdsChange(arrayMove(menuItemIds, oldIndex, newIndex));
        return;
      }
    },
    [allMenuItems, allMenus, builderMode, menuItemIds, menuSelected, navbarSelected, onDraftMenuIdChange, onMenuItemIdsChange]
  );

  const handleDragCancel = useCallback(() => setActiveDrag(null), []);

  const collisionDetection = useCallback(
    (args) => {
      if (builderMode === "navbars") {
        const pointerHits = pointerWithin(args);
        if (pointerHits.length > 0) return pointerHits;
        const rectHits = rectIntersection(args);
        if (rectHits.length > 0) return rectHits;
      }
      return closestCenter(args);
    },
    [builderMode]
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {children}
      <DragOverlay dropAnimation={null}>
        {activeDrag?.item ? (
          <div className="flex items-center gap-2 p-2.5 rounded-lg border border-gray-300 bg-white shadow-lg max-w-xs">
            <HolderOutlined className="text-gray-400" />
            <span className="font-medium text-sm truncate">{activeDrag.item.title}</span>
          </div>
        ) : activeDrag?.menu ? (
          <div className="flex items-center gap-2 p-2.5 rounded-lg border border-gray-300 bg-white shadow-lg max-w-xs">
            <HolderOutlined className="text-gray-400" />
            <span className="font-medium text-sm truncate">{activeDrag.menu.name}</span>
          </div>
        ) : activeDrag?.kind === "navbar-attached-menu" ? (
          <div className="flex items-center gap-2 p-2.5 rounded-lg border border-gray-300 bg-white shadow-lg max-w-xs">
            <HolderOutlined className="text-gray-400" />
            <span className="font-medium text-sm truncate">Attached menu</span>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default NavigationMenuDnd;
