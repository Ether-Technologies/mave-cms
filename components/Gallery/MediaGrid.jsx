import React from "react";
import MediaCard from "./MediaCard";

const MediaGrid = ({
  mediaItems,
  mediaType,
  mediaTypeMap,
  handleEdit,
  handleDelete,
  handlePreview,
  viewType = "grid",
}) => {
  const gridStyle = viewType === "grid"
    ? { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }
    : { display: "flex", flexDirection: "column", gap: 10 };

  const getType = (media) => mediaTypeMap ? mediaTypeMap[media.id] : mediaType;

  return (
    <div style={gridStyle}>
      {mediaItems.map(media => (
        <MediaCard
          key={media.id}
          media={media}
          mediaType={getType(media)}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handlePreview={handlePreview}
          viewType={viewType}
        />
      ))}
    </div>
  );
};

export default MediaGrid;
