import { useEffect, useState } from "react";
import { Modal, message, Empty } from "antd";
import instance from "../../../axios";
import AdminTopbar from "../../../components/admin/AdminTopbar";
import { ADMIN_MENU_ITEMS } from "../../../components/admin/adminMenuItems";
import OrganizationTable from "../../../components/admin/OrganizationTable";
import CreateOrganization from "../../../components/admin/CreateOrganization";
import EditOrganization from "../../../components/admin/EditOrganization";
import { usePermissions } from "../../../src/hooks/usePermissions";

export default function OrganizationsPage() {
  const { canManagePlatform } = usePermissions();
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState(null);

  const canManage = canManagePlatform;

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const response = await instance.get("/organizations");
      if (response.status === 200) {
        setOrganizations(response.data);
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to load organizations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (canManage) {
      fetchOrganizations();
    }
  }, [canManage]);

  const handleEditOrganization = (organization) => {
    setSelectedOrganization(organization);
    setEditModalVisible(true);
  };

  if (!canManage) {
    return (
      <div className="mavecontainer">
        <Empty description="You do not have permission to manage organizations." />
      </div>
    );
  }

  return (
    <div className="mavecontainer">
      <AdminTopbar
        menuItems={ADMIN_MENU_ITEMS}
        active="1"
        actionLabel="Create Organization"
        showAction
        onAction={() => setModalVisible(true)}
      />

      <div style={{ marginTop: 24 }}>
        <OrganizationTable
          organizations={organizations}
          fetchOrganizations={fetchOrganizations}
          loading={loading}
          onEdit={handleEditOrganization}
        />
      </div>

      <Modal
        title="Create Organization"
        open={modalVisible}
        footer={null}
        onCancel={() => setModalVisible(false)}
        width={560}
        destroyOnClose
      >
        <CreateOrganization
          setModalVisible={setModalVisible}
          fetchOrganizations={fetchOrganizations}
        />
      </Modal>

      <Modal
        title="Edit Organization"
        open={editModalVisible}
        footer={null}
        onCancel={() => {
          setEditModalVisible(false);
          setSelectedOrganization(null);
        }}
        width={560}
        destroyOnClose
      >
        <EditOrganization
          organization={selectedOrganization}
          setModalVisible={setEditModalVisible}
          fetchOrganizations={fetchOrganizations}
        />
      </Modal>
    </div>
  );
}
