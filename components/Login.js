import React, { useState } from "react";
import { Button, Divider, Input, Modal, Space, message } from "antd";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { useAuth } from "../src/context/AuthContext"; // Updated import
import Loader from "./Loader";

const Login = ({ open, setOpen }) => {
  // Check if demo mode is enabled
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO === 'true';
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading } = useAuth(); // Using auth hook

  const handleLogin = () => {
    if (!email || !password) {
      message.error("Please fill in all fields");
      return;
    }
    login(email, password);
    setOpen(false);
  };

  const handleDemoLogin = () => {
    login("demouser@mave.com", "Demo@Mave2025");
    setOpen(false);
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  if (loading) return <Loader />;

  return (
    <Modal
      open={open}
      onCancel={() => setOpen(false)}
      width={600}
      cancelButtonProps={{ style: { display: "none" } }}
      okButtonProps={{ style: { display: "none" } }}
    >
      <div className="modalContainer">
        <h1>Login</h1>
        {!isDemoMode && (
          <>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="input-field"
            />
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="input-field"
              suffix={
                showPassword ? (
                  <EyeOutlined onClick={togglePasswordVisibility} />
                ) : (
                  <EyeInvisibleOutlined onClick={togglePasswordVisibility} />
                )
              }
            />
          </>
        )}
        <Space
          direction="vertical"
          style={{ width: "100%", marginTop: "1rem" }}
        >
          <Button type="primary" block onClick={isDemoMode ? handleDemoLogin : handleLogin}>
            {isDemoMode ? "Get In" : "Login"}
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default Login;
