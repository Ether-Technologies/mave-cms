// components/Navbars/NavbarsList.js

import React from "react";
import { Checkbox, Badge, Empty } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import NavbarRow from "./NavbarRow";

const NavbarsList = ({
  navbars,
  menus,
  media,
  setNavbars,
  editingNavbarId,
  setEditingNavbarId,
  selectedNavbarIds,
  setSelectedNavbarIds,
  fetchNavbars,
}) => {
  const allSelected =
    selectedNavbarIds.length === navbars.length && navbars.length > 0;
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedNavbarIds(navbars?.map((item) => item.id));
    } else {
      setSelectedNavbarIds([]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Row */}
      {navbars.length > 0 && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="grid grid-cols-12 gap-4 items-center">
            <div className="col-span-1 flex items-center justify-center">
              <Checkbox
                checked={allSelected}
                onChange={handleSelectAll}
                className="transform scale-110"
              />
            </div>
            <div className="col-span-3">
              <span className="text-sm font-bold text-gray-700">Navbar Name</span>
            </div>
            <div className="col-span-2">
              <span className="text-sm font-bold text-gray-700">Logo</span>
            </div>
            <div className="col-span-3">
              <span className="text-sm font-bold text-gray-700">Menu Items</span>
            </div>
            <div className="col-span-3">
              <span className="text-sm font-bold text-gray-700">Actions</span>
            </div>
          </div>
        </div>
      )}

      {/* Navbar Rows */}
      {navbars.length > 0 ? (
        <div className="space-y-3">
          {navbars?.map((navbar, index) => (
            <NavbarRow
              key={navbar.id}
              navbar={navbar}
              menus={menus}
              media={media}
              setNavbars={setNavbars}
              editingNavbarId={editingNavbarId}
              setEditingNavbarId={setEditingNavbarId}
              selectedNavbarIds={selectedNavbarIds}
              setSelectedNavbarIds={setSelectedNavbarIds}
              fetchNavbars={fetchNavbars}
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
                  No Navbars Found
                </h3>
                <p className="text-gray-500">
                  Create your first navbar to get started
                </p>
              </div>
            }
          />
        </div>
      )}

      {/* Selection Summary */}
      {selectedNavbarIds.length > 0 && (
        <div className="fixed bottom-6 right-6 bg-black text-white px-6 py-3 rounded-xl shadow-2xl animate-in slide-in-from-bottom">
          <div className="flex items-center gap-2">
            <Badge
              count={selectedNavbarIds.length}
              className="[&_.ant-badge-count]:bg-white [&_.ant-badge-count]:text-gray-700 [&_.ant-badge-count]:font-bold"
            />
            <span className="font-semibold">
              {selectedNavbarIds.length === 1 ? 'navbar' : 'navbars'} selected
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavbarsList;
