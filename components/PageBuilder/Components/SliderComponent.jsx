// components/PageBuilder/Components/SliderComponent.jsx

import React, { useState, useEffect } from "react";
import { Button, Modal, Typography, message, Carousel, Popconfirm } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import SliderSelectionModal from "../Modals/SliderSelectionModal";
import Image from "next/image";

const { Paragraph } = Typography;

// Helper function to render slider images
const renderSliderImages = (medias) => {
  return medias?.map((media) => (
    <div key={media.id}>
      <Image
        src={
          media.file_path
            ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/${media.file_path}`
            : "/images/Image_Placeholder.png"
        }
        alt={media.title || "Slider Image"}
        width={400}
        height={200}
        objectFit="cover"
        className="rounded-lg"
        priority
      />
    </div>
  ));
};

const SliderComponent = ({
  component,
  updateComponent,
  deleteComponent,
  preview = false, // New prop with default value
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sliderData, setSliderData] = useState(component._mave);
  const [selectedSliderData, setSelectedSliderData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Synchronize sliderData with component._mave when it changes
  useEffect(() => {
    setSliderData(component._mave);
  }, [component._mave]);

  // Handle selection from SliderSelectionModal
  const handleSelectSlider = (selectedSlider) => {
    setSelectedSliderData(selectedSlider);
    setIsModalVisible(false);
    setIsEditing(true);
  };

  // Handle Submit (Confirm) Changes
  const handleSubmit = () => {
    if (!selectedSliderData) {
      Modal.error({
        title: "Validation Error",
        content: "No slider selected.",
      });
      return;
    }
    updateComponent({
      ...component,
      _mave: selectedSliderData,
      id: selectedSliderData.id,
    });
    setSliderData(selectedSliderData);
    setSelectedSliderData(null);
    setIsEditing(false);
    message.success("Slider updated successfully.");
  };

  // Handle Cancel Changes
  const handleCancel = () => {
    setSelectedSliderData(null);
    setIsEditing(false);
    message.info("Slider update canceled.");
  };

  // Handle Delete Component
  const handleDelete = () => {
    deleteComponent();
  };

  // If in preview mode, render the slider content only
  if (preview) {
    return (
      <div className="preview-slider-component p-4 bg-gray-100 rounded-md">
        {sliderData?.medias && sliderData.medias.length > 0 ? (
          <div className="w-full">
            <h2 className="text-xl font-bold text-theme pb-4">
              {sliderData.title_en || "Slider Title"}
            </h2>
            <Carousel autoplay>
              {renderSliderImages(sliderData.medias)}
            </Carousel>
          </div>
        ) : (
          <p className="text-gray-500">No slider selected.</p>
        )}
      </div>
    );
  }

  return (
    <div className="border p-4 rounded-md bg-gray-50">
      {/* Header with Component Title and Action Buttons */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Slider Component</h3>
        <div>
          {!isEditing ? (
            <>
              {sliderData && (
                <Button
                  icon={<ExportOutlined />}
                  onClick={() => setIsModalVisible(true)}
                  className="mavebutton"
                >
                  Change
                </Button>
              )}
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

      {/* Display Current and Selected Slider Side by Side */}
      <div className="flex flex-col md:flex-row items-start gap-4">
        {/* Current Slider */}
        <div className="flex flex-col w-full md:w-1/2">
          {sliderData && (
            <h4 className="mb-2 text-md font-semibold">Current Slider</h4>
          )}
          {sliderData?.medias && sliderData.medias.length > 0 ? (
            <div className="w-full">
              <h2 className="text-xl font-bold text-theme pb-4">
                {sliderData.title_en || "Slider Title"}
              </h2>
              <Carousel autoplay>
                {renderSliderImages(sliderData.medias)}
              </Carousel>
            </div>
          ) : (
            <>
              <Button
                icon={<EditOutlined />}
                onClick={() => setIsModalVisible(true)}
                className="mavebutton w-fit"
              >
                Select Slider
              </Button>
            </>
          )}
        </div>

        {/* Selected Slider (Shown Only When Editing) */}
        {isEditing && selectedSliderData && (
          <div className="flex flex-col w-full md:w-1/2">
            <h4 className="mb-2 text-md font-medium">Selected Slider</h4>
            {selectedSliderData?.medias &&
            selectedSliderData.medias.length > 0 ? (
              <div className="w-full">
                <h2 className="text-xl font-bold text-theme pb-4">
                  {selectedSliderData.title_en || "Slider Title"}
                </h2>
                <Carousel autoplay>
                  {renderSliderImages(selectedSliderData.medias)}
                </Carousel>
              </div>
            ) : (
              <Paragraph>No media in selected slider.</Paragraph>
            )}
          </div>
        )}
      </div>

      {/* Slider Selection Modal */}
      <SliderSelectionModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSelectSlider={handleSelectSlider}
      />
    </div>
  );
};

export default SliderComponent;
