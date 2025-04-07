// components/CMSSettings/SecuritySettings.js

import React, { useEffect, useState } from "react";
import {
  Form,
  Switch,
  Select,
  Input,
  InputNumber,
  Button,
  message,
  Card,
  Typography,
  Space,
  Row,
  Col,
  Tooltip,
  Divider,
} from "antd";
import instance from "../../axios";
import { InfoCircleOutlined } from "@ant-design/icons";

const { Option } = Select;
const { Title, Text } = Typography;

const SecuritySettings = ({ config, id }) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    console.log("SecuritySettings config:", config);
    // Set initial form values from config
    const initialValues = {
      ...config,
    };
    console.log("Setting initial values:", initialValues);
    form.setFieldsValue(initialValues);
  }, [config, form]);

  const onFinish = async (values) => {
    setSaving(true);
    try {
      await instance.put(`/settings/${id}`, {
        type: "security-settings",
        config: {
          name: "Security Settings",
          description: "Security Settings for MAVE",
          ...values,
        },
      });

      message.success("Security Settings updated successfully!");
    } catch (error) {
      console.error("Error updating Security Settings:", error);
      message.error("Failed to update Security Settings.");
    } finally {
      setSaving(false);
    }
  };

  const fetchRolesPermissions = async () => {
    try {
      const rolesResponse = await instance.get("/roles");
      const permissionsResponse = await instance.get("/permissions");

      if (rolesResponse.data && permissionsResponse.data) {
        setRoles(rolesResponse.data);
        setPermissions(permissionsResponse.data);
      } else {
        console.error("Error fetching roles and permissions.");
      }
    } catch (error) {
      console.error("Error fetching roles and permissions:", error);
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchRolesPermissions();
  }, []);

  return (
    <Card
      title={
        <Space>
          <Title level={4} style={{ margin: 0 }}>
            Security Settings
          </Title>
          <Tooltip title="Configure security settings and access controls">
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
              name="loginAttempts"
              label="Max Login Attempts"
              rules={[
                { required: true, message: "Please enter max login attempts" },
              ]}
            >
              <InputNumber min={1} max={10} className="w-full" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="passwordExpiry"
              label="Password Expiry (days)"
              rules={[
                {
                  required: true,
                  message: "Please enter password expiry days",
                },
              ]}
            >
              <InputNumber min={1} max={365} className="w-full" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="twoFactorAuth"
              label="Two-Factor Authentication"
              valuePropName="checked"
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

export default SecuritySettings;
