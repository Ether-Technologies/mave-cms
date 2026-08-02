// components/Navbars/NavbarRow.js

import React, { useState, useEffect } from "react";
import {
  Input,
  Select,
  Button,
  Popconfirm,
  message,
  Checkbox,
  Tag,
  Tooltip,
  Badge,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CloseCircleOutlined,
  FileImageFilled,
  MenuOutlined,
  CheckCircleOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import instance from "../../axios";
import Image from "next/image";
import MediaSelectionModal from "../PageBuilder/Modals/MediaSelectionModal";
import SortableMenuItemsPicker from "../Menus/SortableMenuItemsPicker";

const NavbarRow = ({
  navbar,
  menus,
  media,
  setNavbars,
  editingNavbarId,
  setEditingNavbarId,
  selectedNavbarIds,
  setSelectedNavbarIds,
  fetchNavbars,
  index,
}) => {
  const [editedNavbarTitleEn, setEditedNavbarTitleEn] = useState(
    navbar.title_en
  );
  const [editedNavbarTitleBn, setEditedNavbarTitleBn] = useState(
    navbar.title_bn
  );
  const [editedLogoId, setEditedLogoId] = useState(navbar?.logo?.id || null);
  const [editedMenuId, setEditedMenuId] = useState(navbar?.menu?.id || null);
  const [editedMenuItemIds, setEditedMenuItemIds] = useState(
    navbar.menu?.menu_items?.map((item) => item.id) || []
  );
  const [menuItems, setMenuItems] = useState([]);
  const [mediaModalVisible, setMediaModalVisible] = useState(false);
  const [selectedLogoMedia, setSelectedLogoMedia] = useState(null);

  useEffect(() => {
    if (editingNavbarId === navbar.id) {
      setEditedNavbarTitleEn(navbar.title_en);
      setEditedNavbarTitleBn(navbar.title_bn);
      setEditedLogoId(navbar?.logo?.id || null);
      setEditedMenuId(navbar?.menu?.id || null);
      setEditedMenuItemIds(
        navbar.menu?.menu_items?.map((item) => item.id) || []
      );
    }
  }, [editingNavbarId, navbar]);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await instance("/menuitems");
        if (response.data) {
          setMenuItems(response.data);
        }
      } catch (error) {
        // silently fail — picker will show empty
      }
    };
    if (editingNavbarId === navbar.id) {
      fetchMenuItems();
    }
  }, [editingNavbarId, navbar.id]);

  useEffect(() => {
    if (!editedMenuId) {
      setEditedMenuItemIds([]);
      return;
    }
    const selectedMenu = menus.find((m) => m.id === editedMenuId);
    if (selectedMenu?.menu_items?.length) {
      setEditedMenuItemIds(selectedMenu.menu_items.map((item) => item.id));
    } else if (selectedMenu?.menu_item_ids) {
      setEditedMenuItemIds(selectedMenu.menu_item_ids);
    } else {
      setEditedMenuItemIds([]);
    }
    // Only reset item order when the assigned menu changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editedMenuId]);

  const handleUpdate = async () => {
    try {
      const updatedNavbar = {
        title_en: editedNavbarTitleEn,
        title_bn: editedNavbarTitleBn,
        logo_id: editedLogoId,
        menu_id: editedMenuId,
      };
      const response = await instance.put(
        `/navbars/${navbar.id}`,
        updatedNavbar
      );
      if (response.status === 200) {
        if (editedMenuId && editedMenuItemIds.length >= 0) {
          await instance.put(`/menus/${editedMenuId}`, {
            menu_item_ids: editedMenuItemIds,
          });
        }
        message.success("Navbar updated successfully");
        setNavbars((prevNavbars) =>
          prevNavbars?.map((item) =>
            item.id === navbar.id ? { ...item, ...updatedNavbar } : item
          )
        );
        setEditingNavbarId(null);
        setSelectedLogoMedia(null);
        fetchNavbars();
      } else {
        message.error("Error updating navbar");
      }
    } catch (error) {
      message.error("Error updating navbar");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await instance.delete(`/navbars/${navbar.id}`);
      if (response.status === 200) {
        message.success("Navbar deleted successfully");
        setNavbars((prevNavbars) =>
          prevNavbars.filter((item) => item.id !== navbar.id)
        );
      } else {
        message.error("Error deleting navbar");
      }
    } catch (error) {
      message.error("Error deleting navbar");
    }
  };

  const isEditing = editingNavbarId === navbar.id;

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    if (checked) {
      setSelectedNavbarIds([...selectedNavbarIds, navbar.id]);
    } else {
      setSelectedNavbarIds(selectedNavbarIds.filter((id) => id !== navbar.id));
    }
  };

  const isSelected = selectedNavbarIds.includes(navbar.id);
  const idBadgeStyle = {
    backgroundColor: "#f0f0f0",
    color: "#666",
    fontSize: "12px",
    fontWeight: "500",
  };
  const menuItemsCount = navbar.menu?.menu_items?.length || 0;
  const [showAllItems, setShowAllItems] = useState(false);
  const displayedItems = showAllItems
    ? navbar.menu?.menu_items
    : navbar.menu?.menu_items?.slice(0, 3);

  return (
    <div
      className={`
        bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-md border-2 
        transition-all duration-300 hover:shadow-xl
        ${isSelected ? 'border-brand ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'}
        ${isEditing ? 'ring-2 ring-blue-200 border-blue-300' : ''}
      `}
    >
      <div className="p-4">
        <div className={`grid grid-cols-12 gap-4 ${isEditing ? "items-start" : "items-center"}`}>
          {/* Checkbox */}
          <div className="col-span-1 flex items-center justify-center">
            <Checkbox
              checked={isSelected}
              onChange={handleCheckboxChange}
              className="transform scale-110"
            />
          </div>

          {/* Navbar Name */}
          <div className="col-span-3">
            {isEditing ? (
              <div className="space-y-2">
                <Badge count={`ID-${navbar.id}`} style={idBadgeStyle} />
                <Input
                  value={editedNavbarTitleEn}
                  onChange={(e) => setEditedNavbarTitleEn(e.target.value)}
                  className="w-full h-10 border-2 border-gray-200 rounded-lg hover:border-blue-300 focus:border-brand transition-all"
                  placeholder="Title (English)"
                  prefix={<MenuOutlined className="text-gray-400" />}
                  allowClear
                />
                <Input
                  value={editedNavbarTitleBn}
                  onChange={(e) => setEditedNavbarTitleBn(e.target.value)}
                  className="w-full h-10 border-2 border-gray-200 rounded-lg hover:border-blue-300 focus:border-brand transition-all"
                  placeholder="শিরোনাম (বাংলা)"
                  prefix={<GlobalOutlined className="text-gray-400" />}
                  allowClear
                />
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                <Badge count={`ID-${navbar.id}`} style={idBadgeStyle} />
                <MenuOutlined className="text-brand" />
                <span className="font-semibold text-gray-800 truncate">
                  {navbar.title_en}
                </span>
              </div>
            )}
          </div>

          {/* Logo */}
          <div className="col-span-2">
            {isEditing ? (
              <div className="space-y-2">
                <div className="relative group">
                  <Image
                    src={
                      selectedLogoMedia?.file_path
                        ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/${selectedLogoMedia.file_path}`
                        : navbar?.logo?.file_path
                          ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/${navbar.logo.file_path}`
                          : "/images/Image_placeholder.png"
                    }
                    alt={
                      selectedLogoMedia?.file_name ||
                      navbar?.logo?.file_name ||
                      "Navbar Logo"
                    }
                    className="w-16 h-16 object-contain rounded-xl border-2 border-gray-200 shadow-sm"
                    width={64}
                    height={64}
                  />
                </div>
                <Button
                  icon={<FileImageFilled />}
                  onClick={() => setMediaModalVisible(true)}
                  className="w-full h-9 text-xs bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 border-2 border-gray-200 hover:border-blue-300 rounded-lg transition-all"
                  size="small"
                >
                  Change
                </Button>
                <MediaSelectionModal
                  isVisible={mediaModalVisible}
                  onClose={() => setMediaModalVisible(false)}
                  selectionMode="single"
                  onSelectMedia={(selectedMedia) => {
                    setEditedLogoId(selectedMedia.id);
                    setSelectedLogoMedia(selectedMedia);
                    setMediaModalVisible(false);
                  }}
                />
              </div>
            ) : (
              <Tooltip title="Click to view full size">
                <Image
                  src={
                    navbar?.logo?.file_path
                      ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/${navbar.logo.file_path}`
                      : "/images/Image_placeholder.png"
                  }
                  alt={
                    navbar?.logo?.file_name ? navbar.logo.file_name : "Navbar Logo"
                  }
                  className="w-16 h-16 object-contain rounded-xl cursor-pointer hover:scale-110 transition-transform border-2 border-gray-200 hover:border-blue-300 shadow-sm hover:shadow-md"
                  width={64}
                  height={64}
                  onClick={() =>
                    navbar?.logo?.file_path
                      ? window.open(
                        `${process.env.NEXT_PUBLIC_MEDIA_URL}/${navbar.logo.file_path}`
                      )
                      : message.warning("No logo found")
                  }
                />
              </Tooltip>
            )}
          </div>

          {/* Menu Items */}
          <div className={isEditing ? "hidden" : "col-span-3"}>
            {!isEditing && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200 text-purple-700 font-semibold px-3 py-1 rounded-full">
                    {navbar?.menu?.name || "No Menu Assigned"}
                  </Tag>
                  <Badge
                    count={menuItemsCount}
                    className="[&_.ant-badge-count]:bg-brand [&_.ant-badge-count]:text-white [&_.ant-badge-count]:text-xs"
                    showZero
                  />
                </div>
                {menuItemsCount > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {displayedItems?.map((item) => (
                      <Tag
                        key={item.id}
                        className="bg-gradient-to-r from-blue-50 to-blue-50 border-blue-200 text-gray-700 font-medium px-2 py-0.5 rounded-full text-xs"
                      >
                        {item.title}
                      </Tag>
                    ))}
                    {menuItemsCount > 3 && !showAllItems && (
                      <Button
                        type="link"
                        size="small"
                        onClick={() => setShowAllItems(true)}
                        className="text-brand-dark hover:text-blue-700 font-medium text-xs px-1 h-auto"
                      >
                        +{menuItemsCount - 3} more
                      </Button>
                    )}
                    {showAllItems && menuItemsCount > 3 && (
                      <Button
                        type="link"
                        size="small"
                        onClick={() => setShowAllItems(false)}
                        className="text-brand-dark hover:text-blue-700 font-medium text-xs px-1 h-auto"
                      >
                        Show less
                      </Button>
                    )}
                  </div>
                ) : (
                  <span className="text-xs text-gray-400 italic">No items</span>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className={`${isEditing ? "col-span-3" : "col-span-3"} flex gap-2 justify-end`}>
            {isEditing ? (
              <>
                <Tooltip title="Save changes">
                  <Button
                    icon={<CheckCircleOutlined />}
                    onClick={handleUpdate}
                    className="h-10 px-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-0 font-semibold shadow-md hover:shadow-lg transition-all rounded-lg"
                  >
                    Update
                  </Button>
                </Tooltip>
                <Tooltip title="Cancel editing">
                  <Button
                    icon={<CloseCircleOutlined />}
                    onClick={() => {
                      setEditingNavbarId(null);
                      setSelectedLogoMedia(null);
                    }}
                    className="h-10 px-4 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white border-0 font-semibold shadow-md hover:shadow-lg transition-all rounded-lg"
                  >
                    Cancel
                  </Button>
                </Tooltip>
              </>
            ) : (
              <>
                <Tooltip title="Edit navbar">
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => setEditingNavbarId(navbar.id)}
                    className="h-10 px-4 bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-blue-600 text-white border-0 font-semibold shadow-md hover:shadow-lg transition-all rounded-lg"
                  >
                    Edit
                  </Button>
                </Tooltip>
                <Popconfirm
                  title="Delete Navbar"
                  description="Are you sure you want to delete this navbar?"
                  onConfirm={handleDelete}
                  okText="Yes, Delete"
                  cancelText="Cancel"
                  okButtonProps={{
                    danger: true,
                    className: "bg-red-500 hover:bg-red-600 border-red-500",
                  }}
                >
                  <Tooltip title="Delete navbar">
                    <Button
                      icon={<DeleteOutlined />}
                      className="h-10 px-4 bg-red-500 hover:bg-red-600 text-white border-0 font-semibold shadow-md hover:shadow-lg transition-all rounded-lg"
                    >
                      Delete
                    </Button>
                  </Tooltip>
                </Popconfirm>
              </>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Assigned Menu
              </label>
              <Select
                showSearch
                placeholder="Select a Menu"
                optionFilterProp="children"
                value={editedMenuId}
                onChange={(value) => setEditedMenuId(value)}
                className="w-full max-w-md [&_.ant-select-selector]:h-10 [&_.ant-select-selector]:border-2 [&_.ant-select-selector]:border-gray-200 [&_.ant-select-selector]:rounded-lg hover:[&_.ant-select-selector]:border-blue-300"
                allowClear
              >
                {menus?.map((menu) => (
                  <Select.Option key={menu.id} value={menu.id}>
                    {menu.name}
                  </Select.Option>
                ))}
              </Select>
            </div>

            {editedMenuId && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Menu Items — select and drag to order
                </label>
                <SortableMenuItemsPicker
                  menuItems={menuItems}
                  value={editedMenuItemIds}
                  onChange={setEditedMenuItemIds}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NavbarRow;
