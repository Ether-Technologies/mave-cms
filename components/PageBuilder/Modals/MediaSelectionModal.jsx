// components/PageBuilder/Modals/MediaSelectionModal.jsx

import React, { useState, useEffect } from "react";
import {
  Drawer,
  List,
  Button,
  message,
  Select,
  Pagination,
  Tabs,
  Input,
  Space,
  Radio,
  Tooltip,
  Badge,
  Tag,
  Progress,
  Divider,
} from "antd";
import {
  EyeOutlined,
  InboxOutlined,
  SyncOutlined,
  CloseOutlined,
  CheckOutlined,
  UploadOutlined,
  CloudUploadOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  SortDescendingOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import instance from "../../../axios";
import Image from "next/image";
import UploadMediaTabs from "../../Gallery/UploadMediaTabs";
import Cloudinary from "../../Gallery/Cloudinary";

const { Option } = Select;
const { TabPane } = Tabs;
const { Search } = Input;

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

  const [mediaList, setMediaList] = useState([]);
  const [sortedMedia, setSortedMedia] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedMedia, setSelectedMedia] = useState(initialSelectedMedia);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [filterType, setFilterType] = useState("all");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [settingsDrawerVisible, setSettingsDrawerVisible] = useState(false);
  const [imageSize, setImageSize] = useState("medium");

  const pageSize = viewMode === "grid" ? 12 : 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    if (isVisible) {
      fetchMedia();
      setSelectedMedia(initialSelectedMedia);
      setSearchQuery("");
      setCurrentPage(1);
    }
  }, [isVisible]);

  const fetchMedia = async () => {
    setLoading(true);
    try {
      const response = await instance.get("/media");
      setMediaList(response.data);
      const filteredAndSorted = filterAndSortMedia(
        response.data,
        searchQuery,
        sortOrder,
        filterType
      );
      setSortedMedia(filteredAndSorted);
      setTotalItems(filteredAndSorted.length);
    } catch (error) {
      message.error("Failed to fetch media items.");
    }
    setLoading(false);
  };

  const filterAndSortMedia = (list, query, order, type) => {
    let filtered = list;

    if (type !== "all") {
      filtered = filtered.filter((media) => {
        if (type === "image") return media.file_type.startsWith("image/");
        if (type === "video") return media.file_type.startsWith("video/");
        if (type === "document")
          return (
            !media.file_type.startsWith("image/") &&
            !media.file_type.startsWith("video/")
          );
        return true;
      });
    }

    filtered = filtered.filter((media) =>
      media.title
        ? media.title.toLowerCase().includes(query.toLowerCase())
        : media.file_name.toLowerCase().includes(query.toLowerCase())
    );

    const sorted = filtered.sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return order === "asc" ? dateA - dateB : dateB - dateA;
    });

    return sorted;
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
    const filteredAndSorted = filterAndSortMedia(
      mediaList,
      searchQuery,
      value,
      filterType
    );
    setSortedMedia(filteredAndSorted);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    const filteredAndSorted = filterAndSortMedia(
      mediaList,
      value,
      sortOrder,
      filterType
    );
    setSortedMedia(filteredAndSorted);
    setCurrentPage(1);
    setTotalItems(filteredAndSorted.length);
  };

  const handleFilterChange = (value) => {
    setFilterType(value);
    const filteredAndSorted = filterAndSortMedia(
      mediaList,
      searchQuery,
      sortOrder,
      value
    );
    setSortedMedia(filteredAndSorted);
    setCurrentPage(1);
    setTotalItems(filteredAndSorted.length);
  };

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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedMedia = sortedMedia.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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

  const getImageSizeClass = () => {
    switch (imageSize) {
      case "small":
        return "w-32 h-24";
      case "medium":
        return "w-48 h-36";
      case "large":
        return "w-64 h-48";
      default:
        return "w-48 h-36";
    }
  };

  const renderMediaItem = (item) => (
    <div
      className={`relative border-2 rounded-md cursor-pointer transition-all duration-200 hover:shadow-lg ${
        isItemSelected(item)
          ? "border-theme shadow-md"
          : "border-transparent hover:border-gray-200"
      }`}
      onClick={() => handleSelection(item)}
    >
      {item.file_type.startsWith("image/") ? (
        <Image
          src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${item.file_path}`}
          alt={item.title || "Media Unavailable"}
          width={
            imageSize === "small" ? 128 : imageSize === "large" ? 256 : 192
          }
          height={
            imageSize === "small" ? 96 : imageSize === "large" ? 192 : 144
          }
          objectFit="cover"
          layout="responsive"
          className={`rounded-md ${getImageSizeClass()}`}
        />
      ) : item.file_type.startsWith("video/") ? (
        <div className="relative">
          <video
            src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${item.file_path}`}
            className={`rounded-md w-full ${
              viewMode === "grid" ? "h-28" : "h-48"
            } object-cover`}
            muted
            preload="metadata"
          />
          <div className="absolute inset-0 flex justify-center items-center">
            <EyeOutlined className="text-white text-3xl opacity-75" />
          </div>
        </div>
      ) : (
        <div className="document-preview flex flex-col items-center justify-center h-48 bg-gray-100 rounded-md">
          <InboxOutlined className="text-4xl text-gray-400" />
          <p className="mt-2 text-center text-sm font-medium truncate w-40">
            {item.title || item.file_name}
          </p>
        </div>
      )}
      <div className="absolute top-2 left-2">
        <Tag
          color={
            item.file_type.startsWith("image/")
              ? "blue"
              : item.file_type.startsWith("video/")
                ? "red"
                : "green"
          }
        >
          {item.file_type.startsWith("image/")
            ? "Image"
            : item.file_type.startsWith("video/")
              ? "Video"
              : "Document"}
        </Tag>
      </div>
      <p className="mt-2 text-center text-sm font-medium truncate">
        {item.title || "Untitled"}
      </p>
      {isItemSelected(item) && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center rounded-md">
          <span className="text-white text-lg font-semibold">Selected</span>
        </div>
      )}
    </div>
  );

  const renderSettingsDrawer = () => (
    <Drawer
      title="Display Settings"
      placement="right"
      width={300}
      onClose={() => setSettingsDrawerVisible(false)}
      open={settingsDrawerVisible}
    >
      <div className="space-y-6">
        <div>
          <h4 className="font-medium mb-2">View Mode</h4>
          <Radio.Group
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            buttonStyle="solid"
            className="w-full"
          >
            <Radio.Button value="grid" className="w-1/2 text-center">
              Grid
            </Radio.Button>
            <Radio.Button value="list" className="w-1/2 text-center">
              List
            </Radio.Button>
          </Radio.Group>
        </div>
        <Divider />
        <div>
          <h4 className="font-medium mb-2">Image Size</h4>
          <Select value={imageSize} onChange={setImageSize} className="w-full">
            <Option value="small">Small</Option>
            <Option value="medium">Medium</Option>
            <Option value="large">Large</Option>
          </Select>
        </div>
      </div>
    </Drawer>
  );

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
          <div className="flex justify-between items-center mb-4">
            <Space>
              <Select
                value={filterType}
                onChange={handleFilterChange}
                style={{ width: 120 }}
                suffixIcon={<FilterOutlined />}
              >
                <Option value="all">All Types</Option>
                <Option value="image">Images</Option>
                <Option value="video">Videos</Option>
                <Option value="document">Documents</Option>
              </Select>
              <Tooltip
                title={sortOrder === "desc" ? "Newest First" : "Oldest First"}
              >
                <Button
                  icon={
                    sortOrder === "desc" ? (
                      <SortDescendingOutlined />
                    ) : (
                      <SortAscendingOutlined />
                    )
                  }
                  onClick={() =>
                    handleSortChange(sortOrder === "desc" ? "asc" : "desc")
                  }
                />
              </Tooltip>
            </Space>
            <Space>
              <Search
                placeholder="Search media..."
                value={searchQuery}
                onChange={handleSearchChange}
                allowClear
                className="w-64"
              />
              <Tooltip title="Refresh">
                <Button
                  icon={<SyncOutlined />}
                  onClick={fetchMedia}
                  className="mavebutton"
                />
              </Tooltip>
            </Space>
          </div>

          {isUploading && (
            <div className="mb-4">
              <Progress percent={uploadProgress} status="active" />
            </div>
          )}

          <Tabs defaultActiveKey="1" className="flex-1">
            <TabPane tab="Native Storage" key="1">
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
                        xxl: 6,
                      }
                    : null
                }
                dataSource={paginatedMedia}
                loading={loading}
                locale={{ emptyText: "No media items found." }}
                renderItem={(item) => (
                  <List.Item>{renderMediaItem(item)}</List.Item>
                )}
              />
            </TabPane>
            <TabPane tab="Cloudinary" key="2">
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
      {renderSettingsDrawer()}
    </>
  );
};

export default MediaSelectionModal;
