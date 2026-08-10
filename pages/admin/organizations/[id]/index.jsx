import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button, Modal, Empty, Tag, Spin, message } from "antd";
import {
  ArrowLeftOutlined,
  PlusCircleOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import instance from "../../../../axios";
import AdminTopbar from "../../../../components/admin/AdminTopbar";
import { ADMIN_MENU_ITEMS } from "../../../../components/admin/adminMenuItems";
import OrgRoleTable from "../../../../components/admin/OrgRoleTable";
import OrgCreateRole from "../../../../components/admin/OrgCreateRole";
import { usePermissions } from "../../../../src/hooks/usePermissions";

export default function OrganizationDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { canManagePlatform } = usePermissions();

  const [organization, setOrganization] = useState(null);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const canManage = canManagePlatform;

  const fetchOrganization = async () => {
    if (!id) return;

    try {
      const response = await instance.get(`/organizations/${id}`);
      if (response.status === 200) {
        setOrganization(response.data);
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to load organization");
    }
  };

  const fetchRoles = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await instance.get(`/organizations/${id}/roles`);
      if (response.status === 200) {
        setRoles(response.data);
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to load roles");
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await instance.get("/permissions");
      if (response.status === 200) {
        setPermissions(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (canManage && id) {
      fetchOrganization();
      fetchRoles();
      fetchPermissions();
    }
  }, [canManage, id]);

  if (!canManage) {
    return (
      <div className="mavecontainer">
        <Empty description="You do not have permission to manage organizations." />
      </div>
    );
  }

  if (!id) {
    return (
      <div className="mavecontainer" style={{ textAlign: "center", padding: 48 }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="mavecontainer">
      <AdminTopbar menuItems={ADMIN_MENU_ITEMS} active="1" />

      <div style={{ marginTop: 24 }}>
        <Link href="/admin/organizations">
          <Button icon={<ArrowLeftOutlined />} style={{ marginBottom: 16 }}>
            Back to Organizations
          </Button>
        </Link>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 600 }}>
              {organization?.name || "Organization"}
            </h2>
            <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
              {organization?.slug && <Tag>{organization.slug}</Tag>}
              <Tag icon={<TeamOutlined />} color="blue">
                {organization?.users_count ?? 0} users
              </Tag>
              <Tag color={organization?.is_active ? "green" : "red"}>
                {organization?.is_active ? "Active" : "Inactive"}
              </Tag>
            </div>
          </div>

          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => setModalVisible(true)}
            style={{
              backgroundColor: "var(--maveyellow)",
              color: "white",
            }}
          >
            Add Role
          </Button>
        </div>

        <h3 style={{ marginBottom: 16, fontWeight: 500 }}>Roles & Permissions</h3>
        <OrgRoleTable
          organizationId={id}
          roles={roles}
          permissions={permissions}
          fetchRoles={fetchRoles}
          loading={loading}
        />
      </div>

      <Modal
        title="Create Role"
        open={modalVisible}
        footer={null}
        onCancel={() => setModalVisible(false)}
        width={700}
        destroyOnClose
      >
        <OrgCreateRole
          organizationId={id}
          permissions={permissions}
          setModalVisible={setModalVisible}
          fetchRoles={fetchRoles}
        />
      </Modal>
    </div>
  );
}
