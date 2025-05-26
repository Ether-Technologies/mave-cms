// components/PageBuilder/Components/TestimonialComponent/TestimonialComponent.jsx

import React, { useState, useEffect } from "react";
import { Button, Form, message, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import MediaSelectionModal from "../../Modals/MediaSelectionModal";
import ConfigSection from "./ConfigSection";
import TestimonialDisplay from "./TestimonialDisplay";
import TestimonialForm from "./TestimonialForm";

const { Paragraph } = Typography;

const TestimonialComponent = ({
  component,
  updateComponent,
  deleteComponent,
  preview = false,
}) => {
  const [testimonials, setTestimonials] = useState(
    component._mave?.testimonials || []
  );
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEdit, setCurrentEdit] = useState(null);
  const [layout, setLayout] = useState(component._mave?.layout || "carousel");
  const [font, setFont] = useState(component._mave?.font || "Arial");
  const [color, setColor] = useState(component._mave?.color || "#000000");
  const [background, setBackground] = useState(
    component._mave?.background || "#ffffff"
  );
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();

  useEffect(() => {
    updateComponent({
      ...component,
      _mave: {
        testimonials,
        layout,
        font,
        color,
        background,
      },
    });
  }, [
    testimonials,
    layout,
    font,
    color,
    background,
    updateComponent,
    component,
  ]);

  const handleAddTestimonial = () => {
    if (!preview) {
      setIsAdding(true);
      form.resetFields();
      setSelectedImage(null);
    }
  };

  const handleAddSubmit = (values) => {
    console.log("Add form - Submitting values:", values);
    console.log("Add form - Current selectedImage:", selectedImage);
    const newTestimonial = {
      id: Date.now(),
      quote: values.quote,
      author: values.author,
      rating: values.rating,
      image: selectedImage,
    };
    console.log("Add form - Creating new testimonial:", newTestimonial);
    setTestimonials([...testimonials, newTestimonial]);
    setIsAdding(false);
    setSelectedImage(null);
    form.resetFields();
    message.success("Testimonial added successfully.");
  };

  const handleEditTestimonial = (testimonial) => {
    if (!preview) {
      console.log("Edit form - Setting up edit for testimonial:", testimonial);
      setCurrentEdit(testimonial);
      setIsEditing(true);
      setSelectedImage(testimonial.image);
      editForm.setFieldsValue({
        quote: testimonial.quote,
        author: testimonial.author,
        rating: testimonial.rating,
        image: testimonial.image,
      });
    }
  };

  const handleEditSubmit = (values) => {
    console.log("Edit form - Submitting values:", values);
    console.log("Edit form - Current selectedImage:", selectedImage);
    const updatedTestimonial = {
      ...currentEdit,
      quote: values.quote,
      author: values.author,
      rating: values.rating,
      image: selectedImage,
    };
    console.log("Edit form - Updating testimonial:", updatedTestimonial);
    setTestimonials(
      testimonials.map((t) =>
        t.id === updatedTestimonial.id ? updatedTestimonial : t
      )
    );
    setIsEditing(false);
    setCurrentEdit(null);
    setSelectedImage(null);
    editForm.resetFields();
    message.success("Testimonial updated successfully.");
  };

  const handleDeleteTestimonial = (id) => {
    if (!preview) {
      Modal.confirm({
        title: "Are you sure you want to delete this testimonial?",
        onOk: () => {
          setTestimonials(testimonials.filter((t) => t.id !== id));
          message.success("Testimonial deleted successfully.");
        },
      });
    }
  };

  const handleLayoutChange = (value) => {
    if (!preview) setLayout(value);
  };

  const handleFontChange = (value) => {
    if (!preview) setFont(value);
  };

  const handleColorChange = (e) => {
    if (!preview) setColor(e.target.value);
  };

  const handleBackgroundChange = (e) => {
    if (!preview) setBackground(e.target.value);
  };

  const handleSelectImage = (media) => {
    console.log("Add form - Selected media:", media);
    if (media) {
      console.log("Add form - Setting selected media:", media);
      setSelectedImage(media);
      setIsImageModalVisible(false);
      message.success("Image selected successfully.");
    }
  };

  const handleEditSelectImage = (media) => {
    console.log("Edit form - Selected media:", media);
    if (media) {
      console.log("Edit form - Setting selected media:", media);
      setSelectedImage(media);
      setIsImageModalVisible(false);
      message.success("Image selected successfully.");
    }
  };

  const containerStyle = {
    fontFamily: font,
    color: color,
    backgroundColor: background,
    padding: "20px",
    borderRadius: "8px",
  };

  return (
    <div className="border p-4 rounded-md bg-white">
      {!preview && (
        <ConfigSection
          layout={layout}
          font={font}
          color={color}
          background={background}
          handleLayoutChange={handleLayoutChange}
          handleFontChange={handleFontChange}
          handleColorChange={handleColorChange}
          handleBackgroundChange={handleBackgroundChange}
          preview={preview}
        />
      )}

      {isAdding && !preview && (
        <div className="mb-6 p-4 border rounded-md bg-gray-50">
          <h4 className="text-lg font-medium mb-4">Add New Testimonial</h4>
          <TestimonialForm
            form={form}
            onFinish={handleAddSubmit}
            selectedImage={selectedImage}
            onImageSelect={() => setIsImageModalVisible(true)}
            onCancel={() => {
              setIsAdding(false);
              setSelectedImage(null);
              form.resetFields();
            }}
          />
        </div>
      )}

      {isEditing && !preview && currentEdit && (
        <div className="mb-6 p-4 border rounded-md bg-gray-50">
          <h4 className="text-lg font-medium mb-4">Edit Testimonial</h4>
          <TestimonialForm
            form={editForm}
            onFinish={handleEditSubmit}
            selectedImage={selectedImage}
            onImageSelect={() => setIsImageModalVisible(true)}
            onCancel={() => {
              setIsEditing(false);
              setCurrentEdit(null);
              setSelectedImage(null);
              editForm.resetFields();
            }}
            isEdit={true}
          />
        </div>
      )}

      <TestimonialDisplay
        testimonials={testimonials}
        layout={layout}
        font={font}
        color={color}
        background={background}
        handleEditTestimonial={handleEditTestimonial}
        handleDeleteTestimonial={handleDeleteTestimonial}
        preview={preview}
        containerStyle={containerStyle}
      />

      {!isAdding && !preview && (
        <div className="flex justify-center">
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={handleAddTestimonial}
            className="flex items-center mavebutton mt-4"
            disabled={preview}
          >
            Add Testimonial
          </Button>
        </div>
      )}

      {!preview && (
        <MediaSelectionModal
          isVisible={isImageModalVisible && !isEditing}
          onClose={() => setIsImageModalVisible(false)}
          onSelectMedia={handleSelectImage}
          selectionMode="single"
        />
      )}

      {!preview && isEditing && (
        <MediaSelectionModal
          isVisible={isImageModalVisible && isEditing}
          onClose={() => setIsImageModalVisible(false)}
          onSelectMedia={handleEditSelectImage}
          selectionMode="single"
        />
      )}
    </div>
  );
};

export default TestimonialComponent;
