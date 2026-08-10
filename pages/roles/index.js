import { useState } from "react";
import { HomeOutlined } from "@ant-design/icons";
import Link from "next/link";
import { Breadcrumb, Button, Modal, Select } from "antd";
import RoleTable from "../../components/rolepermission/role/RoleTable";
import CreateRole from "../../components/rolepermission/role/CreateRole";

export default function Roles() {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  const menuItems = [
    {
      key: "roles",
      value: "roles",
      label: "Roles",
    },
    {
      key: "permissions",
      value: "permissions",
      label: <Link href="/permissions">Permissions</Link>,
    },
  ];
  return (
    <div className="mavecontainer">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Breadcrumb
          style={{ margin: "16px 0", fontWeight: "600" }}
          separator=">"
          className="mavecontainer"
          items={[
            {
              title: (
                <Link href="/">
                  <HomeOutlined />
                </Link>
              ),
            },
            // Settings
            {
              title: <Link href="/settings">Settings</Link>,
            },
            {
              title: "Roles",
              menu: {
                items: menuItems,
              },
            },
          ]}
        />
        <Button
          onClick={() => {
            setModalVisible(true);
          }}
          style={{
            color: "white",
            backgroundColor: "var(--theme)",
            borderColor: "var(--theme)",
            marginBottom: "16px",
          }}
        >
          Create Role
        </Button>
      </div>
      <RoleTable />

      <Modal
        title="Create Role"
        open={modalVisible}
        footer={null}
        onCancel={() => {
          setModalVisible(false);
        }}
        width={960}
      >
        <CreateRole />
      </Modal>
    </div>
  );
}
