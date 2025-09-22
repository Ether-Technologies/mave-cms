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
import {
  PlusOutlined,
  CopyFilled,
  GlobalOutlined,
  EditOutlined,
  CheckOutlined,
} from "@ant-design/icons";
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
  const [showAltInputs, setShowAltInputs] = useState(false);

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
        preview={preview}
        containerStyle={containerStyle}
        isEditMode={isEditMode}
        showAltContent={showAltContent}
        getDisplayContent={getDisplayContent}
      />

      {isEditMode && (
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

      {/* Alternative Content Editing Section */}
      {testimonials.length > 0 && !preview && (
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

              {/* Alternative Content Editing Section */}
              <div className="mt-6 p-4 bg-white rounded-lg border">
                <div className="flex items-center justify-between mb-4">
                  <h5 className="text-lg font-semibold flex items-center gap-2">
                    <EditOutlined />
                    Alternative Content
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
                    {testimonials.map((testimonial, index) => (
                      <div
                        key={testimonial.id}
                        className="border rounded-lg p-4 bg-gray-50"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          {testimonial.image && (
                            <img
                              src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${testimonial.image.file_path}`}
                              alt={testimonial.author || "Testimonial"}
                              className="w-16 h-12 rounded object-cover"
                            />
                          )}
                          <div>
                            <div className="font-medium text-sm">
                              {testimonial.author || "Untitled Testimonial"}
                            </div>
                          </div>
                        </div>

                        <Form layout="vertical" className="w-full">
                          <Form.Item label="Alternative Quote" className="mb-3">
                            <Input.TextArea
                              rows={3}
                              placeholder="Enter alternative quote"
                              defaultValue={testimonial.altQuote || ""}
                              onChange={(e) => {
                                const updatedTestimonials = [...testimonials];
                                updatedTestimonials[index] = {
                                  ...updatedTestimonials[index],
                                  altQuote: e.target.value,
                                };
                                setTestimonials(updatedTestimonials);
                              }}
                            />
                          </Form.Item>

                          <Form.Item
                            label="Alternative Author"
                            className="mb-3"
                          >
                            <Input
                              placeholder="Enter alternative author name"
                              defaultValue={testimonial.altAuthor || ""}
                              onChange={(e) => {
                                const updatedTestimonials = [...testimonials];
                                updatedTestimonials[index] = {
                                  ...updatedTestimonials[index],
                                  altAuthor: e.target.value,
                                };
                                setTestimonials(updatedTestimonials);
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
                            _mave: {
                              testimonials,
                              layout,
                              font,
                              color,
                              background,
                              showAltContent,
                            },
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
                  /* Display Current Alternative Content */
                  <div className="space-y-3">
                    {testimonials.map((testimonial, index) => (
                      <div
                        key={testimonial.id}
                        className="border rounded-lg p-3 bg-gray-50"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          {testimonial.image && (
                            <img
                              src={`${process.env.NEXT_PUBLIC_MEDIA_URL}/${testimonial.image.file_path}`}
                              alt={testimonial.author || "Testimonial"}
                              className="w-12 h-8 rounded object-cover"
                            />
                          )}
                          <div>
                            <div className="font-medium text-sm">
                              {testimonial.author || "Untitled Testimonial"}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm">
                          <div>
                            <strong>Alt Quote:</strong>{" "}
                            {testimonial.altQuote || "Not set"}
                          </div>
                          <div>
                            <strong>Alt Author:</strong>{" "}
                            {testimonial.altAuthor || "Not set"}
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
    </div>
  );
};

export default TestimonialComponent;
