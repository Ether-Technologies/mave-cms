// components/PageBuilder/Components/GalleryComponent.jsx

import React, { useState, useEffect } from "react";
import {
  Button,
  Drawer,
  Typography,
  message,
  Carousel,
  Popconfirm,
  Space,
  Tooltip,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CopyFilled,
  DragOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import GallerySelectionModal from "../Modals/GallerySelectionModal/GallerySelectionModal";
import Image from "next/image";

const { Paragraph } = Typography;

const GalleryComponent = ({
  component,
  updateComponent,
  deleteComponent,
  preview = false,
  onDuplicateElement,
}) => {
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [galleryData, setGalleryData] = useState(component._mave || {});
  const [lightboxVisible, setLightboxVisible] = useState(false);
  const [currentMedia, setCurrentMedia] = useState(null);

  useEffect(() => {
    setGalleryData(component._mave || {});
  }, [component._mave]);

  const handleSelectGallery = (newGalleryData) => {
    updateComponent({
      ...component,
      _mave: newGalleryData,
      id: component._id,
    });
    setGalleryData(newGalleryData);
    setIsDrawerVisible(false);
    message.success("Gallery updated successfully.");
  };

  const handleDelete = () => {
    deleteComponent();
  };

  const openLightbox = (media) => {
    setCurrentMedia(media);
    setLightboxVisible(true);
  };

  const renderMediaItem = (media) => {
    const fileUrl = `${process.env.NEXT_PUBLIC_MEDIA_URL}/${media.file_path}`;
    const fileType = media.file_type || "";

    if (fileType.startsWith("image/")) {
      return (
        <div
          key={media.id}
          className="media-item group relative overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          onClick={() => openLightbox(media)}
          style={{ cursor: "pointer" }}
        >
          <Image
            src={fileUrl}
            alt={media.title || "Media"}
            width={300}
            height={200}
            objectFit="cover"
            layout="responsive"
            placeholder="blur"
            blurDataURL="/Image_Placeholder.png"
            className="transform transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <SettingOutlined className="text-white opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-300" />
          </div>
        </div>
      );
    } else if (fileType.startsWith("video/")) {
      return (
        <div
          key={media.id}
          className="media-item group relative overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          onClick={() => openLightbox(media)}
          style={{ cursor: "pointer" }}
        >
          <video
            src={fileUrl}
            width="100%"
            height="auto"
            controls
            className="transform transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <SettingOutlined className="text-white opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-300" />
          </div>
        </div>
      );
    } else if (fileType === "application/pdf") {
      return (
        <div
          key={media.id}
          className="media-item group relative overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          onClick={() => openLightbox(media)}
          style={{
            cursor: "pointer",
            width: "100%",
            height: "auto",
            backgroundColor: "#f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <Typography.Text
            strong
            className="group-hover:text-blue-600 transition-colors duration-200"
          >
            {media.title || "View Document"}
          </Typography.Text>
        </div>
      );
    } else {
      return (
        <div
          key={media.id}
          className="media-item group relative overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          onClick={() => openLightbox(media)}
          style={{
            cursor: "pointer",
            width: "100%",
            height: "auto",
            backgroundColor: "#f0f0f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <Typography.Text
            strong
            className="group-hover:text-blue-600 transition-colors duration-200"
          >
            {media.title || "Download File"}
          </Typography.Text>
        </div>
      );
    }
  };

  const renderGallery = () => {
    if (!galleryData.images || galleryData.images.length === 0) {
      return (
        <Paragraph className="text-gray-500 italic">
          No media selected.
        </Paragraph>
      );
    }

    switch (galleryData.layout) {
      case "grid":
        return (
          <div
            className="grid-gallery"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${
                galleryData.settings.columns || 3
              }, 1fr)`,
              gap: `${galleryData.settings.spacing || 16}px`,
            }}
          >
            {galleryData.images?.map((media) => renderMediaItem(media))}
          </div>
        );
      case "masonry":
        return (
          <div
            className="masonry-gallery"
            style={{
              columnCount: galleryData.settings.columns || 3,
              columnGap: `${galleryData.settings.spacing || 16}px`,
            }}
          >
            {galleryData.images?.map((media) => (
              <div
                key={media.id}
                className="masonry-item"
                style={{
                  marginBottom: `${galleryData.settings.spacing || 16}px`,
                }}
              >
                {renderMediaItem(media)}
              </div>
            ))}
          </div>
        );
      case "carousel":
        return (
          <Carousel
            autoplay
            dotPosition="bottom"
            style={{ maxWidth: "800px", margin: "0 auto" }}
            className="rounded-lg overflow-hidden shadow-md"
          >
            {galleryData.images?.map((media) => (
              <div key={media.id} onClick={() => openLightbox(media)}>
                {media.file_type.startsWith("image/") ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${media.file_path}`}
                    alt={media.alt || "Gallery Image"}
                    width={800}
                    height={450}
                    objectFit="cover"
                    layout="responsive"
                    placeholder="blur"
                    blurDataURL="/Image_Placeholder.png"
                    className="rounded-lg"
                  />
                ) : media.file_type.startsWith("video/") ? (
                  <video
                    src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${media.file_path}`}
                    width="100%"
                    height="auto"
                    controls
                    className="rounded-lg"
                  />
                ) : (
                  renderMediaItem(media)
                )}
              </div>
            ))}
          </Carousel>
        );
      default:
        return (
          <Paragraph className="text-red-500">
            Unknown gallery layout.
          </Paragraph>
        );
    }
  };

  if (preview) {
    return (
      <div className="preview-gallery-component p-4 bg-gray-50 rounded-lg shadow-sm">
        {renderGallery()}
        {currentMedia && (
          <Drawer
            title="Media Preview"
            placement="right"
            onClose={() => setLightboxVisible(false)}
            open={lightboxVisible}
            width="60%"
            className="media-preview-drawer"
          >
            {currentMedia.file_type.startsWith("image/") ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${currentMedia.file_path}`}
                alt={currentMedia.alt || "Gallery Image"}
                width={1200}
                height={800}
                objectFit="contain"
                layout="responsive"
                className="rounded-lg"
              />
            ) : currentMedia.file_type.startsWith("video/") ? (
              <video
                src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${currentMedia.file_path}`}
                width="100%"
                height="auto"
                controls
                className="rounded-lg"
              />
            ) : currentMedia.file_type === "application/pdf" ? (
              <iframe
                src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${currentMedia.file_path}`}
                width="100%"
                height="800px"
                className="rounded-lg"
              />
            ) : (
              <div className="text-center p-8">
                <Typography.Text strong className="text-lg">
                  {currentMedia.title || "Download File"}
                </Typography.Text>
              </div>
            )}
          </Drawer>
        )}
      </div>
    );
  }

  return (
    <div className="border border-gray-200 p-6 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <DragOutlined className="text-2xl text-gray-400 border rounded-md p-1.5 hover:bg-gray-50 transition-colors duration-200" />
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Gallery Component
            </h3>
            <p className="text-sm text-gray-500">
              {galleryData.images?.length || 0}{" "}
              {galleryData.images?.length === 1 ? "item" : "items"}
            </p>
          </div>
        </div>
        <Space>
          <Tooltip title="Edit Gallery">
            <Button
              icon={<EditOutlined />}
              onClick={() => setIsDrawerVisible(true)}
              className="flex items-center gap-2 hover:bg-blue-50"
            >
              Edit
            </Button>
          </Tooltip>
          <Tooltip title="Duplicate Gallery">
            <Button
              icon={<CopyFilled />}
              onClick={onDuplicateElement}
              className="hover:bg-gray-50"
            />
          </Tooltip>
          <Popconfirm
            title="Are you sure you want to delete this gallery?"
            description="This action cannot be undone."
            onConfirm={handleDelete}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete Gallery">
              <Button
                icon={<DeleteOutlined />}
                danger
                className="hover:bg-red-50"
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      </div>

      {renderGallery()}

      <GallerySelectionModal
        isVisible={isDrawerVisible}
        onClose={() => setIsDrawerVisible(false)}
        onSelectGallery={handleSelectGallery}
        initialGallery={galleryData}
      />
    </div>
  );
};

export default GalleryComponent;
