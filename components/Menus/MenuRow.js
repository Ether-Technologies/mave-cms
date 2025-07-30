// components/Menus/MenuRow.js

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
} from "@ant-design/icons";
import instance from "../../axios";

const MenuRow = ({
  menu,
  menuItems,
  setMenus,
  editingMenuId,
  setEditingMenuId,
  selectedMenuIds,
  setSelectedMenuIds,
}) => {
  const [editedMenuName, setEditedMenuName] = useState(menu.name);
  const [editedMenuItemsIds, setEditedMenuItemsIds] = useState(
    menu.menu_items?.map((item) => item.id) || []
  );

  const handleUpdate = async () => {
    try {
      const updatedMenu = {
        name: editedMenuName,
        menu_item_ids: editedMenuItemsIds,
      };
      const response = await instance.put(`/menus/${menu.id}`, updatedMenu);
      if (response.status === 200) {
        message.success("Menu updated successfully");
        setMenus((prevMenus) =>
          prevMenus?.map((item) =>
            item.id === menu.id ? { ...item, ...updatedMenu } : item
          )
        );
        setEditingMenuId(null);
      } else {
        message.error("Error updating menu");
      }
    } catch (error) {
      message.error("Error updating menu");
    }
  };

  const handleDelete = async () => {
    try {
      const response = await instance.delete(`/menus/${menu.id}`);
      if (response.status === 200) {
        message.success("Menu deleted successfully");
        setMenus((prevMenus) =>
          prevMenus.filter((item) => item.id !== menu.id)
        );
      } else {
        message.error("Error deleting menu");
      }
    } catch (error) {
      message.error("Error deleting menu");
    }
  };

  const isEditing = editingMenuId === menu.id;

  const handleCheckboxChange = (e) => {
    const checked = e.target.checked;
    if (checked) {
      setSelectedMenuIds([...selectedMenuIds, menu.id]);
    } else {
      setSelectedMenuIds(selectedMenuIds.filter((id) => id !== menu.id));
    }
  };

  const isSelected = selectedMenuIds.includes(menu.id);

  return (
    <Row className="border-b py-2 items-center">
      <Col xs={2} md={1}>
        <Checkbox checked={isSelected} onChange={handleCheckboxChange} />
      </Col>
      <Col xs={2} md={2}>
        <p>{menu.id}</p>
      </Col>
      <Col xs={8} md={5}>
        {isEditing ? (
          <Input
            value={editedMenuName}
            onChange={(e) => setEditedMenuName(e.target.value)}
            className="w-11/12"
          />
        ) : (
          <p>{menu.name}</p>
        )}
      </Col>
      <Col xs={8} md={10}>
        {isEditing ? (
          <Select
            allowClear
            showSearch
            mode="multiple"
            placeholder="Select menu items"
            value={editedMenuItemsIds}
            onChange={(values) => setEditedMenuItemsIds(values)}
            className="w-11/12"
            optionFilterProp="children"
          >
            {menuItems?.map((menuItem) => (
              <Select.Option key={menuItem.id} value={menuItem.id}>
                {menuItem.title}
              </Select.Option>
            ))}
          </Select>
        ) : (
          <Collapse
            ghost
            expandIconPosition="right"
            className="w-56"
            defaultActiveKey={["0"]}
          >
            <Collapse.Panel header="Show" key="1">
              {menu.menu_items?.map((menuItem) => (
                <p key={menuItem.id}>{menuItem.title}</p>
              ))}
            </Collapse.Panel>
          </Collapse>
        )}
      </Col>
      <Col xs={24} md={6} className="flex gap-2 mt-2 md:mt-0">
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
              onClick={() => setEditingMenuId(null)}
              className="mavecancelbutton"
            >
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button
              icon={<EditOutlined />}
              onClick={() => setEditingMenuId(menu.id)}
              className="mavebutton"
            >
              Edit
            </Button>
            <Popconfirm
              title="Are you sure you want to delete this menu?"
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

export default MenuRow;
