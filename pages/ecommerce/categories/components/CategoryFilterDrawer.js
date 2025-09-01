import React, { useState } from "react";
import {
    Drawer,
    Form,
    Input,
    Select,
    Button,
    DatePicker,
    Space,
    Divider,
} from "antd";
import { FilterOutlined, ClearOutlined } from "@ant-design/icons";

const { Option } = Select;
const { RangePicker } = DatePicker;

const CategoryFilterDrawer = ({ visible, onClose, setFilteredCategories, categories }) => {
    const [form] = Form.useForm();

    const handleFilter = (values) => {
        let filtered = [...categories];

        // Filter by name
        if (values.name) {
            filtered = filtered.filter(category =>
                category.name.toLowerCase().includes(values.name.toLowerCase())
            );
        }

        // Filter by status
        if (values.status !== undefined) {
            filtered = filtered.filter(category => category.status === values.status);
        }

        // Filter by date range
        if (values.dateRange && values.dateRange.length === 2) {
            const [startDate, endDate] = values.dateRange;
            filtered = filtered.filter(category => {
                const categoryDate = new Date(category.created_at);
                return categoryDate >= startDate.startOf('day').toDate() &&
                    categoryDate <= endDate.endOf('day').toDate();
            });
        }

        setFilteredCategories(filtered);
        onClose();
    };

    const handleReset = () => {
        form.resetFields();
        setFilteredCategories(categories);
        onClose();
    };

    return (
        <Drawer
            title="Filter Categories"
            placement="right"
            onClose={onClose}
            open={visible}
            width={400}
            footer={
                <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                    <Button onClick={handleReset} icon={<ClearOutlined />}>
                        Reset
                    </Button>
                    <Button
                        type="primary"
                        onClick={() => form.submit()}
                        icon={<FilterOutlined />}
                        style={{
                            backgroundColor: "var(--maveyellow)",
                            borderColor: "var(--maveyellow)",
                        }}
                    >
                        Apply Filters
                    </Button>
                </Space>
            }
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFilter}
            >
                <Form.Item
                    name="name"
                    label="Category Name"
                >
                    <Input placeholder="Search by name..." />
                </Form.Item>

                <Form.Item
                    name="status"
                    label="Status"
                >
                    <Select placeholder="Select status" allowClear>
                        <Option value="1">Active</Option>
                        <Option value="0">Inactive</Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="dateRange"
                    label="Created Date Range"
                >
                    <RangePicker
                        style={{ width: '100%' }}
                        placeholder={['Start Date', 'End Date']}
                    />
                </Form.Item>

                <Divider />

                <div style={{ fontSize: '12px', color: '#666' }}>
                    <p>• Use name filter to search categories by name</p>
                    <p>• Use status filter to show only active or inactive categories</p>
                    <p>• Use date range to filter by creation date</p>
                </div>
            </Form>
        </Drawer>
    );
};

export default CategoryFilterDrawer; 