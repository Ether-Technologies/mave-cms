import React, { useCallback, useMemo } from "react";
import { Drawer, Typography, Switch, Select, Space, Button } from "antd";
import SliderRenderer from "./SliderRenderer";

const { Paragraph } = Typography;

const SliderConfig = React.memo(
  ({
    showConfig,
    setShowConfig,
    sliderConfig,
    setSliderConfig,
    sliderData,
  }) => {
    // Default configuration values
    const defaultConfig = {
      autoplay: false,
      dots: true,
      effect: "scroll",
      speed: 500,
    };

    // Ensure sliderConfig has all required properties
    const safeSliderConfig = useMemo(() => {
      return { ...defaultConfig, ...sliderConfig };
    }, [sliderConfig]);

    // Check if sliderData is available and valid
    const hasValidSliderData = useMemo(() => {
      return sliderData && Array.isArray(sliderData) && sliderData.length > 0;
    }, [sliderData]);

    const handleConfigChange = useCallback(
      (key, value) => {
        if (setSliderConfig) {
          setSliderConfig((prev) => ({ ...prev, [key]: value }));
        }
      },
      [setSliderConfig]
    );

    const handleSave = useCallback(() => {
      setShowConfig(false);
    }, [setShowConfig]);

    const handleClose = useCallback(() => {
      setShowConfig(false);
    }, [setShowConfig]);

    // Early return if required props are missing
    if (!setSliderConfig || !setShowConfig) {
      return null;
    }

    return (
      <Drawer
        title="Slider Configuration"
        placement="right"
        onClose={handleClose}
        open={showConfig}
        width={400}
        extra={
          <Space>
            <Button type="primary" onClick={handleSave}>
              Save
            </Button>
          </Space>
        }
      >
        <div className="space-y-6 p-4">
          <div>
            <Paragraph strong className="text-lg">
              Preview
            </Paragraph>
            <div className="mt-4 border rounded-lg overflow-hidden p-4 bg-gray-50">
              {hasValidSliderData ? (
                <SliderRenderer
                  sliderData={sliderData}
                  config={safeSliderConfig}
                />
              ) : (
                <div className="text-center text-gray-500 py-8">
                  No slider data available for preview
                </div>
              )}
            </div>
          </div>

          <div>
            <Paragraph strong className="text-lg">
              Slider Settings
            </Paragraph>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <Paragraph className="font-medium mb-0">Autoplay</Paragraph>
                  <Paragraph type="secondary" className="text-xs mb-0">
                    Automatically advance slides
                  </Paragraph>
                </div>
                <Switch
                  checked={safeSliderConfig.autoplay}
                  onChange={(checked) =>
                    handleConfigChange("autoplay", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <Paragraph className="font-medium mb-0">Show Dots</Paragraph>
                  <Paragraph type="secondary" className="text-xs mb-0">
                    Display navigation dots
                  </Paragraph>
                </div>
                <Switch
                  checked={safeSliderConfig.dots}
                  onChange={(checked) => handleConfigChange("dots", checked)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Paragraph className="font-medium">Effect</Paragraph>
                  <Select
                    value={safeSliderConfig.effect}
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
                    value={safeSliderConfig.speed}
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
          </div>
        </div>
      </Drawer>
    );
  }
);

SliderConfig.displayName = "SliderConfig";

export default SliderConfig;
