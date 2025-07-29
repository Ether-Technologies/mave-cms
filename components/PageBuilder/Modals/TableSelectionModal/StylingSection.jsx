// components/PageBuilder/Modals/TableSelectionModal/StylingSection.jsx

import React, { useCallback, useMemo } from "react";
import { Form, Select, Input, Typography, ColorPicker } from "antd";

const { Title } = Typography;
const { Option } = Select;

const StylingSection = React.memo(({ styles, setStyles }) => {
  // Optimized style change handler
  const handleStyleChange = useCallback(
    (field, value) => {
      setStyles({ ...styles, [field]: value });
    },
    [styles, setStyles]
  );

  // Memoized form items for better performance
  const borderStyleProps = useMemo(
    () => ({
      label: "Border Style",
      children: (
        <Select
          value={styles.borderStyle}
          onChange={(value) => handleStyleChange("borderStyle", value)}
          showSearch
          placeholder="Select border style"
        >
          <Option value="none">None</Option>
          <Option value="thin">Thin</Option>
          <Option value="thick">Thick</Option>
        </Select>
      ),
    }),
    [styles.borderStyle, handleStyleChange]
  );

  const textAlignProps = useMemo(
    () => ({
      label: "Text Alignment",
      children: (
        <Select
          value={styles.textAlign}
          onChange={(value) => handleStyleChange("textAlign", value)}
          showSearch
          placeholder="Select text alignment"
        >
          <Option value="left">Left</Option>
          <Option value="center">Center</Option>
          <Option value="right">Right</Option>
        </Select>
      ),
    }),
    [styles.textAlign, handleStyleChange]
  );

  const cellColorProps = useMemo(
    () => ({
      label: "Cell Background Color",
      children: (
        <ColorPicker
          value={styles.cellColor}
          onChange={(color) =>
            handleStyleChange("cellColor", color.toHexString())
          }
          showText
          format="hex"
        />
      ),
    }),
    [styles.cellColor, handleStyleChange]
  );

  const headerColorProps = useMemo(
    () => ({
      label: "Header Background Color",
      children: (
        <ColorPicker
          value={styles.headerColor}
          onChange={(color) =>
            handleStyleChange("headerColor", color.toHexString())
          }
          showText
          format="hex"
        />
      ),
    }),
    [styles.headerColor, handleStyleChange]
  );

  const fontSizeProps = useMemo(
    () => ({
      label: "Font Size",
      children: (
        <Select
          value={styles.fontSize}
          onChange={(value) => handleStyleChange("fontSize", value)}
          showSearch
          placeholder="Select font size"
        >
          <Option value="small">Small</Option>
          <Option value="medium">Medium</Option>
          <Option value="large">Large</Option>
        </Select>
      ),
    }),
    [styles.fontSize, handleStyleChange]
  );

  return (
    <>
      <Title level={4}>Styling</Title>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item {...borderStyleProps} />
        <Form.Item {...textAlignProps} />
        <Form.Item {...cellColorProps} />
        <Form.Item {...headerColorProps} />
        <Form.Item {...fontSizeProps} />
      </div>
    </>
  );
});

StylingSection.displayName = "StylingSection";

export default StylingSection;
