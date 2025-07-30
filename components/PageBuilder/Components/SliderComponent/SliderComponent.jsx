import React, { useState, useEffect, useCallback } from "react";
import { Modal, message, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import SliderRenderer from "./SliderRenderer";
import { useSliderRefresh } from "./SliderRefresh";
import SliderConfig from "./SliderConfig";
import SliderActions from "./SliderActions";
import SliderSelectionModal from "../../Modals/SliderSelectionModal";

const SliderComponent = ({
  component,
  updateComponent,
  deleteComponent,
  preview = false,
  isEditing = false,
  onDuplicateElement,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [sliderData, setSliderData] = useState(component._mave);
  const [selectedSliderData, setSelectedSliderData] = useState(null);
  // Removed showConfig state - not needed
  const [sliderConfig, setSliderConfig] = useState({
    autoplay: component._mave?.config?.autoplay ?? true,
    dots: component._mave?.config?.dots ?? false,
    effect: component._mave?.config?.effect ?? "scroll",
    speed: component._mave?.config?.speed ?? 500,
    height: component._mave?.config?.height ?? 400,
  });

  // Use the refresh hook with isEditing state and preview mode
  const { isRefreshing, pollingError, handleManualRefresh } = useSliderRefresh(
    sliderData,
    component,
    updateComponent,
    preview,
    isEditing
  );

  // Synchronize sliderData with component._mave when it changes
  useEffect(() => {
    setSliderData(component._mave);

    // Also sync the config if it exists
    if (component._mave?.config) {
      setSliderConfig((prevConfig) => ({
        ...prevConfig,
        ...component._mave.config,
      }));
    }
  }, [component._mave]);

  // Handle selection from SliderSelectionModal
  const handleSelectSlider = useCallback((selectedSlider) => {
    setSelectedSliderData(selectedSlider);
    setIsModalVisible(false);
  }, []);

  // Handle Submit (Confirm) Changes
  const handleSubmit = useCallback(() => {
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

    const updatedComponent = {
      ...component,
      _mave: {
        ...selectedSliderData,
        config: sliderConfig,
      },
      id: selectedSliderData.id,
    };

    updateComponent(updatedComponent);
    setSliderData(selectedSliderData);
    setSelectedSliderData(null);
    message.success("Slider updated successfully.");
  }, [selectedSliderData, sliderConfig, component, updateComponent]);

  // Handle Cancel Changes
  const handleCancel = useCallback(() => {
    setSelectedSliderData(null);
    message.info("Slider update canceled.");
  }, []);

  // Handle Delete Component
  const handleDelete = useCallback(() => {
    deleteComponent();
  }, [deleteComponent]);

  // If in preview mode, render the slider content only
  if (preview) {
    return (
      <div className="preview-slider-component p-4 bg-gray-100 rounded-md">
        <SliderRenderer sliderData={sliderData} config={sliderData?.config} />
      </div>
    );
  }

  return (
    <div className="border p-4 rounded-md bg-white">
      <SliderActions
        sliderData={sliderData}
        isEditing={!!selectedSliderData}
        selectedSliderData={selectedSliderData}
        isRefreshing={isRefreshing}
        pollingError={pollingError}
        onRefresh={handleManualRefresh}
        onEdit={() => setIsModalVisible(true)}
        onDuplicate={onDuplicateElement}
        onDelete={handleDelete}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />

      <div className="flex flex-col md:flex-row items-start gap-4">
        <div
          className={`flex flex-col ${selectedSliderData ? "w-full md:w-1/2" : "w-full"}`}
        >
          {sliderData && selectedSliderData && (
            <h4 className="mb-2 text-md font-semibold">Current Slider</h4>
          )}
          {sliderData ? (
            <div className="w-full relative">
              <SliderRenderer
                sliderData={sliderData}
                config={sliderData.config}
              />
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

        {selectedSliderData && (
          <div className="flex flex-col w-full md:w-1/2">
            <h4 className="mb-2 text-md font-semibold">Selected Slider</h4>
            <div className="w-full relative">
              <SliderRenderer
                sliderData={selectedSliderData}
                config={selectedSliderData.config}
              />
            </div>
          </div>
        )}
      </div>

      {selectedSliderData && (
        <div className="mt-4">
          <SliderConfig config={sliderConfig} setConfig={setSliderConfig} />
        </div>
      )}

      <SliderSelectionModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSelectSlider={handleSelectSlider}
      />
    </div>
  );
};

export default SliderComponent;
