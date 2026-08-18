import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Empty, Tag, Spin, message, Table, Descriptions } from "antd";
import { ArrowLeftOutlined, TeamOutlined } from "@ant-design/icons";
import Link from "next/link";
import instance from "../../../../axios";
import AdminTopbar from "../../../../components/admin/AdminTopbar";
import { ADMIN_MENU_ITEMS } from "../../../../components/admin/adminMenuItems";
import { usePermissions } from "../../../../src/hooks/usePermissions";

export default function OrganizationViewPage() {
  const router = useRouter();
  const { id } = router.query;
  const { canManagePlatform } = usePermissions();

  const [organization, setOrganization] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const canManage = canManagePlatform;

  const fetchOrganization = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const orgResponse = await instance.get(`/organizations/${id}`);

      if (orgResponse.status === 200) {
        setOrganization(orgResponse.data);
        if (Array.isArray(orgResponse.data.users)) {
          setUsers(orgResponse.data.users);
        }
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to load organization");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canManage && id) {
      fetchOrganization();
    }
  }, [canManage, id]);

  if (!canManage) {
    return (
      <div className="mavecontainer">
        <Empty description="You do not have permission to view organizations." />
      </div>
    );
  }

  if (!id || (loading && !organization)) {
    return (
      <div className="mavecontainer" style={{ textAlign: "center", padding: 48 }}>
        <Spin size="large" />
      </div>
    );
  }

  const userColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      key: "role",
      render: (_, record) => (
        <Tag color="blue">{record.role_mave?.title || "—"}</Tag>
      ),
    },
  ];

  return (
    <div className="mavecontainer">
      <AdminTopbar menuItems={ADMIN_MENU_ITEMS} active="1" />

      <div style={{ marginTop: 24 }}>
        <Link href="/admin/organizations">
          <Button icon={<ArrowLeftOutlined />} style={{ marginBottom: 16 }}>
            Back to Organizations
          </Button>
        </Link>

        <h2 style={{ margin: "0 0 16px", fontSize: "1.5rem", fontWeight: 600 }}>
          {organization?.name || "Organization"}
        </h2>

        <Descriptions
          bordered
          column={2}
          size="middle"
          style={{ marginBottom: 32 }}
        >
          <Descriptions.Item label="Name">
            {organization?.name || "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Slug">
            {organization?.slug || "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Email">
            {organization?.email || "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Phone">
            {organization?.phone || "—"}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={organization?.is_active ? "green" : "red"}>
              {organization?.is_active ? "Active" : "Inactive"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Users">
            <Tag icon={<TeamOutlined />} color="blue">
              {users.length || organization?.users_count || 0}
            </Tag>
          </Descriptions.Item>
        </Descriptions>

        <h3 style={{ marginBottom: 16, fontWeight: 500 }}>Users</h3>
        <Table
          columns={userColumns}
          dataSource={users}
          loading={loading}
          rowKey={(record) => record.id}
          pagination={false}
          locale={{ emptyText: "No users found" }}
        />
      </div>
    </div>
  );
}
