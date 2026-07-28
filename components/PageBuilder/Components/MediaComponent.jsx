// components/PageBuilder/Components/MediaComponent.jsx

import React, { useState, useEffect } from "react";
import {
  Button,
  Popconfirm,
  message,
  Space,
  Tooltip,
  Select,
  Radio,
  Switch,
  Collapse,
  Modal,
  Form,
  Input,
} from "antd";
import RichTextEditor from "../../RichTextEditor";
import {
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  ArrowRightOutlined,
  ExportOutlined,
  CopyFilled,
  DragOutlined,
  EyeOutlined,
  DownloadOutlined,
  LinkOutlined,
  EditOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import MediaSelectionModal from "../Modals/MediaSelectionModal";
import Image from "next/image";

const { Panel } = Collapse;

const MediaComponent = ({
  component,
  updateComponent,
  deleteComponent,
  preview = false,
  onDuplicateElement,
}) => {
  // Safety check for null component
  if (!component) {
    return null;
  }

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [mediaData, setMediaData] = useState(null);
  const [selectedMediaData, setSelectedMediaData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAltContent, setShowAltContent] = useState(false);
  const [showAltInputs, setShowAltInputs] = useState(false);

  // Sync state with component prop changes
  useEffect(() => {
    if (component?._mave) {
      setMediaData(component._mave);
      setShowAltContent(component._mave?.showAltContent || false);
    }
  }, [component?._mave]);

  // Helper function to get display content based on language preference
  const getDisplayContent = (media, showAlt = false) => {
    if (!media)
      return {
        title: "Untitled Media",
        description: "No description available",
      };

    if (showAlt) {
      return {
        title:
          media.altTitle || media.title || media.file_name || "Untitled Media",
        description:
          media.altDescription ||
          media.description ||
          (media.tags && media.tags.length > 0
            ? media.tags.join(", ")
            : "No description available"),
      };
    }

    return {
      title: media.title || media.file_name || "Untitled Media",
      description:
        media.description ||
        (media.tags && media.tags.length > 0
          ? media.tags.join(", ")
          : "No description available"),
    };
  };

  // Helper function to render media item with multi-language support
  const renderMediaItemWithMultiLang = (media) => {
    const displayContent = getDisplayContent(media, showAltContent);
    const fileUrl = `${process.env.NEXT_PUBLIC_MEDIA_URL}/${media.file_path}`;
    const fileType = media.file_type || "";

    if (fileType.startsWith("image/")) {
      return (
        <div className="relative group">
          <Image
            key={media.id}
            src={fileUrl}
            alt={displayContent.title}
            width={900}
            height={400}
            objectFit="cover"
            className="rounded-lg transition-all duration-300 group-hover:shadow-lg w-48 h-36"
          />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Space>
              <Tooltip title="View">
                <Button
                  type="text"
                  icon={<EyeOutlined className="text-white" />}
                  onClick={() => window.open(fileUrl, "_blank")}
                />
              </Tooltip>
              <Tooltip title="Download">
                <Button
                  type="text"
                  icon={<DownloadOutlined className="text-white" />}
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = fileUrl;
                    link.download = media.file_name;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                />
              </Tooltip>
            </Space>
          </div>
          {/* Display title and description */}
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 rounded-b-lg">
            <div className="text-sm font-medium truncate">
              {displayContent.title}
            </div>
            {displayContent.description &&
              displayContent.description !== "No description available" && (
                <div
                  className="text-xs opacity-90 truncate"
                  dangerouslySetInnerHTML={{
                    __html: displayContent.description,
                  }}
                />
              )}
          </div>
        </div>
      );
    } else if (fileType.startsWith("video/")) {
      return (
        <div className="relative group">
          <video
            key={media.id}
            src={fileUrl}
            controls
            className="rounded-lg transition-all duration-300 group-hover:shadow-lg w-48 h-36"
          />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Space>
              <Tooltip title="View">
                <Button
                  type="text"
                  icon={<EyeOutlined className="text-white" />}
                  onClick={() => window.open(fileUrl, "_blank")}
                />
              </Tooltip>
            </Space>
          </div>
          {/* Display title and description */}
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 rounded-b-lg">
            <div className="text-sm font-medium truncate">
              {displayContent.title}
            </div>
            {displayContent.description &&
              displayContent.description !== "No description available" && (
                <div
                  className="text-xs opacity-90 truncate"
                  dangerouslySetInnerHTML={{
                    __html: displayContent.description,
                  }}
                />
              )}
          </div>
        </div>
      );
    } else if (fileType === "application/pdf") {
      return (
        <div key={media.id} className="flex flex-col items-center group">
          <div className="bg-gray-100 p-4 rounded-lg transition-all duration-300 group-hover:shadow-lg">
            <LinkOutlined className="text-4xl text-gray-400" />
          </div>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Space>
              <Tooltip title="View">
                <Button
                  type="text"
                  icon={<EyeOutlined />}
                  onClick={() => window.open(fileUrl, "_blank")}
                />
              </Tooltip>
              <Tooltip title="Download">
                <Button
                  type="text"
                  icon={<DownloadOutlined />}
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = fileUrl;
                    link.download = media.file_name;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                />
              </Tooltip>
            </Space>
          </div>
          {/* Display title and description */}
          <div className="mt-2 text-center">
            <div className="text-sm font-medium truncate w-48">
              {displayContent.title}
            </div>
            {displayContent.description &&
              displayContent.description !== "No description available" && (
                <div
                  className="text-xs text-gray-600 truncate w-48"
                  dangerouslySetInnerHTML={{
                    __html: displayContent.description,
                  }}
                />
              )}
          </div>
        </div>
      );
    } else {
      return (
        <div key={media.id} className="flex flex-col items-center group">
          <div className="bg-gray-100 p-4 rounded-lg transition-all duration-300 group-hover:shadow-lg">
            <LinkOutlined className="text-4xl text-gray-400" />
          </div>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Tooltip title="Download">
              <Button
                type="text"
                icon={<DownloadOutlined />}
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = fileUrl;
                  link.download = media.file_name;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              />
            </Tooltip>
          </div>
          {/* Display title and description */}
          <div className="mt-2 text-center">
            <div className="text-sm font-medium truncate w-48">
              {displayContent.title}
            </div>
            {displayContent.description &&
              displayContent.description !== "No description available" && (
                <div
                  className="text-xs text-gray-600 truncate w-48"
                  dangerouslySetInnerHTML={{
                    __html: displayContent.description,
                  }}
                />
              )}
          </div>
        </div>
      );
    }
  };

  const handleSelectMedia = (selectedMedia) => {
    setSelectedMediaData(selectedMedia);
    setIsModalVisible(false);
    setIsEditing(true);
  };

  const handleSubmit = () => {
    if (component?.selectionMode === "multiple") {
      if (selectedMediaData.length === 0) {
        message.error("Please select at least one media item.");
        return;
      }
      updateComponent({
        ...component,
        _mave: selectedMediaData,
        id: selectedMediaData?.map((media) => media.id),
      });
    } else {
      if (!selectedMediaData) {
        message.error("Please select a media item.");
        return;
      }
      updateComponent({
        ...component,
        _mave: selectedMediaData,
        id: selectedMediaData.id,
      });
    }
    setMediaData(selectedMediaData);
    setSelectedMediaData(null);
    setIsEditing(false);
    message.success("Media updated successfully.");
  };

  const handleCancel = () => {
    setSelectedMediaData(null);
    setIsEditing(false);
    message.info("Media update canceled.");
  };

  const handleDelete = () => {
    deleteComponent();
  };

  const renderMediaItem = (media) => {
    const fileUrl = `${process.env.NEXT_PUBLIC_MEDIA_URL}/${media.file_path}`;
    const fileType = media.file_type || "";

    if (fileType.startsWith("image/")) {
      return (
        <div className="relative group">
          <Image
            key={media.id}
            src={fileUrl}
            alt={media.title || "Image"}
            width={900}
            height={400}
            objectFit="cover"
            className="rounded-lg transition-all duration-300 group-hover:shadow-lg w-48 h-36"
          />
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Space>
              <Tooltip title="View">
                <Button
                  type="text"
                  icon={<EyeOutlined className="text-white" />}
                  onClick={() => window.open(fileUrl, "_blank")}
                />
              </Tooltip>
              <Tooltip title="Download">
                <Button
                  type="text"
                  icon={<DownloadOutlined className="text-white" />}
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = fileUrl;
                    link.download = media.file_name;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                />
              </Tooltip>
            </Space>
          </div>
        </div>
      );
    } else if (fileType.startsWith("video/")) {
      return (
        <div className="relative group">
          <video
            key={media.id}
            src={fileUrl}
            controls
            className="rounded-lg transition-all duration-300 group-hover:shadow-lg w-48 h-36"
          />
        </div>
      );
    } else if (fileType === "application/pdf") {
      return (
        <div key={media.id} className="flex flex-col items-center group">
          <div className="bg-gray-100 p-4 rounded-lg transition-all duration-300 group-hover:shadow-lg">
            <LinkOutlined className="text-4xl text-gray-400" />
          </div>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Space>
              <Tooltip title="View">
                <Button
                  type="text"
                  icon={<EyeOutlined />}
                  onClick={() => window.open(fileUrl, "_blank")}
                />
              </Tooltip>
              <Tooltip title="Download">
                <Button
                  type="text"
                  icon={<DownloadOutlined />}
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = fileUrl;
                    link.download = media.file_name;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                />
              </Tooltip>
            </Space>
          </div>
        </div>
      );
    } else {
      return (
        <div key={media.id} className="flex flex-col items-center group">
          <div className="bg-gray-100 p-4 rounded-lg transition-all duration-300 group-hover:shadow-lg">
            <LinkOutlined className="text-4xl text-gray-400" />
          </div>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Tooltip title="Download">
              <Button
                type="text"
                icon={<DownloadOutlined />}
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = fileUrl;
                  link.download = media.file_name;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
              />
            </Tooltip>
          </div>
        </div>
      );
    }
  };

  if (preview) {
    return (
      <div className="preview-media-component p-4 bg-gray-100 rounded-md">
        {mediaData ? (
          component?.selectionMode === "multiple" ? (
            <div className="grid grid-cols-2 gap-4">
              {mediaData.map((media) => renderMediaItemWithMultiLang(media))}
            </div>
          ) : (
            <div className="flex justify-center">
              {renderMediaItemWithMultiLang(mediaData)}
            </div>
          )
        ) : (
          <p className="text-gray-500">No media selected.</p>
        )}
      </div>
    );
  }

  return (
    <div className="border p-4 rounded-md bg-white w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <DragOutlined className="text-2xl border rounded-md p-1" />
          <h3 className="text-xl font-semibold">Media Component</h3>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <>
              <Space>
                {mediaData && (
                  <Tooltip title="Change Media">
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => setIsModalVisible(true)}
                      className="mavebutton"
                    />
                  </Tooltip>
                )}
                <Tooltip title="Duplicate">
                  <Button
                    icon={<CopyFilled />}
                    onClick={onDuplicateElement}
                    className="mavebutton"
                  />
                </Tooltip>
                <Popconfirm
                  title="Are you sure you want to delete this component?"
                  onConfirm={handleDelete}
                  okText="Yes"
                  cancelText="No"
                  okButtonProps={{ danger: true }}
                >
                  <Tooltip title="Delete">
                    <Button
                      icon={<DeleteOutlined />}
                      className="mavecancelbutton"
                    />
                  </Tooltip>
                </Popconfirm>
              </Space>
            </>
          ) : (
            <>
              <Tooltip title="Save Changes">
                <Button
                  icon={<CheckOutlined />}
                  onClick={handleSubmit}
                  className="mavebutton"
                />
              </Tooltip>
              <Tooltip title="Cancel">
                <Button
                  icon={<CloseOutlined />}
                  onClick={handleCancel}
                  className="mavecancelbutton"
                />
              </Tooltip>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col w-full">
        {!isEditing ? (
          <div className="w-full">
            {mediaData ? (
              component?.selectionMode === "multiple" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                  {mediaData.map((media) =>
                    renderMediaItemWithMultiLang(media)
                  )}
                </div>
              ) : (
                <div className="w-full flex justify-center">
                  {renderMediaItemWithMultiLang(mediaData)}
                </div>
              )
            ) : (
              <Button
                icon={<ExportOutlined />}
                onClick={() => setIsModalVisible(true)}
                className="mavebutton w-full md:w-auto"
              >
                Choose Media
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col md:flex-row w-full gap-6">
            {/* Current Media */}
            <div className="w-full md:w-1/2">
              <h4 className="mb-2 text-md font-semibold">Current Media</h4>
              {mediaData ? (
                component?.selectionMode === "multiple" ? (
                  <div className="grid grid-cols-1 gap-4 w-full">
                    {mediaData.map((media) =>
                      renderMediaItemWithMultiLang(media)
                    )}
                  </div>
                ) : (
                  <div className="w-full">
                    {renderMediaItemWithMultiLang(mediaData)}
                  </div>
                )
              ) : null}
            </div>

            {/* Selected Media */}
            {selectedMediaData && (
              <div className="w-full md:w-1/2">
                <h4 className="mb-2 text-md font-medium">Selected Media</h4>
                {component?.selectionMode === "multiple" ? (
                  <div className="grid grid-cols-1 gap-4 w-full">
                    {selectedMediaData.map((media) =>
                      renderMediaItemWithMultiLang(media)
                    )}
                  </div>
                ) : (
                  <div className="w-full">
                    {renderMediaItemWithMultiLang(selectedMediaData)}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Multi-Language Configuration */}
      {mediaData && (
        <Collapse className="mt-4">
          <Panel
            header={
              <div className="flex items-center gap-2">
                <GlobalOutlined />
                Multi-Language Settings
              </div>
            }
            key="multilang"
          >
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-md font-semibold">
                    Display Alternative Content
                  </h4>
                  <p className="text-sm text-gray-600">
                    Toggle to show alternative titles and descriptions for media
                    items
                  </p>
                </div>
                <Switch
                  checked={showAltContent}
                  onChange={(checked) => {
                    setShowAltContent(checked);
                    // Update component with new setting
                    if (Array.isArray(component._mave)) {
                      const updatedMedia = component._mave.map((media) => ({
                        ...media,
                        showAltContent: checked,
                      }));
                      updateComponent({
                        ...component,
                        _mave: updatedMedia,
                      });
                    } else if (component._mave) {
                      updateComponent({
                        ...component,
                        _mave: {
                          ...component._mave,
                          showAltContent: checked,
                        },
                      });
                    }
                  }}
                />
              </div>

              {showAltContent && (
                <div className="mt-4 p-3 bg-gray-200 rounded-lg">
                  <div className="text-sm text-gray-800">
                    <strong>Alternative Content Mode:</strong> Media items will
                    display alternative titles and descriptions when available.
                  </div>
                </div>
              )}

              {/* Alternative Content Editing Section */}
              {mediaData && (
                <div className="mt-6 p-4 bg-white rounded-lg border">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="text-lg font-semibold flex items-center gap-2">
                      <EditOutlined />
                      Alternative Content
                    </h5>
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => setShowAltInputs(true)}
                      className="mavebutton"
                      size="small"
                    >
                      Edit
                    </Button>
                  </div>

                  {showAltInputs && Array.isArray(mediaData) ? (
                    <div className="space-y-4">
                      {mediaData.map((media, index) => (
                        <div
                          key={media.id}
                          className="border rounded-lg p-4 bg-gray-50"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <Image
                              src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${media.file_path}`}
                              alt={media.title || "Media"}
                              width={60}
                              height={40}
                              className="rounded object-cover"
                            />
                            <div>
                              <div className="font-medium text-sm">
                                {media.title || media.file_name || "Untitled"}
                              </div>
                              <div className="text-xs text-gray-500">
                                {media.file_type}
                              </div>
                            </div>
                          </div>

                          <Form layout="vertical" className="w-full">
                            <Form.Item
                              label="Alternative Title"
                              className="mb-3"
                            >
                              <Input
                                placeholder="Enter alternative title"
                                defaultValue={media.altTitle || ""}
                                onChange={(e) => {
                                  const updatedMedia = [...mediaData];
                                  updatedMedia[index] = {
                                    ...updatedMedia[index],
                                    altTitle: e.target.value,
                                  };
                                  setMediaData(updatedMedia);
                                }}
                              />
                            </Form.Item>

                            <Form.Item
                              label="Alternative Description"
                              className="mb-4"
                            >
                              <RichTextEditor
                                defaultValue={media.altDescription || ""}
                                onChange={(html) => {
                                  const updatedMedia = [...mediaData];
                                  updatedMedia[index] = {
                                    ...updatedMedia[index],
                                    altDescription: html,
                                  };
                                  setMediaData(updatedMedia);
                                }}
                                editMode={true}
                                maxLength={2000}
                              />
                            </Form.Item>
                          </Form>
                        </div>
                      ))}
                    </div>
                  ) : showAltInputs && !Array.isArray(mediaData) ? (
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center gap-3 mb-3">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${mediaData.file_path}`}
                          alt={mediaData.title || "Media"}
                          width={60}
                          height={40}
                          className="rounded object-cover"
                        />
                        <div>
                          <div className="font-medium text-sm">
                            {mediaData.title ||
                              mediaData.file_name ||
                              "Untitled"}
                          </div>
                          <div className="text-xs text-gray-500">
                            {mediaData.file_type}
                          </div>
                        </div>
                      </div>

                      <Form layout="vertical" className="w-full">
                        <Form.Item label="Alternative Title" className="mb-3">
                          <Input
                            placeholder="Enter alternative title"
                            defaultValue={mediaData.altTitle || ""}
                            onChange={(e) => {
                              const updatedMedia = {
                                ...mediaData,
                                altTitle: e.target.value,
                              };
                              setMediaData(updatedMedia);
                            }}
                          />
                        </Form.Item>

                        <Form.Item
                          label="Alternative Description"
                          className="mb-4"
                        >
                          <RichTextEditor
                            defaultValue={mediaData.altDescription || ""}
                            onChange={(html) => {
                              const updatedMedia = {
                                ...mediaData,
                                altDescription: html,
                              };
                              setMediaData(updatedMedia);
                            }}
                            editMode={true}
                            maxLength={2000}
                          />
                        </Form.Item>
                      </Form>
                    </div>
                  ) : (
                    /* Display Current Alternative Content */
                    <div className="space-y-3">
                      {Array.isArray(mediaData) ? (
                        mediaData.map((media, index) => (
                          <div
                            key={media.id}
                            className="border rounded-lg p-3 bg-gray-50"
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <Image
                                src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${media.file_path}`}
                                alt={media.title || "Media"}
                                width={40}
                                height={30}
                                className="rounded object-cover"
                              />
                              <div>
                                <div className="font-medium text-sm">
                                  {media.title || media.file_name || "Untitled"}
                                </div>
                              </div>
                            </div>
                            <div className="text-sm">
                              <div>
                                <strong>Alt Title:</strong>{" "}
                                {media.altTitle || "Not set"}
                              </div>
                              <div>
                                <strong>Alt Description:</strong>{" "}
                                {/* {media.altDescription || "Not set"} */}
                                <div
                                  dangerouslySetInnerHTML={{
                                    __html: media.altDescription || "Not set",
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="border rounded-lg p-3 bg-gray-50">
                          <div className="flex items-center gap-3 mb-2">
                            <Image
                              src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${mediaData.file_path}`}
                              alt={mediaData.title || "Media"}
                              width={40}
                              height={30}
                              className="rounded object-cover"
                            />
                            <div>
                              <div className="font-medium text-sm">
                                {mediaData.title ||
                                  mediaData.file_name ||
                                  "Untitled"}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm">
                            <div>
                              <strong>Alt Title:</strong>{" "}
                              {mediaData.altTitle || "Not set"}
                            </div>
                            <div>
                              <strong>Alt Description:</strong>{" "}
                              {/* {mediaData.altDescription || "Not set"} */}
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: mediaData.altDescription || "Not set",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Update Button - Only show when inputs are visible */}
                  {showAltInputs && (
                    <div className="mt-4 flex justify-end">
                      <Button
                        type="primary"
                        icon={<CheckOutlined />}
                        onClick={() => {
                          updateComponent({
                            ...component,
                            _mave: mediaData,
                          });
                          setIsEditing(false);
                          setSelectedMediaData(null);
                          setShowAltInputs(false);
                          message.success(
                            "Alternative content updated successfully."
                          );
                        }}
                        className="mavebutton"
                      >
                        Update Alternative Content
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Panel>
        </Collapse>
      )}

      <MediaSelectionModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSelectMedia={handleSelectMedia}
        selectionMode={component?.selectionMode || "single"}
        maxSelection={component?.maxSelection}
        initialSelectedMedia={
          mediaData ? (Array.isArray(mediaData) ? mediaData : [mediaData]) : []
        }
      />
    </div>
  );
};

export default MediaComponent;
