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
import { SlidersOutlined } from "@ant-design/icons";

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
            setSelectedMedia(slider.medias || []);
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

  const drawerTitle = (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: 34, height: 34, borderRadius: 10,
        background: "linear-gradient(135deg, #fcb813 0%, #f97316 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
        boxShadow: "0 3px 8px rgba(252,184,19,0.4)",
      }}>
        <SlidersOutlined style={{ fontSize: 17, color: "#fff" }} />
      </div>
      <div>
        <div style={{ fontWeight: 800, color: "#111827", fontSize: "0.95rem", lineHeight: 1.2 }}>
          {editingItemId ? "Edit Slider" : "Create New Slider"}
        </div>
        <div style={{ fontWeight: 400, color: "#9ca3af", fontSize: "0.7rem" }}>
          {editingItemId ? "Update slider details" : "Fill in the details to create a slider"}
        </div>
      </div>
    </div>
  );

  return (
    <Drawer
      title={drawerTitle}
      open={isFormVisible}
      onClose={onCancelEdit}
      footer={null}
      width={`calc(100% - 40vw)`}
      destroyOnClose
      styles={{ header: { borderBottom: "1px solid #f0f0f0", padding: "16px 24px" } }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ type: "image" }}
        style={{ padding: "4px 0" }}
      >
        {/* Basic Information */}
        <BasicInfoForm
          allTags={allTags}
          form={form}
          imagePlaceholder={imagePlaceholder}
          cardPlaceholder={cardPlaceholder}
        />

        {/* Slider Type Selection */}
        <div style={{
          background: "#f9fafb", borderRadius: 14,
          padding: "18px 20px", marginBottom: 16,
          border: "1px solid #f0f0f0",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ width: 3, height: 16, borderRadius: 2, background: "#111827" }} />
            <span style={{ fontWeight: 700, color: "#111827", fontSize: "0.85rem" }}>Slider Type</span>
          </div>
          <Form.Item
            name="type"
            rules={[{ required: true, message: "Please select the slider type." }]}
            style={{ marginBottom: 0 }}
          >
            <SliderTypeTabs type={type} handleTypeChange={handleTypeChange} />
          </Form.Item>
        </div>

        {/* Media or Card Selection */}
        <div style={{
          background: "#f9fafb", borderRadius: 14,
          padding: "18px 20px", marginBottom: 16,
          border: "1px solid #f0f0f0",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <div style={{ width: 3, height: 16, borderRadius: 2, background: type === "image" ? "#3b82f6" : "#7c3aed" }} />
            <span style={{ fontWeight: 700, color: "#111827", fontSize: "0.85rem" }}>
              {type === "image" ? "Select Media" : "Select Cards"}
            </span>
          </div>
          {type === "image" ? (
            <MediaSelector
              selectedMedia={selectedMedia}
              setSelectedMedia={setSelectedMedia}
              setIsMediaModalVisible={setIsMediaModalVisible}
              imagePlaceholder={imagePlaceholder}
            />
          ) : (
            <CardSelector
              selectedCards={selectedCards}
              setSelectedCards={setSelectedCards}
              cards={cards}
              cardPlaceholder={cardPlaceholder}
            />
          )}
        </div>

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
