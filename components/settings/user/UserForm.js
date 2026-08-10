import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, Modal, message, Progress } from "antd";
import instance from "../../../axios";
import { usePermissions } from "../../../src/hooks/usePermissions";

const { Option } = Select;

const UserForm = ({
  visible,
  fetchUsers,
  onCancel,
  initialValues,
  roles,
  currentUser,
}) => {
  const [form] = Form.useForm();
  const { hasPermission, isSuperAdmin } = usePermissions();
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const canCreateUser =
    isSuperAdmin || hasPermission("create_users") || hasPermission("admin_all");

  useEffect(() => {
    if (visible && !canCreateUser) {
      message.error("You don't have permission to create users");
      onCancel();
    }
  }, [visible, canCreateUser, onCancel]);

  useEffect(() => {
    if (visible && roles?.length) {
      const defaultRole =
        roles.find((role) => role.title === "Editor") ||
        roles.find((role) => role.title === "Viewer") ||
        roles[0];

      if (defaultRole) {
        form.setFieldsValue({ role_id: defaultRole.id });
      }
    }
  }, [visible, roles, form]);

  const handleCreateUser = async () => {
    if (!canCreateUser) {
      message.error("You don't have permission to create users");
      return;
    }

    try {
      const values = await form.validateFields();
      setLoading(true);

      const response = await instance.post("/admin/user", values);
      if (response.status === 201) {
        message.success("User created successfully");
        fetchUsers();
        onCancel();
      }
    } catch (error) {
      if (error.response?.status === 403) {
        message.error("You don't have permission to create users");
      } else {
        message.error(
          error.response?.data?.message ||
            "Something went wrong while creating the user."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const passwordGenerator = () => {
    const randomPassword = Math.random().toString(36).slice(-8);
    form.setFieldsValue({
      password: randomPassword,
      password_confirmation: randomPassword,
    });
    checkPasswordStrength(randomPassword);
  };

  const checkPasswordStrength = (password) => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }

    let strength = 0;
    if (password.length >= 6) strength += 30;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 20;
    if (/[^A-Za-z0-9]/.test(password)) strength += 30;

    setPasswordStrength(strength);
  };

  if (!visible || !canCreateUser) {
    return null;
  }

  return (
    <Modal
      open={visible}
      title="Create New User"
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel} danger>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleCreateUser}
          style={{
            backgroundColor: "var(--theme)",
            borderColor: "var(--theme)",
            color: "white",
            fontWeight: 600,
          }}
        >
          Create
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        name="userForm"
        initialValues={initialValues}
        onValuesChange={(changedValues) => {
          if (changedValues.password) {
            checkPasswordStrength(changedValues.password);
          }
        }}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please input the name!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="phone"
          label="Phone"
          rules={[{ required: true, message: "Please input the phone!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please input the email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: "Please input the password!" },
            { min: 6, message: "Password must be at least 6 characters!" },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Button
          onClick={passwordGenerator}
          style={{ marginTop: "8px", width: "fit-content" }}
        >
          Generate Password
        </Button>
        <Progress
          percent={passwordStrength}
          showInfo={false}
          strokeColor={{
            "0%": "#ff4d4f",
            "100%": "#52c41a",
          }}
          style={{ marginTop: "8px" }}
        />
        <Form.Item
          name="password_confirmation"
          label="Confirm Password"
          rules={[
            { required: true, message: "Please confirm the password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match!"));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="role_id"
          label="Role"
          rules={[{ required: true, message: "Please select the role!" }]}
        >
          <Select placeholder="Select a role">
            {roles?.map((role) => (
              <Option key={role.id} value={role.id}>
                {role.title}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserForm;
