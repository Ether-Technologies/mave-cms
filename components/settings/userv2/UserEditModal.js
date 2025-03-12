import React, { useState, useEffect } from "react";
import { Modal, Form, Input, Button, Upload, Select, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import instance from "../../../axios";

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
  const [avatar, setAvatar] = useState(user?.profile_picture);
  const [loading, setLoading] = useState(false);

  // Check permissions
  const isAdmin = currentUser?.role_id === "1";
  const isEditingSelf = currentUser?.id === user?.id;
  const isEditingAdmin = user?.role_id === "1";

  // Determine if the current user can edit this user
  const canEdit = isAdmin || isEditingSelf; // Admin can edit anyone, users can edit themselves

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
        role_id: user.role_id ? parseInt(user.role_id) : undefined,
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

      // Only check role change permissions if the role is being changed
      if (values.role_id !== user.role_id) {
        // Prevent changing role to admin
        if (values.role_id === 1 || values.role_id === "1") {
          message.error("You don't have permission to create admin users");
          return;
        }

        // Prevent admin from changing their own role
        if (isEditingSelf) {
          message.error("You cannot change your own role");
          return;
        }
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

  // If user doesn't have permission, don't render the form
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
            disabled={isEditingSelf || isEditingAdmin}
            allowClear={!isEditingSelf}
          >
            <Option value="2">User</Option>
            {isEditingAdmin && <Option value="1">Admin</Option>}
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
