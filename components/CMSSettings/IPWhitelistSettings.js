import React, { useEffect, useState } from "react";
import {
  Form,
  Switch,
  Select,
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

const { Title, Text } = Typography;

const IPWhitelistSettings = ({ config, id }) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    console.log("IPWhitelistSettings config:", config);
    // Set initial form values from config
    const initialValues = {
      enabled: Array.isArray(config.allowedIps) && config.allowedIps.length > 0,
      allowedIps: Array.isArray(config.allowedIps) ? config.allowedIps : [],
    };
    console.log("Setting initial values:", initialValues);
    form.setFieldsValue(initialValues);
  }, [config, form]);

  const onFinish = async (values) => {
    setSaving(true);
    try {
      // The IPs are already in array format from the Select component
      const formattedValues = {
        allowedIps: values.enabled ? values.allowedIps : [],
      };

      await instance.put(`/settings/${id}`, {
        type: "allowed_ips",
        config: formattedValues.allowedIps,
      });

      message.success("IP Whitelist settings updated successfully!");
    } catch (error) {
      console.error("Error updating IP Whitelist settings:", error);
      message.error("Failed to update IP Whitelist settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card
      title={
        <Space>
          <Title level={4} style={{ margin: 0 }}>
            IP Whitelist Settings
          </Title>
          <Tooltip title="Configure allowed IP addresses for access control">
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
              name="enabled"
              label="Enable IP Whitelisting"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="allowedIps"
          label="Allowed IPs"
          dependencies={["enabled"]}
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!getFieldValue("enabled") || (value && value.length > 0)) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Please enter at least one allowed IP.")
                );
              },
            }),
          ]}
        >
          <Select
            mode="tags"
            style={{ width: "100%" }}
            placeholder="Enter IP addresses"
            tokenSeparators={[",", " "]}
            disabled={!form.getFieldValue("enabled")}
          />
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

export default IPWhitelistSettings;
