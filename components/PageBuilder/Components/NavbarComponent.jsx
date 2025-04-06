// components/PageBuilder/Components/NavbarComponent.jsx

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
  Select,
  message,
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  ExportOutlined,
  CopyFilled,
  DragOutlined,
  EditOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
  SettingOutlined,
  MenuOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import NavbarSelectionModal from "../Modals/NavbarSelectionModal";
import Image from "next/image";

const { Text } = Typography;
const { Option } = Select;

const NavbarComponent = ({
  component,
  updateComponent,
  deleteComponent,
  preview = false,
  onDuplicateElement,
}) => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [navbarData, setNavbarData] = useState(component._mave);
  const [menuMode, setMenuMode] = useState(component.menuMode || "horizontal");
  const [menuTheme, setMenuTheme] = useState(component.menuTheme || "light");
  const [logoSize, setLogoSize] = useState(component.logoSize || "medium");
  const [selectedNavbar, setSelectedNavbar] = useState(null);
  const [showConfig, setShowConfig] = useState(false);

  const handleSelectNavbar = (selectedNavbar) => {
    setSelectedNavbar(selectedNavbar);
    setShowConfig(true);
  };

  const handleSaveConfig = () => {
    if (!selectedNavbar) {
      message.error("Please select a navbar first.");
      return;
    }
    updateComponent({
      ...component,
      _mave: selectedNavbar,
      id: selectedNavbar.id,
      menuMode,
      menuTheme,
      logoSize,
    });
    setNavbarData(selectedNavbar);
    setIsDrawerVisible(false);
    setShowConfig(false);
    setSelectedNavbar(null);
    message.success("Navbar updated successfully.");
  };

  const handleDelete = () => {
    deleteComponent();
  };

  const getLogoSize = () => {
    switch (navbarData?.logoSize || logoSize) {
      case "small":
        return { width: 40, height: 30 };
      case "medium":
        return { width: 60, height: 50 };
      case "large":
        return { width: 80, height: 70 };
      default:
        return { width: 60, height: 50 };
    }
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
      <div className="preview-navbar-component p-4 bg-gray-100 rounded-md">
        {navbarData ? (
          <div className="p-4 border rounded-md flex bg-white justify-between items-center">
            <Image
              src={
                navbarData?.logo?.file_path
                  ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/${navbarData.logo.file_path}`
                  : "/images/Image_Placeholder.png"
              }
              {...getLogoSize()}
              alt="Navbar Logo"
              objectFit="cover"
              className="rounded-md"
            />
            <Menu
              mode={navbarData.menuMode || menuMode}
              theme={navbarData.menuTheme || menuTheme}
              className="flex-grow ml-5"
              style={{ border: "none" }}
            >
              {renderMenuItems(navbarData?.menu?.menu_items)}
            </Menu>
          </div>
        ) : (
          <Text type="secondary">No navbar selected.</Text>
        )}
      </div>
    );
  }

  return (
    <div className="border p-4 rounded-md bg-white">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <DragOutlined className="text-2xl border rounded-md p-1" />
          <h3 className="text-xl font-semibold">Navbar Component</h3>
        </div>
        <div className="flex items-center gap-2">
          <Space>
            {navbarData && (
              <Tooltip title="Change Navbar">
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
        {navbarData ? (
          <div className="w-full">
            <div className="p-4 border rounded-md flex bg-white justify-between items-center">
              <Image
                src={
                  navbarData?.logo?.file_path
                    ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/${navbarData.logo.file_path}`
                    : "/images/Image_Placeholder.png"
                }
                {...getLogoSize()}
                alt="Navbar Logo"
                objectFit="cover"
                className="rounded-md"
              />
              <Menu
                mode={navbarData.menuMode || menuMode}
                theme={navbarData.menuTheme || menuTheme}
                className="flex-grow ml-5"
                style={{ border: "none" }}
              >
                {renderMenuItems(navbarData?.menu?.menu_items)}
              </Menu>
            </div>
          </div>
        ) : (
          <Button
            icon={<EditOutlined />}
            onClick={() => setIsDrawerVisible(true)}
            className="mavebutton"
          >
            Choose Navbar
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
            {showConfig ? "Navbar Configuration" : "Select Navbar"}
          </div>
        }
        placement="right"
        width={showConfig ? 700 : 900}
        onClose={() => {
          setIsDrawerVisible(false);
          setShowConfig(false);
          setSelectedNavbar(null);
        }}
        open={isDrawerVisible}
        extra={
          showConfig && (
            <Space>
              <Button
                onClick={() => {
                  setIsDrawerVisible(false);
                  setShowConfig(false);
                  setSelectedNavbar(null);
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
          <NavbarSelectionModal
            onSelectNavbar={handleSelectNavbar}
            selectedNavbar={selectedNavbar}
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
            <div className="flex flex-col gap-2">
              <Text strong>Logo Size</Text>
              <Select
                value={logoSize}
                onChange={setLogoSize}
                style={{ width: "100%" }}
              >
                <Option value="small">Small</Option>
                <Option value="medium">Medium</Option>
                <Option value="large">Large</Option>
              </Select>
            </div>
            <div className="border rounded-md p-4">
              <Text strong>Preview</Text>
              <div className="flex items-center gap-4 mt-2">
                <Image
                  src={
                    selectedNavbar?.logo?.file_path
                      ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/${selectedNavbar.logo.file_path}`
                      : "/images/Image_Placeholder.png"
                  }
                  {...getLogoSize()}
                  alt="Navbar Logo"
                  objectFit="cover"
                  className="rounded-md"
                />
                <Menu
                  mode={menuMode}
                  theme={menuTheme}
                  className="flex-grow"
                  style={{ border: "none" }}
                >
                  {renderMenuItems(selectedNavbar?.menu?.menu_items)}
                </Menu>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default NavbarComponent;
