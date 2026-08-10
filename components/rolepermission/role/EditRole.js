import { useEffect, useState } from "react";
import { Form, Input, Switch, Button, message } from "antd";
import instance from "../../../axios";
import PermissionPicker from "./PermissionPicker";

export default function EditRole({
  role,
  permissions,
  organizationId,
  setModalVisible,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!role) {
      return;
    }

    form.setFieldsValue({
      title: role.title,
      description: role.description,
      status: role.status === 1 || role.status === true,
      selectedPermissions: (role.permission_mave || []).map(
        (permission) => permission.id
      ),
    });
  }, [role, form]);

  const updateRole = async (values) => {
    if (!role?.id) {
      return;
    }

    setLoading(true);
    const { title, description, status, selectedPermissions } = values;

    const payload = {
      title,
      description,
      status: status ? 1 : 0,
      permission_ids: selectedPermissions,
    };

    const url = organizationId
      ? `/organizations/${organizationId}/roles/${role.id}`
      : `/roles/${role.id}`;

    try {
      const response = await instance.put(url, payload);

      if (response.status === 200) {
        message.success("Role updated successfully!");
        onSuccess?.();
        setModalVisible(false);
      } else {
        message.error("Failed to update role.");
      }
    } catch (error) {
      console.error(error);
      message.error(
        error?.response?.data?.message ||
          "An error occurred while updating the role."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      name="edit_role"
      layout="vertical"
      onFinish={updateRole}
      autoComplete="off"
    >
      <Form.Item
        label="Title"
        name="title"
        rules={[{ required: true, message: "Please input the role title!" }]}
      >
        <Input allowClear placeholder="Enter role title" />
      </Form.Item>

      <Form.Item
        label="Description"
        name="description"
        rules={[
          { required: true, message: "Please input the role description!" },
        ]}
      >
        <Input.TextArea allowClear placeholder="Enter role description" />
      </Form.Item>

      <Form.Item label="Status" name="status" valuePropName="checked">
        <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
      </Form.Item>

      <Form.Item
        label="Permissions"
        name="selectedPermissions"
        rules={[
          {
            validator: (_, value) =>
              value?.length
                ? Promise.resolve()
                : Promise.reject(
                    new Error("Please select at least one permission!")
                  ),
          },
        ]}
      >
        <PermissionPicker permissions={permissions} />
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
          Update Role
        </Button>
      </Form.Item>
    </Form>
  );
}
