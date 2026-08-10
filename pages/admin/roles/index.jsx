import { useEffect, useState } from "react";
import { Modal, Empty, Select, message } from "antd";
import instance from "../../../axios";
import AdminTopbar from "../../../components/admin/AdminTopbar";
import { ADMIN_MENU_ITEMS } from "../../../components/admin/adminMenuItems";
import OrgRoleTable from "../../../components/admin/OrgRoleTable";
import OrgCreateRole from "../../../components/admin/OrgCreateRole";
import { usePermissions } from "../../../src/hooks/usePermissions";

export default function AdminRolesPage() {
  const { canManagePlatform } = usePermissions();
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrgId, setSelectedOrgId] = useState(null);
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const canManage = canManagePlatform;

  const fetchOrganizations = async () => {
    try {
      const response = await instance.get("/organizations");
      if (response.status === 200) {
        setOrganizations(response.data);
        if (response.data.length && !selectedOrgId) {
          setSelectedOrgId(String(response.data[0].id));
        }
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to load organizations");
    }
  };

  const fetchRoles = async (organizationId) => {
    if (!organizationId) return;

    try {
      setLoading(true);
      const response = await instance.get(`/organizations/${organizationId}/roles`);
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
    if (canManage) {
      fetchOrganizations();
      fetchPermissions();
    }
  }, [canManage]);

  useEffect(() => {
    if (selectedOrgId) {
      fetchRoles(selectedOrgId);
    }
  }, [selectedOrgId]);

  if (!canManage) {
    return (
      <div className="mavecontainer">
        <Empty description="You do not have permission to manage roles." />
      </div>
    );
  }

  const selectedOrganization = organizations.find(
    (org) => String(org.id) === String(selectedOrgId)
  );

  return (
    <div className="mavecontainer">
      <AdminTopbar
        menuItems={ADMIN_MENU_ITEMS}
        active="2"
        actionLabel="Add Role"
        showAction={Boolean(selectedOrgId)}
        onAction={() => setModalVisible(true)}
      />

      <div style={{ marginTop: 24 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 24,
          }}
        >
          <span style={{ fontWeight: 500 }}>Organization:</span>
          <Select
            style={{ minWidth: 280 }}
            placeholder="Select organization"
            value={selectedOrgId}
            onChange={setSelectedOrgId}
            showSearch
            optionFilterProp="label"
            options={organizations.map((org) => ({
              value: String(org.id),
              label: org.name,
            }))}
          />
          {selectedOrganization && (
            <span style={{ color: "#888", fontSize: 14 }}>
              {selectedOrganization.slug} · {selectedOrganization.users_count ?? 0} users
            </span>
          )}
        </div>

        {selectedOrgId ? (
          <>
            <h3 style={{ marginBottom: 16, fontWeight: 500 }}>
              Roles & Permissions — {selectedOrganization?.name}
            </h3>
            <OrgRoleTable
              organizationId={selectedOrgId}
              roles={roles}
              permissions={permissions}
              fetchRoles={() => fetchRoles(selectedOrgId)}
              loading={loading}
            />
          </>
        ) : (
          <Empty description="Select an organization to manage roles." />
        )}
      </div>

      <Modal
        title={`Create Role${selectedOrganization ? ` — ${selectedOrganization.name}` : ""}`}
        open={modalVisible}
        footer={null}
        onCancel={() => setModalVisible(false)}
        width={960}
        destroyOnClose
      >
        {selectedOrgId && (
          <OrgCreateRole
            organizationId={selectedOrgId}
            permissions={permissions}
            setModalVisible={setModalVisible}
            fetchRoles={() => fetchRoles(selectedOrgId)}
          />
        )}
      </Modal>
    </div>
  );
}
