// components/PageBuilder/Modals/NavbarSelectionModal.jsx

import React, { useState, useEffect } from "react";
import { List, Button, Input, Space, Typography, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import instance from "../../../axios";
import Image from "next/image";

const { Text } = Typography;

const NavbarSelectionModal = ({ onSelectNavbar, selectedNavbar }) => {
  const [navbars, setNavbars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNavbars();
  }, []);

  const fetchNavbars = async () => {
    try {
      setLoading(true);
      const response = await instance.get("/navbars");
      setNavbars(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch navbars");
      message.error("Failed to fetch navbars");
    } finally {
      setLoading(false);
    }
  };

  const filteredNavbars = navbars.filter((navbar) =>
    navbar.title_en.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="Search navbars..."
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
          dataSource={filteredNavbars}
          renderItem={(navbar) => (
            <List.Item
              className={`p-4 border rounded-md cursor-pointer hover:bg-gray-50 ${
                selectedNavbar?.id === navbar.id
                  ? "bg-blue-50 border-blue-200"
                  : ""
              }`}
              onClick={() => onSelectNavbar(navbar)}
            >
              <div className="flex items-center gap-4 w-full">
                <div className="flex-shrink-0">
                  <Image
                    src={
                      navbar?.logo?.file_path
                        ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/${navbar.logo.file_path}`
                        : "/images/Image_Placeholder.png"
                    }
                    width={60}
                    height={50}
                    alt="Navbar Logo"
                    objectFit="cover"
                    className="rounded-md"
                  />
                </div>
                <div className="flex flex-col flex-grow">
                  <Text strong>{navbar.name}</Text>
                  <Text type="secondary">
                    {navbar.menu?.menu_items?.length || 0} menu items
                  </Text>
                </div>
              </div>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default NavbarSelectionModal;
