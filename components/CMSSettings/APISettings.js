// components/CMSSettings/APISettings.js

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
  InputNumber,
} from "antd";
import instance from "../../axios";
import { InfoCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const APISettings = ({ config, id }) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    form.setFieldsValue(config);
  }, [config, form]);

  const onFinish = async (values) => {
    setSaving(true);
    try {
      await instance.put(`/settings/${id}`, {
        type: "api-settings",
        config: {
          name: "API Settings",
          description: "API Settings for MAVE",
          ...values,
        },
      });
      message.success("API Settings updated successfully!");
    } catch (error) {
      console.error("Error updating API Settings:", error);
      message.error("Failed to update API Settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card
      title={
        <Space>
          <Title level={4} style={{ margin: 0 }}>
            API Settings
          </Title>
          <Tooltip title="Configure your API settings">
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
              name="apiEnabled"
              label="API Access"
              valuePropName="checked"
              extra={
                <Text type="secondary">
                  Enable API access for external applications
                </Text>
              }
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="apiKey"
              label="API Key"
              dependencies={["apiEnabled"]}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!getFieldValue("apiEnabled") || value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Please enter your API key")
                    );
                  },
                }),
              ]}
              extra={
                <Text type="secondary">Your API key for authentication</Text>
              }
            >
              <Input.Password placeholder="Enter API key" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="rateLimit"
              label="Rate Limit"
              rules={[{ required: true, message: "Rate limit is required." }]}
              extra={<Text type="secondary">Maximum requests per minute</Text>}
            >
              <InputNumber
                min={1}
                max={1000}
                placeholder="Enter rate limit"
                className="w-full"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="timeout"
              label="Request Timeout"
              rules={[{ required: true, message: "Timeout is required." }]}
              extra={<Text type="secondary">Request timeout in seconds</Text>}
            >
              <InputNumber
                min={1}
                max={300}
                placeholder="Enter timeout"
                className="w-full"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="corsEnabled"
              label="CORS"
              valuePropName="checked"
              extra={
                <Text type="secondary">
                  Enable Cross-Origin Resource Sharing
                </Text>
              }
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="allowedOrigins"
              label="Allowed Origins"
              dependencies={["corsEnabled"]}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!getFieldValue("corsEnabled") || value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Please enter allowed origins")
                    );
                  },
                }),
              ]}
              extra={
                <Text type="secondary">
                  Comma-separated list of allowed origins
                </Text>
              }
            >
              <Input.TextArea rows={3} placeholder="Enter allowed origins" />
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

export default APISettings;
