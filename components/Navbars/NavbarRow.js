// components/Navbars/NavbarRow.js

import React, { useState } from "react";
import {
  Row,
  Col,
  Input,
  Select,
  Button,
  Popconfirm,
  message,
  Checkbox,
  Collapse,
} from "antd";
import {
  SyncOutlined,
  EditOutlined,
  DeleteOutlined,
  CloseCircleOutlined,
  FileImageFilled,
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

  return (
    <Row className="border-b py-2 items-center">
      <Col xs={2} md={1} className="pr-10">
        <Checkbox checked={isSelected} onChange={handleCheckboxChange} />
      </Col>
      <Col xs={8} md={5} className="pr-10">
        {isEditing ? (
          <>
            <Input
              value={editedNavbarTitleEn}
              onChange={(e) => setEditedNavbarTitleEn(e.target.value)}
              className="w-full mb-2"
              placeholder="Title (English)"
              allowClear
            />
            <Input
              value={editedNavbarTitleBn}
              onChange={(e) => setEditedNavbarTitleBn(e.target.value)}
              className="w-full"
              placeholder="Title (Bangla)"
              allowClear
            />
          </>
        ) : (
          <>
            <p>{navbar.title_en}</p>
            {/* <p>{navbar.title_bn}</p> */}
          </>
        )}
      </Col>
      <Col xs={8} md={4} className="pr-10">
        {isEditing ? (
          <div className="flex gap-2 items-center">
            <Image
              src={
                navbar?.logo?.file_path
                  ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/${navbar.logo.file_path}`
                  : "/images/Image_placeholder.png"
              }
              alt={
                navbar?.logo?.file_name ? navbar.logo.file_name : "Navbar Logo"
              }
              className="w-16 h-16 object-cover rounded-full"
              width={64}
              height={64}
            />
            <Button
              icon={<FileImageFilled />}
              onClick={() => setMediaModalVisible(true)}
            >
              Change Logo
            </Button>
            <MediaSelectionModal
              isVisible={mediaModalVisible}
              onClose={() => setMediaModalVisible(false)}
              selectionMode="single"
              onSelectMedia={(selectedMedia) => {
                setEditedLogoId(selectedMedia.id);
                setSelectedLogoMedia(selectedMedia); // Set selected media
                setMediaModalVisible(false);
              }}
            />
            {selectedLogoMedia && ( // Display selected media
              <div className="mt-2">
                <Image
                  src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${selectedLogoMedia.file_path}`}
                  alt={selectedLogoMedia.file_name}
                  className="w-16 h-16 object-cover rounded-full"
                  width={64}
                  height={64}
                />
              </div>
            )}
          </div>
        ) : (
          <Image
            src={
              navbar?.logo?.file_path
                ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/${navbar.logo.file_path}`
                : "/images/Image_placeholder.png"
            }
            alt={
              navbar?.logo?.file_name ? navbar.logo.file_name : "Navbar Logo"
            }
            className="w-16 h-16 object-cover rounded-full cursor-pointer"
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
        )}
      </Col>
      <Col xs={8} md={10} className="pr-10">
        {isEditing ? (
          <Select
            showSearch
            placeholder="Select a Menu"
            optionFilterProp="children"
            onChange={(value) => setEditedMenuId(value)}
            className="w-60"
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
          <Collapse
            defaultActiveKey={["0"]}
            ghost
            className="w-full"
            expandIconPosition="right"
          >
            <Collapse.Panel header={navbar.menu.name} key="1" className="w-56">
              {navbar.menu.menu_items?.map((item) => (
                <p key={item.id}>{item.title}</p>
              ))}
            </Collapse.Panel>
          </Collapse>
        )}
      </Col>
      <Col xs={24} md={4} className="flex gap-2 mt-2 md:mt-0 pr-10">
        {isEditing ? (
          <>
            <Button
              icon={<SyncOutlined />}
              onClick={handleUpdate}
              className="mavebutton"
            >
              Update
            </Button>
            <Button
              icon={<CloseCircleOutlined />}
              onClick={() => {
                setEditingNavbarId(null);
                setSelectedLogoMedia(null); // Reset selected media on cancel
              }}
              danger
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button
              icon={<EditOutlined />}
              onClick={() => setEditingNavbarId(navbar.id)}
              className="mavebutton"
            >
              Edit
            </Button>
            <Popconfirm
              title="Are you sure you want to delete this navbar?"
              onConfirm={handleDelete}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button danger icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Popconfirm>
          </>
        )}
      </Col>
    </Row>
  );
};

export default NavbarRow;
