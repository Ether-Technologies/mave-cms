import React from "react";
import { Select, Space, Button } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";

const { Option } = Select;

function ConfigSection({
  layout,
  font,
  color,
  background,
  handleLayoutChange,
  handleFontChange,
  handleColorChange,
  handleBackgroundChange,
  preview,
}) {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const toggleAdvanced = React.useCallback(() => {
    setShowAdvanced((prev) => !prev);
  }, []);

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <div className="flex flex-wrap justify-between mb-4">
        <Select
          value={layout}
          onChange={handleLayoutChange}
          style={{ width: 150 }}
          disabled={preview}
          showSearch
        >
          <Option value="carousel">Carousel</Option>
          <Option value="grid">Grid</Option>
        </Select>

        <Button
          type="text"
          onClick={toggleAdvanced}
          icon={showAdvanced ? <UpOutlined /> : <DownOutlined />}
          className="flex items-center text-brand"
        >
          {showAdvanced ? "Hide Advanced" : "Show Advanced"}
        </Button>
      </div>

      {showAdvanced && (
        <div className="flex flex-wrap gap-4 mb-4 border-t pt-4">
          <Select
            value={font}
            onChange={handleFontChange}
            style={{ width: 150 }}
            disabled={preview}
            showSearch
          >
            <Option value="Arial">Arial</Option>
            <Option value="Helvetica">Helvetica</Option>
            <Option value="Times New Roman">Times New Roman</Option>
            <Option value="Georgia">Georgia</Option>
            <Option value="Verdana">Verdana</Option>
          </Select>
          <div className="flex items-center">
            <label htmlFor="color" className="mr-2">
              Text Color:
            </label>
            <input
              id="color"
              type="color"
              value={color}
              onChange={handleColorChange}
              className="w-10 h-10 border rounded-md"
              disabled={preview}
            />
          </div>
          <div className="flex items-center">
            <label htmlFor="background" className="mr-2">
              Background:
            </label>
            <input
              id="background"
              type="color"
              value={background}
              onChange={handleBackgroundChange}
              className="w-10 h-10 border rounded-md"
              disabled={preview}
            />
          </div>
        </div>
      )}
    </Space>
  );
}

export default React.memo(ConfigSection);
