import React, { useState, useEffect } from "react";
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
    // Alternative text content only
    altText: component?._mave?.altText || "",
    altSecondPartText: component?._mave?.altSecondPartText || "",
    showAltContent: component?._mave?.showAltContent || false,
  });

  // Handle both old _mave.text format and new value format
  const getTextContent = () => {
    if (component?.value) {
      return component.value;
    }
    if (component?._mave?.text) {
      return component._mave.text;
    }
    return "";
  };

  const [formData, setFormData] = useState({
    text: getTextContent(),
    altText: component?._mave?.altText || "",
  });

  const handleSubmit = () => {
    if (!formData.text.trim()) {
      return;
    }

    const updatedComponent = {
      ...component,
      value: formData.text,
      _mave: {
        fontSize: tempSettings.fontSize,
        primaryColor: tempSettings.primaryColor,
        secondaryColor: tempSettings.secondaryColor,
        textAlign: tempSettings.textAlign,
        fontWeight: tempSettings.fontWeight,
        isDualColor: tempSettings.isDualColor,
        secondPartText: tempSettings.secondPartText,
        altText: formData.altText,
        altSecondPartText: tempSettings.altSecondPartText,
        showAltContent: tempSettings.showAltContent,
      },
    };

    updateComponent(updatedComponent);
    setIsEditing(false);
  };

  const handleDiscard = () => {
    const hasContent = getTextContent().trim();
    if (!hasContent) {
      deleteComponent(component.id);
      return;
    }
    setTempSettings({
      fontSize: component?._mave?.fontSize || "medium",
      primaryColor: component?._mave?.primaryColor || "#000000",
      secondaryColor: component?._mave?.secondaryColor || "#000000",
      textAlign: component?._mave?.textAlign || "left",
      fontWeight: component?._mave?.fontWeight || "normal",
      isDualColor: component?._mave?.isDualColor || false,
      secondPartText: component?._mave?.secondPartText || "",
      altText: component?._mave?.altText || "",
      altSecondPartText: component?._mave?.altSecondPartText || "",
      showAltContent: component?._mave?.showAltContent || false,
    });
    setFormData({
      text: getTextContent(),
      altText: component?._mave?.altText || "",
    });
    setIsEditing(false);
  };

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
              className="w-full rounded-lg border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
              placeholder="Enter your text here..."
              autoFocus
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
                className="text-yellow-600 hover:text-yellow-700"
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
                  value={tempSettings.secondPartText}
                  onChange={(e) =>
                    setTempSettings({
                      ...tempSettings,
                      secondPartText: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full rounded-lg border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
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

          <div className="mb-6">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-semibold text-gray-700">
                Alternative Content
              </label>
              <Switch
                checked={tempSettings.showAltContent}
                onChange={(checked) =>
                  setTempSettings({ ...tempSettings, showAltContent: checked })
                }
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Show alternative text content alongside the main text
            </p>
          </div>

          {tempSettings.showAltContent && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Alternative Text
                </label>
                <Input.TextArea
                  value={formData.altText}
                  onChange={(e) =>
                    setFormData({ ...formData, altText: e.target.value })
                  }
                  rows={4}
                  className="w-full rounded-lg border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
                  placeholder="Enter alternative text here..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Alternative Second Part Text
                </label>
                <Input.TextArea
                  value={tempSettings.altSecondPartText}
                  onChange={(e) =>
                    setTempSettings({
                      ...tempSettings,
                      altSecondPartText: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full rounded-lg border-gray-200 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200"
                  placeholder="Enter alternative second part text here..."
                />
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
        {formData.text ? (
          <div className="space-y-4">
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
                    {tempSettings.secondPartText}
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

            {tempSettings.showAltContent && formData.altText && (
              <div style={{ textAlign: tempSettings.textAlign }}>
                <div className="text-sm text-gray-600 mb-1">
                  Alternative Content:
                </div>
                {tempSettings.isDualColor ? (
                  <div className="flex items-center gap-2">
                    <span
                      className={getFontSizeClass(tempSettings.fontSize)}
                      style={{
                        color: tempSettings.primaryColor,
                        fontWeight: tempSettings.fontWeight,
                      }}
                    >
                      {formData.altText}
                    </span>
                    <span
                      className={getFontSizeClass(tempSettings.fontSize)}
                      style={{
                        color: tempSettings.secondaryColor,
                        fontWeight: tempSettings.fontWeight,
                      }}
                    >
                      {tempSettings.altSecondPartText}
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
                    {formData.altText}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <Button
            icon={<PlusOutlined />}
            type="dashed"
            onClick={() => {
              setIsEditing(true);
              setFormData({ ...formData, text: "" });
            }}
            className="w-full h-32 border-2 border-dashed border-gray-300 hover:border-yellow-500 transition-colors"
          >
            <span className="text-lg font-medium text-gray-600">Add Text</span>
          </Button>
        )}
      </div>
    );
  };

  // Preview mode rendering
  if (preview) {
    return (
      <div className="preview-text-component p-6 bg-gray-50 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md">
        <div className="space-y-4">
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
                  {tempSettings.secondPartText}
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

          {tempSettings.showAltContent && formData.altText && (
            <div style={{ textAlign: tempSettings.textAlign }}>
              <div className="text-sm text-gray-600 mb-1">
                Alternative Content:
              </div>
              {tempSettings.isDualColor ? (
                <div className="flex items-center gap-2">
                  <span
                    className={getFontSizeClass(tempSettings.fontSize)}
                    style={{
                      color: tempSettings.primaryColor,
                      fontWeight: tempSettings.fontWeight,
                    }}
                  >
                    {formData.altText}
                  </span>
                  <span
                    className={getFontSizeClass(tempSettings.fontSize)}
                    style={{
                      color: tempSettings.secondaryColor,
                      fontWeight: tempSettings.fontWeight,
                    }}
                  >
                    {tempSettings.altSecondPartText}
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
                  {formData.altText}
                </div>
              )}
            </div>
          )}
        </div>
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
      showChangeButton={!!getTextContent().trim()}
    >
      {renderContent()}
    </BaseComponent>
  );
};

export default TextComponent;
