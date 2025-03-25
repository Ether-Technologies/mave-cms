// components/PageBuilder/Components/GalleryComponent.jsx

import React, { useState, useEffect } from "react";
import { Button, Modal, Typography, message, Carousel, Popconfirm } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CopyFilled,
  DragOutlined,
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
  const [isModalVisible, setIsModalVisible] = useState(false);
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
    setIsModalVisible(false);
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
          className="media-item"
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
          />
        </div>
      );
    } else if (fileType.startsWith("video/")) {
      return (
        <div
          key={media.id}
          className="media-item"
          onClick={() => openLightbox(media)}
          style={{ cursor: "pointer" }}
        >
          <video src={fileUrl} width="100%" height="auto" controls />
        </div>
      );
    } else if (fileType === "application/pdf") {
      return (
        <div
          key={media.id}
          className="media-item"
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
          <Typography.Text strong>
            {media.title || "View Document"}
          </Typography.Text>
        </div>
      );
    } else {
      return (
        <div
          key={media.id}
          className="media-item"
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
          <Typography.Text strong>
            {media.title || "Download File"}
          </Typography.Text>
        </div>
      );
    }
  };

  const renderGallery = () => {
    if (!galleryData.images || galleryData.images.length === 0) {
      return <Paragraph>No media selected.</Paragraph>;
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
                  />
                ) : media.file_type.startsWith("video/") ? (
                  <video
                    src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${media.file_path}`}
                    width="100%"
                    height="auto"
                    controls
                  />
                ) : (
                  renderMediaItem(media)
                )}
              </div>
            ))}
          </Carousel>
        );
      default:
        return <Paragraph>Unknown gallery layout.</Paragraph>;
    }
  };

  if (preview) {
    return (
      <div className="preview-gallery-component p-4 bg-gray-100 rounded-md">
        {renderGallery()}
        {currentMedia && (
          <Modal
            open={lightboxVisible}
            footer={null}
            onCancel={() => setLightboxVisible(false)}
            centered
            width="60%"
          >
            {currentMedia.file_type.startsWith("image/") ? (
              <Image
                src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${currentMedia.file_path}`}
                alt={currentMedia.alt || "Gallery Image"}
                width={1200}
                height={800}
                objectFit="contain"
                layout="responsive"
              />
            ) : currentMedia.file_type.startsWith("video/") ? (
              <video
                src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${currentMedia.file_path}`}
                width="100%"
                height="auto"
                controls
              />
            ) : currentMedia.file_type === "application/pdf" ? (
              <iframe
                src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${currentMedia.file_path}`}
                width="100%"
                height="800px"
              />
            ) : (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <Typography.Text strong>
                  {currentMedia.title || "Download File"}
                </Typography.Text>
              </div>
            )}
          </Modal>
        )}
      </div>
    );
  }

  return (
    <div className="border p-4 rounded-md bg-white">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <DragOutlined className="text-2xl border rounded-md p-1" />
          <h3 className="text-xl font-semibold">Gallery Component</h3>
        </div>
        <div>
          <Button
            icon={<EditOutlined />}
            onClick={() => setIsModalVisible(true)}
            className="mavebutton"
          >
            Change
          </Button>
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
            <Button icon={<DeleteOutlined />} className="mavecancelbutton" />
          </Popconfirm>
        </div>
      </div>

      {renderGallery()}

      <GallerySelectionModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSelectGallery={handleSelectGallery}
        initialGallery={galleryData}
      />
    </div>
  );
};

export default GalleryComponent;
