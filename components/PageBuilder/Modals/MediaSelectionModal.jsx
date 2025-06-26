// components/PageBuilder/Modals/MediaSelectionModal.jsx

import React, { useState, useEffect } from "react";
import {
  Drawer,
  Button,
  message,
  Pagination,
  Tabs,
  Space,
  Badge,
  Tooltip,
  Progress,
} from "antd";
import {
  CloseOutlined,
  CheckOutlined,
  UploadOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import UploadMediaTabs from "../../Gallery/UploadMediaTabs";
import Cloudinary from "../../Gallery/Cloudinary";

// Import new components
import MediaFilters from "./MediaSelectionModal/MediaFilters";
import MediaList from "./MediaSelectionModal/MediaList";
import SettingsDrawer from "./MediaSelectionModal/SettingsDrawer";
import { useMediaData } from "./MediaSelectionModal/useMediaData";

const { TabPane } = Tabs;

const MediaSelectionModal = (props) => {
  const {
    isVisible,
    onClose,
    onSelectMedia,
    selectionMode = "single",
    maxSelection: propMaxSelection,
    initialSelectedMedia = [],
  } = props;

  const maxSelection =
    propMaxSelection !== undefined
      ? propMaxSelection
      : selectionMode === "single"
        ? 1
        : Infinity;

  const [selectedMedia, setSelectedMedia] = useState(initialSelectedMedia);
  const [viewMode, setViewMode] = useState("grid");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [settingsDrawerVisible, setSettingsDrawerVisible] = useState(false);
  const [imageSize, setImageSize] = useState("medium");

  // Use the custom hook for media data management
  const {
    loading,
    sortOrder,
    searchQuery,
    filterType,
    currentPage,
    totalItems,
    pageSize,
    paginatedMedia,
    fetchMedia,
    handleSortChange,
    handleSearchChange,
    handleFilterChange,
    handlePageChange,
  } = useMediaData(isVisible);

  useEffect(() => {
    if (isVisible) {
      setSelectedMedia(initialSelectedMedia);
    }
  }, [isVisible, initialSelectedMedia]);

  const isItemSelected = (item) => {
    return selectedMedia.some(
      (media) => media?.id === item.id || media?.file_path === item.file_path
    );
  };

  const handleSelection = (item) => {
    if (selectionMode === "single") {
      setSelectedMedia([item]);
    } else {
      if (isItemSelected(item)) {
        setSelectedMedia(selectedMedia.filter((media) => media.id !== item.id));
      } else if (selectedMedia.length >= maxSelection) {
        if (maxSelection !== Infinity) {
          message.warning(`You can select up to ${maxSelection} images.`);
        }
      } else {
        setSelectedMedia([...selectedMedia, item]);
      }
    }
  };

  const handleSubmit = () => {
    if (selectedMedia.length === 0) {
      message.warning("Please select at least one media item.");
      return;
    }
    const selected =
      selectionMode === "single" ? selectedMedia[0] : selectedMedia;
    onSelectMedia(selected);
    onClose();
  };

  const handleUploadSuccess = (uploadedMedia) => {
    if (!uploadedMedia) {
      console.error("Upload failed or no media returned.");
      return;
    }
    fetchMedia();

    if (selectionMode === "single") {
      const singleMedia = Array.isArray(uploadedMedia)
        ? uploadedMedia[0]
        : uploadedMedia;
      if (singleMedia) {
        setSelectedMedia([singleMedia]);
        onSelectMedia([singleMedia]);
        onClose();
      } else {
        message.error("No media selected after upload.");
      }
    } else {
      const newSelected = Array.isArray(uploadedMedia)
        ? [...selectedMedia, ...uploadedMedia]
        : [...selectedMedia, uploadedMedia];

      const validSelected = newSelected.filter((media) => media);
      setSelectedMedia(validSelected);
      onSelectMedia(validSelected);
    }

    message.success("Media uploaded and selected successfully.");
  };

  return (
    <>
      <Drawer
        title={
          <div className="flex justify-between items-center mr-10">
            <span>Select Media</span>
            <div className="flex items-center gap-4">
              <Badge count={selectedMedia.length} showZero>
                <span className="text-sm text-gray-500">Selected Items</span>
              </Badge>
              <Tooltip title="Display Settings">
                <Button
                  icon={<SettingOutlined />}
                  onClick={() => setSettingsDrawerVisible(true)}
                />
              </Tooltip>
            </div>
          </div>
        }
        placement="right"
        width={800}
        onClose={onClose}
        open={isVisible}
        extra={
          <Space>
            <Button onClick={onClose} icon={<CloseOutlined />}>
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={handleSubmit}
              icon={<CheckOutlined />}
              disabled={selectedMedia.length === 0}
            >
              Select
            </Button>
          </Space>
        }
      >
        <div className="flex flex-col h-full">
          <MediaFilters
            filterType={filterType}
            onFilterChange={handleFilterChange}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onRefresh={fetchMedia}
          />

          {isUploading && (
            <div className="mb-4">
              <Progress percent={uploadProgress} status="active" />
            </div>
          )}

          <Tabs defaultActiveKey="1" className="flex-1">
            <TabPane tab="Native Storage" key="1">
              <MediaList
                media={paginatedMedia}
                loading={loading}
                viewMode={viewMode}
                imageSize={imageSize}
                selectedMedia={selectedMedia}
                onSelectMedia={handleSelection}
              />
            </TabPane>
            <TabPane tab="Upload" key="2">
              <UploadMediaTabs
                onUploadSuccess={handleUploadSuccess}
                addMedia={(media) => {
                  fetchMedia();
                  if (media) {
                    handleUploadSuccess(media);
                  }
                }}
              />
            </TabPane>
            <TabPane tab="Cloudinary" key="3">
              <Cloudinary />
            </TabPane>
          </Tabs>

          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalItems}
              onChange={handlePageChange}
              showSizeChanger={false}
              showQuickJumper
              showTotal={(total) => `Total ${total} items`}
            />
            {process.env.NEXT_PUBLIC_CLOUDINARY_STATUS === "activated" && (
              <Button
                type="primary"
                icon={<UploadOutlined />}
                onClick={() => setActiveTab("2")}
              >
                Upload Media
              </Button>
            )}
          </div>
        </div>
      </Drawer>

      <SettingsDrawer
        visible={settingsDrawerVisible}
        onClose={() => setSettingsDrawerVisible(false)}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        imageSize={imageSize}
        onImageSizeChange={setImageSize}
      />
    </>
  );
};

export default MediaSelectionModal;
