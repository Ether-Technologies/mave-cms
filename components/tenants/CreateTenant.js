import { useState } from "react";
import { Form, Input, Button, message, Divider, Collapse, Checkbox } from "antd";

const getApiHost = () => {
  // Production: use NEXT_PUBLIC_API_HOST directly
  if (process.env.NEXT_PUBLIC_API_HOST) {
    return process.env.NEXT_PUBLIC_API_HOST;
  }
  // Local fallback: extract host from base URL
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  return base.split("/").slice(0, 3).join("/");
};

const getTenantRegisterUrl = () => {
  return `${process.env.NEXT_PUBLIC_API_BASE_URL}/tenants/register`;
};

export default function CreateTenant({ onSuccess }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const apiHost = getApiHost();

      const tenantPayload = {
        name: values.name,
        slug: values.slug,
        create_database: values.create_database !== false,
      };

      if (values.db_name) {
        tenantPayload.db_name = values.db_name;
        tenantPayload.create_database = false;
      }
      if (values.db_host) tenantPayload.db_host = values.db_host;
      if (values.db_port) tenantPayload.db_port = values.db_port;
      if (values.db_username) tenantPayload.db_username = values.db_username;
      if (values.db_password) tenantPayload.db_password = values.db_password;

      // Step 1: Create tenant + DB + migrate
      const tenantRes = await fetch(getTenantRegisterUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tenantPayload),
      });
      const tenantData = await tenantRes.json();
      if (!tenantRes.ok) {
        const firstError = tenantData?.errors
          ? Object.values(tenantData.errors).flat()[0]
          : tenantData?.message || "Failed to create tenant";
        message.error(firstError);
        return;
      }

      // Step 2: Create admin user in the new tenant DB
      const userRes = await fetch(
        `${apiHost}/${values.slug}/api/admin/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: values.admin_name,
            email: values.admin_email,
            password: values.admin_password,
            password_confirmation: values.admin_password,
          }),
        }
      );
      const userData = await userRes.json();
      if (!userRes.ok) {
        const firstError = userData?.errors
          ? Object.values(userData.errors).flat()[0]
          : userData?.message || "Failed to create admin user";
        message.error(`Tenant created but user failed: ${firstError}`);
        return;
      }

      message.success("Tenant and admin user created successfully!");
      form.resetFields();
      onSuccess?.();
    } catch {
      message.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit} autoComplete="off">

      <Divider orientation="left">Tenant Info</Divider>

      <Form.Item
        label="Tenant Name"
        name="name"
        rules={[{ required: true, message: "Please enter the tenant name" }]}
      >
        <Input placeholder="e.g. XYZ Company" allowClear />
      </Form.Item>

      <Form.Item
        label="Slug"
        name="slug"
        rules={[
          { required: true, message: "Please enter the slug" },
          { pattern: /^[a-z0-9_]+$/, message: "Lowercase letters, numbers and underscore only" },
        ]}
      >
        <Input placeholder="e.g. xyz_company" allowClear />
      </Form.Item>

      <Collapse
        ghost
        items={[
          {
            key: "db",
            label: "Database settings (cPanel / shared hosting)",
            children: (
              <>
                <Form.Item
                  name="create_database"
                  valuePropName="checked"
                  initialValue={true}
                >
                  <Checkbox>Auto-create database (local only — disable on cPanel)</Checkbox>
                </Form.Item>
                <Form.Item label="Database Name" name="db_name">
                  <Input placeholder="e.g. cpuser_mave_xyz_company" allowClear />
                </Form.Item>
                <Form.Item label="DB Host" name="db_host">
                  <Input placeholder="localhost" allowClear />
                </Form.Item>
                <Form.Item label="DB Port" name="db_port">
                  <Input placeholder="3306" allowClear />
                </Form.Item>
                <Form.Item label="DB Username" name="db_username">
                  <Input placeholder="cPanel MySQL username" allowClear />
                </Form.Item>
                <Form.Item label="DB Password" name="db_password">
                  <Input.Password placeholder="MySQL password" />
                </Form.Item>
              </>
            ),
          },
        ]}
      />

      <Divider orientation="left">Admin User</Divider>

      <Form.Item
        label="Admin Name"
        name="admin_name"
        rules={[{ required: true, message: "Please enter admin name" }]}
      >
        <Input placeholder="e.g. John Doe" allowClear />
      </Form.Item>

      <Form.Item
        label="Admin Email"
        name="admin_email"
        rules={[
          { required: true, message: "Please enter admin email" },
          { type: "email", message: "Please enter a valid email" },
        ]}
      >
        <Input placeholder="e.g. admin@xyzcompany.com" allowClear />
      </Form.Item>

      <Form.Item
        label="Admin Password"
        name="admin_password"
        rules={[
          { required: true, message: "Please enter a password" },
          { min: 8, message: "Password must be at least 8 characters" },
        ]}
      >
        <Input.Password placeholder="Min 8 characters" />
      </Form.Item>

      <Form.Item style={{ marginBottom: 0, textAlign: "right" }}>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          style={{ backgroundColor: "var(--theme)", borderColor: "var(--theme)" }}
        >
          Create Tenant & Admin
        </Button>
      </Form.Item>
    </Form>
  );
}
