// components/slider/SliderForm/MediaSelector.jsx

import React from "react";
import { Button } from "antd";
import { UploadOutlined, CloseCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import Image from "next/image";
import SortableOrderGrid from "./SortableOrderGrid";

const MediaSelector = ({
  selectedMedia,
  setSelectedMedia,
  setIsMediaModalVisible,
  onCreateImage,
  imagePlaceholder,
}) => (
  <div>
    <div className="flex flex-wrap gap-3 mb-4">
      <Button
        icon={<UploadOutlined />}
        onClick={() => setIsMediaModalVisible(true)}
        className="h-10 px-4 bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-blue-600 text-white border-0 font-semibold shadow-md hover:shadow-lg transition-all rounded-lg"
      >
        Select Media
      </Button>
      {onCreateImage && (
        <Button
          icon={<PlusCircleOutlined />}
          onClick={onCreateImage}
          className="h-10 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 font-semibold shadow-md hover:shadow-lg transition-all rounded-lg"
        >
          Create Image
        </Button>
      )}
    </div>
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
