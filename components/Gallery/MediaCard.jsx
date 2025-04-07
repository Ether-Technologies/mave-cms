import React from "react";
import { Card, Button, Tag, Popconfirm } from "antd";
import { DeleteOutlined, EyeOutlined } from "@ant-design/icons";
import Image from "next/image";

const { Meta } = Card;

const MediaCard = ({ media, mediaType, handleDelete, handlePreview }) => {
  // Render tags with horizontal scroll and consistent height
  const renderTags = () => {
    return (
      <div className="mt-2 flex space-x-2 overflow-x-auto no-scrollbar min-h-[24px]">
        {media.tags && media.tags.length > 0 ? (
          media.tags.map((t) => (
            <Tag color="orange" key={t} className="flex-shrink-0">
              {t}
            </Tag>
          ))
        ) : (
          <div className="invisible">No Tags</div> // Placeholder for consistent height
        )}
      </div>
    );
  };

  const actions = [
    <Button
      type="link"
      icon={<EyeOutlined />}
      onClick={() => handlePreview(media)}
      key="preview"
      className="hover:text-green-500"
    />,
    <Popconfirm
      title="Are you sure you want to delete this media?"
      onConfirm={() => handleDelete(media.id)}
      okText="Yes"
      cancelText="No"
      key="delete"
    >
      <Button
        type="link"
        icon={<DeleteOutlined />}
        danger
        className="hover:text-red-500"
      />
    </Popconfirm>,
  ];

  // Check if the media is an image and has a supported format
  const isSupportedImageFormat = () => {
    const supportedFormats = [
      "image/png",
      "image/jpg",
      "image/jpeg",
      "image/svg+xml",
      "image/webp",
      "image/gif",
    ];
    return supportedFormats.includes(media.file_type);
  };

  // Render media content based on type
  const renderMedia = () => {
    if (mediaType === "image") {
      if (isSupportedImageFormat()) {
        return (
          <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-64">
            <Image
              src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${media.file_path}`}
              alt={media.file_name}
              width={300}
              height={200}
              sizes="(max-width: 768px) 100vw, 33vw"
              quality={80}
              loading="lazy"
              placeholder="blur"
              blurDataURL="/images/Image_Placeholder.png"
              style={{
                objectPosition: "center",
                width: "100%",
                height: "100%",
              }}
              objectFit="cover"
              className="rounded-t-md"
            />
          </div>
        );
      } else {
        return (
          <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-64">
            <Image
              src="/images/Image_Placeholder.png"
              alt="Unsupported Image Format"
              width={300}
              height={200}
              sizes="(max-width: 768px) 100vw, 33vw"
              quality={80}
              loading="lazy"
              placeholder="blur"
              blurDataURL="/images/Image_Placeholder.png"
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
              }}
              className="rounded-t-md"
            />
          </div>
        );
      }
    } else if (mediaType === "video") {
      return (
        <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-64">
          <div className="absolute inset-0 bg-gray-900 rounded-t-md overflow-hidden">
            <Image
              src={media.thumbnail_url || "/images/Video_Placeholder.png"}
              alt={media.file_name}
              width={300}
              height={200}
              sizes="(max-width: 768px) 100vw, 33vw"
              quality={80}
              loading="lazy"
              style={{
                objectFit: "cover",
                width: "100%",
                height: "100%",
              }}
              className="rounded-t-md"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center group-hover:bg-opacity-50 transition-all duration-300">
              <div className="w-12 h-12 rounded-full bg-black bg-opacity-50 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 px-2 py-1 rounded text-white text-xs">
                <svg
                  className="w-4 h-4 inline-block mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Video
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      // Document preview
      const isOfficeDoc =
        media.file_type.includes("word") ||
        media.file_type.includes("excel") ||
        media.file_type.includes("powerpoint");

      return (
        <div className="flex items-center justify-center h-48 sm:h-56 md:h-64 lg:h-64 bg-gray-100 rounded-t-md">
          <div className="text-center">
            <div className="text-4xl mb-2">
              {isOfficeDoc ? (
                <svg
                  className="w-16 h-16 mx-auto text-blue-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                </svg>
              ) : (
                <svg
                  className="w-16 h-16 mx-auto text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                </svg>
              )}
            </div>
            <p className="text-sm text-gray-600">{media.file_name}</p>
          </div>
        </div>
      );
    }
  };

  return (
    <Card
      hoverable
      cover={renderMedia()}
      actions={actions}
      className="media-card shadow-md rounded-md overflow-hidden"
    >
      <Meta
        className="pt-6"
        title={media.title || media.file_name}
        description={
          <>
            <p className="text-gray-500 text-sm truncate">{media.file_name}</p>
            {renderTags()}
          </>
        }
      />
    </Card>
  );
};

export default MediaCard;
