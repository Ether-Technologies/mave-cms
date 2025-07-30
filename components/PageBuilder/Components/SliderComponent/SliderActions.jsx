import React from "react";
import { Button, Popconfirm, Space, Tooltip } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  CopyFilled,
  DragOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

const SliderActions = React.memo(
  ({
    sliderData,
    isEditing,
    selectedSliderData,
    isRefreshing,
    pollingError,
    onRefresh,
    onEdit,
    onDuplicate,
    onDelete,
    onSubmit,
    onCancel,
  }) => {
    const handleDelete = () => {
      onDelete();
    };

    return (
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <DragOutlined className="text-2xl border rounded-md p-1" />
          <h3 className="text-xl font-semibold">Slider Component</h3>
          {sliderData && (
            <div className="flex items-center gap-2 ml-4">
              <Tooltip title="Refresh slider data">
                <Button
                  icon={<ReloadOutlined spin={isRefreshing} />}
                  onClick={onRefresh}
                  disabled={isRefreshing || !sliderData?.id}
                  size="small"
                  className="mavebutton"
                />
              </Tooltip>
              {pollingError && (
                <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                  {pollingError}
                </span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <Space>
              {sliderData && (
                <Tooltip title="Change Slider">
                  <Button
                    icon={<EditOutlined />}
                    onClick={onEdit}
                    className="mavebutton"
                  />
                </Tooltip>
              )}
              <Tooltip title="Duplicate">
                <Button
                  icon={<CopyFilled />}
                  onClick={onDuplicate}
                  className="mavebutton"
                />
              </Tooltip>
              <Popconfirm
                title="Are you sure you want to delete this component?"
                onConfirm={handleDelete}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ danger: true }}
              >
                <Tooltip title="Delete">
                  <Button
                    icon={<DeleteOutlined />}
                    className="mavecancelbutton"
                  />
                </Tooltip>
              </Popconfirm>
            </Space>
          ) : (
            <Space>
              <Tooltip title="Save Changes">
                <Button
                  icon={<CheckOutlined />}
                  onClick={onSubmit}
                  className="mavebutton"
                />
              </Tooltip>
              <Tooltip title="Cancel">
                <Button
                  icon={<CloseOutlined />}
                  onClick={onCancel}
                  className="mavecancelbutton"
                />
              </Tooltip>
            </Space>
          )}
        </div>
      </div>
    );
  }
);

SliderActions.displayName = "SliderActions";

export default SliderActions;
