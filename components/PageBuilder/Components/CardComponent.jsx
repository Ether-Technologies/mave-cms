// components/PageBuilder/Components/CardComponent.jsx

import React, { useState, useEffect } from "react";
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
  onDuplicateElement,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cardData, setCardData] = useState(component._mave);
  const [selectedCardData, setSelectedCardData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [autoPolling, setAutoPolling] = useState(true);

  // Synchronize cardData with component._mave when it changes
  useEffect(() => {
    setCardData(component._mave);
  }, [component._mave]);

  // Auto-refresh card data every 30 seconds when card data exists
  useEffect(() => {
    if (!cardData?.id || !autoPolling) return;

    const interval = setInterval(() => {
      refreshCardData(true); // Silent refresh for polling
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [cardData?.id, autoPolling]);

  // Function to refresh card data from the server
  const refreshCardData = async (silent = false) => {
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
  };

  // Handle selection from CardSelectionModal
  const handleSelectCard = (selectedCard) => {
    setSelectedCardData(selectedCard);
    setIsModalVisible(false);
    setIsEditing(true);
  };

  // Handle Submit (Confirm) Changes
  const handleSubmit = () => {
    if (!selectedCardData) {
      Modal.error({
        title: "Validation Error",
        content: "No card selected.",
      });
      return;
    }
    updateComponent({
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
    });
    setCardData(selectedCardData);
    setSelectedCardData(null);
    setIsEditing(false);
    message.success("Card updated successfully.");
  };

  // Handle Cancel Changes
  const handleCancel = () => {
    setSelectedCardData(null);
    setIsEditing(false);
    message.info("Card update canceled.");
  };

  // Handle Delete Component
  const handleDelete = () => {
    deleteComponent();
  };

  // If in preview mode, render the card content only
  if (preview) {
    return (
      <div className="preview-card-component p-4 bg-gray-100 rounded-md">
        {cardData && (
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <Button
                icon={<ReloadOutlined spin={isRefreshing} />}
                onClick={refreshCardData}
                loading={isRefreshing}
                size="small"
                className="mavebutton"
                title="Refresh card data"
              />
              {/* <span
                className={`text-xs px-2 py-1 rounded ${autoPolling ? "text-green-600 bg-green-100" : "text-gray-500 bg-gray-100"}`}
              >
                Auto-refresh: {autoPolling ? "ON" : "OFF"}
              </span> */}
            </div>
            {/* {lastUpdated && (
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                Updated {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            {autoPolling && cardData?.id && (
              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                Auto-refresh active
              </span>
            )} */}
          </div>
        )}
        {cardData ? (
          <div
            className={`flex ${cardData.config?.layout === "horizontal" ? "flex-row" : "flex-col"} gap-4 border p-4 rounded-md bg-white relative`}
          >
            {isRefreshing && (
              <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-md">
                <div className="flex items-center gap-2">
                  <ReloadOutlined spin />
                  <span>Refreshing...</span>
                </div>
              </div>
            )}
            {cardData.config?.showImage && (
              <div
                className={
                  cardData.config?.layout === "horizontal" ? "w-1/3" : "w-full"
                }
              >
                {renderCardMedia(cardData.media_files)}
              </div>
            )}
            <div
              className={
                cardData.config?.layout === "horizontal" ? "w-2/3" : "w-full"
              }
            >
              <Text strong className="text-xl">
                {cardData.title_en || "Card Title"}
              </Text>
              {cardData.config?.showDescription && (
                <div
                  dangerouslySetInnerHTML={{
                    __html:
                      cardData.description_en?.length <= 200
                        ? cardData.description_en
                        : cardData.description_en?.slice(0, 200) + "...",
                  }}
                />
              )}
            </div>
          </div>
        ) : (
          <p className="text-gray-500">No card selected.</p>
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
          {/* {lastUpdated && (
            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          {autoPolling && cardData?.id && (
            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
              Auto-refresh active
            </span>
          )} */}
        </div>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <Space>
              {cardData && (
                <>
                  <Tooltip title="Refresh Card Data">
                    <Button
                      icon={<ReloadOutlined spin={isRefreshing} />}
                      onClick={refreshCardData}
                      loading={isRefreshing}
                      className="mavebutton"
                    />
                  </Tooltip>
                  {/* <Tooltip
                    title={`${autoPolling ? "Disable" : "Enable"} Auto Refresh`}
                  >
                    <Button
                      icon={<SettingOutlined />}
                      onClick={() => setAutoPolling(!autoPolling)}
                      className={
                        autoPolling ? "mavebutton" : "mavecancelbutton"
                      }
                    />
                  </Tooltip> */}
                  <Tooltip title="Change Card">
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => setIsModalVisible(true)}
                      className="mavebutton"
                    />
                  </Tooltip>
                </>
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
              >
                <Tooltip title="Delete">
                  <Button
                    icon={<DeleteOutlined />}
                    className="mavecancelbutton"
                  />
                </Tooltip>
              </Popconfirm>
            </Space>
          ) : (
            <Space>
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
            </Space>
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
            <div
              className={`flex ${cardData.config?.layout === "horizontal" ? "flex-row" : "flex-col"} gap-4 border p-4 rounded-md bg-white relative`}
            >
              {isRefreshing && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-md">
                  <div className="flex items-center gap-2">
                    <ReloadOutlined spin />
                    <span>Refreshing...</span>
                  </div>
                </div>
              )}
              {cardData.config?.showImage && (
                <div
                  className={
                    cardData.config?.layout === "horizontal"
                      ? "w-1/3"
                      : "w-full"
                  }
                >
                  {renderCardMedia(cardData.media_files)}
                </div>
              )}
              <div
                className={
                  cardData.config?.layout === "horizontal" ? "w-2/3" : "w-full"
                }
              >
                <Text strong className="text-xl">
                  {cardData.title_en || "Card Title"}
                </Text>
                {cardData.config?.showDescription && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        cardData.description_en?.length <= 200
                          ? cardData.description_en
                          : cardData.description_en?.slice(0, 200) + "...",
                    }}
                  />
                )}
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
            <div
              className={`flex ${selectedCardData.config?.layout === "horizontal" ? "flex-row" : "flex-col"} gap-4 border p-4 rounded-md bg-white`}
            >
              {selectedCardData.config?.showImage && (
                <div
                  className={
                    selectedCardData.config?.layout === "horizontal"
                      ? "w-1/3"
                      : "w-full"
                  }
                >
                  {renderCardMedia(selectedCardData.media_files)}
                </div>
              )}
              <div
                className={
                  selectedCardData.config?.layout === "horizontal"
                    ? "w-2/3"
                    : "w-full"
                }
              >
                <Text strong className="text-xl">
                  {selectedCardData.title_en || "Card Title"}
                </Text>
                {selectedCardData.config?.showDescription && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html:
                        selectedCardData.description_en?.length <= 200
                          ? selectedCardData.description_en
                          : selectedCardData.description_en?.slice(0, 200) +
                            "...",
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <CardSelectionModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSelectCard={handleSelectCard}
        initialCard={cardData}
      />
    </div>
  );
};

export default CardComponent;
