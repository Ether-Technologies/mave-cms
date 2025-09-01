import React, { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  InputNumber,
  Select,
  message,
  Switch,
  Image,
  Divider,
  Space,
} from "antd";
import {
  SaveOutlined,
  CloseOutlined,
  PictureOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { packageApi } from "../../../../utils/packageApi";
import { categoryApi } from "../../../../utils/categoryApi";
import MediaSelectionModal from "../../../../components/PageBuilder/Modals/MediaSelectionModal";

const { TextArea } = Input;

const PackageForm = ({ visible, onCancel, fetchPackages, currentUser }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [mediaModalVisible, setMediaModalVisible] = useState(false);
  const [categories, setCategories] = useState([]);
  const [partialPaymentAllowed, setPartialPaymentAllowed] = useState(false);
  const [partialPaymentType, setPartialPaymentType] = useState(null);

  const handleImageSelect = (mediaItem) => {
    if (mediaItem) {
      setSelectedImage(mediaItem);
      setImagePreview(`${process.env.NEXT_PUBLIC_MEDIA_URL}/${mediaItem.file_path}`);
    }
    setMediaModalVisible(false);
  };

  const fetchCategoryList = async () => {
    try {
      const response = await categoryApi.getAll();
      if (response.success) {
        setCategories(response.categories);
      } else {
        console.error("Failed to load categories:", response.message);
        message.error("Failed to load categories");
      }
    } catch (err) {
      console.error("Error loading categories:", err);
      message.error("Error loading categories");
    }
  };

  React.useEffect(() => {
    if (visible) fetchCategoryList();
  }, [visible]);

  const handlePartialPaymentChange = (checked) => {
    setPartialPaymentAllowed(checked);
    if (!checked) {
      setPartialPaymentType(null);
      form.setFieldsValue({
        partial_payment_type: null,
        partial_payment_amount: null,
        partial_payment_percentage: null,
      });
    }
  };

  const handlePartialPaymentTypeChange = (value) => {
    setPartialPaymentType(value);
    if (value === 'fixed') {
      form.setFieldsValue({ partial_payment_percentage: null });
    } else if (value === 'percentage') {
      form.setFieldsValue({ partial_payment_amount: null });
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description || "");
      formData.append("price", values.price);
      formData.append("currency", values.currency || "BDT");
      formData.append("view_details_link", values.view_details_link || "");
      formData.append("category_id", values.category_id);

      // Handle partial payment fields
      if (partialPaymentAllowed) {
        formData.append("partial_payment_allowed", "1");
        formData.append("partial_payment_type", partialPaymentType);
        if (partialPaymentType === 'fixed' && values.partial_payment_amount) {
          formData.append("partial_payment_amount", values.partial_payment_amount);
        } else if (partialPaymentType === 'percentage' && values.partial_payment_percentage) {
          formData.append("partial_payment_percentage", values.partial_payment_percentage);
        }
      } else {
        formData.append("partial_payment_allowed", "0");
      }

      // Handle image - send as image_url since it's a URL string, not a file
      if (selectedImage) {
        // If we have a selected image from media library, use its URL
        formData.append("image_url", `${process.env.NEXT_PUBLIC_MEDIA_URL}/${selectedImage.file_path}`);
      }

      // Log FormData contents for debugging
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      console.log("Submitting package data:", {
        name: values.name,
        description: values.description,
        price: values.price,
        currency: values.currency,
        view_details_link: values.view_details_link,
        category_id: values.category_id,
        partial_payment_allowed: partialPaymentAllowed,
        partial_payment_type: partialPaymentType,
        partial_payment_amount: values.partial_payment_amount,
        partial_payment_percentage: values.partial_payment_percentage,
        image_url: selectedImage ? `${process.env.NEXT_PUBLIC_MEDIA_URL}/${selectedImage.file_path}` : null
      });

      const response = await packageApi.create(formData);

      if (response.success || response.message === "Package created successfully") {
        message.success("Package created successfully");
        form.resetFields();
        setSelectedImage(null);
        setImagePreview(null);
        setPartialPaymentAllowed(false);
        setPartialPaymentType(null);
        onCancel();
        fetchPackages();
      } else {
        message.error(response.message || "Failed to create package");
      }
    } catch (error) {
      console.error("Error creating package:", error);
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        message.error(errorMessages.join(", "));
      } else {
        message.error("Failed to create package");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedImage(null);
    setImagePreview(null);
    setPartialPaymentAllowed(false);
    setPartialPaymentType(null);
    onCancel();
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  return (
    <>
      <Modal
        title="Create New Package"
        open={visible}
        onCancel={handleCancel}
        footer={null}
        width={700}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            currency: "BDT",
            partial_payment_allowed: false,
          }}
        >
          <Form.Item
            name="name"
            label="Package Name"
            rules={[
              { required: true, message: "Please enter package name" },
              { min: 2, message: "Name must be at least 2 characters" },
              { max: 255, message: "Name must not exceed 255 characters" },
            ]}
          >
            <Input placeholder="Enter package name" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[
              { required: false },
              { type: 'string', message: 'Description must be a string' },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Enter package description (optional)"
              maxLength={1000}
              showCount
            />
          </Form.Item>

          <Space style={{ width: "100%" }} size="large">
            <Form.Item
              name="price"
              label="Price"
              rules={[
                { required: true, message: "Please enter the price" },
                {
                  validator: (_, value) => {
                    if (value === null || value === undefined || value === '') {
                      return Promise.reject(new Error('Please enter the price'));
                    }
                    const numValue = parseFloat(value);
                    if (isNaN(numValue) || numValue < 0) {
                      return Promise.reject(new Error('Price must be a positive number'));
                    }
                    return Promise.resolve();
                  }
                }
              ]}
              style={{ flex: 1 }}
            >
              <InputNumber
                min={0}
                style={{ width: "100%" }}
                placeholder="Enter price"
                precision={2}
              />
            </Form.Item>

            <Form.Item
              name="currency"
              label="Currency"
              rules={[
                { required: false },
                { type: 'enum', enum: ['BDT', 'USD'], message: "Currency must be BDT or USD" }
              ]}
              style={{ width: 120 }}
            >
              <Select>
                <Select.Option value="BDT">BDT (৳)</Select.Option>
                <Select.Option value="USD">USD ($)</Select.Option>
              </Select>
            </Form.Item>
          </Space>

          <Form.Item
            name="view_details_link"
            label="View Details Link"
            rules={[
              { required: false },
              { type: 'url', message: 'Please enter a valid URL' }
            ]}
          >
            <Input placeholder="https://example.com/details" />
          </Form.Item>

          <Form.Item
            name="category_id"
            label="Select Category"
            rules={[{ required: true, message: "Please select a category" }]}
          >
            <Select placeholder="Choose a category">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <Select.Option key={cat.id} value={cat.id}>
                    {cat.name}
                  </Select.Option>
                ))
              ) : (
                <Select.Option disabled value="">
                  No categories available
                </Select.Option>
              )}
            </Select>
          </Form.Item>

          <Divider orientation="left">Partial Payment Options</Divider>

          <Form.Item
            name="partial_payment_allowed"
            label="Allow Partial Payment"
            valuePropName="checked"
          >
            <Switch 
              checked={partialPaymentAllowed}
              onChange={handlePartialPaymentChange}
            />
          </Form.Item>

          {partialPaymentAllowed && (
            <>
                             <Form.Item
                 name="partial_payment_type"
                 label="Partial Payment Type"
                 rules={[
                   { required: false },
                   { type: 'enum', enum: ['fixed', 'percentage'], message: "Payment type must be fixed or percentage" }
                 ]}
               >
                <Select 
                  placeholder="Select payment type"
                  onChange={handlePartialPaymentTypeChange}
                >
                  <Select.Option value="fixed">Fixed Amount</Select.Option>
                  <Select.Option value="percentage">Percentage</Select.Option>
                </Select>
              </Form.Item>

              {partialPaymentType === 'fixed' && (
                                 <Form.Item
                   name="partial_payment_amount"
                   label="Partial Payment Amount"
                   rules={[
                     { required: false },
                     {
                       validator: (_, value) => {
                         if (value !== null && value !== undefined && value !== '') {
                           const numValue = parseFloat(value);
                           if (isNaN(numValue) || numValue < 0) {
                             return Promise.reject(new Error('Amount must be a positive number'));
                           }
                         }
                         return Promise.resolve();
                       }
                     }
                   ]}
                 >
                  <InputNumber
                    min={0}
                    style={{ width: "100%" }}
                    placeholder="Enter partial payment amount"
                    precision={2}
                  />
                </Form.Item>
              )}

              {partialPaymentType === 'percentage' && (
                                 <Form.Item
                   name="partial_payment_percentage"
                   label="Partial Payment Percentage"
                   rules={[
                     { required: false },
                     {
                       validator: (_, value) => {
                         if (value !== null && value !== undefined && value !== '') {
                           const numValue = parseFloat(value);
                           if (isNaN(numValue) || numValue < 0 || numValue > 100) {
                             return Promise.reject(new Error('Percentage must be between 0-100'));
                           }
                         }
                         return Promise.resolve();
                       }
                     }
                   ]}
                 >
                  <InputNumber
                    min={0}
                    max={100}
                    style={{ width: "100%" }}
                    placeholder="Enter percentage (0-100)"
                    precision={2}
                    addonAfter="%"
                  />
                </Form.Item>
              )}
            </>
          )}

          <Divider orientation="left">Package Image</Divider>

          <Form.Item
            name="image"
            label="Package Image"
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {imagePreview ? (
                <div style={{ position: "relative", display: "inline-block" }}>
                  <Image
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      width: 120,
                      height: 120,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                    fallback="/images/ui/default-package.png"
                  />
                  <Button
                    type="text"
                    danger
                    size="small"
                    onClick={removeSelectedImage}
                    style={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      borderRadius: "50%",
                      width: 24,
                      height: 24,
                      minWidth: 24,
                      padding: 0,
                    }}
                  >
                    ×
                  </Button>
                </div>
              ) : (
                <div
                  style={{
                    width: 120,
                    height: 120,
                    border: "2px dashed #d9d9d9",
                    borderRadius: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "border-color 0.3s",
                  }}
                  onClick={() => setMediaModalVisible(true)}
                  onMouseEnter={(e) => e.target.style.borderColor = "#1890ff"}
                  onMouseLeave={(e) => e.target.style.borderColor = "#d9d9d9"}
                >
                  <PictureOutlined style={{ fontSize: 24, color: "#999", marginBottom: 8 }} />
                  <span style={{ fontSize: 12, color: "#999" }}>Select Image</span>
                </div>
              )}
              <Button
                type="dashed"
                icon={<PictureOutlined />}
                onClick={() => setMediaModalVisible(true)}
                style={{ width: "fit-content" }}
              >
                {imagePreview ? "Change Image" : "Select Image"}
              </Button>
            </div>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
            <Button
              onClick={handleCancel}
              style={{ marginRight: 8 }}
              icon={<CloseOutlined />}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SaveOutlined />}
              style={{
                backgroundColor: "var(--maveyellow)",
                borderColor: "var(--maveyellow)",
              }}
            >
              Create Package
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <MediaSelectionModal
        isVisible={mediaModalVisible}
        onClose={() => setMediaModalVisible(false)}
        onSelectMedia={handleImageSelect}
        selectionMode="single"
      />
    </>
  );
};

export default PackageForm;
