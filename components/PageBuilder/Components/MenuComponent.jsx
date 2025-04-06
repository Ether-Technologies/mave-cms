// components/PageBuilder/Components/MenuComponent.jsx

import React, { useState } from "react";
import {
  Button,
  Menu,
  Popconfirm,
  Space,
  Tooltip,
  Typography,
  Drawer,
  Radio,
  message,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ArrowRightOutlined,
  DragOutlined,
  CheckCircleOutlined,
  ExportOutlined,
  CopyFilled,
  SettingOutlined,
  MenuOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import MenuSelectionModal from "../Modals/MenuSelectionModal";

const { Text } = Typography;

const MenuComponent = ({
  component,
  updateComponent,
  deleteComponent,
  preview = false,
  onDuplicateElement,
}) => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [menuData, setMenuData] = useState(component._mave);
  const [menuMode, setMenuMode] = useState(component.menuMode || "horizontal");
  const [menuTheme, setMenuTheme] = useState(component.menuTheme || "light");
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [showConfig, setShowConfig] = useState(false);

  const handleSelectMenu = (selectedMenu) => {
    setSelectedMenu(selectedMenu);
    setShowConfig(true);
  };

  const handleSaveConfig = () => {
    if (!selectedMenu) {
      message.error("Please select a menu first.");
      return;
    }
    updateComponent({
      ...component,
      _mave: selectedMenu,
      id: selectedMenu.id,
      menuMode,
      menuTheme,
    });
    setMenuData(selectedMenu);
    setIsDrawerVisible(false);
    setShowConfig(false);
    setSelectedMenu(null);
    message.success("Menu updated successfully.");
  };

  const handleDelete = () => {
    deleteComponent();
  };

  const renderMenuItems = (menuItems) => {
    return menuItems?.map((item) => {
      if (item.all_children && item.all_children.length > 0) {
        return (
          <Menu.SubMenu
            key={item.id}
            title={
              <span className="flex items-center gap-2">
                {item.icon && <span className="text-lg">{item.icon}</span>}
                {item.title}
              </span>
            }
          >
            {renderMenuItems(item.all_children)}
          </Menu.SubMenu>
        );
      } else {
        return (
          <Menu.Item key={item.id}>
            <span className="flex items-center gap-2">
              {item.icon && <span className="text-lg">{item.icon}</span>}
              {item.title}
            </span>
          </Menu.Item>
        );
      }
    });
  };

  if (preview) {
    return (
      <div className="preview-menu-component p-4 bg-gray-100 rounded-md">
        {menuData ? (
          <Menu
            mode={menuData.menuMode || menuMode}
            theme={menuData.menuTheme || menuTheme}
            className="flex-grow"
            style={{ border: "none" }}
          >
            {renderMenuItems(menuData?.menu_items)}
          </Menu>
        ) : (
          <Text type="secondary">No menu selected.</Text>
        )}
      </div>
    );
  }

  return (
    <div className="border p-4 rounded-md bg-white">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <DragOutlined className="text-2xl border rounded-md p-1" />
          <h3 className="text-xl font-semibold">Menu Component</h3>
        </div>
        <div className="flex items-center gap-2">
          <Space>
            {menuData && (
              <Tooltip title="Change Menu">
                <Button
                  icon={<EditOutlined />}
                  onClick={() => setIsDrawerVisible(true)}
                  className="mavebutton"
                />
              </Tooltip>
            )}
            <Tooltip title="Duplicate">
              <Button
                icon={<CopyFilled />}
                onClick={onDuplicateElement}
                className="mavebutton"
              />
            </Tooltip>
            <Popconfirm
              title="Are you sure you want to delete this component?"
              onConfirm={handleDelete}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip title="Delete">
                <Button
                  icon={<DeleteOutlined />}
                  className="mavecancelbutton"
                />
              </Tooltip>
            </Popconfirm>
          </Space>
        </div>
      </div>

      <div className="flex flex-col items-center">
        {menuData ? (
          <div className="w-full">
            <Menu
              mode={menuData.menuMode || menuMode}
              theme={menuData.menuTheme || menuTheme}
              className="w-full"
              style={{ border: "none" }}
            >
              {renderMenuItems(menuData?.menu_items)}
            </Menu>
          </div>
        ) : (
          <Button
            icon={<EditOutlined />}
            onClick={() => setIsDrawerVisible(true)}
            className="mavebutton"
          >
            Choose Menu
          </Button>
        )}
      </div>

      <Drawer
        title={
          <div className="flex items-center gap-2">
            {showConfig && (
              <Button
                icon={<ArrowLeftOutlined />}
                type="text"
                onClick={() => setShowConfig(false)}
              />
            )}
            {showConfig ? "Menu Configuration" : "Select Menu"}
          </div>
        }
        placement="right"
        width={showConfig ? 700 : 900}
        onClose={() => {
          setIsDrawerVisible(false);
          setShowConfig(false);
          setSelectedMenu(null);
        }}
        open={isDrawerVisible}
        extra={
          showConfig && (
            <Space>
              <Button
                onClick={() => {
                  setIsDrawerVisible(false);
                  setShowConfig(false);
                  setSelectedMenu(null);
                }}
              >
                Cancel
              </Button>
              <Button type="primary" onClick={handleSaveConfig}>
                Save
              </Button>
            </Space>
          )
        }
      >
        {!showConfig ? (
          <MenuSelectionModal
            onSelectMenu={handleSelectMenu}
            selectedMenu={selectedMenu}
          />
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Text strong>Menu Mode</Text>
              <Radio.Group
                value={menuMode}
                onChange={(e) => setMenuMode(e.target.value)}
                buttonStyle="solid"
              >
                <Radio.Button value="horizontal">Horizontal</Radio.Button>
                <Radio.Button value="vertical">Vertical</Radio.Button>
              </Radio.Group>
            </div>
            <div className="flex flex-col gap-2">
              <Text strong>Menu Theme</Text>
              <Radio.Group
                value={menuTheme}
                onChange={(e) => setMenuTheme(e.target.value)}
                buttonStyle="solid"
              >
                <Radio.Button value="light">Light</Radio.Button>
                <Radio.Button value="dark">Dark</Radio.Button>
              </Radio.Group>
            </div>
            <div className="border rounded-md p-4">
              <Text strong>Preview</Text>
              <Menu
                mode={menuMode}
                theme={menuTheme}
                className="mt-2"
                style={{ border: "none" }}
              >
                {renderMenuItems(selectedMenu?.menu_items)}
              </Menu>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default MenuComponent;
