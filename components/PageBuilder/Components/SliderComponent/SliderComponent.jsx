import React, { useState, useEffect, useCallback } from "react";
import { Modal, message, Button, Collapse, Switch, Form, Input } from "antd";
import { EditOutlined, GlobalOutlined, CheckOutlined } from "@ant-design/icons";
import SliderRenderer from "./SliderRenderer";
import { useSliderRefresh } from "./SliderRefresh";
import SliderConfig from "./SliderConfig";
import SliderActions from "./SliderActions";
import SliderSelectionModal from "../../Modals/SliderSelectionModal";
import RichTextEditor from "../../../RichTextEditor";

const { Panel } = Collapse;

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
  const [showAltContent, setShowAltContent] = useState(false);
  const [showAltInputs, setShowAltInputs] = useState(false);
  const [showSliderAltInputs, setShowSliderAltInputs] = useState(false);
  const [sliderAltTitle, setSliderAltTitle] = useState(
    component._mave?.altTitle || ""
  );
  const [sliderAltDescription, setSliderAltDescription] = useState(
    component._mave?.altDescription || ""
  );
  const [tempSliderAltTitle, setTempSliderAltTitle] = useState("");
  const [tempSliderAltDescription, setTempSliderAltDescription] = useState("");

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
    setShowAltContent(component._mave?.showAltContent || false);
    setSliderAltTitle(component._mave?.altTitle || "");
    setSliderAltDescription(component._mave?.altDescription || "");

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

  // Handle Main Slider Alt Content Edit
  const handleEditSliderAltContent = useCallback(() => {
    setTempSliderAltTitle(sliderAltTitle);
    setTempSliderAltDescription(sliderAltDescription);
    setShowSliderAltInputs(true);
  }, [sliderAltTitle, sliderAltDescription]);

  // Handle Main Slider Alt Content Save
  const handleSaveSliderAltContent = useCallback(() => {
    setSliderAltTitle(tempSliderAltTitle);
    setSliderAltDescription(tempSliderAltDescription);
    updateComponent({
      ...component,
      _mave: {
        ...sliderData,
        altTitle: tempSliderAltTitle,
        altDescription: tempSliderAltDescription,
      },
    });
    setShowSliderAltInputs(false);
    message.success("Main slider alternative content updated successfully.");
  }, [
    tempSliderAltTitle,
    tempSliderAltDescription,
    component,
    sliderData,
    updateComponent,
  ]);

  // Handle Main Slider Alt Content Cancel
  const handleCancelSliderAltContent = useCallback(() => {
    setTempSliderAltTitle(sliderAltTitle);
    setTempSliderAltDescription(sliderAltDescription);
    setShowSliderAltInputs(false);
  }, [sliderAltTitle, sliderAltDescription]);

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

      {/* Multi-Language Configuration */}
      {sliderData && !preview && (
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
                    Toggle to show alternative titles and descriptions for
                    slider items
                  </p>
                </div>
                <Switch
                  checked={showAltContent}
                  onChange={(checked) => {
                    setShowAltContent(checked);
                    updateComponent({
                      ...component,
                      _mave: {
                        ...sliderData,
                        showAltContent: checked,
                      },
                    });
                  }}
                />
              </div>

              {showAltContent && (
                <div className="mt-4 p-3 bg-gray-200 rounded-lg">
                  <div className="text-sm text-gray-800">
                    <strong>Alternative Content Mode:</strong> Slider items will
                    display alternative titles and descriptions when available.
                  </div>
                </div>
              )}

              {/* Main Slider Alternative Content */}
              <div className="mt-6 p-4 bg-white rounded-lg border">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-lg font-semibold flex items-center gap-2">
                    <EditOutlined />
                    Main Slider Alternative Content
                  </h5>
                  <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={handleEditSliderAltContent}
                    className="mavebutton"
                    size="small"
                  >
                    Edit
                  </Button>
                </div>

                {showSliderAltInputs ? (
                  <div className="space-y-4">
                    <Form layout="vertical" className="w-full">
                      <Form.Item label="Alternative Title" className="mb-3">
                        <RichTextEditor
                          defaultValue={tempSliderAltTitle}
                          editMode={true}
                          onChange={(html) => setTempSliderAltTitle(html)}
                        />
                      </Form.Item>

                      <Form.Item
                        label="Alternative Description"
                        className="mb-3"
                      >
                        <RichTextEditor
                          defaultValue={tempSliderAltDescription}
                          onChange={setTempSliderAltDescription}
                          editMode={true}
                          maxLength={1000}
                        />
                      </Form.Item>
                    </Form>

                    {/* Save/Cancel Buttons */}
                    <div className="mt-4 flex justify-end gap-2">
                      <Button
                        onClick={handleCancelSliderAltContent}
                        className="mavecancelbutton"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="primary"
                        icon={<CheckOutlined />}
                        onClick={handleSaveSliderAltContent}
                        className="mavebutton"
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  /* Display Current Main Slider Alternative Content */
                  <div className="border rounded-lg p-3 bg-gray-200">
                    <div className="font-medium text-sm mb-2">Main Slider</div>
                    <div className="text-sm">
                      <div>
                        <strong>Alt Title:</strong>{" "}
                        <div
                          dangerouslySetInnerHTML={{
                            __html: sliderAltTitle || "Not set",
                          }}
                        />
                      </div>
                      <div>
                        <strong>Alt Description:</strong>{" "}
                        <div
                          dangerouslySetInnerHTML={{
                            __html: sliderAltDescription || "Not set",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Individual Items Alternative Content Editing Section */}
              <div className="mt-6 p-4 bg-white rounded-lg border">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-lg font-semibold flex items-center gap-2">
                    <EditOutlined />
                    Individual Items Alternative Content
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

                {showAltInputs ? (
                  <div className="space-y-4">
                    {sliderData.type === "image" &&
                      sliderData.medias &&
                      sliderData.medias.map((media, index) => (
                        <div
                          key={index}
                          className="border rounded-lg p-4 bg-gray-50"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            <img
                              src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${media.file_path}`}
                              alt={media.title || "Media"}
                              className="w-16 h-12 rounded object-cover"
                            />
                            <div>
                              <div className="font-medium text-sm">
                                {media.title || media.file_name || "Untitled"}
                              </div>
                            </div>
                          </div>

                          <Form layout="vertical" className="w-full">
                            <Form.Item
                              label="Alternative Title"
                              className="mb-3"
                            >
                              <RichTextEditor
                                defaultValue={media.altTitle || ""}
                                editMode={true}
                                onChange={(html) => {
                                  const updatedMedias = [...sliderData.medias];
                                  updatedMedias[index] = {
                                    ...updatedMedias[index],
                                    altTitle: html,
                                  };
                                  setSliderData({
                                    ...sliderData,
                                    medias: updatedMedias,
                                  });
                                }}
                              />
                            </Form.Item>

                            <Form.Item
                              label="Alternative Description"
                              className="mb-3"
                            >
                              <RichTextEditor
                                defaultValue={media.altDescription || ""}
                                editMode={true}
                                onChange={(html) => {
                                  const updatedMedias = [...sliderData.medias];
                                  updatedMedias[index] = {
                                    ...updatedMedias[index],
                                    altDescription: html,
                                  };
                                  setSliderData({
                                    ...sliderData,
                                    medias: updatedMedias,
                                  });
                                }}
                              />
                            </Form.Item>
                          </Form>
                        </div>
                      ))}

                    {sliderData.type === "card" &&
                      sliderData.cards &&
                      sliderData.cards.map((card, index) => (
                        <div
                          key={index}
                          className="border rounded-lg p-4 bg-gray-50"
                        >
                          <div className="flex items-center gap-3 mb-3">
                            {card.image && (
                              <img
                                src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${card.image.file_path}`}
                                alt={card.title || "Card"}
                                className="w-16 h-12 rounded object-cover"
                              />
                            )}
                            <div>
                              <div className="font-medium text-sm">
                                {card.title || "Untitled Card"}
                              </div>
                            </div>
                          </div>

                          <Form layout="vertical" className="w-full">
                            <Form.Item
                              label="Alternative Title"
                              className="mb-3"
                            >
                              <RichTextEditor
                                defaultValue={card.altTitle || ""}
                                editMode={true}
                                onChange={(html) => {
                                  const updatedCards = [...sliderData.cards];
                                  updatedCards[index] = {
                                    ...updatedCards[index],
                                    altTitle: html,
                                  };
                                  setSliderData({
                                    ...sliderData,
                                    cards: updatedCards,
                                  });
                                }}
                              />
                            </Form.Item>

                            <Form.Item
                              label="Alternative Description"
                              className="mb-3"
                            >
                              <RichTextEditor
                                defaultValue={card.altDescription || ""}
                                editMode={true}
                                onChange={(html) => {
                                  const updatedCards = [...sliderData.cards];
                                  updatedCards[index] = {
                                    ...updatedCards[index],
                                    altDescription: html,
                                  };
                                  setSliderData({
                                    ...sliderData,
                                    cards: updatedCards,
                                  });
                                }}
                              />
                            </Form.Item>
                          </Form>
                        </div>
                      ))}

                    {/* Update Button */}
                    <div className="mt-4 flex justify-end">
                      <Button
                        type="primary"
                        icon={<CheckOutlined />}
                        onClick={() => {
                          updateComponent({
                            ...component,
                            _mave: sliderData,
                          });
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
                  </div>
                ) : (
                  /* Display Current Individual Items Alternative Content */
                  <div className="space-y-3">
                    {sliderData.type === "image" &&
                      sliderData.medias &&
                      sliderData.medias.map((media, index) => (
                        <div
                          key={index}
                          className="border rounded-lg p-3 bg-gray-50"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            <img
                              src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${media.file_path}`}
                              alt={media.title || "Media"}
                              className="w-12 h-8 rounded object-cover"
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
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: media.altTitle || "Not set",
                                }}
                              />
                            </div>
                            <div>
                              <strong>Alt Description:</strong>{" "}
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: media.altDescription || "Not set",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}

                    {sliderData.type === "card" &&
                      sliderData.cards &&
                      sliderData.cards.map((card, index) => (
                        <div
                          key={index}
                          className="border rounded-lg p-3 bg-gray-50"
                        >
                          <div className="flex items-center gap-3 mb-2">
                            {card.image && (
                              <img
                                src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${card.image.file_path}`}
                                alt={card.title || "Card"}
                                className="w-12 h-8 rounded object-cover"
                              />
                            )}
                            <div>
                              <div className="font-medium text-sm">
                                {card.title || "Untitled Card"}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm">
                            <div>
                              <strong>Alt Title:</strong>{" "}
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: card.altTitle || "Not set",
                                }}
                              />
                            </div>
                            <div>
                              <strong>Alt Description:</strong>{" "}
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: card.altDescription || "Not set",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </Panel>
        </Collapse>
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
