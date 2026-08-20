import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Empty, Tag, Spin, message, Table, Descriptions, Space, Typography, Popconfirm } from "antd";
import { ArrowLeftOutlined, CopyOutlined, ReloadOutlined, TeamOutlined } from "@ant-design/icons";
import Link from "next/link";
import instance from "../../../../axios";
import AdminTopbar from "../../../../components/admin/AdminTopbar";
import { usePermissions } from "../../../../src/hooks/usePermissions";

export default function OrganizationViewPage() {
  const router = useRouter();
  const { id } = router.query;
  const { canManagePlatform } = usePermissions();

  const [organization, setOrganization] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [regeneratingKey, setRegeneratingKey] = useState(false);

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

  const copySiteKey = async () => {
    if (!organization?.site_key) {
      return;
    }

    try {
      await navigator.clipboard.writeText(organization.site_key);
      message.success("Site key copied");
    } catch (error) {
      console.error(error);
      message.error("Failed to copy site key");
    }
  };

  const regenerateSiteKey = async () => {
    if (!id) {
      return;
    }

    try {
      setRegeneratingKey(true);
      const response = await instance.post(
        `/organizations/${id}/regenerate-site-key`
      );

      if (response.status === 200) {
        setOrganization((current) => ({
          ...current,
          site_key: response.data.site_key,
        }));
        message.success("Site key regenerated. Update the live website env.");
      }
    } catch (error) {
      console.error(error);
      message.error(
        error?.response?.data?.message || "Failed to regenerate site key"
      );
    } finally {
      setRegeneratingKey(false);
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
      <AdminTopbar title="Organizations" />

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
          <Descriptions.Item label="Site key" span={2}>
            <Space direction="vertical" size={8} style={{ width: "100%" }}>
              <Typography.Text code copyable={false} style={{ wordBreak: "break-all" }}>
                {organization?.site_key || "—"}
              </Typography.Text>
              <Space>
                <Button
                  icon={<CopyOutlined />}
                  disabled={!organization?.site_key}
                  onClick={copySiteKey}
                >
                  Copy
                </Button>
                <Popconfirm
                  title="Regenerate site key?"
                  description="The live website will stop working until you update MAVE_SITE_KEY."
                  okText="Regenerate"
                  cancelText="Cancel"
                  onConfirm={regenerateSiteKey}
                >
                  <Button
                    icon={<ReloadOutlined />}
                    loading={regeneratingKey}
                    danger
                  >
                    Regenerate
                  </Button>
                </Popconfirm>
              </Space>
            </Space>
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
