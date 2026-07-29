import React from "react";
import { Checkbox, Badge, Empty } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import MenuItemRow from "./MenuItemRow";

const MenuItemsList = ({
  menuItems,
  pages,
  allMenuItems,
  setMenuItems,
  editingItemId,
  setEditingItemId,
  selectedItemIds,
  setSelectedItemIds,
}) => {
  const allSelected =
    selectedItemIds.length === menuItems.length && menuItems.length > 0;

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItemIds(menuItems.map((item) => item.id));
    } else {
      setSelectedItemIds([]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Row */}
      {menuItems.length > 0 && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-1 flex items-center justify-center">
              <Checkbox
                checked={allSelected}
                onChange={handleSelectAll}
                className="transform scale-110"
              />
            </div>
            <div className="col-span-2">
              <span className="text-sm font-bold text-gray-700">Item Name</span>
            </div>
            <div className="col-span-2">
              <span className="text-sm font-bold text-gray-700">আইটেম নাম</span>
            </div>
            <div className="col-span-2">
              <span className="text-sm font-bold text-gray-700">Parent Menu</span>
            </div>
            <div className="col-span-2">
              <span className="text-sm font-bold text-gray-700">Item Link</span>
            </div>
            <div className="col-span-3">
              <span className="text-sm font-bold text-gray-700">Actions</span>
            </div>
          </div>
        </div>
      )}

      {/* Menu Item Rows */}
      {menuItems.length > 0 ? (
        <div className="space-y-3">
          {menuItems.map((menuItem, index) => (
            <MenuItemRow
              key={menuItem.id}
              menuItem={menuItem}
              menuItems={menuItems}
              allMenuItems={allMenuItems}
              pages={pages}
              setMenuItems={setMenuItems}
              editingItemId={editingItemId}
              setEditingItemId={setEditingItemId}
              selectedItemIds={selectedItemIds}
              setSelectedItemIds={setSelectedItemIds}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-md border-2 border-gray-200 p-12">
          <Empty
            image={<InboxOutlined className="text-6xl text-gray-300" />}
            description={
              <div className="mt-4">
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No Menu Items Found
                </h3>
                <p className="text-gray-500">
                  Create your first menu item to get started
                </p>
              </div>
            }
          />
        </div>
      )}

      {/* Selection Summary */}
      {selectedItemIds.length > 0 && (
        <div className="fixed bottom-6 right-6 bg-gradient-to-r from-brand to-brand-dark text-white px-6 py-3 rounded-xl shadow-2xl animate-in slide-in-from-bottom">
          <div className="flex items-center gap-2">
            <Badge
              count={selectedItemIds.length}
              className="[&_.ant-badge-count]:bg-white [&_.ant-badge-count]:text-brand-dark [&_.ant-badge-count]:font-bold"
            />
            <span className="font-semibold">
              {selectedItemIds.length === 1 ? "item" : "items"} selected
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuItemsList;
