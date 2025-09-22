import React from "react";
import { Tabs } from "antd";
import UploadMedia from "./UploadMedia";
import GrabFromWeb from "./GrabFromWeb";
import { addMediaToDB } from "../../utils/indexedDB"; // Import the function

// Remove deprecated TabPane usage

const UploadMediaTabs = ({ onUploadSuccess, addMedia }) => {
  const tabItems = [
    {
      key: "1",
      label: "Native Storage",
      children: (
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
      ),
    },
    {
      key: "2",
      label: "Grab from Web",
      children: (
        <GrabFromWeb
          onUploadSuccess={(newMedia) => {
            onUploadSuccess(newMedia); // Call the callback with new media
            addMedia(newMedia); // Add media to IndexedDB
          }}
          addMediaToDB={addMediaToDB}
        />
      ),
    },
  ];

  // Add Cloudinary tab if activated
  if (process.env.NEXT_PUBLIC_CLOUDINARY_STATUS === "activated") {
    tabItems.push({
      key: "3",
      label: "Cloudinary",
      children: (
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
      ),
    });
  }

  return <Tabs defaultActiveKey="1" type="card" centered items={tabItems} />;
};

export default UploadMediaTabs;
