// components/CMSSettings/NotificationSettings.js

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
} from "antd";
import instance from "../../axios";
import { InfoCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

const NotificationSettings = ({ config, id }) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    form.setFieldsValue(config);
  }, [config, form]);

  const onFinish = async (values) => {
    setSaving(true);
    try {
      await instance.put(`/settings/${id}`, {
        type: "notification-settings",
        config: {
          name: "Notification Settings",
          description: "Notification Settings for MAVE",
          ...values,
        },
      });
      message.success("Notification Settings updated successfully!");
    } catch (error) {
      console.error("Error updating Notification Settings:", error);
      message.error("Failed to update Notification Settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card
      title={
        <Space>
          <Title level={4} style={{ margin: 0 }}>
            Notification Settings
          </Title>
          <Tooltip title="Configure your notification settings">
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
              name="emailNotifications"
              label="Email Notifications"
              valuePropName="checked"
              extra={<Text type="secondary">Enable email notifications</Text>}
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="pushNotifications"
              label="Push Notifications"
              valuePropName="checked"
              extra={<Text type="secondary">Enable push notifications</Text>}
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="notificationFrequency"
              label="Notification Frequency"
              rules={[
                {
                  required: true,
                  message: "Notification frequency is required.",
                },
              ]}
              extra={
                <Text type="secondary">How often to send notifications</Text>
              }
            >
              <Select placeholder="Select frequency">
                <Option value="immediate">Immediate</Option>
                <Option value="daily">Daily</Option>
                <Option value="weekly">Weekly</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="notificationTypes"
              label="Notification Types"
              rules={[
                { required: true, message: "Notification types are required." },
              ]}
              extra={
                <Text type="secondary">Types of notifications to receive</Text>
              }
            >
              <Select mode="multiple" placeholder="Select notification types">
                <Option value="content">Content Updates</Option>
                <Option value="user">User Activity</Option>
                <Option value="system">System Alerts</Option>
                <Option value="security">Security Events</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="notificationEmail"
              label="Notification Email"
              dependencies={["emailNotifications"]}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!getFieldValue("emailNotifications") || value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Please enter notification email")
                    );
                  },
                }),
                {
                  type: "email",
                  message: "Please enter a valid email address.",
                },
              ]}
              extra={
                <Text type="secondary">Email to receive notifications</Text>
              }
            >
              <Input placeholder="Enter notification email" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="notificationTime"
              label="Notification Time"
              dependencies={["notificationFrequency"]}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (
                      getFieldValue("notificationFrequency") === "immediate" ||
                      value
                    ) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Please select notification time")
                    );
                  },
                }),
              ]}
              extra={<Text type="secondary">Time to send notifications</Text>}
            >
              <Select placeholder="Select time">
                <Option value="morning">Morning (8:00 AM)</Option>
                <Option value="afternoon">Afternoon (2:00 PM)</Option>
                <Option value="evening">Evening (8:00 PM)</Option>
              </Select>
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

export default NotificationSettings;
