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
} from "antd";
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
} from "@ant-design/icons";
import CardSelectionModal from "../Modals/CardSelectionModal";
import Image from "next/image";
import instance from "../../../axios";

const { Text } = Typography;

// Configuration
const POLLING_INTERVAL = 30000; // 30 seconds

// Helper function to render card media
const renderCardMedia = (media) => {
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
      alt={media.title_en || "Card Image"}
      width={900}
      height={400}
      objectFit="cover"
      className="rounded-lg"
      priority
    />
  );
};

const CardComponent = ({
  component,
  updateComponent,
  deleteComponent,
  preview = false,
  isEditing = false,
  onDuplicateElement,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cardData, setCardData] = useState(component._mave);
  const [selectedCardData, setSelectedCardData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoPolling, setAutoPolling] = useState(false); // Default to false - only enable in preview mode
  const lastUpdateRef = useRef(null);

  // Synchronize cardData with component._mave when it changes
  useEffect(() => {
    setCardData(component._mave);
  }, [component._mave]);

  // Auto-enable polling when in preview mode (not editing)
  useEffect(() => {
    if (preview && !isEditing) {
      setAutoPolling(true);
    } else {
      setAutoPolling(false);
    }
  }, [preview, isEditing]);

  // Auto-refresh card data every 30 seconds when card data exists
  // Only when in preview mode and not editing
  useEffect(() => {
    // Disable auto-refresh when in edit mode
    if (isEditing) {
      // console.log("🔄 Card auto-refresh disabled - in edit mode");
      return;
    }

    // Only enable auto-refresh in preview mode
    if (!preview) {
      // console.log("🔄 Card auto-refresh disabled - not in preview mode");
      return;
    }

    if (!cardData?.id || !autoPolling) {
      console
        .log
        // "🔄 Card auto-refresh disabled - no card data or polling disabled"
        ();
      return;
    }

    // console.log("🔄 Card auto-refresh enabled - starting interval");
    const interval = setInterval(() => {
      refreshCardData(true); // Silent refresh for polling
    }, POLLING_INTERVAL);

    return () => {
      // console.log("🔄 Card auto-refresh disabled - cleaning up interval");
      clearInterval(interval);
    };
  }, [cardData?.id, autoPolling, isEditing, preview]);

  // Function to refresh card data from the server
  const refreshCardData = useCallback(
    async (silent = false) => {
      // Prevent updates during editing to avoid losing draft state
      if (isEditing) {
        // console.log("🔄 Skipping card refresh - component is being edited");
        return;
      }

      // Only allow refresh in preview mode
      if (!preview) {
        // console.log("🔄 Skipping card refresh - not in preview mode");
        return;
      }

      if (!cardData?.id) {
        if (!silent) {
          message.warning("No card ID available to refresh");
        }
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
            // Check if we've already updated recently to prevent rapid updates
            const now = Date.now();
            if (lastUpdateRef.current && now - lastUpdateRef.current < 5000) {
              console.log("🔄 Skipping card update - too recent");
              return;
            }

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
    ]
  );

  // Handle selection from CardSelectionModal
  const handleSelectCard = useCallback((selectedCard) => {
    setSelectedCardData(selectedCard);
    setIsModalVisible(false);
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
    setIsEditing(false);
    message.success("Card updated successfully.");
  }, [selectedCardData, component, updateComponent]);

  // Handle Cancel Changes
  const handleCancel = useCallback(() => {
    setSelectedCardData(null);
    setIsEditing(false);
    message.info("Card update canceled.");
  }, []);

  // Handle Delete Component
  const handleDelete = useCallback(() => {
    deleteComponent();
  }, [deleteComponent]);

  // If in preview mode, render the card content only
  if (preview) {
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
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {renderCardMedia(cardData.media_files)}
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">
                {cardData.title_en || "Untitled Card"}
              </h3>
              <p className="text-gray-600">
                {cardData.description_en || "No description available"}
              </p>
            </div>
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

      <div className="flex flex-col md:flex-row items-start gap-4">
        <div
          className={`flex flex-col ${isEditing && selectedCardData ? "w-full md:w-1/2" : "w-full"}`}
        >
          {cardData && isEditing && (
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
                  <p className="text-gray-600">
                    {cardData.description_en || "No description available"}
                  </p>
                </div>
              </div>
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

        {isEditing && selectedCardData && (
          <div className="flex flex-col w-full md:w-1/2">
            <h4 className="mb-2 text-md font-semibold">Selected Card</h4>
            <div className="w-full relative">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {renderCardMedia(selectedCardData.media_files)}
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">
                    {selectedCardData.title_en || "Untitled Card"}
                  </h3>
                  <p className="text-gray-600">
                    {selectedCardData.description_en ||
                      "No description available"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {isEditing && selectedCardData && (
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
