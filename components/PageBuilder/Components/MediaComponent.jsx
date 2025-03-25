// components/PageBuilder/Components/MediaComponent.jsx

import React, { useState } from "react";
import { Button, Popconfirm, message } from "antd";
import {
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  ArrowRightOutlined,
  ExportOutlined,
  CopyFilled,
  DragOutlined,
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [mediaData, setMediaData] = useState(component._mave);
  const [selectedMediaData, setSelectedMediaData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Handle selection from MediaSelectionModal
  const handleSelectMedia = (selectedMedia) => {
    setSelectedMediaData(selectedMedia);
    setIsModalVisible(false);
    setIsEditing(true);
  };

  // Handle Submit (Confirm) Changes
  const handleSubmit = () => {
    if (component.selectionMode === "multiple") {
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

  // Handle Cancel Changes
  const handleCancel = () => {
    setSelectedMediaData(null);
    setIsEditing(false);
    message.info("Media update canceled.");
  };

  // Handle Delete Component
  const handleDelete = () => {
    deleteComponent();
  };

  // Helper function to render media based on file type
  const renderMediaItem = (media) => {
    const fileUrl = `${process.env.NEXT_PUBLIC_MEDIA_URL}/${media.file_path}`;
    const fileType = media.file_type || "";

    if (fileType.startsWith("image/")) {
      return (
        <Image
          key={media.id}
          src={fileUrl}
          alt={media.title || "Image"}
          width={250}
          height={200}
          objectFit="cover"
          className="rounded-lg"
        />
      );
    } else if (fileType.startsWith("video/")) {
      return (
        <video
          key={media.id}
          src={fileUrl}
          controls
          width={250}
          height={200}
          className="rounded-lg"
        />
      );
    } else if (fileType === "application/pdf") {
      // For PDF files
      return (
        <div key={media.id} className="flex flex-col items-center">
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            {media.title || "View Document"}
          </a>
        </div>
      );
    } else {
      // For other file types
      return (
        <div key={media.id} className="flex flex-col items-center">
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline"
          >
            {media.title || "Download File"}
          </a>
        </div>
      );
    }
  };

  // If in preview mode, render the media content only
  if (preview) {
    return (
      <div className="preview-media-component p-4 bg-gray-100 rounded-md">
        {mediaData ? (
          component.selectionMode === "multiple" ? (
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
    <div className="border p-4 rounded-md bg-white">
      {/* Header with Component Title and Action Buttons */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <DragOutlined className="text-2xl border rounded-md p-1" />
          <h3 className="text-xl font-semibold">Media Component</h3>
        </div>
        <div>
          {!isEditing ? (
            <>
              {mediaData && (
                <Button
                  icon={<ExportOutlined />}
                  onClick={() => setIsModalVisible(true)}
                  className="mavebutton"
                >
                  Change
                </Button>
              )}
              <Button
                icon={<CopyFilled />}
                onClick={onDuplicateElement}
                className="mavebutton"
              />
              <Popconfirm
                title="Are you sure you want to delete this component?"
                onConfirm={handleDelete}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  icon={<DeleteOutlined />}
                  className="mavecancelbutton"
                />
              </Popconfirm>
            </>
          ) : (
            <>
              <Button
                icon={<CheckOutlined />}
                onClick={handleSubmit}
                className="mavebutton"
              >
                Done
              </Button>
              <Button
                icon={<CloseOutlined />}
                onClick={handleCancel}
                className="mavecancelbutton"
              >
                Discard
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Display Current and Selected Media Side by Side */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Current Media */}
        <div className="flex flex-col items-center">
          {mediaData && (
            <h4 className="mb-2 text-md font-semibold">Current Media</h4>
          )}
          {mediaData ? (
            component.selectionMode === "multiple" ? (
              <div className="grid grid-cols-2 gap-4">
                {mediaData.map((media) => renderMediaItem(media))}
              </div>
            ) : (
              renderMediaItem(mediaData)
            )
          ) : (
            <Button
              icon={<ExportOutlined />}
              onClick={() => setIsModalVisible(true)}
              className="mavebutton"
            >
              Choose
            </Button>
          )}
        </div>

        {/* Selected Media (Shown Only When Editing) */}
        {isEditing && selectedMediaData && (
          <div className="flex justify-between items-center">
            <ArrowRightOutlined className="text-2xl mx-20" />
            <div className="flex flex-col items-center">
              <h4 className="mb-2 text-md font-medium">Selected Media</h4>
              {component.selectionMode === "multiple" ? (
                <div className="grid grid-cols-2 gap-4">
                  {selectedMediaData.map((media) => renderMediaItem(media))}
                </div>
              ) : (
                renderMediaItem(selectedMediaData)
              )}
            </div>
          </div>
        )}
      </div>

      {/* Media Selection Modal */}
      <MediaSelectionModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSelect={handleSelectMedia}
        selectionMode={component.selectionMode}
        selectedMedia={mediaData}
      />
    </div>
  );
};

export default MediaComponent;
