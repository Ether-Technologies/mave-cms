import React, { useState } from "react";
import {
    Modal,
    Form,
    Input,
    Button,
    Switch,
    message,
    Spin,
    Image,
} from "antd";
import { SaveOutlined, CloseOutlined, PictureOutlined } from "@ant-design/icons";
import { categoryApi } from "../../../../utils/categoryApi";
import MediaSelectionModal from "../../../../components/PageBuilder/Modals/MediaSelectionModal";

const { TextArea } = Input;

const CategoryForm = ({ visible, onCancel, fetchCategories, currentUser }) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [mediaModalVisible, setMediaModalVisible] = useState(false);

    const handleImageSelect = (mediaItem) => {
        if (mediaItem) {
            setSelectedImage(mediaItem);
            setImagePreview(`${process.env.NEXT_PUBLIC_MEDIA_URL}/${mediaItem.file_path}`);
        }
        setMediaModalVisible(false);
    };

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("description", values.description);
            formData.append("status", values.status ? "1" : "0");

            if (selectedImage) {
                formData.append("image", `${process.env.NEXT_PUBLIC_MEDIA_URL}/${selectedImage.file_path}`);
            }

            const response = await categoryApi.create(formData);

            if (response.success) {
                message.success("Category created successfully");
                form.resetFields();
                setSelectedImage(null);
                setImagePreview(null);
                onCancel();
                fetchCategories();
            }
        } catch (error) {
            console.error("Error creating category:", error);
            message.error("Failed to create category");
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setSelectedImage(null);
        setImagePreview(null);
        onCancel();
    };

    const removeSelectedImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
    };

    return (
        <>
            <Modal
                title="Create New Category"
                open={visible}
                onCancel={handleCancel}
                footer={null}
                width={600}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                    initialValues={{
                        status: true,
                    }}
                >
                    <Form.Item
                        name="name"
                        label="Category Name"
                        rules={[
                            { required: true, message: "Please enter category name" },
                            { min: 2, message: "Name must be at least 2 characters" },
                        ]}
                    >
                        <Input placeholder="Enter category name" />
                    </Form.Item>

                    <Form.Item
                        name="description"
                        label="Description"
                        rules={[
                            { required: true, message: "Please enter category description" },
                            { min: 10, message: "Description must be at least 10 characters" },
                        ]}
                    >
                        <TextArea
                            rows={4}
                            placeholder="Enter category description"
                            maxLength={500}
                            showCount
                        />
                    </Form.Item>

                    <Form.Item
                        name="image"
                        label="Category Image"
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
                                        fallback="/images/ui/default-category.png"
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

                    <Form.Item
                        name="status"
                        label="Status"
                        valuePropName="checked"
                    >
                        <Switch
                            checkedChildren="Active"
                            unCheckedChildren="Inactive"
                        />
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
                            Create Category
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

export default CategoryForm; 