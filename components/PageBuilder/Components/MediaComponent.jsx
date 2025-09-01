// components/PageBuilder/Components/MediaComponent.jsx

import React, { useState } from "react";
import {
  Button,
  Popconfirm,
  message,
  Space,
  Tooltip,
  Select,
  Radio,
} from "antd";
import {
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  ArrowRightOutlined,
  ExportOutlined,
  CopyFilled,
  DragOutlined,
  EyeOutlined,
  DownloadOutlined,
  LinkOutlined,
  EditOutlined,
} from "@ant-design/icons";
import MediaSelectionModal from "../Modals/MediaSelectionModal";
import Image from "next/image";

const MediaComponent = ({
  component,
  updateComponent,
  deleteComponent,
  preview = false,
  onDuplicateElement,
}) => {
  // Safety check for null component
  if (!component) {
    return null;
  }

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [mediaData, setMediaData] = useState(component?._mave);
  const [selectedMediaData, setSelectedMediaData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleSelectMedia = (selectedMedia) => {
    setSelectedMediaData(selectedMedia);
    setIsModalVisible(false);
    setIsEditing(true);
  };

  const handleSubmit = () => {
    if (component?.selectionMode === "multiple") {
      if (selectedMediaData.length === 0) {
        message.error("Please select at least one media item.");
        return;
      }
      updateComponent({
        ...component,
        _mave: selectedMediaData,
        id: selectedMediaData?.map((media) => media.id),
      });
    } else {
      if (!selectedMediaData) {
        message.error("Please select a media item.");
        return;
      }
      updateComponent({
        ...component,
        _mave: selectedMediaData,
        id: selectedMediaData.id,
      });
    }
    setMediaData(selectedMediaData);
    setSelectedMediaData(null);
    setIsEditing(false);
    message.success("Media updated successfully.");
  };

  const handleCancel = () => {
    setSelectedMediaData(null);
    setIsEditing(false);
    message.info("Media update canceled.");
  };

  const handleDelete = () => {
    deleteComponent();
  };

  const renderMediaItem = (media) => {
    const fileUrl = `${process.env.NEXT_PUBLIC_MEDIA_URL}/${media.file_path}`;
    const fileType = media.file_type || "";

    if (fileType.startsWith("image/")) {
      return (
        <div className="relative group">
          <Image
            key={media.id}
            src={fileUrl}
            alt={media.title || "Image"}
            width={900}
            height={400}
            objectFit="cover"
            className="rounded-lg transition-all duration-300 group-hover:shadow-lg w-48 h-36"
          />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Space>
              <Tooltip title="View">
                <Button
                  type="text"
                  icon={<EyeOutlined className="text-white" />}
                  onClick={() => window.open(fileUrl, "_blank")}
                />
              </Tooltip>
              <Tooltip title="Download">
                <Button
                  type="text"
                  icon={<DownloadOutlined className="text-white" />}
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = fileUrl;
                    link.download = media.file_name;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                />
              </Tooltip>
            </Space>
          </div>
        </div>
      );
    } else if (fileType.startsWith("video/")) {
      return (
        <div className="relative group">
          <video
            key={media.id}
            src={fileUrl}
            controls
            className="rounded-lg transition-all duration-300 group-hover:shadow-lg w-48 h-36"
          />
        </div>
      );
    } else if (fileType === "application/pdf") {
      return (
        <div key={media.id} className="flex flex-col items-center group">
          <div className="bg-gray-100 p-4 rounded-lg transition-all duration-300 group-hover:shadow-lg">
            <LinkOutlined className="text-4xl text-gray-400" />
          </div>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Space>
              <Tooltip title="View">
                <Button
                  type="text"
                  icon={<EyeOutlined />}
                  onClick={() => window.open(fileUrl, "_blank")}
                />
              </Tooltip>
              <Tooltip title="Download">
                <Button
                  type="text"
                  icon={<DownloadOutlined />}
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = fileUrl;
                    link.download = media.file_name;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                />
              </Tooltip>
            </Space>
          </div>
        </div>
      );
    } else {
      return (
        <div key={media.id} className="flex flex-col items-center group">
          <div className="bg-gray-100 p-4 rounded-lg transition-all duration-300 group-hover:shadow-lg">
            <LinkOutlined className="text-4xl text-gray-400" />
          </div>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Tooltip title="Download">
              <Button
                type="text"
                icon={<DownloadOutlined />}
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = fileUrl;
                  link.download = media.file_name;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              />
            </Tooltip>
          </div>
        </div>
      );
    }
  };

  if (preview) {
    return (
      <div className="preview-media-component p-4 bg-gray-100 rounded-md">
        {mediaData ? (
          component?.selectionMode === "multiple" ? (
            <div className="grid grid-cols-2 gap-4">
              {mediaData.map((media) => renderMediaItem(media))}
            </div>
          ) : (
            <div className="flex justify-center">
              {renderMediaItem(mediaData)}
            </div>
          )
        ) : (
          <p className="text-gray-500">No media selected.</p>
        )}
      </div>
    );
  }

  return (
    <div className="border p-4 rounded-md bg-white w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <DragOutlined className="text-2xl border rounded-md p-1" />
          <h3 className="text-xl font-semibold">Media Component</h3>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <>
              <Space>
                {mediaData && (
                  <Tooltip title="Change Media">
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => setIsModalVisible(true)}
                      className="mavebutton"
                    />
                  </Tooltip>
                )}
                <Tooltip title="Duplicate">
                  <Button
                    icon={<CopyFilled />}
                    onClick={onDuplicateElement}
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
            </>
          ) : (
            <>
              <Tooltip title="Save Changes">
                <Button
                  icon={<CheckOutlined />}
                  onClick={handleSubmit}
                  className="mavebutton"
                />
              </Tooltip>
              <Tooltip title="Cancel">
                <Button
                  icon={<CloseOutlined />}
                  onClick={handleCancel}
                  className="mavecancelbutton"
                />
              </Tooltip>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col w-full">
        {!isEditing ? (
          <div className="w-full">
            {mediaData ? (
              component?.selectionMode === "multiple" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                  {mediaData.map((media) => renderMediaItem(media))}
                </div>
              ) : (
                <div className="w-full flex justify-center">
                  {renderMediaItem(mediaData)}
                </div>
              )
            ) : (
              <Button
                icon={<ExportOutlined />}
                onClick={() => setIsModalVisible(true)}
                className="mavebutton w-full md:w-auto"
              >
                Choose Media
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col md:flex-row w-full gap-6">
            {/* Current Media */}
            <div className="w-full md:w-1/2">
              <h4 className="mb-2 text-md font-semibold">Current Media</h4>
              {mediaData ? (
                component?.selectionMode === "multiple" ? (
                  <div className="grid grid-cols-1 gap-4 w-full">
                    {mediaData.map((media) => renderMediaItem(media))}
                  </div>
                ) : (
                  <div className="w-full">{renderMediaItem(mediaData)}</div>
                )
              ) : null}
            </div>

            {/* Selected Media */}
            {selectedMediaData && (
              <div className="w-full md:w-1/2">
                <h4 className="mb-2 text-md font-medium">Selected Media</h4>
                {component?.selectionMode === "multiple" ? (
                  <div className="grid grid-cols-1 gap-4 w-full">
                    {selectedMediaData.map((media) => renderMediaItem(media))}
                  </div>
                ) : (
                  <div className="w-full">
                    {renderMediaItem(selectedMediaData)}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <MediaSelectionModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSelectMedia={handleSelectMedia}
        selectionMode={component?.selectionMode || "single"}
        maxSelection={component?.maxSelection}
        initialSelectedMedia={
          mediaData ? (Array.isArray(mediaData) ? mediaData : [mediaData]) : []
        }
      />
    </div>
  );
};

export default MediaComponent;
