import { useEffect, useState } from "react";
import { Form, Input, Button, message, Select, Space, Spin } from "antd";
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
          const users = (data.users || []).map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            password: "",
            role_title: user.role_mave?.title || "Admin",
          }));

          form.setFieldsValue({
            name: data.name,
            email: data.email || "",
            phone: data.phone || "",
            users: users.length ? users : [{ role_title: "Admin" }],
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
        users: (values.users || []).map((user) => {
          const nextUser = {
            name: user.name,
            email: user.email,
            role_title: user.role_title,
          };

          if (user.id) {
            nextUser.id = user.id;
          }

          if (user.password) {
            nextUser.password = user.password;
          }

          return nextUser;
        }),
      };

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
      const firstValidationError = Object.values(
        error?.response?.data?.errors || {}
      )?.[0]?.[0];
      message.error(
        firstValidationError ||
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
        Add or update users. Each user can have a different role. Leave password
        blank to keep the current one.
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

                <Form.Item {...field} name={[field.name, "id"]} hidden>
                  <Input />
                </Form.Item>

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
                  shouldUpdate={(prev, next) =>
                    prev.users?.[field.name]?.id !== next.users?.[field.name]?.id
                  }
                  noStyle
                >
                  {() => {
                    const userId = form.getFieldValue(["users", field.name, "id"]);

                    return (
                      <Form.Item
                        {...field}
                        label="Password"
                        name={[field.name, "password"]}
                        extra={
                          userId
                            ? "Leave blank to keep the current password."
                            : undefined
                        }
                        rules={[
                          {
                            validator(_, value) {
                              if (!userId && !value) {
                                return Promise.reject(
                                  new Error("Please enter a password")
                                );
                              }
                              if (value && value.length < 8) {
                                return Promise.reject(
                                  new Error(
                                    "Password must be at least 8 characters"
                                  )
                                );
                              }
                              return Promise.resolve();
                            },
                          },
                        ]}
                      >
                        <Input.Password
                          placeholder={
                            userId
                              ? "Minimum 8 characters (optional)"
                              : "Minimum 8 characters"
                          }
                        />
                      </Form.Item>
                    );
                  }}
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
            Save Changes
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
