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
}) => {
  return (
    <Tabs defaultActiveKey="1" centered animated type="card">
      <TabPane tab="Images" key="1">
        <MediaGrid
          mediaItems={images}
          mediaType="image"
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handlePreview={handlePreview}
        />
      </TabPane>
      <TabPane tab="Videos" key="2">
        <MediaGrid
          mediaItems={videos}
          mediaType="video"
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handlePreview={handlePreview}
        />
      </TabPane>
      <TabPane tab="Docs" key="3">
        <MediaGrid
          mediaItems={docs}
          mediaType="document"
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          handlePreview={handlePreview}
        />
      </TabPane>

      <TabPane tab="Cloudinary" key="4">
        <Cloudinary />
      </TabPane>
    </Tabs>
  );
};

export default MediaTabs;
