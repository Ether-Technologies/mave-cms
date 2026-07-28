// components/CMSSettings/GeneralSettings.js

import React, { useEffect, useState, useContext } from "react";
import {
  Form,
  Input,
  Select,
  Switch,
  Button,
  message,
  Tooltip,
  Card,
  Typography,
  Space,
  Row,
  Col,
} from "antd";
import instance from "../../axios";
import { ThemeContext } from "../../src/context/ThemeContext";
import { InfoCircleOutlined } from "@ant-design/icons";
import RichTextEditor from "../RichTextEditor";

const { Option } = Select;
const { Title, Text } = Typography;

const GeneralSettings = ({ config, id }) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const { updateTheme } = useContext(ThemeContext);

  // Define theme options with theme and accent colors
  const theme_options = [
    { name: "Default (tokens file)", theme: null, accent: null },
    { name: "Monochrome", theme: "#18181b", accent: "#27272a" },
    { name: "Charcoal", theme: "#27272a", accent: "#3f3f46" },
    { name: "Black", theme: "#000000", accent: "#262626" },
  ];

  useEffect(() => {
    // Assuming config prop has 'type', 'config', 'media_list', 'created_by'
    form.setFieldsValue(config);
    if (config.themecolor) {
      updateTheme(config.themecolor, config.themeaccent);
    }
  }, [config, form, updateTheme]);

  const onFinish = async (values) => {
    setSaving(true);
    try {
      // Construct the payload
      const payload = {
        type: "general-settings",
        config: {
          name: "General Settings",
          description: "General Settings for MAVE",
          ...values,
        },
        media_list: config.media_list || null,
        created_by: config.created_by || null,
      };

      await instance.put(`/settings/${id}`, payload);
      message.success("General Settings updated successfully!");

      updateTheme(values.themecolor || null, values.themeaccent || null);
    } catch (error) {
      console.error("Error updating General Settings:", error);
      message.error("Failed to update General Settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleThemeSelection = (value) => {
    const selectedTheme = theme_options.find((theme) => theme.name === value);
    if (selectedTheme) {
      // Update both themecolor and themeaccent in the form
      form.setFieldsValue({
        themecolor: selectedTheme.theme,
        themeaccent: selectedTheme.accent,
      });
      updateTheme(selectedTheme.theme, selectedTheme.accent);
    }
  };

  return (
    <Card
      title={
        <Space>
          <Title level={4} style={{ margin: 0 }}>
            General Settings
          </Title>
          <Tooltip title="Configure your site's general settings">
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
              name="siteTitle"
              label="Site Title"
              rules={[{ required: true, message: "Site Title is required." }]}
            >
              <Input placeholder="Enter your site title" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="siteDescription"
              label="Site Description"
              rules={[
                { required: true, message: "Site Description is required." },
              ]}
            >
              <RichTextEditor
                defaultValue={form.getFieldValue("siteDescription")}
                onChange={(html) => form.setFieldValue("siteDescription", html)}
                editMode={true}
                maxLength={1000}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="timezone"
              label="Timezone"
              rules={[{ required: true, message: "Timezone is required." }]}
            >
              <Select showSearch placeholder="Select timezone">
                <Option value="Asia/Dhaka">Asia/Dhaka</Option>
                <Option value="America/New_York">America/New_York</Option>
                <Option value="Europe/London">Europe/London</Option>
                <Option value="Asia/Tokyo">Asia/Tokyo</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="dateFormat"
              label="Date Format"
              rules={[{ required: true, message: "Date Format is required." }]}
            >
              <Select showSearch placeholder="Select date format">
                <Option value="DD-MM-YYYY">DD-MM-YYYY</Option>
                <Option value="MM-DD-YYYY">MM-DD-YYYY</Option>
                <Option value="YYYY-MM-DD">YYYY-MM-DD</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Theme"
          name="theme"
          rules={[{ required: true, message: "Theme selection is required." }]}
        >
          <Select
            showSearch
            placeholder="Select Theme"
            onChange={handleThemeSelection}
          >
            {theme_options.map((theme) => (
              <Option key={theme.name} value={theme.name}>
                <Space>
                  {theme.theme ? (
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        backgroundColor: theme.theme,
                        borderRadius: "50%",
                        border: "1px solid var(--border-default, #e4e4e7)",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        border: "2px dashed #a1a1aa",
                      }}
                    />
                  )}
                  {theme.name}
                </Space>
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="themecolor" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="themeaccent" hidden>
          <Input />
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

export default GeneralSettings;
