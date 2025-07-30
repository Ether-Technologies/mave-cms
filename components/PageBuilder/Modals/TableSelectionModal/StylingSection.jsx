// components/PageBuilder/Modals/TableSelectionModal/StylingSection.jsx

import React from "react";
import { Form, Select, Input, Typography } from "antd";

const { Title } = Typography;
const { Option } = Select;

const StylingSection = ({ styles, setStyles }) => {
  const handleStyleChange = (field, value) => {
    setStyles({ ...styles, [field]: value });
  };

  return (
    <>
      <Title level={4}>Styling</Title>
      <Form.Item label="Border Style">
        <Select
          value={styles.borderStyle}
          onChange={(value) => handleStyleChange("borderStyle", value)}
          showSearch
        >
          <Option value="none">None</Option>
          <Option value="thin">Thin</Option>
          <Option value="thick">Thick</Option>
        </Select>
      </Form.Item>
      {/* <Form.Item label="Cell Background Color">
        <Input
          type="color"
          value={styles.cellColor}
          onChange={(e) => handleStyleChange("cellColor", e.target.value)}
        />
      </Form.Item> */}
      <Form.Item label="Text Alignment">
        <Select
          value={styles.textAlign}
          onChange={(value) => handleStyleChange("textAlign", value)}
          showSearch
        >
          <Option value="left">Left</Option>
          <Option value="center">Center</Option>
          <Option value="right">Right</Option>
        </Select>
      </Form.Item>
    </>
  );
};

export default StylingSection;
