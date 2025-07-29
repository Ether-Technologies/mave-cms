// components/documentation/Dependency.js

import React from "react";
import { Card, Typography, Space, Tag } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;

const Dependency = () => {
  const dependencies = [
    {
      name: "react",
      version: "18.2.0",
      description: "Core React library for building user interfaces",
      status: "installed",
    },
    {
      name: "next",
      version: "^12.3.4",
      description: "Next.js framework for server-side rendering",
      status: "installed",
    },
    {
      name: "antd",
      version: "^5.19.0",
      description: "Ant Design UI component library",
      status: "installed",
    },
    {
      name: "@dnd-kit/core",
      version: "^6.1.0",
      description: "Core drag and drop functionality for React",
      status: "installed",
    },
    {
      name: "@dnd-kit/sortable",
      version: "^8.0.0",
      description: "Sortable drag and drop functionality",
      status: "installed",
    },
    {
      name: "@dnd-kit/modifiers",
      version: "^7.0.0",
      description: "Modifiers for drag and drop behavior",
      status: "installed",
    },
    {
      name: "@dnd-kit/utilities",
      version: "^3.2.2",
      description: "Utility functions for @dnd-kit",
      status: "installed",
    },
    {
      name: "react-dnd",
      version: "^16.0.1",
      description: "Drag and drop library for React",
      status: "installed",
    },
    {
      name: "react-dnd-html5-backend",
      version: "^16.0.1",
      description: "HTML5 backend for React DnD",
      status: "installed",
    },
    {
      name: "axios",
      version: "^1.6.7",
      description: "HTTP client for making API requests",
      status: "installed",
    },
    {
      name: "swr",
      version: "^2.2.5",
      description: "React Hooks for data fetching",
      status: "installed",
    },
    {
      name: "framer-motion",
      version: "^12.12.2",
      description: "Animation library for React",
      status: "installed",
    },
    {
      name: "dayjs",
      version: "^1.11.13",
      description: "Modern date utility library",
      status: "installed",
    },
    {
      name: "lodash",
      version: "^4.17.21",
      description: "JavaScript utility library",
      status: "installed",
    },
    {
      name: "uuid",
      version: "^10.0.0",
      description: "Generate RFC-compliant UUIDs",
      status: "installed",
    },
    {
      name: "cloudinary",
      version: "^2.5.1",
      description: "Cloudinary SDK for image management",
      status: "installed",
    },
    {
      name: "openai",
      version: "^4.70.2",
      description: "OpenAI API client for AI features",
      status: "installed",
    },
    {
      name: "js-yaml",
      version: "^4.1.0",
      description: "YAML parser and emitter for JavaScript",
      status: "installed",
    },
    {
      name: "ajv",
      version: "^8.17.1",
      description: "JSON Schema validator",
      status: "installed",
    },
    {
      name: "react-beautiful-dnd",
      version: "^13.1.1",
      description: "Legacy drag and drop library (replaced by @dnd-kit)",
      status: "removed",
    },
  ];

  const getStatusIcon = (status) => {
    return status === "installed" ? (
      <CheckCircleOutlined style={{ color: "#52c41a" }} />
    ) : (
      <CloseCircleOutlined style={{ color: "#ff4d4f" }} />
    );
  };

  const getStatusTag = (status) => {
    return status === "installed" ? (
      <Tag color="green">Installed</Tag>
    ) : (
      <Tag color="red">Removed</Tag>
    );
  };

  return (
    <div className="p-6">
      <Title level={2}>Dependencies</Title>
      <Paragraph>
        This page lists all the key dependencies used in the Mave CMS project.
        Dependencies are organized by category and show their current status.
      </Paragraph>

      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Card title="Core Dependencies" size="small">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dependencies
              .filter((dep) => ["react", "next", "antd"].includes(dep.name))
              .map((dep) => (
                <div
                  key={dep.name}
                  className="border rounded-lg p-4 bg-white shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Text strong>{dep.name}</Text>
                    {getStatusIcon(dep.status)}
                  </div>
                  <Text type="secondary" className="text-sm">
                    {dep.version}
                  </Text>
                  <Paragraph className="text-sm mt-2">
                    {dep.description}
                  </Paragraph>
                  {getStatusTag(dep.status)}
                </div>
              ))}
          </div>
        </Card>

        <Card title="Drag and Drop Libraries" size="small">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dependencies
              .filter((dep) =>
                dep.name.includes("dnd") || dep.name.includes("drag")
              )
              .map((dep) => (
                <div
                  key={dep.name}
                  className="border rounded-lg p-4 bg-white shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Text strong>{dep.name}</Text>
                    {getStatusIcon(dep.status)}
                  </div>
                  <Text type="secondary" className="text-sm">
                    {dep.version}
                  </Text>
                  <Paragraph className="text-sm mt-2">
                    {dep.description}
                  </Paragraph>
                  {getStatusTag(dep.status)}
                </div>
              ))}
          </div>
        </Card>

        <Card title="Utility Libraries" size="small">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dependencies
              .filter(
                (dep) =>
                  !["react", "next", "antd"].includes(dep.name) &&
                  !dep.name.includes("dnd") &&
                  !dep.name.includes("drag")
              )
              .map((dep) => (
                <div
                  key={dep.name}
                  className="border rounded-lg p-4 bg-white shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Text strong>{dep.name}</Text>
                    {getStatusIcon(dep.status)}
                  </div>
                  <Text type="secondary" className="text-sm">
                    {dep.version}
                  </Text>
                  <Paragraph className="text-sm mt-2">
                    {dep.description}
                  </Paragraph>
                  {getStatusTag(dep.status)}
                </div>
              ))}
          </div>
        </Card>
      </Space>

      <Card title="Migration Notes" className="mt-6">
        <Paragraph>
          <Text strong>Recent Changes:</Text>
        </Paragraph>
        <ul className="list-disc list-inside space-y-2">
          <li>
            <Text>
              Migrated from <Text code>react-beautiful-dnd</Text> to{" "}
              <Text code>@dnd-kit</Text> for better performance and modern React
              support
            </Text>
          </li>
          <li>
            <Text>
              Added <Text code>@dnd-kit/sortable</Text> for sortable drag and
              drop functionality
            </Text>
          </li>
          <li>
            <Text>
              Added <Text code>@dnd-kit/modifiers</Text> for advanced drag and
              drop behavior customization
            </Text>
          </li>
          <li>
            <Text>
              Added <Text code>@dnd-kit/utilities</Text> for utility functions
            </Text>
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default Dependency;
