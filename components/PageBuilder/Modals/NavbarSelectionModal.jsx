// components/PageBuilder/Modals/NavbarSelectionModal.jsx

import React, { useState, useEffect } from "react";
import {
  List,
  Button,
  Input,
  Typography,
  message,
  Modal,
  Tooltip,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import instance from "../../../axios";
import Image from "next/image";
import AddNavbarForm from "../../Navbars/AddNavbarForm";

const { Text } = Typography;

const NavbarSelectionModal = ({ onSelectNavbar, selectedNavbar }) => {
  const [navbars, setNavbars] = useState([]);
  const [menus, setMenus] = useState([]);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [error, setError] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    fetchNavbars();
    fetchMenus();
    fetchMedia();
  }, []);

  const fetchNavbars = async () => {
    try {
      setLoading(true);
      const response = await instance.get("/navbars");
      setNavbars(response.data);
      setError(null);
      return response.data;
    } catch (err) {
      setError("Failed to fetch navbars");
      message.error("Failed to fetch navbars");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const fetchMenus = async () => {
    try {
      const response = await instance.get("/menus");
      setMenus(response.data || []);
    } catch (err) {
      message.error("Failed to fetch menus");
    }
  };

  const fetchMedia = async () => {
    try {
      const response = await instance.get("/media");
      setMedia(response.data || []);
    } catch (err) {
      message.error("Failed to fetch media");
    }
  };

  const handleNavbarCreated = async (createdNavbar) => {
    setIsFormVisible(false);
    const freshNavbars = await fetchNavbars();
    const fullNavbar =
      freshNavbars.find((navbar) => navbar.id === createdNavbar.id) ||
      createdNavbar;
    onSelectNavbar(fullNavbar);
    message.success("Navbar created. Configure settings and save.");
  };

  const handleReload = async () => {
    await fetchNavbars();
    message.success("Navbars refreshed");
  };

  const filteredNavbars = navbars.filter((navbar) =>
    (navbar.title_en || navbar.name || "")
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <Tooltip title="Reload navbars">
          <Button
            icon={<ReloadOutlined spin={loading} />}
            onClick={handleReload}
            disabled={loading}
            className="mavebutton"
          />
        </Tooltip>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Input
            placeholder="Search navbars..."
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
            Create Navbar
          </Button>
        </div>
      </div>

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
                  <Text strong>{navbar.name || navbar.title_en}</Text>
                  <Text type="secondary">
                    {navbar.menu?.menu_items?.length || 0} menu items
                  </Text>
                </div>
              </div>
            </List.Item>
          )}
          locale={{
            emptyText: (
              <div className="text-center py-8">
                <Text type="secondary">No navbars found.</Text>
                <div className="mt-4">
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsFormVisible(true)}
                    className="mavebutton"
                  >
                    Create New Navbar
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
        title="Create Navbar"
        width={900}
        zIndex={1100}
      >
        <AddNavbarForm
          menus={menus}
          media={media}
          fetchMenus={fetchMenus}
          fetchNavbars={fetchNavbars}
          onCancel={() => setIsFormVisible(false)}
          onNavbarCreated={handleNavbarCreated}
        />
      </Modal>
    </div>
  );
};

export default NavbarSelectionModal;
