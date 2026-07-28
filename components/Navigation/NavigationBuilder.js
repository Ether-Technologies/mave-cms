import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Modal, Input, message } from "antd";
import instance from "../../axios";
import Loader from "../Loader";
import MenusSidebar from "./MenusSidebar";
import MenuStructurePanel from "./MenuStructurePanel";
import MenuLibraryPanel from "./MenuLibraryPanel";
import NavigationMenuDnd from "./NavigationMenuDnd";
import AddMenuItemForm from "../MenuItems/AddMenuItemForm";
import { getOrderedMenuRootsFromIds } from "./navigationUtils";

const NavigationBuilder = ({
  menus,
  setMenus,
  menuItems,
  pages,
  fetchMenus,
  fetchMenuItems,
  loading,
  createMenuOpen,
  setCreateMenuOpen,
  initialMenuId,
}) => {
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const [menuSearch, setMenuSearch] = useState("");
  const [draftItemIds, setDraftItemIds] = useState([]);
  const [saving, setSaving] = useState(false);
  const [newMenuName, setNewMenuName] = useState("");
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);

  const selectedMenu = useMemo(
    () => menus.find((m) => m.id === selectedMenuId) || null,
    [menus, selectedMenuId]
  );

  useEffect(() => {
    if (initialMenuId && menus.some((m) => m.id === Number(initialMenuId))) {
      setSelectedMenuId(Number(initialMenuId));
      return;
    }
    if (!selectedMenuId && menus.length > 0) {
      setSelectedMenuId(menus[0].id);
    }
  }, [menus, selectedMenuId, initialMenuId]);

  useEffect(() => {
    setDraftItemIds(selectedMenu?.menu_item_ids ? [...selectedMenu.menu_item_ids] : []);
  }, [selectedMenu?.id, selectedMenu?.menu_item_ids]);

  const roots = useMemo(
    () => getOrderedMenuRootsFromIds(draftItemIds, menuItems),
    [draftItemIds, menuItems]
  );

  const dirty = useMemo(() => {
    const saved = selectedMenu?.menu_item_ids || [];
    if (saved.length !== draftItemIds.length) return true;
    return saved.some((id, i) => id !== draftItemIds[i]);
  }, [selectedMenu, draftItemIds]);

  const handleCreateMenu = async () => {
    const name = newMenuName.trim();
    if (!name) {
      message.error("Enter a menu name");
      return;
    }
    try {
      const res = await instance.post("/menus", {
        name,
        menu_item_ids: [],
      });
      if (res.status === 201) {
        message.success("Menu created");
        setCreateMenuOpen(false);
        setNewMenuName("");
        await fetchMenus();
        if (res.data?.id) setSelectedMenuId(res.data.id);
      }
    } catch {
      message.error("Could not create menu");
    }
  };

  const handleDeleteMenu = async (id) => {
    try {
      await instance.delete(`/menus/${id}`);
      message.success("Menu deleted");
      if (selectedMenuId === id) setSelectedMenuId(null);
      fetchMenus();
    } catch {
      message.error("Could not delete menu");
    }
  };

  const handleRenameMenu = async (menu, name) => {
    try {
      await instance.put(`/menus/${menu.id}`, {
        name,
        menu_item_ids: menu.menu_item_ids || [],
      });
      setMenus((prev) =>
        prev.map((m) => (m.id === menu.id ? { ...m, name } : m))
      );
      message.success("Menu renamed");
    } catch {
      message.error("Could not rename menu");
    }
  };

  const handleSaveMenu = useCallback(async () => {
    if (!selectedMenu) return;
    setSaving(true);
    try {
      const res = await instance.put(`/menus/${selectedMenu.id}`, {
        name: selectedMenu.name,
        menu_item_ids: draftItemIds,
      });
      const updated = res.data;
      setMenus((prev) =>
        prev.map((m) => (m.id === selectedMenu.id ? { ...m, ...updated } : m))
      );
      await fetchMenus();
    } catch (err) {
      throw err;
    } finally {
      setSaving(false);
    }
  }, [selectedMenu, draftItemIds, setMenus, fetchMenus]);

  const handleAddToMenu = (itemId) => {
    setDraftItemIds((prev) => [...prev, itemId]);
  };

  if (loading && menus.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <NavigationMenuDnd
        builderMode="menus"
        menuItemIds={draftItemIds}
        onMenuItemIdsChange={setDraftItemIds}
        allMenuItems={menuItems}
        menuSelected={!!selectedMenu}
        navbarSelected={false}
        allMenus={menus}
      >
        <div className="navigation-workspace grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4">
          <div className="lg:col-span-3">
            <MenusSidebar
              menus={menus}
              selectedMenuId={selectedMenuId}
              onSelectMenu={setSelectedMenuId}
              onDeleteMenu={handleDeleteMenu}
              onRenameMenu={handleRenameMenu}
              searchTerm={menuSearch}
              setSearchTerm={setMenuSearch}
            />
          </div>
          <div className="lg:col-span-5">
            <MenuStructurePanel
              menu={selectedMenu}
              roots={roots}
              menuItemIds={draftItemIds}
              onMenuItemIdsChange={setDraftItemIds}
              onSave={handleSaveMenu}
              saving={saving}
              dirty={dirty}
            />
          </div>
          <div className="lg:col-span-4">
            <MenuLibraryPanel
              allMenuItems={menuItems}
              menuItemIds={draftItemIds}
              onAddToMenu={handleAddToMenu}
              onCreateItem={() => setIsAddItemOpen(true)}
            />
          </div>
        </div>
      </NavigationMenuDnd>

      <Modal
        open={createMenuOpen}
        onCancel={() => setCreateMenuOpen(false)}
        onOk={handleCreateMenu}
        okText="Create"
        title="New menu"
      >
        <Input
          placeholder="e.g. Primary navigation, Footer"
          value={newMenuName}
          onChange={(e) => setNewMenuName(e.target.value)}
          onPressEnter={handleCreateMenu}
        />
      </Modal>

      <Modal
        open={isAddItemOpen}
        onCancel={() => setIsAddItemOpen(false)}
        footer={null}
        title="New menu item"
        width={800}
      >
        <AddMenuItemForm
          pages={pages}
          menuItems={menuItems}
          onCancel={() => setIsAddItemOpen(false)}
          fetchMenuItems={async () => {
            await fetchMenuItems();
            setIsAddItemOpen(false);
          }}
        />
      </Modal>
    </>
  );
};

export default NavigationBuilder;
