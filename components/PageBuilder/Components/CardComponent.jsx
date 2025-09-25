// components/PageBuilder/Components/CardComponent.jsx

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Button,
  Modal,
  Typography,
  message,
  Popconfirm,
  Space,
  Tooltip,
  Drawer,
  Switch,
  Collapse,
  Input,
} from "antd";
import RichTextEditor from "../../RichTextEditor";
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  ExportOutlined,
  CopyFilled,
  DragOutlined,
  SettingOutlined,
  ReloadOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

const { Panel } = Collapse;
import CardSelectionModal from "../Modals/CardSelectionModal";
import Image from "next/image";
import instance from "../../../axios";
import { useRouter } from "next/router";

const { Text } = Typography;

// Configuration
const POLLING_INTERVAL = 30000; // 30 seconds

// Helper function to render card media
const renderCardMedia = (media, altTitle = "Card Image") => {
  if (!media || !media.file_path) {
    return (
      <div className="w-full h-48 bg-gray-100 flex items-center justify-center rounded-lg">
        <Image
          src="/images/Image_Placeholder.png"
          alt="No Image"
          width={900}
          height={400}
          objectFit="cover"
          className="rounded-lg"
          priority
        />
      </div>
    );
  }
  return (
    <Image
      src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${media.file_path}`}
      alt={altTitle}
      width={900}
      height={400}
      objectFit="cover"
      className="rounded-lg"
      priority
    />
  );
};

// Helper function to get display content based on language preference
const getDisplayContent = (cardData, showAltContent = false) => {
  if (!cardData)
    return { title: "Untitled Card", description: "No description available" };

  if (showAltContent) {
    return {
      title: cardData.title_bn || cardData.title_en || "Untitled Card",
      description:
        cardData.description_bn ||
        cardData.description_en ||
        "No description available",
    };
  }

  return {
    title: cardData.title_en || "Untitled Card",
    description: cardData.description_en || "No description available",
  };
};

const CardComponent = ({
  component,
  updateComponent,
  deleteComponent,
  preview = false,
  isEditing = false,
  onDuplicateElement,
}) => {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cardData, setCardData] = useState(component._mave);
  const [selectedCardData, setSelectedCardData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoPolling, setAutoPolling] = useState(false); // Always false
  const [showAltContent, setShowAltContent] = useState(
    component._mave?.showAltContent || false
  );
  const [isEditingState, setIsEditingState] = useState(false);
  const [isEditingAltContent, setIsEditingAltContent] = useState(false);
  const [altContentData, setAltContentData] = useState({
    altTitle: component._mave?.altTitle || "",
    altDescription: component._mave?.altDescription || "",
  });
  const lastUpdateRef = useRef(null);

  // Check if we're in page-builder context
  const isInPageBuilder = router.pathname.includes("/page-builder");
  const isInPagePreview = router.pathname.includes("/page-preview");

  // Synchronize cardData with component._mave when it changes
  useEffect(() => {
    setCardData(component._mave);
    setShowAltContent(component._mave?.showAltContent || false);
    setAltContentData({
      altTitle: component._mave?.altTitle || "",
      altDescription: component._mave?.altDescription || "",
    });
  }, [component._mave]);

  // Completely disable auto-polling in all contexts
  useEffect(() => {
    // Always disable auto-polling
    setAutoPolling(false);
  }, [preview, isEditing, isInPageBuilder, isInPagePreview]);

  // Auto-refresh card data - completely disabled
  useEffect(() => {
    // Completely disable auto-refresh in all contexts
    console.log("🔄 Card auto-refresh disabled - all contexts");
    return;
  }, [
    cardData?.id,
    autoPolling,
    isEditing,
    preview,
    isInPageBuilder,
    isInPagePreview,
  ]);

  // Function to refresh card data from the server
  const refreshCardData = useCallback(
    async (silent = false) => {
      // Completely prevent updates when in page-builder context
      if (isInPageBuilder) {
        console.log("🔄 Skipping card refresh - in page-builder context");
        return;
      }

      // Prevent updates during editing to avoid losing draft state
      if (isEditing) {
        return;
      }

      // Only allow refresh in preview mode
      if (!preview) {
        return;
      }

      if (!cardData?.id) {
        if (!silent) {
          message.warning("No card ID available to refresh");
        }
        return;
      }

      // Check if we've already updated recently to prevent rapid updates
      const now = Date.now();
      if (lastUpdateRef.current && now - lastUpdateRef.current < 10000) {
        console.log("🔄 Skipping card update - too recent");
        return;
      }

      setIsRefreshing(true);
      try {
        const response = await instance.get(`/cards/${cardData.id}`);
        if (response.status === 200) {
          const updatedCard = response.data;

          // Check if there were actual changes
          const hasChanges =
            JSON.stringify(updatedCard) !== JSON.stringify(component._mave);

          if (hasChanges) {
            const updatedComponent = {
              ...component,
              _mave: {
                ...updatedCard,
                config: cardData.config || {
                  showDescription: true,
                  showImage: true,
                  layout: "horizontal",
                },
              },
              id: updatedCard.id,
            };

            updateComponent(updatedComponent);
            setCardData(updatedCard);
            setLastUpdated(new Date());
            lastUpdateRef.current = now;

            if (!silent) {
              message.success("Card data updated successfully");
            }
          } else if (!silent) {
            message.info("Card data is up to date");
          }
        }
      } catch (error) {
        console.error("Error refreshing card data:", error);
        if (!silent) {
          message.error("Failed to refresh card data");
        }
      } finally {
        setIsRefreshing(false);
      }
    },
    [
      cardData?.id,
      cardData?.config,
      component,
      updateComponent,
      isEditing,
      preview,
      isInPageBuilder,
    ]
  );

  // Handle selection from CardSelectionModal
  const handleSelectCard = useCallback((selectedCard) => {
    setSelectedCardData(selectedCard);
    setIsModalVisible(false);
    setIsEditingState(true);
  }, []);

  // Handle Submit (Confirm) Changes
  const handleSubmit = useCallback(() => {
    if (!selectedCardData) {
      Modal.error({
        title: "Validation Error",
        content: "No card selected.",
      });
      return;
    }

    const updatedComponent = {
      ...component,
      _mave: {
        ...selectedCardData,
        config: selectedCardData.config || {
          showDescription: true,
          showImage: true,
          layout: "horizontal",
        },
      },
      id: selectedCardData.id,
    };

    updateComponent(updatedComponent);
    setCardData(selectedCardData);
    setSelectedCardData(null);
    setIsEditingState(false);
    message.success("Card updated successfully.");
  }, [selectedCardData, component, updateComponent]);

  // Handle Cancel Changes
  const handleCancel = useCallback(() => {
    setSelectedCardData(null);
    setIsEditingState(false);
    message.info("Card update canceled.");
  }, []);

  // Handle Delete Component
  const handleDelete = useCallback(() => {
    deleteComponent();
  }, [deleteComponent]);

  // Handle Alternative Content Editing
  const handleEditAltContent = useCallback(() => {
    setIsEditingAltContent(true);
  }, []);

  const handleSaveAltContent = useCallback(() => {
    const updatedComponent = {
      ...component,
      _mave: {
        ...component._mave,
        altTitle: altContentData.altTitle,
        altDescription: altContentData.altDescription,
      },
    };
    updateComponent(updatedComponent);
    setIsEditingAltContent(false);
    message.success("Alternative content updated successfully.");
  }, [component, altContentData, updateComponent]);

  const handleCancelAltContent = useCallback(() => {
    setAltContentData({
      altTitle: component._mave?.altTitle || "",
      altDescription: component._mave?.altDescription || "",
    });
    setIsEditingAltContent(false);
    message.info("Alternative content editing canceled.");
  }, [component._mave]);

  // If in preview mode, render the card content only
  if (preview) {
    const displayContent = getDisplayContent(cardData, showAltContent);
    const altContent = getDisplayContent(cardData, !showAltContent);

    return (
      <div className="preview-card-component p-4 bg-gray-100 rounded-md">
        {cardData && (
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Button
                icon={<ReloadOutlined spin={isRefreshing} />}
                onClick={() => refreshCardData(false)}
                loading={isRefreshing}
                size="small"
                className="mavebutton"
                title="Refresh card data"
              />
              {autoPolling && (
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                  Auto-refresh active
                </span>
              )}
            </div>
          </div>
        )}
        {cardData ? (
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {renderCardMedia(cardData.media_files, displayContent.title)}
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2">
                  {displayContent.title}
                </h3>
                <div
                  className="text-gray-600"
                  dangerouslySetInnerHTML={{
                    __html: displayContent.description,
                  }}
                />
              </div>
            </div>
            {showAltContent &&
              (cardData.title_bn ||
                cardData.description_bn ||
                altContentData.altTitle ||
                altContentData.altDescription) && (
                <div className="bg-gray-50 rounded-lg shadow-md overflow-hidden">
                  {renderCardMedia(cardData.media_files, altContent.title)}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2 text-gray-700">
                      {altContentData.altTitle || altContent.title}
                    </h3>
                    <div
                      className="text-gray-600"
                      dangerouslySetInnerHTML={{
                        __html:
                          altContentData.altDescription ||
                          altContent.description,
                      }}
                    />
                  </div>
                </div>
              )}
          </div>
        ) : (
          <Text className="text-gray-500">No card data available.</Text>
        )}
      </div>
    );
  }

  return (
    <div className="border p-4 rounded-md bg-white">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <DragOutlined className="text-2xl border rounded-md p-1" />
          <h3 className="text-xl font-semibold">Card Component</h3>
        </div>
        <div className="flex gap-2">
          {cardData && (
            <>
              <Button
                icon={<EditOutlined />}
                onClick={() => setIsModalVisible(true)}
                className="mavebutton"
              >
                Update
              </Button>
              <Button
                icon={<CopyFilled />}
                onClick={onDuplicateElement}
                className="mavebutton"
              />
              <Popconfirm
                title="Are you sure you want to delete this component?"
                onConfirm={handleDelete}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ danger: true }}
              >
                <Button
                  icon={<DeleteOutlined />}
                  className="mavecancelbutton"
                />
              </Popconfirm>
            </>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* Multi-Language Configuration */}
        {cardData && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-md font-semibold mb-3 flex items-center gap-2">
              <GlobalOutlined />
              Multi-Language Settings
            </h4>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium mb-1">Display Alternative Language</p>
                <p className="text-sm text-gray-600">
                  Show Bengali content alongside English (if available)
                </p>
              </div>
              <Switch
                checked={showAltContent}
                onChange={(checked) => {
                  setShowAltContent(checked);
                  // Update component with new setting
                  const updatedComponent = {
                    ...component,
                    _mave: {
                      ...component._mave,
                      showAltContent: checked,
                    },
                  };
                  updateComponent(updatedComponent);
                }}
              />
            </div>
          </div>
        )}

        {/* Alternative Content Editing Section */}
        {cardData && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-md font-semibold flex items-center gap-2">
                <EditOutlined />
                Custom Alternative Content
              </h4>
              {!isEditingAltContent ? (
                <Button
                  icon={<EditOutlined />}
                  onClick={handleEditAltContent}
                  className="mavebutton"
                  size="small"
                >
                  Edit Alternative Content
                </Button>
              ) : (
                <Space>
                  <Button
                    icon={<CheckOutlined />}
                    onClick={handleSaveAltContent}
                    className="mavebutton"
                    size="small"
                  >
                    Save
                  </Button>
                  <Button
                    icon={<CloseOutlined />}
                    onClick={handleCancelAltContent}
                    className="mavecancelbutton"
                    size="small"
                  >
                    Cancel
                  </Button>
                </Space>
              )}
            </div>

            {isEditingAltContent ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alternative Title
                  </label>
                  <Input
                    value={altContentData.altTitle}
                    onChange={(e) =>
                      setAltContentData({
                        ...altContentData,
                        altTitle: e.target.value,
                      })
                    }
                    placeholder="Enter alternative title"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alternative Description
                  </label>
                  <RichTextEditor
                    defaultValue={altContentData.altDescription}
                    onChange={(html) =>
                      setAltContentData({
                        ...altContentData,
                        altDescription: html,
                      })
                    }
                    editMode={true}
                    maxLength={2000}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Alternative Title:
                  </span>
                  <p className="text-gray-600">
                    {altContentData.altTitle || "No alternative title set"}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    Alternative Description:
                  </span>
                  <div
                    className="text-gray-600"
                    dangerouslySetInnerHTML={{
                      __html:
                        altContentData.altDescription ||
                        "No alternative description set",
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-col md:flex-row items-start gap-4">
          <div
            className={`flex flex-col ${isEditingState && selectedCardData ? "w-full md:w-1/2" : "w-full"}`}
          >
            {cardData && isEditingState && (
              <h4 className="mb-2 text-md font-semibold">Current Card</h4>
            )}
            {cardData ? (
              <div className="w-full relative">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  {renderCardMedia(cardData.media_files)}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">
                      {cardData.title_en || "Untitled Card"}
                    </h3>
                    <div
                      className="text-gray-600"
                      dangerouslySetInnerHTML={{
                        __html:
                          cardData.description_en || "No description available",
                      }}
                    />
                  </div>
                </div>
                {showAltContent &&
                  (cardData.title_bn ||
                    cardData.description_bn ||
                    altContentData.altTitle ||
                    altContentData.altDescription) && (
                    <div className="mt-2 bg-gray-50 rounded-lg shadow-md overflow-hidden">
                      {renderCardMedia(cardData.media_files)}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2 text-gray-700">
                          {altContentData.altTitle ||
                            cardData.title_bn ||
                            cardData.title_en ||
                            "Untitled Card"}
                        </h3>
                        <div
                          className="text-gray-600"
                          dangerouslySetInnerHTML={{
                            __html:
                              altContentData.altDescription ||
                              cardData.description_bn ||
                              cardData.description_en ||
                              "No description available",
                          }}
                        />
                      </div>
                    </div>
                  )}
              </div>
            ) : (
              <Button
                icon={<EditOutlined />}
                onClick={() => setIsModalVisible(true)}
                className="mavebutton w-fit"
              >
                Select Card
              </Button>
            )}
          </div>

          {isEditingState && selectedCardData && (
            <div className="flex flex-col w-full md:w-1/2">
              <h4 className="mb-2 text-md font-semibold">Selected Card</h4>
              <div className="w-full relative">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  {renderCardMedia(selectedCardData.media_files)}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">
                      {selectedCardData.title_en || "Untitled Card"}
                    </h3>
                    <div
                      className="text-gray-600"
                      dangerouslySetInnerHTML={{
                        __html:
                          selectedCardData.description_en ||
                          "No description available",
                      }}
                    />
                  </div>
                </div>
                {showAltContent &&
                  (selectedCardData.title_bn ||
                    selectedCardData.description_bn ||
                    altContentData.altTitle ||
                    altContentData.altDescription) && (
                    <div className="mt-2 bg-gray-50 rounded-lg shadow-md overflow-hidden">
                      {renderCardMedia(selectedCardData.media_files)}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2 text-gray-700">
                          {altContentData.altTitle ||
                            selectedCardData.title_bn ||
                            selectedCardData.title_en ||
                            "Untitled Card"}
                        </h3>
                        <div
                          className="text-gray-600"
                          dangerouslySetInnerHTML={{
                            __html:
                              altContentData.altDescription ||
                              selectedCardData.description_bn ||
                              selectedCardData.description_en ||
                              "No description available",
                          }}
                        />
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>

      {isEditingState && selectedCardData && (
        <div className="mt-4 flex gap-2">
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={handleSubmit}
            className="mavebutton"
          >
            Confirm Changes
          </Button>
          <Button
            icon={<CloseOutlined />}
            onClick={handleCancel}
            className="mavecancelbutton"
          >
            Cancel
          </Button>
        </div>
      )}

      <CardSelectionModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSelectCard={handleSelectCard}
      />
    </div>
  );
};

export default CardComponent;
