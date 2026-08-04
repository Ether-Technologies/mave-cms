// components/PageBuilder/Modals/MenuSelectionModal.jsx

import React, { useState, useEffect } from "react";
import {
  List,
  Button,
  Input,
  Typography,
  message,
  Modal,
  Space,
  Tooltip,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import instance from "../../../axios";
import AddMenuForm from "../../Menus/AddMenuForm";

const { Text } = Typography;

const MenuSelectionModal = ({ onSelectMenu, selectedMenu }) => {
  const [menus, setMenus] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [error, setError] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    fetchMenus();
    fetchMenuItems();
  }, []);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const response = await instance.get("/menus");
      setMenus(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError("Failed to fetch menus");
      message.error("Failed to fetch menus");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchMenuItems = async () => {
    try {
      const response = await instance.get("/menuitems");
      setMenuItems(response.data || []);
    } catch (err) {
      message.error("Failed to fetch menu items");
    }
  };

  const handleMenuCreated = async (createdMenu) => {
    setIsFormVisible(false);
    const freshMenus = await fetchMenus();
    const fullMenu =
      freshMenus.find((menu) => menu.id === createdMenu.id) || createdMenu;
    onSelectMenu(fullMenu);
    message.success("Menu created. Configure settings and save.");
  };

  const handleReload = async () => {
    await fetchMenus();
    message.success("Menus refreshed");
  };

  const filteredMenus = menus.filter((menu) =>
    menu.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <Tooltip title="Reload menus">
          <Button
            icon={<ReloadOutlined spin={loading} />}
            onClick={handleReload}
            disabled={loading}
            className="mavebutton"
          />
        </Tooltip>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Input
            placeholder="Search menus..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            className="w-full md:w-64"
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsFormVisible(true)}
            className="mavebutton whitespace-nowrap"
          >
            Create Menu
          </Button>
        </div>
      </div>

      {error ? (
        <Text type="danger">{error}</Text>
      ) : (
        <List
          loading={loading}
          dataSource={filteredMenus}
          renderItem={(menu) => (
            <List.Item
              className={`p-4 border rounded-md cursor-pointer my-4 hover:bg-gray-50 ${
                selectedMenu?.id === menu.id
                  ? "bg-blue-50 border-blue-200"
                  : ""
              }`}
              onClick={() => onSelectMenu(menu)}
            >
              <div className="flex flex-col w-full gap-2 px-6">
                <Text strong>{menu.name}</Text>
                {menu.menu_items?.map((item) => (
                  <Text key={item.id}>{item.title}</Text>
                ))}
              </div>
            </List.Item>
          )}
          locale={{
            emptyText: (
              <div className="text-center py-8">
                <Text type="secondary">No menus found.</Text>
                <div className="mt-4">
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsFormVisible(true)}
                    className="mavebutton"
                  >
                    Create New Menu
                  </Button>
                </div>
              </div>
            ),
          }}
        />
      )}

      <Modal
        open={isFormVisible}
        onCancel={() => setIsFormVisible(false)}
        destroyOnClose
        footer={null}
        title="Create Menu"
        width={900}
        zIndex={1100}
      >
        <AddMenuForm
          menuItems={menuItems}
          onCancel={() => setIsFormVisible(false)}
          fetchMenus={fetchMenus}
          onMenuCreated={handleMenuCreated}
        />
      </Modal>
    </div>
  );
};

export default MenuSelectionModal;
