// components/Menus/MenusList.js

import React from "react";
import { Checkbox, Badge, Empty } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import MenuRow from "./MenuRow";

const MenusList = ({
  menus,
  menuItems,
  setMenus,
  editingMenuId,
  setEditingMenuId,
  selectedMenuIds,
  setSelectedMenuIds,
}) => {
  const allSelected =
    selectedMenuIds.length === menus.length && menus.length > 0;
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedMenuIds(menus?.map((item) => item.id));
    } else {
      setSelectedMenuIds([]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Row */}
      {menus.length > 0 && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-1 flex items-center justify-center">
              <Checkbox
                checked={allSelected}
                onChange={handleSelectAll}
                className="transform scale-110"
              />
            </div>
            <div className="col-span-4">
              <span className="text-sm font-bold text-gray-700">Menu Name</span>
            </div>
            <div className="col-span-4">
              <span className="text-sm font-bold text-gray-700">Menu Items</span>
            </div>
            <div className="col-span-3">
              <span className="text-sm font-bold text-gray-700">Actions</span>
            </div>
          </div>
        </div>
      )}

      {/* Menu Rows */}
      {menus.length > 0 ? (
        <div className="space-y-3">
          {menus?.map((menu, index) => (
            <MenuRow
              key={menu.id}
              menu={menu}
              menuItems={menuItems}
              setMenus={setMenus}
              editingMenuId={editingMenuId}
              setEditingMenuId={setEditingMenuId}
              selectedMenuIds={selectedMenuIds}
              setSelectedMenuIds={setSelectedMenuIds}
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
                  No Menus Found
                </h3>
                <p className="text-gray-500">
                  Create your first menu to get started
                </p>
              </div>
            }
          />
        </div>
      )}

      {/* Selection Summary */}
      {selectedMenuIds.length > 0 && (
        <div className="fixed bottom-6 right-6 bg-gradient-to-r from-yellow-500 to-amber-500 text-white px-6 py-3 rounded-xl shadow-2xl animate-in slide-in-from-bottom">
          <div className="flex items-center gap-2">
            <Badge
              count={selectedMenuIds.length}
              className="[&_.ant-badge-count]:bg-white [&_.ant-badge-count]:text-yellow-600 [&_.ant-badge-count]:font-bold"
            />
            <span className="font-semibold">
              {selectedMenuIds.length === 1 ? 'menu' : 'menus'} selected
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenusList;
