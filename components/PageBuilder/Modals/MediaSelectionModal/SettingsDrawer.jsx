import React from "react";
import { Drawer, Radio, Select, Divider } from "antd";

const { Option } = Select;

const SettingsDrawer = ({
  visible,
  onClose,
  viewMode,
  onViewModeChange,
  imageSize,
  onImageSizeChange,
}) => {
  return (
    <Drawer
      title="Display Settings"
      placement="right"
      width={300}
      onClose={onClose}
      open={visible}
    >
      <div className="space-y-6">
        <div>
          <h4 className="font-medium mb-2">View Mode</h4>
          <Radio.Group
            value={viewMode}
            onChange={(e) => onViewModeChange(e.target.value)}
            buttonStyle="solid"
            className="w-full"
          >
            <Radio.Button value="grid" className="w-1/2 text-center">
              Grid
            </Radio.Button>
            <Radio.Button value="list" className="w-1/2 text-center">
              List
            </Radio.Button>
          </Radio.Group>
        </div>
        <Divider />
        <div>
          <h4 className="font-medium mb-2">Image Size</h4>
          <Select
            value={imageSize}
            onChange={onImageSizeChange}
            className="w-full"
          >
            <Option value="small">Small</Option>
            <Option value="medium">Medium</Option>
            <Option value="large">Large</Option>
          </Select>
        </div>
      </div>
    </Drawer>
  );
};

export default SettingsDrawer;
