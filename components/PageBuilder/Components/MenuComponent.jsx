// components/PageBuilder/Components/MenuComponent.jsx

import React, { useState } from "react";
import { Button, Menu, Modal, Popconfirm } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ArrowRightOutlined,
  CodepenCircleOutlined,
  DragOutlined,
  CheckCircleOutlined,
  ExportOutlined,
  CopyFilled,
} from "@ant-design/icons";
import MenuSelectionModal from "../Modals/MenuSelectionModal";

const MenuComponent = ({
  component,
  updateComponent,
  deleteComponent,
  preview = false,
  onDuplicateElement,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [menuData, setMenuData] = useState(component._mave);

  const handleSelectMenu = (selectedMenu) => {
    updateComponent({ ...component, _mave: selectedMenu, id: selectedMenu.id });
    setMenuData(selectedMenu);
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
      <div className="preview-menu-component p-4 bg-gray-100 rounded-md">
        {menuData ? (
          <Menu mode="horizontal" className="flex-grow">
            {renderMenuItems(menuData?.menu_items)}
          </Menu>
        ) : (
          <p className="text-gray-500">No menu selected.</p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white p-4 rounded-md">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <DragOutlined className="text-2xl border rounded-md p-1" />
          <h3 className="text-xl font-semibold">Menu Component</h3>
        </div>
        <div>
          {menuData && (
            <Button
              icon={<ExportOutlined />}
              onClick={() => setIsModalVisible(true)}
              className="mavebutton"
            >
              Change
            </Button>
          )}
          <Button
            icon={<CopyFilled />}
            onClick={onDuplicateElement}
            className="mavebutton"
          />
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
      {menuData ? (
        <div className="flex flex-col gap-6 p-4 rounded-md">
          <h2 className="text-xl font-semibold text-theme">{menuData.name}</h2>
          <Menu mode="horizontal" className="flex-grow">
            {renderMenuItems(menuData?.menu_items)}
          </Menu>
        </div>
      ) : (
        <Button
          icon={<CheckCircleOutlined />}
          onClick={() => setIsModalVisible(true)}
          className="mavebutton"
        >
          Choose
        </Button>
      )}

      <MenuSelectionModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSelectMenu={handleSelectMenu}
      />
    </div>
  );
};

export default MenuComponent;
