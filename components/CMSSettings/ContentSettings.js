// components/CMSSettings/ContentSettings.js

import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  message,
  Card,
  Typography,
  Space,
  Row,
  Col,
  Tooltip,
  Switch,
  Select,
  InputNumber,
} from "antd";
import instance from "../../axios";
import { InfoCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

const ContentSettings = ({ config, id }) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    form.setFieldsValue(config);
  }, [config, form]);

  const onFinish = async (values) => {
    setSaving(true);
    try {
      await instance.put(`/settings/${id}`, {
        type: "content-settings",
        config: {
          name: "Content Settings",
          description: "Content Settings for MAVE",
          ...values,
        },
      });
      message.success("Content Settings updated successfully!");
    } catch (error) {
      console.error("Error updating Content Settings:", error);
      message.error("Failed to update Content Settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card
      title={
        <Space>
          <Title level={4} style={{ margin: 0 }}>
            Content Settings
          </Title>
          <Tooltip title="Configure your content settings">
            <InfoCircleOutlined style={{ color: "#1890ff" }} />
          </Tooltip>
        </Space>
      }
      className="max-w-4xl mx-auto"
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="autoSave"
              label="Auto Save"
              valuePropName="checked"
              extra={
                <Text type="secondary">Automatically save content changes</Text>
              }
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="autoSaveInterval"
              label="Auto Save Interval"
              dependencies={["autoSave"]}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!getFieldValue("autoSave") || value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Please enter auto save interval")
                    );
                  },
                }),
              ]}
              extra={<Text type="secondary">Interval in seconds</Text>}
            >
              <InputNumber
                min={30}
                max={300}
                placeholder="Enter interval"
                className="w-full"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="contentVersioning"
              label="Content Versioning"
              valuePropName="checked"
              extra={
                <Text type="secondary">Enable content version history</Text>
              }
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="maxVersions"
              label="Maximum Versions"
              dependencies={["contentVersioning"]}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!getFieldValue("contentVersioning") || value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Please enter maximum versions")
                    );
                  },
                }),
              ]}
              extra={
                <Text type="secondary">Maximum number of versions to keep</Text>
              }
            >
              <InputNumber
                min={1}
                max={50}
                placeholder="Enter maximum versions"
                className="w-full"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="defaultContentType"
              label="Default Content Type"
              rules={[
                {
                  required: true,
                  message: "Default content type is required.",
                },
              ]}
              extra={<Text type="secondary">Default type for new content</Text>}
            >
              <Select placeholder="Select default content type">
                <Option value="article">Article</Option>
                <Option value="page">Page</Option>
                <Option value="news">News</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="defaultStatus"
              label="Default Status"
              rules={[
                { required: true, message: "Default status is required." },
              ]}
              extra={
                <Text type="secondary">Default status for new content</Text>
              }
            >
              <Select placeholder="Select default status">
                <Option value="draft">Draft</Option>
                <Option value="published">Published</Option>
                <Option value="archived">Archived</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="mediaLibraryEnabled"
              label="Media Library"
              valuePropName="checked"
              extra={
                <Text type="secondary">Enable media library for content</Text>
              }
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="maxFileSize"
              label="Maximum File Size"
              dependencies={["mediaLibraryEnabled"]}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!getFieldValue("mediaLibraryEnabled") || value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Please enter maximum file size")
                    );
                  },
                }),
              ]}
              extra={<Text type="secondary">Maximum file size in MB</Text>}
            >
              <InputNumber
                min={1}
                max={100}
                placeholder="Enter maximum file size"
                className="w-full"
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={saving}
            className="w-full sm:w-auto"
          >
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default ContentSettings;
