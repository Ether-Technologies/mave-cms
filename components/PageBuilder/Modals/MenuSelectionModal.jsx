// components/PageBuilder/Modals/MenuSelectionModal.jsx

import React, { useState, useEffect } from "react";
import { List, Button, Input, Space, Typography, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import instance from "../../../axios";

const { Text } = Typography;

const MenuSelectionModal = ({ onSelectMenu, selectedMenu }) => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      setLoading(true);
      const response = await instance.get("/menus");
      setMenus(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch menus");
      message.error("Failed to fetch menus");
    } finally {
      setLoading(false);
    }
  };

  const filteredMenus = menus.filter((menu) =>
    menu.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="Search menus..."
        prefix={<SearchOutlined />}
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        allowClear
      />
      {error ? (
        <Text type="danger">{error}</Text>
      ) : (
        <List
          loading={loading}
          dataSource={filteredMenus}
          renderItem={(menu) => (
            <List.Item
              className={`p-4 border rounded-md cursor-pointer my-4 hover:bg-gray-50 ${
                selectedMenu?.id === menu.id ? "bg-blue-50 border-blue-200" : ""
              }`}
              onClick={() => onSelectMenu(menu)}
            >
              <div className="flex flex-col w-full gap-2 px-6">
                <Text strong>{menu.name}</Text>
                {/* <Text type="secondary">
                  {menu.menu_items?.length || 0} items
                </Text> */}
                {/* Render menu items */}
                {menu.menu_items?.map((item) => (
                  <Text key={item.id}>{item.title}</Text>
                ))}
              </div>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default MenuSelectionModal;
