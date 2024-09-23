import { PlusCircleOutlined, UserSwitchOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Link from "next/link";
import UserForm from "./UserForm";

export default function UsersTopbar({
  menuItems,
  active,
  setCreateUser,
  createUser,
  handleCreateUser,
  fetchUsers,
  roles,
}) {
  console.log("Roles UsersTopbar", roles);
  return (
    <div
      className="top-nav"
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 6fr 1fr",
        alignItems: "center",
        borderBottom: "4px solid #f0f0f0",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <UserSwitchOutlined
          style={{
            fontSize: 30,
            border: "1px solid #f0f0f0",
            padding: 7,
            borderRadius: 5,
          }}
        />
        <h3
          style={{
            fontSize: "1.3rem",
            fontWeight: 500,
          }}
        >
          User Management
        </h3>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 40,
            fontSize: 16,
            fontWeight: 400,
          }}
        >
          {menuItems?.map((item) => (
            <div
              style={{
                color: active === item.key ? "var(--maveyellow)" : "black",
                textDecoration: active === item.key ? "underline" : "none",
                textUnderlineOffset: 20,
              }}
            >
              <Link href={item.link} key={item.key}>
                {item.title}
              </Link>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 10,
        }}
      >
        <Button
          type="primary"
          style={{
            marginBottom: 16,
            backgroundColor: "var(--maveyellow)",
            color: "white",
          }}
          icon={<PlusCircleOutlined />}
          onClick={() => setCreateUser(true)}
          disabled={active !== "1"}
        >
          Add User
        </Button>
        {createUser && (
          <UserForm
            open={createUser}
            onCreate={handleCreateUser}
            onCancel={() => setCreateUser(false)}
            fetchUsers={fetchUsers}
            roles={roles}
          />
        )}
      </div>
    </div>
  );
}
