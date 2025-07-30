// components/PageBuilder/Components/IconListComponent/IconListItem.jsx

import React, { useState } from "react";
import { Input, Button, Popconfirm, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import IconListSelectionModal from "../../Modals/IconListSelectionModal/IconListSelectionModal";

const IconListItem = ({ item, iconSize, iconColor, onUpdate, onDelete }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [text, setText] = useState(item.text || "");
  const [icon, setIcon] = useState(item.icon || null);

  const handleSelectIcon = (selectedIcon) => {
    setIcon(selectedIcon);
    onUpdate({ ...item, icon: selectedIcon, text });
    setIsModalVisible(false);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    onUpdate({ ...item, icon, text: e.target.value });
  };

  const handleEditIcon = () => {
    setIsModalVisible(true);
  };

  return (
    <div className="flex items-center gap-4 p-2 border rounded-md bg-white shadow-sm">
      {/* Icon Display */}
      {icon ? (
        <Tooltip title="Click to change icon">
          <div onClick={handleEditIcon} className="cursor-pointer">
            {/* Updated Rendering */}
            <i
              className={icon}
              style={{ fontSize: iconSize, color: iconColor }}
            ></i>
          </div>
        </Tooltip>
      ) : (
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={handleEditIcon}
          size="large"
        />
      )}

      {/* Text Input */}
      <Input
        value={text}
        onChange={handleTextChange}
        placeholder="Enter text"
        className="flex-grow"
      />

      {/* Delete Button */}
      <Popconfirm
        title="Are you sure you want to delete this item?"
        onConfirm={onDelete}
        okText="Yes"
        cancelText="No"
        okButtonProps={{ danger: true }}
      >
        <Button type="text" danger icon={<DeleteOutlined />} />
      </Popconfirm>

      {/* Icon Selection Modal */}
      <IconListSelectionModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSelectIcon={handleSelectIcon}
      />
    </div>
  );
};

export default IconListItem;
