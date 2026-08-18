import {
  Table,
  Switch,
  Button,
  Tag,
  Popconfirm,
  message,
} from "antd";
import { useState } from "react";
import { useRouter } from "next/router";
import { DeleteOutlined, EditOutlined, TeamOutlined, UserSwitchOutlined } from "@ant-design/icons";
import instance from "../../axios";

export default function OrganizationTable({
  organizations,
  fetchOrganizations,
  loading,
  onEdit,
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleActive = async (record, checked) => {
    try {
      await instance.put(`/organizations/${record.id}`, {
        is_active: checked,
      });
      fetchOrganizations();
      message.success("Organization status updated");
    } catch (error) {
      console.error(error);
      message.error("Failed to update organization status");
    }
  };

  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      await instance.delete(`/organizations/${id}`);
      fetchOrganizations();
      message.success("Organization deleted successfully");
    } catch (error) {
      console.error(error);
      message.error(
        error?.response?.data?.message || "Failed to delete organization"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <Button
          type="link"
          onClick={() => router.push(`/admin/organizations/${record.id}`)}
          style={{ padding: 0, fontWeight: 500 }}
        >
          {name}
        </Button>
      ),
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => email || "—",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (phone) => phone || "—",
    },
    {
      title: "Users",
      dataIndex: "users_count",
      key: "users_count",
      render: (count) => (
        <Tag icon={<TeamOutlined />} color="blue">
          {count ?? 0}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
          onChange={(checked) => handleToggleActive(record, checked)}
        />
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <Button
            icon={<EditOutlined />}
            onClick={() => onEdit?.(record)}
            style={{
              backgroundColor: "transparent",
              color: "var(--theme)",
              borderColor: "var(--theme)",
            }}
          >
            Edit
          </Button>
          <Button
            icon={<UserSwitchOutlined />}
            onClick={() => router.push(`/admin/organizations/${record.id}`)}
            style={{
              backgroundColor: "var(--theme)",
              color: "white",
              borderColor: "var(--theme)",
            }}
          >
            Users & Roles
          </Button>
          <Popconfirm
            title="Delete this organization?"
            description="This only works if the organization has no users."
            onConfirm={() => handleDelete(record.id)}
            okButtonProps={{ danger: true }}
          >
            <Button
              icon={<DeleteOutlined />}
              loading={isLoading}
              danger
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={organizations}
      loading={loading}
      rowKey={(record) => record.id}
      pagination={{ pageSize: 10 }}
    />
  );
}
