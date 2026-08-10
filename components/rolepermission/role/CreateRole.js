import { useState } from "react";
import { Form, Input, Switch, Button, message } from "antd";
import instance from "../../../axios";
import PermissionPicker from "./PermissionPicker";

export default function CreateRole({
  permissions,
  setModalVisible,
  fetchRolesPermissions,
}) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const createRole = async (values) => {
    setLoading(true);
    const { title, description, status, selectedPermissions } = values;

    try {
      const response = await instance.post("/roles", {
        title,
        description,
        status: status ? 1 : 0,
        permission_ids: selectedPermissions,
      });

      if (response.status === 201) {
        message.success("Role created successfully!");
        form.resetFields();
        fetchRolesPermissions();
        setModalVisible(false);
      } else {
        console.error(response);
        message.error("Failed to create role.");
      }
    } catch (error) {
      console.error(error);
      message.error("An error occurred while creating the role.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form
        form={form}
        name="create_role"
        layout="vertical"
        onFinish={createRole}
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

        <Form.Item
          label="Status"
          name="status"
          valuePropName="checked"
          initialValue={false}
        >
          <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
        </Form.Item>

        <Form.Item
          label="Permissions"
          name="selectedPermissions"
          initialValue={[]}
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
            Create Role
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
