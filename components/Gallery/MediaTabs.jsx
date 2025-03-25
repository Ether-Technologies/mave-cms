// components/Gallery/MediaTabs.jsx

import React from "react";
import { Tabs } from "antd";
import MediaGrid from "./MediaGrid";
import Cloudinary from "./Cloudinary";

const { TabPane } = Tabs;

const MediaTabs = ({
  images,
  videos,
  docs,
  handleEdit,
  handleDelete,
  handlePreview,
  availableTags,
}) => {
  // Filter documents by type
  const officeDocs = docs.filter(
    (doc) =>
      doc.file_type.includes("word") ||
      doc.file_type.includes("excel") ||
      doc.file_type.includes("powerpoint")
  );

  const otherDocs = docs.filter(
    (doc) =>
      !doc.file_type.includes("word") &&
      !doc.file_type.includes("excel") &&
      !doc.file_type.includes("powerpoint")
  );

  return (
    <Tabs defaultActiveKey="1" centered animated type="card">
      <TabPane tab={`Images (${images.length})`} key="1">
        <MediaGrid
          mediaItems={images}
          mediaType="image"
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handlePreview={handlePreview}
          availableTags={availableTags}
        />
      </TabPane>
      <TabPane tab={`Videos (${videos.length})`} key="2">
        <MediaGrid
          mediaItems={videos}
          mediaType="video"
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handlePreview={handlePreview}
          availableTags={availableTags}
        />
      </TabPane>
      <TabPane tab={`Office Docs (${officeDocs.length})`} key="3">
        <MediaGrid
          mediaItems={officeDocs}
          mediaType="document"
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handlePreview={handlePreview}
          availableTags={availableTags}
        />
      </TabPane>
      <TabPane tab={`Other Docs (${otherDocs.length})`} key="4">
        <MediaGrid
          mediaItems={otherDocs}
          mediaType="document"
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handlePreview={handlePreview}
          availableTags={availableTags}
        />
      </TabPane>
      <TabPane tab="Cloudinary" key="5">
        <Cloudinary availableTags={availableTags} />
      </TabPane>
    </Tabs>
  );
};

export default MediaTabs;
