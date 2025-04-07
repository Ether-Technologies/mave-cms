// components/CMSSettings/EmailSettings.js

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

const EmailSettings = ({ config, id }) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    form.setFieldsValue(config);
  }, [config, form]);

  const onFinish = async (values) => {
    setSaving(true);
    try {
      await instance.put(`/settings/${id}`, {
        type: "email-settings",
        config: {
          name: "Email Settings",
          description: "Email Settings for MAVE",
          ...values,
        },
      });
      message.success("Email Settings updated successfully!");
    } catch (error) {
      console.error("Error updating Email Settings:", error);
      message.error("Failed to update Email Settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card
      title={
        <Space>
          <Title level={4} style={{ margin: 0 }}>
            Email Settings
          </Title>
          <Tooltip title="Configure your email settings">
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
              name="mailDriver"
              label="Mail Driver"
              rules={[{ required: true, message: "Mail driver is required." }]}
              extra={
                <Text type="secondary">Select your email service provider</Text>
              }
            >
              <Select placeholder="Select mail driver">
                <Option value="smtp">SMTP</Option>
                <Option value="sendmail">Sendmail</Option>
                <Option value="mailgun">Mailgun</Option>
                <Option value="ses">Amazon SES</Option>
                <Option value="postmark">Postmark</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="fromAddress"
              label="From Address"
              rules={[
                { required: true, message: "From address is required." },
                {
                  type: "email",
                  message: "Please enter a valid email address.",
                },
              ]}
              extra={<Text type="secondary">Default sender email address</Text>}
            >
              <Input placeholder="Enter from address" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="fromName"
              label="From Name"
              rules={[{ required: true, message: "From name is required." }]}
              extra={<Text type="secondary">Default sender name</Text>}
            >
              <Input placeholder="Enter from name" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="replyToAddress"
              label="Reply To Address"
              rules={[
                { required: true, message: "Reply to address is required." },
                {
                  type: "email",
                  message: "Please enter a valid email address.",
                },
              ]}
              extra={
                <Text type="secondary">Default reply-to email address</Text>
              }
            >
              <Input placeholder="Enter reply to address" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="smtpHost"
              label="SMTP Host"
              dependencies={["mailDriver"]}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (getFieldValue("mailDriver") !== "smtp" || value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Please enter SMTP host"));
                  },
                }),
              ]}
              extra={<Text type="secondary">SMTP server hostname</Text>}
            >
              <Input placeholder="Enter SMTP host" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="smtpPort"
              label="SMTP Port"
              dependencies={["mailDriver"]}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (getFieldValue("mailDriver") !== "smtp" || value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Please enter SMTP port"));
                  },
                }),
              ]}
              extra={<Text type="secondary">SMTP server port</Text>}
            >
              <Input placeholder="Enter SMTP port" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="smtpUsername"
              label="SMTP Username"
              dependencies={["mailDriver"]}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (getFieldValue("mailDriver") !== "smtp" || value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Please enter SMTP username")
                    );
                  },
                }),
              ]}
              extra={<Text type="secondary">SMTP server username</Text>}
            >
              <Input placeholder="Enter SMTP username" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="smtpPassword"
              label="SMTP Password"
              dependencies={["mailDriver"]}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (getFieldValue("mailDriver") !== "smtp" || value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Please enter SMTP password")
                    );
                  },
                }),
              ]}
              extra={<Text type="secondary">SMTP server password</Text>}
            >
              <Input.Password placeholder="Enter SMTP password" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="smtpEncryption"
              label="SMTP Encryption"
              dependencies={["mailDriver"]}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (getFieldValue("mailDriver") !== "smtp" || value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Please select SMTP encryption")
                    );
                  },
                }),
              ]}
              extra={<Text type="secondary">SMTP connection encryption</Text>}
            >
              <Select placeholder="Select encryption">
                <Option value="tls">TLS</Option>
                <Option value="ssl">SSL</Option>
                <Option value="none">None</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="testEmail"
              label="Test Email"
              rules={[
                { required: true, message: "Test email is required." },
                {
                  type: "email",
                  message: "Please enter a valid email address.",
                },
              ]}
              extra={
                <Text type="secondary">Email to send test messages to</Text>
              }
            >
              <Input placeholder="Enter test email" />
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

export default EmailSettings;
