// components/PageBuilder/Components/SliderComponent.jsx

import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Typography,
  message,
  Carousel,
  Popconfirm,
  Space,
  Tooltip,
  Drawer,
  Radio,
  Select,
  Switch,
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
  CheckCircleOutlined,
} from "@ant-design/icons";
import SliderSelectionModal from "../Modals/SliderSelectionModal";
import Image from "next/image";
import instance from "../../../axios";

const { Paragraph, Text } = Typography;

// Helper function to render slider images
const renderSliderImages = (medias) => {
  return medias?.map((media) => (
    <div key={media.id} className="relative w-full">
      <Image
        src={
          media.file_path
            ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/${media.file_path}`
            : "/images/Image_Placeholder.png"
        }
        alt={media.title || "Slider Image"}
        width={900}
        height={400}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
  preview = false,
  onDuplicateElement,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sliderData, setSliderData] = useState(component._mave);
  const [selectedSliderData, setSelectedSliderData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [sliderConfig, setSliderConfig] = useState({
    autoplay: true,
    dots: false,
    effect: "scroll",
    speed: 500,
    height: 400,
  });

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

    // Validate card slider data
    if (
      selectedSliderData.type === "card" &&
      (!selectedSliderData.cards || selectedSliderData.cards.length === 0)
    ) {
      Modal.error({
        title: "Validation Error",
        content: "Selected card slider has no cards.",
      });
      return;
    }

    // Validate image slider data
    if (
      selectedSliderData.type === "image" &&
      (!selectedSliderData.medias || selectedSliderData.medias.length === 0)
    ) {
      Modal.error({
        title: "Validation Error",
        content: "Selected image slider has no images.",
      });
      return;
    }

    updateComponent({
      ...component,
      _mave: {
        ...selectedSliderData,
        config: sliderConfig,
      },
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

  // Helper function to render card slider
  const renderCardSlider = (cards) => {
    if (!cards || cards.length === 0) return null;

    return cards.map((card) => (
      <div key={card.id} className="p-4 bg-white rounded-lg shadow-md">
        {card.media_files?.file_path && (
          <div className="relative w-full">
            <Image
              src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${card.media_files.file_path}`}
              alt={card.title_en || "Card Image"}
              width={900}
              height={600}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              objectFit="cover"
              className="rounded-lg"
              priority
            />
          </div>
        )}
        <div className="mt-2">
          <Text strong className="text-lg">
            {card.title_en || "Untitled Card"}
          </Text>
        </div>
      </div>
    ));
  };

  // If in preview mode, render the slider content only
  if (preview) {
    return (
      <div className="preview-slider-component p-4 bg-gray-100 rounded-md">
        {sliderData?.type === "image" && sliderData?.medias?.length > 0 ? (
          <div className="w-full">
            <Carousel
              autoplay={sliderData.config?.autoplay ?? true}
              dots={sliderData.config?.dots ?? false}
              effect={sliderData.config?.effect ?? "scroll"}
              speed={sliderData.config?.speed ?? 500}
              className="rounded-lg overflow-hidden"
            >
              {renderSliderImages(sliderData.medias)}
            </Carousel>
          </div>
        ) : sliderData?.type === "card" && sliderData?.cards?.length > 0 ? (
          <div className="w-full">
            <Carousel
              autoplay={sliderData.config?.autoplay ?? true}
              dots={sliderData.config?.dots ?? false}
              effect={sliderData.config?.effect ?? "scroll"}
              speed={sliderData.config?.speed ?? 500}
              className="rounded-lg overflow-hidden"
            >
              {renderCardSlider(sliderData.cards)}
            </Carousel>
          </div>
        ) : (
          <p className="text-gray-500 text-center">No slider selected.</p>
        )}
      </div>
    );
  }

  return (
    <div className="border p-4 rounded-md bg-white">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <DragOutlined className="text-2xl border rounded-md p-1" />
          <h3 className="text-xl font-semibold">Slider Component</h3>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <Space>
              {sliderData && (
                <Tooltip title="Change Slider">
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
          className={`flex flex-col ${isEditing && selectedSliderData ? "w-full md:w-1/2" : "w-full"}`}
        >
          {sliderData && isEditing && (
            <h4 className="mb-2 text-md font-semibold">Current Slider</h4>
          )}
          {sliderData?.type === "image" && sliderData?.medias?.length > 0 ? (
            <div className="w-full relative">
              <h2 className="text-xl font-bold text-theme pb-4">
                {sliderData.title_en || "Slider Title"}
              </h2>
              <Carousel
                autoplay={sliderData.config?.autoplay ?? true}
                dots={sliderData.config?.dots ?? false}
                effect={sliderData.config?.effect ?? "scroll"}
                speed={sliderData.config?.speed ?? 500}
                className="rounded-lg overflow-hidden"
              >
                {renderSliderImages(sliderData.medias)}
              </Carousel>
            </div>
          ) : sliderData?.type === "card" && sliderData?.cards?.length > 0 ? (
            <div className="w-full relative">
              <h2 className="text-xl font-bold text-theme pb-4">
                {sliderData.title_en || "Slider Title"}
              </h2>
              <Carousel
                autoplay={sliderData.config?.autoplay ?? true}
                dots={sliderData.config?.dots ?? false}
                effect={sliderData.config?.effect ?? "scroll"}
                speed={sliderData.config?.speed ?? 500}
                className="rounded-lg overflow-hidden"
              >
                {renderCardSlider(sliderData.cards)}
              </Carousel>
            </div>
          ) : (
            <Button
              icon={<EditOutlined />}
              onClick={() => setIsModalVisible(true)}
              className="mavebutton w-fit"
            >
              Select Slider
            </Button>
          )}
        </div>

        {isEditing && selectedSliderData && (
          <div className="flex flex-col w-full md:w-1/2">
            <h4 className="mb-2 text-md font-semibold">Selected Slider</h4>
            <div className="w-full relative">
              <h2 className="text-xl font-bold text-theme pb-4">
                {selectedSliderData.title_en || "Slider Title"}
              </h2>
              <Carousel
                autoplay={selectedSliderData.config?.autoplay ?? true}
                dots={selectedSliderData.config?.dots ?? false}
                effect={selectedSliderData.config?.effect ?? "scroll"}
                speed={selectedSliderData.config?.speed ?? 500}
                className="rounded-lg overflow-hidden"
              >
                {selectedSliderData.type === "image"
                  ? renderSliderImages(selectedSliderData.medias)
                  : renderCardSlider(selectedSliderData.cards)}
              </Carousel>
            </div>
          </div>
        )}
      </div>

      <SliderSelectionModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSelectSlider={handleSelectSlider}
        initialSlider={sliderData}
      />

      <Drawer
        title="Slider Configuration"
        placement="right"
        onClose={() => setShowConfig(false)}
        open={showConfig}
        width={400}
        extra={
          <Space>
            <Button type="primary" onClick={() => setShowConfig(false)}>
              Save
            </Button>
          </Space>
        }
      >
        <div className="space-y-6 p-4">
          <div>
            <Paragraph strong className="text-lg">
              Preview
            </Paragraph>
            <div className="mt-4 border rounded-lg overflow-hidden p-4 bg-gray-50">
              <Carousel
                autoplay={sliderConfig.autoplay}
                dots={sliderConfig.dots}
                effect={sliderConfig.effect}
                speed={sliderConfig.speed}
                className="rounded-lg"
              >
                {sliderData?.type === "image" &&
                sliderData?.medias?.length > 0 ? (
                  renderSliderImages(sliderData.medias)
                ) : sliderData?.type === "card" &&
                  sliderData?.cards?.length > 0 ? (
                  renderCardSlider(sliderData.cards)
                ) : (
                  <div className="flex items-center justify-center h-48 bg-gray-100">
                    <Paragraph type="secondary">No slider selected</Paragraph>
                  </div>
                )}
              </Carousel>
            </div>
          </div>

          <div>
            <Paragraph strong className="text-lg">
              Slider Settings
            </Paragraph>
            <div className="mt-4 space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <Paragraph className="font-medium mb-0">Autoplay</Paragraph>
                  <Paragraph type="secondary" className="text-xs mb-0">
                    Automatically advance slides
                  </Paragraph>
                </div>
                <Switch
                  checked={sliderConfig.autoplay}
                  onChange={(checked) =>
                    setSliderConfig({ ...sliderConfig, autoplay: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <Paragraph className="font-medium mb-0">Show Dots</Paragraph>
                  <Paragraph type="secondary" className="text-xs mb-0">
                    Display navigation dots
                  </Paragraph>
                </div>
                <Switch
                  checked={sliderConfig.dots}
                  onChange={(checked) =>
                    setSliderConfig({ ...sliderConfig, dots: checked })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Paragraph className="font-medium">Effect</Paragraph>
                  <Select
                    value={sliderConfig.effect}
                    onChange={(value) =>
                      setSliderConfig({ ...sliderConfig, effect: value })
                    }
                    className="w-full"
                    size="small"
                  >
                    <Select.Option value="scroll">Scroll</Select.Option>
                    <Select.Option value="fade">Fade</Select.Option>
                    <Select.Option value="slide">Slide</Select.Option>
                  </Select>
                </div>

                <div className="space-y-1">
                  <Paragraph className="font-medium">Speed</Paragraph>
                  <Select
                    value={sliderConfig.speed}
                    onChange={(value) =>
                      setSliderConfig({ ...sliderConfig, speed: value })
                    }
                    className="w-full"
                    size="small"
                  >
                    <Select.Option value={300}>Fast</Select.Option>
                    <Select.Option value={500}>Medium</Select.Option>
                    <Select.Option value={800}>Slow</Select.Option>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default SliderComponent;
