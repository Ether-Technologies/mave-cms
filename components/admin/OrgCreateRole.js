import { useState } from "react";
import { Form, Input, Switch, Button, message, Select } from "antd";
import instance from "../../axios";

export default function OrgCreateRole({
  organizationId,
  permissions,
  setModalVisible,
  fetchRoles,
}) {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const createRole = async (values) => {
    setLoading(true);
    const { title, description, status, selectedPermissions } = values;

    try {
      const response = await instance.post(
        `/organizations/${organizationId}/roles`,
        {
          title,
          description,
          status: status ? 1 : 0,
          permission_ids: selectedPermissions,
        }
      );

      if (response.status === 201) {
        message.success("Role created successfully!");
        form.resetFields();
        fetchRoles();
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
      message.error("An error occurred while creating the role.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      name="create_org_role"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
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
        initialValue
      >
        <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
      </Form.Item>

      <Form.Item
        label="Permissions"
        name="selectedPermissions"
        rules={[{ required: true, message: "Please select permissions!" }]}
      >
        <Select
          mode="multiple"
          placeholder="Select permissions"
          style={{ width: "100%" }}
          allowClear
          showSearch
          optionFilterProp="children"
        >
          {permissions?.map((permission) => (
            <Select.Option key={permission.id} value={permission.id}>
              {permission.title}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
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
  );
}
