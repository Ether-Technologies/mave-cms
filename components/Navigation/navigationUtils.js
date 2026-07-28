/** Order root menu items by menu_item_ids; children come from all_children on each item. */
export function getOrderedMenuRoots(menu) {
  if (!menu) return [];
  const ids = menu.menu_item_ids || [];
  const items = menu.menu_items || [];
  const byId = new Map(items.map((item) => [item.id, item]));
  return ids.map((id) => byId.get(id)).filter(Boolean);
}

/** Resolve roots from ID list using the full menu item catalog (includes unsaved adds). */
export function getOrderedMenuRootsFromIds(menuItemIds, allMenuItems) {
  if (!menuItemIds?.length || !allMenuItems?.length) return [];
  const byId = new Map(allMenuItems.map((item) => [item.id, item]));
  return menuItemIds.map((id) => byId.get(id)).filter(Boolean);
}

export function menuContainsItemId(menu, itemId) {
  if (!menu?.menu_item_ids?.length) return false;
  if (menu.menu_item_ids.includes(itemId)) return true;
  const roots = getOrderedMenuRoots(menu);
  const walk = (nodes) => {
    for (const node of nodes) {
      if (node.id === itemId) return true;
      if (node.all_children?.length && walk(node.all_children)) return true;
    }
    return false;
  };
  return walk(roots);
}

export function canAddItemToMenu(item, menuItemIds) {
  if (!item) return false;
  if (menuItemIds.includes(item.id)) return false;
  if (item.parent_id == null) return true;
  return menuItemIds.includes(item.parent_id);
}

export const MENU_STRUCTURE_DROP_ID = "menu-structure-drop";
export const MENU_PREVIEW_DROP_ID = "menu-preview-drop";
export const NAVBAR_MENU_DROP_ID = "navbar-menu-drop";
export const NAVBAR_MENU_STRUCTURE_DROP_ID = "navbar-menu-structure-drop";
export const NAVBAR_ATTACHED_MENU_DRAG_ID = "navbar-attached-menu";

export function libraryMenuDragId(menuId) {
  return `library-menu-${menuId}`;
}

export function parseLibraryMenuDragId(id) {
  const str = String(id);
  if (!str.startsWith("library-menu-")) return null;
  const num = Number(str.slice("library-menu-".length));
  return Number.isFinite(num) ? num : null;
}

export function libraryDragId(itemId) {
  return `library-item-${itemId}`;
}

export function parseLibraryDragId(id) {
  const str = String(id);
  if (!str.startsWith("library-item-")) return null;
  const num = Number(str.slice("library-item-".length));
  return Number.isFinite(num) ? num : null;
}

/** Whether this library row can be dragged into the menu (top-level, not already added). */
export function canDragItemToMenu(item, menuItemIds) {
  if (!item || item.parent_id != null) return false;
  return canAddItemToMenu(item, menuItemIds);
}

/** Feedback when adding via click or drop; returns null if the add should proceed. */
export function getAddItemToMenuFeedback(item, menuItemIds) {
  if (!item) return { type: "error", text: "Invalid item" };
  if (menuItemIds.includes(item.id)) {
    return { type: "info", text: "Already in this menu" };
  }
  if (item.parent_id != null && !menuItemIds.includes(item.parent_id)) {
    return {
      type: "warning",
      text: "Add the parent item to this menu first, or use a top-level item.",
    };
  }
  if (item.parent_id != null) {
    return {
      type: "info",
      text: "Child items appear under their parent when the parent is in the menu.",
    };
  }
  return null;
}

export function flattenTreeIds(nodes) {
  const ids = [];
  const walk = (list) => {
    for (const node of list) {
      ids.push(node.id);
      if (node.all_children?.length) walk(node.all_children);
    }
  };
  walk(nodes);
  return ids;
}
