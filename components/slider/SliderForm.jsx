// components/slider/SliderForm.jsx

import React, { useEffect, useState } from "react";
import { Drawer, Form, Modal, message } from "antd";
import MediaSelectionModal from "../PageBuilder/Modals/MediaSelectionModal";
import instance from "../../axios";
import BasicInfoForm from "./SliderForm/BasicInfoForm";
import SliderTypeTabs from "./SliderForm/SliderTypeTabs";
import MediaSelector from "./SliderForm/MediaSelector";
import CardSelector from "./SliderForm/CardSelector";
import FormActions from "./SliderForm/FormActions";
import { orderByIds } from "./SliderForm/orderByIds";

const SliderForm = ({
  form,
  type,
  setType,
  selectedMedia,
  setSelectedMedia,
  selectedCards,
  setSelectedCards,
  editingItemId,
  fetchSliders,
  onCancelEdit,
  isFormVisible,
  setIsFormVisible,
  allTags,
}) => {
  const [isMediaModalVisible, setIsMediaModalVisible] = useState(false);
  const [cards, setCards] = useState([]);

  // Define selectionMode as a constant
  const selectionMode = "multiple";

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await instance.get("/cards");
        if (response.data) {
          setCards(response.data);
        }
      } catch (error) {
        message.error("Failed to fetch cards.");
      }
    };
    fetchCards();
  }, []);

  // Ensure that when the form is closed, the media modal is also closed
  useEffect(() => {
    if (!isFormVisible) {
      setIsMediaModalVisible(false);
    }
  }, [isFormVisible]);

  // Prepopulate form fields and selections when editing
  useEffect(() => {
    if (editingItemId) {
      const populateForm = async () => {
        try {
          const response = await instance.get(`/sliders/${editingItemId}`);
          const slider = response.data;
          if (slider) {
            form.setFieldsValue({
              title_en: slider.title_en,
              title_bn: slider.title_bn,
              description_en: slider.description_en,
              description_bn: slider.description_bn,
              type: slider.type,
              // tags: slider.additional?.tags || [],
            });
            setSelectedMedia(
              orderByIds(slider.medias || [], slider.media_ids || [])
            );
            setSelectedCards(slider.card_ids || []);
            setType(slider.type);
          }
        } catch (error) {
          message.error("Failed to fetch slider details.");
        }
      };
      populateForm();
    } else {
      // Reset form when creating a new slider
      form.resetFields();
      setSelectedMedia([]);
      setSelectedCards([]);
      setType("image");
    }
  }, [editingItemId, form, setType]);

  const handleTypeChange = (value) => {
    setType(value);
    form.setFieldsValue({ type: value });

    if (value === "image") {
      setSelectedCards([]);
    } else if (value === "card") {
      setSelectedMedia([]);
    }
  };

  const handleSubmit = async (values) => {
    const payload = {
      title_en: values.title_en,
      title_bn: values.title_bn,
      description_en: values.description_en,
      description_bn: values.description_bn,
      type: values.type,
    };

    // if (values.tags) {
    //   payload.additional = {
    //     ...(payload.additional || {}),
    //     tags: values.tags,
    //   };
    // }

    if (values.type === "image") {
      payload.media_ids = selectedMedia?.map((media) => media.id);
      // Ensure card_ids are cleared
      payload.card_ids = [];
    } else if (values.type === "card") {
      payload.card_ids = selectedCards;
      // Ensure media_ids are cleared
      payload.media_ids = [];
    }

    try {
      if (editingItemId) {
        const response = await instance.put(
          `/sliders/${editingItemId}`,
          payload
        );
        if (response.status === 200) {
          message.success("Slider updated successfully.");
          fetchSliders();
          onCancelEdit();
        }
      } else {
        const response = await instance.post("/sliders", payload);
        if (response.status === 201) {
          message.success("Slider created successfully.");
          fetchSliders();
          form.resetFields();
          setSelectedMedia([]);
          setSelectedCards([]);
          setType("image");
        }
      }
    } catch (error) {
      // message.error("Failed to submit slider.");
      console.error(error);
    } finally {
      setIsFormVisible(false);
    }
  };

  // Placeholder images
  const imagePlaceholder = "/images/Image_Placeholder.png";
  const cardPlaceholder = "/images/Card_Placeholder.png";

  return (
    <Drawer
      title={editingItemId ? "Edit Slider" : "Add Slider"}
      open={isFormVisible}
      onClose={onCancelEdit}
      footer={null}
      width={`calc(100% - 40vw)`}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ type: "image" }}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        {/* Basic Information */}
        <BasicInfoForm
          allTags={allTags}
          form={form}
          imagePlaceholder={imagePlaceholder}
          cardPlaceholder={cardPlaceholder}
        />

        {/* Slider Type Selection */}
        <Form.Item
          label="Slider Type"
          name="type"
          rules={[
            { required: true, message: "Please select the slider type." },
          ]}
        >
          <SliderTypeTabs type={type} handleTypeChange={handleTypeChange} />
        </Form.Item>

        {/* Media or Card Selection */}
        {type === "image" ? (
          <Form.Item label="Media">
            <MediaSelector
              selectedMedia={selectedMedia}
              setSelectedMedia={setSelectedMedia}
              setIsMediaModalVisible={setIsMediaModalVisible}
              imagePlaceholder={imagePlaceholder}
            />
          </Form.Item>
        ) : (
          <Form.Item label="Select Cards">
            <CardSelector
              selectedCards={selectedCards}
              setSelectedCards={setSelectedCards}
              cards={cards}
            />
          </Form.Item>
        )}

        {/* Form Actions */}
        <FormActions
          editingItemId={editingItemId}
          onCancelEdit={onCancelEdit}
        />
      </Form>

      {/* Media Selection Modal */}
      <MediaSelectionModal
        isVisible={isMediaModalVisible}
        onClose={() => setIsMediaModalVisible(false)}
        onSelectMedia={(media) => {
          setSelectedMedia(media);
        }}
        selectionMode={selectionMode}
      />
    </Drawer>
  );
};

export default SliderForm;
