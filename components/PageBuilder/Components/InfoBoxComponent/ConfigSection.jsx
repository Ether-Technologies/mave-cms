import React from "react";
import { Select, Space } from "antd";

const { Option } = Select;

const ConfigSection = ({
  layout,
  font,
  color,
  background,
  onLayoutChange,
  onFontChange,
  onColorChange,
  onBackgroundChange,
}) => {
  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <Select
        value={layout}
        onChange={onLayoutChange}
        style={{ width: 150 }}
        showSearch
      >
        <Option value="vertical">Vertical</Option>
        <Option value="horizontal">Horizontal</Option>
      </Select>
      <Select
        value={font}
        onChange={onFontChange}
        style={{ width: 150 }}
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
          onChange={onColorChange}
          className="w-10 h-10 border rounded-md"
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
          onChange={onBackgroundChange}
          className="w-10 h-10 border rounded-md"
        />
      </div>
    </div>
  );
};

export default ConfigSection;
