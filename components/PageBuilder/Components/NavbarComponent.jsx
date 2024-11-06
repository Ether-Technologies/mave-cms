// components/PageBuilder/Components/NavbarComponent.jsx

import React, { useState } from "react";
import { Button, Menu, Popconfirm, Typography } from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import NavbarSelectionModal from "../Modals/NavbarSelectionModal";
import Image from "next/image";

const { Paragraph } = Typography;

const NavbarComponent = ({
  component,
  updateComponent,
  deleteComponent,
  preview = false, // New prop with default value
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [navbarData, setNavbarData] = useState(component._mave);

  const handleSelectNavbar = (selectedNavbar) => {
    updateComponent({
      ...component,
      _mave: selectedNavbar,
      id: selectedNavbar.id,
    });
    setNavbarData(selectedNavbar);
    setIsModalVisible(false);
  };

  const handleDelete = () => {
    deleteComponent();
  };

  const renderMenuItems = (menuItems) => {
    return menuItems?.map((item) => {
      if (item.all_children && item.all_children.length > 0) {
        return (
          <Menu.SubMenu key={item.id} title={item.title}>
            {renderMenuItems(item.all_children)}
          </Menu.SubMenu>
        );
      } else {
        return <Menu.Item key={item.id}>{item.title}</Menu.Item>;
      }
    });
  };

  if (preview) {
    return (
      <div className="preview-navbar-component p-4 bg-gray-100 rounded-md">
        {navbarData ? (
          <div className="p-4 border rounded-md flex bg-white justify-between">
            <Image
              src={
                navbarData?.logo?.file_path
                  ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/${navbarData.logo.file_path}`
                  : "/images/Image_Placeholder.png"
              }
              width={60}
              height={50}
              alt="Navbar Logo"
              objectFit="cover"
              className="rounded-md"
            />
            <Menu mode="horizontal" className="flex-grow ml-5%">
              {renderMenuItems(navbarData?.menu?.menu_items)}
            </Menu>
          </div>
        ) : (
          <p className="text-gray-500">No navbar selected.</p>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-xl font-semibold">Navbar Component</h3>
        <div>
          {navbarData && (
            <Button
              icon={<ExportOutlined />}
              onClick={() => setIsModalVisible(true)}
              className="mavebutton"
            >
              Change
            </Button>
          )}
          <Popconfirm
            title="Are you sure you want to delete this component?"
            onConfirm={handleDelete}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} className="mavecancelbutton" />
          </Popconfirm>
        </div>
      </div>
      {navbarData ? (
        <div className="p-4 border rounded-md">
          <Paragraph strong className="text-theme">
            Name: {navbarData.menu?.name}
          </Paragraph>
          <div className="navbar-preview flex items-center">
            <Image
              src={
                navbarData?.logo?.file_path
                  ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/${navbarData.logo.file_path}`
                  : "/images/Image_Placeholder.png"
              }
              width={60}
              height={50}
              alt="Navbar Logo"
              objectFit="cover"
              className="rounded-lg"
            />
            <Menu mode="horizontal" className="flex-grow">
              {renderMenuItems(navbarData?.menu?.menu_items)}
            </Menu>
          </div>
        </div>
      ) : (
        <Button
          icon={<PlusOutlined />}
          type="dashed"
          onClick={() => setIsModalVisible(true)}
          className="w-full border-theme font-bold"
        >
          Add Navbar
        </Button>
      )}
      <NavbarSelectionModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSelectNavbar={handleSelectNavbar}
      />
    </div>
  );
};

export default NavbarComponent;
