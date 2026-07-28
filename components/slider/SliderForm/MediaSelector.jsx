// components/slider/SliderForm/MediaSelector.jsx

import React from "react";
import { Button } from "antd";
import { UploadOutlined, CloseCircleOutlined } from "@ant-design/icons";
import Image from "next/image";

const MediaSelector = ({
  selectedMedia,
  setSelectedMedia,
  setIsMediaModalVisible,
  imagePlaceholder,
}) => (
  <div>
    <Button
      icon={<UploadOutlined />}
      onClick={() => setIsMediaModalVisible(true)}
      className="mavebutton"
    >
      Select Media
    </Button>
    {selectedMedia.length > 0 ? (
      <div className="mt-4 grid grid-cols-3 gap-4">
        {selectedMedia?.map((media) => (
          <div key={media?.id} className="relative">
            <Image
              src={
                media?.file_path
                  ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/${media.file_path}`
                  : imagePlaceholder
              }
              alt={media?.file_name || "Image Unavailable"}
              width={100}
              height={100}
              className="rounded-md object-cover"
              fallback={imagePlaceholder}
            />
            <Button
              type="text"
              icon={<CloseCircleOutlined className="text-gray-800" />}
              onClick={() =>
                setSelectedMedia(selectedMedia.filter((m) => m.id !== media.id))
              }
              className="absolute top-0 right-0"
            />
          </div>
        ))}
      </div>
    ) : (
      <div className="mt-4 text-gray-500">No media selected.</div>
    )}
  </div>
);

export default MediaSelector;
