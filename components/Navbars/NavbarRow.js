// components/Navbars/NavbarRow.js

import React, { useState } from "react";
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
  SyncOutlined,
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
  const [editedMenuId, setEditedMenuId] = useState(navbar.menu.id || null);
  const [mediaModalVisible, setMediaModalVisible] = useState(false);
  const [selectedLogoMedia, setSelectedLogoMedia] = useState(null); // New state

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
        message.success("Navbar updated successfully");
        setNavbars((prevNavbars) =>
          prevNavbars?.map((item) =>
            item.id === navbar.id ? { ...item, ...updatedNavbar } : item
          )
        );
        setEditingNavbarId(null);
        setSelectedLogoMedia(null); // Reset selected logo media
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
        ${isSelected ? 'border-yellow-400 ring-2 ring-yellow-200' : 'border-gray-200 hover:border-gray-300'}
        ${isEditing ? 'ring-2 ring-blue-200 border-blue-300' : ''}
      `}
    >
      <div className="p-4">
        <div className="grid grid-cols-12 gap-4 items-center">
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
                <Input
                  value={editedNavbarTitleEn}
                  onChange={(e) => setEditedNavbarTitleEn(e.target.value)}
                  className="w-full h-10 border-2 border-gray-200 rounded-lg hover:border-yellow-300 focus:border-yellow-400 transition-all"
                  placeholder="Title (English)"
                  prefix={<MenuOutlined className="text-gray-400" />}
                  allowClear
                />
                <Input
                  value={editedNavbarTitleBn}
                  onChange={(e) => setEditedNavbarTitleBn(e.target.value)}
                  className="w-full h-10 border-2 border-gray-200 rounded-lg hover:border-yellow-300 focus:border-yellow-400 transition-all"
                  placeholder="শিরোনাম (বাংলা)"
                  prefix={<GlobalOutlined className="text-gray-400" />}
                  allowClear
                />
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <MenuOutlined className="text-yellow-500" />
                  <span className="font-semibold text-gray-800 truncate">
                    {navbar.title_en}
                  </span>
                </div>
                {navbar.title_bn && (
                  <div className="flex items-center gap-2 ml-5">
                    <GlobalOutlined className="text-blue-500 text-xs" />
                    <span className="text-sm text-gray-600 truncate">
                      {navbar.title_bn}
                    </span>
                  </div>
                )}
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
                  className="w-full h-9 text-xs bg-gradient-to-r from-white to-gray-50 hover:from-gray-50 hover:to-gray-100 border-2 border-gray-200 hover:border-yellow-300 rounded-lg transition-all"
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
                  className="w-16 h-16 object-contain rounded-xl cursor-pointer hover:scale-110 transition-transform border-2 border-gray-200 hover:border-yellow-300 shadow-sm hover:shadow-md"
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
          <div className="col-span-3">
            {isEditing ? (
              <Select
                showSearch
                placeholder="Select a Menu"
                optionFilterProp="children"
                onChange={(value) => setEditedMenuId(value)}
                className="w-full [&_.ant-select-selector]:h-10 [&_.ant-select-selector]:border-2 [&_.ant-select-selector]:border-gray-200 [&_.ant-select-selector]:rounded-lg hover:[&_.ant-select-selector]:border-yellow-300"
                allowClear
                defaultValue={navbar.menu.id}
              >
                {menus?.map((menu) => (
                  <Select.Option key={menu.id} value={menu.id}>
                    {menu.name}
                  </Select.Option>
                ))}
              </Select>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Tag className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200 text-purple-700 font-semibold px-3 py-1 rounded-full">
                    {navbar.menu.name}
                  </Tag>
                  <Badge
                    count={menuItemsCount}
                    className="[&_.ant-badge-count]:bg-yellow-500 [&_.ant-badge-count]:text-white [&_.ant-badge-count]:text-xs"
                    showZero
                  />
                </div>
                {menuItemsCount > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {displayedItems?.map((item) => (
                      <Tag
                        key={item.id}
                        className="bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200 text-gray-700 font-medium px-2 py-0.5 rounded-full text-xs"
                      >
                        {item.title}
                      </Tag>
                    ))}
                    {menuItemsCount > 3 && !showAllItems && (
                      <Button
                        type="link"
                        size="small"
                        onClick={() => setShowAllItems(true)}
                        className="text-yellow-600 hover:text-yellow-700 font-medium text-xs px-1 h-auto"
                      >
                        +{menuItemsCount - 3} more
                      </Button>
                    )}
                    {showAllItems && menuItemsCount > 3 && (
                      <Button
                        type="link"
                        size="small"
                        onClick={() => setShowAllItems(false)}
                        className="text-yellow-600 hover:text-yellow-700 font-medium text-xs px-1 h-auto"
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
          <div className="col-span-3 flex gap-2 justify-end">
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
                    className="h-10 px-4 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white border-0 font-semibold shadow-md hover:shadow-lg transition-all rounded-lg"
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
      </div>
    </div>
  );
};

export default NavbarRow;
