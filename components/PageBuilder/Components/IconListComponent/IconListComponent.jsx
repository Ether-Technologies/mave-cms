// components/PageBuilder/Components/IconListComponent/IconListComponent.jsx

import React, { useState, useEffect } from "react";
import {
  Button,
  Popconfirm,
  Select,
  Space,
  message,
  Typography,
  Collapse,
  Switch,
  Form,
  Input,
  Tooltip,
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  GlobalOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  CopyFilled,
} from "@ant-design/icons";
import IconListItem from "./IconListItem";
import IconListSelectionModal from "../../Modals/IconListSelectionModal/IconListSelectionModal";
const { Paragraph } = Typography;
const { Option } = Select;
const { Panel } = Collapse;

const IconListComponent = ({
  component,
  updateComponent,
  deleteComponent,
  preview = false, // New prop with default value
  onDuplicateElement,
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
  const [showAltContent, setShowAltContent] = useState(false);
  const [showAltInputs, setShowAltInputs] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState({});

  // Remove the automatic update useEffect to prevent infinite loops
  // Updates will be handled manually through save button

  useEffect(() => {
    setShowAltContent(component._mave?.showAltContent || false);
  }, [component._mave?.showAltContent]);

  const handleEditClick = () => {
    setTempData({
      items: [...items],
      orientation,
      iconSize,
      iconColor,
      showAltContent,
    });
    setIsEditing(true);
  };

  const handleSave = () => {
    updateComponent({
      ...component,
      _mave: {
        items,
        orientation,
        iconSize,
        iconColor,
        showAltContent,
      },
    });
    setIsEditing(false);
    message.success("Icon list updated successfully.");
  };

  const handleCancel = () => {
    setItems(tempData.items || []);
    setOrientation(tempData.orientation || "vertical");
    setIconSize(tempData.iconSize || 24);
    setIconColor(tempData.iconColor || "#000000");
    setShowAltContent(tempData.showAltContent || false);
    setIsEditing(false);
  };

  const handleAddItem = () => {
    if (!preview && isEditing) {
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
    if (!preview && isEditing) {
      const newItems = items.map((item) =>
        item.id === id ? updatedItem : item
      );
      setItems(newItems);
      // message.success("Item updated successfully.");
    }
  };

  const handleDeleteItem = (id) => {
    if (!preview && isEditing) {
      const newItems = items.filter((item) => item.id !== id);
      setItems(newItems);
      message.success("Item deleted successfully.");
    }
  };

  const handleOrientationChange = (value) => {
    if (!preview && isEditing) {
      setOrientation(value);
    }
  };

  const handleIconSizeChange = (value) => {
    if (!preview && isEditing) {
      setIconSize(value);
    }
  };

  const handleIconColorChange = (e) => {
    if (!preview && isEditing) {
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
          <Space>
            {!isEditing ? (
              <>
                <Tooltip title="Edit component">
                  <Button
                    icon={<EditOutlined />}
                    onClick={handleEditClick}
                    className="mavebutton"
                  >
                    Edit
                  </Button>
                </Tooltip>
                <Tooltip title="Duplicate component">
                  <Button
                    icon={<CopyFilled />}
                    onClick={onDuplicateElement}
                    className="mavebutton"
                  />
                </Tooltip>
                <Popconfirm
                  title="Are you sure you want to delete this component?"
                  onConfirm={handleDeleteComponent}
                  okText="Yes"
                  cancelText="No"
                  okButtonProps={{ danger: true }}
                >
                  <Tooltip title="Delete component">
                    <Button icon={<DeleteOutlined />} danger />
                  </Tooltip>
                </Popconfirm>
              </>
            ) : (
              <>
                <Tooltip title="Save changes">
                  <Button
                    icon={<CheckOutlined />}
                    onClick={handleSave}
                    className="mavebutton"
                  >
                    Save
                  </Button>
                </Tooltip>
                <Tooltip title="Cancel editing">
                  <Button
                    icon={<CloseOutlined />}
                    onClick={handleCancel}
                    className="mavecancelbutton"
                  >
                    Cancel
                  </Button>
                </Tooltip>
              </>
            )}
          </Space>
        </div>
      )}

      {/* Configurations (Only in Edit Mode) */}
      {!preview && isEditing && (
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
                preview={preview || !isEditing}
                showAltContent={showAltContent}
              />
            ))
          : (!preview || isEditing) && (
              <Paragraph>
                No icons added. Click "Add Icon" to get started.
              </Paragraph>
            )}
        {!preview && isEditing && (
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

      {/* Multi-Language Configuration */}
      {items.length > 0 && !preview && isEditing && (
        <Collapse className="mt-4">
          <Panel
            header={
              <div className="flex items-center gap-2">
                <GlobalOutlined />
                Multi-Language Settings
              </div>
            }
            key="multilang"
          >
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-md font-semibold">
                    Display Alternative Content
                  </h4>
                  <p className="text-sm text-gray-600">
                    Toggle to show alternative text for icon items
                  </p>
                </div>
                <Switch
                  checked={showAltContent}
                  onChange={(checked) => {
                    setShowAltContent(checked);
                  }}
                />
              </div>

              {showAltContent && (
                <div className="mt-4 p-3 bg-gray-200 rounded-lg">
                  <div className="text-sm text-gray-800">
                    <strong>Alternative Content Mode:</strong> Icon items will
                    display alternative text when available.
                  </div>
                </div>
              )}

              <div className="mt-4 p-3 bg-white rounded-lg border">
                <div className="text-sm text-gray-600">
                  <strong>Note:</strong> You can edit both main text and alt
                  text directly in the icon items above. The alt text will be
                  displayed when "Display Alternative Content" is enabled.
                </div>
              </div>
            </div>
          </Panel>
        </Collapse>
      )}

      {/* Icon Selection Modal */}
      {!preview && isEditing && (
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
