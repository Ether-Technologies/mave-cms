import React from "react";
import { Tag } from "antd";
import { EyeOutlined, InboxOutlined } from "@ant-design/icons";
import Image from "next/image";

const MediaItem = ({ item, isSelected, onSelect, imageSize, viewMode }) => {
  const getImageSizeClass = () => {
    switch (imageSize) {
      case "small":
        return "w-32 h-24";
      case "medium":
        return "w-48 h-36";
      case "large":
        return "w-64 h-48";
      default:
        return "w-48 h-36";
    }
  };

  const getDisplayTitle = () => {
    if (item.title) {
      return item.title;
    }
    // If no title, show filename (which already includes extension)
    return item.file_name;
  };

  const getFileTypeTag = () => {
    if (item.file_type.startsWith("image/")) {
      return { color: "yellow", text: "Image" };
    } else if (item.file_type.startsWith("video/")) {
      return { color: "red", text: "Video" };
    } else {
      return { color: "green", text: "Document" };
    }
  };

  const fileTypeTag = getFileTypeTag();

  return (
    <div
      className={`relative border-2 rounded-md cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isSelected
          ? "border-theme shadow-md"
          : "border-transparent hover:border-gray-200"
      }`}
      onClick={() => onSelect(item)}
    >
      {item.file_type.startsWith("image/") ? (
        <Image
          src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${item.file_path}`}
          alt={getDisplayTitle()}
          width={
            imageSize === "small" ? 128 : imageSize === "large" ? 256 : 192
          }
          height={
            imageSize === "small" ? 96 : imageSize === "large" ? 192 : 144
          }
          objectFit="cover"
          layout="responsive"
          className={`rounded-md ${getImageSizeClass()}`}
        />
      ) : item.file_type.startsWith("video/") ? (
        <div className="relative">
          <video
            src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${item.file_path}`}
            className={`rounded-md w-full ${
              viewMode === "grid" ? "h-28" : "h-48"
            } object-cover`}
            muted
            preload="metadata"
          />
          <div className="absolute inset-0 flex justify-center items-center">
            <EyeOutlined className="text-white text-3xl opacity-75" />
          </div>
        </div>
      ) : (
        <div className="document-preview flex flex-col items-center justify-center h-48 bg-gray-100 rounded-md">
          <InboxOutlined className="text-4xl text-gray-400" />
          <p className="mt-2 text-center text-sm font-medium truncate w-40">
            {getDisplayTitle()}
          </p>
        </div>
      )}

      <div className="absolute top-2 left-2">
        <Tag color={fileTypeTag.color}>{fileTypeTag.text}</Tag>
      </div>

      <p className="mt-2 text-center text-sm font-medium truncate">
        {getDisplayTitle()}
      </p>

      {isSelected && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center rounded-md">
          <span className="text-white text-lg font-semibold">Selected</span>
        </div>
      )}
    </div>
  );
};

export default MediaItem;
