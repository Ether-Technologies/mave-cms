import React from "react";
import { List } from "antd";
import MediaItem from "./MediaItem";

const MediaList = ({
  media,
  loading,
  viewMode,
  imageSize,
  selectedMedia,
  onSelectMedia,
}) => {
  const isItemSelected = (item) => {
    return selectedMedia.some(
      (media) => media?.id === item.id || media?.file_path === item.file_path
    );
  };

  return (
    <List
      grid={
        viewMode === "grid"
          ? {
              gutter: 16,
              xs: 1,
              sm: 2,
              md: 3,
              lg: 4,
              xl: 4,
              xxl: 5,
            }
          : null
      }
      dataSource={media}
      loading={loading}
      locale={{ emptyText: "No media items found." }}
      renderItem={(item) => (
        <List.Item>
          <MediaItem
            item={item}
            isSelected={isItemSelected(item)}
            onSelect={onSelectMedia}
            imageSize={imageSize}
            viewMode={viewMode}
          />
        </List.Item>
      )}
    />
  );
};

export default MediaList;
