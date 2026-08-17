import { useEffect, useState } from "react";
import { Form, Input, Button, message, Select, Spin } from "antd";
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

export default function EditOrganization({
  organization,
  setModalVisible,
  fetchOrganizations,
}) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
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

  useEffect(() => {
    const loadOrganization = async () => {
      if (!organization?.id) {
        return;
      }

      try {
        setFetching(true);
        const response = await instance.get(`/organizations/${organization.id}`);

        if (response.status === 200) {
          const data = response.data;
          const adminUser = data.admin_user;

          form.setFieldsValue({
            name: data.name,
            email: data.email || "",
            phone: data.phone || "",
            admin_name: adminUser?.name || "",
            admin_email: adminUser?.email || "",
            admin_password: "",
            admin_role_title: adminUser?.role_mave?.title || "Admin",
          });
        }
      } catch (error) {
        console.error(error);
        message.error("Failed to load organization details");
      } finally {
        setFetching(false);
      }
    };

    loadOrganization();
  }, [organization, form]);

  const updateOrganization = async (values) => {
    if (!organization?.id) return;

    setLoading(true);

    try {
      const payload = {
        name: values.name,
        email: values.email || null,
        phone: values.phone || null,
        admin_name: values.admin_name,
        admin_email: values.admin_email,
        admin_role_title: values.admin_role_title,
      };

      if (values.admin_password) {
        payload.admin_password = values.admin_password;
      }

      const response = await instance.put(
        `/organizations/${organization.id}`,
        payload
      );

      if (response.status === 200) {
        message.success("Organization updated successfully!");
        fetchOrganizations();
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
      message.error(
        error?.response?.data?.message ||
          "An error occurred while updating the organization."
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div style={{ textAlign: "center", padding: 32 }}>
        <Spin />
      </div>
    );
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={updateOrganization}
      autoComplete="off"
    >
      <Form.Item label="Slug">
        <span style={{ color: "#666" }}>{organization?.slug}</span>
      </Form.Item>

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

      <p style={{ color: "#888", marginBottom: 16 }}>
        To add more users or change other user roles, open this organization and
        use the Users section.
      </p>

      <Form.Item
        label="Primary User Name"
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
        label="Assign Role to Admin"
        name="admin_role_title"
        rules={[{ required: true, message: "Please select a role" }]}
        extra="Update the primary admin user's role for this organization."
      >
        <Select placeholder="Select role for admin user" optionLabelProp="label">
          {roleTemplates.map((role) => (
            <Select.Option key={role.title} value={role.title} label={role.title}>
              <div style={{ padding: "4px 0" }}>
                <div style={{ fontWeight: 600, lineHeight: 1.4 }}>{role.title}</div>
                {role.description && (
                  <div style={{ fontSize: 12, color: "#888", lineHeight: 1.4, marginTop: 2 }}>
                    {role.description}
                  </div>
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
          Save Changes
        </Button>
      </Form.Item>
    </Form>
  );
}
