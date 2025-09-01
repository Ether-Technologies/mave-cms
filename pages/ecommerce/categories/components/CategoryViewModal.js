import React from "react";
import {
    Modal,
    Descriptions,
    Button,
    Image,
    Tag,
    Space,
} from "antd";
import { EditOutlined, CloseOutlined } from "@ant-design/icons";

const CategoryViewModal = ({ visible, category, onCancel, onEdit, currentUser }) => {
    if (!category) return null;

    const isAdmin = currentUser?.role_id === "2";

    return (
        <Modal
            title="Category Details"
            open={visible}
            onCancel={onCancel}
            footer={[
                <Button key="close" onClick={onCancel} icon={<CloseOutlined />}>
                    Close
                </Button>,
                isAdmin && (
                    <Button
                        key="edit"
                        type="primary"
                        onClick={onEdit}
                        icon={<EditOutlined />}
                        style={{
                            backgroundColor: "var(--maveyellow)",
                            borderColor: "var(--maveyellow)",
                        }}
                    >
                        Edit
                    </Button>
                ),
            ].filter(Boolean)}
            width={900}
        >
            <div style={{ marginBottom: 20 }}>
                <Image
                    src={category.image || "/images/ui/default-category.png"}
                    alt={category.name}
                    style={{
                        width: 200,
                        height: 200,
                        objectFit: "cover",
                        borderRadius: 8,
                    }}
                    fallback="/images/ui/default-category.png"
                />
            </div>

            <Descriptions
                bordered
                column={1}
                size="middle"
                labelStyle={{
                    fontWeight: "bold",
                    backgroundColor: "#fafafa",
                }}
            >
                <Descriptions.Item label="Category ID">
                    {category.id}
                </Descriptions.Item>

                <Descriptions.Item label="Name">
                    <span style={{ fontWeight: 500, fontSize: "16px" }}>
                        {category.name}
                    </span>
                </Descriptions.Item>

                <Descriptions.Item label="Description">
                    <div style={{
                        maxHeight: "150px",
                        overflowY: "auto",
                        lineHeight: "1.6",
                        color: "#333"
                    }}>
                        {category.description}
                    </div>
                </Descriptions.Item>

                <Descriptions.Item label="Status">
                    <Tag color={category.status === "1" ? "green" : "red"}>
                        {category.status === "1" ? "Active" : "Inactive"}
                    </Tag>
                </Descriptions.Item>

                <Descriptions.Item label="Created At">
                    {new Date(category.created_at).toLocaleString()}
                </Descriptions.Item>

                <Descriptions.Item label="Last Updated">
                    {new Date(category.updated_at).toLocaleString()}
                </Descriptions.Item>

                <Descriptions.Item label="Image URL">
                    <div style={{
                        wordBreak: "break-all",
                        fontSize: "12px",
                        color: "#666"
                    }}>
                        {category.image || "No image uploaded"}
                    </div>
                </Descriptions.Item>
            </Descriptions>
        </Modal>
    );
};

export default CategoryViewModal; 