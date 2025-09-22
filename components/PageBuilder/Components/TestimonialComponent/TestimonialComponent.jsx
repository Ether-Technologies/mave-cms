// components/PageBuilder/Components/TestimonialComponent/TestimonialComponent.jsx

import React, { useState, useEffect } from "react";
import {
  Button,
  Form,
  message,
  Typography,
  Space,
  Popconfirm,
  Switch,
  Modal,
  Collapse,
  Input,
} from "antd";
import { PlusOutlined, CopyFilled, GlobalOutlined } from "@ant-design/icons";
import MediaSelectionModal from "../../Modals/MediaSelectionModal";
import ConfigSection from "./ConfigSection";
import TestimonialDisplay from "./TestimonialDisplay";
import TestimonialForm from "./TestimonialForm";

const { Paragraph } = Typography;
const { Panel } = Collapse;

const TestimonialComponent = ({
  component,
  updateComponent,
  deleteComponent,
  preview = false,
  onDuplicateElement,
}) => {
  const [testimonials, setTestimonials] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEdit, setCurrentEdit] = useState(null);
  const [layout, setLayout] = useState("grid");
  const [font, setFont] = useState("Arial");
  const [color, setColor] = useState("#000000");
  const [background, setBackground] = useState("#ffffff");
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showAltContent, setShowAltContent] = useState(false);
  const [editAltContentModal, setEditAltContentModal] = useState(false);
  const [editingTestimonialIndex, setEditingTestimonialIndex] = useState(null);

  const [form] = Form.useForm();
  const [editForm] = Form.useForm();
  const [altForm] = Form.useForm();

  // Sync state with component prop changes
  useEffect(() => {
    if (component?._mave) {
      setTestimonials(component._mave.testimonials || []);
      setLayout(component._mave.layout || "grid");
      setFont(component._mave.font || "Arial");
      setColor(component._mave.color || "#000000");
      setBackground(component._mave.background || "#ffffff");
      setShowAltContent(component._mave.showAltContent || false);
    }
  }, [component?._mave]);

  // Helper function to get display content based on language preference
  const getDisplayContent = (testimonial, showAlt = false) => {
    if (!testimonial) return { quote: "", author: "" };

    if (showAlt) {
      return {
        quote: testimonial.altQuote || testimonial.quote || "",
        author: testimonial.altAuthor || testimonial.author || "",
      };
    }

    return {
      quote: testimonial.quote || "",
      author: testimonial.author || "",
    };
  };

  // Function to handle editing alternative content for a specific testimonial
  const handleEditAltContent = (index) => {
    setEditingTestimonialIndex(index);
    const testimonial = testimonials[index];
    altForm.setFieldsValue({
      altQuote: testimonial.altQuote || "",
      altAuthor: testimonial.altAuthor || "",
    });
    setEditAltContentModal(true);
  };

  // Function to save alternative content
  const handleSaveAltContent = (values) => {
    const updatedTestimonials = [...testimonials];
    updatedTestimonials[editingTestimonialIndex] = {
      ...updatedTestimonials[editingTestimonialIndex],
      altQuote: values.altQuote,
      altAuthor: values.altAuthor,
    };

    setTestimonials(updatedTestimonials);

    // Update component immediately
    updateComponent({
      ...component,
      _mave: {
        testimonials: updatedTestimonials,
        layout,
        font,
        color,
        background,
        showAltContent,
      },
    });

    setEditAltContentModal(false);
    setEditingTestimonialIndex(null);
    altForm.resetFields();
    message.success("Alternative content updated successfully.");
  };

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
      altQuote: values.altQuote || "",
      altAuthor: values.altAuthor || "",
    };
    const updatedTestimonials = [...testimonials, newTestimonial];
    setTestimonials(updatedTestimonials);

    // Update component immediately
    updateComponent({
      ...component,
      _mave: {
        testimonials: updatedTestimonials,
        layout,
        font,
        color,
        background,
        showAltContent,
      },
    });

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
        altQuote: testimonial.altQuote || "",
        altAuthor: testimonial.altAuthor || "",
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
      altQuote: values.altQuote || "",
      altAuthor: values.altAuthor || "",
    };
    const updatedTestimonials = testimonials.map((t) =>
      t.id === updatedTestimonial.id ? updatedTestimonial : t
    );
    setTestimonials(updatedTestimonials);

    // Update component immediately
    updateComponent({
      ...component,
      _mave: {
        testimonials: updatedTestimonials,
        layout,
        font,
        color,
        background,
        showAltContent,
      },
    });

    setIsEditing(false);
    setCurrentEdit(null);
    setSelectedImage(null);
    editForm.resetFields();
    message.success("Testimonial updated successfully.");
  };

  const handleDeleteTestimonial = (id) => {
    if (!preview && isEditMode) {
      const updatedTestimonials = testimonials.filter((t) => t.id !== id);
      setTestimonials(updatedTestimonials);

      // Update component immediately
      updateComponent({
        ...component,
        _mave: {
          testimonials: updatedTestimonials,
          layout,
          font,
          color,
          background,
        },
      });

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
      message.success("Changes saved successfully.");
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
              okButtonProps={{ danger: true }}
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
            handleLayoutChange={(newLayout) => {
              setLayout(newLayout);
              updateComponent({
                ...component,
                _mave: {
                  testimonials,
                  layout: newLayout,
                  font,
                  color,
                  background,
                },
              });
            }}
            handleFontChange={(newFont) => {
              setFont(newFont);
              updateComponent({
                ...component,
                _mave: {
                  testimonials,
                  layout,
                  font: newFont,
                  color,
                  background,
                },
              });
            }}
            handleColorChange={(e) => {
              const newColor = e.target.value;
              setColor(newColor);
              updateComponent({
                ...component,
                _mave: {
                  testimonials,
                  layout,
                  font,
                  color: newColor,
                  background,
                },
              });
            }}
            handleBackgroundChange={(e) => {
              const newBackground = e.target.value;
              setBackground(newBackground);
              updateComponent({
                ...component,
                _mave: {
                  testimonials,
                  layout,
                  font,
                  color,
                  background: newBackground,
                },
              });
            }}
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
        handleEditAltContent={handleEditAltContent}
        preview={preview}
        containerStyle={containerStyle}
        isEditMode={isEditMode}
        showAltContent={showAltContent}
        getDisplayContent={getDisplayContent}
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

      {/* Multi-Language Configuration */}
      {testimonials.length > 0 && (
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
                    Toggle to show alternative quotes and author names for
                    testimonials
                  </p>
                </div>
                <Switch
                  checked={showAltContent}
                  onChange={(checked) => {
                    setShowAltContent(checked);
                    updateComponent({
                      ...component,
                      _mave: {
                        testimonials,
                        layout,
                        font,
                        color,
                        background,
                        showAltContent: checked,
                      },
                    });
                  }}
                />
              </div>

              {showAltContent && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-800">
                    <strong>Alternative Content Mode:</strong> Testimonials will
                    display alternative quotes and author names when available.
                  </div>
                </div>
              )}
            </div>
          </Panel>
        </Collapse>
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

      {/* Modal for editing alternative content */}
      <Modal
        title="Edit Alternative Content"
        open={editAltContentModal}
        onCancel={() => {
          setEditAltContentModal(false);
          setEditingTestimonialIndex(null);
          altForm.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form form={altForm} layout="vertical" onFinish={handleSaveAltContent}>
          <Form.Item
            label="Alternative Quote"
            name="altQuote"
            rules={[
              { required: true, message: "Please enter an alternative quote." },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Enter alternative quote in another language"
            />
          </Form.Item>

          <Form.Item
            label="Alternative Author"
            name="altAuthor"
            rules={[
              {
                required: true,
                message: "Please enter an alternative author name.",
              },
            ]}
          >
            <Input placeholder="Enter alternative author name in another language" />
          </Form.Item>

          <div className="flex justify-end gap-2">
            <Button
              onClick={() => {
                setEditAltContentModal(false);
                setEditingTestimonialIndex(null);
                altForm.resetFields();
              }}
            >
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default TestimonialComponent;
