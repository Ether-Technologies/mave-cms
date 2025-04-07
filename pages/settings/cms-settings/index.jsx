// pages/settings/index.js

import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Spin,
  message,
  Empty,
  Button,
  Space,
  Typography,
  Menu,
} from "antd";
import SettingsFormWrapper from "../../../components/CMSSettings/SettingsFormWrapper";
import Head from "next/head";
import instance from "../../../axios";
import {
  SettingOutlined,
  LockOutlined,
  KeyOutlined,
  GlobalOutlined,
  MailOutlined,
  BellOutlined,
  CloudUploadOutlined,
  DashboardOutlined,
  LineChartOutlined,
  CreditCardOutlined,
  ApiOutlined,
  SecurityScanOutlined,
  DatabaseOutlined,
  ToolOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

// Categorized settings structure
const settingsCategories = [
  {
    key: "general",
    label: "General",
    icon: <SettingOutlined />,
    children: [
      {
        type: "general-settings",
        id: 1,
        config: {
          name: "General Settings",
          fields: {},
        },
        description: "Configure basic site settings and preferences",
      },
      {
        type: "content-settings",
        id: 3,
        config: {
          name: "Content Settings",
          fields: {},
        },
        description: "Configure content management settings",
      },
    ],
  },
  {
    key: "security",
    label: "Security",
    icon: <SecurityScanOutlined />,
    children: [
      {
        type: "security-settings",
        id: 4,
        config: {
          name: "Security Settings",
          fields: {},
        },
        description: "Manage security and access control",
      },
    ],
  },
  {
    key: "ip-whitelist",
    label: "IP Whitelist",
    icon: <GlobalOutlined />,
    children: [
      {
        type: "allowed_ips",
        id: 1,
        config: {
          name: "IP Whitelist",
          fields: {},
        },
        description: "Manage allowed IP addresses",
      },
    ],
  },
  {
    key: "license",
    label: "License",
    icon: <KeyOutlined />,
    children: [
      {
        type: "mave_license",
        id: 6,
        config: {
          name: "License Settings",
          fields: {},
        },
        description: "View and manage license information",
      },
    ],
  },
  {
    key: "communication",
    label: "Communication",
    icon: <MailOutlined />,
    children: [
      {
        type: "email-settings",
        id: 5,
        config: {
          name: "Email Settings",
          fields: {},
        },
        description: "Configure email service settings",
      },
      {
        type: "notification-settings",
        id: 6,
        config: {
          name: "Notification Settings",
          fields: {},
        },
        description: "Manage notification preferences",
      },
    ],
  },
  {
    key: "performance",
    label: "Performance",
    icon: <ToolOutlined />,
    children: [
      {
        type: "cache-settings",
        id: 8,
        config: {
          name: "Cache Settings",
          fields: {},
        },
        description: "Manage caching and performance",
      },
      {
        type: "performance-settings",
        id: 9,
        config: {
          name: "Performance Settings",
          fields: {},
        },
        description: "Optimize system performance",
      },
    ],
  },
  {
    key: "data",
    label: "Data",
    icon: <DatabaseOutlined />,
    children: [
      {
        type: "backup-settings",
        id: 7,
        config: {
          name: "Backup Settings",
          fields: {},
        },
        description: "Configure backup and restore settings",
      },
      {
        type: "analytics-settings",
        id: 10,
        config: {
          name: "Analytics Settings",
          fields: {},
        },
        description: "Configure analytics and tracking",
      },
    ],
  },
  {
    key: "business",
    label: "Business",
    icon: <CreditCardOutlined />,
    children: [
      {
        type: "payment-settings",
        id: 11,
        config: {
          name: "Payment Settings",
          fields: {},
        },
        description: "Manage payment gateway settings",
      },
      {
        type: "seo-settings",
        id: 2,
        config: {
          name: "SEO Settings",
          fields: {},
        },
        description: "Manage search engine optimization settings",
      },
    ],
  },
];

const CMSSettingsPage = () => {
  const [settings, setSettings] = useState(settingsCategories);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSetting, setActiveSetting] = useState(null);
  const [currentCategory, setCurrentCategory] = useState("general");

  // Fetch settings from the backend API
  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await instance.get("/settings");
      console.log("Settings response data:", response.data);

      // Process the response data
      let processedSettings = settingsCategories;

      if (response.data && Array.isArray(response.data)) {
        // Create a map of existing settings from the API
        const apiSettingsMap = response.data.reduce((acc, setting) => {
          acc[setting.type] = setting;
          return acc;
        }, {});

        // Update the settings with API data
        processedSettings = settingsCategories.map((category) => ({
          ...category,
          children: category.children.map((setting) => {
            const apiSetting = apiSettingsMap[setting.type];
            if (apiSetting) {
              // Handle allowed_ips settings
              if (setting.type === "allowed_ips") {
                return {
                  ...setting,
                  id: apiSetting.id,
                  config: {
                    name: "IP Whitelist",
                    allowedIps: apiSetting.config || [],
                  },
                };
              }
              // Handle license settings
              if (setting.type === "mave_license") {
                return {
                  ...setting,
                  id: apiSetting.id,
                  config: {
                    name: "License Settings",
                    ...apiSetting.config,
                  },
                };
              }
              return {
                ...setting,
                id: apiSetting.id,
                config: {
                  ...setting.config,
                  ...apiSetting.config,
                },
              };
            }
            return setting;
          }),
        }));

        // Add any settings from API that aren't in our categories
        const uncategorizedSettings = response.data.filter(
          (setting) => !Object.keys(apiSettingsMap).includes(setting.type)
        );

        if (uncategorizedSettings.length > 0) {
          processedSettings.push({
            key: "uncategorized",
            label: "Other Settings",
            icon: <SettingOutlined />,
            children: uncategorizedSettings.map((setting) => ({
              type: setting.type,
              id: setting.id,
              config: {
                name: setting.type
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase()),
                ...setting.config,
              },
              description: `Configure ${setting.type.replace(/_/g, " ")} settings`,
            })),
          });
        }
      }

      console.log("Processed settings:", processedSettings);
      setSettings(processedSettings);
      setActiveSetting(processedSettings[0].children[0]);
    } catch (error) {
      console.error("Error fetching settings:", error);
      setError("Failed to load settings. Using default settings.");
      message.warning("Failed to load settings. Using default settings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleMenuClick = (e) => {
    const [categoryKey, settingType] = e.key.split(":");
    setCurrentCategory(categoryKey);
    const category = settings.find((cat) => cat.key === categoryKey);
    if (category) {
      const setting = category.children.find((s) => s.type === settingType);
      if (setting) {
        setActiveSetting(setting);
      }
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Space direction="vertical" align="center" size="large">
          <Spin size="large" />
          <Text type="secondary">Loading settings...</Text>
        </Space>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Empty
          description={<Text type="secondary">{error}</Text>}
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
        <Button type="primary" onClick={fetchSettings} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  const menuItems = settings.map((category) => ({
    key: category.key,
    icon: category.icon,
    label: category.label,
    children: category.children.map((setting) => ({
      key: `${category.key}:${setting.type}`,
      label: setting.config.name,
    })),
  }));

  return (
    <>
      <Head>
        <title>Settings - Mave CMS</title>
      </Head>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Title level={2} className="mb-6">
          Settings
        </Title>

        <div className="bg-white rounded-lg shadow-sm">
          <Row className="min-h-[calc(100vh-12rem)]">
            {/* Settings Navigation */}
            <Col xs={24} md={8} lg={6} className="border-r border-gray-200">
              <div className="p-4 sticky top-0 max-h-screen overflow-y-auto">
                <Menu
                  mode="inline"
                  defaultSelectedKeys={[
                    `${settings[0].key}:${settings[0].children[0].type}`,
                  ]}
                  defaultOpenKeys={[settings[0].key]}
                  style={{ border: "none" }}
                  items={menuItems}
                  onClick={handleMenuClick}
                />
              </div>
            </Col>

            {/* Settings Content */}
            <Col xs={24} md={16} lg={18} className="bg-gray-50">
              <div className="p-6">
                {activeSetting && (
                  <Card className="shadow-none border-0">
                    <div className="mb-4">
                      <Text strong className="text-lg">
                        {activeSetting.config.name}
                      </Text>
                      <Text type="secondary" className="block mt-1">
                        {activeSetting.description}
                      </Text>
                    </div>
                    <SettingsFormWrapper
                      type={activeSetting.type}
                      config={activeSetting.config}
                      id={activeSetting.id}
                    />
                  </Card>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default CMSSettingsPage;
