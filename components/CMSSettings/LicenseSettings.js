import React from "react";
import { Card, Descriptions, Tag, Space, Typography, Tooltip } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

const LicenseSettings = ({ config }) => {
  const licenseData = config.fields;

  const getStatusTag = (status) => {
    return status ? (
      <Tag color="success" icon={<CheckCircleOutlined />}>
        Active
      </Tag>
    ) : (
      <Tag color="error" icon={<CloseCircleOutlined />}>
        Inactive
      </Tag>
    );
  };

  const getVerificationTag = (verified) => {
    return verified ? (
      <Tag color="success" icon={<CheckCircleOutlined />}>
        Verified
      </Tag>
    ) : (
      <Tag color="warning" icon={<CloseCircleOutlined />}>
        Unverified
      </Tag>
    );
  };

  return (
    <Card
      title={
        <Space>
          <Title level={4} style={{ margin: 0 }}>
            License Information
          </Title>
          <Tooltip title="View and manage your license details">
            <InfoCircleOutlined style={{ color: "#1890ff" }} />
          </Tooltip>
        </Space>
      }
      className="max-w-3xl mx-auto"
    >
      <Descriptions
        column={{ xs: 1, sm: 2 }}
        bordered
        size="middle"
        className="bg-white"
      >
        <Descriptions.Item label="License Type" span={2}>
          <Text strong>{licenseData.license_type.value}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Project ID">
          <Text copyable>{licenseData.project_id.value}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Site URL">
          <Text copyable>{licenseData.site_url.value}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="License Key" span={2}>
          <Space>
            <Text copyable>{licenseData.license_key.value}</Text>
            {getVerificationTag(licenseData.is_verified.value)}
          </Space>
        </Descriptions.Item>
        <Descriptions.Item label="Starting Date">
          <Text>{licenseData.starting_date.value}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Expiry Date">
          <Text>{licenseData.expiry_date.value}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Email">
          <Text copyable>{licenseData.email.value}</Text>
        </Descriptions.Item>
        <Descriptions.Item label="Status">
          {getStatusTag(licenseData.status.value)}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default LicenseSettings;
