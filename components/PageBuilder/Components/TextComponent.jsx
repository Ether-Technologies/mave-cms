import React, { useState } from "react";
import {
  Input,
  Modal,
  Typography,
  Button,
  ColorPicker,
  Space,
  Divider,
  Switch,
  Slider,
  Radio,
  Select,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  FontColorsOutlined,
  FontSizeOutlined,
} from "@ant-design/icons";
import BaseComponent from "./BaseComponent";

const { Title } = Typography;

const TextComponent = ({
  component,
  updateComponent,
  deleteComponent,
  preview = false,
  onDuplicateElement,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempSettings, setTempSettings] = useState({
    fontSize: component?._mave?.fontSize || "medium",
    primaryColor: component?._mave?.primaryColor || "#000000",
    secondaryColor: component?._mave?.secondaryColor || "#000000",
    textAlign: component?._mave?.textAlign || "left",
    fontWeight: component?._mave?.fontWeight || "normal",
    isDualColor: component?._mave?.isDualColor || false,
    secondPartText: component?._mave?.secondPartText || "",
  });

  const [formData, setFormData] = useState({
    text: component?._mave?.text || "",
    altText: component?._mave?.altText || "",
  });

  const handleSubmit = () => {
    const updatedComponent = {
      ...component,
      _mave: {
        ...component._mave,
        text: formData.text,
        altText: formData.altText,
        fontSize: tempSettings.fontSize,
        primaryColor: tempSettings.primaryColor,
        secondaryColor: tempSettings.secondaryColor,
        textAlign: tempSettings.textAlign,
        fontWeight: tempSettings.fontWeight,
        isDualColor: tempSettings.isDualColor,
      },
    };
    updateComponent(updatedComponent);
    setIsEditing(false);
  };

  const handleDiscard = () => {
    setTempSettings({
      fontSize: component?._mave?.fontSize || "medium",
      primaryColor: component?._mave?.primaryColor || "#000000",
      secondaryColor: component?._mave?.secondaryColor || "#000000",
      textAlign: component?._mave?.textAlign || "left",
      fontWeight: component?._mave?.fontWeight || "normal",
      isDualColor: component?._mave?.isDualColor || false,
      secondPartText: component?._mave?.secondPartText || "",
    });
    setFormData({
      text: component?._mave?.text || "",
      altText: component?._mave?.altText || "",
    });
    setIsEditing(false);
  };

  const renderContent = () => {
    if (isEditing) {
      return (
        <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Text Content
            </label>
            <Input.TextArea
              value={formData.text}
              onChange={(e) =>
                setFormData({ ...formData, text: e.target.value })
              }
              rows={4}
              className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="Enter your text here..."
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Text Style
            </label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Font Size
                </label>
                <Select
                  value={tempSettings.fontSize}
                  onChange={(value) =>
                    setTempSettings({ ...tempSettings, fontSize: value })
                  }
                  className="w-full"
                  suffixIcon={<FontSizeOutlined />}
                >
                  <Select.Option value="small">Small</Select.Option>
                  <Select.Option value="medium">Medium</Select.Option>
                  <Select.Option value="large">Large</Select.Option>
                  <Select.Option value="xlarge">X-Large</Select.Option>
                  <Select.Option value="2xlarge">2X-Large</Select.Option>
                  <Select.Option value="3xlarge">3X-Large</Select.Option>
                </Select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Font Weight
                </label>
                <Select
                  value={tempSettings.fontWeight}
                  onChange={(value) =>
                    setTempSettings({ ...tempSettings, fontWeight: value })
                  }
                  className="w-full"
                >
                  <Select.Option value="normal">Normal</Select.Option>
                  <Select.Option value="medium">Medium</Select.Option>
                  <Select.Option value="semibold">Semi Bold</Select.Option>
                  <Select.Option value="bold">Bold</Select.Option>
                </Select>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">
                  Text Alignment
                </label>
                <Select
                  value={tempSettings.textAlign}
                  onChange={(value) =>
                    setTempSettings({ ...tempSettings, textAlign: value })
                  }
                  className="w-full"
                >
                  <Select.Option value="left">Left</Select.Option>
                  <Select.Option value="center">Center</Select.Option>
                  <Select.Option value="right">Right</Select.Option>
                </Select>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Text Color
            </label>
            <ColorPicker
              value={tempSettings.primaryColor}
              onChange={(color) =>
                setTempSettings({
                  ...tempSettings,
                  primaryColor: color.toHexString(),
                })
              }
              className="w-full"
            />
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-700">
                Advanced Options
              </label>
              <Button
                type="text"
                onClick={() =>
                  setTempSettings({
                    ...tempSettings,
                    isDualColor: !tempSettings.isDualColor,
                  })
                }
                className="text-blue-600 hover:text-blue-700"
              >
                {tempSettings.isDualColor
                  ? "Disable Dual Color"
                  : "Enable Dual Color"}
              </Button>
            </div>
          </div>

          {tempSettings.isDualColor && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Second Part Text
                </label>
                <Input.TextArea
                  value={formData.altText}
                  onChange={(e) =>
                    setFormData({ ...formData, altText: e.target.value })
                  }
                  rows={4}
                  className="w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="Enter your second part text here..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Second Part Color
                </label>
                <ColorPicker
                  value={tempSettings.secondaryColor}
                  onChange={(color) =>
                    setTempSettings({
                      ...tempSettings,
                      secondaryColor: color.toHexString(),
                    })
                  }
                  className="w-full"
                />
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              onClick={handleDiscard}
              className="px-6 py-2 border-gray-300 hover:bg-gray-50"
            >
              Discard
            </Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700"
            >
              Save Changes
            </Button>
          </div>
        </div>
      );
    }

    const getFontSizeClass = (size) => {
      switch (size) {
        case "small":
          return "text-sm";
        case "medium":
          return "text-base";
        case "large":
          return "text-lg";
        case "xlarge":
          return "text-xl";
        case "2xlarge":
          return "text-2xl";
        case "3xlarge":
          return "text-3xl";
        default:
          return "text-base";
      }
    };

    return (
      <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <div style={{ textAlign: tempSettings.textAlign }}>
          {tempSettings.isDualColor ? (
            <div className="flex items-center gap-2">
              <span
                className={getFontSizeClass(tempSettings.fontSize)}
                style={{
                  color: tempSettings.primaryColor,
                  fontWeight: tempSettings.fontWeight,
                }}
              >
                {formData.text}
              </span>
              <span
                className={getFontSizeClass(tempSettings.fontSize)}
                style={{
                  color: tempSettings.secondaryColor,
                  fontWeight: tempSettings.fontWeight,
                }}
              >
                {formData.altText}
              </span>
            </div>
          ) : (
            <div
              className={getFontSizeClass(tempSettings.fontSize)}
              style={{
                color: tempSettings.primaryColor,
                fontWeight: tempSettings.fontWeight,
              }}
            >
              {formData.text}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Preview mode rendering
  if (preview) {
    const textStyle = {
      fontSize:
        component.settings?.fontSize === "2xl"
          ? "1.5rem"
          : component.settings?.fontSize === "xl"
            ? "1.25rem"
            : component.settings?.fontSize === "lg"
              ? "1.125rem"
              : component.settings?.fontSize === "base"
                ? "1rem"
                : component.settings?.fontSize === "sm"
                  ? "0.875rem"
                  : "2rem",
      fontWeight: component.settings?.fontWeight || "normal",
      textAlign: component.settings?.textAlign || "left",
    };

    return (
      <div className="preview-text-component p-6 bg-gray-50 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md text-center">
        <h1 style={textStyle} className="text-3xl font-bold">
          {tempSettings.isDualColor ? (
            <div className="flex items-center gap-2">
              <span
                style={{
                  color: tempSettings.primaryColor,
                  fontSize: tempSettings.fontSize,
                  fontWeight: tempSettings.fontWeight,
                }}
              >
                {formData.text}
              </span>
              <span
                style={{
                  color: tempSettings.secondaryColor,
                  fontSize: tempSettings.fontSize,
                  fontWeight: tempSettings.fontWeight,
                }}
              >
                {formData.altText}
              </span>
            </div>
          ) : (
            <div
              style={{
                fontSize: tempSettings.fontSize,
                color: tempSettings.primaryColor,
                fontWeight: tempSettings.fontWeight,
              }}
            >
              {formData.text}
            </div>
          )}
        </h1>
      </div>
    );
  }

  return (
    <BaseComponent
      component={component}
      updateComponent={updateComponent}
      deleteComponent={deleteComponent}
      preview={preview}
      onDuplicateElement={onDuplicateElement}
      title="Text Component"
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      onEdit={() => setIsEditing(true)}
      onCancel={handleDiscard}
      onSave={handleSubmit}
      showChangeButton={!!component.value}
    >
      {renderContent()}
    </BaseComponent>
  );
};

export default TextComponent;
