// components/PageBuilder/Modals/MediaSelectionModal.jsx

import React, { useState, useEffect, useRef } from "react";
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

  // Use ref to maintain stable selection state
  const selectedMediaRef = useRef(initialSelectedMedia);

  // Use callback to update ref when state changes
  const updateSelectionRef = (newSelection) => {
    selectedMediaRef.current = newSelection;
  };

  // Use a more stable selection state
  const [stableSelectedMedia, setStableSelectedMedia] =
    useState(initialSelectedMedia);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVisible]);

  // Debug: Track selectedMedia changes
  useEffect(() => {
    console.log("🔴 selectedMedia state changed to:", selectedMedia);
  }, [selectedMedia]);

  const isItemSelected = (item) => {
    const selected = selectedMediaRef.current.some(
      (media) => media?.id === item.id || media?.file_path === item.file_path
    );
    console.log("Checking if item is selected:", item.id, selected);
    return selected;
  };

  const handleSelection = (item) => {
    console.log("🔵 Selection triggered for item:", item.id);
    console.log("🔵 Current selectedMedia before:", selectedMediaRef.current);

    if (selectionMode === "single") {
      const newSelection = [item];
      setSelectedMedia(newSelection);
      updateSelectionRef(newSelection);
      console.log("🔵 Single selection - setting to:", newSelection);
    } else {
      if (isItemSelected(item)) {
        const newSelected = selectedMediaRef.current.filter(
          (media) => media.id !== item.id
        );
        setSelectedMedia(newSelected);
        updateSelectionRef(newSelected);
        console.log(
          "🔵 Multiple selection - removing item, new selection:",
          newSelected
        );
      } else if (selectedMediaRef.current.length >= maxSelection) {
        if (maxSelection !== Infinity) {
          message.warning(`You can select up to ${maxSelection} images.`);
        }
      } else {
        const newSelected = [...selectedMediaRef.current, item];
        setSelectedMedia(newSelected);
        updateSelectionRef(newSelected);
        console.log(
          "🔵 Multiple selection - adding item, new selection:",
          newSelected
        );
      }
    }
  };

  const handleSubmit = () => {
    console.log(
      "Submit triggered with selectedMedia:",
      selectedMediaRef.current
    );
    if (selectedMediaRef.current.length === 0) {
      message.warning("Please select at least one media item.");
      return;
    }
    const selected =
      selectionMode === "single"
        ? selectedMediaRef.current[0]
        : selectedMediaRef.current;
    console.log("Calling onSelectMedia with:", selected);
    onSelectMedia(selected);
    console.log("Calling onClose");
    onClose();
  };

  const handleUploadSuccess = (uploadedMedia) => {
    if (!uploadedMedia) {
      console.error("Upload failed or no media returned.");
      return;
    }
    fetchMedia();

    // Don't automatically select uploaded media - let user choose
    message.success(
      "Media uploaded successfully. You can now select it from the list."
    );
  };

  return (
    <>
      <Drawer
        title={
          <div className="flex justify-between items-center mr-10">
            <span>Select Media</span>
            <div className="flex items-center gap-4">
              <Badge count={selectedMediaRef.current.length} showZero>
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
              disabled={selectedMediaRef.current.length === 0}
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
                  // Don't automatically select uploaded media
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
