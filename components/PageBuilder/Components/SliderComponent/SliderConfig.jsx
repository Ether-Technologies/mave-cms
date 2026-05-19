import React from "react";
import { Typography, Switch, Select } from "antd";

const { Paragraph } = Typography;

const SliderConfig = React.memo(({ config: sliderConfig, setConfig: setSliderConfig }) => {
  if (!sliderConfig) return null;

  const handleConfigChange = (key, value) => {
    setSliderConfig({ ...sliderConfig, [key]: value });
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
      <Paragraph strong className="text-lg">Slider Settings</Paragraph>

      <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
        <div>
          <Paragraph className="font-medium mb-0">Autoplay</Paragraph>
          <Paragraph type="secondary" className="text-xs mb-0">
            Automatically advance slides
          </Paragraph>
        </div>
        <Switch
          checked={sliderConfig.autoplay}
          onChange={(checked) => handleConfigChange("autoplay", checked)}
        />
      </div>

      <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
        <div>
          <Paragraph className="font-medium mb-0">Show Dots</Paragraph>
          <Paragraph type="secondary" className="text-xs mb-0">
            Display navigation dots
          </Paragraph>
        </div>
        <Switch
          checked={sliderConfig.dots}
          onChange={(checked) => handleConfigChange("dots", checked)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Paragraph className="font-medium">Effect</Paragraph>
          <Select
            value={sliderConfig.effect}
            onChange={(value) => handleConfigChange("effect", value)}
            className="w-full"
            size="small"
          >
            <Select.Option value="scroll">Scroll</Select.Option>
            <Select.Option value="fade">Fade</Select.Option>
            <Select.Option value="slide">Slide</Select.Option>
          </Select>
        </div>

        <div className="space-y-1">
          <Paragraph className="font-medium">Speed</Paragraph>
          <Select
            value={sliderConfig.speed}
            onChange={(value) => handleConfigChange("speed", value)}
            className="w-full"
            size="small"
          >
            <Select.Option value={300}>Fast</Select.Option>
            <Select.Option value={500}>Medium</Select.Option>
            <Select.Option value={800}>Slow</Select.Option>
          </Select>
        </div>
      </div>
    </div>
  );
});

SliderConfig.displayName = "SliderConfig";

export default SliderConfig;
