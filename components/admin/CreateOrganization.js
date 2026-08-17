import { useState, useEffect } from "react";
import { Form, Input, Button, message, Select, Space } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
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

export default function CreateOrganization({
  setModalVisible,
  fetchOrganizations,
}) {
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
      const payload = {
        name: values.name,
        email: values.email || null,
        phone: values.phone || null,
        users: values.users,
      };

      const response = await instance.post("/organizations", payload);

      if (response.status === 201) {
        const userCount = values.users?.length || 1;
        message.success(
          `Organization created with ${userCount} user${
            userCount > 1 ? "s" : ""
          }!`
        );
        form.resetFields();
        fetchOrganizations();
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
      const firstValidationError = Object.values(
        error?.response?.data?.errors || {}
      )?.[0]?.[0];
      message.error(
        firstValidationError ||
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
      initialValues={{
        users: [{ role_title: "Admin" }],
      }}
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

      <div
        style={{
          fontWeight: 600,
          marginBottom: 12,
          marginTop: 8,
        }}
      >
        Organization Users
      </div>
      <p style={{ color: "#888", marginTop: -8, marginBottom: 12 }}>
        Add one or more users. Each user can have a different role.
      </p>

      <Form.List name="users">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => (
              <div
                key={field.key}
                style={{
                  border: "1px solid #f0f0f0",
                  borderRadius: 8,
                  padding: 16,
                  marginBottom: 12,
                  background: "#fafafa",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <strong>User {index + 1}</strong>
                  {fields.length > 1 && (
                    <Button
                      type="text"
                      danger
                      icon={<MinusCircleOutlined />}
                      onClick={() => remove(field.name)}
                    >
                      Remove
                    </Button>
                  )}
                </div>

                <Form.Item
                  {...field}
                  label="Name"
                  name={[field.name, "name"]}
                  rules={[{ required: true, message: "Please enter the name" }]}
                >
                  <Input placeholder="Jane Admin" />
                </Form.Item>

                <Form.Item
                  {...field}
                  label="Email"
                  name={[field.name, "email"]}
                  rules={[
                    { required: true, message: "Please enter the email" },
                    { type: "email", message: "Please enter a valid email" },
                    {
                      validator: (_, value) => {
                        if (!value) return Promise.resolve();
                        const users = form.getFieldValue("users") || [];
                        const matches = users.filter(
                          (user) =>
                            user?.email &&
                            user.email.toLowerCase() === value.toLowerCase()
                        );
                        if (matches.length > 1) {
                          return Promise.reject(
                            new Error("Each user must have a unique email")
                          );
                        }
                        return Promise.resolve();
                      },
                    },
                  ]}
                >
                  <Input type="email" placeholder="user@acme.com" />
                </Form.Item>

                <Form.Item
                  {...field}
                  label="Password"
                  name={[field.name, "password"]}
                  rules={[
                    { required: true, message: "Please enter a password" },
                    { min: 8, message: "Password must be at least 8 characters" },
                  ]}
                >
                  <Input.Password placeholder="Minimum 8 characters" />
                </Form.Item>

                <Form.Item
                  {...field}
                  label="Role"
                  name={[field.name, "role_title"]}
                  rules={[{ required: true, message: "Please select a role" }]}
                  extra="Default roles are created for this organization."
                >
                  <RoleSelect roleTemplates={roleTemplates} />
                </Form.Item>
              </div>
            ))}

            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add({ role_title: "Editor" })}
                block
                icon={<PlusOutlined />}
              >
                Add another user
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>

      <Form.Item>
        <Space>
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
        </Space>
      </Form.Item>
    </Form>
  );
}
