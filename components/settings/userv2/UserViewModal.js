import React from "react";
import { Modal, Table, Button, Avatar } from "antd";
import moment from "moment";

const UserViewModal = ({ visible, user, onCancel, onEdit }) => {
  const getRoleName = () => {
    if (user?.is_super_admin) {
      return "Platform Super Admin";
    }

    return user?.role_mave?.title || "No Role Assigned";
  };

  const columns = [
    { title: "Field", dataIndex: "field", key: "field", width: "30%" },
    { title: "Value", dataIndex: "value", key: "value", width: "70%" },
  ];

  const dataSource = [
    {
      key: "avatar",
      field: "Avatar",
      value: user?.profile_picture ? (
        <Avatar src={user.profile_picture} size={64} />
      ) : (
        <Avatar size={64}>{user?.name?.charAt(0)?.toUpperCase()}</Avatar>
      ),
    },
    { key: "name", field: "Name", value: user?.name || "N/A" },
    { key: "email", field: "Email", value: user?.email || "N/A" },
    { key: "phone", field: "Phone", value: user?.phone || "N/A" },
    { key: "role", field: "Role", value: getRoleName() },
    {
      key: "created",
      field: "Created At",
      value: user?.created_at
        ? moment(user.created_at).format("YYYY-MM-DD HH:mm:ss")
        : "N/A",
    },
    {
      key: "updated",
      field: "Last Updated",
      value: user?.updated_at
        ? moment(user.updated_at).format("YYYY-MM-DD HH:mm:ss")
        : "N/A",
    },
  ];

  return (
    <Modal
      title="User Details"
      open={visible}
      onCancel={onCancel}
      width={600}
      footer={[
        <Button key="close" onClick={onCancel} danger>
          Close
        </Button>,
        <Button
          key="edit"
          type="primary"
          onClick={onEdit}
          style={{
            backgroundColor: "var(--theme)",
            borderColor: "var(--theme)",
          }}
          disabled={user?.role_id === "2"}
        >
          Edit User
        </Button>,
      ]}
    >
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={false}
        showHeader={false}
        bordered
      />
    </Modal>
  );
};

export default UserViewModal;
