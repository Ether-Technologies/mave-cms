import { Table, Button, Popconfirm, message, Tag, Modal, Spin, Avatar } from "antd";
import { DeleteOutlined, EyeOutlined, UserOutlined } from "@ant-design/icons";
import { useState } from "react";

const getApiHost = () => {
  if (process.env.NEXT_PUBLIC_API_HOST) return process.env.NEXT_PUBLIC_API_HOST;
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  return base.split("/").slice(0, 3).join("/");
};

export default function TenantTable({ tenants, loading, onRefresh }) {
  const [deletingId, setDeletingId]     = useState(null);
  const [viewTenant, setViewTenant]     = useState(null);
  const [users, setUsers]               = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/tenants/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        message.error(data?.message || "Failed to delete tenant");
        return;
      }
      message.success("Tenant deleted successfully");
      onRefresh?.();
    } catch {
      message.error("An error occurred. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleViewUsers = async (tenant) => {
    setViewTenant(tenant);
    setUsers([]);
    setUsersLoading(true);
    try {
      const apiHost = getApiHost();
      const res = await fetch(`${apiHost}/${tenant.slug}/api/admin/users`);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : data?.data ?? []);
    } catch {
      message.error("Failed to load users.");
    } finally {
      setUsersLoading(false);
    }
  };

  const userColumns = [
    {
      title: "Avatar",
      key: "avatar",
      width: 60,
      render: (_, record) => (
        <Avatar
          src={record.picture || null}
          icon={!record.picture && <UserOutlined />}
          style={{ backgroundColor: "var(--theme)" }}
        />
      ),
    },
    { title: "Name",  dataIndex: "name",  key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Role",
      key: "role",
      render: (_, record) => (
        <Tag color="blue">{record.role_mave?.name || record.role || "user"}</Tag>
      ),
    },
    {
      title: "Joined",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => new Date(date).toLocaleDateString(),
    },
  ];

  const columns = [
    {
      title: "#",
      key: "index",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
      render: (slug) => <Tag>{slug}</Tag>,
    },
    {
      title: "Type",
      key: "type",
      render: (_, record) => (
        <Tag color={record.is_master ? "gold" : "blue"}>
          {record.is_master ? "Master" : "Client"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            icon={<EyeOutlined />}
            onClick={() => handleViewUsers(record)}
            style={{
              backgroundColor: "var(--theme)",
              color: "white",
              borderColor: "var(--theme)",
            }}
          />
          {!record.is_master && (
            <Popconfirm
              title="Delete this tenant?"
              description="This action cannot be undone."
              onConfirm={() => handleDelete(record.id)}
              okText="Delete"
              okButtonProps={{ danger: true }}
            >
              <Button
                icon={<DeleteOutlined />}
                loading={deletingId === record.id}
                danger
              />
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={tenants}
        loading={loading}
        rowKey={(record) => record.id}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={`Users — ${viewTenant?.name || ""}`}
        open={!!viewTenant}
        onCancel={() => setViewTenant(null)}
        footer={null}
        width={700}
      >
        {usersLoading ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={userColumns}
            dataSource={users}
            rowKey={(r) => r.id}
            pagination={{ pageSize: 5 }}
            locale={{ emptyText: "No users found for this tenant." }}
          />
        )}
      </Modal>
    </>
  );
}
