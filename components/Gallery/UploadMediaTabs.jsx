import React from "react";
import { Tabs } from "antd";
import UploadMedia from "./UploadMedia";
import GrabFromWeb from "./GrabFromWeb";
import { addMediaToDB } from "../../utils/indexedDB"; // Import the function

const { TabPane } = Tabs;

const UploadMediaTabs = ({ onUploadSuccess, addMedia }) => {
  return (
    <Tabs defaultActiveKey="1" type="card" centered>
      {/* Native Storage */}
      <TabPane tab="Native Storage" key="1">
        <UploadMedia
          onUploadSuccess={(newMedia) => {
            onUploadSuccess(newMedia); // Call the callback with new media
            addMedia(newMedia); // Add media to IndexedDB
          }}
          selectionMode="multiple"
          onSelectMedia={(media) => onUploadSuccess(media)}
          uploadDestination="native"
          addMediaToDB={addMediaToDB}
        />
      </TabPane>

      {/* Grab from Web */}
      <TabPane tab="Grab from Web" key="2">
        <GrabFromWeb
          onUploadSuccess={(newMedia) => {
            onUploadSuccess(newMedia); // Call the callback with new media
            addMedia(newMedia); // Add media to IndexedDB
          }}
          addMediaToDB={addMediaToDB}
        />
      </TabPane>

      {/* Cloudinary */}
      {process.env.NEXT_PUBLIC_CLOUDINARY_STATUS === "activated" && (
        <TabPane tab="Cloudinary" key="3">
          <UploadMedia
            onUploadSuccess={(newMedia) => {
              onUploadSuccess(newMedia); // Call the callback with new media
              addMedia(newMedia); // Add media to IndexedDB
            }}
            selectionMode="multiple"
            onSelectMedia={(media) => onUploadSuccess(media)}
            uploadDestination="cloudinary"
            addMediaToDB={addMediaToDB}
          />
        </TabPane>
      )}
    </Tabs>
  );
};

export default UploadMediaTabs;
