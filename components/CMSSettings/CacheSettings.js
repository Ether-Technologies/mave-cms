// components/CMSSettings/CacheSettings.js

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

const CacheSettings = ({ config, id }) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    form.setFieldsValue(config);
  }, [config, form]);

  const onFinish = async (values) => {
    setSaving(true);
    try {
      await instance.put(`/settings/${id}`, {
        type: "cache-settings",
        config: {
          name: "Cache Settings",
          description: "Cache Settings for MAVE",
          ...values,
        },
      });
      message.success("Cache Settings updated successfully!");
    } catch (error) {
      console.error("Error updating Cache Settings:", error);
      message.error("Failed to update Cache Settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card
      title={
        <Space>
          <Title level={4} style={{ margin: 0 }}>
            Cache Settings
          </Title>
          <Tooltip title="Configure your cache settings">
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
              name="cacheEnabled"
              label="Cache"
              valuePropName="checked"
              extra={
                <Text type="secondary">
                  Enable caching for better performance
                </Text>
              }
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="cacheType"
              label="Cache Type"
              dependencies={["cacheEnabled"]}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!getFieldValue("cacheEnabled") || value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Please select cache type")
                    );
                  },
                }),
              ]}
              extra={<Text type="secondary">Type of cache to use</Text>}
            >
              <Select placeholder="Select cache type">
                <Option value="memory">Memory</Option>
                <Option value="redis">Redis</Option>
                <Option value="file">File</Option>
                <Option value="database">Database</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="cacheDuration"
              label="Cache Duration"
              dependencies={["cacheEnabled"]}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!getFieldValue("cacheEnabled") || value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Please enter cache duration")
                    );
                  },
                }),
              ]}
              extra={<Text type="secondary">Duration in minutes</Text>}
            >
              <InputNumber
                min={1}
                max={1440}
                placeholder="Enter cache duration"
                className="w-full"
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="cachePrefix"
              label="Cache Prefix"
              dependencies={["cacheEnabled"]}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!getFieldValue("cacheEnabled") || value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Please enter cache prefix")
                    );
                  },
                }),
              ]}
              extra={<Text type="secondary">Prefix for cache keys</Text>}
            >
              <Input placeholder="Enter cache prefix" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="clearCacheOnUpdate"
              label="Clear Cache on Update"
              valuePropName="checked"
              extra={
                <Text type="secondary">
                  Automatically clear cache when content is updated
                </Text>
              }
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="cacheCompression"
              label="Cache Compression"
              valuePropName="checked"
              extra={<Text type="secondary">Compress cached data</Text>}
            >
              <Switch />
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

export default CacheSettings;
