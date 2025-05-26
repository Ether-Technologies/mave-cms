// components/PageBuilder/Components/TestimonialComponent/TestimonialComponent.jsx

import React, { useState, useEffect } from "react";
import { Button, Form, message, Typography, Space, Popconfirm } from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyFilled,
} from "@ant-design/icons";
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
  onDuplicateElement,
}) => {
  const [testimonials, setTestimonials] = useState(
    component._mave?.testimonials || []
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEdit, setCurrentEdit] = useState(null);
  const [layout, setLayout] = useState(component._mave?.layout || "grid");
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
    if (isEditMode) {
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
    }
  }, [
    isEditMode,
    testimonials,
    layout,
    font,
    color,
    background,
    updateComponent,
    component,
  ]);

  const handleAddTestimonial = () => {
    if (!preview && isEditMode) {
      setIsAdding(true);
      form.resetFields();
      setSelectedImage(null);
    }
  };

  const handleAddSubmit = (values) => {
    const newTestimonial = {
      id: Date.now(),
      quote: values.quote,
      author: values.author,
      rating: values.rating,
      image: selectedImage,
    };
    setTestimonials([...testimonials, newTestimonial]);
    setIsAdding(false);
    setSelectedImage(null);
    form.resetFields();
    message.success("Testimonial added successfully.");
  };

  const handleEditTestimonial = (testimonial) => {
    if (!preview && isEditMode) {
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
    const updatedTestimonial = {
      ...currentEdit,
      quote: values.quote,
      author: values.author,
      rating: values.rating,
      image: selectedImage,
    };
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
    if (!preview && isEditMode) {
      setTestimonials(testimonials.filter((t) => t.id !== id));
      message.success("Testimonial deleted successfully.");
    }
  };

  const handleDeleteComponent = () => {
    if (deleteComponent) {
      deleteComponent(component._id || component.id);
    }
  };

  const handleEditModeToggle = () => {
    if (isEditMode) {
      // Save changes when exiting edit mode
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
    }
    setIsEditMode(!isEditMode);
  };

  const containerStyle = {
    fontFamily: font,
    color: color,
    backgroundColor: background,
    padding: "20px",
    borderRadius: "8px",
  };

  return (
    <div className="border p-4 rounded-md bg-gray-50">
      {!preview && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Testimonial Component</h3>
          <Space>
            {isEditMode ? (
              <>
                <Button
                  className="mavebutton"
                  type="primary"
                  onClick={handleEditModeToggle}
                >
                  Save Changes
                </Button>
                <Button
                  className="mavecancelbutton"
                  onClick={() => setIsEditMode(false)}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  className="mavebutton"
                  onClick={() => setIsEditMode(true)}
                >
                  Edit
                </Button>
                <Button
                  icon={<CopyFilled />}
                  onClick={onDuplicateElement}
                  className="mavebutton"
                />
              </>
            )}
            <Popconfirm
              title="Delete Component"
              description="Are you sure you want to delete this component?"
              onConfirm={handleDeleteComponent}
              okText="Yes"
              cancelText="No"
            >
              <Button danger>Delete</Button>
            </Popconfirm>
          </Space>
        </div>
      )}

      {!preview && isEditMode && (
        <Space direction="vertical" style={{ width: "100%" }}>
          <ConfigSection
            layout={layout}
            font={font}
            color={color}
            background={background}
            handleLayoutChange={setLayout}
            handleFontChange={setFont}
            handleColorChange={(e) => setColor(e.target.value)}
            handleBackgroundChange={(e) => setBackground(e.target.value)}
            preview={preview}
          />

          {isAdding && (
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

          {isEditing && currentEdit && (
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
        </Space>
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
        isEditMode={isEditMode}
      />

      {!isAdding && !isEditing && (
        <div className="flex justify-center">
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={handleAddTestimonial}
            className="flex items-center mavebutton mt-4"
          >
            Add Testimonial
          </Button>
        </div>
      )}

      {!preview && isEditMode && (
        <MediaSelectionModal
          isVisible={isImageModalVisible}
          onClose={() => setIsImageModalVisible(false)}
          onSelectMedia={(media) => {
            setSelectedImage(media);
            setIsImageModalVisible(false);
            message.success("Image selected successfully.");
          }}
          selectionMode="single"
        />
      )}
    </div>
  );
};

export default TestimonialComponent;
