// components/slider/SliderForm/MediaSelector.jsx

import React from "react";
import { Button } from "antd";
import { UploadOutlined, CloseCircleOutlined } from "@ant-design/icons";
import Image from "next/image";
import SortableOrderGrid from "./SortableOrderGrid";

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
    <SortableOrderGrid
      items={selectedMedia}
      onReorder={setSelectedMedia}
      emptyMessage="No media selected."
      renderItem={(media) => (
        <div className="relative">
          <Image
            src={
              media?.file_path
                ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/${media.file_path}`
                : imagePlaceholder
            }
            alt={media?.file_name || "Image Unavailable"}
            width={100}
            height={100}
            className="rounded-md object-cover w-full aspect-square"
            fallback={imagePlaceholder}
          />
          <Button
            type="text"
            icon={<CloseCircleOutlined className="text-red-500" />}
            onClick={() =>
              setSelectedMedia(selectedMedia.filter((m) => m.id !== media.id))
            }
            className="absolute top-0 right-0"
          />
        </div>
      )}
    />
  </div>
);

export default MediaSelector;
