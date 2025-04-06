// components/PageBuilder/Components/VideoComponent.jsx

import React, { useState, useEffect } from "react";
import { Button, Modal, Popconfirm, Typography, message, Carousel } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  ExportOutlined,
  CopyFilled,
  DragOutlined,
} from "@ant-design/icons";
import VideoSelectionModal from "../Modals/VideoSelectionModal";

const { Paragraph } = Typography;

// Helper function to validate and get embed URL
const getEmbedUrl = (url) => {
  if (!url) return null;

  const youtubeMatch = url.match(
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^\s&]+)/
  );
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
  }

  const vimeoMatch = url.match(/(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  // Direct video link
  if (url.match(/\.(mp4|webm|ogg)$/)) {
    return url;
  }

  return null;
};

const VideoComponent = ({
  component,
  updateComponent,
  deleteComponent,
  preview = false,
  onDuplicateElement,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [videoData, setVideoData] = useState(component._mave || {});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setVideoData(component._mave || {});
  }, [component._mave]);

  const handleSelectVideo = (selectedVideo) => {
    updateComponent({
      ...component,
      _mave: selectedVideo,
      id: selectedVideo.url,
    });
    setVideoData(selectedVideo);
    setIsModalVisible(false);
    message.success("Video updated successfully.");
  };

  const handleSubmit = () => {
    if (!videoData || !videoData.url) {
      Modal.error({
        title: "Validation Error",
        content: "No video selected.",
      });
      return;
    }
    setIsEditing(false);
    message.success("Video settings saved.");
  };

  const handleCancel = () => {
    setIsEditing(false);
    message.info("Video update canceled.");
  };

  const handleDelete = () => {
    deleteComponent();
  };

  const renderVideo = () => {
    if (!videoData || !videoData.url) {
      return (
        <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <Button
            icon={<EditOutlined />}
            onClick={() => setIsModalVisible(true)}
            className="mavebutton w-fit"
          >
            Select Video
          </Button>
          <p className="mt-2 text-sm text-gray-500">No video selected</p>
        </div>
      );
    }

    const embedUrl = getEmbedUrl(videoData.url);
    if (!embedUrl) {
      return (
        <div className="p-4 bg-red-50 rounded-lg border border-red-100">
          <Paragraph className="text-red-600">
            Invalid video URL. Please select a valid YouTube, Vimeo, or direct
            video link.
          </Paragraph>
        </div>
      );
    }

    // Determine if it's an iframe embed or direct video
    const isIframe =
      embedUrl.includes("youtube.com") || embedUrl.includes("vimeo.com");

    return (
      <div className="video-container relative w-full overflow-hidden rounded-lg bg-gray-900">
        {isIframe ? (
          <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
            <iframe
              src={embedUrl}
              title="Embedded Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
              onError={(e) => {
                console.error("Video iframe error:", e);
                // Handle iframe loading error
              }}
            />
          </div>
        ) : (
          <video
            src={embedUrl}
            controls
            className="w-full h-auto"
            onError={(e) => {
              console.error("Video loading error:", e);
              // Handle video loading error
            }}
          />
        )}
      </div>
    );
  };

  if (preview) {
    return (
      <div className="preview-video-component p-4 bg-gray-100 rounded-md">
        {videoData && videoData.url ? (
          renderVideo()
        ) : (
          <Paragraph className="text-gray-500">No video selected.</Paragraph>
        )}
      </div>
    );
  }

  return (
    <div className="border p-4 rounded-md bg-white">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <DragOutlined className="text-2xl border rounded-md p-1" />
          <h3 className="text-xl font-semibold">Video Component</h3>
        </div>
        <div>
          {!isEditing ? (
            <>
              {videoData && (
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

      {renderVideo()}

      <VideoSelectionModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSelectVideo={handleSelectVideo}
        initialVideo={videoData}
      />
    </div>
  );
};

export default VideoComponent;
