// components/PageBuilder/Components/IconListComponent/IconListComponent.jsx

import React, { useState, useEffect } from "react";
import { Button, Popconfirm, Select, Space, message, Typography } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import IconListItem from "./IconListItem";
import IconListSelectionModal from "../../Modals/IconListSelectionModal/IconListSelectionModal";
const { Paragraph } = Typography;
const { Option } = Select;

const IconListComponent = ({
  component,
  updateComponent,
  deleteComponent,
  preview = false, // New prop with default value
}) => {
  const [items, setItems] = useState(component._mave?.items || []);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [orientation, setOrientation] = useState(
    component._mave?.orientation || "vertical"
  );
  const [iconSize, setIconSize] = useState(component._mave?.iconSize || 24);
  const [iconColor, setIconColor] = useState(
    component._mave?.iconColor || "#000000"
  );

  useEffect(() => {
    updateComponent({
      ...component,
      _mave: {
        items,
        orientation,
        iconSize,
        iconColor,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, orientation, iconSize, iconColor]);

  const handleAddItem = () => {
    if (!preview) {
      setIsModalVisible(true);
    }
  };

  const handleSelectIcon = (className) => {
    if (typeof className === "string") {
      const newItem = {
        id: Date.now(),
        icon: className,
        text: "",
      };
      setItems([...items, newItem]);
      setIsModalVisible(false);
      message.success("Icon added successfully.");
    } else {
      message.error("Invalid icon selected.");
    }
  };

  const handleUpdateItem = (id, updatedItem) => {
    if (!preview) {
      const newItems = items.map((item) =>
        item.id === id ? updatedItem : item
      );
      setItems(newItems);
      // message.success("Item updated successfully.");
    }
  };

  const handleDeleteItem = (id) => {
    if (!preview) {
      const newItems = items.filter((item) => item.id !== id);
      setItems(newItems);
      message.success("Item deleted successfully.");
    }
  };

  const handleOrientationChange = (value) => {
    if (!preview) {
      setOrientation(value);
    }
  };

  const handleIconSizeChange = (value) => {
    if (!preview) {
      setIconSize(value);
    }
  };

  const handleIconColorChange = (e) => {
    if (!preview) {
      setIconColor(e.target.value);
    }
  };

  const handleDeleteComponent = () => {
    if (!preview) {
      deleteComponent();
    }
  };

  return (
    <div className="border p-4 rounded-md bg-gray-50">
      {!preview && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Icon List Component</h3>
          <div>
            <Popconfirm
              title="Are you sure you want to delete this component?"
              onConfirm={handleDeleteComponent}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ danger: true }}
            >
              <Button
                className="mavecancelbutton"
                icon={<DeleteOutlined />}
                danger
              />
            </Popconfirm>
          </div>
        </div>
      )}

      {/* Configurations (Only in Edit Mode) */}
      {!preview && (
        <div className="flex flex-wrap gap-4 mb-4">
          <Select
            value={orientation}
            onChange={handleOrientationChange}
            style={{ width: 150 }}
            disabled={preview}
            showSearch
          >
            <Option value="vertical">Vertical</Option>
            <Option value="horizontal">Horizontal</Option>
          </Select>
          <Select
            value={iconSize}
            onChange={handleIconSizeChange}
            style={{ width: 150 }}
            disabled={preview}
            showSearch
          >
            <Option value={16}>16px</Option>
            <Option value={24}>24px</Option>
            <Option value={32}>32px</Option>
            <Option value={40}>40px</Option>
          </Select>
          <div className="flex items-center">
            <label htmlFor="iconColor" className="mr-2">
              Icon Color:
            </label>
            <input
              id="iconColor"
              type="color"
              value={iconColor}
              onChange={handleIconColorChange}
              title="Select Icon Color"
              className="w-10 h-10 border rounded-md"
              disabled={preview}
            />
          </div>
        </div>
      )}

      {/* Icon List Display */}
      <div
        className={`flex ${
          orientation === "vertical" ? "flex-col" : "flex-row"
        } gap-4`}
      >
        {items.length > 0
          ? items.map((item) => (
              <IconListItem
                key={item.id}
                item={item}
                iconSize={iconSize}
                iconColor={iconColor}
                onUpdate={(updatedItem) =>
                  handleUpdateItem(item.id, updatedItem)
                }
                onDelete={() => handleDeleteItem(item.id)}
                preview={preview}
              />
            ))
          : !preview && (
              <Paragraph>
                No icons added. Click "Add Icon" to get started.
              </Paragraph>
            )}
        {!preview && (
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={handleAddItem}
            className="mavebutton"
          >
            Add Icon
          </Button>
        )}
      </div>

      {/* Icon Selection Modal */}
      {!preview && (
        <IconListSelectionModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSelectIcon={(className) => handleSelectIcon(className)}
        />
      )}
    </div>
  );
};

export default IconListComponent;
