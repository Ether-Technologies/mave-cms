import React, { useState, useEffect } from "react";
import {
    Table,
    Avatar,
    Button,
    Input,
    Popconfirm,
    message,
    Modal,
    Spin,
    Image,
    Tag,
    Space,
} from "antd";
import { EditOutlined, DeleteOutlined, EyeOutlined, SearchOutlined, FilterOutlined } from "@ant-design/icons";
import CategoryEditModal from "./CategoryEditModal";
import CategoryViewModal from "./CategoryViewModal";
import CategoryFilterDrawer from "./CategoryFilterDrawer";
import { categoryApi } from "../../../../utils/categoryApi";

const { Search } = Input;

const CategoriesTable = ({ categories, fetchCategories, currentUser, loading }) => {
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isViewModalVisible, setIsViewModalVisible] = useState(false);
    const [isFilterDrawerVisible, setIsFilterDrawerVisible] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [filteredCategories, setFilteredCategories] = useState(categories);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        setFilteredCategories(categories);
    }, [categories]);

    // Check permissions
    const isAdmin = currentUser?.role_id === "1";

    // Handle search by name
    const handleSearch = (value) => {
        setSearchTerm(value);
        const filtered = categories.filter((category) =>
            category.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredCategories(filtered);
    };

    // Handle edit button click
    const handleEditCategory = (category) => {
        setSelectedCategory(category);
        setIsEditModalVisible(true);
    };

    // Handle view button click
    const handleViewCategory = (category) => {
        setSelectedCategory(category);
        setIsViewModalVisible(true);
    };

    // Handle delete button click
    const handleDeleteCategory = async (id) => {
        try {
            await categoryApi.delete(id);
            message.success("Category deleted successfully");
            fetchCategories();
        } catch (error) {
            console.error("Error deleting category:", error);
            message.error("Failed to delete category");
        }
    };

    // Column definitions for Ant Design Table
    const columns = [
        {
            title: "Image",
            dataIndex: "image",
            key: "image",
            width: 80,
            render: (image) => (
                <Avatar
                    src={image || "/images/ui/default-category.png"}
                    style={{
                        border: "2px solid var(--theme)",
                        width: 50,
                        height: 50,
                    }}
                />
            ),
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            render: (name) => (
                <span style={{ fontWeight: 500, fontSize: "14px" }}>{name}</span>
            ),
        },
        {
            title: "Description",
            dataIndex: "description",
            key: "description",
            render: (description) => (
                <span style={{
                    fontSize: "12px",
                    color: "#666",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    maxWidth: "300px"
                }}>
                    {description}
                </span>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 100,
            render: (status) => (
                <Tag color={status === "1" ? "green" : "red"}>
                    {status === "1" ? "Active" : "Inactive"}
                </Tag>
            ),
        },
        {
            title: "Created",
            dataIndex: "created_at",
            key: "created_at",
            width: 120,
            render: (created_at) => (
                <span style={{ fontSize: "12px", color: "#666" }}>
                    {new Date(created_at).toLocaleDateString()}
                </span>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            width: 150,
            render: (_, record) => {
                const canEdit = isAdmin;
                const canDelete = isAdmin;

                return (
                    <Space size="small">
                        <Button
                            icon={<EyeOutlined />}
                            onClick={() => handleViewCategory(record)}
                            style={{ backgroundColor: "var(--theme)", color: "white" }}
                            size="small"
                        />
                        {canEdit && (
                            <Button
                                icon={<EditOutlined />}
                                onClick={() => handleEditCategory(record)}
                                style={{
                                    backgroundColor: "transparent",
                                    color: "var(--theme)",
                                    border: "2px solid var(--theme)",
                                }}
                                size="small"
                            />
                        )}
                        {canDelete && (
                            <Popconfirm
                                title="Are you sure to delete this category?"
                                onConfirm={() => handleDeleteCategory(record.id)}
                                onCancel={() => message.info("Category not deleted")}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Button icon={<DeleteOutlined />} danger size="small" />
                            </Popconfirm>
                        )}
                    </Space>
                );
            },
        },
    ];

    return (
        <div style={{ marginTop: "20px" }}>
            {/* Search and Filter Bar */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px",
                padding: "16px",
                backgroundColor: "#fafafa",
                borderRadius: "8px"
            }}>
                <Search
                    placeholder="Search categories by name..."
                    allowClear
                    enterButton={<SearchOutlined />}
                    style={{ width: 300 }}
                    onSearch={handleSearch}
                    onChange={(e) => handleSearch(e.target.value)}
                />
                <Space>
                    <Button
                        icon={<FilterOutlined />}
                        onClick={() => setIsFilterDrawerVisible(true)}
                    >
                        Filter
                    </Button>
                    <Button
                        onClick={() => {
                            setFilteredCategories(categories);
                            setSearchTerm("");
                            message.success("Filters cleared");
                        }}
                    >
                        Reset
                    </Button>
                </Space>
            </div>

            <Table
                columns={columns}
                dataSource={filteredCategories}
                rowKey="id"
                pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} of ${total} categories`
                }}
                loading={loading}
                scroll={{ x: 1000 }}
            />

            {categories && (
                <>
                    <CategoryEditModal
                        visible={isEditModalVisible}
                        category={selectedCategory}
                        onCancel={() => setIsEditModalVisible(false)}
                        fetchCategories={fetchCategories}
                        currentUser={currentUser}
                    />
                    <CategoryViewModal
                        visible={isViewModalVisible}
                        category={selectedCategory}
                        onCancel={() => setIsViewModalVisible(false)}
                        onEdit={() => handleEditCategory(selectedCategory)}
                        currentUser={currentUser}
                    />
                    <CategoryFilterDrawer
                        visible={isFilterDrawerVisible}
                        onClose={() => setIsFilterDrawerVisible(false)}
                        setFilteredCategories={setFilteredCategories}
                        categories={categories}
                    />
                </>
            )}
        </div>
    );
};

export default CategoriesTable; 