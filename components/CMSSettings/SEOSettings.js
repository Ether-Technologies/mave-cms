// components/CMSSettings/SEOSettings.js

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
} from "antd";
import instance from "../../axios";
import { InfoCircleOutlined } from "@ant-design/icons";
import RichTextEditor from "../RichTextEditor";

const { Title, Text } = Typography;

const SEOSettings = ({ config, id }) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    form.setFieldsValue(config);
  }, [config, form]);

  const onFinish = async (values) => {
    setSaving(true);
    try {
      await instance.put(`/settings/${id}`, {
        type: "seo-settings",
        config: {
          name: "SEO Settings",
          description: "SEO Settings for MAVE",
          ...values,
        },
      });
      message.success("SEO Settings updated successfully!");
    } catch (error) {
      console.error("Error updating SEO Settings:", error);
      message.error("Failed to update SEO Settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card
      title={
        <Space>
          <Title level={4} style={{ margin: 0 }}>
            SEO Settings
          </Title>
          <Tooltip title="Configure your site's SEO settings">
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
              name="metaTitle"
              label="Meta Title"
              rules={[{ required: true, message: "Meta Title is required." }]}
              extra={
                <Text type="secondary">
                  The title of your website that appears in search results
                </Text>
              }
            >
              <Input placeholder="Enter meta title" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="metaDescription"
              label="Meta Description"
              rules={[
                { required: true, message: "Meta Description is required." },
              ]}
              extra={
                <Text type="secondary">
                  A brief description of your website for search results
                </Text>
              }
            >
              <RichTextEditor
                defaultValue={form.getFieldValue("metaDescription")}
                onChange={(html) => form.setFieldValue("metaDescription", html)}
                editMode={true}
                maxLength={500}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="metaKeywords"
              label="Meta Keywords"
              rules={[
                { required: true, message: "Meta Keywords are required." },
              ]}
              extra={
                <Text type="secondary">
                  Keywords that describe your website content
                </Text>
              }
            >
              <Input placeholder="Enter meta keywords" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="ogTitle"
              label="Open Graph Title"
              rules={[{ required: true, message: "OG Title is required." }]}
              extra={
                <Text type="secondary">Title for social media sharing</Text>
              }
            >
              <Input placeholder="Enter Open Graph title" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="ogDescription"
              label="Open Graph Description"
              rules={[
                { required: true, message: "OG Description is required." },
              ]}
              extra={
                <Text type="secondary">
                  Description for social media sharing
                </Text>
              }
            >
              <RichTextEditor
                defaultValue={form.getFieldValue("ogDescription")}
                onChange={(html) => form.setFieldValue("ogDescription", html)}
                editMode={true}
                maxLength={500}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="ogType"
              label="Open Graph Type"
              rules={[{ required: true, message: "OG Type is required." }]}
              extra={
                <Text type="secondary">
                  Type of content for social media sharing
                </Text>
              }
            >
              <Input placeholder="Enter Open Graph type" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="ogUrl"
              label="Open Graph URL"
              rules={[
                { required: true, message: "OG URL is required." },
                { type: "url", message: "Please enter a valid URL." },
              ]}
              extra={<Text type="secondary">URL for social media sharing</Text>}
            >
              <Input placeholder="Enter Open Graph URL" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="ogImage"
              label="Open Graph Image URL"
              rules={[
                { required: true, message: "OG Image URL is required." },
                { type: "url", message: "Please enter a valid URL." },
              ]}
              extra={
                <Text type="secondary">Image URL for social media sharing</Text>
              }
            >
              <Input placeholder="Enter Open Graph image URL" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="twitterTitle"
              label="Twitter Title"
              rules={[
                { required: true, message: "Twitter Title is required." },
              ]}
              extra={<Text type="secondary">Title for Twitter sharing</Text>}
            >
              <Input placeholder="Enter Twitter title" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="twitterDescription"
              label="Twitter Description"
              rules={[
                { required: true, message: "Twitter Description is required." },
              ]}
              extra={
                <Text type="secondary">Description for Twitter sharing</Text>
              }
            >
              <RichTextEditor
                defaultValue={form.getFieldValue("twitterDescription")}
                onChange={(html) => form.setFieldValue("twitterDescription", html)}
                editMode={true}
                maxLength={500}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="twitterImage"
          label="Twitter Image URL"
          rules={[
            { required: true, message: "Twitter Image URL is required." },
            { type: "url", message: "Please enter a valid URL." },
          ]}
          extra={<Text type="secondary">Image URL for Twitter sharing</Text>}
        >
          <Input placeholder="Enter Twitter image URL" />
        </Form.Item>

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

export default SEOSettings;
