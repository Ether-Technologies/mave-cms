import React from "react";
import { Button, Layout, Menu, Tabs } from "antd";
import {
  HomeOutlined,
  PlusCircleOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import Link from "next/link";
import RolePermission from "../../components/rolepermission/RolePermission";

const { Content } = Layout;

const UserManagementPage = () => {
  return (
    <div className="mavecontainer">
      <Layout
        style={{
          padding: "0 24px 24px",
          marginBottom: "2rem",
          backgroundColor: "transparent",
        }}
      >
        {/* Users, Registration, Access Control, Role Permission */}
        <Content
          style={{
            margin: 0,
            minHeight: 280,
            backgroundColor: "#fff",
          }}
        >
          <div
            className="top-nav"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 4fr 1fr",
              alignItems: "center",
              borderBottom: "1px solid #f0f0f0",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginLeft: 16,
              }}
            >
              <UserSwitchOutlined />
              <h3>User Management</h3>
            </div>
            <div>
              <Menu
                mode="horizontal"
                defaultSelectedKeys={["1"]}
                style={{ marginBottom: 16, fontWeight: "bold" }}
                // className="font-bold"
              >
                <Menu.Item key="1">
                  <Link href="/admin/users">Users</Link>
                </Menu.Item>
                <Menu.Item key="2">
                  <Link href="/settings/user-registration">Registration</Link>
                </Menu.Item>
                <Menu.Item key="3">
                  <Link href="/settings/access-control">Access Control</Link>
                </Menu.Item>
                <Menu.Item key="4">
                  <Link href="/settings/role-permission">Role Permission</Link>
                </Menu.Item>
              </Menu>
            </div>
            <div>
              <Button
                type="primary"
                style={{
                  marginBottom: 16,
                  backgroundColor: "var(--maveyellow)",
                  color: "white",
                }}
                icon={<PlusCircleOutlined />}
              >
                Add Role
              </Button>
            </div>
          </div>
        </Content>
      </Layout>
    </div>
  );
};

export default UserManagementPage;
