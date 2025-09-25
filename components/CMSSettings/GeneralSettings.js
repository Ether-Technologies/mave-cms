// components/CMSSettings/GeneralSettings.js

import React, { useEffect, useState } from "react";
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
import { setThemeColors } from "../../utils/themeUtils";
import { InfoCircleOutlined } from "@ant-design/icons";
import RichTextEditor from "../RichTextEditor";

const { Option } = Select;
const { Title, Text } = Typography;

const GeneralSettings = ({ config, id }) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  // Define theme options with theme and accent colors
  const theme_options = [
    {
      name: "Default",
      theme: "#fcb813",
      accent: "#e3a611",
    },
    {
      name: "Orange",
      theme: "#fb5607",
      accent: "#f27059",
    },
    {
      name: "Red",
      theme: "#ff006e",
      accent: "#9d0208",
    },
    {
      name: "Violet",
      theme: "#8338ec",
      accent: "#7209b7",
    },
    {
      name: "Blue",
      theme: "#fcb813",
      accent: "#e3a611",
    },
    {
      name: "Green",
      theme: "#7ae582",
      accent: "#25a18e",
    },
  ];

  useEffect(() => {
    // Assuming config prop has 'type', 'config', 'media_list', 'created_by'
    form.setFieldsValue(config); // Set form fields with config
    // Apply the initial theme
    if (config.themecolor && config.themeaccent) {
      setThemeColors(config.themecolor, config.themeaccent);
    }
  }, [config, form]);

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

      // Apply the updated theme
      if (values.themecolor && values.themeaccent) {
        setThemeColors(values.themecolor, values.themeaccent);
      }
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
      // Apply the theme colors immediately
      setThemeColors(selectedTheme.theme, selectedTheme.accent);
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
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      backgroundColor: theme.theme,
                      borderRadius: "50%",
                    }}
                  />
                  {theme.name}
                </Space>
              </Option>
            ))}
          </Select>
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
