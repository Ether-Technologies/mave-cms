import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  LockOutlined,
  KeyOutlined,
  SafetyCertificateOutlined,
  CrownOutlined,
} from "@ant-design/icons";
import {
  Button,
  Input,
  Typography,
  message,
  Card,
  Modal,
  Form,
  Tag,
  Tooltip,
  Divider,
  Drawer,
} from "antd";
import { useState, useEffect } from "react";
import { useAuth } from "../../../src/context/AuthContext";
import instance from "../../../axios";
import moment from "moment/moment";

const { Text, Title } = Typography;

const UserProfile = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState({});
  const [modifyMode, setModifyMode] = useState(false);
  const [modifiedData, setModifiedData] = useState({});
  const [loading, setLoading] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      setUserData(user);
    }
  }, [user]);

  const handleInputChange = (fieldName, value) => {
    setModifiedData({
      ...modifiedData,
      [fieldName]: value,
    });
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const updatedData = { ...userData, ...modifiedData };
      const response = await instance.put(
        `/admin/user/${userData?.id}`,
        updatedData
      );
      if (response.status === 200) {
        message.success("Profile updated successfully!");
        setUserData(updatedData);
        setModifyMode(false);
        localStorage.setItem("user", JSON.stringify(updatedData));
      }
    } catch (error) {
      message.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (values) => {
    try {
      const response = await instance.put("/api/admin/password/change", {
        old_password: values.currentPassword,
        new_password: values.newPassword,
        new_password_confirmation: values.confirmPassword,
      });

      if (response.status === 200) {
        message.success("Password changed successfully!");
        setIsPasswordModalVisible(false);
        form.resetFields();
      }
    } catch (error) {
      message.error(
        error.response?.data?.message ||
          "Failed to change password. Please try again."
      );
    }
  };

  const renderField = (label, value, fieldName, icon, isEditable = true) => {
    return (
      <div className="relative w-full p-6 rounded-2xl backdrop-blur-md bg-white/30 border border-white/40 shadow-lg transition-all duration-300 hover:shadow-xl hover:bg-white/40">
        <div className="flex items-center mb-2">
          <div className="w-10 h-10 rounded-full bg-yellow-500/90 flex items-center justify-center mr-3">
            <span className="text-white text-lg">{icon}</span>
          </div>
          <Text strong className="text-gray-700">
            {label}
          </Text>
        </div>
        <div className="pl-[52px]">
          {modifyMode && isEditable ? (
            <Input
              value={modifiedData[fieldName] ?? value}
              onChange={(e) => handleInputChange(fieldName, e.target.value)}
              placeholder={`Enter your ${label.toLowerCase()}`}
              size="large"
              className="rounded-lg border-gray-200 bg-white/50 hover:border-yellow-300 focus:border-yellow-400 transition-all duration-300"
            />
          ) : (
            <div className="text-base text-gray-600 py-2">{value}</div>
          )}
        </div>
      </div>
    );
  };

  const renderStatusField = (label, value, icon, status) => {
    return (
      <div className="relative w-full p-6 rounded-2xl backdrop-blur-md bg-white/30 border border-white/40 shadow-lg transition-all duration-300 hover:shadow-xl hover:bg-white/40">
        <div className="flex items-center mb-2">
          <div className="w-10 h-10 rounded-full bg-yellow-500/90 flex items-center justify-center mr-3">
            <span className="text-white text-lg">{icon}</span>
          </div>
          <Text strong className="text-gray-700">
            {label}
          </Text>
        </div>
        <div className="pl-[52px]">
          <Tag
            color={status === "1" ? "success" : "error"}
            className="rounded-full px-4 py-1 text-sm"
          >
            {status === "1" ? "Active" : "Inactive"}
          </Tag>
        </div>
      </div>
    );
  };

  const getRoleName = (roleId) => {
    switch (roleId) {
      case "1":
        return "Super Admin";
      case "2":
        return "Admin";
      default:
        return "User";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-white p-8 animate-fadeIn">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            {renderField("Name", userData?.name, "name", <UserOutlined />)}
            {renderField(
              "Email",
              userData?.email,
              "email",
              <MailOutlined />,
              false
            )}
            {renderField("Phone", userData?.phone, "phone", <PhoneOutlined />)}
          </div>

          <div className="space-y-6">
            <div className="relative w-full p-6 rounded-2xl backdrop-blur-md bg-white/30 border border-white/40 shadow-lg transition-all duration-300 hover:shadow-xl hover:bg-white/40">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 rounded-full bg-yellow-500/90 flex items-center justify-center mr-3">
                  <span className="text-white text-lg">
                    <CrownOutlined />
                  </span>
                </div>
                <Text strong className="text-gray-700">
                  Role
                </Text>
              </div>
              <div className="pl-[52px]">
                <Tag color="warning" className="rounded-full px-4 py-1 text-sm">
                  {getRoleName(userData?.role_id)}
                </Tag>
              </div>
            </div>

            {renderStatusField(
              "License Status",
              userData?.license_key,
              <KeyOutlined />,
              userData?.is_license_active
            )}
            {renderField(
              "Last Login",
              moment(userData?.last_login).format("MMMM Do YYYY, h:mm:ss a"),
              "last_login",
              <CalendarOutlined />,
              false
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <Button
            type="default"
            onClick={() => setIsPasswordModalVisible(true)}
            icon={<LockOutlined />}
            size="large"
            className="rounded-full border-yellow-500 text-yellow-500 hover:border-yellow-600 hover:text-yellow-600 px-8 h-12 backdrop-blur-md bg-white/50"
          >
            Change Password
          </Button>
          {modifyMode ? (
            <>
              <Button
                type="primary"
                onClick={handleUpdateProfile}
                loading={loading}
                icon={<CheckOutlined />}
                size="large"
                className="rounded-full bg-yellow-500 hover:bg-yellow-600 border-yellow-500 px-8 h-12"
              >
                Save Changes
              </Button>
              <Button
                onClick={() => setModifyMode(false)}
                icon={<CloseOutlined />}
                size="large"
                className="rounded-full px-8 h-12 backdrop-blur-md bg-white/50"
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              type="primary"
              onClick={() => setModifyMode(true)}
              icon={<EditOutlined />}
              size="large"
              className="rounded-full bg-yellow-500 hover:bg-yellow-600 border-yellow-500 px-8 h-12"
            >
              Edit Profile
            </Button>
          )}
        </div>

        <Drawer
          title={
            <div className="flex items-center">
              <LockOutlined className="text-yellow-500 mr-2" />
              <span>Change Password</span>
            </div>
          }
          open={isPasswordModalVisible}
          onClose={() => {
            setIsPasswordModalVisible(false);
            form.resetFields();
          }}
          width={500}
          footer={
            <div className="flex justify-end gap-4">
              <Button
                onClick={() => {
                  setIsPasswordModalVisible(false);
                  form.resetFields();
                }}
                size="large"
                className="rounded-full px-8 h-12 backdrop-blur-md bg-white/50"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={() => form.submit()}
                size="large"
                className="rounded-full bg-yellow-500 hover:bg-yellow-600 border-yellow-500 px-8 h-12"
              >
                Confirm Change
              </Button>
            </div>
          }
          className="rounded-2xl"
          bodyStyle={{
            background: "linear-gradient(to bottom right, #fefce8, #ffffff)",
          }}
        >
          <Form
            form={form}
            onFinish={handlePasswordChange}
            layout="vertical"
            className="space-y-6"
          >
            <Form.Item
              name="currentPassword"
              label="Current Password"
              rules={[
                {
                  required: true,
                  message: "Please enter your current password",
                },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password
                size="large"
                placeholder="Enter your current password"
                className="rounded-lg border-gray-200 bg-white/50 hover:border-yellow-300 focus:border-yellow-400"
              />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="New Password"
              rules={[
                { required: true, message: "Please enter your new password" },
                { min: 6, message: "Password must be at least 6 characters" },
              ]}
            >
              <Input.Password
                size="large"
                placeholder="Enter your new password"
                className="rounded-lg border-gray-200 bg-white/50 hover:border-yellow-300 focus:border-yellow-400"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              label="Confirm New Password"
              dependencies={["newPassword"]}
              rules={[
                { required: true, message: "Please confirm your new password" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The two passwords do not match")
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                size="large"
                placeholder="Confirm your new password"
                className="rounded-lg border-gray-200 bg-white/50 hover:border-yellow-300 focus:border-yellow-400"
              />
            </Form.Item>
          </Form>
        </Drawer>
      </div>
    </div>
  );
};

export default UserProfile;
