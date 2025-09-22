// components/PageBuilder/Components/IconListComponent/IconListItem.jsx

import React, { useState } from "react";
import { Input, Button, Popconfirm, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import IconListSelectionModal from "../../Modals/IconListSelectionModal/IconListSelectionModal";

const IconListItem = ({
  item,
  iconSize,
  iconColor,
  onUpdate,
  onDelete,
  showAltContent = false,
  preview = false,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [text, setText] = useState(item.text || "");
  const [altText, setAltText] = useState(item.altText || "");
  const [icon, setIcon] = useState(item.icon || null);

  const handleSelectIcon = (selectedIcon) => {
    setIcon(selectedIcon);
    onUpdate({ ...item, icon: selectedIcon, text, altText });
    setIsModalVisible(false);
  };

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setText(newText);
    onUpdate({ ...item, icon, text: newText, altText });
  };

  const handleAltTextChange = (e) => {
    const newAltText = e.target.value;
    setAltText(newAltText);
    onUpdate({ ...item, icon, text, altText: newAltText });
  };

  const handleEditIcon = () => {
    console.log("Icon edit clicked, opening modal");
    setIsModalVisible(true);
  };

  return (
    <div className="flex items-center gap-3 p-3 border rounded-md bg-white shadow-sm">
      {/* Icon Display */}
      <div className="flex-shrink-0">
        {icon ? (
          <Tooltip title="Click to change icon">
            <div
              onClick={!preview ? handleEditIcon : undefined}
              className={`${!preview ? "cursor-pointer hover:opacity-70" : "cursor-default"} transition-opacity`}
            >
              <i
                className={icon}
                style={{ fontSize: iconSize, color: iconColor }}
              ></i>
            </div>
          </Tooltip>
        ) : (
          !preview && (
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={handleEditIcon}
              size="large"
            />
          )
        )}
      </div>

      {/* Text Inputs Container */}
      <div className="flex-1 flex gap-2">
        {/* Main Text Input */}
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">Main Text</label>
          <Input
            value={text}
            onChange={handleTextChange}
            placeholder="Enter main text"
            readOnly={preview}
            size="small"
          />
        </div>

        {/* Alt Text Input */}
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">
            Alt Text{" "}
            {showAltContent && (
              <span className="text-green-500">(Displayed)</span>
            )}
          </label>
          <Input
            value={altText}
            onChange={handleAltTextChange}
            placeholder="Enter alt text"
            readOnly={preview}
            size="small"
            className={showAltContent ? "ring-2 ring-green-200" : ""}
          />
        </div>
      </div>

      {/* Delete Button */}
      {!preview && (
        <div className="flex-shrink-0">
          <Popconfirm
            title="Are you sure you want to delete this item?"
            onConfirm={onDelete}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      )}

      {/* Icon Selection Modal */}
      {!preview && (
        <IconListSelectionModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSelectIcon={handleSelectIcon}
        />
      )}
    </div>
  );
};

export default IconListItem;
