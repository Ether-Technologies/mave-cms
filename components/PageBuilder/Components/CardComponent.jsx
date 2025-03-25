// components/PageBuilder/Components/CardComponent.jsx

import React, { useState, useEffect } from "react";
import { Button, Modal, Popconfirm, Typography, message } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  ExportOutlined,
  CopyFilled,
  DragOutlined,
} from "@ant-design/icons";
import CardSelectionModal from "../Modals/CardSelectionModal";
import Image from "next/image";

const { Paragraph } = Typography;

// Helper function to render card media
const renderCardMedia = (media) => {
  if (!media || !media.file_path) {
    return (
      <div className="w-40 h-40 bg-gray-300 flex items-center justify-center rounded-md">
        <Image
          src="/images/Image_Placeholder.png"
          alt="No Image"
          width={360}
          height={360}
          objectFit="cover"
          className="rounded-md"
          priority
        />
      </div>
    );
  }
  return (
    <Image
      src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${media.file_path}`}
      alt={media.title_en || "Card Image"}
      width={360}
      height={360}
      objectFit="cover"
      className="rounded-md"
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

  // Synchronize cardData with component._mave when it changes
  useEffect(() => {
    setCardData(component._mave);
  }, [component._mave]);

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
      _mave: selectedCardData,
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
        {cardData ? (
          <div className="flex items-center gap-44 border p-4 rounded-md bg-white">
            {/* Media on the Left */}
            <div className="mr-4">{renderCardMedia(cardData.media_files)}</div>
            {/* Content on the Right */}
            <div className="flex flex-col">
              <h2 className="text-xl font-bold text-theme">
                {cardData.title_en || "Card Title"}
              </h2>
              <Paragraph>
                {cardData.description_en ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: cardData.description_en.slice(0, 300) + "...",
                    }}
                  />
                ) : (
                  "No description."
                )}
              </Paragraph>
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
        </div>
        <div>
          {!isEditing ? (
            <>
              {cardData && (
                <Button
                  icon={<ExportOutlined />}
                  onClick={() => setIsModalVisible(true)}
                  className="mavebutton"
                >
                  Change
                </Button>
              )}
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
              >
                <Button
                  icon={<DeleteOutlined />}
                  className="mavecancelbutton"
                />
              </Popconfirm>
            </>
          ) : (
            <>
              <Button
                icon={<CheckOutlined />}
                onClick={handleSubmit}
                className="mavebutton"
              >
                Done
              </Button>
              <Button
                icon={<CloseOutlined />}
                onClick={handleCancel}
                className="mavecancelbutton"
              >
                Discard
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-start gap-4">
        <div className="flex flex-col w-full md:w-1/2">
          {cardData && (
            <h4 className="mb-2 text-md font-semibold">Current Card</h4>
          )}
          {cardData ? (
            <div className="flex items-center border p-4 rounded-md bg-white">
              {/* Media on the Left */}
              <div className="mr-4">
                {renderCardMedia(cardData.media_files)}
              </div>
              {/* Content on the Right */}
              <div className="flex flex-col">
                <h2 className="text-xl font-bold">
                  {cardData.title_en || "Card Title"}
                </h2>
                <Paragraph>
                  {cardData.description_en ? (
                    cardData.description_en.length > 200 ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: cardData.description_en.slice(0, 200) + "...",
                        }}
                      />
                    ) : (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: cardData.description_en,
                        }}
                      />
                    )
                  ) : (
                    "No description."
                  )}
                </Paragraph>
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
            <h4 className="mb-2 text-md font-medium">Selected Card</h4>
            <div className="flex items-center border p-4 rounded-md bg-white">
              {/* Media on the Left */}
              <div className="mr-4">
                {renderCardMedia(selectedCardData.media_files)}
              </div>
              {/* Content on the Right */}
              <div className="flex flex-col">
                <h2 className="text-xl font-bold">
                  {selectedCardData.title_en || "Card Title"}
                </h2>
                <Paragraph>
                  {selectedCardData.description_en ? (
                    selectedCardData.description_en.length > 200 ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html:
                            selectedCardData.description_en.slice(0, 200) +
                            "...",
                        }}
                      />
                    ) : (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: selectedCardData.description_en,
                        }}
                      />
                    )
                  ) : (
                    "No description."
                  )}
                </Paragraph>
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
