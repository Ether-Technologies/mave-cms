import {
  Table,
  Switch,
  Tooltip,
  Button,
  Modal,
  Popconfirm,
  message,
} from "antd";
import { useState } from "react";
import instance from "../../axios";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import EditRole from "../rolepermission/role/EditRole";

export default function OrgRoleTable({
  organizationId,
  roles,
  permissions,
  fetchRoles,
  loading,
}) {
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const expandPermissions = (role) => {
    setSelectedPermissions(role?.permission_mave || []);
    setViewModalVisible(true);
  };

  const openEditModal = (role) => {
    setSelectedRole(role);
    setEditModalVisible(true);
  };

  const handleDeleteRole = async (id) => {
    try {
      setIsLoading(true);
      await instance.delete(
        `/organizations/${organizationId}/roles/${id}`
      );
      fetchRoles();
      message.success("Role deleted successfully");
    } catch (error) {
      console.error(error);
      message.error(
        error?.response?.data?.message || "Failed to delete role"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "title",
      key: "title",
      width: "20%",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "50%",
      render: (description) => (
        <Tooltip title={description}>
          <span>
            {description?.length > 50
              ? description?.substring(0, 50) + "..."
              : description}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Permissions",
      key: "permissions",
      width: "20%",
      render: (record) => (
        <Button
          onClick={() => expandPermissions(record)}
          style={{
            width: "fit-content",
            backgroundColor: "var(--theme)",
            color: "white",
          }}
        >
          Show Permissions
        </Button>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: "10%",
      render: (status, record) => (
        <div
          style={{
            display: "flex",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <Switch
            checked={status === 1 || status === true}
            onChange={async (checked) => {
              try {
                await instance.put(
                  `/organizations/${organizationId}/roles/${record.id}`,
                  { status: checked ? 1 : 0 }
                );
                fetchRoles();
                message.success("Role status updated successfully");
              } catch (error) {
                console.error(error);
                message.error("Failed to update role status");
              }
            }}
          />
          <Button
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
            style={{
              backgroundColor: "transparent",
              color: "var(--theme)",
              borderColor: "var(--theme)",
            }}
          />
          <Popconfirm
            title="Are you sure to delete this role?"
            onConfirm={() => handleDeleteRole(record.id)}
            okButtonProps={{ danger: true }}
          >
            <Button
              icon={<DeleteOutlined />}
              loading={isLoading}
              style={{
                backgroundColor: "var(--theme)",
                color: "white",
                borderColor: "var(--theme)",
              }}
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const modalColumns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (description) => (
        <Tooltip title={description}>
          <span>
            {description?.length > 24
              ? description?.substring(0, 24) + "..."
              : description}
          </span>
        </Tooltip>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={roles}
        loading={loading}
        rowKey={(record) => record.id}
      />

      <Modal
        title="Permissions"
        open={viewModalVisible}
        onOk={() => setViewModalVisible(false)}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={900}
      >
        <Table
          columns={modalColumns}
          dataSource={selectedPermissions}
          rowKey={(record) => record.id}
          pagination={false}
        />
      </Modal>

      <Modal
        title="Edit Role"
        open={editModalVisible}
        footer={null}
        onCancel={() => {
          setEditModalVisible(false);
          setSelectedRole(null);
        }}
        width={960}
        destroyOnClose
      >
        <EditRole
          role={selectedRole}
          permissions={permissions}
          organizationId={organizationId}
          setModalVisible={setEditModalVisible}
          onSuccess={fetchRoles}
        />
      </Modal>
    </div>
  );
}
