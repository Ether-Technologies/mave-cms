import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Upload, Select, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import instance from "../../../axios";
import { usePermissions } from "../../../src/hooks/usePermissions";

const { Option } = Select;

const UserEditModal = ({
  visible,
  user,
  onCancel,
  fetchUsers,
  roles,
  currentUser,
}) => {
  const [form] = Form.useForm();
  const { hasPermission, isSuperAdmin } = usePermissions();
  const [avatar, setAvatar] = useState(user?.profile_picture);
  const [loading, setLoading] = useState(false);

  const canManageUsers =
    isSuperAdmin || hasPermission("edit_users") || hasPermission("admin_all");
  const isEditingSelf = currentUser?.id === user?.id;
  const canEdit = canManageUsers || isEditingSelf;

  useEffect(() => {
    if (!canEdit) {
      message.error("You don't have permission to edit this user");
      onCancel();
      return;
    }

    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role_id: user.role_id ? parseInt(user.role_id, 10) : undefined,
      });
      setAvatar(user.profile_picture);
    }
  }, [user, form, canEdit, onCancel]);

  const handleUploadChange = (info) => {
    if (info.file.status === "done") {
      setAvatar(info.file.response.url);
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const handleUpdateUser = async (values) => {
    try {
      setLoading(true);

      if (values.role_id !== user.role_id && isEditingSelf) {
        message.error("You cannot change your own role");
        return;
      }

      await instance.put(`/admin/user/${user.id}`, {
        ...values,
        profile_picture: avatar,
      });
      message.success("User updated successfully");
      fetchUsers();
      onCancel();
    } catch (error) {
      message.error(error.response?.data?.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  if (!canEdit) {
    return null;
  }

  return (
    <Modal
      title={isEditingSelf ? "Edit Your Profile" : "Edit User"}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel} danger>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          style={{
            backgroundColor: "var(--theme)",
            borderColor: "var(--theme)",
            fontWeight: 600,
          }}
          onClick={() => form.submit()}
        >
          Update
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleUpdateUser}>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter the name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter the email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="phone" label="Phone">
          <Input />
        </Form.Item>
        <Form.Item name="role_id" label="Role">
          <Select
            disabled={isEditingSelf || !canManageUsers}
            placeholder="Select a role"
          >
            {roles?.map((role) => (
              <Option key={role.id} value={role.id}>
                {role.title}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Avatar">
          <Upload
            name="avatar"
            action="/upload"
            onChange={handleUploadChange}
            listType="picture"
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserEditModal;
