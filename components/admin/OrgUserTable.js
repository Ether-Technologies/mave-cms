import { useState } from "react";
import { Table, Button, Tag, Popconfirm, Modal, Form, Input, Select, message } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import instance from "../../axios";

const DEFAULT_ROLES = [
  {
    title: "Super Admin",
    description: "Full access to all CMS features and settings",
  },
  {
    title: "Admin",
    description: "Manage content, users, and roles",
  },
  {
    title: "Editor",
    description: "Create and edit content only",
  },
  {
    title: "Viewer",
    description: "Read-only access",
  },
];

function RoleSelect({ roleTemplates, ...props }) {
  return (
    <Select placeholder="Select role" optionLabelProp="label" {...props}>
      {roleTemplates.map((role) => (
        <Select.Option key={role.title} value={role.title} label={role.title}>
          <div style={{ padding: "4px 0" }}>
            <div style={{ fontWeight: 600, lineHeight: 1.4 }}>{role.title}</div>
            {role.description && (
              <div
                style={{
                  fontSize: 12,
                  color: "#888",
                  lineHeight: 1.4,
                  marginTop: 2,
                }}
              >
                {role.description}
              </div>
            )}
          </div>
        </Select.Option>
      ))}
    </Select>
  );
}

export default function OrgUserTable({
  organizationId,
  users,
  fetchUsers,
  loading,
  roleTemplates = DEFAULT_ROLES,
}) {
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [createVisible, setCreateVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [saving, setSaving] = useState(false);

  const openEdit = (user) => {
    setSelectedUser(user);
    editForm.setFieldsValue({
      name: user.name,
      email: user.email,
      password: "",
      role_title: user.role_mave?.title || "Admin",
    });
    setEditVisible(true);
  };

  const handleCreate = async (values) => {
    setSaving(true);
    try {
      await instance.post(`/organizations/${organizationId}/users`, values);
      message.success("User added to organization");
      createForm.resetFields();
      setCreateVisible(false);
      fetchUsers();
    } catch (error) {
      const firstValidationError = Object.values(
        error?.response?.data?.errors || {}
      )?.[0]?.[0];
      message.error(
        firstValidationError ||
          error?.response?.data?.message ||
          "Failed to add user"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (values) => {
    if (!selectedUser?.id) return;

    setSaving(true);
    try {
      const payload = {
        name: values.name,
        email: values.email,
        role_title: values.role_title,
      };

      if (values.password) {
        payload.password = values.password;
      }

      await instance.put(
        `/organizations/${organizationId}/users/${selectedUser.id}`,
        payload
      );
      message.success("User updated");
      setEditVisible(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      const firstValidationError = Object.values(
        error?.response?.data?.errors || {}
      )?.[0]?.[0];
      message.error(
        firstValidationError ||
          error?.response?.data?.message ||
          "Failed to update user"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await instance.delete(`/organizations/${organizationId}/users/${id}`);
      message.success("User deleted");
      fetchUsers();
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Failed to delete user"
      );
    }
  };

  const columns = [
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
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <Button
            icon={<EditOutlined />}
            onClick={() => openEdit(record)}
            style={{
              backgroundColor: "transparent",
              color: "var(--theme)",
              borderColor: "var(--theme)",
            }}
          />
          <Popconfirm
            title="Delete this user?"
            description="They will no longer be able to sign in to this organization."
            onConfirm={() => handleDelete(record.id)}
            okButtonProps={{ danger: true }}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 12,
        }}
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCreateVisible(true)}
          style={{
            backgroundColor: "var(--maveyellow)",
            color: "white",
          }}
        >
          Add User
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey={(record) => record.id}
        pagination={false}
      />

      <Modal
        title="Add User"
        open={createVisible}
        footer={null}
        onCancel={() => {
          setCreateVisible(false);
          createForm.resetFields();
        }}
        destroyOnClose
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreate}
          initialValues={{ role_title: "Editor" }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter the name" }]}
          >
            <Input placeholder="Jane Editor" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter the email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input type="email" placeholder="editor@acme.com" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please enter a password" },
              { min: 8, message: "Password must be at least 8 characters" },
            ]}
          >
            <Input.Password placeholder="Minimum 8 characters" />
          </Form.Item>
          <Form.Item
            label="Role"
            name="role_title"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <RoleSelect roleTemplates={roleTemplates} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={saving}
              style={{
                backgroundColor: "var(--maveyellow)",
                color: "white",
              }}
            >
              Add User
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Edit User"
        open={editVisible}
        footer={null}
        onCancel={() => {
          setEditVisible(false);
          setSelectedUser(null);
        }}
        destroyOnClose
      >
        <Form form={editForm} layout="vertical" onFinish={handleUpdate}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter the name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter the email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input type="email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            extra="Leave blank to keep the current password."
            rules={[
              {
                validator(_, value) {
                  if (!value || value.length >= 8) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Password must be at least 8 characters")
                  );
                },
              },
            ]}
          >
            <Input.Password placeholder="Minimum 8 characters (optional)" />
          </Form.Item>
          <Form.Item
            label="Role"
            name="role_title"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <RoleSelect roleTemplates={roleTemplates} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={saving}
              style={{
                backgroundColor: "var(--maveyellow)",
                color: "white",
              }}
            >
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
