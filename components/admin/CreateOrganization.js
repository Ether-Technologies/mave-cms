import { useState, useEffect } from "react";
import { Form, Input, Button, message, Select } from "antd";
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

export default function CreateOrganization({ setModalVisible, fetchOrganizations }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [roleTemplates, setRoleTemplates] = useState(DEFAULT_ROLES);

  useEffect(() => {
    instance
      .get("/organizations/role-templates")
      .then((response) => {
        if (response.data?.length) {
          setRoleTemplates(response.data);
        }
      })
      .catch(() => {
        setRoleTemplates(DEFAULT_ROLES);
      });
  }, []);

  const createOrganization = async (values) => {
    setLoading(true);

    try {
      const response = await instance.post("/organizations", values);

      if (response.status === 201) {
        const assignedRole = values.admin_role_title || "Admin";
        message.success(`Organization created with ${assignedRole} role assigned!`);
        form.resetFields();
        fetchOrganizations();
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
      message.error(
        error?.response?.data?.message ||
          "An error occurred while creating the organization."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={createOrganization}
      autoComplete="off"
      initialValues={{ admin_role_title: "Admin" }}
    >
      <Form.Item
        label="Organization Name"
        name="name"
        rules={[{ required: true, message: "Please enter the organization name" }]}
      >
        <Input placeholder="Acme Corp" />
      </Form.Item>

      <Form.Item label="Organization Email" name="email">
        <Input type="email" placeholder="contact@acme.com" />
      </Form.Item>

      <Form.Item label="Phone" name="phone">
        <Input placeholder="+1 555 0100" />
      </Form.Item>

      <Form.Item
        label="Admin Name"
        name="admin_name"
        rules={[{ required: true, message: "Please enter the admin name" }]}
      >
        <Input placeholder="Jane Admin" />
      </Form.Item>

      <Form.Item
        label="Admin Email"
        name="admin_email"
        rules={[
          { required: true, message: "Please enter the admin email" },
          { type: "email", message: "Please enter a valid email" },
        ]}
      >
        <Input type="email" placeholder="admin@acme.com" />
      </Form.Item>

      <Form.Item
        label="Admin Password"
        name="admin_password"
        rules={[
          { required: true, message: "Please enter a password" },
          { min: 8, message: "Password must be at least 8 characters" },
        ]}
      >
        <Input.Password placeholder="Minimum 8 characters" />
      </Form.Item>

      <Form.Item
        label="Assign Role to Admin"
        name="admin_role_title"
        rules={[{ required: true, message: "Please select a role" }]}
        extra="Default roles are created for the organization and the selected role is assigned to the admin user."
      >
        <Select placeholder="Select role for admin user">
          {roleTemplates.map((role) => (
            <Select.Option key={role.title} value={role.title}>
              <div>
                <strong>{role.title}</strong>
                {role.description && (
                  <div style={{ fontSize: 12, color: "#888" }}>{role.description}</div>
                )}
              </div>
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          style={{
            backgroundColor: "var(--maveyellow)",
            color: "white",
          }}
        >
          Create Organization
        </Button>
      </Form.Item>
    </Form>
  );
}
