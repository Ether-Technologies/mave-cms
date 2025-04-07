// components/CMSSettings/BackupSettings.js

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
  TimePicker,
} from "antd";
import instance from "../../axios";
import { InfoCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

const BackupSettings = ({ config, id }) => {
  const [form] = Form.useForm();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    form.setFieldsValue(config);
  }, [config, form]);

  const onFinish = async (values) => {
    setSaving(true);
    try {
      await instance.put(`/settings/${id}`, {
        type: "backup-settings",
        config: {
          name: "Backup Settings",
          description: "Backup Settings for MAVE",
          ...values,
        },
      });
      message.success("Backup Settings updated successfully!");
    } catch (error) {
      console.error("Error updating Backup Settings:", error);
      message.error("Failed to update Backup Settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card
      title={
        <Space>
          <Title level={4} style={{ margin: 0 }}>
            Backup Settings
          </Title>
          <Tooltip title="Configure your backup settings">
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
              name="autoBackup"
              label="Auto Backup"
              valuePropName="checked"
              extra={<Text type="secondary">Enable automatic backups</Text>}
            >
              <Switch />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="backupFrequency"
              label="Backup Frequency"
              dependencies={["autoBackup"]}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!getFieldValue("autoBackup") || value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Please select backup frequency")
                    );
                  },
                }),
              ]}
              extra={<Text type="secondary">How often to create backups</Text>}
            >
              <Select placeholder="Select backup frequency">
                <Option value="daily">Daily</Option>
                <Option value="weekly">Weekly</Option>
                <Option value="monthly">Monthly</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="backupTime"
              label="Backup Time"
              dependencies={["autoBackup"]}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!getFieldValue("autoBackup") || value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Please select backup time")
                    );
                  },
                }),
              ]}
              extra={<Text type="secondary">Time to perform backups</Text>}
            >
              <TimePicker format="HH:mm" className="w-full" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="retentionPeriod"
              label="Retention Period"
              dependencies={["autoBackup"]}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!getFieldValue("autoBackup") || value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Please enter retention period")
                    );
                  },
                }),
              ]}
              extra={
                <Text type="secondary">Number of days to keep backups</Text>
              }
            >
              <InputNumber
                min={1}
                max={365}
                placeholder="Enter retention period"
                className="w-full"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 16]}>
          <Col xs={24} md={12}>
            <Form.Item
              name="backupLocation"
              label="Backup Location"
              dependencies={["autoBackup"]}
              rules={[
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!getFieldValue("autoBackup") || value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Please select backup location")
                    );
                  },
                }),
              ]}
              extra={<Text type="secondary">Where to store backups</Text>}
            >
              <Select placeholder="Select backup location">
                <Option value="local">Local Server</Option>
                <Option value="s3">Amazon S3</Option>
                <Option value="google">Google Drive</Option>
                <Option value="dropbox">Dropbox</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="compressionEnabled"
              label="Compression"
              valuePropName="checked"
              extra={<Text type="secondary">Compress backup files</Text>}
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

export default BackupSettings;
