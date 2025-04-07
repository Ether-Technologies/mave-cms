// components/CMSSettings/AnalyticsSettings.js

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
} from "antd";
import instance from "../../axios";
import { InfoCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const AnalyticsSettings = ({ config, id }) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    form.setFieldsValue(config);
  }, [config, form]);

  const onFinish = async (values) => {
    setSaving(true);
    try {
      await instance.put(`/settings/${id}`, {
        type: "analytics-settings",
        config: {
          name: "Analytics Settings",
          description: "Analytics Settings for MAVE",
          ...values,
        },
      });
      message.success("Analytics Settings updated successfully!");
    } catch (error) {
      console.error("Error updating Analytics Settings:", error);
      message.error("Failed to update Analytics Settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card
      title={
        <Space>
          <Title level={4} style={{ margin: 0 }}>
            Analytics Settings
          </Title>
          <Tooltip title="Configure your site's analytics settings">
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
              name="googleAnalyticsEnabled"
              label="Google Analytics"
              valuePropName="checked"
              extra={
                <Text type="secondary">Enable Google Analytics tracking</Text>
              }
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="googleAnalyticsId"
              label="Google Analytics ID"
              dependencies={["googleAnalyticsEnabled"]}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!getFieldValue("googleAnalyticsEnabled") || value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Please enter your Google Analytics ID")
                    );
                  },
                }),
              ]}
              extra={
                <Text type="secondary">
                  Your Google Analytics tracking ID (e.g., UA-XXXXXXXXX-X)
                </Text>
              }
            >
              <Input placeholder="Enter Google Analytics ID" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="facebookPixelEnabled"
              label="Facebook Pixel"
              valuePropName="checked"
              extra={
                <Text type="secondary">Enable Facebook Pixel tracking</Text>
              }
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="facebookPixelId"
              label="Facebook Pixel ID"
              dependencies={["facebookPixelEnabled"]}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!getFieldValue("facebookPixelEnabled") || value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Please enter your Facebook Pixel ID")
                    );
                  },
                }),
              ]}
              extra={<Text type="secondary">Your Facebook Pixel ID</Text>}
            >
              <Input placeholder="Enter Facebook Pixel ID" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="customAnalyticsEnabled"
              label="Custom Analytics"
              valuePropName="checked"
              extra={
                <Text type="secondary">Enable custom analytics tracking</Text>
              }
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="customAnalyticsCode"
              label="Custom Analytics Code"
              dependencies={["customAnalyticsEnabled"]}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!getFieldValue("customAnalyticsEnabled") || value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Please enter your custom analytics code")
                    );
                  },
                }),
              ]}
              extra={
                <Text type="secondary">
                  Your custom analytics tracking code
                </Text>
              }
            >
              <Input.TextArea
                rows={4}
                placeholder="Enter custom analytics code"
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

export default AnalyticsSettings;
